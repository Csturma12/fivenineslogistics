"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { useRequestCapacity } from "@/components/RequestCapacityDrawer"

type Spec = {
  id: string
  name: string
  short: string
  rows: Array<[string, string]>
  gear: string[]
  note: string
  equipmentValue: string
}

const specs: Spec[] = [
  {
    id: "flatbed",
    name: "Flatbed (48' / 53')",
    short: "Flatbed",
    rows: [
      ["Max legal weight", "48,000 lbs"],
      ["Deck height", `5'0" (60")`],
      ["Max legal load height", `8'6" (102")`],
      ["Max legal width", `8'6" (102")`],
    ],
    gear: ["Chains", "Binders", "Straps", "Coil racks", "Pipe stakes", "4 ft / 6 ft / 8 ft tarps"],
    note: "The workhorse for pipe, structural, PFV, machinery and crane-unloaded skids. Loads over 102\" tall or wide move to step deck or permitted RGN.",
    equipmentValue: "Flatbed (48'/53')",
  },
  {
    id: "step-deck",
    name: "Step Deck / Drop Deck (48' / 53')",
    short: "Step deck",
    rows: [
      ["Max legal weight", "46,000–48,000 lbs"],
      ["Lower deck length", "37'–43'"],
      ["Deck height", `3'6" (42")`],
      ["Max legal load height", `10'0"–10'2"`],
    ],
    gear: ["Heavy ramps", "Chains", "Tarps", "Dunnage"],
    note: "Buys 18\" of legal height over a flatbed. Standard for switchgear, generator enclosures, transformer skids and tall crated equipment.",
    equipmentValue: "Step Deck",
  },
  {
    id: "rgn",
    name: "Double Drop / RGN (Removable Gooseneck)",
    short: "RGN",
    rows: [
      ["Max weight", "40,000 lbs legal · up to 150,000+ lbs permitted multi-axle"],
      ["Well length", "29' standard (up to 50' stretch)"],
      ["Deck height", `18"–24"`],
      ["Max legal load height", `11'6"–12'0"`],
    ],
    gear: ["Multi-axle configurations", "Jeep & stinger", "Detachable neck for drive-on loading", "Permit & escort coordination"],
    note: "Over-dimensional chillers, transformers, vessels and tracked equipment. Permits, route surveys and escorts are planned with the MOP before dispatch.",
    equipmentValue: "RGN / Heavy Haul",
  },
  {
    id: "hotshot",
    name: "Expedited Hotshot (40' Gooseneck) & Box Truck",
    short: "Hotshot",
    rows: [
      ["Max weight", "16,500 lbs (Non-CDL) to 22,000 lbs (CDL)"],
      ["Deck length", "40' gooseneck · 26' box w/ liftgate"],
      ["Dispatch", "Instant 60-minute dispatch for line-down emergencies"],
      ["Service", "Direct, straight-through, exclusive use"],
    ],
    gear: ["Straps & chains", "Tarps", "Liftgate (box truck)", "TWIC / plant-PPE credentialed drivers"],
    note: "Single skids, actuated valves, refractory shapes and critical spares that cannot wait for a full-size truck. Texas, Gulf Coast and nationwide lanes.",
    equipmentValue: "Hotshot (40' Gooseneck)",
  },
]

