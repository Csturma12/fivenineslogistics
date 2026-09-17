/* BRAND-LAB TRIAL — Direction 01, "Forged 5N", running live for a day or two.
   A merged 5N monogram: a bold blocky "5" in currentColor (dark on light,
   white knockout on navy) interlocking over a green "N" that sits behind it.
   Built as a real 5 (flat top bar, hard corners, lower-right bowl stem) so it
   never reads as an S. If we don't commit, revert header/footer to
   <FiveNinesPlate /> (and ultimately <FiveNinesMark />). */
export function FiveNinesForged({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 140 122"
      className={className}
      role="img"
      aria-label="Five Nines Logistics"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* N — green, sits behind the 5 */}
      <g className="fill-[color:var(--status-ok)]">
        {/* left vertical */}
        <path d="M58 6 H80 V116 H58 Z" />
        {/* right vertical */}
        <path d="M106 6 H128 V116 H106 Z" />
        {/* diagonal */}
        <path d="M58 6 H78 L128 116 H108 Z" />
      </g>

      {/* 5 — currentColor, drawn on top so the overlap reads as an interlock */}
      <g className="fill-current">
        {/* top bar */}
        <path d="M6 6 H78 V28 H6 Z" />
        {/* upper-left stem */}
        <path d="M6 28 H26 V50 H6 Z" />
        {/* middle bar */}
        <path d="M6 50 H78 V72 H6 Z" />
        {/* lower-right bowl stem */}
        <path d="M56 72 H78 V94 H56 Z" />
        {/* bottom bar */}
        <path d="M6 94 H78 V116 H6 Z" />
      </g>
    </svg>
  )
}
