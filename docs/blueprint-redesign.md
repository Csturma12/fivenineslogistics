# Five Nines — Blueprint design direction

This proposal lives on `design/blueprint-five-nines`. It does not change the production branch, domain, authentication, shipment actions, or integration settings.

## Review of the existing experience

The strongest material is the founder's plant-maintenance background, working backward from delivery windows, and a single coordinator connecting specialized capacity. These make the business relevant to contractors and engineers immediately.

The original homepage spreads that story across a moving status ticker, a reliability display, service sections and a network graphic. Illustrative shipment activity and numerical reliability language can look like measured, live operating data. The redesign removes those presentations from the homepage and leads with the customer problem and operating approach instead.

## The design

- White background, navy `#12345A`, professional blue `#28649A`, and restrained green `#21B975` nodes.
- Existing repository-native Forged 5N mark retained; a larger, simpler wordmark treatment.
- New homepage copy: **Critical freight. Every handoff accounted for.**
- Four audiences: data centers, plant maintenance, critical construction and global freight partners.
- Interactive service selector links to existing modes, with a new warehouse section anchor.
- Shared responsive header and footer bring the palette and navigation to existing routes.
- The existing capacity form is retained; introductory wording now describes a review-and-confirm process rather than an assumed five-nines SLA.
- Phone, email, portal, carrier and shipment-request links use the existing business destinations.

## Image provenance

`public/images/critical-freight.webp` is AI-generated concept photography, created for this design, depicting a navy flatbed carrying industrial electrical equipment at a facility. It is illustrative, not documentary evidence of Five Nines-owned equipment or a completed shipment. Before public release, authentic shipment photography can replace it in the same slot.

Prompt: Photorealistic editorial industrial-freight website hero, vertical composition; navy unbranded tractor and flatbed carrying white electrical equipment at a modern industrial loading area; realistic securement; cool daylight and professional navy, steel-blue and white palette; no text or overlays.

## Scope and validation

The homepage is redesigned; existing internal pages retain their content and workflows with the shared navigation, footer and color palette. The client portal, email submission and TMS connections are preserved, not reimplemented.

Local build uses explicitly nonfunctional placeholder configuration for Supabase and Resend because production credentials are not present in this workspace. No forms were submitted, no emails were sent, and no customer or carrier data was accessed. Live integration validation requires the project's configured preview environment.

Validation completed:
- `pnpm exec tsc --noEmit` passes independently of the repository's existing build-time type-check skip.
- `pnpm build` passes with local placeholder integration configuration; all existing routes compile.
- Chromium review at 1440px desktop and 390px mobile: no horizontal overflow or page errors.
- Capabilities selection updates the service description and destination.
- Mobile navigation opens and follows Request capacity to the existing form page.
- Desktop and mobile full-page screenshots inspected.
