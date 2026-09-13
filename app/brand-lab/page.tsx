import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SignalFiveMark, BreakerMark, FiveNTile } from "@/components/brand-lab/candidate-marks"
import { PortalPreview, DashboardPreview } from "@/components/brand-lab/portal-preview"

export const metadata: Metadata = {
  title: "Brand Lab — Five Nines Logistics",
  description: "Private design exploration: logo marks and portal directions for Five Nines Logistics.",
  robots: { index: false, follow: false },
}

const marks = [
  {
    id: "A",
    name: "Signal Five",
    tag: "Full signal, always up",
    note: "Five ascending bars — the fifth (the ninth nine) runs signal green. It counts to five, reads as a full signal at nominal, and holds up as a 16px favicon or a decal on a trailer door.",
    render: (size: string) => <SignalFiveMark className={`${size} text-foreground`} />,
  },
  {
    id: "B",
    name: "Breaker On",
    tag: "Power stays on",
    note: "A breaker thrown up into the live position. UPS-room and gen-set language every facilities and data-center buyer reads instantly — power stays on, freight keeps moving.",
    render: (size: string) => <BreakerMark className={`${size} text-foreground`} />,
  },
  {
    id: "C",
    name: "5N Spec Plate",
    tag: "The rating nameplate",
    note: "A stamped monogram tile with a navy corner notch — like the rating plate on a transformer or mill motor. Works as an app icon, doc header, and truck-door mark.",
    render: (size: string) => <FiveNTile className={size} textClassName="text-[42cqw]" />,
  },
]

/* Navy-on-light exploration palette, scoped to this lab only via inline token
   overrides so the live site's Signal-red identity is untouched. A confident
   navy/azure accent on the clean professional cool-white background you like —
   paired with GRAPHITE GUNMETAL dark surfaces (a cool near-black, not blue) so
   the navy accent stays the star and never dissolves into the dark panels. */
const navyLightTheme = {
  "--background": "oklch(0.99 0.004 250)",
  "--foreground": "oklch(0.23 0.02 255)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.23 0.02 255)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.23 0.02 255)",
  "--primary": "oklch(0.47 0.14 256)",
  "--primary-foreground": "oklch(0.99 0.01 250)",
  "--secondary": "oklch(0.96 0.008 250)",
  "--secondary-foreground": "oklch(0.23 0.02 255)",
  "--muted": "oklch(0.96 0.006 250)",
  "--muted-foreground": "oklch(0.45 0.02 255)",
  "--accent": "oklch(0.47 0.14 256)",
  "--accent-foreground": "oklch(0.99 0.01 250)",
  "--border": "oklch(0.23 0.03 255 / 12%)",
  "--input": "oklch(0.23 0.03 255 / 14%)",
  "--ring": "oklch(0.47 0.14 256)",
  /* dark surfaces (footer, control-tower panels): cool graphite gunmetal,
     distinct from the navy accent, with a luminous azure for on-dark accents */
  "--navy": "oklch(0.19 0.008 255)",
  "--navy-foreground": "oklch(0.95 0.006 250)",
} as React.CSSProperties

export default function BrandLabPage() {
  return (
    <main style={navyLightTheme} className="bg-background">
      <SiteHeader />

      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Private · Design Lab
            </span>
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Marks &amp; portal directions.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            My take on the identity and the login, in a navy-on-light direction — a confident navy
            accent on the clean professional background you like, paired with graphite gunmetal dark
            surfaces (a cool near-black, not blue) so the navy stays the star. Three mark candidates,
            then a working &quot;one door, two roles&quot; sign-in and the dashboards behind it. This
            palette is scoped to the lab only; the live site&apos;s red is untouched, and nothing
            here is wired into the public site yet.
          </p>
        </div>
      </section>

      {/* Marks */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            01 — Logo marks
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {marks.map((m) => (
              <div key={m.id} className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
                {/* nav-corner context */}
                <div className="flex items-center justify-between rounded-lg bg-navy px-4 py-3 text-navy-foreground">
                  <span className="text-[13px] font-semibold tracking-tight">FIVE NINES</span>
                  <div className="[&_.text-foreground]:text-navy-foreground">
                    <div className="h-6 w-6 [container-type:inline-size]">{m.render("h-6 w-6")}</div>
                  </div>
                </div>

                {/* hero + favicon strip */}
                <div className="flex items-end gap-5">
                  <div className="h-16 w-16 [container-type:inline-size]">{m.render("h-16 w-16")}</div>
                  <div className="flex items-end gap-3 pb-1">
                    <div className="h-8 w-8 [container-type:inline-size]">{m.render("h-8 w-8")}</div>
                    <div className="h-4 w-4 [container-type:inline-size]">{m.render("h-4 w-4")}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                      {m.id}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">{m.name}</h3>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {m.tag}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal */}
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            02 — One door, two roles
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            One login for shippers and carriers, split by a role toggle. Try switching between
            Customer and Carrier — the form and the entry points adapt.
          </p>
          <div className="mt-8">
            <PortalPreview />
          </div>
        </div>
      </section>

      {/* Dashboards */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            03 — Post-login
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            What each role lands on. Shippers get a control-tower view of live freight; carriers get
            offered loads and settlements on the dark panel.
          </p>
          <div className="mt-8">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
