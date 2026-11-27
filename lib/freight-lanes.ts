export type City = { name: string; state: string; position: { lat: number; lng: number } | null }

export type FreightLane = {
  id: string
  kind: "local" | "intercity"
  origin: City
  destination: City
  shipments: number
}

export type FreightFeed = { from: string; through: string; lanes: FreightLane[] }

export const cityLabel = (city: City) => `${city.name}, ${city.state}`
export const laneTitle = (lane: FreightLane) =>
  lane.kind === "local" ? `${cityLabel(lane.origin)} local` : `${cityLabel(lane.origin)} → ${cityLabel(lane.destination)}`

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
export function feedPeriod(feed: FreightFeed) {
  const start = Date.parse(feed.from + "T00:00:00Z")
  const end = Date.parse(feed.through + "T00:00:00Z")
  return Number.isFinite(start) && Number.isFinite(end) && start <= end ? dateFormat.formatRange(start, end) : ""
}
