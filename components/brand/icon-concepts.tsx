import { cn } from "@/lib/utils"

type IconProps = { className?: string; monochrome?: boolean; animated?: boolean }

function green(monochrome?: boolean) {
  return monochrome ? "currentColor" : "var(--status-ok)"
}

/* STACKED PLATES. Flat-top hexagonal plates, each extruded to a real edge —
   the Blackbox layered-plate lineage, sharpened into true dimensional depth.
   The live load on top runs green; the plates below fall back to weight.
   Same geometry from favicon to gate. */
export function StackedDecksMark({ className, monochrome, animated }: IconProps) {
  const cx = 24
  const w = 16 // half-width to the flat side points
  const h = 7 // half-height to the top/bottom points (flat, plate-like)
  const d = 3.6 // extruded thickness of each plate edge

  // Flat-top hexagon top face, centered at (cx, cy).
  const topFace = (cy: number) =>
    `M${cx - w} ${cy} L${cx - w / 2} ${cy - h} L${cx + w / 2} ${cy - h} L${cx + w} ${cy} L${cx + w / 2} ${cy + h} L${cx - w / 2} ${cy + h} Z`
  // Front-facing thickness band below the lower edge of the hexagon.
  const sideFace = (cy: number) =>
    `M${cx - w} ${cy} L${cx - w / 2} ${cy + h} L${cx + w / 2} ${cy + h} L${cx + w} ${cy} L${cx + w} ${cy + d} L${cx + w / 2} ${cy + h + d} L${cx - w / 2} ${cy + h + d} L${cx - w} ${cy + d} Z`

  const g = green(monochrome)
  const plate = (cy: number, topOpacity: number, sideOpacity: number, fill: string, pulse = false) => (
    <>
      <path d={sideFace(cy)} fill={fill} opacity={sideOpacity} />
      <path
        d={topFace(cy)}
        fill={fill}
        opacity={topOpacity}
        className={cn(pulse && animated && !monochrome && "motion-safe:animate-pulse")}
      />
    </>
  )

  return (
    <svg viewBox="0 0 48 44" className={className} role="img" aria-label="Five Nines stacked plates">
      {/* back-to-front: bottom plate first, live green plate on top */}
      {plate(30, 0.26, 0.16, "currentColor")}
      {plate(22, 0.52, 0.34, "currentColor")}
      {plate(14, 1, 0.6, g, true)}
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
