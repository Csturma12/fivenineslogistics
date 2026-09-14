import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Sign-in link expired — Five Nines Logistics",
}

export default function AuthErrorPage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-t border-border bg-grid-technical">
        <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-20 sm:px-6 sm:py-28">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-warn)]">
            Link expired
          </span>
          <h1 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
            That sign-in link didn&apos;t work.
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Secure links expire after about an hour and can only be used once. Enter your work email
            again and we&apos;ll send a fresh one.
          </p>
          <Link
            href="/portal"
            className="mt-8 flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
          >
            Back to sign in
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
