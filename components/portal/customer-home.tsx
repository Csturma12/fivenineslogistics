import Link from "next/link"
import { ArrowRight, FileText, ShieldCheck, Download, Phone } from "lucide-react"
import { lanes, site } from "@/lib/site"
import { cn } from "@/lib/utils"

const toneByStatus = {
  "ON SCHEDULE": "muted",
  ARRIVING: "ok",
  MONITORING: "warn",
} as const

const stats = [
  { n: "5", l: "In transit" },
  { n: "1", l: "Arriving today" },
  { n: "1", l: "Monitoring" },
  { n: "0", l: "Exceptions" },
] as const

const documents = [
  { id: "LN-1187", kind: "POD", note: "HOU → BTR · signed 09:05" },
  { id: "LN-2291", kind: "BOL", note: "HOU → DFW · tendered" },
  { id: "INV-4402", kind: "Invoice", note: "March · net 30" },
  { id: "COI-0119", kind: "COI", note: "Gulfstream Fab · holder added" },
] as const

export function CustomerHome({ company }: { company: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-5">
            <div className="text-3xl font-semibold tracking-tight text-foreground">{s.n}</div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* Active shipments */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-wider text-foreground">
            Active shipments
          </h2>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {company}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {lanes.map((lane) => {
            const tone = toneByStatus[lane.status]
            return (
              <div
                key={lane.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 font-mono text-[11px]",
                  tone === "warn"
                    ? "border-[color:var(--status-warn)]/40 bg-[color:var(--status-warn)]/8"
                    : "border-border",
                )}
              >
                <span className="min-w-0 truncate tracking-wider text-foreground">
                  {lane.id} <span className="text-muted-foreground">· {lane.route}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 tracking-wider",
                    tone === "ok" && "text-[color:var(--status-ok)]",
                    tone === "warn" && "text-[color:var(--status-warn)]",
                    tone === "muted" && "text-muted-foreground",
                  )}
                >
                  {lane.status} · {lane.eta}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href="/request-capacity"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request capacity
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <a
            href={site.phoneHref}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:bg-secondary"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            Call dispatch
          </a>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className="flex scroll-mt-24 flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-wider text-foreground">Documents</h2>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Request · review · approve
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Shipment records and company compliance documents are handled separately. Load-specific
          records will sync from the TMS. Authority, insurance, entity, and other compliance files
          must be requested by a signed-in customer and approved before access is granted.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3 opacity-70"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] tracking-wider text-foreground">
                  {doc.kind} · {doc.id}
                </div>
                <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {doc.note}
                </div>
              </div>
              <a
                href={`mailto:${site.dispatchEmail}?subject=Document request: ${doc.kind} ${doc.id}`}
                className="flex min-h-9 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                aria-label={`Request ${doc.kind} ${doc.id}`}
              >
                <Download className="size-3" aria-hidden="true" />
                Request
              </a>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-start gap-2 rounded-lg border border-border bg-background p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            For now, requests are reviewed and fulfilled by your coordinator. The next portal phase
            will add customer-specific approvals, an audit record, private storage, and time-limited
            download links. Sensitive legal documents will never be posted in the public site library.
          </p>
        </div>
      </section>
    </div>
  )
}
