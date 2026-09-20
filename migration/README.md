# Supabase migration: teal-zebra → new pro-org project

Move this site's database from the current Supabase project to the new one.

| | Project ref | Host |
|---|---|---|
| **FROM (current)** | `gkerqkqrivrnlkoysupu` | `gkerqkqrivrnlkoysupu.supabase.co` (teal-zebra) |
| **TO (new)** | `pzupanvsfrgudoghpjpq` | `pzupanvsfrgudoghpjpq.supabase.co` (pro org) |

> **GPT is running the actual migration.** These files are a reviewable, self-contained backup so nothing gets lost. If GPT's migration already covers a step, this is your cross-check — not a second migration to run on top.

## What's in this folder

| File | What it is | Where to run it |
|---|---|---|
| `001_schema.sql` | Full `public` schema dump from teal-zebra — 13 tables, 7 functions, 1 trigger, RLS flags, sequences, constraints, FKs. Generated with `pg_dump 17`. | Against the **new** project |
| `002_data.sql` | Data-only dump (`--column-inserts`). Only real rows are 2 in `portal_access_requests`; every other table is empty. | Against the **new** project, after `001` |
| `003_recreate_auth_users.mjs` | Recreates the two portal logins (they live in the managed `auth` schema, so they are **not** in the SQL dumps). Pre-confirmed, roles in `app_metadata`. | Node, pointed at the **new** project |

## The one step that's easy to miss

**"Connected in the Supabase site" is not the same as this v0/Vercel project reading the new DB.**

The site reads `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, the `POSTGRES_*` URLs, etc. Those are injected by the connected Supabase integration, which today resolves to **teal-zebra**. Until the integration for **this** project is repointed to `pzupanvsfrgudoghpjpq` (v0 → Settings → Integrations, or the Vercel project's Supabase integration), the live site keeps reading/writing teal-zebra no matter what has been migrated.

## Safe order (never repoint first)

1. **Freeze the schema.** Only migrate once GPT is done changing teal-zebra — otherwise the dump is a moving target. Re-dump if the schema changes after these files were generated (see "Re-dumping" below).
2. **Load schema into the new project** — run `001_schema.sql`.
3. **Load data** — run `002_data.sql`.
4. **Recreate the two logins** — run `003_recreate_auth_users.mjs` against the new project (see below). Order matters: `fn_profiles.user_id` has an FK to `auth.users(id)`, so auth users must exist before any `fn_profiles` rows are added. (None exist yet, so today either order works.)
5. **Repoint the integration** to the new project (the step above).
6. **Verify before calling it done:**
   - Sign in from the top-bar "Sign in" → both doors
   - Carrier: `chriss@primarycompanies.com` / `Shipping1!` → carrier dashboard
   - Customer: `sturma@blbxcritical.com` / `Shipping1!` → customer dashboard
   - Public shipment tracking still resolves
   - Portal access-request submit still writes

## Running the auth-user script

```bash
TARGET_SUPABASE_URL="https://pzupanvsfrgudoghpjpq.supabase.co" \
TARGET_SERVICE_ROLE_KEY="<new project service_role key>" \
node migration/003_recreate_auth_users.mjs
```

It refuses to run against teal-zebra as a safety guard, and it upserts (safe to re-run). After the integration is repointed you can run it with no args — it falls back to the standard `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.

## Re-dumping (if teal-zebra changes again)

Requires `pg_dump` **17** (server is PG 17.6). From the project root:

```bash
set -a && source /vercel/share/.env.project && set +a
pg_dump "$POSTGRES_URL_NON_POOLING" --schema=public --schema-only --no-owner --no-privileges -f migration/001_schema.sql
pg_dump "$POSTGRES_URL_NON_POOLING" --schema=public --data-only  --no-owner --no-privileges --column-inserts -f migration/002_data.sql
```

## Notes / gotchas

- **RLS with no policies is intentional.** RLS is enabled on the tables but there are zero policies — the app reaches these tables through the service-role key, which bypasses RLS. The schema dump preserves the enable flags. Do not "fix" this by adding open policies.
- **`auth` schema is managed by Supabase.** Never dump/restore it. The new project already has its own `auth` schema; use `003_...` to recreate users through the admin API.
- **Storage buckets / edge functions**, if the portals use any, are also not in a `public`-schema dump — check with GPT whether the portal work added any.
- The dumps were generated while GPT was actively building the `fn_*` portal tables. Treat them as a point-in-time snapshot and re-dump if in doubt.
