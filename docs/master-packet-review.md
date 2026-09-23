# Carrier master-packet review

This update is prepared in PR #32. It is not a production release or a database
migration completion report.

## Carrier and staff flow

- A carrier can upload one combined PDF and submit the saved profile for review.
  Separate packet, COI, W-9 and conditional NOA uploads remain supported.
- A pending combined packet satisfies document presence for submission only.
  The carrier still supplies the required business details and current insurance
  expiry. Uploading a file never grants load-board, bidding or booking access.
- Staff opens the private file, checks the document types actually present, and
  confirms that they reviewed it. This checklist is saved in the same transaction
  as the account review outcome: no extra approval click or duplicate upload.
- Existing files labeled `packet` can also be classified without reuploading.
- An unchanged review retains its original reviewer and timestamp. A newly
  uploaded combined packet remains pending until staff reviews that file.
- Missing required content, expired insurance and incomplete Highway verification
  still block approval. A single file is not itself a reason to reject submission.
- The email fallback opens a draft to the site's existing carrier-setup address.
  The carrier attaches files and sends it themselves. It does not mark setup done.

## Release prerequisite — website database only

Target: `pzupanvsfrgudoghpjpq`. Never apply this upgrade to the Primary Freight / Fly
operations database.

1. Review and apply `scripts/portal-master-packet-upgrade.sql` to the website
   database through an approved writable connection **before deploying this code**.
2. Verify the added columns, constraints and service-role-only procedure grants.
   Run the Supabase security advisor after applying the upgrade.
3. Deploy the approved website PR. New queries explicitly request the review
   columns, so authenticated previews connected to an unupgraded database are not
   an end-to-end verification of this feature.
4. With an authorized test account, upload one non-sensitive sample PDF, submit,
   confirm its checklist and approve through the website review desk. Verify that
   a carrier cannot confirm their own packet, an incomplete checklist cannot grant
   access, and a replacement packet returns to review. Verify private download.
5. Keep the old source/data intact. Do not delete documents or remove review
   columns during rollback. Older application code does not count combined-file
   coverage and may temporarily block those carriers; coordinate any rollback.

The project currently uses reviewed flat SQL upgrade scripts, not a configured
Supabase CLI migration project. The upgrade is tested on isolated PGlite/Postgres
fixtures, including applying it twice and checking privileges and rollback. No
live schema changes or real carrier approvals are made while preparing the PR.

## Explicitly unchanged / not included

- Private document storage and ownership-checked downloads.
- The 3 MB per-file application and bucket limit. Larger packets still need the
  separate direct-to-storage upload enhancement or the email fallback.
- No OCR, AI API, paid document service, or third-party document transmission.
- No automatic judgment of authenticity, insurance coverage or carrier eligibility.
- No changes to TAI, the operations dashboard, or its write-back worker.

Optional AI review can later suggest page locations and missing/unreadable items,
subject to provider, privacy, retention and spending approval. Staff remains the
final reviewer. Never put tax identifiers or packet contents in notification logs.
