"use client"

import { useState } from "react"
import {
  Building2,
  ChevronDown,
  FileText,
  HelpCircle,
  MessageSquare,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

type Position = {
  myReports: number
  myRate: number
  delta: number // percent; negative = below market, positive = above
}

type Timeframe = {
  label: string
  span: string
  rate: number
  low: number
  high: number
  reports: number
  companies: number
  position: Position
}

const headline = {
  label: "7 Day",
  span: "3dz - mkt",
  rate: 817,
  low: 781,
  high: 1176,
  trend: "down" as const,
  reports: 12,
  companies: 6,
  position: { myReports: 1, myRate: 799, delta: -2 },
}

const timeframes: Timeframe[] = [
  {
    label: "15D",
    span: "3dz-3dz",
    rate: 929,
    low: 775,
    high: 1027,
    reports: 21,
    companies: 3,
    position: { myReports: 1, myRate: 799, delta: -14 },
  },
  {
    label: "90D",
    span: "3dz-3dz",
    rate: 746,
    low: 695,
    high: 855,
    reports: 56,
    companies: 10,
    position: { myReports: 1, myRate: 799, delta: 7 },
  },
  {
    label: "1Y",
    span: "3dz-3dz",
    rate: 691,
    low: 602,
    high: 786,
    reports: 161,
    companies: 18,
    position: { myReports: 2, myRate: 652, delta: -6 },
  },
]

const forecast = {
  label: "+35D Forecast",
  rate: 786,
  low: 759,
  high: 814,
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`

function PositionReadout({ position }: { position: Position }) {
  const below = position.delta < 0
  const Icon = below ? TrendingDown : TrendingUp
  return (
    <div className="min-w-0">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {position.myReports} My Company {position.myReports === 1 ? "Report" : "Reports"}
      </p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-sm">
        <span className="font-semibold text-foreground">{usd(position.myRate)}</span>
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            below ? "text-status-ok" : "text-status-warn"
          }`}
        >
          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
          {Math.abs(position.delta)}% {below ? "Below" : "Above"}
        </span>
      </p>
    </div>
  )
}

function Counts({ reports, companies }: { reports: number; companies: number }) {
  return (
    <div className="flex flex-col gap-1.5 font-mono text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <FileText className="size-3.5 shrink-0 text-foreground/50" aria-hidden="true" />
        {reports}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Building2 className="size-3.5 shrink-0 text-foreground/50" aria-hidden="true" />
        {companies}
      </span>
    </div>
  )
}

export function RatePanel() {
  const [showTimeframes, setShowTimeframes] = useState(true)

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Brand strip — ties the tool to the control-tower signature */}
      <div className="flex items-center justify-between border-b border-border bg-navy px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-foreground/70">
          Rate Intelligence
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-navy-foreground/70">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-ok-dark opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-status-ok-dark" />
          </span>
          Live
        </span>
      </div>

      {/* Headline: 7 Day best-fit rate */}
      <div className="px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-sm font-semibold text-foreground">
                {headline.label} <span className="text-muted-foreground">({headline.span})</span>
              </h2>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                Best Fit Rate
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {usd(headline.rate)}
              </span>
              <TrendingDown className="size-5 text-status-warn" aria-hidden="true" />
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {usd(headline.low)} &ndash; {usd(headline.high)}
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5 text-foreground/50" aria-hidden="true" />
                {headline.reports} Reports
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-3.5 text-foreground/50" aria-hidden="true" />
                {headline.companies} Companies
              </span>
            </div>
            <p className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {headline.position.myReports} My Company Reports
              <HelpCircle className="size-3 text-muted-foreground/70" aria-hidden="true" />
            </p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-sm">
              <span className="font-semibold text-foreground">{usd(headline.position.myRate)}</span>
              <span className="text-muted-foreground">
                (Position to RateView: {Math.abs(headline.position.delta)}% Below)
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTimeframes((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-expanded={showTimeframes}
        >
          <ChevronDown
            className={`size-3.5 transition-transform ${showTimeframes ? "" : "-rotate-90"}`}
            aria-hidden="true"
          />
          {showTimeframes ? "Hide" : "Show"} Additional Timeframes
        </button>
      </div>

      {/* Timeframe cards */}
      {showTimeframes && (
        <div className="space-y-3 px-4 pb-4 sm:px-5">
          {timeframes.map((tf) => (
            <div
              key={tf.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto_minmax(0,1.3fr)] items-center gap-3 rounded-md border border-border bg-secondary/40 px-4 py-3"
            >
              <div>
                <p className="font-mono text-sm font-semibold text-foreground">{tf.label}</p>
                <p className="font-mono text-[11px] text-muted-foreground">({tf.span})</p>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{usd(tf.rate)}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  ({usd(tf.low)} &ndash; {usd(tf.high)})
                </p>
              </div>
              <Counts reports={tf.reports} companies={tf.companies} />
              <PositionReadout position={tf.position} />
            </div>
          ))}

          {/* Forecast */}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto_minmax(0,1.3fr)] items-center gap-3 rounded-md border border-dashed border-border px-4 py-3">
            <p className="font-mono text-sm font-semibold text-foreground">{forecast.label}</p>
            <div>
              <p className="text-base font-semibold text-foreground">{usd(forecast.rate)}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                ({usd(forecast.low)} &ndash; {usd(forecast.high)})
              </p>
            </div>
            <div />
            <div />
          </div>
        </div>
      )}
    </div>
  )
}
