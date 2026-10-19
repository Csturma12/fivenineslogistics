"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Check, TriangleAlert } from "lucide-react"
import { submitDocumentRequest, type DocumentRequestState } from "@/app/actions/request-documents"
import { site } from "@/lib/site"

type Audience = "shipper" | "carrier"

const packets: Record<Audience, { title: string; blurb: string; documents: string[] }> = {
  shipper: {
    title: "Shipper & 3PL compliance packet",
    blurb:
      "Everything your AP, risk and vendor-setup teams need to onboard Five Nines under Primary Freight LLC's authority.",
    documents: [
      "W-9 (Primary Freight LLC)",
      "Certificate of Insurance (ACORD 25) — auto, GL, umbrella, contingent cargo",
      "FMCSA broker authority — MC# 841023 / U.S. DOT# 2436508",
      "BMC-84 surety bond certificate",
      "Five Nines agency authorization letter",
      "Mutual non-solicitation & blind-BOL agreement (3PL / forwarder partners)",
      "Trade & bank credit references",
      "Carrier vetting & zero double-brokering policy",
    ],
  },
  carrier: {
    title: "Carrier onboarding packet",
    blurb:
      "Get set up once with Primary Freight LLC and become a first call on critical Gulf Coast, Texas and nationwide freight.",
    documents: [
      "Broker–carrier agreement (Primary Freight LLC, MC# 841023)",
      "Carrier profile & equipment list",
      "Quick-pay and factoring notice-of-assignment forms",
      "Insurance requirements & COI holder instructions",
      "Highway identity verification invitation",
      "Site access & credential checklist (TWIC, PEC, FR, OSHA)",
    ],
  },
}

const inputClass =
  "h-11 w-full rounded-md border border-border bg-card/50 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
const labelClass = "mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"

const initialState: DocumentRequestState = { status: "idle" }

export function DocumentRequestForm({ defaultAudience = "shipper" }: { defaultAudience?: Audience }) {
  const [audience, setAudience] = useState<Audience>(defaultAudience)
  const [state, formAction, pending] = useActionState(submitDocumentRequest, initialState)
  const packet = packets[audience]
  const saved = state.status === "error" ? state.values : undefined
  const savedDocs = saved?.audience === audience ? saved.documents : undefined

  if (state.status === "success") {
    return (
      <div
        ref={(el) => {
          el?.scrollIntoView({ behavior: "smooth", block: "start" })
          el?.focus({ preventScroll: true })
        }}
        tabIndex={-1}
        className="scroll-mt-24 rounded-xl border border-border bg-card p-8 outline-none"
        role="status"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Check className="size-4" aria-hidden="true" />
          </span>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-primary">Request logged</div>
            <div className="text-sm text-muted-foreground">Ticket {state.ticket} is with our compliance desk.</div>
          </div>
        </div>
        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
          The packet is sent from {site.dispatchEmail} within one business hour. Time-critical setup? Call{" "}
          <a href={site.phoneHref} className="font-medium text-foreground underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <input type="hidden" name="audience" value={audience} />
      <div className="flex flex-col gap-6">
        <div>
          <span className={labelClass}>I am a</span>
          <div className="grid grid-cols-2 gap-2">
            {(["shipper", "carrier"] as Audience[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAudience(a)}
                aria-pressed={audience === a}
                className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  audience === a
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {a === "shipper" ? "Shipper / 3PL partner" : "Carrier"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground">{packet.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{packet.blurb}</p>
          <fieldset className="mt-4">
            <legend className={labelClass}>Documents needed</legend>
            <div className="grid gap-2">
              {packet.documents.map((doc) => (
                <label
                  key={doc}
                  className="flex items-start gap-3 rounded-md border border-border bg-card/50 px-3 py-2.5 text-sm text-foreground"
                >
                  <input type="checkbox" name="documents" value={doc} defaultChecked={savedDocs ? savedDocs.includes(doc) : true} className="mt-0.5 accent-[#1768b2]" />
                  <span>{doc}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="doc-name" className={labelClass}>Contact name</label>
            <input id="doc-name" name="name" required defaultValue={saved?.name} placeholder="Jordan Reyes" className={inputClass} />
          </div>
          <div>
            <label htmlFor="doc-company" className={labelClass}>Company</label>
            <input id="doc-company" name="company" required defaultValue={saved?.company} placeholder="Acme Industrial" className={inputClass} />
          </div>
          <div>
            <label htmlFor="doc-email" className={labelClass}>Work email</label>
            <input id="doc-email" name="email" type="email" required defaultValue={saved?.email} placeholder="jordan@acme.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="doc-phone" className={labelClass}>Phone</label>
            <input id="doc-phone" name="phone" type="tel" defaultValue={saved?.phone} placeholder="(555) 010-4477" className={inputClass} />
          </div>
          {audience === "carrier" && (
            <div className="sm:col-span-2">
              <label htmlFor="doc-mc" className={labelClass}>Your MC / DOT number</label>
              <input id="doc-mc" name="mc_number" defaultValue={saved?.mc_number} placeholder="MC# 000000 / DOT# 0000000" className={inputClass} />
            </div>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="doc-notes" className={labelClass}>Notes (vendor portal, COI holder wording, deadlines)</label>
            <textarea id="doc-notes" name="notes" rows={3} defaultValue={saved?.notes} className={`${inputClass} h-auto resize-y py-3`} />
          </div>
        </div>

        {state.status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-foreground"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="design-button justify-between disabled:opacity-60"
        >
          {pending ? "Sending…" : "Request packet"}
          {!pending && <ArrowRight size={16} aria-hidden="true" />}
        </button>
        <p className="text-center font-mono text-[11px] tracking-wide text-muted-foreground/70">
          Sent within one business hour · {site.dispatchEmail}
        </p>
      </div>
    </form>
  )
}
