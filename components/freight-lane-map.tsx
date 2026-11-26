"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { ArrowUpRight, MapPin, MoveRight } from "lucide-react"
import { useRequestCapacity } from "@/components/request-capacity-panel"
import {
  feedPeriod,
  type FreightFeed,
  cityLabel,
  laneTitle,
  type FreightLane,
} from "@/lib/freight-lanes"

/* eslint-disable @typescript-eslint/no-explicit-any -- the Maps JS API is loaded at runtime without bundled types */
declare global {
  interface Window {
    google?: any
    __fiveNinesMapsReady?: () => void
    gm_authFailure?: () => void
  }
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID

const COLORS = { blue: "#1768b2", ink: "#12345a", signal: "#21b975", line: "#9fb6cc" }

type MapStatus = "loading" | "ready" | "unavailable"

let mapsPromise: Promise<any> | null = null

function loadGoogleMaps(key: string): Promise<any> {
  if (window.google?.maps?.Map) return Promise.resolve(window.google)
  if (mapsPromise) return mapsPromise
  mapsPromise = new Promise((resolve, reject) => {
    window.__fiveNinesMapsReady = () => resolve(window.google)
    const script = document.createElement("script")
    const params = new URLSearchParams({
      key,
      v: "weekly",
      loading: "async",
      libraries: "marker",
      callback: "__fiveNinesMapsReady",
    })
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.onerror = () => {
      mapsPromise = null
      reject(new Error("Google Maps failed to load"))
    }
    document.head.appendChild(script)
  })
  return mapsPromise
}

const quietStyles = [
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ lightness: 45 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d6e6f5" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f4f7fa" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#b8c9da" }] },
]

const markerScale = (n: number) => 7 + Math.sqrt(n) * 1.6
const laneWeight = (n: number) => 2 + n / 8

const emptyLanes: FreightLane[] = []
async function fetchFeed(url: string): Promise<FreightFeed> {
  const response = await fetch(url)
  if (!response.ok) throw new Error("Freight data unavailable")
  return response.json()
}

export function FreightLaneMap() {
  const { data, error } = useSWR<FreightFeed>("/api/freight-map", fetchFeed, { refreshInterval: 60_000 })
  const allLanes = data?.lanes ?? emptyLanes
  const period = data ? feedPeriod(data) : ""
  const { openLane } = useRequestCapacity()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [status, setStatus] = useState<MapStatus>(MAPS_KEY ? "loading" : "unavailable")
  const mapEl = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const overlays = useRef(new Map<string, { setSelected: (on: boolean) => void }>())

  const selected = allLanes.find((l) => l.id === selectedId)

  useEffect(() => {
    if (!MAPS_KEY || !mapEl.current) return
    let cancelled = false
    window.gm_authFailure = () => setStatus("unavailable")

    loadGoogleMaps(MAPS_KEY)
      .then((google) => {
        if (cancelled || !mapEl.current) return
        const { maps } = google
        const map = new maps.Map(mapEl.current, {
          center: { lat: 37.6, lng: -95.5 },
          zoom: 4,
          ...(MAP_ID ? { mapId: MAP_ID } : { styles: quietStyles }),
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          clickableIcons: false,
        })
        setMap(map)
        setStatus("ready")
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable")
      })

    return () => {
      cancelled = true
      delete window.gm_authFailure
    }
  }, [])

  useEffect(() => {
    if (!map || !window.google?.maps) return
    const maps = window.google.maps
    const Advanced = MAP_ID ? maps.marker?.AdvancedMarkerElement : null
    const cleanup: (() => void)[] = []
    const activeOverlays = overlays.current
    for (const lane of allLanes.filter(lane => lane.kind === "intercity")) {
      if (!lane.origin.position || !lane.destination.position) continue
      const path = [lane.origin.position, lane.destination.position]
      const arrow = { path: maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeWeight: 1, fillOpacity: 1 }
      const line = new maps.Polyline({
        path,
        geodesic: true,
        map,
        clickable: true,
        strokeOpacity: 0.85,
        icons: [{ icon: arrow, offset: "62%" }],
      })
      const ends = path.map(
        (c) =>
          new maps.Circle({
            map,
            center: c,
            radius: 14000,
            strokeWeight: 0,
            fillOpacity: 1,
            clickable: false,
          }),
      )
      const setSelected = (on: boolean) => {
        const color = on ? COLORS.signal : COLORS.blue
        line.setOptions({
          strokeColor: color,
          strokeWeight: laneWeight(lane.shipments) + (on ? 2 : 0),
          zIndex: on ? 20 : 1,
          icons: [{ icon: { ...arrow, strokeColor: color, fillColor: color, scale: on ? 4 : 3 }, offset: "62%" }],
        })
        ends.forEach((e) => e.setOptions({ fillColor: on ? COLORS.signal : COLORS.ink, zIndex: on ? 21 : 2 }))
      }
      const listener = line.addListener("click", () => setSelectedId(lane.id))
      cleanup.push(() => { listener.remove(); line.setMap(null); ends.forEach(e => e.setMap(null)) })
      overlays.current.set(lane.id, { setSelected })
    }

    for (const market of allLanes.filter(lane => lane.kind === "local")) {
      const position = market.origin.position
      if (!position) continue
      const title = `${laneTitle(market)}: ${market.shipments} shipments`
      let setSelected: (on: boolean) => void

      if (Advanced) {
        const pin = document.createElement("div")
        pin.className = "lane-map-pin"
        pin.textContent = String(market.shipments)
        const size = Math.round(markerScale(market.shipments) * 2.2)
        pin.style.width = pin.style.height = `${size}px`
        const marker = new Advanced({ map, position, title, content: pin, gmpClickable: true })
        const listener = marker.addListener("click", () => setSelectedId(market.id))
        cleanup.push(() => { listener.remove(); marker.map = null })
        setSelected = (on) => {
          pin.dataset.selected = String(on)
          marker.zIndex = on ? 30 : 10
        }
      } else {
        const marker = new maps.Marker({ map, position, title, optimized: true })
        const listener = marker.addListener("click", () => setSelectedId(market.id))
        cleanup.push(() => { listener.remove(); marker.setMap(null) })
        setSelected = (on) =>
          marker.setOptions({
            zIndex: on ? 30 : 10,
            label: { text: String(market.shipments), color: "#ffffff", fontSize: "11px", fontWeight: "600" },
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: markerScale(market.shipments) + (on ? 2 : 0),
              fillColor: on ? COLORS.signal : COLORS.ink,
              fillOpacity: 0.95,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          })
      }
      overlays.current.set(market.id, { setSelected })
    }

    return () => {
      cleanup.forEach(remove => remove())
      activeOverlays.clear()
    }
  }, [map, allLanes])

  useEffect(() => {
    if (status !== "ready") return
    overlays.current.forEach((o, id) => o.setSelected(id === selectedId))
    const maps = window.google?.maps
    if (!map || !maps) return
    if (!selected) {
      const bounds = new maps.LatLngBounds()
      for (const lane of allLanes) {
        if (lane.origin.position && lane.destination.position) {
          bounds.extend(lane.origin.position)
          bounds.extend(lane.destination.position)
        }
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds, 40)
    } else if (!selected.origin.position || !selected.destination.position) {
      return
    } else if (selected.kind === "local") {
      map.panTo(selected.origin.position)
      map.setZoom(8)
    } else {
      const bounds = new maps.LatLngBounds()
      bounds.extend(selected.origin.position)
      bounds.extend(selected.destination.position)
      map.fitBounds(bounds, 64)
    }
  }, [map, status, allLanes, selectedId, selected])

  const request = (lane: FreightLane) =>
    openLane({ origin: cityLabel(lane.origin), destination: cityLabel(lane.destination) })

  return (
    <div className="lane-map">
      <div className="lane-map-header">
        <div>
          <p className="eyebrow">
            <span className="brand-node" aria-hidden="true" />
            Five Nines freight
          </p>
          <h3>Where our freight is moving now.</h3>
        </div>
        <p className="lane-map-meta">
          {data ? `${period} · Five Nines shipments by city.` : error ? "Freight data is temporarily unavailable." : "Loading freight data…"}
          {error && data ? " Showing the last available update." : ""}
        </p>
      </div>

      <div className="lane-map-body">
        <div className="lane-map-canvas">
          {MAPS_KEY && status !== "unavailable" ? (
            <div
              ref={mapEl}
              className="lane-map-gmap"
              role="region"
              aria-label="Freight lane map. Use the lane list to select a lane with the keyboard."
            />
          ) : null}
          {status === "loading" ? <p className="lane-map-state">Loading map…</p> : null}
          {status === "unavailable" ? (
            <p className="lane-map-state">
              <MapPin size={18} aria-hidden="true" />
              The map isn&apos;t available right now. Every lane is listed here and can still be selected.
            </p>
          ) : null}
        </div>

        <div className="lane-map-list">
          <LaneGroup title="Local markets" lanes={allLanes.filter(l => l.kind === "local")} selectedId={selectedId} onSelect={setSelectedId} />
          <LaneGroup title="Intercity lanes" lanes={allLanes.filter(l => l.kind === "intercity")} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {selected ? (
        <div className="lane-map-detail" aria-live="polite">
          <div>
            <span className="lane-map-kind">{selected.kind === "local" ? "Local move" : "Intercity lane"}</span>
            <strong>{laneTitle(selected)}</strong>
            <span className="lane-map-count">
              {selected.shipments} {selected.shipments === 1 ? "shipment" : "shipments"} · {period}
            </span>
          </div>
          <button type="button" className="design-button" onClick={() => request(selected)}>
            Request capacity on this lane
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <p className="lane-map-meta">{data && !allLanes.length ? "No qualifying shipments in this period." : "Select a local move or lane to request capacity."}</p>
      )}
    </div>
  )
}

function LaneGroup({
  title,
  lanes,
  selectedId,
  onSelect,
}: {
  title: string
  lanes: FreightLane[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <section aria-label={title}>
      <h4>{title}</h4>
      <ul>
        {lanes.map((lane) => (
          <li key={lane.id}>
            <button
              type="button"
              aria-pressed={lane.id === selectedId}
              onClick={() => onSelect(lane.id)}
              className="lane-map-item"
            >
              <span className="lane-map-route">
                {lane.kind === "local" ? (
                  <>
                    {cityLabel(lane.origin)}
                    <span className="sr-only"> local moves</span>
                  </>
                ) : (
                  <>
                    {cityLabel(lane.origin)}
                    <MoveRight size={14} aria-label="to" />
                    {cityLabel(lane.destination)}
                  </>
                )}
              </span>
              <span className="lane-map-num">
                {lane.shipments}
                <span className="sr-only"> shipments</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
