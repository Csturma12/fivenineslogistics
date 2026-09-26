# Five Nines portal handoff — September 20, 2026

> Historical implementation notes. See `carrier-portal-release.md` for the current branch, environment boundaries, verification and activation checklist.

## Current state

**Migration update:** the owner selected replacement website project `pzupanvsfrgudoghpjpq`.
Its schema/private bucket have been copied, but accounts/data and live configuration have
NOT moved. The original project must remain intact. See `website-migration-status.md`
for verified status and access blockers before making any deployment or deletion decision.

Website source: `Csturma12/fivenineslogistics`, based on `e48d421`.
Local checkout: `C:/Users/chris/primary-freight-dashboard/work/website-portal`.
No commits, pushes, website deployments, TAI writes, test emails or real bookings were made.
The separate Primary Freight/Fly application was not changed in this implementation.

With explicit owner approval, migration `20260920135548_five_nines_private_portal_workflows`
was applied to the **website** Supabase project `gkerqkqrivrnlkoysupu` (supabase-teal-zebra).
It created eight `fn_*` tables, six service-only procedures and the private
`fn-private-documents` bucket. All eight tables have RLS enabled and no browser-role
SELECT grants. Documents are private, limited to 3 MB PDF/JPEG/PNG, and downloaded
through authenticated, ownership-checked, one-minute attachment URLs.
No existing loads, shipment records, account approvals or passwords were altered.

The existing website `loads` and `shipments` tables both contained **zero rows** at inspection.
The new database is ready for the application; it is not evidence that TAI synchronization is running.

## Changes to review as one website release

### Follow-up: internal carrier summary email (local only)

The owner's existing Resend integration is reused. `lib/portal-notification.ts` renders
internal bid and draft-booking summaries, with carrier/contact/MC/DOT, approval/insurance,
lane/dates/equipment/weight/dimensions, submission reference, notes, and the submitted or
accepted carrier buy amount. Missing fields read "Not provided". No customer sell rate,
tax/banking details, documents, or signed document links are included. Emails state that
they are not rate confirmations or authority to dispatch.

`fn_bid_action` now snapshots this allowlisted information atomically into the existing
notification outbox. Accepted bids use the bidding carrier, not the staff actor. Retries
use the same stored snapshot and existing Resend idempotency key, not a second alert.
Old plain-text events remain supported; misrouted internal summaries fail closed.

**This follow-up is NOT applied to the live database or website.** The previously applied
migration predates it. Before release, deploy the renderer first, then apply the updated
`fn_bid_action` definition from `scripts/portal-workflows.sql` to the approved WEBSITE
database with existing service-only grants preserved. Do not rerun unrelated schema changes
or apply this to the Primary Freight database. Test real delivery only with owner approval.
The internal review link still points at the website prototype `/agent-desk`; replace it
with the verified Fly dashboard inbox URL when that bridge is implemented.

The TAI source field for the carrier offer remains unverified. No sell-rate fallback was
added. All Five Nines Shadow Ledger customers define customer scope; mapping to exact TAI
identities remains required before shipment access. Resend integration is owner-reported
as already live; this follow-up does not claim a new end-to-end delivery test.

| Group | What changed | Main files |
| --- | --- | --- |
| Portal screens | Setup/profile, packet uploads, Highway invitation fallback, safe carrier board, bids/counters, customer shipment board, company documents and requests | `components/portal/workspace*.tsx`, `carrier-board.tsx`, `app/portal/home/page.tsx` |
| Agent desk | Profile/document review, exact customer-account mapping, accept/deny/counter, reservation inbox, customer requests, company uploads, pending-email visibility | `app/agent-desk/page.tsx`, `components/portal/workspace-desk.tsx` |
| Protected backend | Server-verified identity, verified exact `@shipfivenines.com` staff domain, private files, approved-carrier checks, ownership isolation, validated inputs | `app/api/portal/workspace/route.ts`, `documents/route.ts`, `lib/portal-contract.ts`, `portal-service.ts`, `portal-access-policy.ts` |
| Database | Approval state, bids, exclusive reservations, requests, durable email outbox, safe feed upsert | `scripts/portal-workflows.sql` (already applied) |
| TAI feed interface | Explicit status, dimensions, freshness, customer account ID, separate opt-in carrier offer; preserves reservations and rejects older snapshots | `app/api/tms/loads/route.ts`, `lib/portal-ingest.ts` |
| Close old bypasses | Public load page redirects to carrier login; signup-only legacy booking action cannot book | `app/loads/page.tsx`, `app/actions/book-load.ts` |
| Login copy/build safety | Accurate setup language, lazy email initialization, type errors no longer ignored, private config/artifact ignore rules | portal entry pages, `portal-access.tsx`, `portal-mail.ts`, legacy access route, `next.config.mjs`, `.gitignore` |
| Verification | Local Postgres workflow tests, read-only development preview, test scripts/dependencies | `tests/`, `app/portal/preview/page.tsx`, `package.json`, pnpm files |

