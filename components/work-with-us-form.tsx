"use client"

import { useActionState } from "react"
import { ArrowRight, Check, Paperclip, TriangleAlert } from "lucide-react"
import { submitApplication, type ApplicationState } from "@/app/actions/work-with-us"
import { site } from "@/lib/site"

const roles = ["Freight agent", "Owner-operator / independent contractor", "Accounting", "Operations / administrative"]

const inputClass =
  "h-11 w-full rounded-md border border-border bg-card/50 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
const labelClass = "mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"

const initialState: ApplicationState = { status: "idle" }

export function WorkWithUsForm() {
  const [state, formAction, pending] = useActionState(submitApplication, initialState)

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-card p-8" role="status">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Check className="size-4" aria-hidden="true" />
          </span>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-primary">Application received</div>
            <div className="text-sm text-muted-foreground">Your details and résumé are with our team.</div>
          </div>
        </div>
        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
          We read every application and follow up on the ones that fit as the team grows. Questions? Call{" "}
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="app-name" className={labelClass}>Full name</label>
          <input id="app-name" name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-role" className={labelClass}>Role of interest</label>
          <select id="app-role" name="role" required defaultValue="" className={inputClass}>
            <option value="" disabled>Select a role</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="app-years" className={labelClass}>Years of experience</label>
          <input id="app-years" name="years" required inputMode="numeric" placeholder="e.g. 8" className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-location" className={labelClass}>Current location</label>
          <input id="app-location" name="location" required autoComplete="address-level2" placeholder="City, State" className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-phone" className={labelClass}>Best phone number</label>
          <input id="app-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-email" className={labelClass}>Email</label>
          <input id="app-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="app-background" className={labelClass}>A few sentences about your background</label>
          <textarea id="app-background" name="background" rows={4} maxLength={4000} className={`${inputClass} h-auto resize-y py-3`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="app-resume" className={labelClass}>Résumé (PDF or Word, up to 10 MB)</label>
          <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-card/50 px-3 py-3">
            <Paperclip className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <input
              id="app-resume"
              name="resume"
              type="file"
              required
              accept=".pdf,.doc,.docx,.rtf,.txt,.pages"
              className="w-full text-sm text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
            />
          </div>
        </div>
      </div>

      {state.status === "error" && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-foreground"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      )}

      <button type="submit" disabled={pending} className="design-button mt-6 w-full justify-between disabled:opacity-60">
        {pending ? "Sending…" : "Submit application"}
        {!pending && <ArrowRight size={16} aria-hidden="true" />}
      </button>
    </form>
  )
}
