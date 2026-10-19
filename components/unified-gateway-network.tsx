"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestCapacityButton } from "@/components/request-capacity-trigger"
import { hubGroups, hubs, site } from "@/lib/site"
import { MAP_VIEWBOX, labelPosition, mapLinks, mapNodes } from "@/lib/gateway-map"

type Selection = { kind: "all" } | { kind: "group"; id: string } | { kind: "hub"; code: string }

const groupStyle: Record<string, { short: string; tile: string; chip: string; dot: string; stroke: string }> = {
  port: {
    short: "Port & transload",
    tile: "border-emerald-400/70 bg-emerald-500/10 text-white",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
    stroke: "#34d399",
  },
  petrochem: {
    short: "Petrochem & PFV",
    tile: "border-amber-400/70 bg-amber-500/10 text-white",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
    stroke: "#fbbf24",
  },
  "cross-border": {
    short: "Cross-border & industrial",
    tile: "border-sky-400/70 bg-sky-500/10 text-white",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
    stroke: "#38bdf8",
  },
}

const neutralStroke = "#94a3b8"

export function UnifiedGatewayNetwork() {
  const [selection, setSelection] = useState<Selection>({ kind: "all" })

  const activeGroups = useMemo(() => {
    if (selection.kind === "all") return hubGroups
    if (selection.kind === "group") return hubGroups.filter((g) => g.id === selection.id)
    return hubGroups.filter((g) => g.codes.includes(selection.code))
  }, [selection])

  const activeCodes = useMemo(() => {
    if (selection.kind === "all") return new Set(hubs.map((h) => h.code))
    if (selection.kind === "hub") return new Set([selection.code])
    return new Set(activeGroups.flatMap((g) => g.codes))
  }, [selection, activeGroups])

  const focusStyle = selection.kind === "all" ? null : groupStyle[activeGroups[0]?.id ?? ""] ?? null
  const accentStroke = focusStyle?.stroke ?? neutralStroke
  const selectedHub = selection.kind === "hub" ? hubs.find((h) => h.code === selection.code) : null

  const toggleHub = (code: string) =>
    setSelection((s) => (s.kind === "hub" && s.code === code ? { kind: "all" } : { kind: "hub", code }))

  const pills: { key: string; label: string; selection: Selection; dot?: string }[] = [
    { key: "all", label: `All ${hubs.length}`, selection: { kind: "all" } },
    ...hubGroups.map((g) => ({
      key: g.id,
      label: groupStyle[g.id]?.short ?? g.title,
      selection: { kind: "group", id: g.id } as Selection,
      dot: groupStyle[g.id]?.dot,
    })),
  ]

  const isPillActive = (p: Selection) =>
    p.kind === selection.kind && (p.kind !== "group" || (selection.kind === "group" && p.id === selection.id))

  return (
    <section
      id="gateway-network"
      className="scroll-mt-24 border-y border-slate-800 bg-[#080D1A] text-slate-100"
      aria-labelledby="gateway-title"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">
              {hubs.length}-hub gateway network
            </p>
            <h2
              id="gateway-title"
              className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Every gateway, grouped by what it can actually do for your freight.
            </h2>
          </div>
          <p className="max-w-md text-pretty text-base leading-relaxed text-slate-400">
            Regional gateways feed 2,400+ monitored lanes across all 50 states, with cross-border
            operations into Mexico and Canada. Pick a corridor or tap a hub to see where that
            equipment, credentialing, and staging capacity sits.
          </p>
        </div>

        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Filter gateways by capability corridor"
        >
          {pills.map((p) => {
            const active = isPillActive(p.selection)
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelection(p.selection)}
                aria-pressed={active}
                className={`flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-4 text-sm font-medium transition ${
                  active
                    ? "border-slate-400 bg-slate-100 text-[#080D1A]"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {p.dot ? <span className={`size-2 rounded-sm ${p.dot}`} aria-hidden="true" /> : null}
                {p.label}
              </button>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-col overflow-hidden rounded-md border border-slate-800 bg-[#0B111E]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">Network view</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400" aria-live="polite">
                {activeCodes.size} of {hubs.length} highlighted
              </span>
            </div>
            <svg
              viewBox={MAP_VIEWBOX}
              className="w-full"
              role="img"
              aria-label={`Gateway network map. ${activeCodes.size} of ${hubs.length} hubs highlighted.`}
            >
              {mapLinks.map(([a, b]) => {
                const from = mapNodes[a]
                const to = mapNodes[b]
                const lit = activeCodes.has(a) && activeCodes.has(b)
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={lit ? accentStroke : "#1e293b"}
                    strokeOpacity={lit ? 0.6 : 1}
                    strokeWidth="0.4"
                  />
                )
              })}
              {hubs.map((hub) => {
                const node = mapNodes[hub.code]
                if (!node) return null
                const lit = activeCodes.has(hub.code)
                const label = labelPosition(node)
                return (
                  <g
                    key={hub.code}
                    className="cursor-pointer"
                    onClick={() => toggleHub(hub.code)}
                    aria-hidden="true"
                  >
                    <circle cx={node.x} cy={node.y} r="4" fill="transparent" />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="2.2"
                      fill="#080D1A"
                      stroke={lit ? accentStroke : "#334155"}
                      strokeWidth="0.6"
                    />
                    <circle cx={node.x} cy={node.y} r="0.8" fill={lit ? accentStroke : "#334155"} />
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor={label.anchor}
                      fill={lit ? "#f1f5f9" : "#475569"}
                      className="font-mono"
                      style={{ fontSize: "3.3px", fontWeight: lit ? 600 : 400 }}
                    >
                      {hub.code}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-4" aria-label="Gateway hubs">
              {hubs.map((hub) => {
                const lit = activeCodes.has(hub.code)
                const isSelected = selection.kind === "hub" && selection.code === hub.code
                const hubGroup = hubGroups.find((g) => g.codes.includes(hub.code))
                const litTile = selection.kind === "all"
                  ? "border-slate-700 bg-[#0B111E] text-slate-100"
                  : (focusStyle ?? groupStyle[hubGroup?.id ?? ""])?.tile
                return (
                  <li key={hub.code}>
                    <button
                      type="button"
                      onClick={() => toggleHub(hub.code)}
                      aria-pressed={isSelected}
                      aria-label={`${hub.code}, ${hub.city}`}
                      className={`flex min-h-14 w-full flex-col items-center justify-center rounded-md border px-1 py-2 text-center transition ${
                        lit ? litTile : "border-slate-800 bg-transparent text-slate-500 hover:border-slate-600"
                      } ${isSelected ? "ring-2 ring-amber-400/70 ring-offset-2 ring-offset-[#080D1A]" : ""}`}
                    >
                      <span className="font-mono text-sm font-semibold tracking-wide">{hub.code}</span>
                      <span className="w-full truncate text-[11px] text-slate-400">{hub.city}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-3" aria-live="polite">
              {selectedHub ? (
                <p className="text-sm text-slate-300">
                  <span className="font-mono font-semibold text-white">{selectedHub.code}</span> · {selectedHub.city}
                  {activeGroups.length === 0 ? " — general freight gateway" : null}
                </p>
              ) : null}
              {activeGroups.map((group) => {
                const style = groupStyle[group.id]
                return (
                  <div key={group.id} className="flex flex-col gap-2 border-t border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-sm ${style?.dot}`} aria-hidden="true" />
                      <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                    </div>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.capabilities.map((cap) => (
                        <li key={cap} className={`rounded border px-2 py-1 text-xs ${style?.chip}`}>
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
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
