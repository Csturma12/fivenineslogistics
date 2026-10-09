// Fills blank carrier contact fields in the loads Supabase `carriers` table from TAI.
// Never overwrites a non-empty value. Dry run by default; pass --apply to write.
//
//   node --env-file-if-exists=/vercel/share/.env.project scripts/backfill-carrier-contacts.mjs [--apply]

const APPLY = process.argv.includes("--apply")
const SB_URL = process.env.LOADS_SUPABASE_URL
const SB_KEY = process.env.LOADS_SUPABASE_SERVICE_ROLE_KEY
const TAI_BASE = (process.env.TAI_BASE_URL || "https://primaryfreightllc.taicloud.net").replace(/\/$/, "")
const TAI_KEY = (process.env.TAI_API_KEY || "").trim().replace(/^["']|["']$/g, "")
if (!SB_URL || !SB_KEY || !TAI_KEY) throw new Error("Missing LOADS_SUPABASE_URL, LOADS_SUPABASE_SERVICE_ROLE_KEY or TAI_API_KEY")

const sbHeaders = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const blank = (v) => v === null || v === undefined || String(v).trim() === ""

async function tai(path) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(TAI_BASE + path, { headers: { "x-api-key": TAI_KEY, Accept: "application/json" } })
    if (res.status === 429 || res.status >= 500) { await sleep(1000 * 2 ** attempt); continue }
    if (!res.ok) return null
    const body = await res.json().catch(() => null)
    return Array.isArray(body) ? body[0] ?? null : body
  }
  return null
}

async function fetchAll(table, select, query = "") {
  const rows = []
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?select=${select}${query}`, {
      headers: { ...sbHeaders, Range: `${from}-${from + 999}` },
    })
    const page = await res.json()
    rows.push(...page)
    if (page.length < 1000) return rows
  }
}

const CONTACT_PRIORITY = ["Dispatcher", "Dispatch", "Other", "Accounting"]
function pickContact(contacts = []) {
  const withEmail = contacts.filter((c) => !blank(c.email))
  for (const type of CONTACT_PRIORITY) {
    const hit = withEmail.find((c) => (c.contactType || "").toLowerCase() === type.toLowerCase())
    if (hit) return hit
  }
  return withEmail[0] ?? contacts.find((c) => !blank(c.phone)) ?? null
}

function patchFrom(carrier, lsp) {
  const info = lsp.carrierMasterInfo || {}
  const contact = pickContact(lsp.lspCarrierContacts)
  const proposed = {
    email: contact?.email || lsp.remitPaymentAddress?.email || "",
    contact_name: contact?.contactName || "",
    phone: contact?.phone || info.phone || "",
    dot_number: info.dotNumber || "",
    mc_number: info.motorCarrierNumber || "",
    tai_carrier_master_id: lsp.masterCarrierId ?? null,
  }
  const patch = {}
  for (const [col, val] of Object.entries(proposed)) {
    if (!blank(val) && blank(carrier[col])) patch[col] = col === "email" ? String(val).trim().toLowerCase() : val
  }
  return patch
}

async function lookupCarrier(carrier, shipmentByName) {
  if (carrier.tai_carrier_master_id) {
    const lsp = await tai(`/PublicApi/Carriers/v2/Carriers/Master/${carrier.tai_carrier_master_id}`)
    if (lsp) return lsp
  }
  if (!blank(carrier.dot_number)) {
    const lsp = await tai(`/PublicApi/Carriers/v2/Carriers/Dot/${encodeURIComponent(carrier.dot_number)}`)
    if (lsp) return lsp
  }
  const shipmentId = shipmentByName.get((carrier.name || "").trim().toUpperCase())
  if (!shipmentId) return null
  const shipment = await tai(`/PublicApi/Shipping/v2/Shipments/${shipmentId}`)
  const match = (shipment?.carrierList || []).find(
    (c) => (c.name || "").trim().toUpperCase() === carrier.name.trim().toUpperCase(),
  )
  if (!match?.carrierMasterId) return null
  return tai(`/PublicApi/Carriers/v2/Carriers/Master/${match.carrierMasterId}`)
}

const carriers = await fetchAll("carriers", "id,name,email,contact_name,phone,dot_number,mc_number,tai_carrier_master_id", "&order=id")
const shipments = await fetchAll("shipments", "shipment_id,carrier_name", "&carrier_name=neq.&order=id.desc")
const shipmentByName = new Map()
for (const s of shipments) {
  const key = (s.carrier_name || "").trim().toUpperCase()
  if (key && s.shipment_id && !shipmentByName.has(key)) shipmentByName.set(key, s.shipment_id)
}

const candidates = carriers.filter(
  (c) => blank(c.email) && (c.tai_carrier_master_id || !blank(c.dot_number) || shipmentByName.has((c.name || "").trim().toUpperCase())),
)
console.log(`carriers=${carriers.length} missingEmail=${carriers.filter((c) => blank(c.email)).length} matchable=${candidates.length} mode=${APPLY ? "APPLY" : "DRY RUN"}`)

const stats = { updated: 0, gotEmail: 0, notFound: 0, nothingNew: 0, failed: 0 }
const CONCURRENCY = 4
let cursor = 0
async function worker() {
  while (cursor < candidates.length) {
    const carrier = candidates[cursor++]
    if (cursor % 50 === 0) console.log(`progress ${cursor}/${candidates.length} ${JSON.stringify(stats)}`)
    try {
      const lsp = await lookupCarrier(carrier, shipmentByName)
      if (!lsp) { stats.notFound++; continue }
      const patch = patchFrom(carrier, lsp)
      if (!Object.keys(patch).length) { stats.nothingNew++; continue }
      if (patch.email) stats.gotEmail++
      if (APPLY) {
        const res = await fetch(`${SB_URL}/rest/v1/carriers?id=eq.${carrier.id}`, {
          method: "PATCH", headers: { ...sbHeaders, Prefer: "return=minimal" }, body: JSON.stringify(patch),
        })
        if (!res.ok) { stats.failed++; console.error(`update ${carrier.id} failed: ${res.status} ${await res.text()}`); continue }
      }
      stats.updated++
    } catch (err) {
      stats.failed++
      console.error(`carrier ${carrier.id}: ${err.message}`)
    }
    await sleep(150)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))
console.log(JSON.stringify(stats))
