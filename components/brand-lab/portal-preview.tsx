"use client"

import { useState } from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { SignalFiveMark } from "@/components/brand-lab/candidate-marks"
import { cn } from "@/lib/utils"

type Role = "customer" | "carrier"

const liveLoads = [
  { id: "LN-3402", lane: "PORT → HOU", status: "ARRIVING · 6 MIN", tone: "primary" as const },
  { id: "LN-2291", lane: "HOU → DFW", status: "ETA 14:20 · ON PLAN", tone: "muted" as const },
  { id: "LN-4519", lane: "HOU → NOLA", status: "MONITORING · WX", tone: "warn" as const },
]

export function PortalPreview() {
  const [role, setRole] = useState<Role>("customer")

  return (
    <div className="grid overflow-hidden rounded-xl border border-border lg:grid-cols-2">
      {/* Control-tower panel */}
      <div className="flex flex-col justify-between gap-10 bg-navy p-8 text-navy-foreground">
        <div className="flex items-center gap-2.5">
          <SignalFiveMark className="h-7 w-7 text-navy-foreground" />
          <span className="text-sm font-semibold tracking-tight">FIVE NINES</span>
        </div>

        <div>
          <h3 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight">
            The control tower is always on.
            <br />
            <span className="text-primary">So is your login.</span>
          </h3>

          <dl className="mt-8 flex flex-col gap-2 rounded-lg border border-navy-foreground/15 p-4">
            {liveLoads.map((load) => (
              <div key={load.id} className="flex items-center justify-between gap-4 font-mono text-[11px]">
                <dt className="tracking-wider text-navy-foreground/70">
                  {load.id} <span className="text-navy-foreground/40">·</span> {load.lane}
                </dt>
                <dd
                  className={cn(
                    "tracking-wider",
                    load.tone === "primary" && "text-[color:var(--status-ok-dark)]",
                    load.tone === "warn" && "text-[color:var(--status-warn-dark)]",
                    load.tone === "muted" && "text-navy-foreground/60",
                  )}
                >
                  {load.status}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/45">
          99.999% on-time · dispatch 24/7/365 · MC# 841023
        </p>
      </div>

      {/* Sign-in panel */}
      <div className="bg-card p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your loads, documents, and settlements — one login.
        </p>

        <div
          role="tablist"
          aria-label="Account type"
          className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-background p-1"
        >
          {(["customer", "carrier"] as Role[]).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={role === r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-md py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                role === r
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Work email
            </span>
            <input
              type="email"
              placeholder={role === "customer" ? "ops@yourcompany.com" : "dispatch@yourauthority.com"}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              placeholder="••••••••••"
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </label>

          <button className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90">
            Sign in <ArrowRight className="size-3.5" />
          </button>

          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
            <button className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Forgot password
            </button>
            <span className="text-primary">Dispatch answers in &lt; 1 hr</span>
          </div>
        </div>

        {role === "carrier" && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-background p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Need our certificate of insurance, or to be added as a certificate holder? Request it
              during onboarding and we&apos;ll send it over.
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            New to Five Nines?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Become a customer
            </button>
            <button className="rounded-lg border border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary">
              Haul for us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Customer */}
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="font-mono text-xs uppercase tracking-wider text-foreground">
            Customer · Gulfstream Fab
          </h4>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok)]">
            On-time 100% · 90d
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { n: "4", l: "In transit" },
            { n: "1", l: "Arriving today" },
            { n: "0", l: "Exceptions" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-border p-3">
              <div className="text-2xl font-semibold text-foreground">{s.n}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {liveLoads.map((load) => (
            <div
              key={load.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 font-mono text-[11px]",
                load.tone === "warn"
                  ? "border-[color:var(--status-warn)]/40 bg-[color:var(--status-warn)]/8"
                  : "border-border",
              )}
            >
              <span className="tracking-wider text-foreground">
                {load.id} <span className="text-muted-foreground">· {load.lane}</span>
              </span>
              <span
                className={cn(
                  "tracking-wider",
                  load.tone === "primary" && "text-[color:var(--status-ok)]",
                  load.tone === "warn" && "text-[color:var(--status-warn)]",
                  load.tone === "muted" && "text-muted-foreground",
                )}
              >
                {load.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground">
            Request capacity
          </button>
          <button className="rounded-lg border border-border py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground">
            Monthly scorecard
          </button>
        </div>
      </div>

      {/* Carrier */}
      <div className="flex flex-col gap-5 rounded-xl border border-navy/40 bg-navy p-6 text-navy-foreground">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="font-mono text-xs uppercase tracking-wider">Carrier · Hardline Transport</h4>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">Setup complete</span>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/50">Offered to you</p>
          <div className="mt-2 flex flex-col gap-2">
            {[
              { lane: "HOU → DFW · FLATBED · 44K", note: "Pickup 06:00 · switchgear, tarped", pay: "$1,180" },
              { lane: "HOU → BTR · HOTSHOT · 8K", note: "Same day · valve skid, refinery TAR", pay: "$740" },
            ].map((o) => (
              <div key={o.lane} className="flex items-center justify-between gap-3 rounded-lg border border-navy-foreground/15 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] tracking-wider">{o.lane}</div>
                  <div className="mt-0.5 truncate text-[11px] text-navy-foreground/55">{o.note}</div>
                </div>
                <div className="font-mono text-sm font-semibold text-[color:var(--status-ok-dark)]">{o.pay}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/50">Settlements</p>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-navy-foreground/15 px-3 py-2.5 font-mono text-[11px]">
            <span className="tracking-wider">LN-1187 · POD received</span>
            <span className="tracking-wider text-[color:var(--status-ok-dark)]">Pays Fri · $2,050</span>
          </div>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground">
            Accept load
          </button>
          <button className="rounded-lg border border-navy-foreground/25 py-2.5 font-mono text-[11px] uppercase tracking-wider text-navy-foreground">
            Upload POD
          </button>
        </div>
      </div>
    </div>
  )
}
