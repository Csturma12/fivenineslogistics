import { lanes } from "@/lib/site"

type TickerItem = { label: string; value: string; accent?: boolean }

const signals: TickerItem[] = [
  { label: "On-time reliability, trailing 90 days", value: "99.999%", accent: true },
  { label: "Answer from dispatch, any hour", value: "< 1 hr" },
  { label: "Control tower coverage", value: "24 / 7 / 365" },
  { label: "Missed SLA windows, this quarter", value: "0" },
  { label: "Downtime per year at five nines", value: "5 min 15 sec" },
]

const laneItems: TickerItem[] = lanes.map((lane) => ({
  label: `${lane.id} · ${lane.route}`,
  value: lane.status === "ON SCHEDULE" ? lane.eta : `${lane.status} · ${lane.eta}`,
  accent: lane.status !== "ON SCHEDULE",
}))

const items: TickerItem[] = [...signals, ...laneItems]

function TickerRow() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, i) => (
        <div key={`${item.label}-${i}`} className="flex items-center">
          <span className="flex items-center gap-2 whitespace-nowrap px-5 font-mono text-[11px] uppercase tracking-wider">
            <span className="text-muted-foreground">{item.label}</span>
            <span className={item.accent ? "font-semibold text-primary" : "text-foreground"}>
              {item.value}
            </span>
          </span>
          <span aria-hidden="true" className="text-border">
            /
          </span>
        </div>
      ))}
    </div>
  )
}

export function StatusTicker() {
  const summary = items.map((i) => `${i.label} ${i.value}`).join(", ")

  return (
    <div className="border-b border-border/60 bg-background">
      <div className="flex items-center">
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-border/60 bg-background px-4 py-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
            Dispatch Live
          </span>
        </div>

        <div className="group relative flex-1 overflow-hidden py-2">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            <TickerRow />
            <TickerRow />
          </div>
          <span className="sr-only">{summary}</span>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </div>
  )
}
