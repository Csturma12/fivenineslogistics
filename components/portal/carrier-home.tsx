import Link from "next/link"
import { ArrowRight, FileCheck2, Mail, Phone, ShieldCheck, Truck } from "lucide-react"
import { site } from "@/lib/site"

export function CarrierHome({ company }: { company: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <section className="flex flex-col justify-between gap-8 rounded-xl border border-navy/40 bg-navy p-6 text-navy-foreground sm:p-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Carrier access confirmed
          </div>
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Stay connected to carrier relations.
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-navy-foreground/65 sm:text-base">
            Approved access for <span className="font-medium text-navy-foreground">{company}</span>{" "}
            gives your team a direct route to Five Nines. Load offers, POD submission, and settlement
            visibility will appear here when those operating integrations are activated.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/carriers"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[color:var(--status-ok-dark)] px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-navy transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--status-ok-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            Update carrier details
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <a
            href={site.phoneHref}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-navy-foreground/25 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-navy-foreground transition-colors hover:bg-navy-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--status-ok-dark)]"
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
              <h3 className="text-sm font-semibold text-foreground">Carrier relations</h3>
              <a
                href={`mailto:${site.carriersEmail}`}
                className="mt-1 block break-all text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {site.carriersEmail}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-border pt-4">
            <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">PODs and settlements</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Send documents or settlement questions directly to carrier relations for handling.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-border pt-4">
            <Truck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Availability</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Keep your equipment, lanes, and availability current with our team.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
