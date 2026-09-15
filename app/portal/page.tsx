import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PackageSearch, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Portal — Five Nines Logistics",
  description:
    "Two doors into the control tower. Customers track live loads and pull documents. Carriers work our live load board, accept freight, and watch settlements.",
}

export default function PortalPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--status-ok)]"
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Portal · two doors
              </span>
            </div>
            <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Pick your door into the control tower.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Two logins, one standard behind them. Shippers track freight and pull documents.
              Carriers work our live load board, accept loads, and watch settlements.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {/* Customer door */}
            <Link
              href="/portal/customer"
              className="group flex flex-col justify-between gap-8 rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/30 sm:p-8"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-background">
                  <PackageSearch className="size-5 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Customer portal
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  Track live loads in real time, pull PODs, BOLs, invoices, and COIs straight from
                  our TMS, and settle — one login for your freight.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-foreground">
                Enter customer portal
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* Carrier door */}
            <Link
              href="/portal/carrier"
              className="group flex flex-col justify-between gap-8 rounded-xl border border-navy/40 bg-navy p-6 text-navy-foreground transition-colors hover:border-[color:var(--status-ok-dark)]/50 sm:p-8"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-lg border border-navy-foreground/20 bg-navy-foreground/5">
                  <Truck className="size-5 text-[color:var(--status-ok-dark)]" aria-hidden="true" />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
                    Live load board
                  </span>
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--status-ok-dark)]"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  Carrier portal
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-navy-foreground/65">
                  See freight offered to your authority, accept loads off our board, upload PODs, and
                  watch settlements — one login built for drivers and dispatch.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
                Enter carrier portal
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
