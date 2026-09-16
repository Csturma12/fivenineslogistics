import Link from "next/link"
import { ArrowRight, FileText, Mail, Phone, ShieldCheck } from "lucide-react"
import { site } from "@/lib/site"

export function CustomerHome({ company }: { company: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <section className="flex flex-col justify-between gap-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok)]">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Access confirmed
          </div>
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Your Five Nines team is ready.
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Your approved access for <span className="font-medium text-foreground">{company}</span>{" "}
            connects you directly with the team coordinating your freight. Shipment visibility and
            private document tools will appear here as those integrations are activated for your
            account.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/request-capacity"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Request capacity
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <a
            href={site.phoneHref}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            Call dispatch
          </a>
        </div>
      </section>

      <aside className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Current access
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Dispatch support</h3>
              <a
                href={`mailto:${site.dispatchEmail}`}
                className="mt-1 block break-all text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {site.dispatchEmail}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-border pt-4">
            <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Shipment documents</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Contact your coordinator for PODs, BOLs, invoices, COIs, or other load records.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
