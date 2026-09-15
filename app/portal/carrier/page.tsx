import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortalSignIn } from "@/components/portal/portal-access"

export const metadata: Metadata = {
  title: "Carrier portal — Five Nines Logistics",
  description:
    "Sign in to our live load board. See freight offered to your authority, accept loads, upload PODs, and watch settlements — one login.",
}

export default function CarrierPortalPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Both portals
            </Link>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--status-ok)]"
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Carrier portal · live load board
              </span>
            </div>
            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Sign in to the load board.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              See freight offered to your authority, accept loads, upload PODs, and watch
              settlements — one login built for drivers and dispatch.
            </p>
          </div>

          <div className="mt-10">
            <PortalSignIn role="carrier" />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
