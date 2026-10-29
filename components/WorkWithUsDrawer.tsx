"use client"

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { CheckCircle2, FileText, Paperclip, X } from "lucide-react"
import { submitApplication, type ApplicationState } from "@/app/actions/work-with-us"
import { APPLICATION_ROLES } from "@/lib/careers"
import { CityInput } from "@/components/portal/city-field"
import { site } from "@/lib/site"

type WorkWithUsContextValue = { openApplication: () => void; closeApplication: () => void }

const WorkWithUsContext = createContext<WorkWithUsContextValue | null>(null)

export function useWorkWithUs() {
  const ctx = useContext(WorkWithUsContext)
  if (!ctx) throw new Error("useWorkWithUs must be used within a WorkWithUsProvider")
  return ctx
}

export function WorkWithUsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)
  const openApplication = useCallback(() => {
    setSession((s) => s + 1)
    setOpen(true)
  }, [])
  const closeApplication = useCallback(() => setOpen(false), [])

  return (
    <WorkWithUsContext.Provider value={{ openApplication, closeApplication }}>
      {children}
      <WorkWithUsDrawer key={session} open={open} onClose={closeApplication} />
    </WorkWithUsContext.Provider>
  )
}

const inputClass =
  "w-full rounded border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-2 text-sm text-navy-foreground placeholder:text-navy-foreground/50 outline-none transition focus:border-status-ok-dark focus:ring-1 focus:ring-status-ok-dark"
const selectClass = `${inputClass} [&>option]:bg-navy`
const labelClass = "mb-1 block text-xs font-medium text-navy-foreground/70"
const cityInputTheme = {
  input: inputClass,
  list: "border-navy-foreground/15 bg-navy",
  option: "text-sm",
  optionActive: "bg-navy-foreground/10",
  city: "text-navy-foreground",
  zip: "font-mono text-xs text-navy-foreground/60",
}

