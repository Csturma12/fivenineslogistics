import Link from "next/link"
import { ArrowRight, Phone, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"
import type { TruckNeeds as TruckNeedsData } from "@/lib/truck-needs"

function dayParts(iso: string) {
  const date = new Date(`${iso}T12:00:00Z`)
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    monthDay: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
  }
}

/** Open pickups by lane and day. Renders nothing when the data could not be read. */
export function TruckNeeds({ needs }: { needs: TruckNeedsData | null }) {
  if (!needs) return null
  const { days, lanes, moreLanes, totalPickups } = needs
  const first = dayParts(days[0])
  const last = dayParts(days[days.length - 1])

  return (
    <section id="truck-needs" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              Open this week
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Where we need a truck
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {totalPickups > 0
                ? `${totalPickups} booked ${totalPickups === 1 ? "pickup still needs" : "pickups still need"} a truck, ${first.monthDay} through ${last.monthDay}. Updated from our dispatch board every few minutes.`
                : `No open pickups are posted for ${first.monthDay} through ${last.monthDay} right now. Get set up so you see the next one first.`}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/portal" />} nativeButton={false} className="font-medium">
              See loads in the Carrier Portal
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href={site.phoneHref} />}
              nativeButton={false}
              variant="outline"
              className="font-medium"
            >
              <Phone className="size-4" data-icon="inline-start" />
              {site.phone}
            </Button>
          </div>
        </div>

        {lanes.length > 0 ? (
          <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card sm:hidden">
            {lanes.map((lane) => (
              <li key={lane.key} className="px-4 py-3">
                <div className="font-medium text-foreground">
                  {lane.origin} <span className="text-muted-foreground">→</span> {lane.destination}
                </div>
                {lane.equipment ? (
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Truck className="size-3.5" aria-hidden="true" />
                    {lane.equipment}
                  </div>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lane.perDay.map((count, index) =>
                    count > 0 ? (
                      <span
                        key={days[index]}
                        className="rounded-md bg-status-ok-dark px-2 py-1 text-xs font-semibold tabular-nums text-navy"
                      >
                        {dayParts(days[index]).weekday} {dayParts(days[index]).monthDay} · {count}
                      </span>
                    ) : null,
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {lanes.length > 0 ? (
          <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border bg-card sm:block">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-6">
                    Lane
                  </th>
                  {days.map((iso) => {
                    const { weekday, monthDay } = dayParts(iso)
                    return (
                      <th key={iso} scope="col" className="px-1 py-3 text-center font-medium text-muted-foreground">
                        <div className="text-xs leading-none">{weekday}</div>
                        <div className="mt-1 text-[11px] leading-none tabular-nums">{monthDay}</div>
                      </th>
                    )
                  })}
                  <th scope="col" className="px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-6">
                    Trucks
                  </th>
                </tr>
              </thead>
              <tbody>
                {lanes.map((lane) => (
                  <tr key={lane.key} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal sm:px-6">
                      <div className="font-medium text-foreground">
                        {lane.origin} <span className="text-muted-foreground">→</span> {lane.destination}
                      </div>
                      {lane.equipment ? (
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Truck className="size-3.5" aria-hidden="true" />
                          {lane.equipment}
                        </div>
                      ) : null}
                    </th>
                    {lane.perDay.map((count, index) => (
                      <td key={days[index]} className="px-1 py-3 text-center">
                        {count > 0 ? (
                          <span
                            role="img"
                            className="inline-flex size-8 items-center justify-center rounded-md bg-status-ok-dark font-semibold tabular-nums text-navy"
                            aria-label={`${count} ${count === 1 ? "truck" : "trucks"} needed ${dayParts(days[index]).monthDay}`}
                          >
                            {count}
                          </span>
                        ) : (
                          <span className="text-border" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground sm:px-6">
                      {lane.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <p className="mt-4 text-sm text-muted-foreground">
          {moreLanes > 0 ? `Plus ${moreLanes} more ${moreLanes === 1 ? "lane" : "lanes"} in the Carrier Portal. ` : ""}
          Loads go to approved carriers. Rates and load details are in the portal or a call away.
        </p>
      </div>
    </section>
  )
}
