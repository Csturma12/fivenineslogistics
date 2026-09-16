"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, MapPin, PackageSearch, TriangleAlert, Truck } from "lucide-react"
import type { Load } from "@/lib/loads"
import { bookLoad } from "@/app/actions/book-load"

type LoadBoardMode = "public" | "carrier"

const US_STATE = /^[A-Za-z]{2}$/

function formatDate(value: string | null): string {
  if (!value) return "TBD"
  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatRate(value: number | null): string {
  if (value == null) return "Call for rate"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number | null): string | null {
  if (value == null) return null
  return new Intl.NumberFormat("en-US").format(value)
}

function lane(load: Load): string {
  const origin = [load.origin_city, load.origin_state].filter(Boolean).join(", ") || "Origin TBD"
  const dest = [load.dest_city, load.dest_state].filter(Boolean).join(", ") || "Destination TBD"
  return `${origin} → ${dest}`
}

export function LoadBoard({ loads: initialLoads, mode }: { loads: Load[]; mode: LoadBoardMode }) {
  const router = useRouter()
  const [loads, setLoads] = useState(initialLoads)
  const [originState, setOriginState] = useState("all")
  const [destState, setDestState] = useState("all")
  const [equipment, setEquipment] = useState("all")
  const [sort, setSort] = useState<"date" | "rate">("date")
  const [banner, setBanner] = useState<string | null>(null)

  const originStates = useMemo(
    () => Array.from(new Set(loads.map((l) => l.origin_state).filter((s): s is string => !!s && US_STATE.test(s)))).sort(),
    [loads],
  )
  const destStates = useMemo(
    () => Array.from(new Set(loads.map((l) => l.dest_state).filter((s): s is string => !!s && US_STATE.test(s)))).sort(),
    [loads],
  )
  const equipmentTypes = useMemo(
    () => Array.from(new Set(loads.map((l) => l.equipment).filter((e): e is string => !!e))).sort(),
    [loads],
  )

  const visible = useMemo(() => {
    const filtered = loads.filter((l) => {
      if (originState !== "all" && l.origin_state !== originState) return false
      if (destState !== "all" && l.dest_state !== destState) return false
      if (equipment !== "all" && l.equipment !== equipment) return false
      return true
    })
    return filtered.sort((a, b) => {
      if (sort === "rate") return (b.rate_usd ?? 0) - (a.rate_usd ?? 0)
      return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    })
  }, [loads, originState, destState, equipment, sort])

  if (loads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <PackageSearch className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">No open loads posted right now</p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          New freight is posted here as it becomes available. Check back shortly or contact dispatch
          to talk through upcoming lanes.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {banner ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground"
        >
          <TriangleAlert className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {banner}
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <FilterSelect label="Origin" value={originState} onChange={setOriginState} options={originStates} allLabel="All origins" />
        <FilterSelect label="Destination" value={destState} onChange={setDestState} options={destStates} allLabel="All destinations" />
        <FilterSelect label="Equipment" value={equipment} onChange={setEquipment} options={equipmentTypes} allLabel="All equipment" />
        <FilterSelect
          label="Sort by"
          value={sort}
          onChange={(v) => setSort(v as "date" | "rate")}
          options={["date", "rate"]}
          optionLabels={{ date: "Newest", rate: "Highest rate" }}
        />
        <p className="ml-auto self-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {visible.length} {visible.length === 1 ? "load" : "loads"}
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
        {visible.map((load) => (
          <LoadRow
            key={load.id}
            load={load}
            mode={mode}
            onBooked={(id, message) => {
              setLoads((prev) => prev.filter((l) => l.id !== id))
              setBanner(message)
              router.refresh()
            }}
          />
        ))}
        {visible.length === 0 ? (
          <div className="bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            No loads match these filters. Reset a filter to see more freight.
          </div>
        ) : null}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  optionLabels,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  allLabel?: string
  optionLabels?: Record<string, string>
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {allLabel ? <option value="all">{allLabel}</option> : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {optionLabels?.[opt] ?? opt}
          </option>
        ))}
      </select>
    </label>
  )
}

function LoadRow({
  load,
  mode,
  onBooked,
}: {
  load: Load
  mode: LoadBoardMode
  onBooked: (id: string, message: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const details: string[] = []
  const weight = formatNumber(load.weight_lbs)
  const distance = formatNumber(load.distance_mi)
  if (load.equipment) details.push(load.equipment)
  if (weight) details.push(`${weight} lbs`)
  if (distance) details.push(`${distance} mi`)
  if (load.stops != null) details.push(`${load.stops} stops`)

  function handleBook() {
    setError(null)
    startTransition(async () => {
      const result = await bookLoad(load.id)
      if (result.ok) {
        onBooked(load.id, `Booked ${lane(load)}. Dispatch has been notified and will confirm details.`)
      } else if (result.reason === "taken") {
        onBooked(load.id, `That load was just booked by another carrier. It has been removed from the board.`)
      } else if (result.reason === "unauthorized") {
        setError("Your session expired. Refresh and sign in again to book.")
      } else {
        setError("Something went wrong booking this load. Call dispatch to confirm.")
      }
    })
  }

  return (
    <div className="grid gap-4 bg-card p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
            {load.reference || load.external_id || "Load"}
          </span>
          {load.commodity ? (
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {load.commodity}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 flex items-center gap-2 text-pretty text-lg font-semibold tracking-tight text-foreground">
          <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          {lane(load)}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>Pickup {formatDate(load.pickup_date)}</span>
          <span aria-hidden="true">·</span>
          <span>Delivery {formatDate(load.delivery_date)}</span>
        </div>
        {details.length ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {details.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground"
              >
                {d}
              </span>
            ))}
          </div>
        ) : null}
        {load.notes ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{load.notes}</p>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Posted rate</p>
          <p className="text-xl font-semibold tracking-tight text-foreground">{formatRate(load.rate_usd)}</p>
        </div>
        {mode === "carrier" ? (
          <button
            type="button"
            onClick={handleBook}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {isPending ? "Booking…" : "Book It Now"}
            {isPending ? null : <Check className="size-3.5" aria-hidden="true" />}
          </button>
        ) : (
          <Link
            href="/portal/carrier"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary px-5 font-mono text-[11px] uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Truck className="size-3.5" aria-hidden="true" />
            Sign in to book
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
        {error ? <p className="max-w-[16rem] text-left text-xs text-[color:var(--status-alert)] sm:text-right">{error}</p> : null}
      </div>
    </div>
  )
}
