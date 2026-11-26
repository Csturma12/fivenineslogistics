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
export const feedPeriod = (feed: FreightFeed) =>
  dateFormat.formatRange(new Date(feed.from + "T00:00:00Z"), new Date(feed.through + "T00:00:00Z"))
