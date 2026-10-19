"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { hubs, site } from "@/lib/site"
import {
  MAP_VIEWBOX,
  type CorridorId,
  hubDetails,
  labelPosition,
  mapLinks,
  mapNodes,
} from "@/lib/gateway-map"

type CorridorFilter = "all" | CorridorId

const corridorStyle: Record<CorridorId, { tile: string; dot: string; stroke: string }> = {
  port: { tile: "border-emerald-400/70 bg-emerald-500/10", dot: "bg-emerald-400", stroke: "#34d399" },
  petrochem: { tile: "border-amber-400/70 bg-amber-500/10", dot: "bg-amber-400", stroke: "#fbbf24" },
  "cross-border": { tile: "border-sky-400/70 bg-sky-500/10", dot: "bg-sky-400", stroke: "#38bdf8" },
}

const filters: { id: CorridorFilter; label: string }[] = [
  { id: "all", label: `All ${hubs.length} Live Gateways` },
  { id: "port", label: "Port Drayage & 60k-lb Transload" },
  { id: "petrochem", label: "Refinery, PFV & Turnaround Corridors" },
  { id: "cross-border", label: "Data Center & Cross-Border (MX/CA)" },
]

const neutralStroke = "#94a3b8"
const selectedStroke = "#f59e0b"
const DEFAULT_HUB = "HOU"

