/* SIGNAL FIVE. Five ascending bars — the fifth (the "ninth nine") runs signal
   green, the rest inherit currentColor. It counts to five, reads as a full
   signal at nominal ("always up"), and holds up as a 16px favicon or a decal on
   a trailer door. The green bar is the one place the control-room status color
   lives inside the identity: navy is the brand, green means up. */
const BARS = [
  { x: 2, h: 8 },
  { x: 8, h: 13 },
  { x: 14, h: 18 },
  { x: 20, h: 23 },
  { x: 26, h: 28 },
]
const BASELINE = 30

export function FiveNinesMark({
  className,
  animated = false,
}: {
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Five Nines"
      xmlns="http://www.w3.org/2000/svg"
    >
      {BARS.map((b, i) => {
        const isSignal = i === BARS.length - 1
        return (
          <rect
            key={b.x}
            x={b.x}
            y={BASELINE - b.h}
            width={4}
            height={b.h}
            rx={1}
            className={
              isSignal
                ? `fill-status-ok-dark${animated ? " animate-pulse motion-reduce:animate-none" : ""}`
                : "fill-current"
            }
          />
        )
      })}
    </svg>
  )
}
