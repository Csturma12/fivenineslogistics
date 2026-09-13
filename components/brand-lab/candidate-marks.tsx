import { cn } from "@/lib/utils"

/* Candidate marks for the Five Nines identity. Each is single-color off the
   theme's --primary (Signal red) with the rest on currentColor, so every mark
   reproduces one-color on a decal, hard hat, or invoice and scales to a 16px
   favicon. These are exploration components, not yet wired into the live site. */

/* A — SIGNAL FIVE. Five ascending bars, the fifth (the "ninth nine") running
   red. Reads as "full signal, always up" and literally counts to five. */
export function SignalFiveMark({ className }: { className?: string }) {
  const bars = [
    { x: 2, h: 8 },
    { x: 8, h: 13 },
    { x: 14, h: 18 },
    { x: 20, h: 23 },
    { x: 26, h: 28 },
  ]
  const baseline = 30
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Five Nines"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={baseline - b.h}
          width={4}
          height={b.h}
          rx={1}
          className={i === bars.length - 1 ? "fill-primary" : "fill-current"}
        />
      ))}
    </svg>
  )
}

/* B — BREAKER ON. A breaker thrown up into the green... in our case red-on.
   Power stays on, freight keeps moving — UPS-room language every facilities
   buyer reads instantly. */
export function BreakerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Five Nines"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="9"
        y="3"
        width="14"
        height="26"
        rx="7"
        className="fill-none stroke-current"
        strokeWidth={2}
      />
      <rect x="12.5" y="6.5" width="7" height="10" rx="3.5" className="fill-primary" />
    </svg>
  )
}

/* C — 5N SPEC PLATE. A monogram tile like the rating nameplate on a
   transformer or mill motor — with a stamped red corner notch. */
export function FiveNTile({
  className,
  textClassName,
}: {
  className?: string
  textClassName?: string
}) {
  return (
    <div className={cn("relative grid place-items-center overflow-hidden rounded-md bg-foreground", className)}>
      <span className={cn("font-mono font-bold leading-none tracking-tight text-background", textClassName)}>
        5N
      </span>
      <span className="absolute bottom-0 right-0 h-[26%] w-[26%] bg-primary" aria-hidden="true" />
    </div>
  )
}
