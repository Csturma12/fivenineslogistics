import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LoadBoard } from "@/components/loads/load-board"
import { getAvailableLoads } from "@/lib/loads"
import { site } from "@/lib/site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Load Board | Five Nines Logistics",
  description:
    "Open freight available now through Five Nines Logistics. Browse full load details — lane, equipment, dates, and posted rate. Approved carriers book instantly from the portal.",
}

export default async function LoadsPage() {
  const loads = await getAvailableLoads()

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Load Board</span>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Open freight, posted as it moves.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Every load below is real and available now — full lane, equipment, dates, and posted
              rate. Browsing is open to everyone. Booking is reserved for approved Five Nines
              carriers, so rates and coverage stay dependable.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/portal/carrier"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <ShieldCheck className="size-4" aria-hidden="true" />
                Carrier sign in / request access
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Call dispatch
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <LoadBoard loads={loads} mode="public" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
