"use client"

import useSWR from "swr"
import { ArrowUpRight } from "lucide-react"
import { useRequestCapacity } from "@/components/request-capacity-panel"

type EmptyTruck = { city: string; state: string; deliveryDate: string; equipment: string | null; status: "In transit" | "Booked" }
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

async function fetchTrucks(url: string): Promise<EmptyTruck[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Truck availability unavailable")
  return res.json()
}

export function EmptyTrucks() {
  const { data, error } = useSWR("/api/empty-trucks", fetchTrucks, { refreshInterval: 60_000 })
  const { openLane } = useRequestCapacity()
  return (
    <section aria-labelledby="empty-trucks-title" className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <h2 id="empty-trucks-title" className="text-2xl font-semibold tracking-tight">Trucks getting empty{data ? ` (${data.length})` : ""}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select a truck to request a pickup in its delivery city.</p>
      </header>
      {error && <p role="status" className="px-5 py-3 text-sm">{data ? "Showing the last available update." : "Truck availability is temporarily unavailable."}</p>}
      {!data && !error && <p role="status" className="p-5 text-sm">Loading trucks…</p>}
      {data?.length === 0 && <p className="p-5 text-sm">No trucks are scheduled to get empty in this planning window.</p>}
      {data && data.length > 0 && (
        <ul className="max-h-96 divide-y divide-border overflow-y-auto">
          {data.map((truck, index) => {
            const pickup = `${truck.city}, ${truck.state}`
            const timestamp = Date.parse(truck.deliveryDate + "T00:00:00Z")
            const day = Number.isFinite(timestamp) ? dateFormat.format(timestamp) : "Date pending"
            return (
              <li key={`${pickup}-${truck.deliveryDate}-${index}`}>
                <button type="button" onClick={() => openLane({ origin: pickup, destination: "" })}
                  className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:px-6">
                  <span>
                    <strong className="block">{pickup}</strong>
                    <span className="text-sm text-muted-foreground">{truck.status}{truck.equipment && ` · ${truck.equipment}`}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm">
                    <time dateTime={truck.deliveryDate}>{day}</time>
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
