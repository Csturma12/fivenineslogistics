# Five Nines website project migration

Status checked September 20, 2026. INCOMPLETE — DO NOT DELETE THE SOURCE.

## Latest checkpoint (supersedes intermediate status below)

### All environment scopes approved and synchronized (newest)

- Owner answered yes after being explicitly warned that v0 Development/Preview
  would receive production admin credentials and could modify real data.
- Saved Production, Preview, and Development ON for the target website connection
  `b4aac0b7-3fb3-4351-90cd-ceeea54314ff`. Confirmed the production-credential warning
  using that approval, then separately ran Manage > Resync environment variables.
- Verified Vercel NEXT_PUBLIC_SUPABASE_URL is now All Environments, updated during
  this sync, with value `https://pzupanvsfrgudoghpjpq.supabase.co`. The existing
  `v0/site-audit-fixes` URL override was separately verified to match.
- Verified SUPABASE_SERVICE_ROLE_KEY entries cover Production and Preview (Secret),
  Development (Config, masked/revealable in Vercel), and the preserved branch
  Preview override (Secret). No private credential values were revealed or logged.
- This supersedes the production-only/safety-blocked scope checkpoint below.
  No deployment, code push, database deletion, new test database, credential
  rotation, or account-role change was performed. General v0 settings are now
  configured; an already-running v0 session may need a restart. Its fresh runtime
  and end-to-end portal behavior have not been verified in this configuration step.

### Approved website connections replaced (latest)

- Owner explicitly approved replacing only the website's uptime-logistics and
  teal-zebra connections. Removed classic connection
  `13fc8403-84bb-4712-a750-103bc8f403da`; uptime now shows zero Vercel connections.
  Its confirmation states existing variables remain unchanged. Database retained.
- Removed ONLY `fivenineslogistics` from native resource `store_dakp83GdEP1yDSn1`.
  Its associated old variables were removed, as the confirmation warned. Verified
  `csturma_v_ops-report` remains connected for all three environments. Source
  database retained; the website connection can be recreated for rollback.
- Connected actual target `pzupanvsfrgudoghpjpq` to Vercel `fivenineslogistics`.
  New classic connection ID: `b4aac0b7-3fb3-4351-90cd-ceeea54314ff`. Target screen
  shows ONE connection. Both Vercel production URL variables were revealed and
  verified as `https://pzupanvsfrgudoghpjpq.supabase.co`, then hidden again.
  Production Supabase credential entries are installed; secrets were not revealed.
- Automatic sync remains PRODUCTION ONLY. Attempting to save Preview/Development
  sync was blocked by safety review because it propagates production privileged
  credentials. Cancelled the unsaved changes; verified both switches OFF. Do not
  bypass this rejection with manual credential propagation. Obtain explicit
  environment-scope approval or design an isolated test database before expanding.
  Existing three `v0/site-audit-fixes` preview overrides remain. General v0
  Development is not yet configured or runtime-verified against the new database.
- Vercel search verifies RESEND_EMAIL_DOMAIN and RESEND_API_KEY remain linked to
  the existing Resend integration for All Environments, dated September 11.
  No email credential changes, deployments, repository pushes, database deletions,
  account-role edits, or key rotations were performed in this connection step.
- Post-change Vercel overview confirms the live Production deployment is still
  `EjVHRTV5vkKscBtg29Yck22qJ1ht`, main commit `e48d421`, Ready. Preview remains
  `2b5dCv7H38YBXSTfAFdL8RSadp2k`, Ready. New production configuration takes effect
  on a subsequent deployment; this step did not cut over the running website.

### Prior connection investigation (historical)

- FOLLOW-UP: Owner approved connecting only Five Nines to the actual target and
  installing its credentials, without deployment/deletion. Connect project was
  attempted twice (once after a fresh page load); neither produced a success
  state, and reloading after the first attempt still showed zero connections.
  Do not report that the target integration is connected.
- The classic integration's organization overview revealed a separate existing
  mapping from Vercel `fivenineslogistics` to Supabase `uptime-logistics`, immutable
  ID `fnancorktxafcjlmpczk`, connection `13fc8403-84bb-4712-a750-103bc8f403da`.
  That mapping has Production sync ON, Preview/Development OFF. It is distinct
  from the old native teal-zebra connection and is another possible competing
  settings source. Do NOT resync it. The exact cause of the silent connect failure
  is not established.
- Safety review rejected opening Delete connection for that uptime mapping as
  outside the approved target-only scope. No removal occurred; no bypass was
  attempted. Obtain explicit approval to replace only the WEBSITE mappings from
  uptime-logistics and teal-zebra, preserving their databases, other projects and
  connections. Warn that disconnecting can remove synced variables for future
  builds. Still no deployment, source data deletion, or credential rotation.

