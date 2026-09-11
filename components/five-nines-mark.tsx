export function FiveNinesMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="7" className="fill-primary/10 stroke-primary/40" />
      <g className="fill-primary">
        <rect x="7" y="18" width="3" height="7" rx="0.5" />
        <rect x="11.5" y="14.5" width="3" height="10.5" rx="0.5" />
        <rect x="16" y="10.5" width="3" height="14.5" rx="0.5" />
        <rect x="20.5" y="7" width="3" height="18" rx="0.5" />
        <rect x="25" y="12" width="3" height="13" rx="0.5" />
      </g>
    </svg>
  )
}
