/* Five orbital ellipses at 36deg increments (an ellipse repeats every 180deg,
   so 5 evenly-spaced orbits = 36deg apart) form an atom-style rosette. Five
   orbits = five nines; the nucleus hub = mechanical precision. Single-color
   stroke: themes off --primary, scales down, and reproduces one-color on a
   decal, embroidery, or invoice. */
const ORBIT_ANGLES = [0, 36, 72, 108, 144]

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
      <g className={animated ? "animate-index-spin" : undefined}>
        <g
          className="stroke-primary"
          fill="none"
          strokeWidth={1.4}
        >
          {ORBIT_ANGLES.map((angle) => (
            <ellipse
              key={angle}
              cx="16"
              cy="16"
              rx="13"
              ry="5"
              transform={`rotate(${angle} 16 16)`}
            />
          ))}
        </g>
      </g>
      <circle cx="16" cy="16" r="2.4" className="fill-primary" />
    </svg>
  )
}
