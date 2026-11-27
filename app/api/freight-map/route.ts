import zipcodes from "zipcodes"
import type { City, FreightLane } from "@/lib/freight-lanes"

type LaneRow = { origin_city: string; origin_state: string; destination_city: string; destination_state: string; shipments: number }

function city(name: string, state: string): City {
  const matches = zipcodes.lookupByName(name, state).filter((zip) =>
    Number.isFinite(zip.latitude) && Number.isFinite(zip.longitude) && (zip.latitude !== 0 || zip.longitude !== 0))
  const label = matches[0]?.city ?? name.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
  // Randolph shares a postal city with Kansas City. Keep its original city-level map point.
  const position = matches.length ? {
    lat: matches.reduce((sum, zip) => sum + zip.latitude, 0) / matches.length,
    lng: matches.reduce((sum, zip) => sum + zip.longitude, 0) / matches.length,
  } : name === "RANDOLPH" && state === "MO" ? { lat: 39.1556, lng: -94.4958 } : null
  return { name: label, state, position }
}

export async function GET(request: Request) {
  if (new URL(request.url).search) return Response.json({ error: "No filters supported" }, { status: 400 })
  const base = process.env.FREIGHT_DASHBOARD_URL
  const key = process.env.FREIGHT_DASHBOARD_PUBLISHABLE_KEY
  const unavailable = () => Response.json({ error: "Freight data unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  if (!base || !key) return unavailable()
  try {
    const response = await fetch(new URL("/rest/v1/rpc/five_nines_map_feed", base), {
      headers: { apikey: key }, next: { revalidate: 30 }, signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      console.error("Freight map feed returned HTTP", response.status)
      return unavailable()
    }
    const feed: { from: string; through: string; lanes: LaneRow[] } = await response.json()
    const lanes: FreightLane[] = feed.lanes.map(row => {
      const origin = city(row.origin_city, row.origin_state)
      const local = row.origin_city === row.destination_city && row.origin_state === row.destination_state
      return {
        id: JSON.stringify([row.origin_city, row.origin_state, row.destination_city, row.destination_state]),
        kind: local ? "local" : "intercity", origin,
        destination: local ? origin : city(row.destination_city, row.destination_state), shipments: row.shipments,
      }
    })
    return Response.json({ from: feed.from, through: feed.through, lanes }, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=30" },
    })
  } catch (error) {
    console.error("Freight map feed failed", error instanceof Error ? error.name : "Unknown error")
    return unavailable()
  }
}
