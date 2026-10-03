# Portal load board review — October 3, 2026

The carrier portal shows all eligible available loads for approved and Highway-verified carriers. It reads the full result in ordered 500-row pages, refreshes the workspace once per minute, and offers pickup-date range, origin, destination, lane/equipment search, and Show all loads. The source bridge publishes every eligible uncovered Committed load from operations every five minutes when configured. Quotes, loads with a carrier, expired pickup dates, and loads without recent TAI operations activity are not bid-ready.

The customer portal reads every shipment whose stored `customer_account_id` exactly equals the approved user's staff-linked TAI bill-to ID. The Fly relay and bridge carry a bill-to ID obtained from that shipment's TAI webhook; missing IDs stay unscoped. Customer history, status and last reported tracking are private to the matching account. Customer name/email matching does not grant access.

Carrier bids require an approved profile with contact name, phone and account email. The bid procedure stores an internal snapshot with those details and the load/bid amount in the durable outbox. `dispatch@shipfivenines.com` is the new recipient, while legacy queued bid notifications addressed to the old inbox are sent to dispatch by the renderer. The outbox attempts immediate delivery and retries when the portal or bridge flushes it. A submitted bid is an offer for dispatch review, not a carrier assignment.

## Release checks

1. Deploy the website route and renderer; apply only `scripts/portal-email-upgrade.sql` to the website Supabase project `pzupanvsfrgudoghpjpq`. Do not rerun the historical baseline schema.
2. Deploy the companion operations migration, relay and bridge in the order in its `docs/website-portal.md`; verify the existing bridge token is configured at both ends without displaying its value.
3. With owner-controlled carrier and two separate customer accounts, compare all eligible Uncovered loads in operations with carrier board count. Check >200 loads if available, each search, an exact customer ID match and a cross-account denial.
4. Submit a disposable test bid using approved owner-controlled accounts; verify the dispatch inbox received the contact name, phone, account email, amount and load reference. Inspect outbox errors if mail fails. Do not book or dispatch actual freight as a test.

The connected GitHub view does not expose the production Vercel/Fly/Supabase project state or authenticated portal accounts, so these live checks must be completed after the paired PRs and configuration are deployed. Older shipments without a per-shipment TAI bill-to ID require an authoritative refresh before they can appear on the customer board.
