"use client"

import { useMemo, useState } from "react"
import { hubGroups, hubs } from "@/lib/site"

type Selection = { kind: "group"; id: string } | { kind: "hub"; code: string }

const groupAccent: Record<string, { ring: string; chip: string; dot: string }> = {
  port: {
    ring: "border-emerald-400/70 bg-emerald-500/10 text-white",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  petrochem: {
    ring: "border-amber-400/70 bg-amber-500/10 text-white",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },
  "cross-border": {
    ring: "border-sky-400/70 bg-sky-500/10 text-white",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
  },
}

export function GatewayNetwork() {
  const [selection, setSelection] = useState<Selection>({ kind: "group", id: hubGroups[0].id })

  const activeGroups = useMemo(() => {
    if (selection.kind === "group") return hubGroups.filter((g) => g.id === selection.id)
    return hubGroups.filter((g) => g.codes.includes(selection.code))
  }, [selection])

  const activeCodes = useMemo(() => new Set(activeGroups.flatMap((g) => g.codes)), [activeGroups])
  const primaryGroup = activeGroups[0]
  const accent = primaryGroup ? groupAccent[primaryGroup.id] : groupAccent.port

  return (
    <section
      id="gateway-network"
      className="scroll-mt-24 border-y border-slate-800 bg-[#080D1A] text-slate-100"
      aria-labelledby="gateway-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">
              20-hub gateway network
            </p>
            <h2
              id="gateway-title"
              className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Every gateway, grouped by what it can actually do for your freight.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Select a capability corridor or a hub code. The network view highlights where that
            equipment, credentialing, and staging capacity is live today.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5" role="list" aria-label="Gateway hubs">
              {hubs.map((hub) => {
                const active = activeCodes.has(hub.code)
                const isSelectedHub = selection.kind === "hub" && selection.code === hub.code
                return (
                  <button
                    key={hub.code}
                    type="button"
                    role="listitem"
                    onClick={() => setSelection({ kind: "hub", code: hub.code })}
                    aria-pressed={isSelectedHub}
                    className={`rounded-md border px-2 py-3 text-center transition ${
                      active
                        ? accent.ring
                        : "border-slate-800 bg-[#0B111E] text-slate-500 hover:border-slate-600 hover:text-slate-300"
                    } ${isSelectedHub ? "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[#080D1A]" : ""}`}
                  >
                    <span className="block font-mono text-sm font-semibold tracking-wide">{hub.code}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-400">{hub.city}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              {activeCodes.size} of {hubs.length} gateways highlighted
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {hubGroups.map((group) => {
              const isActive = activeGroups.some((g) => g.id === group.id)
              const a = groupAccent[group.id]
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelection({ kind: "group", id: group.id })}
                  aria-pressed={selection.kind === "group" && selection.id === group.id}
                  className={`rounded-lg border p-5 text-left transition ${
                    isActive
                      ? "border-slate-600 bg-[#0B111E]"
                      : "border-slate-800 bg-transparent hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-sm ${a.dot}`} aria-hidden="true" />
                    <h3 className={`text-base font-semibold ${isActive ? "text-white" : "text-slate-300"}`}>
                      {group.title}
                    </h3>
                  </div>
                  <p className="mt-2 font-mono text-[11px] tracking-wider text-slate-500">
                    {group.codes.join(" · ")}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {group.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className={`rounded border px-2 py-1 text-[11px] ${
                          isActive ? a.chip : "border-slate-800 text-slate-500"
                        }`}
                      >
                        {cap}
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
