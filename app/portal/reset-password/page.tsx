import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ResetPasswordForm } from "@/components/portal/reset-password-form"

export const metadata: Metadata = {
  title: "Reset password — Five Nines Logistics",
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">Portal security</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Set a new password
            </h1>
          </div>
          <ResetPasswordForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
