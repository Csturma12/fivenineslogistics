import { createClient } from "@supabase/supabase-js"

const email = process.argv[2]
const nextPath = process.argv[3] ?? "/portal/home"

if (!email) {
  console.error("Usage: node scripts/generate-portal-link.mjs <email> [nextPath]")
  process.exit(1)
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo: "https://placeholder.local/auth/confirm" },
})

if (error || !data?.properties?.hashed_token) {
  console.error("generateLink failed:", error?.message)
  process.exit(1)
}

const tokenHash = data.properties.hashed_token
const query = `token_hash=${tokenHash}&type=magiclink&next=${encodeURIComponent(nextPath)}`

console.log(JSON.stringify({ tokenHash, query }, null, 2))
