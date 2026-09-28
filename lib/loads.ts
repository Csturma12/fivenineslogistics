import { createLoadsAdminClient } from "@/lib/supabase/loads-admin"

export type LoadStatus = "available" | "booked" | "in_transit" | "delivered" | "cancelled"

export type Load = {
  id: string
  external_id: string | null
  reference: string | null
  status: LoadStatus
  origin_city: string | null
  origin_state: string | null
  dest_city: string | null
  dest_state: string | null
  pickup_date: string | null
  delivery_date: string | null
  equipment: string | null
  mode: string | null
  weight_lbs: number | null
  commodity: string | null
  distance_mi: number | null
  rate_usd: number | null
  stops: number | null
  notes: string | null
  booked_by_email: string | null
  booked_by_company: string | null
  booked_at: string | null
  posted_at: string
  updated_at: string
}

type ShipmentRow = {
  id: string | number
  shipment_id: string | number | null
  status: string | null
  carrier_name: string | null
  from_city: string | null
  from_state: string | null
  to_city: string | null
  to_state: string | null
  ship_date: string | null
  delivery_date: string | null
  equipment_type: string | null
  total_weight: number | string | null
  buy: number | string | null
  created_at: string | null
  updated_at: string | null
}

// Carrier-safe columns only: customer, sell, and margin must never reach the board.
const SHIPMENT_COLUMNS =
  "id, shipment_id, status, carrier_name, from_city, from_state, to_city, to_state, ship_date, delivery_date, equipment_type, total_weight, buy, created_at, updated_at"

const OPEN_STATUSES = ["Committed", "Quote"]

function toNumber(value: number | string | null): number | null {
  if (value === null || value === "") return null
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

function mapStatus(row: ShipmentRow): LoadStatus {
  switch (row.status) {
    case "Dispatched":
      return "in_transit"
    case "Delivered":
      return "delivered"
    case "Cancelled":
      return "cancelled"
    default:
      return row.carrier_name ? "booked" : "available"
  }
}

function toLoad(row: ShipmentRow): Load {
  const reference = row.shipment_id === null ? null : String(row.shipment_id)
  const updated = row.updated_at ?? row.created_at ?? new Date().toISOString()
  return {
    id: String(row.id),
    external_id: reference,
    reference,
    status: mapStatus(row),
    origin_city: row.from_city,
    origin_state: row.from_state,
    dest_city: row.to_city,
    dest_state: row.to_state,
    pickup_date: row.ship_date,
    delivery_date: row.delivery_date,
    equipment: row.equipment_type,
    mode: "FTL",
    weight_lbs: toNumber(row.total_weight),
    commodity: null,
    distance_mi: null,
    rate_usd: toNumber(row.buy),
    stops: null,
    notes: null,
    booked_by_email: null,
    booked_by_company: row.carrier_name,
    booked_at: row.carrier_name ? updated : null,
    posted_at: row.created_at ?? updated,
    updated_at: updated,
  }
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

/** Open, uncovered shipments from the main freight DB, soonest pickup first. */
export async function getAvailableLoads(): Promise<Load[]> {
  try {
    const supabase = createLoadsAdminClient()
    const { data, error } = await supabase
      .from("shipments")
      .select(SHIPMENT_COLUMNS)
      .in("status", OPEN_STATUSES)
      // TAI writes uncovered shipments with an empty carrier string rather than null.
      .or("carrier_name.is.null,carrier_name.eq.")
      .gte("ship_date", todayIso())
      .order("ship_date", { ascending: true })
      .limit(200)

    if (error) {
      console.error("getAvailableLoads error:", error.message)
      return []
    }
    return ((data ?? []) as ShipmentRow[]).map(toLoad)
  } catch (err) {
    console.error("getAvailableLoads failed:", err instanceof Error ? err.message : err)
    return []
  }
}

/** Shipments covered by the carrier whose contact email matches, most recent first. */
export async function getLoadsBookedBy(email: string): Promise<Load[]> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return []
  try {
    const supabase = createLoadsAdminClient()
    const { data: carriers, error: carrierError } = await supabase
      .from("carriers")
      .select("name")
      .ilike("email", normalized)

    if (carrierError) {
      console.error("getLoadsBookedBy carrier lookup error:", carrierError.message)
      return []
    }
    const names = (carriers ?? [])
      .map((c: { name: string | null }) => c.name)
      .filter((n): n is string => Boolean(n))
    if (names.length === 0) return []

    const { data, error } = await supabase
      .from("shipments")
      .select(SHIPMENT_COLUMNS)
      .in("carrier_name", names)
      .in("status", ["Committed", "Dispatched", "Delivered"])
      .order("ship_date", { ascending: false })
      .limit(100)

    if (error) {
      console.error("getLoadsBookedBy error:", error.message)
      return []
    }
    return ((data ?? []) as ShipmentRow[]).map(toLoad)
  } catch (err) {
    console.error("getLoadsBookedBy failed:", err instanceof Error ? err.message : err)
    return []
  }
}
