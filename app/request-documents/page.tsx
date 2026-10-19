import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Landmark, ShieldCheck, FileCheck2, Phone, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DocumentRequestForm } from "@/components/document-request-form"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { carrierRequirements, site, vettingLayers } from "@/lib/site"

export const metadata: Metadata = {
  title: "Compliance & Onboarding | Five Nines Logistics",
  description:
    "Request the W-9, Certificate of Insurance, FMCSA authority (MC# 841023 / DOT# 2436508), BMC-84 bond, and onboarding packet for Five Nines Logistics, an authorized agency of Primary Freight LLC. Carrier onboarding and zero double-brokering policy.",
}

const authorityAdvantages = [
  {
    icon: Landmark,
    title: "Established credit, not a startup balance sheet",
    body: "Every load is arranged under Primary Freight LLC's broker authority. Carriers are paid on an established national payables history, and shippers set up one vendor with years of trade references—not a new MC.",
  },
  {
    icon: ShieldCheck,
    title: "BMC-84 surety bond on file with FMCSA",
    body: "Primary Freight LLC holds the federally required BMC-84 broker bond plus auto, general, umbrella, and contingent cargo coverage. Certificates are issued with your company as holder on request.",
  },
  {
    icon: Scale,
    title: "National scale with Houston accountability",
    body: "The agency model gives you Primary Freight's compliance, claims and carrier-payables infrastructure, while Five Nines owns the commercial relationship and every daily handoff from one Houston dispatch desk.",
  },
  {
    icon: BadgeCheck,
    title: "Zero double-brokering, in writing",
    body: "Every carrier is Highway-verified before tender; no unverified reassignments and no re-brokering. 3PL and forwarder partners receive written non-solicitation protection and blind BOLs as standard.",
  },
] as const

const credentials: Array<[string, string]> = [
  ["Operating model", "Freight brokerage & 3PL · authorized agency"],
  ["Broker authority", "Primary Freight LLC"],
  ["MC number", "MC# 841023"],
  ["U.S. DOT number", "2436508"],
  ["Surety", "BMC-84 broker bond"],
  ["Insurance", site.insurance],
  ["Base of operations", site.location],
  ["Dispatch coverage", "24 hours, every day"],
]

export default function RequestDocumentsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Compliance &amp; onboarding</span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Vendor setup that clears procurement the first time.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Five Nines Logistics operates as an authorized agency of Primary Freight LLC (MC# 841023 / U.S.
              DOT# 2436508). That gives your AP, risk and vendor-setup teams an established national counterparty
              with a BMC-84 bond, full insurance, and credit history—and gives you one Houston dispatch desk
              accountable for every load.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="#request" />} nativeButton={false} size="lg" className="font-medium">
                <FileCheck2 className="size-4" data-icon="inline-start" />
                Request W-9 / COI / authority packet
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
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Why the agency model matters</p>
            <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Primary Freight LLC authority is a financial and compliance advantage, not a footnote.
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
              {authorityAdvantages.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="bg-card p-6 sm:p-8">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[#080D1A] text-slate-100">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">Credentials on file</p>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white">
                  What your vendor-setup form needs.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Copy these into your vendor master now; the signed documents follow from the compliance desk
                  within one business hour.
                </p>
              </div>
              <dl className="divide-y divide-slate-800 overflow-hidden rounded-lg border border-slate-800 bg-[#0B111E]">
                {credentials.map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{k}</dt>
                    <dd className="font-mono text-sm text-emerald-300">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="request" className="scroll-mt-24 border-b border-border bg-card/30">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-primary">Request documents</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                One form. The whole packet.
              </h2>
              <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                Shippers and 3PL partners receive the W-9, ACORD 25 certificate with your company as holder, FMCSA
                authority, BMC-84 bond, agency letter and non-solicitation agreement. Carriers receive the Primary
                Freight broker–carrier agreement and Highway verification invite.
              </p>
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Carrier minimums</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {carrierRequirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {req}
                    </li>
                  ))}
                </ul>
                <Link href="/portal" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Carrier portal &amp; Highway verification
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <DocumentRequestForm />
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Zero double-brokering policy</p>
            <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Five layers between your freight and a stranger&apos;s truck.
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-5">
              {vettingLayers.map((layer) => (
                <article key={layer.n} className="bg-card p-5">
                  <span className="font-mono text-xs text-muted-foreground">{layer.n}</span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">{layer.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{layer.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 rounded-xl border border-border bg-secondary/50 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Already set up?</p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground">
                  Put the first load on the board.
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Capacity and all-in pricing confirmed within 60 minutes. Line-down emergencies get a callback in 15.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <RequestCapacityButton size="lg" className="font-medium">
                  Request Capacity
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </RequestCapacityButton>
                <Button
                  render={<Link href={`mailto:${site.dispatchEmail}`} />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="font-medium"
                >
                  {site.dispatchEmail}
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
