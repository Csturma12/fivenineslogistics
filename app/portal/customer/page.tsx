import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortalSignIn } from "@/components/portal/portal-access"

export const metadata: Metadata = {
  title: "Customer portal access — Five Nines Logistics",
  description:
    "Request verified, password-free customer portal access and connect with the team coordinating your freight.",
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
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              All portal access
            </Link>
            <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Secure access for Five Nines customers.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Submit your work email and company details. We verify every request before sending a
              password-free sign-in link to approved users.
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
