# Owner portal testing

`/portal/test` provides sample customer and carrier workspaces for the verified
Auth email `chris@shipfivenines.com`. Other company accounts do not inherit this
test-view permission. Editable profile metadata never grants it.

Sign in with the owner work account, then use the portal test link in the agent
desk or regular portal. The selector opens:

- **Carrier setup**: a draft sample profile awaiting Highway setup, including
  the email-onboarding prompt.
- **Carrier load board**: an approved sample carrier with fictional loads and bids.
- **Customer**: a sample customer workspace with fictional shipments and documents.

The views use the same workspace components as ordinary accounts. Their data is
synthetic and their workspace actions do not save profiles, upload files, place
bids, book freight, create load requests, or send automatic notifications. Sample
documents are labels, not links to the live document API. Email links still open
the user's email app; manually sending that draft is a separate action.

This is UI testing, not proof of live upload, approval, booking, or TAI write-back.
It does not create two live profiles, bypass Highway verification, assign a
customer account ID, or expose a customer's live freight records. Ordinary
customer/carrier pages and APIs retain the existing single-profile rules.

The older `/portal/preview` route remains development-only. The owner route must
check the server-verified identity before generating sample data; it must never
be enabled by an environment flag, URL email, or user metadata.

For live end-to-end testing of both roles, use separate controlled customer and
carrier profiles with verified customer mappings and real onboarding evidence,
or implement a deliberately designed multi-profile data model. Do not switch a
single stored profile's role every time the owner changes views.

## Verification on September 25, 2026

Before this change, the production `/portal/test` route returned HTTP 404.
The updated production build passed the isolated HTTP access suite:

| Identity or route | Observed result |
| --- | --- |
| Verified owner, including mixed case | All three sample views returned 200 with the test banner |
| Another verified company user, including forged owner metadata | 404; no sample data |
| External account with a spoofed company cookie | 404; no sample data |
| Signed out, unconfirmed or anonymous | Redirected to the sign-in entry |
| `/portal/preview` in production, even for the owner | 404 |
| Sample views | Zero profile/shipment/document data calls; no live document links |
| Agent desk navigation | Test link present for owner, absent for another company user |

The complete run recorded 67 synthetic Auth calls, 13 reads for the existing live
route tests, zero data writes and one synthetic Storage signature. All 78 unit
and rendered-component tests passed. The harness uses local synthetic services;
these checks did not create live freight, upload a document or send email.
