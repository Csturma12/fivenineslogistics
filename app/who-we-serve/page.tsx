import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NetworkCta } from "@/components/network-cta"
import { sectors, whoWeServePage, whoWeServeInputs, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Who We Serve | Five Nines Logistics",
  description:
    "Refractory and plant maintenance, data centers, oil & gas turnarounds, and mission-critical contractors — the operations that measure downtime in dollars per minute. One tolerance for failure, whatever you move.",
}

export default function WhoWeServePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {whoWeServePage.eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {whoWeServePage.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {whoWeServePage.intro}
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
                render={<Link href={site.phoneHref} />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="font-medium"
              >
                <Phone className="size-4" data-icon="inline-start" />
                {site.phone}
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
              {sectors.map((sector, i) => (
                <div key={sector.code} className="bg-card">
                  <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                          {sector.code}
                        </span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {sector.title}
                      </h2>
                      <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                        {sector.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        What we move
                      </h3>
                      <ul className="mt-3 flex flex-col gap-2">
                        {sector.points.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-secondary/60 p-8 sm:p-12">
              <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {whoWeServePage.closing.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                {whoWeServePage.closing.body}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {whoWeServeInputs.eyebrow}
            </span>
            <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {whoWeServeInputs.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              {whoWeServeInputs.intro}
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {whoWeServeInputs.items.map((item, i) => (
                <div key={item.label} className="bg-card p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-mono text-[11px] uppercase tracking-wider text-primary">
                      {item.label}
                    </h3>
                  </div>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.body}</p>
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