- The owner confirmed the chriss@ carrier/customer discrepancy was intentional
  access for testing and review. Preserve it; do not rewrite either role/request.
  The Just Drive account also requires no corrective work per the owner.
- Both principal target accounts completed password setup. Fresh password-based
  portal sign-ins and complete authenticated workflows still need verification.
- Source immutable ID is `gkerqkqrivrnlkoysupu`. Its current display name has been
  changed to `pzupanvsfrgudoghpjpq`, which misleadingly resembles the target ID.
  The actual target ID is `pzupanvsfrgudoghpjpq`, named `fivenineslogistics`.
- Vercel native resource `store_dakp83GdEP1yDSn1` explicitly reports Supabase ID
  `gkerqkqrivrnlkoysupu`; its display label is NOT evidence of target connectivity.
  The previous v0 integration-card check therefore did not verify migration.
- That source resource is connected to BOTH `fivenineslogistics` and
  `csturma_v_ops-report`, each for Production, Preview, and Development. Do not
  remove the resource or alter the other project's connection during this task.
- Only the website's `v0/site-audit-fixes` preview branch has verified target
  overrides. Production and general Development still use the old integration.
  Vercel's existing-database picker does not list the actual target; it lists the
  renamed source and an unrelated `supabase-pink-garden` resource.
- Source managed daily physical backups are visible, latest September 20 at
  11:09:01 UTC. These are restore-only in the UI, not a downloaded logical backup.
  No source restore, deletion, credential rotation, or environment change was made
  during this follow-up. An exploratory environment edit was cancelled unsaved.
- The actual target's Settings > Integrations has an existing classic Vercel
  authorization `icfg_bbAsKdptMrrCiQqwXS94VB7D`, but ZERO project connections.
  Its Add new project connection dialog can select `fivenineslogistics`. This is
  distinct from the old native Marketplace resource. The dialog is staged only;
  Connect project has NOT been clicked. It advertises installing 13 variables,
  including direct Postgres credentials and the JWT secret, not merely the three
  existing preview overrides. Obtain action-time approval/user handoff before
  completing that connection. Review native-variable conflicts and verify exact
  environment scopes after connecting, before any new production deployment.

## Authorized scope

