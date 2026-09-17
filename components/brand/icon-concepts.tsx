import { cn } from "@/lib/utils"

type IconProps = { className?: string; monochrome?: boolean; animated?: boolean }

function green(monochrome?: boolean) {
  return monochrome ? "currentColor" : "var(--status-ok)"
}

/* STACKED DECKS. Flatbed decks stacked in isometric — the live load on top runs
   green. Same dimensional language as heavy-haul equipment, but ownable. */
export function StackedDecksMark({ className, monochrome, animated }: IconProps) {
  const cx = 24
  const rx = 17
  const ry = 8.5
  const deck = (cy: number) => `M${cx} ${cy - ry} L${cx + rx} ${cy} L${cx} ${cy + ry} L${cx - rx} ${cy} Z`
  return (
    <svg viewBox="0 0 48 44" className={className} role="img" aria-label="Five Nines stacked decks">
      <path d={deck(31)} fill="currentColor" opacity={0.25} />
      <path d={deck(23)} fill="currentColor" opacity={0.5} />
      <path
        d={deck(14)}
        fill={green(monochrome)}
        className={cn(animated && !monochrome && "motion-safe:animate-pulse")}
      />
    </svg>
  )
}

/* GRID OF NINE. A 3x3 grid of nine — the last one live green. "Nines" made
   literal; rack-unit / server-room energy. */
export function GridOfNineMark({ className, monochrome, animated }: IconProps) {
  const cells = [] as { x: number; y: number; live: boolean }[]
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push({ x: 5 + c * 15, y: 5 + r * 15, live: r === 2 && c === 2 })
    }
  }
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Five Nines grid of nine">
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={11}
          height={11}
          rx={2}
          fill={cell.live ? green(monochrome) : "currentColor"}
          className={cn(cell.live && animated && !monochrome && "motion-safe:animate-pulse")}
        />
      ))}
    </svg>
  )
}

/* VIEWFINDER. Four corner brackets locked on a live green core — a viewfinder
   that never loses the load. */
export function ViewfinderMark({ className, monochrome, animated }: IconProps) {
  const m = 6
  const t = 5
  const L = 15
  const s = 48
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Five Nines viewfinder">
      <g fill="currentColor">
        {/* top-left */}
        <rect x={m} y={m} width={L} height={t} rx={1} />
        <rect x={m} y={m} width={t} height={L} rx={1} />
        {/* top-right */}
        <rect x={s - m - L} y={m} width={L} height={t} rx={1} />
        <rect x={s - m - t} y={m} width={t} height={L} rx={1} />
        {/* bottom-left */}
        <rect x={m} y={s - m - t} width={L} height={t} rx={1} />
        <rect x={m} y={s - m - L} width={t} height={L} rx={1} />
        {/* bottom-right */}
        <rect x={s - m - L} y={s - m - t} width={L} height={t} rx={1} />
        <rect x={s - m - t} y={s - m - L} width={t} height={L} rx={1} />
      </g>
      <rect
        x={18}
        y={18}
        width={12}
        height={12}
        rx={3}
        fill={green(monochrome)}
        className={cn(animated && !monochrome && "motion-safe:animate-pulse")}
      />
    </svg>
  )
}