export function EquipmentReference() {
  const [active, setActive] = useState(specs[0].id)
  const { openPanel } = useRequestCapacity()
  const spec = specs.find((s) => s.id === active) ?? specs[0]

  return (
    <section
      id="equipment-reference"
      className="scroll-mt-24 border-y border-slate-800 bg-[#080D1A] text-slate-100"
      aria-labelledby="equipment-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">
              Equipment engineering reference
            </p>
            <h2
              id="equipment-title"
              className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Verify legal tolerances before you quote.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Legal limits below are U.S. interstate baselines without permits. Anything over them is a
            permitted move and gets a routed MOP, not a guess.
          </p>
        </div>

        {/* Interactive selector (mobile + desktop) */}
        <div className="mt-10 grid gap-2 sm:grid-cols-4" role="tablist" aria-label="Trailer type">
          {specs.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === active}
              onClick={() => setActive(s.id)}
              className={`rounded-md border px-4 py-3 text-left transition ${
                s.id === active
                  ? "border-amber-400/70 bg-amber-500/10 text-white"
                  : "border-slate-800 bg-[#0B111E] text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              <span className="block font-mono text-[11px] uppercase tracking-wider">{s.short}</span>
              <span className="mt-1 block text-sm font-semibold leading-snug">{s.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800 lg:grid-cols-[1.1fr_1fr]">
          <div className="bg-[#0B111E] p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">{spec.name}</h3>
            <dl className="mt-5 divide-y divide-slate-800 border-y border-slate-800">
              {spec.rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{k}</dt>
                  <dd className="font-mono text-sm font-semibold text-emerald-300">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">{spec.note}</p>
          </div>
          <div className="flex flex-col bg-[#0B111E] p-6 sm:p-8">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Securement & gear on board</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {spec.gear.map((g) => (
                <li
                  key={g}
                  className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200"
                >
                  {g}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={openPanel}
                className="inline-flex items-center gap-2 rounded bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
              >
                Spec a {spec.short.toLowerCase()} move
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Full comparison table for scanning across trailer types */}
        <div className="mt-10 overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">Trailer specification comparison</caption>
            <thead className="bg-[#0B111E] font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-3">Trailer</th>
                <th scope="col" className="px-4 py-3">Max weight</th>
                <th scope="col" className="px-4 py-3">Deck height</th>
                <th scope="col" className="px-4 py-3">Max legal load height</th>
                <th scope="col" className="px-4 py-3">Length / width</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="bg-[#080D1A]">
                <th scope="row" className="px-4 py-3 font-semibold text-white">Flatbed 48'/53'</th>
                <td className="px-4 py-3 font-mono text-emerald-300">48,000 lbs</td>
                <td className="px-4 py-3 font-mono text-slate-200">5'0" (60")</td>
                <td className="px-4 py-3 font-mono text-slate-200">8'6" (102")</td>
                <td className="px-4 py-3 font-mono text-slate-200">48'–53' · 8'6" (102") wide</td>
              </tr>
              <tr className="bg-[#080D1A]">
                <th scope="row" className="px-4 py-3 font-semibold text-white">Step deck 48'/53'</th>
                <td className="px-4 py-3 font-mono text-emerald-300">46,000–48,000 lbs</td>
                <td className="px-4 py-3 font-mono text-slate-200">3'6" (42")</td>
                <td className="px-4 py-3 font-mono text-slate-200">10'0"–10'2"</td>
                <td className="px-4 py-3 font-mono text-slate-200">37'–43' lower deck</td>
              </tr>
              <tr className="bg-[#080D1A]">
                <th scope="row" className="px-4 py-3 font-semibold text-white">Double drop / RGN</th>
                <td className="px-4 py-3 font-mono text-emerald-300">40,000 lbs legal · 150,000+ lbs permitted</td>
                <td className="px-4 py-3 font-mono text-slate-200">18"–24"</td>
                <td className="px-4 py-3 font-mono text-slate-200">11'6"–12'0"</td>
                <td className="px-4 py-3 font-mono text-slate-200">29' well (up to 50' stretch)</td>
              </tr>
              <tr className="bg-[#080D1A]">
                <th scope="row" className="px-4 py-3 font-semibold text-white">Hotshot 40' / box truck</th>
                <td className="px-4 py-3 font-mono text-emerald-300">16,500 lbs (Non-CDL) – 22,000 lbs (CDL)</td>
                <td className="px-4 py-3 font-mono text-slate-200">~34" gooseneck</td>
                <td className="px-4 py-3 font-mono text-slate-200">8'6" (102") within 13'6" overall</td>
                <td className="px-4 py-3 font-mono text-slate-200">40' deck · 60-min dispatch</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
