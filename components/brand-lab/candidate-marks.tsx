import { cn } from "@/lib/utils"

type MarkProps = { className?: string; animated?: boolean; monochrome?: boolean }

function LiveNode({ cx, cy, animated = false, monochrome = false }: { cx: number; cy: number; animated?: boolean; monochrome?: boolean }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="5"
      className={cn(monochrome ? "fill-current" : "fill-[color:var(--status-ok)]", animated && !monochrome && "motion-safe:animate-pulse")}
    />
  )
}

export function HybridPlateMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 120 72" className={className} role="img" aria-label="5N five-node network machinery plate">
      <rect x="2" y="2" width="116" height="68" rx="7" className="fill-[color:var(--navy)] stroke-current" strokeWidth="2" />
      <circle cx="10" cy="10" r="2" className="fill-background/70" /><circle cx="110" cy="10" r="2" className="fill-background/70" />
      <circle cx="10" cy="62" r="2" className="fill-background/70" /><circle cx="110" cy="62" r="2" className="fill-background/70" />
      <text x="15" y="49" className="fill-[color:var(--navy-foreground)] font-mono text-[36px] font-black tracking-[-0.08em]">5N</text>
      <g className="text-[color:var(--navy-foreground)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M72 51 80 36 92 45 103 25 86 18 80 36" />
      </g>
      <g className="fill-[color:var(--navy-foreground)]"><circle cx="72" cy="51" r="4"/><circle cx="80" cy="36" r="4"/><circle cx="86" cy="18" r="4"/><circle cx="92" cy="45" r="4"/></g>
      <LiveNode cx={103} cy={25} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

export function NetworkFiveMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Five-node logistics network">
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 37 27 14 57 21 52 53 24 58 13 37Z" />
        <path d="M27 14 52 53M13 37l44-16M24 58l33-37" />
      </g>
      <g className="fill-current"><circle cx="13" cy="37" r="7"/><circle cx="27" cy="14" r="7"/><circle cx="24" cy="58" r="7"/><circle cx="52" cy="53" r="7"/></g>
      <LiveNode cx={57} cy={21} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

export function SerialPlateMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 120 72" className={className} role="img" aria-label="5N serial number equipment plate">
      <rect x="2" y="2" width="116" height="68" rx="6" className="fill-[color:var(--navy)] stroke-current" strokeWidth="2" />
      <path d="M11 13h98M11 59h98" className="stroke-[color:var(--navy-foreground)]/35" />
      <text x="13" y="47" className="fill-[color:var(--navy-foreground)] font-mono text-[42px] font-black tracking-[-0.08em]">5N</text>
      <text x="75" y="26" className="fill-[color:var(--navy-foreground)] font-mono text-[8px] font-bold tracking-[0.18em]">SERIES</text>
      <text x="75" y="47" className="fill-[color:var(--navy-foreground)]/65 font-mono text-[7px] tracking-[0.12em]">LOGISTICS</text>
      <LiveNode cx={105} cy={21} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

export function SignalFiveMark(props: MarkProps) {
  return <NetworkFiveMark {...props} />
}

/* Nine cells, the ninth live green. "Nines" made literal — server-rack / rack-unit energy. */
export function GridNineMark({ className, animated, monochrome }: MarkProps) {
  const cells = [4, 26, 48].flatMap((y) => [4, 26, 48].map((x) => ({ x, y })))
  return (
    <svg viewBox="0 0 70 70" className={className} role="img" aria-label="Nine-cell rack, ninth cell live">
      {cells.map((c, i) => {
        const isLive = i === cells.length - 1
        return (
          <rect
            key={`${c.x}-${c.y}`}
            x={c.x}
            y={c.y}
            width={18}
            height={18}
            rx={4}
            className={cn(isLive && !monochrome ? undefined : "fill-current", isLive && animated && !monochrome && "motion-safe:animate-pulse")}
            style={isLive && !monochrome ? { fill: "var(--status-ok)" } : undefined}
          />
        )
      })}
    </svg>
  )
}

/* Four corner brackets locked on a live green core — a viewfinder that never loses the load. */
export function ViewfinderMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Viewfinder locked on a live core">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="square">
        <path d="M8 22V8h14M64 22V8H50M8 50v14h14M64 50v14H50" />
      </g>
      <rect
        x="27"
        y="27"
        width="18"
        height="18"
        rx="4"
        className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
        style={monochrome ? undefined : { fill: "var(--status-ok)" }}
      />
    </svg>
  )
}

/* Flatbed decks stacked in isometric — the live load rides on top in green. */
export function IsoStackMark({ className, animated, monochrome }: MarkProps) {
  const layers = [46, 37, 28]
  const w = 26
  const h = 13
  const cx = 36
  const diamond = (cy: number) => `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`
  return (
    <svg viewBox="0 0 72 66" className={className} role="img" aria-label="Stacked freight decks, top deck live">
      {layers.map((cy, i) => {
        const isTop = i === layers.length - 1
        return (
          <polygon
            key={cy}
            points={diamond(cy)}
            className={cn(isTop && !monochrome ? undefined : "fill-current", isTop && animated && !monochrome && "motion-safe:animate-pulse")}
            style={isTop && !monochrome ? { fill: "var(--status-ok)" } : undefined}
            opacity={monochrome || isTop ? 1 : 0.35 + i * 0.22}
          />
        )
      })}
    </svg>
  )
}

/* Ultra-condensed heavyweight 5N — no metaphor, just weight. The kind of mark you weld onto a gate. */
export function CondensedWordmark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="5N heavy wordmark">
      <text x="2" y="56" className="font-mono text-[58px] font-black tracking-[-0.1em]">
        <tspan className="fill-current">5</tspan>
        <tspan
          className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
          style={monochrome ? undefined : { fill: "var(--status-ok)" }}
        >
          N
        </tspan>
      </text>
    </svg>
  )
}

