import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NetworkCta } from "@/components/network-cta"
import {
  vettingPage,
  vettingSignature,
  vettingLayers,
  vettingThreats,
  site,
} from "@/lib/site"

export const metadata: Metadata = {
  title: "Carrier Vetting & Fraud Prevention | Five Nines Logistics",
  description:
    "We vet every carrier with Highway plus multiple layers on top — and on critical loads we know roughly 75% of the drivers by name. We speak to the driver, dispatcher, and owner before assigning a critical load.",
}

export default function CarrierVettingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {vettingPage.eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {vettingPage.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {vettingPage.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RequestCapacityButton size="lg" className="font-medium">
                Move a critical load
                <ArrowRight className="size-4" data-icon="inline-end" />
              </RequestCapacityButton>
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

        {/* Signature: the 75% / human verification story */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="rounded-xl border border-border bg-card p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="size-5 text-primary" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Known before booked
                </span>
              </div>
              <p className="mt-6 font-mono text-6xl font-semibold tabular-nums tracking-tight text-primary sm:text-7xl">
                {vettingSignature.stat}
              </p>
              <p className="mt-3 text-pretty leading-relaxed text-foreground">
                {vettingSignature.label}
              </p>
            </div>
            <div>
              <h2 className="max-w-xl text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-3xl">
                {vettingSignature.heading}
              </h2>
              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                {vettingSignature.body}
              </p>
            </div>
          </div>
        </section>

        {/* Vetting layers */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="max-w-2xl text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-3xl">
              Five layers between your freight and a bad actor.
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
              {vettingLayers.map((layer) => (
                <div key={layer.n} className="bg-card p-6 sm:p-8">
                  <span className="font-mono text-xs tabular-nums text-primary">{layer.n}</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                    {layer.title}
                  </h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {layer.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Threats we stop */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="max-w-2xl text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-3xl">
              {vettingThreats.heading}
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {vettingThreats.items.map((threat) => (
                <div key={threat.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {threat.title}
                  </h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {threat.body}
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
