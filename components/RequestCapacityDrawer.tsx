"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react"
import Link from "next/link"
import { X, TriangleAlert, Zap } from "lucide-react"
import { notifyQuoteDrawer, type QuoteMode } from "@/app/actions/quote-drawer"
import { isSupabaseConfigured, newLoadReference, splitCityState, supabase, type LoadInsert } from "@/lib/supabase"
import { site } from "@/lib/site"

/* ------------------------------------------------------------------ */
/* Context — any `Request Capacity` CTA calls openPanel()              */
/* ------------------------------------------------------------------ */

type Tab = "single" | "upload" | "emergency"

type RequestCapacityContextValue = {
  open: boolean
  /** Opens the drawer on the default "Spec a Single Move" tab. Safe to pass directly as an onClick. */
  openPanel: () => void
  /** Opens the drawer on a specific tab, e.g. the line-down emergency form. */
  openTab: (tab: Tab) => void
  closePanel: () => void
}

const RequestCapacityContext = createContext<RequestCapacityContextValue | null>(null)

export function useRequestCapacity() {
  const ctx = useContext(RequestCapacityContext)
  if (!ctx) throw new Error("useRequestCapacity must be used within a RequestCapacityProvider")
  return ctx
}

export function RequestCapacityProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<Tab>("single")
  const openTab = useCallback((tab: Tab) => {
    setInitialTab(tab)
    setOpen(true)
  }, [])
  const openPanel = useCallback(() => openTab("single"), [openTab])
  const closePanel = useCallback(() => setOpen(false), [])

  return (
    <RequestCapacityContext.Provider value={{ open, openPanel, openTab, closePanel }}>
      {children}
      <RequestCapacityDrawer open={open} initialTab={initialTab} onClose={closePanel} />
    </RequestCapacityContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* Drawer                                                              */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
const labelClass = "mb-1 block text-xs font-medium text-slate-300"

const constraints = [
  ["Hard Crane / Install Slot", "Hard Crane / Install Slot (Zero Slack)"],
  ["Plant Turnaround Window", "Plant Turnaround / Shutdown Window"],
  ["Direct Expedited", "Direct / Expedited Straight-Through"],
  ["Standard Dock Hours", "Standard Commercial Dock Hours"],
] as const

const equipmentOptions = [
  ["Flatbed (48'/53')", "Flatbed (48' / 53')"],
  ["Step Deck", "Step Deck / Drop Deck"],
  ["Hotshot (40' Gooseneck)", "Hotshot (40' Gooseneck)"],
  ["RGN / Heavy Haul", "RGN / Double Drop / Heavy Haul"],
  ["Port Drayage / Transload", "Port Drayage / Transload"],
  ["Sprinter / Box Truck", "Sprinter / Straight Box Truck"],
  ["53' Dry Van", "53' Dry Van"],
] as const

const siteRequirements = [
  ["Crane Unload", "Crane Unload"],
  ["Tarps Required", "Tarps (4/6/8ft)"],
  ["TWIC Required", "TWIC Driver"],
  ["Plant PPE / FR Gear", "Plant PPE / FR"],
  ["Over-Dimensional", "Over-Dimensional"],
  ["3PL Blind Shipment", "3PL Blind / White-Label"],
] as const

type Submission = { reference: string; mode: QuoteMode; persisted: boolean }

export function RequestCapacityDrawer({
  open,
  initialTab = "single",
  onClose,
}: {
  open: boolean
  initialTab?: Tab
  onClose: () => void
}) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      setTab(initialTab)
      setSubmission(null)
      setError(null)
    }
  }, [open, initialTab])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  const handleSubmit = (mode: QuoteMode) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const reference = newLoadReference()
    formData.set("reference", reference)
    setError(null)

    startTransition(async () => {
      let persisted = false

      if (mode === "STANDARD-SPOT" && isSupabaseConfigured && supabase) {
        const origin = splitCityState(String(formData.get("origin") ?? ""), "TX")
        const dest = splitCityState(String(formData.get("destination") ?? ""), "US")
        const row: LoadInsert = {
          reference_number: reference,
          origin_city: origin.city,
          origin_state: origin.state,
          dest_city: dest.city,
          dest_state: dest.state,
          pickup_window: String(formData.get("pickup") ?? ""),
          delivery_window: String(formData.get("constraint") ?? ""),
          constraint_type: String(formData.get("constraint") ?? ""),
          equipment_type: String(formData.get("equipment") ?? ""),
          weight_lbs: parseInt(String(formData.get("weight") ?? ""), 10) || 40000,
          commodity: String(formData.get("commodity") ?? ""),
          site_requirements: formData.getAll("site_req").map(String),
          contact_name: String(formData.get("name") ?? ""),
          contact_email: String(formData.get("email") ?? ""),
          contact_phone: String(formData.get("phone") ?? ""),
          status: "quoted", // Immediately visible to authenticated carriers on the load board.
        }
        const { error: insertError } = await supabase.from("loads").insert([row])
        if (insertError) {
          console.log("[quote-drawer] Supabase insert failed:", insertError.message)
        } else {
          persisted = true
        }
      }

      formData.set("persisted", String(persisted))
      const result = await notifyQuoteDrawer(mode, formData)
      if (!result.ok) {
        setError(result.message ?? `Something went wrong. Call ${site.phone}.`)
        return
      }
      form.reset()
      setSubmission({ reference: result.reference, mode, persisted })
    })
  }

  const tabButton = (id: Tab, active: string, idle: string) =>
    `text-left px-3 py-2 rounded-md border transition ${tab === id ? active : idle}`

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Request capacity"
        className={`absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col justify-between overflow-y-auto border-l border-slate-800 bg-[#0B111E] text-slate-100 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Sticky header */}
          <div className="sticky top-0 z-20 border-b border-slate-800 bg-[#0B111E]/95 px-6 py-5 backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-amber-400">
                5N / Dispatch &amp; Capacity Desk · {site.mc}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">What needs to be there, and when?</h2>
            <p className="mt-1 text-sm text-slate-400">
              No login required. A senior dispatch coordinator confirms vetted capacity and all-in pricing within{" "}
              <strong className="text-slate-200">60 minutes</strong> (or{" "}
              <strong className="text-amber-400">15 minutes</strong> for line-down emergencies).
            </p>

            <div
              className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-slate-800 bg-slate-900/90 p-1.5"
              role="tablist"
              aria-label="Request type"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "single"}
                onClick={() => setTab("single")}
                className={tabButton(
                  "single",
                  "border-slate-700 bg-slate-800 text-white",
                  "border-transparent text-slate-400 hover:text-slate-200",
                )}
              >
                <div className="font-mono text-[11px] text-amber-400">01 / SPOT &amp; CRITICAL</div>
                <div className="truncate text-xs font-semibold">Spec a Single Move</div>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "upload"}
                onClick={() => setTab("upload")}
                className={tabButton(
                  "upload",
                  "border-slate-700 bg-slate-800 text-white",
                  "border-transparent text-slate-400 hover:text-slate-200",
                )}
              >
                <div className="font-mono text-[11px] text-slate-400">02 / MULTI-LANE &amp; BOM</div>
                <div className="truncate text-xs font-semibold">Upload Spec / RFP</div>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "emergency"}
                onClick={() => setTab("emergency")}
                className={tabButton(
                  "emergency",
                  "border-red-500/40 bg-red-950/50 text-red-100",
                  "border-transparent text-red-300 hover:text-red-200",
                )}
              >
                <div className="flex items-center gap-1 font-mono text-[11px] text-red-400">
                  <span className="size-2 animate-pulse rounded-full bg-red-500" aria-hidden="true" /> 03 / HOTSHOT
                </div>
                <div className="truncate text-xs font-semibold">Line-Down Emergency</div>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {submission ? (
              <Confirmation submission={submission} onClose={onClose} />
            ) : (
              <>
                {tab === "single" && (
                  <form onSubmit={handleSubmit("STANDARD-SPOT")} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Origin City, State *" htmlFor="q-origin">
                        <input id="q-origin" name="origin" required placeholder="e.g., Houston, TX" className={inputClass} />
                      </Field>
                      <Field label="Destination City, State *" htmlFor="q-dest">
                        <input id="q-dest" name="destination" required placeholder="e.g., New Albany, OH" className={inputClass} />
                      </Field>
                      <Field label="Pickup Date & Ready Time *" htmlFor="q-pickup">
                        <input id="q-pickup" name="pickup" required placeholder="e.g., Tomorrow 08:00 AM" className={inputClass} />
                      </Field>
                      <Field label="Delivery Window Constraint *" htmlFor="q-constraint">
                        <select id="q-constraint" name="constraint" required className={inputClass}>
                          {constraints.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Equipment Required *" htmlFor="q-equip">
                        <select id="q-equip" name="equipment" required className={inputClass}>
                          {equipmentOptions.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Total Weight (lbs) *" htmlFor="q-weight">
                        <input id="q-weight" name="weight" type="number" min={1} required placeholder="42000" className={inputClass} />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Commodity, Dimensions & Estimated Cargo Value *" htmlFor="q-commodity">
                          <input
                            id="q-commodity"
                            name="commodity"
                            required
                            placeholder={`e.g., 15kV Switchgear Skid (24'L x 102"W x 96"H) | Value: $250k`}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </div>

                    <fieldset>
                      <legend className="mb-2 block text-xs font-medium text-slate-300">
                        Site Access &amp; Securement Requirements
                      </legend>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 sm:grid-cols-3">
                        {siteRequirements.map(([value, label]) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900/70 px-3 py-2"
                          >
                            <input type="checkbox" name="site_req" value={value} className="accent-amber-500" /> {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid grid-cols-1 gap-3 border-t border-slate-800 pt-4 sm:grid-cols-3">
                      <input name="name" required placeholder="Your Name *" aria-label="Your name" className={inputClass} />
                      <input name="email" type="email" required placeholder="Work Email *" aria-label="Work email" className={inputClass} />
                      <input name="phone" type="tel" required placeholder="Direct Phone *" aria-label="Direct phone" className={inputClass} />
                    </div>

                    <ErrorNotice message={error} />

                    <button
                      type="submit"
                      disabled={pending}
                      className="w-full rounded bg-amber-500 px-5 py-3 text-sm font-bold tracking-wide text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
                    >
                      {pending ? "Posting to the board…" : "Confirm Capacity & Pricing (60-Min SLA) →"}
                    </button>
                  </form>
                )}

                {tab === "upload" && (
                  <form onSubmit={handleSubmit("PROJECT-RFP")} className="space-y-4">
                    <div className="rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/40 p-6 text-center transition hover:border-amber-400">
                      <p className="mb-1 text-sm font-medium text-slate-200">
                        Drag &amp; drop your BOM, Packing List, CAD Spec, or Multi-Lane RFP
                      </p>
                      <p className="mb-3 text-xs text-slate-500">Supports .XLSX, .CSV, .PDF, .DOCX, .PNG (up to 20MB total)</p>
                      <input
                        type="file"
                        name="files"
                        required
                        multiple
                        accept=".xlsx,.xls,.csv,.pdf,.docx,.doc,.png,.jpg,.jpeg,.dwg,.dxf"
                        className="mx-auto block text-xs text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-950"
                      />
                    </div>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Project timeline, origin/destination gateways, or laydown staging notes..."
                      className={inputClass}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input name="name" required placeholder="Your Name & Company *" aria-label="Your name and company" className={inputClass} />
                      <input name="email" type="email" required placeholder="Work Email *" aria-label="Work email" className={inputClass} />
                    </div>
                    <ErrorNotice message={error} />
                    <button
                      type="submit"
                      disabled={pending}
                      className="w-full rounded bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
                    >
                      {pending ? "Uploading specs…" : "Submit Project Specs for Pricing →"}
                    </button>
                  </form>
                )}

                {tab === "emergency" && (
                  <form onSubmit={handleSubmit("EMERGENCY-HOTSHOT")} className="space-y-4">
                    <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-xs text-slate-200">
                      <strong className="mb-1 block font-mono uppercase text-red-400">● 24/7 Live Dispatch Escalation</strong>
                      Pages our on-call senior dispatch coordinator immediately. Expect a phone call within 15 minutes, or
                      call{" "}
                      <a href={site.phoneHref} className="font-bold text-amber-400 underline">
                        {site.phone}
                      </a>{" "}
                      now.
                    </div>
                    <input name="contact" required placeholder="Your Name & Direct Cell Number *" aria-label="Your name and cell number" className={`${inputClass} py-2.5`} />
                    <input name="lane" required placeholder="Pickup City/ZIP & Delivery City/ZIP *" aria-label="Pickup and delivery" className={`${inputClass} py-2.5`} />
                    <input name="freight" required placeholder="Freight Description & Approx Weight *" aria-label="Freight description and weight" className={`${inputClass} py-2.5`} />
                    <input name="deadline" required placeholder="Hard Delivery Deadline *" aria-label="Hard delivery deadline" className={`${inputClass} py-2.5`} />
                    <ErrorNotice message={error} />
                    <button
                      type="submit"
                      disabled={pending}
                      className="flex w-full items-center justify-center gap-2 rounded bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      <Zap size={16} aria-hidden="true" />
                      {pending ? "Paging dispatch…" : "Trigger 15-Minute Emergency Callback →"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-slate-800 bg-slate-950 px-6 py-4 text-xs text-slate-400 sm:flex-row sm:justify-between">
          <span>
            24/7 Dispatch:{" "}
            <a href={site.phoneHref} className="text-amber-400">
              {site.phone}
            </a>{" "}
            · <a href={`mailto:${site.dispatchEmail}`}>{site.dispatchEmail}</a>
          </span>
          <span className="font-mono text-slate-500">Agent of Primary Freight LLC · {site.mc}</span>
        </div>
      </aside>
    </div>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ErrorNotice({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded border border-red-500/40 bg-red-950/40 px-3 py-2.5 text-sm text-red-100"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

function Confirmation({ submission, onClose }: { submission: Submission; onClose: () => void }) {
  const emergency = submission.mode === "EMERGENCY-HOTSHOT"
  return (
    <div className="space-y-4 py-6" role="status">
      <div className="inline-block rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs uppercase text-emerald-400">
        Status: {submission.persisted ? "Received & posted to board" : "Received by dispatch"} · Ref #{submission.reference}
      </div>
      <h3 className="text-2xl font-bold text-white">
        {emergency ? "Dispatch has been paged." : "Your move is on the board."}
      </h3>
      <p className="text-sm text-slate-300">
        {emergency
          ? `Our on-call coordinator is calling you back within 15 minutes. If you don't hear from us, call ${site.phone} directly.`
          : "Our Houston dispatch desk is verifying active equipment availability in your origin lane right now."}
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/request-documents"
          onClick={onClose}
          className="rounded border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          Download W-9 / {site.mc} Onboarding Packet
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-transparent px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  )
}
