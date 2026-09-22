# Carrier portal release checkpoint — September 21, 2026

This is the current release checklist. Earlier handoff and migration-status notes are historical, not proof that every workflow is live.

## Release scope

- Canonical carrier entry: `/portal`. `/portal/carrier` redirects there; customer access stays at `/portal/customer`. Existing `/portal/home` links resolve by the stored profile role.
- Carrier setup, private packet/COI/W9/conditional NOA uploads, manual Highway invitation fallback, approval-gated load board, bids and counteroffers.
- Staff reviews remain at the authenticated website `/agent-desk`. The separate Fly Agent Desk receives an inbox and links to that review page; it is not a replacement dashboard.
- Team notification summaries use the existing Resend integration and `sturma@blbxcritical.com`. Durable outbox records survive delivery failures. No real delivery test has been performed for this release.
- New Fly bridge publishes only reviewed Shadow Ledger accounts, explicit carrier-safe lane fields, and fresh unassigned Committed loads. No customer names, sell/buy rates, notes, or driver details leave through this feed. The existing mirror lacks dimensions, so they remain blank rather than invented.
- Auto-book is off unless the website's server-side release setting explicitly enables it AND a load has a separate carrier offer. The initial Fly bridge sends neither offers nor auto-book eligibility.
- Bids accepted by staff or counteroffers accepted by carriers create an awaiting-dispatch reservation, not a TAI carrier assignment or rate confirmation.

## Separate environments

- Website / Vercel database: `pzupanvsfrgudoghpjpq`.
- Operations / Fly production database: `nonqwidfqrklksjluloz`.
- Keep the old teal-zebra database intact. This release does not delete or remigrate it.
- Operations branch: `codex/portal-agent-bridge`; website branch: `codex/carrier-portal-completion`.

## Activation order — owner approval required before merging

1. Review both pull requests and their CI results. Neither main branch has been changed by this release.
2. Deploy the website renderer/routes. Confirm the deployment uses the website database and existing Resend configuration.
3. Apply only `scripts/portal-email-upgrade.sql` to the website database. It replaces the bid procedure and preserves data/grants. The existing database procedure was inspected and does not yet contain the detailed email snapshot. Do not rerun the baseline migration.
4. Configure a new random bridge secret of at least 32 characters server-side: Fly `WEBSITE_PORTAL_BRIDGE_TOKEN`, website `TMS_INGEST_TOKEN`, same value. Never place it in browser variables, source, logs or this document. Do not rotate any TAI credentials.
5. Deploy the Fly bridge, initially no auto-book. Confirm the authenticated Agent Desk reports a successful sync and appropriate available-load count.
6. Use owner-controlled accounts to verify signup/login, setup save, private upload/download, staff review, bid, counter, carrier consent and email delivery. Confirm an unrelated account cannot view a document or another carrier's bid. Do not make real bookings as a test.
7. When supplied, configure the Highway link or continue manual invitations. Keep staff-recorded verification mandatory.

## Verification recorded locally

- Website typecheck and 18 isolated portal/Postgres tests pass.
- Operations typecheck and 14 targeted Agent Desk/bridge tests pass.
- Local sample-data carrier board and setup screens render. Sample actions never persist or send email. Preview routes return 404 in production.
- Website draft PR #30 built successfully on Vercel. Its deployed `/portal` sign-in and customer-portal link were verified. Fly companion review is PR #71; its initial CI exposed a date-sensitive legacy test, corrected separately within that review.
- No authenticated production bid, document operation, real email, TAI write, or automatic assignment was tested or performed.
- Operations full legacy suite was not run because some tests manipulate actual credential-setting names; safety instructions prohibit that. New tests inject synthetic transports and do not load storage or secrets.

## Deliberately not claimed complete

Live bridge activation and real authenticated smoke testing are launch gates. Exact TAI carrier-offer mapping, automatic TAI assignment and dimensions ingestion remain later integration work. Customer shipment tracking/account mapping is not supplied by this carrier-only bridge. Do not describe the overall customer portal or automatic booking as production-verified.
