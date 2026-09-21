import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PackageSearch, ShieldCheck, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Secure customer and carrier portal — Five Nines Logistics",
  description:
    "Sign in or create an account for your Five Nines customer or carrier relationship.",
}

export default function PortalPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <ShieldCheck className="size-3.5 text-[color:var(--status-ok)]" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Customer & carrier access
              </span>
            </div>
            <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              One secure entry point. Two dedicated relationships.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Choose the portal that matches how you work with Five Nines. Already registered?
              Sign in with your email and password. New here? Create an account and confirm
              your email to get started. Shipment and carrier services are subject to onboarding
              and approval.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Link
              href="/portal/customer"
              className="group flex flex-col justify-between gap-8 rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-background">
                  <PackageSearch className="size-5 text-primary" aria-hidden="true" />
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  For approved shippers
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Customer portal
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  Verify your customer relationship, receive secure access, and connect directly
                  with the team coordinating your freight and documents.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-foreground">
                Customer access
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/portal/carrier"
              className="group flex flex-col justify-between gap-8 rounded-xl border border-navy/40 bg-navy p-6 text-navy-foreground transition-colors hover:border-[color:var(--status-ok-dark)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--status-ok-dark)] sm:p-8"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-lg border border-navy-foreground/20 bg-navy-foreground/5">
                  <Truck className="size-5 text-[color:var(--status-ok-dark)]" aria-hidden="true" />
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
                  For approved carriers
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  Carrier portal
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-navy-foreground/65">
                  Verify your carrier relationship, receive secure access, and stay connected with
                  carrier relations and dispatch.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
                Carrier access
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