Do not cherry-pick only the UI: the routes, schema and UI must be released together.
The development preview returns 404 outside development and never bypasses API authentication.

## What each workflow actually does

- Signup is **not approval**. Carrier documents, profile completion, current insurance and
  staff-recorded Highway verification are required before viewing/bidding/booking.
  Profile changes or document uploads invalidate approval. Suspended users cannot self-reactivate.
- Carriers never receive customer names, customer account IDs, sell rates, internal notes
  or TAI identifiers. A carrier offer is visible only on loads explicitly enabled for auto-book.
- Bids can be accepted, denied or countered by staff. Only the bidding carrier can accept
  a counteroffer. Version checks prevent accepting an outdated bid/counter.
- Auto-book/accepted bids create an exclusive **awaiting-dispatch reservation** in the website
  agent desk. They do **not** assign a carrier in TAI, promise a rate confirmation, or dispatch a truck.
  The existing Fly writeback worker remains the only TAI writeback consumer.
- Customers can submit load/project requests immediately; these are dispatch requests, not
  automatic TAI shipment creation. Shipment visibility and POD/invoice requests require a
  staff-verified exact customer-account mapping. No email-domain or company-name fuzzy matching.
- Tracking shows a reported location and timestamp, not a live GPS map or tracking-provider link.
- Notifications go to `sturma@blbxcritical.com`, with carrier response/reservation updates going
  to that carrier. The outbox survives provider failures and retries after later actions or the
  desk retry button. There is no scheduled retry worker yet. Items older than 23 hours remain
  visible for manual follow-up to avoid sending duplicates after provider idempotency expires.

## Required before launch

1. Configure the website deployment to use the approved website Supabase project and its
   existing server-only credential. Do not use the Primary Freight project or expose the service credential.
2. Keep the existing Supabase/Resend configuration in the hosting secret settings.
   Agent-desk access requires a signed-in, email-confirmed, non-anonymous Supabase user
   whose actual email has the exact `shipfivenines.com` domain. The server checks this
   before rendering `/agent-desk`, and the same policy protects staff data/actions.
   `PORTAL_STAFF_EMAILS` is no longer used; profile roles and editable metadata do not
   grant staff access. Staff create an account or sign in at `/agent-desk`; staff signup
   accepts only the company domain and emails a confirmation link before access opens.
   Other portal users retain their customer/carrier access and ownership restrictions.
   Staff password recovery returns to the desk. Auth confirmation/callback redirects
   accept only the app destinations in `lib/portal-auth-routing.ts`.
   Carriers currently request Highway setup by emailing `onboarding@shipfivenines.com`
   from the checklist, verification panel or blocked load board. The mailto action
   opens a draft; it does not send or change verification/approval. Optional
   `HIGHWAY_SETUP_URL` still accepts only HTTPS Highway domains and remains in the
   API/config for later use. The UI temporarily hides that link so email is the only
   Highway setup action. Dispatch must still record verification before approval.
3. Connect an authenticated upstream feed to `POST /api/tms/loads` using the existing
   server-side `TMS_INGEST_TOKEN`. This is a **new payload contract**, not an automatic connection.
   Do not rotate any TAI credentials. Map real data from the approved TAI integration.
4. Confirm the exact TAI carrier-offer source and availability/status mapping. Never map
   customer sell price or an ambiguous legacy `rate_usd` into `carrier_offer_usd`.
5. Upload the actual company documents; complete carrier packets and Highway verification.
   Map each approved customer to the correct upstream customer account ID.
6. Use a protected preview deployment to verify real auth → upload → database → email → desk,
   and a disposable test load for bidding/counter/reservation. These full live workflows have
   not been exercised because the new application has not been deployed/configured.
7. Only then approve the website push/deployment. The original user asked to review push groups.

