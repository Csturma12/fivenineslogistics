// Recreates the two portal logins in the TARGET Supabase project, pre-confirmed,
// with the role stored in app_metadata (which is what /portal/home reads).
//
// Auth users live in the managed `auth` schema and are NOT part of the
// public-schema pg_dump (001_schema.sql / 002_data.sql). This script rebuilds them.
//
// Usage (run AFTER the new project's keys are available, BEFORE or after repoint):
//   TARGET_SUPABASE_URL="https://pzupanvsfrgudoghpjpq.supabase.co" \
//   TARGET_SERVICE_ROLE_KEY="<new project service_role key>" \
//   node migration/003_recreate_auth_users.mjs
//
// Falls back to the standard SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars,
// so once this v0 project is repointed to the new DB you can run it with no args.

import { createClient } from "@supabase/supabase-js"

const url = process.env.TARGET_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceKey = process.env.TARGET_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error("[migrate] Missing target URL or service-role key.")
  console.error("[migrate] Set TARGET_SUPABASE_URL and TARGET_SERVICE_ROLE_KEY (or SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).")
  process.exit(1)
}

// Safety guard: refuse to run against the OLD teal-zebra project by accident.
if (url.includes("gkerqkqrivrnlkoysupu")) {
  console.error("[migrate] Refusing to run: target is the OLD teal-zebra project.")
  console.error("[migrate] Point TARGET_SUPABASE_URL at the NEW project before running.")
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const users = [
  { email: "chriss@primarycompanies.com", role: "carrier", company: "Primary Companies" },
  { email: "sturma@blbxcritical.com", role: "customer", company: "BLBX Critical" },
]
const PASSWORD = "Shipping1!"

async function findByEmail(email) {
  // paginate through users and match (admin API has no direct get-by-email)
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (hit) return hit
    if (data.users.length < 200) break
  }
  return null
}

for (const u of users) {
  const meta = { role: u.role, company: u.company }
  const existing = await findByEmail(u.email)

  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      app_metadata: { ...existing.app_metadata, ...meta },
    })
    if (error) {
      console.error(`[migrate] update failed for ${u.email}:`, error.message)
      process.exitCode = 1
    } else {
      console.log(`[migrate] updated ${u.email} (${u.role})`)
    }
    continue
  }

  const { error } = await admin.auth.admin.createUser({
    email: u.email,
    password: PASSWORD,
    email_confirm: true,
    app_metadata: meta,
  })
  if (error) {
    console.error(`[migrate] create failed for ${u.email}:`, error.message)
    process.exitCode = 1
  } else {
    console.log(`[migrate] created ${u.email} (${u.role})`)
  }
}

console.log("[migrate] done.")
