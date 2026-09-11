import { hubs } from "@/lib/site"

// Approximate relative positions (percent of viewBox) for each hub, arranged
// to read as a stylized US network map without depending on real geo data.
const positions: Record<string, { x: number; y: number }> = {
  SEA: { x: 12, y: 14 },
  LAX: { x: 14, y: 62 },
  DEN: { x: 40, y: 46 },
  DFW: { x: 46, y: 72 },
  ORD: { x: 62, y: 34 },
  ATL: { x: 74, y: 62 },
  MIA: { x: 84, y: 86 },
  EWR: { x: 90, y: 28 },
}

const links: [string, string][] = [
  ["SEA", "DEN"],
  ["SEA", "LAX"],
  ["LAX", "DEN"],
  ["LAX", "DFW"],
  ["DEN", "ORD"],
  ["DEN", "DFW"],
  ["DFW", "ATL"],
  ["ORD", "EWR"],
  ["ORD", "ATL"],
  ["ATL", "MIA"],
  ["ATL", "EWR"],
  ["EWR", "MIA"],
]

export function CoverageMap() {
  return (
    <div className="relative flex h-full flex-col rounded-xl border border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Gateway Network
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-primary">8 hubs live</span>
      </div>

      <svg viewBox="0 0 100 100" className="w-full flex-1" role="img" aria-label="Five Nines Logistics gateway network map">
        {links.map(([a, b]) => {
          const from = positions[a]
          const to = positions[b]
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
          const pos = positions[hub.code]
          if (!pos) return null
          return (
            <g key={hub.code}>
              <circle cx={pos.x} cy={pos.y} r="2.6" className="fill-background stroke-primary" strokeWidth="0.6" />
              <circle cx={pos.x} cy={pos.y} r="0.9" className="fill-primary" />
              <text
                x={pos.x}
                y={pos.y - 4.5}
                textAnchor="middle"
                className="fill-foreground font-mono"
                style={{ fontSize: "3.4px" }}
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