export function UnifiedGatewayNetwork() {
  const [corridor, setCorridor] = useState<CorridorFilter>("all")
  const [selectedCode, setSelectedCode] = useState(DEFAULT_HUB)

  const selectedHub = hubs.find((h) => h.code === selectedCode) ?? hubs[0]
  const selectedDetail = hubDetails[selectedHub.code]

  const inCorridor = (code: string) =>
    corridor === "all" || (hubDetails[code]?.corridors.includes(corridor) ?? false)
  const isLit = (code: string) => code === selectedCode || inCorridor(code)
  const litCount = hubs.filter((h) => isLit(h.code)).length
  const accentStroke = corridor === "all" ? neutralStroke : corridorStyle[corridor].stroke

  return (
    <section
      id="gateway-network"
      className="scroll-mt-24 border-y border-slate-800 bg-[#080D1A] text-slate-100"
      aria-labelledby="gateway-title"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex max-w-3xl flex-col gap-4">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-amber-400">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Gateway network · {hubs.length} hubs · 2,400+ monitored lanes
          </p>
          <h2
            id="gateway-title"
            className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Every gateway, grouped by what it can actually do for your freight.
          </h2>
          <p className="text-pretty text-base leading-relaxed text-slate-400">
            Regional gateways feed a network of 2,400+ monitored lanes across all 50 states, Canada,
            and Mexico. At every hub, our partners unload containers, transload flatracks, stage
            project cargo, and complete the final mile, routed against current carrier and equipment
            availability, not a static spreadsheet.
          </p>
        </div>

        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Filter gateways by capability corridor"
        >
          {filters.map((f) => {
            const active = corridor === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCorridor(f.id)}
                aria-pressed={active}
                className={`flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-4 font-mono text-xs uppercase tracking-wide transition ${
                  active
                    ? "border-slate-300 bg-slate-100 font-semibold text-[#080D1A]"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {f.id !== "all" ? (
                  <span className={`size-2 rounded-sm ${corridorStyle[f.id].dot}`} aria-hidden="true" />
                ) : null}
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col overflow-hidden rounded-md border border-slate-800 bg-[#0B111E] lg:col-span-5">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Network topology
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400" aria-live="polite">
                {litCount} of {hubs.length} highlighted
              </span>
            </div>
            <svg
              viewBox={MAP_VIEWBOX}
              className="w-full select-none"
              role="img"
              aria-label={`Gateway network map. ${litCount} of ${hubs.length} hubs highlighted, ${selectedHub.code} selected.`}
            >
              {mapLinks.map(([a, b]) => {
                const from = mapNodes[a]
                const to = mapNodes[b]
                const lit = isLit(a) && isLit(b)
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={lit ? accentStroke : "#1e293b"}
                    strokeOpacity={lit ? 0.55 : 1}
                    strokeWidth="0.4"
                  />
                )
              })}
              {hubs.map((hub) => {
                const node = mapNodes[hub.code]
                if (!node) return null
                const selected = hub.code === selectedCode
                const lit = isLit(hub.code)
                const ring = selected ? selectedStroke : lit ? accentStroke : "#334155"
                const label = labelPosition(node)
                return (
                  <g
                    key={hub.code}
                    className="cursor-pointer"
                    onClick={() => setSelectedCode(hub.code)}
                    aria-hidden="true"
                  >
                    <circle cx={node.x} cy={node.y} r="4" fill="transparent" />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={selected ? 2.8 : 2.2}
                      fill="#080D1A"
                      stroke={ring}
                      strokeWidth={selected ? 0.8 : 0.6}
                    />
                    <circle cx={node.x} cy={node.y} r={selected ? 1.1 : 0.8} fill={ring} />
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor={label.anchor}
                      fill={selected ? "#fbbf24" : lit ? "#f1f5f9" : "#475569"}
                      className="font-mono"
                      style={{ fontSize: "3.3px", fontWeight: selected || lit ? 600 : 400 }}
                    >
                      {hub.code}
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="flex flex-col gap-3 border-t border-slate-800 p-4" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
                    Active hub · {selectedHub.code}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{selectedHub.city} Gateway</h3>
                </div>
                <div className="flex shrink-0 gap-1.5 pt-1">
                  {selectedDetail?.corridors.map((c) => (
                    <span key={c} className={`size-2 rounded-sm ${corridorStyle[c].dot}`} aria-hidden="true" />
                  ))}
                </div>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {selectedDetail?.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800/60 px-2.5 py-1 font-mono text-xs text-slate-200"
                  >
                    <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="grid grid-cols-4 gap-2 sm:gap-3 lg:col-span-7" aria-label="Gateway hubs">
            {hubs.map((hub) => {
              const selected = hub.code === selectedCode
              const lit = isLit(hub.code)
              const detail = hubDetails[hub.code]
              const tone =
                corridor === "all" || !lit
                  ? "border-slate-700 bg-[#0B111E]"
                  : corridorStyle[corridor].tile
              return (
                <li key={hub.code}>
                  <button
                    type="button"
                    onClick={() => setSelectedCode(hub.code)}
                    aria-pressed={selected}
                    aria-label={`${hub.code}, ${hub.city}`}
                    className={`flex min-h-14 w-full flex-col items-center justify-center rounded-md border px-1 py-2 text-center transition lg:items-start lg:p-3 lg:text-left ${
                      lit ? `${tone} text-white` : "border-slate-800 bg-transparent text-slate-500 opacity-60 hover:opacity-90"
                    } ${selected ? "ring-2 ring-amber-400/80 ring-offset-2 ring-offset-[#080D1A]" : ""}`}
                  >
                    <span
                      className={`font-mono text-sm font-semibold tracking-wide ${selected ? "text-amber-300" : ""}`}
                    >
                      {hub.code}
                    </span>
                    <span className="w-full truncate text-[11px] text-slate-400">{hub.city}</span>
                    {detail ? (
                      <span className="mt-1 hidden w-full truncate font-mono text-[11px] text-slate-500 lg:block">
                        {detail.capabilities[0]}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <RequestCapacityButton size="lg" className="font-medium">
            Request Capacity
            <ArrowRight className="size-4" data-icon="inline-end" />
          </RequestCapacityButton>
          <Button
            render={<Link href={`mailto:${site.dispatchEmail}`} />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="border-slate-700 bg-transparent font-medium text-slate-100 hover:bg-slate-800 hover:text-white"
          >
            Talk to Dispatch
          </Button>
        </div>
      </div>
    </section>
  )
}