Owner requested a complete website migration/merge to `pzupanvsfrgudoghpjpq`
(`fivenineslogistics`, https://pzupanvsfrgudoghpjpq.supabase.co), with no loss of prior work.
Source website project: `gkerqkqrivrnlkoysupu` (`supabase-teal-zebra`).
Primary Freight's separate production project `nonqwidfqrklksjluloz` is outside scope.
The website remains hosted on Vercel; Resend remains its notification provider.
Owner subsequently approved recreating logins instead of preserving passwords.
Default is to retain all four accounts and their existing access, using fresh password
setup rather than the previously shared password. All four account records have now
been recreated with their original IDs; passwords and active sessions were not copied.

## Completed and verified

- Target project confirmed ACTIVE_HEALTHY, initially empty.
- Applied target migration `copy_five_nines_website_schema` from the inspected source
  migrations and catalog definitions. Non-secret reproducible schema is saved in
  `scripts/website-project-baseline.sql`.
- Target has all 13 source public tables, indexes, constraints, seven public functions,
  and the legacy load-update trigger. All 13 tables have RLS enabled and no anonymous
  or authenticated SELECT grants. Service-role access remains server-only.
- Copied the private `fn-private-documents` bucket configuration (3 MB PDF/JPEG/PNG).
  Source had zero stored files, so no document bytes were moved.
- Pinned the legacy `set_loads_updated_at` function's search path to public,pg_temp.
- Target security advisor returned only 13 intentional service-only/no-policy INFO
  notices: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy.
- Source has no deployed Edge Functions, custom non-system schemas, Vault records,
  Realtime publication tables, SSO providers, MFA factors, or auth.users triggers.
  Its four identities use email authentication and its four passwords use bcrypt.

## Data copied through authenticated dashboard

After the owner signed in, the target SQL Editor accepted transactional imports:
four auth.users, four auth.identities, and both portal_access_requests. Existing
target data was guarded against rather than overwritten. Auth records retain IDs,
email confirmation dates, app/user metadata, timestamps, and original restrictions.
Password fields are empty; users must complete fresh password setup or use valid
password-free links. No sessions, recovery tokens, or password hashes were copied.

Source and target checksums matched before recovery testing on September 20, 2026:

| Data | Count | Matching checksum |
| --- | --- | --- |
| Account identity/profile fields, excluding credentials and transient tokens | 4 | 56e3543f18868ba488ee2a721a7584a7 |
| Complete identity rows | 4 | 91b2772dffe345ae9a6d308f19b98fd1 |
| Complete access request rows | 2 | e0db825114efcc49a56a18476c83fbe4 |

The existing chriss@ account has protected app_metadata.role=carrier, but its older
access request says customer. Both were preserved exactly. The legacy access-link
route can overwrite app_metadata from that request. The owner subsequently confirmed
this discrepancy is intentional testing access: preserve both records and avoid
using the legacy link as a role-repair mechanism. The sturma@ account retains
protected role=customer. No roles were elevated.

### Previous connection blocker (resolved through normal dashboard access)

Source exact counts: four auth users, four identities, two portal_access_requests;
all other public tables and storage objects are empty. The table-list estimate of
one ops_snapshots row was stale; direct queries confirmed zero rows.

The guarded transactional account/request import was rejected with SQLSTATE 25006:
`cannot execute INSERT in a read-only transaction`. Read-only diagnostics confirmed
transaction_read_only=on, default_transaction_read_only=on, and is_replica=false.
Do not change read-only controls or use migration history to embed password hashes.
Resume with an authorized writable database migration connection.
These diagnostics describe the connector session, not proof that the entire target
project is read-only. Do not alter database protections to work around the connector.

Verified after the rejection: target users=0, identities=0, requests=0; source still
has all four accounts and both requests. No source records were deleted or modified.
No passwords/hashes or private records were written to repository files. Re-export a
fresh source snapshot on resumption; do not rely on transient tool memory.

## Hosting and configuration — preview only, production unchanged

- Vercel CLI identity check returned: `The specified token is not valid`.
- Connected Vercel tool listed the team but no projects; get_project also returned
  a connector argument-validation error. Browser access is the working route.
- Browser verification subsequently confirmed a signed-in Vercel session in
  `csturma12s-projects`, with Five Nines website deployments visible. This is an
  available hosting-management route; CLI/connector access remains unresolved.
- Owner completed Supabase dashboard sign-in. Target Site URL is now
  https://fivenineslogistics.com. All six existing v0 redirect URLs were copied, plus
  exact /auth/confirm and /auth/callback URLs for the production apex/www domains and
  the v0/site-audit-fixes preview alias (12 total).
- Compared provider overview: both have email enabled, confirm-email enabled, new
  signups enabled, manual linking and anonymous sign-ins disabled; other providers
  disabled. Source has no custom SMTP; the website's Resend integration is unchanged.
- Added three Vercel overrides only for Preview branch `v0/site-audit-fixes`:
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (target publishable key),
  and SUPABASE_SERVICE_ROLE_KEY (target legacy service-role key, saved as Secret).
  Production and the old native integration remain unchanged. No secret values were
  printed or written to repository files; temporary credential buffers were cleared.
- Rebuilt existing commit baad4d5 without build cache. Preview deployment
  `2b5dCv7H38YBXSTfAFdL8RSadp2k` is READY:
  https://fivenineslogistics-git-v0-site-audit-fixes-csturma12s-projects.vercel.app
- Carrier and customer sign-in pages loaded. Carrier password recovery requested via
  preview; target recovery timestamp updated at 2026-09-20T16:14:57.521948Z, proving
  server calls reached the target. Runtime returned 200 but reported the branded
  sender was unverified and retried the Resend sandbox sender. Inbox delivery and
  completion of password setup are not yet verified. Do not equate HTTP 200 with
  email delivery: this route intentionally returns a generic success response.
- Security advisor recheck returned 13 service-only/RLS INFO notices plus one WARN:
  leaked-password protection disabled. Remediation:
  https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection.
- No .env files were read or edited. No TAI/DAT keys or signing keys were rotated.

### v0 connection checkpoint

The Five Nines v0 project's Integrations screen already identifies Supabase project
`pzupanvsfrgudoghpjpq`. Remote MCP remains set to ask for approval; this was not changed.
Its Environment Variables screen says these variables are managed in Vercel, not
independently in v0. It lists a shared NEXT_PUBLIC_SUPABASE_URL for Production,
Preview, and Development with its value masked. The target override verified above
is branch-preview-only; a target-backed v0 development runtime is not yet verified.
Do not infer that all runtime environments have migrated from the integration card.
The owner completed a reset. A subsequent credential-free status query confirmed
chriss@primarycompanies.com has a password set in the target and a fresh sign-in at
2026-09-20T16:31:38Z; its protected role remains carrier. This confirms reset progress,
not a separately tested password sign-in or complete portal workflow.
The owner then reported changing the customer password, but the target still shows
no password set for sturma@blbxcritical.com. The source customer record does have a
password and was updated at 2026-09-20T16:13:51Z. Which reset link the owner used is
not confirmed. Customer password setup must use the target-backed preview; do not
request the password or infer that the old live site now uses the target.

### Customer reset delivery blocker confirmed

At 2026-09-20T16:38:37Z, a controlled preview reset for sturma@blbxcritical.com
returned the generic success screen, but Vercel logged Resend rejecting delivery:
testing emails may only go to the Resend account owner, chriss@primarycompanies.com.
The branded sender is unverified and the sandbox fallback cannot serve the customer
recipient. This is a confirmed delivery failure, not a spam-folder assumption.
Verify an authorized sending domain in the same Resend account and configure its
matching sender before retrying; do not redirect customer recovery links to someone
else's mailbox. The Resend domains page currently requires owner sign-in in the
in-app browser. No Resend/DNS configuration was changed during this diagnosis.

After owner sign-in, the Resend primarycompanies account showed the existing
Vercel-managed fivenineslogistics.com domain as Failed (domain ID
e1957368-d9b4-4590-8c24-bd2c7a367b31), reporting all three required records missing:
DKIM TXT at resend._domainkey, MX at send (priority 10, feedback-smtp.us-east-1.amazonses.com),
and SPF TXT at send (v=spf1 include:amazonses.com ~all). Live DNS confirms Squarespace
nameservers and nonexistent resend._domainkey/send names. Required DKIM public key
is available in the Resend domain screen. Receiving is disabled and must remain so;
do not replace existing root mail-routing records or change website DNS.
The linked Squarespace DNS settings page requires owner sign-in. No DNS records,
sender settings, keys, or domain-verification settings have been changed yet.

Owner explicitly approved the three Resend DNS additions and completed Squarespace
reauthentication. Two new records were saved and verified in the DNS table:
resend._domainkey TXT (the Resend-provided public key) and send MX priority 10 to
feedback-smtp.us-east-1.amazonses.com, both with the default four-hour TTL.
Existing root Google MX/SPF, Vercel A/www CNAME, and verification presets remain intact.
Squarespace requested passkey verification again when opening the third record form.
After the owner completed the second security check, the send TXT SPF record was
also saved with a four-hour TTL. All three new records were confirmed both in the
Squarespace table and through an authoritative nsb1.squarespacedns.com DNS query.
Resend verification was restarted; its domain events show DNS verified at September
20, 12:02 PM Central and Domain verified at 12:03 PM. Overall status is now Verified,
with the message that the domain is ready to send emails. No keys, website environment
variables, or mailbox-routing settings were changed for this fix.
A fresh customer reset was requested through the target-backed preview for
sturma@blbxcritical.com. Resend shows Delivered for "Reset your Five Nines portal
password", email ID 01a0bfc6-e766-76f4-b427-87c3f065a9cb. This verifies provider
delivery, not inbox placement, password setup completion, or a password-based sign-in.
The owner completed the password-entry step themselves. A credential-free target
query confirmed both accounts now have passwords set and retain their intended
protected roles: chriss@primarycompanies.com is carrier, sturma@blbxcritical.com is
customer. The customer has a fresh sign-in at 2026-09-20T17:09:22Z and an update at
17:09:48Z. This verifies customer reset completion, not a separately tested fresh
password sign-in or all authenticated portal workflows. Never retrieve or share
the reset token. Production cutover and source retirement remain incomplete.

## Preserve pending website work

All existing local changes remain in `work/website-portal`, including onboarding,
private documents, carrier board, bids/counters, customer requests, and email preview.
No local work was committed, pushed, reset, or discarded. Only the existing committed
website baseline was redeployed as a preview; pending local portal work is not deployed.
The new target currently mirrors the previously applied database baseline, not the
later local structured carrier-email update. That update remains in
`scripts/portal-workflows.sql`, `lib/portal-notification.ts`, and its tests; release the
matching email renderer and updated fn_bid_action together after migration verification.
The draft website agent-desk still needs its agreed bridge to the existing Fly dashboard.

## Required before source retirement

1. Fresh password setup is complete for the two principal accounts; verify fresh
   sign-ins. Preserve the intentional carrier/customer testing-access discrepancy
   and do not use legacy access links to overwrite the account's role.
   Recheck for new source records before cutover, copying only verified changes with
   conflict detection. Preserve original IDs and source state; do not grant new roles
   from user-editable metadata. Existing passwords do not need to be migrated.
2. Compare full records/checksums, permissions, indexes, functions, and storage metadata.
   Take a secured complete source backup outside Git, including auth/configuration.
3. Copy and verify Auth/SMTP/redirect settings and audit any webhook/sync consumers.
4. Update the existing Vercel project's public URL/key and server-only credential securely.
   Preserve Resend and all unrelated settings. Never paste credentials into chat or Git.
5. Test a preview deployment: customer and carrier login, password reset/signup, private
   upload/download, data isolation, capacity requests, bids, and email delivery. Send
   deliberately labeled test emails only as part of an authorized controlled test.
6. Switch production during a controlled write-free window, reconcile any new source
   records, and verify live flows. Existing users may need to sign in again; do not
   rotate/copy signing secrets just to retain sessions.
7. Keep a rollback window and verify no active consumer or deployment uses the old
   project before recommending deletion. Deletion is not authorized as part of this run.