/* E meets the wordmark — viewfinder brackets framing the 5N itself. The load kept in frame is the name. */
export function BracketLockupMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 120 72" className={className} role="img" aria-label="5N locked in a viewfinder frame">
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square">
        <path d="M6 20V6h16M114 20V6H98M6 52v14h16M114 52v14H98" />
      </g>
      <text x="60" y="50" textAnchor="middle" className="font-mono text-[38px] font-black tracking-[-0.08em]">
        <tspan className="fill-current">5</tspan>
        <tspan
          className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
          style={monochrome ? undefined : { fill: "var(--status-ok)" }}
        >
          N
        </tspan>
      </text>
    </svg>
  )
}

/* Nameplate family, made physical — a pointed freight hang tag with a punch hole and a status lamp. */
export function AssetTagMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 120 72" className={className} role="img" aria-label="5N freight hang tag">
      <path
        d="M30 6h80a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H30L6 40 30 6Z"
        className="fill-[color:var(--navy)] stroke-current"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="40" r="5" fill="none" className="stroke-[color:var(--navy-foreground)]/70" strokeWidth="3" />
      <text x="42" y="52" className="fill-[color:var(--navy-foreground)] font-mono text-[34px] font-black tracking-[-0.08em]">5N</text>
      <LiveNode cx={104} cy={20} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

/* Round sibling of E — a targeting reticle locked on a live core. */
export function ReticleMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Reticle locked on a live core">
      <circle cx="36" cy="36" r="26" fill="none" className="stroke-current" strokeWidth="5" />
      <g className="stroke-current" strokeWidth="5" strokeLinecap="square">
        <path d="M36 3v13M36 56v13M3 36h13M56 36h13" />
      </g>
      <circle
        cx="36"
        cy="36"
        r="8"
        className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
        style={monochrome ? undefined : { fill: "var(--status-ok)" }}
      />
    </svg>
  )
}

/* E variant — the brackets hold a live load bar instead of a point. Reads as the shipment riding the bed. */
export function ViewfinderLoadMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Viewfinder holding a live load">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="square">
        <path d="M8 22V8h14M64 22V8H50M8 50v14h14M64 50v14H50" />
      </g>
      <rect
        x="22"
        y="31"
        width="28"
        height="10"
        rx="5"
        className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
        style={monochrome ? undefined : { fill: "var(--status-ok)" }}
      />
    </svg>
  )
}

/* E variant — brackets plus a converging crosshair on a tight core. More precision-instrument. */
export function ViewfinderCrossMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Viewfinder crosshair on a live core">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="square">
        <path d="M8 22V8h14M64 22V8H50M8 50v14h14M64 50v14H50" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M36 15v9M36 48v9M15 36h9M48 36h9" />
      </g>
      <rect
        x="30"
        y="30"
        width="12"
        height="12"
        rx="3"
        className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
        style={monochrome ? undefined : { fill: "var(--status-ok)" }}
      />
    </svg>
  )
}

/* B variant — five waypoints on one shipment route, the destination live. A path, not a generic mesh. */
export function RouteFiveMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Five-stop shipment route, destination live">
      <path d="M10 52 26 38 37 54 52 28 62 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="fill-current"><circle cx="10" cy="52" r="6"/><circle cx="26" cy="38" r="6"/><circle cx="37" cy="54" r="6"/><circle cx="52" cy="28" r="6"/></g>
      <LiveNode cx={62} cy={14} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

/* B variant — the five nodes trace the numeral 5. The network literally becomes the name. */
export function NodeFiveMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Five nodes tracing the numeral five">
      <path d="M46 12 H16 V33 L44 40 20 60" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="fill-current"><circle cx="46" cy="12" r="6"/><circle cx="16" cy="12" r="6"/><circle cx="16" cy="33" r="6"/><circle cx="44" cy="40" r="6"/></g>
      <LiveNode cx={20} cy={60} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

/* J variant — an open lock ring that reads as a status dial, core seated inside. More gauge than crosshair. */
export function GaugeLockMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Open lock gauge on a live core">
      <path d="M45 12.4 A26 26 0 1 0 27 12.4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <circle
        cx="36"
        cy="36"
        r="8"
        className={cn(monochrome ? "fill-current" : undefined, animated && !monochrome && "motion-safe:animate-pulse")}
        style={monochrome ? undefined : { fill: "var(--status-ok)" }}
      />
    </svg>
  )
}

/* J variant — a bearing ring with a needle locked onto the live destination. Tracking a heading. */
export function CompassLockMark({ className, animated, monochrome }: MarkProps) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="Bearing ring locked on a live node">
      <circle cx="36" cy="36" r="26" fill="none" className="stroke-current" strokeWidth="5" />
      <path d="M36 36 54 18" fill="none" className="stroke-current" strokeWidth="4" strokeLinecap="round" />
      <circle cx="36" cy="36" r="4" className="fill-current" />
      <LiveNode cx={54} cy={18} animated={animated} monochrome={monochrome} />
    </svg>
  )
}

export function MarkApplication({ children, label, dark = false }: { children: React.ReactNode; label: string; dark?: boolean }) {
  return <div className={cn("flex min-h-28 flex-col justify-between gap-4 rounded-lg border border-border p-4", dark ? "bg-[color:var(--navy)] text-[color:var(--navy-foreground)]" : "bg-card text-foreground")}><span className="font-mono text-[9px] uppercase tracking-wider opacity-60">{label}</span>{children}</div>
}
