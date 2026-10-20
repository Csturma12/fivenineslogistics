/* FLATBED FIVE. Companion mark to <FiveNinesMark /> (Signal Five) for the
   Carrier Portal. Shares the exact 32x32 grid, currentColor chassis/cab, and
   single signal-green (`var(--status-ok)`) freight block secured on the open
   deck so the Shipper (5-bars) and Carrier (flatbed) marks read as two sides
   of one industrial identity. */
export function FiveNinesFlatbedMark({
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
      aria-label="Five Nines Carrier Flatbed"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Secured open-deck cargo payload + tie-down notch in signal green */}
      <rect
        x="2"
        y="10"
        width="15"
        height="7"
        rx="1"
        className={animated ? "animate-pulse motion-reduce:animate-none" : undefined}
        style={{ fill: "var(--status-ok)" }}
      />
      {/* Headache rack + lowboy/flatbed deck rail + tractor cab */}
      <path
        d="M19 8h2v10h-2V8ZM22 10h4.6c.7 0 1.3.4 1.6 1l1.8 3.6c.1.3.2.6.2.9V21h-2.1a3.5 3.5 0 0 0-6.2 0H12.1a3.5 3.5 0 0 0-6.2 0H2v-2.5h17V18H2v-.5h20V10Zm2 2.2v3.3h3.8l-1.2-2.6c-.2-.4-.6-.7-1-.7H24Z"
        className="fill-current"
      />
      {/* Rear tandem / trailer axle wheel + front steer axle wheel */}
      <circle cx="9" cy="21.5" r="2.5" className="fill-current" />
      <circle cx="25" cy="21.5" r="2.5" className="fill-current" />
    </svg>
  )
}
