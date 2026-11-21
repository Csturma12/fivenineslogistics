// Creates username-based customer portal logins from a CSV (first column = company).
// Usage: node --env-file-if-exists=/vercel/share/.env.project scripts/create-customer-logins.mjs <in.csv> <out.csv>
// The output file contains passwords: keep it out of the repository.
import { readFileSync, writeFileSync } from "node:fs"
import { randomInt } from "node:crypto"
const DOMAIN = "portal.fivenineslogistics.com"
const [inPath, outPath] = process.argv.slice(2)
if (!inPath || !outPath) throw new Error("Usage: create-customer-logins.mjs <in.csv> <out.csv>")

const base = `${process.env.SUPABASE_URL}/auth/v1/admin/users`
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

async function admin(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  return res.ok ? { data } : { error: { message: data.msg || data.message || `HTTP ${res.status}` } }
}

function parseCsvLine(line) {
  const cells = []
  let cur = ""
  let quoted = false
  for (const ch of line) {
    if (ch === '"') quoted = !quoted
    else if (ch === "," && !quoted) {
      cells.push(cur)
      cur = ""
    } else cur += ch
  }
  cells.push(cur)
  return cells
}

function usernameFor(company) {
  const words = company
    .replace(/JT Thorpe & Sons/i, "Thorpe")
    .replace(/C\/O.*$/i, "")
    .replace(/\b(LLC|Inc|Ltd|Ind|Co|Services?|Products|Unlimited|International)\b\.?/gi, "")
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  return words.slice(0, 3).join("") || "customer"
}

const csv = (value) => (/[",]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

const { data: page, error: listErr } = await admin("GET", "?page=1&per_page=1000")
if (listErr) throw new Error(listErr.message)
const existing = new Map(page.users.map((u) => [u.email?.toLowerCase(), u.id]))

const rows = readFileSync(inPath, "utf8").trim().split(/\r?\n/).slice(1).map(parseCsvLine)
const used = new Set()
const out = ["Company,Username,Password,Highlighted,Status"]

for (const [company, , highlighted] of rows) {
  let username = usernameFor(company)
  for (let n = 2; used.has(username); n++) username = `${usernameFor(company)}${n}`
  used.add(username)

  const email = `${username}@${DOMAIN}`
  const password = `Shipping${randomInt(1000, 10000)}`
  const app_metadata = { role: "customer", company }

  const id = existing.get(email)
  const { error } = id
    ? await admin("PUT", `/${id}`, { password, app_metadata, email_confirm: true })
    : await admin("POST", "", { email, password, email_confirm: true, app_metadata })

  out.push([company, username, password, highlighted || "", error ? `ERROR: ${error.message}` : id ? "updated" : "created"].map(csv).join(","))
  console.log(`${error ? "FAIL" : "ok  "} ${username}`)
}

writeFileSync(outPath, out.join("\n") + "\n")
