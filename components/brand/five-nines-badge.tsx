import { cn } from "@/lib/utils"

type BadgeVariant = "dark" | "light" | "green"

/* 5N BADGE. Ultra-condensed 900-weight "5N" — no metaphor, just weight. The N
   runs signal green (the "live" color the whole system is built around); the 5
   inherits the field's foreground. Optional green foot chip is the welded-on
   corner tab from the truck-door version. Type-based (not traced SVG) so it
   stays razor sharp from a 16px favicon up to a trailer decal. */
export function FiveNinesBadge({
  size = 48,
  variant = "dark",
  greenN = true,
  foot = false,
  monochrome = false,
  className,
}: {
  size?: number
  variant?: BadgeVariant
  greenN?: boolean
  foot?: boolean
  monochrome?: boolean
  className?: string
}) {
  const bg =
    variant === "dark" ? "var(--navy)" : variant === "green" ? "var(--status-ok)" : "var(--card)"
  const five =
    variant === "dark"
      ? "var(--navy-foreground)"
      : variant === "green"
        ? "var(--navy)"
        : "var(--foreground)"
  const nColor = monochrome
    ? five
    : variant === "green"
      ? "var(--navy)"
      : greenN
        ? "var(--status-ok)"
        : five

  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center overflow-hidden align-middle", className)}
      style={{ width: size, height: size, background: bg, borderRadius: Math.round(size * 0.2) }}
      role="img"
      aria-label="Five Nines"
    >
      <span
        className="font-condensed font-black leading-none tracking-[-0.05em]"
        style={{ fontSize: size * 0.54 }}
        aria-hidden
      >
        <span style={{ color: five }}>5</span>
        <span style={{ color: nColor }}>N</span>
      </span>
      {foot && (
        <span
          aria-hidden
          className="absolute bottom-0 right-0"
          style={{
            width: size * 0.3,
            height: size * 0.18,
            background: monochrome ? five : "var(--status-ok)",
          }}
        />
      )}
    </span>
  )
}
