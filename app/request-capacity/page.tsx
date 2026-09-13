import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RequestCapacityForm } from "@/components/request-capacity-form"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Request Capacity — Five Nines Logistics",
  description:
    "Submit a capacity request to the Five Nines Logistics control tower. A dispatch coordinator confirms capacity and pricing within one business hour, 24/7/365.",
}

export default function RequestCapacityPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Control Tower Intake
                </span>
              </div>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                Tell us what can&apos;t be late.
              </h1>
              <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                Give us the lane, the mode, and the window. A dispatcher confirms capacity and
                pricing within one business hour, around the clock — and it&apos;s tracked against
                the same five-nines SLA as live freight from the moment you submit.
              </p>

              <dl className="mt-10 flex flex-col gap-6 border-t border-border pt-8">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Response time
                  </dt>
                  <dd className="font-mono text-lg font-semibold text-foreground">&lt;1 hr</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Coverage
                  </dt>
                  <dd className="font-mono text-lg font-semibold text-foreground">24/7/365</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    On-time SLA
                  </dt>
                  <dd className="font-mono text-lg font-semibold text-primary">99.999%</dd>
                </div>
              </dl>

              <div className="mt-8 rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
                    Authorized &amp; insured
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Operating as an agent of {site.authority} ({site.mc}) — fully authorized and
                  insured. Need a certificate of insurance, or to be added as a certificate holder?
                  Just ask your coordinator and we&apos;ll send it over.
                </p>
              </div>
            </div>

            <RequestCapacityForm />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
