import { createAdminClient } from "@/lib/supabase/admin"
import { createLoadsAdminClient } from "@/lib/supabase/loads-admin"

export type ShipmentStage = "uncovered" | "covered" | "in_transit" | "delivered" | "cancelled"
export type ReferenceType = "any" | "po" | "load"

export type PortalShipment = {
  id: string
  loadNumber: string
  stage: ShipmentStage
  customer: string | null
  carrier: string | null
  location: string | null
  pickup: string | null
  delivery: string | null
  origin: string
  destination: string
  weight: number | null
  po: string | null
  /** A POD exists in TAI or was uploaded by the carrier through the portal. */
  podOnFile: boolean
  uploads: { pod: number; invoice: number }
}

export type LoadDocumentKind = "pod" | "invoice"

export type ShipmentScope =
  | { kind: "all"; customer?: string }
  | { kind: "customer"; customer: string }
  | { kind: "carrier"; carriers: string[] }

export type ShipmentQuery = {
  from?: string
  to?: string
  refType: ReferenceType
  ref?: string
}

type Row = {
  id: number | string
  shipment_id: string | number | null
  status: string | null
  customer_name?: string | null
  carrier_name: string | null
  current_location: string | null
  ship_date: string | null
  delivery_date: string | null
  from_city: string | null
  from_state: string | null
  to_city: string | null
  to_state: string | null
  total_weight: number | string | null
  customer_po: string | null
  pod_document_count: number | string | null
}

// Never select buy/sell/margin — this feeds customer- and carrier-facing views.
const BASE_COLUMNS =
  "id, shipment_id, status, carrier_name, current_location, ship_date, delivery_date, from_city, from_state, to_city, to_state, total_weight, customer_po, pod_document_count"

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDate(value: string | null | undefined): value is string {
  return !!value && ISO_DATE.test(value)
}

/** Strips anything that could alter a PostgREST filter expression. */
export function cleanReference(value: string | null | undefined) {
  return (value ?? "").replace(/[^A-Za-z0-9\-_. /]/g, "").trim().slice(0, 40)
}

function stageOf(row: Row): ShipmentStage {
  switch (row.status) {
    case "Dispatched":
      return "in_transit"
    case "Delivered":
      return "delivered"
    case "Cancelled":
      return "cancelled"
    default:
      return row.carrier_name ? "covered" : "uncovered"
  }
}

const place = (city: string | null, state: string | null) =>
  [city, state].filter(Boolean).join(", ") || "—"

function toShipment(row: Row, includeCustomer: boolean): PortalShipment {
  const weight = Number(row.total_weight)
  return {
    id: String(row.id),
    loadNumber: row.shipment_id == null ? "—" : String(row.shipment_id),
    stage: stageOf(row),
    customer: includeCustomer ? row.customer_name || null : null,
    carrier: row.carrier_name || null,
    location: row.current_location || null,
    pickup: isIsoDate(row.ship_date?.slice(0, 10)) ? row.ship_date!.slice(0, 10) : null,
    delivery: isIsoDate(row.delivery_date?.slice(0, 10)) ? row.delivery_date!.slice(0, 10) : null,
    origin: place(row.from_city, row.from_state),
    destination: place(row.to_city, row.to_state),
    weight: Number.isFinite(weight) && weight > 0 ? weight : null,
    po: row.customer_po || null,
    podOnFile: Number(row.pod_document_count) > 0,
    uploads: { pod: 0, invoice: 0 },
  }
}

/** Merges carrier-uploaded POD/invoice counts from the portal database. */
export async function attachLoadDocuments(shipments: PortalShipment[]) {
  const numbers = [...new Set(shipments.map((s) => s.loadNumber).filter((n) => n !== "—"))]
  if (!numbers.length) return shipments
  const counts = new Map<string, { pod: number; invoice: number }>()
  const db = createAdminClient()
  for (let i = 0; i < numbers.length; i += 200) {
    const { data, error } = await db
      .from("fn_load_documents")
      .select("load_number, kind")
      .in("load_number", numbers.slice(i, i + 200))
    if (error) throw new Error(error.message)
    for (const row of (data ?? []) as { load_number: string; kind: LoadDocumentKind }[]) {
      const entry = counts.get(row.load_number) ?? { pod: 0, invoice: 0 }
      entry[row.kind] += 1
      counts.set(row.load_number, entry)
    }
  }
  for (const s of shipments) {
    const entry = counts.get(s.loadNumber)
    if (!entry) continue
    s.uploads = entry
    if (entry.pod > 0) s.podOnFile = true
  }
  return shipments
}

/** True only when the load is assigned to a carrier record matching this login email. */
export async function carrierOwnsLoad(email: string, loadNumber: string) {
  const carriers = await carrierNamesForEmail(email)
  if (!carriers.length) return false
  const { count, error } = await createLoadsAdminClient()
    .from("shipments")
    .select("id", { count: "exact", head: true })
    .eq("shipment_id", loadNumber)
    .in("carrier_name", carriers)
  if (error) throw new Error(error.message)
  return (count ?? 0) > 0
}

export async function queryShipments(scope: ShipmentScope, query: ShipmentQuery) {
  const includeCustomer = scope.kind !== "carrier"
  const columns = includeCustomer ? `${BASE_COLUMNS}, customer_name` : BASE_COLUMNS
  let q = createLoadsAdminClient()
    .from("shipments")
    .select(columns)
    .order("ship_date", { ascending: false })
    .limit(1000)

  if (scope.kind === "customer") q = q.eq("customer_name", scope.customer)
  if (scope.kind === "all" && scope.customer) q = q.eq("customer_name", scope.customer)
  if (scope.kind === "carrier") q = q.in("carrier_name", scope.carriers)
  if (isIsoDate(query.from)) q = q.gte("ship_date", query.from)
  if (isIsoDate(query.to)) q = q.lte("ship_date", query.to)

  const ref = cleanReference(query.ref)
  if (ref) {
    if (query.refType === "po") q = q.ilike("customer_po", `%${ref}%`)
    else if (query.refType === "load") q = q.ilike("shipment_id", `%${ref}%`)
    else
      q = q.or(
        `customer_po.ilike.*${ref}*,shipment_id.ilike.*${ref}*,shipper_reference.ilike.*${ref}*`,
      )
  }

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return ((data ?? []) as unknown as Row[]).map((row) => toShipment(row, includeCustomer))
}

export async function listCustomerNames() {
  const { data, error } = await createLoadsAdminClient()
    .from("customers")
    .select("name")
    .order("name")
    .limit(1000)
  if (error) throw new Error(error.message)
  return [
    ...new Set((data ?? []).map((c: { name: string | null }) => c.name?.trim()).filter(Boolean)),
  ] as string[]
}

/**
 * A customer's verified TAI account ID resolves to a `customers.id` when numeric,
 * otherwise it is treated as the exact customer name TAI writes on shipments.
 */
export async function resolveCustomerName(accountId: string) {
  const id = accountId.trim()
  if (!id) return null
  if (!/^\d+$/.test(id)) return id
  const { data, error } = await createLoadsAdminClient()
    .from("customers")
    .select("name")
    .eq("id", Number(id))
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as { name: string | null } | null)?.name?.trim() || null
}

export async function carrierNamesForEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return []
  const { data, error } = await createLoadsAdminClient()
    .from("carriers")
    .select("name")
    .ilike("email", normalized)
  if (error) throw new Error(error.message)
  return (data ?? [])
    .map((c: { name: string | null }) => c.name)
    .filter((n): n is string => Boolean(n))
}
