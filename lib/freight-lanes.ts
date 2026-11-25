// Dated, city-level snapshot of selected Five Nines client-book lanes.
// Source: distinct non-cancelled shipments, Oct 26 – Nov 24 2026 inclusive.
// City aggregates only — no clients, facilities, financials or addresses.

export type City = { name: string; state: string; lat: number; lng: number }

export type FreightLane = {
  id: string
  kind: "local" | "intercity"
  origin: City
  destination: City
  shipments: number
}

export const laneSnapshot = {
  label: "Selected lanes snapshot",
  period: "Oct 26 – Nov 24, 2026",
  basis: "Distinct non-cancelled shipments",
}

const city = (name: string, state: string, lat: number, lng: number): City => ({ name, state, lat, lng })

const C = {
  houston: city("Houston", "TX", 29.7604, -95.3698),
  laPorte: city("La Porte", "TX", 29.6658, -95.0194),
  indianapolis: city("Indianapolis", "IN", 39.7684, -86.1581),
  angleton: city("Angleton", "TX", 29.1694, -95.4319),
  carthage: city("Carthage", "TN", 36.2523, -85.9516),
  katy: city("Katy", "TX", 29.7858, -95.8245),
  wilmer: city("Wilmer", "TX", 32.589, -96.6853),
  woodburn: city("Woodburn", "KY", 36.8431, -86.5303),
  memphis: city("Memphis", "TN", 35.1495, -90.049),
  chesapeake: city("Chesapeake", "VA", 36.7682, -76.2875),
  columbus: city("Columbus", "OH", 39.9612, -82.9988),
  wilmingtonCa: city("Wilmington", "CA", 33.7801, -118.2626),
  losAngeles: city("Los Angeles", "CA", 34.0522, -118.2437),
  tacoma: city("Tacoma", "WA", 47.2529, -122.4443),
  newburgh: city("Newburgh", "IN", 37.9445, -87.4053),
  morganCity: city("Morgan City", "LA", 29.6994, -91.2068),
  batonRouge: city("Baton Rouge", "LA", 30.4515, -91.1871),
  randolph: city("Randolph", "MO", 39.1556, -94.4958),
  racine: city("Racine", "OH", 38.9692, -81.9115),
  wilmingtonIl: city("Wilmington", "IL", 41.3075, -88.1467),
  russellville: city("Russellville", "KY", 36.8453, -86.8872),
  elwood: city("Elwood", "IL", 41.4036, -88.1117),
  newark: city("Newark", "NJ", 40.7357, -74.1724),
}

export const cityLabel = (c: City) => `${c.name}, ${c.state}`

const slug = (c: City) => `${c.name}-${c.state}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")

const local = (c: City, shipments: number): FreightLane => ({
  id: `local-${slug(c)}`,
  kind: "local",
  origin: c,
  destination: c,
  shipments,
})

const lane = (origin: City, destination: City, shipments: number): FreightLane => ({
  id: `${slug(origin)}-to-${slug(destination)}`,
  kind: "intercity",
  origin,
  destination,
  shipments,
})

export const localMarkets: FreightLane[] = [
  local(C.houston, 55),
  local(C.laPorte, 41),
  local(C.indianapolis, 4),
  local(C.angleton, 1),
  local(C.carthage, 1),
  local(C.katy, 1),
  local(C.wilmer, 1),
]

export const intercityLanes: FreightLane[] = [
  lane(C.woodburn, C.memphis, 31),
  lane(C.chesapeake, C.columbus, 25),
  lane(C.wilmingtonCa, C.memphis, 21),
  lane(C.losAngeles, C.tacoma, 19),
  lane(C.newburgh, C.memphis, 17),
  lane(C.morganCity, C.batonRouge, 16),
  lane(C.losAngeles, C.randolph, 15),
  lane(C.racine, C.wilmingtonIl, 15),
  lane(C.russellville, C.memphis, 15),
  lane(C.elwood, C.newark, 14),
]

export const allLanes = [...localMarkets, ...intercityLanes]

export const laneTitle = (l: FreightLane) =>
  l.kind === "local" ? `${cityLabel(l.origin)} local` : `${cityLabel(l.origin)} → ${cityLabel(l.destination)}`
