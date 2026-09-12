import { heroSpec, site } from "@/lib/site"

// Illustrative strip of the standard we run to — not a measured trailing record.
// One flagged cell represents the kind of exception we plan for and flag before
// it reaches the customer; the rest is the on-time bar we hold every load to.
function buildDayStatuses(days: number) {
  const flaggedIndex = Math.floor(days * 0.62)
  return Array.from({ length: days }, (_, i) => (i === flaggedIndex ? "watch" : "ok"))
}

const DAYS = 90
const dayStatuses = buildDayStatuses(DAYS)

export function ReliabilityMonitor() {
  return (
    <div className="rounded-xl border border-border bg-card/60 shadow-2xl shadow-black/40">
      {/* Panel chrome */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {site.name} LLC
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wider text-primary">Dispatch Live</span>
        </div>
      </div>

      {/* Headline metric */}
      <div className="border-b border-border px-5 py-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            99.999<span className="text-primary">%</span>
          </span>
        </div>
        <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          On-time reliability &middot; the standard we run to
        </p>
      </div>

      {/* Spec sheet */}
      <div className="border-b border-border px-5 py-5">
        <dl className="space-y-3">
          {heroSpec.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {row.label}
              </dt>
              <dd className="text-right font-mono text-xs text-foreground/90">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 90-day status strip */}
      <div className="px-5 py-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            How we hold five nines
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">exceptions flagged, not hidden</span>
        </div>
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
          {dayStatuses.map((status, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[2px] ${status === "ok" ? "bg-primary/70" : "bg-muted-foreground/50"}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          A year at five nines is 5 min 15 sec of exposure. We plan for zero &mdash; and flag the
          rare exception before you have to ask.
        </p>
      </div>
    </div>
  )
}
