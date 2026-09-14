import { createClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client for trusted server-side work only.
 * Never import this into client components — it bypasses RLS.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  )
}
