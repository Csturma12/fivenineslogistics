/* BRAND-LAB TRIAL — Direction 01, "Forged 5N".
   A true merged 5 + N monogram with a transparent diagonal cut and a green
   status cap. Revert header/footer to FiveNinesPlate if the trial is retired. */
export function FiveNinesForged({
  className,
  animated = false,
  monochrome = false,
}: {
  className?: string
  animated?: boolean
  monochrome?: boolean
}) {
  return (
    <svg
      viewBox="0 0 132 100"
      className={className}
      role="img"
      aria-label="Five Nines Logistics"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="fill-current">
        {/* A hard-cornered 5: top rail, upper stem, waist, lower stem, and foot. */}
        <path d="M10 8H67V27H26V39H58L76 57V92H18L10 84V67H57V58H10V16Z" />

        {/* N body. The gap between this path and the 5 creates the forged cut. */}
        <path d="M70 8H91V43L74 26V8ZM94 8H122V92H101L60 50V33L101 74V27H94V8Z" />
      </g>

      {/* Status cap: the only brand accent, matching the supplied identity sheet. */}
      <rect
        x="101"
        y="8"
        width="21"
        height="19"
        className={monochrome ? "fill-current" : animated ? "fill-[color:var(--status-ok)] motion-safe:animate-pulse" : "fill-[color:var(--status-ok)]"}
      />
    </svg>
  )
}
