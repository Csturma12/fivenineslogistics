import Link from "next/link"
import { ArrowRight, Upload, CheckCircle2, Truck } from "lucide-react"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const stats = [
  { n: "2", l: "Offered to you" },
  { n: "1", l: "Active haul" },
  { n: "1", l: "Pending pay" },
  { n: "$2,050", l: "Next settlement" },
] as const

const offered = [
  {
    lane: "HOU → DFW · FLATBED · 44K",
    note: "Pickup 06:00 · switchgear, tarped",
    pay: "$1,180",
  },
  {
    lane: "HOU → BTR · HOTSHOT · 8K",
    note: "Same day · valve skid, refinery TAR",
    pay: "$740",
  },
] as const

const active = [
  { id: "LN-3402", lane: "PORT → HOU", note: "In transit · ETA 6 min", pay: "$620" },
] as const

const settlements = [
  { id: "LN-1187", note: "POD received", status: "Pays Fri", pay: "$2,050", tone: "ok" as const },
  { id: "LN-0942", note: "Invoice under review", status: "Processing", pay: "$1,340", tone: "muted" as const },
] as const

export function CarrierHome({ company }: { company: string }) {
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Offered freight */}
        <section className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-navy/40 bg-navy p-6 text-navy-foreground">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-xs uppercase tracking-wider">Offered to you</h2>
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
              {company} · setup complete
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {offered.map((o) => (
              <div
                key={o.lane}
                className="flex items-center justify-between gap-3 rounded-lg border border-navy-foreground/15 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <div className="font-mono text-[11px] tracking-wider">{o.lane}</div>
                  <div className="mt-0.5 truncate text-[11px] text-navy-foreground/55">{o.note}</div>
                </div>
                <div className="shrink-0 font-mono text-sm font-semibold text-[color:var(--status-ok-dark)]">
                  {o.pay}
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/50">
              Active haul
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {active.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-navy-foreground/15 px-3.5 py-3 font-mono text-[11px]"
                >
                  <span className="min-w-0 truncate tracking-wider">
                    {a.id} <span className="text-navy-foreground/55">· {a.lane}</span>
                  </span>
                  <span className="shrink-0 tracking-wider text-navy-foreground/70">{a.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--status-ok-dark)] py-2.5 font-mono text-[11px] uppercase tracking-wider text-navy transition-opacity hover:opacity-90"
            >
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              Accept load
            </button>
            <button
              type="button"
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-navy-foreground/25 py-2.5 font-mono text-[11px] uppercase tracking-wider text-navy-foreground transition-colors hover:bg-navy-foreground/5"
            >
              <Upload className="size-3.5" aria-hidden="true" />
              Upload POD
            </button>
          </div>
        </section>

        {/* Settlements */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-foreground">Settlements</h2>
          <div className="flex flex-col gap-2">
            {settlements.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-1.5 rounded-lg border border-border px-3.5 py-3"
              >
                <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
                  <span className="tracking-wider text-foreground">{s.id}</span>
                  <span
                    className={cn(
                      "shrink-0 font-semibold tracking-wider",
                      s.tone === "ok" ? "text-[color:var(--status-ok)]" : "text-muted-foreground",
                    )}
                  >
                    {s.pay}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>{s.note}</span>
                  <span className="shrink-0">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/carriers"
            className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:bg-secondary"
          >
            <Truck className="size-3.5" aria-hidden="true" />
            Update availability
          </Link>
        </section>
      </div>

      {/* Onboarding / contact */}
      <section className="flex items-start gap-3 rounded-xl border border-border bg-card p-6">
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Questions on a settlement or your packet? Reach carrier relations at{" "}
          <a
            href={`mailto:${site.carriersEmail}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {site.carriersEmail}
          </a>{" "}
          or call dispatch at{" "}
          <a
            href={site.phoneHref}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {site.phone}
          </a>
          .
        </p>
      </section>
    </div>
  )
}
