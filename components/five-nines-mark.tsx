const BLADE_ANGLES = [0, 72, 144, 216, 288]

/**
 * Five Nines mark — five "9" glyphs arranged as a rotor.
 * Each blade is literally a 9 (loop at the tip, tail sweeping toward the hub),
 * so the mark spells the brand: five nines. The shared tail sweep reads as
 * rotation (freight in motion); the center hub reads as mechanical precision.
 * Single-color stroke: themes off --primary, scales down, and reproduces
 * one-color on a decal, embroidery, or invoice.
 */
export function FiveNinesMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Five Nines"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        className="stroke-primary"
        fill="none"
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {BLADE_ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 16 16)`}>
            {/* loop of the 9, at the outer tip */}
            <circle cx="16" cy="5.9" r="3.3" />
            {/* long, mostly-straight tail descending toward the hub with a
                slight clockwise lean, so each blade reads as a numeral 9 */}
            <path d="M19.3 6.7 C 19.9 10.5, 18.9 13, 16.7 14.6" />
          </g>
        ))}
      </g>
      <circle cx="16" cy="16" r="1.7" className="fill-primary" />
    </svg>
  )
}
