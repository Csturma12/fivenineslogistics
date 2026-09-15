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

export function MarkApplication({ children, label, dark = false }: { children: React.ReactNode; label: string; dark?: boolean }) {
  return <div className={cn("flex min-h-28 flex-col justify-between gap-4 rounded-lg border border-border p-4", dark ? "bg-[color:var(--navy)] text-[color:var(--navy-foreground)]" : "bg-card text-foreground")}><span className="font-mono text-[9px] uppercase tracking-wider opacity-60">{label}</span>{children}</div>
}
