import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NetworkCta } from "@/components/network-cta"
import { modes, site, warehousing } from "@/lib/site"

export const metadata: Metadata = {
  title: "Modes & Services | Five Nines Logistics",
  description:
    "Flatbed, expedited, drayage, hotshot, box truck, oversize & heavy haul, ocean, and LTL — eight modes run to a five-nines reliability standard out of Houston, TX.",
}

export default function ModesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              Modes &amp; Services
            </span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Eight modes. One tolerance for failure.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              We ran flatbed, expedited, drayage, hotshot, and box truck freight for years before this
              company had a name — then built the rest of the network around the same standard. Every
              mode below is planned, sourced, tracked, and reported the same way.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<Link href="/request-capacity" />}
                nativeButton={false}
                size="lg"
                className="font-medium"
              >
                Request Capacity
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href={`mailto:${site.dispatchEmail}`} />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="font-medium"
              >
                Talk to Dispatch
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
              {modes.map((mode, i) => (
                <div key={mode.slug} id={mode.slug} className="scroll-mt-24 bg-card">
                  <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                          {mode.tier}
                        </span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {mode.name}
                      </h2>
                      <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                        {mode.detail}
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Equipment
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2">
                          {mode.equipment.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Typical loads
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2">
                          {mode.typicalLoads.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                              <span className="size-1.5 shrink-0 rounded-full bg-border" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {warehousing.eyebrow}
            </span>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {warehousing.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {warehousing.intro}
            </p>

            <div className="mt-10">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Warehouse markets
              </h3>
              <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
                {warehousing.locations.map((loc) => (
                  <div key={loc.city} className="bg-card p-5">
                    <p className="text-sm font-semibold text-foreground">{loc.city}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{loc.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                + vetted partner space nationwide
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
              {warehousing.capabilities.map((cap) => (
                <div key={cap.title} className="bg-card p-6 sm:p-8">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{cap.title}</h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {cap.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NetworkCta />
      </main>
      <SiteFooter />
    </>
  )
}
