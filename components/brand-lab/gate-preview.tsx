"use client"

import { useState } from "react"
import { ArrowRight, Check, Download, FileText } from "lucide-react"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { cn } from "@/lib/utils"

type Gate = "customer" | "carrier"

function GateHeader({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 bg-navy px-6 py-4 text-navy-foreground">
      <div className="flex items-center gap-2.5">
        <FiveNinesMark className="h-6 w-6 text-navy-foreground" />
        <span className="text-sm font-bold tracking-tight">FIVE NINES</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-foreground/55">{label}</span>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-navy-foreground/55">{right}</span>
    </header>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{children}</span>
}

function TextArea({ placeholder, rows = 3 }: { placeholder: string; rows?: number }) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/55 focus:border-ring focus:ring-2 focus:ring-ring/25"
    />
  )
}

function UploadedCard({ title, file }: { title: string; file: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[color:var(--status-ok)]/45 bg-[color:var(--status-ok)]/8 px-4 py-3">
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="font-mono text-xs text-muted-foreground">{file}</div>
      </div>
      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--status-ok)]">
        Uploaded <Check className="size-3.5" />
      </span>
    </div>
  )
}

function UploadCard({ title, note, action = "Upload" }: { title: string; note: string; action?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-border bg-background px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{note}</div>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{action}</span>
    </div>
  )
}

function CustomerGate() {
  const profile = ["All OTR", "Mixed ocean + domestic", "High value", "Drayage", "Oversize / permitted"]
  const active = new Set(["All OTR", "High value"])
  const [freq, setFreq] = useState("Weekly")

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <GateHeader label="Customer Setup" right="Step 2 of 3 · Billing & Profile" />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
        {/* Billing & documents */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">Billing &amp; documents</h3>
          <UploadedCard title="W-9" file="w9_gulfstream_fab.pdf" />
          <label className="flex flex-col gap-2">
            <FieldLabel>Invoice instructions</FieldLabel>
            <TextArea placeholder="AP contact, invoice email, PO requirements, portal if any…" />
          </label>
          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">Our remit-to / ACH instructions</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--status-ok)]">
                Download PDF <Download className="size-3.5" />
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Banking and ACH details for your AP system are issued on approval, on company letterhead — verify by phone at (205) 842-3755 before first payment.
            </p>
          </div>
          <label className="flex flex-col gap-2">
            <FieldLabel>Special requests</FieldLabel>
            <TextArea placeholder="Site rules, delivery windows, escort requirements…" />
          </label>
        </div>

        {/* Supply chain */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">Your supply chain</h3>
          <label className="flex flex-col gap-2">
            <FieldLabel>Brief summary</FieldLabel>
            <TextArea placeholder="e.g. inbound switchgear from two fabricators, OFCI to three live sites…" />
          </label>
          <div className="flex flex-col gap-3">
            <FieldLabel>Freight profile</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {profile.map((p) => (
                <span
                  key={p}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    active.has(p)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground",
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <FieldLabel>Primary equipment</FieldLabel>
              <div className="flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground">
                Flatbed / step deck
                <ArrowRight className="size-3.5 rotate-90 text-muted-foreground" />
              </div>
            </label>
            <div className="flex flex-col gap-2">
              <FieldLabel>Frequency</FieldLabel>
              <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1">
                {["Weekly", "Monthly", "Project"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={cn(
                      "rounded-md py-2 text-sm transition-colors",
                      freq === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto flex items-center justify-end gap-3 border-t border-border pt-6">
            <button className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Back
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90">
              Continue → Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CarrierGate() {
  const steps = [
    { n: 1, label: "Authority", state: "done" as const },
    { n: 2, label: "Documents", state: "active" as const },
    { n: 3, label: "References", state: "todo" as const },
    { n: 4, label: "Review", state: "todo" as const },
  ]
  const [factor, setFactor] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <GateHeader label="Carrier Setup" right="carriers@fivenineslogistics.com" />
      <div className="flex flex-col gap-8 p-6 sm:p-8">
        {/* Stepper */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.n} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                    s.state === "done" && "bg-[color:var(--status-ok)] text-background",
                    s.state === "active" && "bg-foreground text-background",
                    s.state === "todo" && "border border-border text-muted-foreground",
                  )}
                >
                  {s.state === "done" ? <Check className="size-4" /> : s.n}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    s.state === "todo" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 hidden h-px flex-1 sm:block",
                    s.state === "done" ? "bg-[color:var(--status-ok)]" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <FieldLabel>MC number</FieldLabel>
            <div className="flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground">
              MC 771204
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[color:var(--status-ok)]">
                Authority active <Check className="size-3.5" />
              </span>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <FieldLabel>USDOT number</FieldLabel>
            <div className="rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground">2249318</div>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <FieldLabel>Required documents</FieldLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            <UploadedCard title="W-9" file="w9_hardline_transport.pdf" />
            <UploadCard title="Certificate of Insurance" note="$1M auto · $100K cargo · list us as certificate holder" />
            <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-border bg-background px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">Signed carrier packet</div>
                <div className="text-xs text-muted-foreground">
                  Download, sign, return — <span className="text-primary underline underline-offset-2">get the packet</span>
                </div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Upload</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  Notice of Assignment
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">if applicable</span>
                </div>
                <div className="text-xs text-muted-foreground">Only if you factor your invoices</div>
              </div>
              <button
                role="switch"
                aria-checked={factor}
                aria-label="I factor my invoices"
                onClick={() => setFactor((v) => !v)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  factor ? "bg-[color:var(--status-ok)]" : "bg-border",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-background transition-transform",
                    factor ? "translate-x-[22px]" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">Next: two broker references. Setup reviewed same business day.</p>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Back
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90">
              Continue → References
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GatePreview() {
  const [gate, setGate] = useState<Gate>("customer")
  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Gate" className="flex gap-1 self-start rounded-lg border border-border bg-background p-1">
        {(["customer", "carrier"] as Gate[]).map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={gate === g}
            onClick={() => setGate(g)}
            className={cn(
              "rounded-md px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
              gate === g ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {g} gate
          </button>
        ))}
      </div>
      {gate === "customer" ? <CustomerGate /> : <CarrierGate />}
    </div>
  )
}
