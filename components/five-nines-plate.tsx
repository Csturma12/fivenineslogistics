/* BRAND-LAB TRIAL — Direction C, "5N Serial Plate", running live for a day or two.
   A bold 5N stamped on an industrial equipment nameplate: navy field, hairline
   stamp rules, serial-tag micro-labels, and one live green status node. The
   micro-text reads as texture at small sizes and as a real nameplate up close.
   If we don't commit to this, revert the header/footer back to <FiveNinesMark />. */
export function FiveNinesPlate({
  className,
  animated = false,
}: {
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      viewBox="0 0 120 72"
      className={className}
      role="img"
      aria-label="Five Nines Logistics"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="116" height="68" rx="6" className="fill-[color:var(--navy)] stroke-current" strokeWidth="2" />
      <path d="M11 13h98M11 59h98" className="stroke-[color:var(--navy-foreground)]/35" />
      <text x="13" y="47" className="fill-[color:var(--navy-foreground)] font-mono text-[42px] font-black tracking-[-0.08em]">5N</text>
      <text x="75" y="26" className="fill-[color:var(--navy-foreground)] font-mono text-[8px] font-bold tracking-[0.18em]">SERIES</text>
      <text x="75" y="47" className="fill-[color:var(--navy-foreground)]/65 font-mono text-[7px] tracking-[0.12em]">LOGISTICS</text>
      <circle
        cx="105"
        cy="21"
        r="5"
        className={animated ? "fill-[color:var(--status-ok)] motion-safe:animate-pulse" : "fill-[color:var(--status-ok)]"}
      />
    </svg>
  )
}
