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

type SerialTagProps = MarkProps & {
  variant?: "slate" | "steel"
  serial?: string
  status?: string
}

export function SerialPlateMark({
  className,
  animated,
  monochrome,
  variant = "slate",
  serial = "5N-04519",
  status = "LIVE · ON PLAN",
}: SerialTagProps) {
  const steel = variant === "steel"
  // Foreground ink + plate fill flip between anodized-navy and etched-steel.
  const ink = steel ? "var(--foreground)" : "var(--navy-foreground)"
  const plate = steel ? "var(--card)" : "var(--navy)"

  return (
    <svg viewBox="0 0 220 100" className={className} role="img" aria-label={`Five Nines equipment serial tag ${serial}`}>
      {/* stamped plate + engraved inner frame */}
      <rect x="3" y="3" width="214" height="94" rx="11" fill={plate} stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="12" width="196" height="76" rx="6" fill="none" stroke={ink} strokeOpacity="0.28" strokeWidth="1" />

      {/* corner rivets */}
      <g fill={ink} fillOpacity="0.4">
        <circle cx="20" cy="20" r="2.4" /><circle cx="200" cy="20" r="2.4" />
        <circle cx="20" cy="80" r="2.4" /><circle cx="200" cy="80" r="2.4" />
      </g>

      {/* header strip */}
      <text x="28" y="28" fill={ink} fillOpacity="0.7" className="font-mono text-[6.5px] font-bold tracking-[0.12em]">
        FIVE NINES LOGISTICS
      </text>
      <text x="192" y="28" textAnchor="end" fill={ink} fillOpacity="0.45" className="font-mono text-[6.5px] tracking-[0.08em]">
        MC# 841023
      </text>

      {/* stamped 5N */}
      <text x="28" y="76" fill={ink} className="font-condensed text-[46px] font-black tracking-[-0.06em]">
        5N
      </text>

      {/* divider */}
      <path d="M118 36V80" stroke={ink} strokeOpacity="0.22" strokeWidth="1" />

      {/* serial + status block */}
      <text x="130" y="46" fill={ink} fillOpacity="0.5" className="font-mono text-[6.5px] tracking-[0.2em]">
        SERIAL
      </text>
      <text x="130" y="62" fill={ink} className="font-mono text-[13px] font-bold tracking-[0.04em]">
        {serial}
      </text>
      <LiveNode cx={133} cy={74} animated={animated} monochrome={monochrome} />
      <text
        x="142"
        y="77"
        className={cn(
          "font-mono text-[6.5px] font-bold tracking-[0.16em]",
          monochrome ? "fill-current" : "fill-[color:var(--status-ok)]",
        )}
      >
        {status}
      </text>
    </svg>
  )
}

export function SignalFiveMark(props: MarkProps) {
  return <NetworkFiveMark {...props} />
}

export function MarkApplication({ children, label, dark = false }: { children: React.ReactNode; label: string; dark?: boolean }) {
  return <div className={cn("flex min-h-28 flex-col justify-between gap-4 rounded-lg border border-border p-4", dark ? "bg-[color:var(--navy)] text-[color:var(--navy-foreground)]" : "bg-card text-foreground")}><span className="font-mono text-[9px] uppercase tracking-wider opacity-60">{label}</span>{children}</div>
}
