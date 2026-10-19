import { hubs } from "@/lib/site"
import { MAP_VIEWBOX, labelPosition, mapLinks, mapNodes } from "@/lib/gateway-map"

export function CoverageMap() {
  return (
    <div className="relative flex h-full flex-col rounded-xl border border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Gateway Network
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-status-ok">{hubs.length} hubs live</span>
      </div>

      <svg viewBox={MAP_VIEWBOX} className="w-full flex-1" role="img" aria-label="Five Nines Logistics gateway network map">
        {mapLinks.map(([a, b]) => {
          const from = mapNodes[a]
          const to = mapNodes[b]
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="stroke-primary/25"
              strokeWidth="0.4"
            />
          )
        })}

        {hubs.map((hub) => {
          const pos = mapNodes[hub.code]
          if (!pos) return null
          const label = labelPosition(pos)
          return (
            <g key={hub.code}>
              <circle cx={pos.x} cy={pos.y} r="2.2" className="fill-background stroke-primary" strokeWidth="0.6" />
              <circle cx={pos.x} cy={pos.y} r="0.9" className="fill-primary" />
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                className="fill-foreground font-mono"
                style={{ fontSize: "3.3px" }}
              >
                {hub.code}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="border-t border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          2,400+ monitored lanes &middot; routed in real time
        </p>
      </div>
    </div>
  )
}
