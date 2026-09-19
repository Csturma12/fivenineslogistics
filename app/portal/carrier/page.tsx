import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortalSignIn } from "@/components/portal/portal-access"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Carrier portal access — Five Nines Logistics",
  description:
    "Request verified, password-free carrier portal access and connect with Five Nines carrier relations.",
}

export default async function CarrierPortalPage() {
  // Already signed in? Skip the sign-in link step and go straight to the portal.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    redirect("/portal/home")
  }

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
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <ShieldCheck className="size-3.5 text-[color:var(--status-ok)]" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Verified carrier access
              </span>
            </div>
            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              A secure connection for trusted carriers.
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              Create an account with your dispatch email, confirm it once, and sign in anytime to
              view and book open freight.
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