## Feed contract

Send one JSON object or an array of 1–100 objects. All rows in a batch need unique external IDs.

```json
{
  "external_id": "TAI-SHIPMENT-ID",
  "customer_account_id": "EXACT-TAI-CUSTOMER-ID",
  "status": "available",
  "origin_city": "Houston",
  "origin_state": "TX",
  "dest_city": "Dallas",
  "dest_state": "TX",
  "pickup_date": "2026-09-23",
  "delivery_date": "2026-09-24",
  "equipment": "Flatbed",
  "weight_lbs": 42000,
  "dimensions": "40 x 8 x 8 ft",
  "auto_book": false,
  "carrier_offer_usd": null,
  "tracking_location": null,
  "tracking_at": null,
  "observed_at": "2026-09-20T14:00:00Z"
}
```

Statuses: `available`, `booked`, `in_transit`, `delivered`, `cancelled`.
`observed_at` must describe the real upstream snapshot, not a fabricated refresh time.
Re-send currently available loads regularly, including unavailable/cancelled state changes.
Loads with observations older than 24 hours or past pickup dates cannot be bid/booked.
Omitted loads age out; ingestion never deletes records. Customer matching stays server-only.
Dimensions are optional and require upstream extraction with units when TAI supplies them.
Only a positive, explicit carrier offer plus `auto_book: true` enables reservation at that rate.

## Verification evidence and limitations

- Agent-desk access: run `pnpm test` for policy/routing regressions and
  `pnpm test:access` for a production build plus HTTP page/API checks against an
  isolated synthetic auth/data server. The build and server receive the same
  synthetic endpoint. A preload blocks non-local fetch/HTTP/HTTPS requests;
  this is an HTTP test guard, not a system-wide network firewall. The checks
  assert that denied staff requests never reach the data layer.
  They also cover staff recovery routing and confirmation/callback redirects;
  they do not send email or verify hosted mail delivery.
  `pnpm test:access:webpack` is the explicit Windows fallback if the default
  Turbopack build hits the previously observed OS permission error.
- TypeScript check passed.
- 16 local PGlite/Postgres and validation tests passed: carrier summary snapshots/rendering,
  recipient and sensitive-field protection, permission boundaries, private projection,
  incomplete/expired approval, exclusive booking, counter consent/versioning, customer request
  ownership, stale loads, and ingestion preservation. PGlite uses one connection; this does
  not substitute for a multi-session production concurrency/load test.
- Production build passed in supported Webpack mode. Default Turbopack failed on this Windows
  machine with an OS process-permission error; an earlier sandbox run could not download fonts.
  Existing middleware deprecation remains a non-blocking warning.
- Existing live customer and carrier logins both verified. Customer session restored.
  No passwords were saved in repository files.
- Production runtime check confirmed the sample preview returns 404 without sample data;
  an unconfigured private workspace returns 503 rather than exposing data.
- Carrier setup, carrier board/confirmation, customer board and local navigation were inspected
  in the browser with labeled sample data. This is UI evidence, not live integration evidence.
- Supabase advisory: no-policy INFO notices are expected for these intentional service-only
  tables ([RLS linter](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)).
  Existing warnings remain for the legacy `set_loads_updated_at` search path
  ([guidance](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable))
  and disabled leaked-password protection
  ([guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)).
  No account security settings were silently changed. Change the shared test passwords before launch.

## Unrelated uncommitted work held out

The parent Primary Freight repository was already dirty and was not part of this website release:

- Staff/session authentication and sign-in changes in `freight-dashboard/client/src/auth/`,
  `main.tsx`, `queryClient.ts`, portal auth/sign-in files, server auth and the auth-boundary test.
- Earlier carrier-board attempt in `client/src/carrier-portal/`, `server/carrier-portal.ts`,
  `server/routes.ts`, `server/storage.ts`, `client/src/App.tsx` and the parent
  `supabase/migrations/20260919_carrier_load_board.sql`.
- Agent/config folders, local package store, backup instructions, generated business documents,
  Python/JavaScript helper scripts, skill lockfile and nested working folders.
- The older `work/five-nines-agent-desk` checkout has existing README and HTML changes.

These were preserved, not reset or included in the website work. They have **not** been fully
reviewed/tested in this implementation and should not be pushed together with this release.
In particular, never stage the parent's entire `work/` folder or local package stores.
