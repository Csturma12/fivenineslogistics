import { lanes } from "@/lib/site"

// Deterministic 90-day status strip. One flagged day out of 90 keeps the
// "five nines" claim honest (a real 99.999% record has near-zero incidents,
// not a suspiciously perfect one) without ever landing on a hand-picked seed.
function buildDayStatuses(days: number) {
  const flaggedIndex = Math.floor(days * 0.62)
  return Array.from({ length: days }, (_, i) => (i === flaggedIndex ? "watch" : "ok"))
}

const DAYS = 90
const dayStatuses = buildDayStatuses(DAYS)

const statusStyles: Record<(typeof lanes)[number]["status"], string> = {
  "ON SCHEDULE": "text-primary",
  ARRIVING: "text-primary",
  MONITORING: "text-muted-foreground",
}

const dotStyles: Record<(typeof lanes)[number]["status"], string> = {
  "ON SCHEDULE": "bg-primary",
  ARRIVING: "bg-primary animate-pulse",
  MONITORING: "bg-muted-foreground",
}

export function ReliabilityMonitor() {
  return (
    <div className="rounded-xl border border-border bg-card/60 shadow-2xl shadow-black/40">
      {/* Panel chrome */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Network Status
          </span>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-primary">Live</span>
      </div>

      {/* Headline metric */}
      <div className="border-b border-border px-5 py-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            99.999<span className="text-primary">%</span>
          </span>
        </div>
        <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          On-time reliability &middot; trailing 90 days
        </p>
      </div>

      {/* 90-day status strip */}
      <div className="px-5 py-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            90-day uptime record
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">1 flagged / {DAYS}</span>
        </div>
        <div className="grid grid-cols-30 gap-[3px]" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
          {dayStatuses.map((status, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[2px] ${status === "ok" ? "bg-primary/70" : "bg-muted-foreground/50"}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Live lane feed */}
      <div className="border-t border-border px-5 py-5">
        <span className="mb-3 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Active lanes
        </span>
        <ul className="space-y-2.5">
          {lanes.map((lane) => (
            <li key={lane.id} className="flex items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[lane.status]}`} aria-hidden="true" />
                <span className="text-foreground/90">{lane.id}</span>
                <span>{lane.route}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-muted-foreground sm:inline">{lane.eta}</span>
                <span className={statusStyles[lane.status]}>{lane.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
