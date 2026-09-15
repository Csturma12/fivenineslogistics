"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitRequestCapacity, type RequestState } from "@/app/actions/request-capacity"

const modes = [
  "Flatbed",
  "Expedited",
  "Drayage",
  "Hotshot",
  "Box truck",
  "Oversize & heavy haul",
  "Ocean",
  "LTL",
  "Not sure yet",
]
const cadences = ["One-time", "Weekly", "Daily", "Dedicated capacity"]

const inputClass =
  "h-11 w-full rounded-md border border-border bg-card/50 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
const labelClass = "mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"

const initialState: RequestState = { status: "idle" }

export function RequestCapacityForm() {
  const [state, formAction, pending] = useActionState(submitRequestCapacity, initialState)
  const [mode, setMode] = useState(modes[0])
  const [cadence, setCadence] = useState(cadences[0])

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Check className="size-4" />
          </span>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-primary">Request logged</div>
            <div className="text-sm text-muted-foreground">Ticket {state.ticket} is in the control tower queue.</div>
          </div>
        </div>
        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
          A dispatch coordinator will confirm capacity and pricing within one business hour. Every request is tracked
          against the same five-nines SLA as live freight.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button render={<Link href="/" />} nativeButton={false} variant="outline" className="font-medium">
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
      <input type="hidden" name="requestType" value="capacity" />
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="cadence" value={cadence} />
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Contact name
            </label>
            <input id="name" name="name" required placeholder="Jordan Reyes" className={inputClass} />
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>
              Company
            </label>
            <input id="company" name="company" required placeholder="Acme Distribution" className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jordan@acme.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input id="phone" name="phone" type="tel" placeholder="(555) 010-4477" className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="origin" className={labelClass}>
              Origin
            </label>
            <input id="origin" name="origin" required placeholder="Chicago, IL" className={inputClass} />
          </div>
          <div>
            <label htmlFor="destination" className={labelClass}>
              Destination
            </label>
            <input id="destination" name="destination" required placeholder="Dallas, TX" className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className={labelClass}>Freight mode</span>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`rounded-md border px-3 py-2 text-xs transition-colors ${
                    mode === m
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className={labelClass}>Cadence</span>
            <div className="flex flex-wrap gap-2">
              {cadences.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCadence(c)}
                  aria-pressed={cadence === c}
                  className={`rounded-md border px-3 py-2 text-xs transition-colors ${
                    cadence === c
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="details" className={labelClass}>
            Lane details
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            placeholder="Commodity, weight, equipment, pickup window, and any accessorials."
            className={`${inputClass} h-auto resize-y py-3`}
          />
        </div>

        {state.status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-foreground"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{state.message}</span>
          </div>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-1 font-medium">
          {pending ? "Submitting…" : "Submit capacity request"}
          {!pending && <ArrowRight className="size-4" data-icon="inline-end" />}
        </Button>
        <p className="text-center font-mono text-[11px] tracking-wide text-muted-foreground/70">
          Response within one business hour · 24/7/365 control tower
        </p>
      </div>
    </form>
  )
}
