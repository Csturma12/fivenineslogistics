import { cn } from "@/lib/utils"
import { FiveNinesBadge } from "./five-nines-badge"

/* FIVE NINES wordmark lockup. Ultra-condensed 900 grotesque set tight, paired
   with the 5N badge. `dark` flips the whole lockup for slate/navy fields vs.
   white paperwork. The agent-of line is deliberately quiet mono — it is legal
   attribution, not part of the mark. */
export function FiveNinesWordmark({
  className,
  dark = false,
  badge = true,
  badgeSize = 40,
  stacked = false,
  showLogistics = false,
  showAgent = false,
}: {
  className?: string
  dark?: boolean
  badge?: boolean
  badgeSize?: number
  stacked?: boolean
  showLogistics?: boolean
  showAgent?: boolean
}) {
  const textColor = dark ? "text-[color:var(--navy-foreground)]" : "text-foreground"
  const mutedColor = dark ? "text-[color:var(--navy-foreground)]/55" : "text-muted-foreground"

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {badge && (
        <FiveNinesBadge size={badgeSize} variant={dark ? "light" : "dark"} />
      )}
      <span className="flex flex-col">
        <span
          className={cn(
            "font-condensed font-black uppercase leading-[0.82] tracking-[-0.01em]",
            textColor,
          )}
          style={{ fontSize: badgeSize * (stacked ? 0.66 : 0.8) }}
        >
          {stacked ? (
            <>
              <span className="block">Five Nines</span>
              {showLogistics && <span className="block">Logistics</span>}
            </>
          ) : (
            <span className="whitespace-nowrap">
              Five Nines{showLogistics ? " Logistics" : ""}
            </span>
          )}
        </span>
        {showAgent && (
          <span
            className={cn("mt-1.5 font-mono uppercase tracking-[0.14em]", mutedColor)}
            style={{ fontSize: Math.max(9, badgeSize * 0.2) }}
          >
            An agent of Primary Freight LLC
          </span>
        )}
      </span>
    </span>
  )
}
