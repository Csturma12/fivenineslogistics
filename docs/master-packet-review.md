# Carrier master-packet review

This rebuild starts from the direct-to-Storage upload flow on `main`. The older
PR #32 must not be merged into this branch: it posts file bytes through the
website API and predates customer uploads and packet splitting.

## Upload and review

- The form asks users to add **one file at a time**. Carriers may upload
  separate packet, COI, W-9 and conditional NOA files, or one combined PDF for
  staff review. Customers retain BOL, PO, packing-list and other uploads.
- Each upload sends metadata to the website API for `sign`, sends bytes directly
  to the private Supabase Storage bucket, then calls `record`. The optional
  carrier `split` action remains available for a combined PDF. Splitting is
  limited to 60 pages; all uploads are limited to 15 MiB. A combined PDF saved
  for staff review is not automatically classified or split.
- A pending combined packet allows the carrier to submit a completed profile,
  but never grants load-board, bid or booking access. Staff opens the private
  file and confirms only the document types actually present. The checklist
  and profile decision commit in one transaction; a stale review cannot approve
  a newly changed profile. A replacement combined packet needs its own review.
- Individual files and existing customer documents retain their current paths
  and permissions. Uploading a document never confirms insurance validity or
  Highway status.

## Website release order

Target database: `pzupanvsfrgudoghpjpq` (Five Nines website only). Never run
this script against the Primary Freight operations database.

`scripts/portal-workflows.sql` and `scripts/website-project-baseline.sql` are
bootstrap-only scripts. Run them before the upgrade on a new database; never
rerun them after the upgrade. Both now stop before making changes if the
master-packet schema or review function is already installed.

1. Review and apply `scripts/portal-master-packet-upgrade.sql` to the website
   database before deploying code that selects the new document columns or
   calls `fn_review_profile`. This also raises the existing private bucket's
   per-file cap to 15 MiB; confirm the project's global Storage limit permits it.
2. Verify the columns, document-kind constraint, service-role-only RPC grant,
   private bucket and 15 MiB cap. Run Supabase security advisors.
3. Deploy the website PR after its type check, full test suite and review pass.
4. With authorized test accounts, upload a non-sensitive file larger than 3 MiB
   and confirm sign → Storage → record; repeat with a customer BOL and an
   auto-split carrier PDF. Confirm staff can review a combined packet, an
   incomplete checklist cannot approve it, and a replacement packet returns to
   review. Verify downloads remain private.

The repository uses reviewed flat SQL upgrades rather than a configured
Supabase CLI migration project. PGlite tests apply the upgrade twice, preserve
pre-existing customer documents and check privileges and transaction rollback.
Do not delete source documents or review columns during rollback. Older site
code does not count combined-packet coverage and may temporarily block those
carriers, so coordinate a rollback.
