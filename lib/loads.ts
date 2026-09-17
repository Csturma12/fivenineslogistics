import { createAdminClient } from "@/lib/supabase/admin"

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

const LOAD_COLUMNS =
  "id, external_id, reference, status, origin_city, origin_state, dest_city, dest_state, pickup_date, delivery_date, equipment, mode, weight_lbs, commodity, distance_mi, rate_usd, stops, notes, booked_by_email, booked_by_company, booked_at, posted_at, updated_at"

/** Available loads for the public + carrier boards, newest posted first. */
export async function getAvailableLoads(): Promise<Load[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("loads")
    .select(LOAD_COLUMNS)
    .eq("status", "available")
    .order("posted_at", { ascending: false })

  if (error) {
    console.error("[v0] getAvailableLoads error:", error.message)
    return []
  }
  return (data ?? []) as Load[]
}

/** Loads a specific carrier has booked, most recent first. */
export async function getLoadsBookedBy(email: string): Promise<Load[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("loads")
    .select(LOAD_COLUMNS)
    .eq("booked_by_email", email)
    .in("status", ["booked", "in_transit", "delivered"])
    .order("booked_at", { ascending: false })

  if (error) {
    console.error("[v0] getLoadsBookedBy error:", error.message)
    return []
  }
  return (data ?? []) as Load[]
}
