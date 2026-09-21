# Why Five Nines?

## Reliability is designed in. Not left to chance.

“Five nines” is a benchmark for systems designed to keep working with minimal interruption. That level of reliability is built through monitoring, maintenance, disciplined procedures and redundancy.

For freight, the principle is straightforward: prepare thoroughly, stay connected and have a plan when conditions change. We bring that mindset to the people, equipment and decisions behind your shipment.

### The benchmark

99.999% availability means 0.001% downtime: approximately 5 minutes, 15 seconds over a 365-day year.

Availability measures the time a system is ready to work. Five nines leaves just 0.001% of the year for interruptions. In freight, that mindset means planning ahead, staying connected and responding quickly.

The number inspires our operating discipline. It is not a measured shipment-performance rate or a delivery guarantee.

### People on call. Around the clock.

24/7 dispatch, experienced coordination and clear escalation. A team that understands the load, the deadline and who needs to know when something changes.

### Visibility that leads to action.

Modern tracking and dispatch technology, milestone checks and proactive communication. Technology helps surface exceptions; people take ownership of the response.

### Trust starts before the booking.

Carrier and partner vetting built around identity, authority, insurance, safety and fit for the job. Experience and accountability matter at every handoff.

### Readiness before the road.

The right equipment, not just an available truck. Our carrier standards emphasize routine preventive maintenance, pre-trip inspections and load-specific equipment readiness.

### Procedures that protect the plan.

Pickup requirements, securement, site access, delivery windows and proof of delivery. Clear instructions and documented handoffs keep the details connected from start to finish.

### Every region. Always on call.

Our asset trucks, vetted carriers and strategic partners form a nationwide network with someone on call in every region—24 hours a day, 7 days a week, 365 days a year. When plans change, our team coordinates the response to keep your freight moving.

**The goal is simple: protect your delivery window—and the work depending on it.**

---

## Review notes — not website copy

- Prepared on `codex/five-nines-name-story`, based on main commit `76315045c25857aa355c5f8a31c46544fb19d501`. Owner approved publishing on its own branch; production and main remain separate from the preview review.
- Top Sign in remains linked to `/portal`. Desktop and mobile portal labels now say “Customer & carrier login”.
- Portal landing copy now describes the existing email-and-password flow instead of password-free access.
- The homepage hero keeps 99.999% visible with “Inspired by 99.999% reliability”. This describes the inspiration behind the name, not a measured freight-performance claim. The full “Why Five Nines?” section remains intact.
- Owner clarified that asset trucks, vetted carriers and strategic partners provide on-call coverage in every region nationwide, 24/7/365. The copy reflects that network, not a dedicated standby truck reserved for every shipment.
- Separate TypeScript validation and focused source checks passed. The alternate production bundler compiled the code successfully, but the full build stopped because the isolated checkout has no Resend configuration. Browser rendering was blocked by missing Supabase configuration. No authentication or production settings were changed to bypass either requirement.
- Existing unfinished portal work remains untouched in `work/website-portal`.
