import "server-only"
import { createClient } from "@supabase/supabase-js"

/**
 * Service-role client for the main freight database (TAI-synced shipments).
 * Separate from the portal/auth project; server-side only because it bypasses RLS.
 */
export function createLoadsAdminClient() {
  const url = process.env.LOADS_SUPABASE_URL
  const key = process.env.LOADS_SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("LOADS_SUPABASE_URL and LOADS_SUPABASE_SERVICE_ROLE_KEY must be set")
  }
  return createClient(url.replace(/\/+$/, ""), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
