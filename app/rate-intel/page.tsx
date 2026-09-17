import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RatePanel } from "@/components/rate-panel"

export const metadata: Metadata = {
  title: "Rate Intelligence — Five Nines Logistics",
  description:
    "Best-fit lane rates benchmarked across timeframes against market reports and your own company history.",
}

export default function RateIntelPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Astra / Rate Intelligence
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Every lane, benchmarked to the market.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Best-fit rate across timeframes, cross-checked against market reports and your own
              company history so you always know where a quote sits.
            </p>
          </div>

          <div className="mt-10">
            <RatePanel />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
