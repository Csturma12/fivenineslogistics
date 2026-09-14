import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortalSignIn } from "@/components/portal/portal-access"

export const metadata: Metadata = {
  title: "Customer portal — Five Nines Logistics",
  description:
    "Sign in to track your freight, pull documents from our TMS, and settle — one login, the five-nines standard behind it.",
}

export default function CustomerPortalPage() {
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
            <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Sign in to track your freight.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Live load status, documents pulled straight from our TMS, and settlements — one login,
              the same five-nines standard running behind every move.
            </p>
          </div>

          <div className="mt-10">
            <PortalSignIn role="customer" />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
