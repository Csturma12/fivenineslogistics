import type { Metadata } from "next"
import Link from "next/link"
import { Phone, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  carriersPage,
  carrierBenefits,
  carrierRequirements,
  carrierPartners,
  site,
} from "@/lib/site"

export const metadata: Metadata = {
  title: "Haul for Five Nines | Carriers & Partners",
  description:
    "Run clean, communicate, and show up — and get on the bench for steady, planned freight with dispatch that answers, fair rates, and quick-pay. Partner with Five Nines Logistics.",
}

export default function CarriersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {carriersPage.eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {carriersPage.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {carriersPage.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<Link href={`mailto:${site.carriersEmail}`} />}
                nativeButton={false}
                size="lg"
                className="font-medium"
              >
                <Mail className="size-4" data-icon="inline-start" />
                Get on the bench
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
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Why haul for us
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {carrierBenefits.map((b, i) => (
                <div key={b.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                  <span className="font-mono text-xs tabular-nums text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                What we look for
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Standard requirements to run under our authority. Meet these and a signed carrier packet
                gets you loaded.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {carrierRequirements.map((req) => (
                  <li key={req} className="flex items-start gap-3 text-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" />
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-secondary/60 p-8 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {carrierPartners.heading}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                {carrierPartners.body}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  render={<Link href={`mailto:${site.carriersEmail}`} />}
                  nativeButton={false}
                  className="font-medium"
                >
                  <Mail className="size-4" data-icon="inline-start" />
                  Email carrier setup
                </Button>
                <Button
                  render={<Link href={site.phoneHref} />}
                  nativeButton={false}
                  variant="outline"
                  className="font-medium"
                >
                  <Phone className="size-4" data-icon="inline-start" />
                  Call dispatch
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
