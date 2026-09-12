const BLADE_ANGLES = [0, 72, 144, 216, 288]

/**
 * Five Nines mark — a five-blade pinwheel.
 * Five-fold symmetry reads as "five nines"; the swept blades read as motion
 * (freight moving); the center hub reads as mechanical precision.
 * Pure single-color silhouette: themes off --primary, scales to a favicon,
 * and reproduces one-color on a decal, embroidery, or invoice.
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
      <g className="fill-primary">
        {BLADE_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M16 16 L16 2.6 L22 8.2 Z"
            transform={`rotate(${angle} 16 16)`}
          />
        ))}
      </g>
      <circle cx="16" cy="16" r="3.8" className="fill-primary" />
      <circle cx="16" cy="16" r="1.5" className="fill-background" />
    </svg>
  )
}
