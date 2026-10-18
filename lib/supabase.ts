import { createClient } from "@supabase/supabase-js"

// Public (anon-key) Supabase client used by the Request Capacity drawer and
// the Control Tower Portal load board. RLS policies in
// supabase/migrations/001_fivenines_portal_rls.sql govern everything it can see.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("YOUR_PROJECT"),
)

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

export type UserRole = "shipper" | "carrier" | "admin"

export type LoadStatus = "quoted" | "committed" | "dispatched" | "in_transit" | "delivered"

export interface ProfileRecord {
  id: string
  email: string
  company_name: string
  role: UserRole
  mc_number?: string | null
  created_at?: string
}

export interface LoadRecord {
  id: string
  reference_number: string
  po_number?: string
  shipper_id?: string
  assigned_carrier_id?: string
  origin_city: string
  origin_state: string
  origin_zip?: string
  dest_city: string
  dest_state: string
  dest_zip?: string
  pickup_window: string
  delivery_window: string
  constraint_type?: string
  equipment_type: string
  weight_lbs: number
  dimensions?: string
  commodity: string
  site_requirements: string[]
  status: LoadStatus
  shipper_rate_usd?: number | null
  carrier_offer_usd?: number | null
  current_location?: string | null
  eta_status?: string | null
  securement_photo_url?: string | null
  bol_pod_url?: string | null
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  created_at?: string
}

/** Fields the public quote drawer is allowed to write. Status is always 'quoted'. */
export type LoadInsert = Omit<LoadRecord, "id" | "status" | "created_at"> & { status: "quoted" }

export interface LoadBidRecord {
  id: string
  load_id: string
  carrier_id: string
  bid_amount_usd: number
  truck_location: string
  notes?: string | null
  created_at?: string
}

/** Human-readable board reference, e.g. 5N-4821. */
export function newLoadReference(): string {
  return `5N-${Math.floor(1000 + Math.random() * 9000)}`
}

/** Splits "Houston, TX" into city/state with sane fallbacks for free-text input. */
export function splitCityState(value: string, fallbackState: string): { city: string; state: string } {
  const [city = "", ...rest] = value.split(",")
  const state = rest.join(",").trim() || fallbackState
  return {
    city: city.trim() || value.trim(),
    state: state.length <= 3 ? state.toUpperCase() : state,
  }
}
