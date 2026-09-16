"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock,
  ShieldCheck,
} from "lucide-react"
import { FiveNinesMark } from "@/components/five-nines-mark"

type Role = "customer" | "carrier"
type SubmitState = "idle" | "submitting" | "pending" | "error"

const roleCopy = {
  customer: {
    eyebrow: "Customer access",
    title: "A direct line to your freight team.",
    description:
      "Approved customers receive secure, password-free access and a direct path to the team coordinating their freight.",
    steps: [
      "Enter your work email and company details.",
      "We verify your relationship with Five Nines.",
      "Approved users receive a secure sign-in link by email.",
    ],
    emailPlaceholder: "ops@yourcompany.com",
    companyPlaceholder: "Your company",
  },
  carrier: {
    eyebrow: "Carrier access",
    title: "Built around trusted carrier relationships.",
    description:
      "Approved carriers receive secure, password-free access and a direct connection to carrier relations and dispatch.",
    steps: [
      "Enter your dispatch email and authority details.",
      "We verify your carrier relationship and setup.",
      "Approved users receive a secure sign-in link by email.",
    ],
    emailPlaceholder: "dispatch@yourauthority.com",
    companyPlaceholder: "Legal carrier name",
  },
} as const

export function PortalSignIn({ role }: { role: Role }) {
  const copy = roleCopy[role]
  const [email, setEmail] = useState("chriss@primarycompanies.com")
  const [fullName, setFullName] = useState("Chris Sturma")
  const [company, setCompany] = useState("")
  const [state, setState] = useState<SubmitState>("idle")
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (state === "submitting") return

    setState("submitting")
    setError("")

    try {
      const response = await fetch("/api/portal/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, role, fullName, company }),
      })
      const data = (await response.json()) as { outcome?: string; error?: string }

      if (!response.ok) {
        setState("error")
        setError(data.error ?? "We could not process your request. Please try again.")
        return
      }

      setState("pending")
    } catch {
      setState("error")
      setError("We could not reach the portal. Check your connection and try again.")
    }
  }

  function resetForm() {
    setState("idle")
    setEmail("")
    setError("")
  }

  return (
    <div className="grid overflow-hidden rounded-xl border border-border lg:grid-cols-2">
      <div className="flex flex-col justify-between gap-10 bg-navy p-6 text-navy-foreground sm:p-8">
        <div className="flex items-center gap-2.5">
          <FiveNinesMark className="h-7 w-7 shrink-0 text-navy-foreground" />
          <span className="text-sm font-semibold tracking-tight">FIVE NINES</span>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--status-ok-dark)]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 max-w-md text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-foreground/65">
            {copy.description}
          </p>

          <ol className="mt-7 flex flex-col gap-3" aria-label="Portal access process">
            {copy.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-navy-foreground/20 font-mono text-[10px] text-[color:var(--status-ok-dark)]">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-[13px] leading-relaxed text-navy-foreground/70">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/45">
          Manually approved · password-free · secure email access
        </p>
      </div>

      <div className="bg-card p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {role === "carrier" ? "Carrier portal access" : "Customer portal access"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Enter your details below. If you are already approved, we will email your sign-in link.
          New requests are reviewed by our team first.
        </p>

        {state === "pending" ? (
          <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-background p-5" aria-live="polite">
            <div className="flex items-center gap-2.5">
              <Clock className="size-5 shrink-0 text-[color:var(--status-warn)]" aria-hidden="true" />
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Request received
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              We received the access request for{" "}
              <span className="font-medium text-foreground">{email}</span>. If the address is already
              approved, a one-time sign-in link will arrive shortly. Otherwise, our team will verify
              the relationship and follow up by email.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-11 self-start font-mono text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Work email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className="min-h-11 rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 sm:text-sm"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Name <span className="text-muted-foreground/50">· optional</span>
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Full name"
                  className="min-h-11 rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 sm:text-sm"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Company <span className="text-muted-foreground/50">· optional</span>
                </span>
                <input
                  type="text"
                  autoComplete="organization"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder={copy.companyPlaceholder}
                  className="min-h-11 rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 sm:text-sm"
                />
              </label>
            </div>

            {state === "error" && (
              <p role="alert" className="flex items-center gap-2 text-[13px] text-[color:var(--destructive)]">
                <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {state === "submitting" ? "Submitting" : "Continue securely"}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>

            <p className="text-[13px] leading-relaxed text-muted-foreground">
              We use these details only to verify portal access. Submitting this form does not create
              an account or password.
            </p>
          </form>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-background p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Access is limited to verified Five Nines customers and carriers. Sign-in links are
            single-use and expire automatically.
          </p>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Not yet working with Five Nines?
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href="/request-capacity"
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Building2 className="size-4" aria-hidden="true" />
              Request capacity
            </Link>
            <Link
              href="/carriers"
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Haul for us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