const initialState: ApplicationState = { status: "idle" }

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Section({ title, tone, children }: { title: string; tone: "ok" | "warn" | "alert"; children: ReactNode }) {
  const toneClass = {
    ok: "text-status-ok-dark bg-status-ok-dark",
    warn: "text-status-warn-dark bg-status-warn-dark",
    alert: "text-destructive bg-destructive",
  }[tone]
  const [text, dot] = toneClass.split(" ")
  return (
    <fieldset className="flex flex-col gap-4 border-t border-navy-foreground/10 pt-6 first:border-t-0 first:pt-0">
      <legend className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest ${text}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

function FileDrop({ id, name, label, hint, required }: { id: string; name: string; label: string; hint: string; required?: boolean }) {
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 py-4 transition ${
        fileName
          ? "border-status-ok-dark/50 bg-status-ok-dark/10"
          : "border-navy-foreground/20 bg-navy-foreground/5 hover:border-navy-foreground/40"
      }`}
    >
      {fileName ? (
        <FileText size={20} className="shrink-0 text-status-ok-dark" aria-hidden="true" />
      ) : (
        <Paperclip size={20} className="shrink-0 text-navy-foreground/60" aria-hidden="true" />
      )}
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-navy-foreground">{label}</span>
        <span className="truncate text-xs text-navy-foreground/60">{fileName ?? hint}</span>
      </span>
      <input
        id={id}
        name={name}
        type="file"
        required={required}
        accept=".pdf,.doc,.docx,.rtf,.txt,.pages,.odt"
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  )
}

function ReferenceRow({ n, required }: { n: number; required?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-md border border-navy-foreground/10 bg-navy-foreground/[0.03] p-3 sm:grid-cols-6">
      <Field label={`Reference ${n} name${required ? " *" : ""}`} htmlFor={`ref${n}-name`} className="sm:col-span-2">
        <input id={`ref${n}-name`} name={`ref${n}_name`} className={inputClass} autoComplete="off" />
      </Field>
      <Field label="Relationship" htmlFor={`ref${n}-rel`} className="sm:col-span-2">
        <input id={`ref${n}-rel`} name={`ref${n}_relationship`} placeholder="e.g., Former manager" className={inputClass} />
      </Field>
      <Field label="Company" htmlFor={`ref${n}-co`} className="sm:col-span-2">
        <input id={`ref${n}-co`} name={`ref${n}_company`} className={inputClass} />
      </Field>
      <Field label="Phone" htmlFor={`ref${n}-phone`} className="sm:col-span-3">
        <input id={`ref${n}-phone`} name={`ref${n}_phone`} type="tel" className={inputClass} />
      </Field>
      <Field label="Email" htmlFor={`ref${n}-email`} className="sm:col-span-3">
        <input id={`ref${n}-email`} name={`ref${n}_email`} type="email" className={inputClass} />
      </Field>
    </div>
  )
}

function WorkWithUsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (state.status !== "idle") scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [state])

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-navy/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        className={`absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-2xl border-t border-navy-foreground/10 bg-navy/60 text-navy-foreground shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-2.5" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-navy-foreground/25" />
        </div>

        <header className="border-b border-navy-foreground/10 px-6 pb-4 pt-3">
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-4">
            <div>
              <span className="rounded border border-status-ok-dark/20 bg-status-ok-dark/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-status-ok-dark">
                5N / Careers · Employment Application
              </span>
              <h2 id="apply-title" className="mt-3 text-balance text-2xl font-bold tracking-tight">
                Work with Five Nines.
              </h2>
              <p className="mt-1 text-pretty text-sm text-navy-foreground/60">
                Fill out the application below and attach your résumé and references. It goes straight to{" "}
                <span className="text-navy-foreground/85">{site.dispatchEmail}</span>.
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close application"
              className="rounded-lg p-1.5 text-navy-foreground/60 transition hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-4xl">
            {state.status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <CheckCircle2 size={40} className="text-status-ok-dark" aria-hidden="true" />
                <h3 className="text-xl font-semibold">Application received.</h3>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-navy-foreground/70">
                  Thanks for applying. Our team reviews every application and will reach out by email or phone if
                  it&apos;s a fit.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 rounded-md border border-navy-foreground/20 px-4 py-2 text-sm font-medium transition hover:bg-navy-foreground/10"
                >
                  Close
                </button>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-8">
                {state.status === "error" && (
                  <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-navy-foreground">
                    {state.message}
                  </p>
                )}

                <Section title="Contact information" tone="ok">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="First name *" htmlFor="app-first">
                      <input id="app-first" name="first_name" required autoComplete="given-name" className={inputClass} />
                    </Field>
                    <Field label="Last name *" htmlFor="app-last">
                      <input id="app-last" name="last_name" required autoComplete="family-name" className={inputClass} />
                    </Field>
                    <Field label="Email *" htmlFor="app-email">
                      <input id="app-email" name="email" type="email" required autoComplete="email" className={inputClass} />
                    </Field>
                    <Field label="Phone *" htmlFor="app-phone">
                      <input id="app-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
                    </Field>
                    <Field label="Street address" htmlFor="app-address" className="sm:col-span-2">
                      <input id="app-address" name="address" autoComplete="street-address" className={inputClass} />
                    </Field>
                    <Field label="City, State *" htmlFor="app-location">
                      <CityInput id="app-location" name="location" label="City, State" required placeholder="e.g., Houston, TX" theme={cityInputTheme} />
                    </Field>
                    <Field label="ZIP" htmlFor="app-zip">
                      <input id="app-zip" name="zip" inputMode="numeric" autoComplete="postal-code" className={inputClass} />
                    </Field>
                    <Field label="Authorized to work in the US? *" htmlFor="app-auth">
                      <select id="app-auth" name="authorized" required defaultValue="" className={selectClass}>
                        <option value="" disabled>Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </Field>
                    <Field label="LinkedIn or portfolio" htmlFor="app-linkedin">
                      <input id="app-linkedin" name="linkedin" type="url" placeholder="https://" className={inputClass} />
                    </Field>
                  </div>
                </Section>

                <Section title="Position" tone="warn">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Position applying for *" htmlFor="app-role">
                      <select id="app-role" name="role" required defaultValue="" className={selectClass}>
                        <option value="" disabled>Select a position</option>
                        {APPLICATION_ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Employment type *" htmlFor="app-type">
                      <select id="app-type" name="employment_type" required defaultValue="" className={selectClass}>
                        <option value="" disabled>Select</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract / 1099</option>
                        <option>Commission-based agent</option>
                      </select>
                    </Field>
                    <Field label="Available start date" htmlFor="app-start">
                      <input id="app-start" name="start_date" type="date" className={`${inputClass} [color-scheme:dark]`} />
                    </Field>
                    <Field label="Desired compensation" htmlFor="app-comp">
                      <input id="app-comp" name="compensation" placeholder="e.g., $65k / commission split" className={inputClass} />
                    </Field>
                    <Field label="Willing to relocate?" htmlFor="app-relocate">
                      <select id="app-relocate" name="relocate" defaultValue="" className={selectClass}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                        <option>Remote only</option>
                      </select>
                    </Field>
                  </div>
                </Section>

                <Section title="Experience & qualifications" tone="warn">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Years of experience *" htmlFor="app-years">
                      <select id="app-years" name="years" required defaultValue="" className={selectClass}>
                        <option value="" disabled>Select</option>
                        <option>Less than 1</option>
                        <option>1–3</option>
                        <option>3–5</option>
                        <option>5–10</option>
                        <option>10+</option>
                      </select>
                    </Field>
                    <Field label="CDL" htmlFor="app-cdl">
                      <select id="app-cdl" name="cdl" defaultValue="" className={selectClass}>
                        <option value="">Not applicable</option>
                        <option>Class A</option>
                        <option>Class B</option>
                        <option>Non-CDL</option>
                      </select>
                    </Field>
                    <Field label="MC / DOT # (owner-operators)" htmlFor="app-mc">
                      <input id="app-mc" name="mc_dot" className={inputClass} />
                    </Field>
                    <Field label="Most recent employer" htmlFor="app-employer">
                      <input id="app-employer" name="employer" className={inputClass} />
                    </Field>
                    <Field label="Job title" htmlFor="app-title">
                      <input id="app-title" name="job_title" className={inputClass} />
                    </Field>
                    <Field label="Dates employed" htmlFor="app-dates">
                      <input id="app-dates" name="employment_dates" placeholder="e.g., 2021 – present" className={inputClass} />
                    </Field>
                    <Field label="Reason for leaving" htmlFor="app-leaving" className="sm:col-span-2">
                      <input id="app-leaving" name="leaving_reason" className={inputClass} />
                    </Field>
                    <Field label="Highest education" htmlFor="app-edu">
                      <select id="app-edu" name="education" defaultValue="" className={selectClass}>
                        <option value="">Select</option>
                        <option>High school / GED</option>
                        <option>Some college</option>
                        <option>Associate degree</option>
                        <option>Bachelor&apos;s degree</option>
                        <option>Master&apos;s degree or higher</option>
                      </select>
                    </Field>
                    <Field label="Systems & skills" htmlFor="app-skills" className="sm:col-span-3">
                      <input
                        id="app-skills"
                        name="skills"
                        placeholder="e.g., McLeod, DAT, Truckstop, QuickBooks, Highway, heavy haul permitting"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </Section>

                <Section title="References" tone="ok">
                  <p className="-mt-1 text-xs text-navy-foreground/60">
                    List at least one professional reference, or attach a references document below.
                  </p>
                  <ReferenceRow n={1} required />
                  <ReferenceRow n={2} />
                  <ReferenceRow n={3} />
                </Section>

                <Section title="Attachments & additional info" tone="alert">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FileDrop id="app-resume" name="resume" label="Résumé *" hint="PDF, Word, RTF or text · up to 10 MB" required />
                    <FileDrop id="app-refs" name="references_file" label="References document" hint="Optional · PDF, Word, RTF or text" />
                  </div>
                  <Field label="Cover letter or a few sentences about your background" htmlFor="app-cover">
                    <textarea id="app-cover" name="cover_letter" rows={4} maxLength={4000} className={`${inputClass} resize-y leading-relaxed`} />
                  </Field>
                  <Field label="How did you hear about us?" htmlFor="app-source">
                    <input id="app-source" name="source" placeholder="e.g., LinkedIn, referral, Indeed" className={inputClass} />
                  </Field>
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-navy-foreground/75">
                    <input
                      type="checkbox"
                      name="certify"
                      required
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-status-ok-dark)]"
                    />
                    I certify the information in this application is true and complete to the best of my knowledge. *
                  </label>
                </Section>

                <div className="flex flex-col-reverse items-stretch gap-3 border-t border-navy-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-xs text-navy-foreground/50">Agent of Primary Freight LLC · {site.mc}</span>
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-status-ok-dark px-5 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90 disabled:opacity-60"
                  >
                    {pending ? "Sending application…" : "Submit application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
