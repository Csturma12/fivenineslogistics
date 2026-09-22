"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleAlert,
  MailCheck,
  ShieldCheck,
} from "lucide-react"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { createClient } from "@/lib/supabase/client"

type Role = "customer" | "carrier"
type Mode = "signin" | "register"
type Status = "idle" | "submitting" | "confirm" | "recovered" | "error"

const roleCopy = {
  customer: {
    eyebrow: "Customer access",
    title: "A direct line to your freight team.",
    description:
      "Create an account to reach the team coordinating your freight. Confirm your email once, then sign in anytime with your password.",
    steps: [
      "Create an account with your work email and a password.",
      "Confirm your email to activate access.",
      "Sign in anytime — your session stays active.",
    ],
    emailPlaceholder: "ops@yourcompany.com",
    companyPlaceholder: "Your company",
  },
  carrier: {
    eyebrow: "Carrier access",
    title: "Built around trusted carrier relationships.",
    description:
      "Create your account, submit your carrier packet, and complete Highway verification. Dispatch approval opens access to lanes, bids and carrier offers.",
    steps: [
      "Create an account with your dispatch email and a password.",
      "Confirm your email to activate access.",
      "Complete setup for approval, then view loads and submit bids.",
    ],
    emailPlaceholder: "dispatch@yourauthority.com",
    companyPlaceholder: "Legal carrier name",
  },
} as const

function messageForSignIn(raw: string): string {
  if (/email not confirmed|not confirmed/i.test(raw)) {
    return "Confirm your email first — check your inbox for the link we sent when you registered."
  }
  if (/rate|too many/i.test(raw)) {
    return "Too many attempts. Wait a minute and try again."
  }
  if (/invalid login|invalid credentials|invalid/i.test(raw)) {
    return "Invalid email or password."
  }
  return "We couldn't sign you in. Try again."
}

export function PortalSignIn({ role }: { role: Role }) {
  const copy = roleCopy[role]
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  function switchMode(next: Mode) {
    setMode(next)
    setStatus("idle")
    setPassword("")
    setError("")
  }

  async function handleSignIn() {
    const supabase = createClient()
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
    if (signInErr) {
      setStatus("error")
      setError(messageForSignIn(signInErr.message))
      return
    }
    router.replace("/portal/home")
    router.refresh()
  }

  async function handleRegister() {
    const response = await fetch("/api/portal/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, role, fullName, company }),
    })
    const data = (await response.json()) as { outcome?: string; error?: string }
    if (!response.ok) {
      setStatus("error")
      setError(data.error ?? "We couldn't create your account. Try again.")
      return
    }
    setStatus("confirm")
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === "submitting") return
    setStatus("submitting")
    setError("")
    try {
      if (mode === "signin") {
        await handleSignIn()
      } else {
        await handleRegister()
      }
    } catch {
      setStatus("error")
      setError("We couldn't reach the portal. Check your connection and try again.")
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setStatus("error")
      setError("Enter your email above, then tap reset again.")
      return
    }
    setStatus("submitting")
    setError("")
    try {
      await fetch("/api/portal/recover", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setStatus("recovered")
    } catch {
      setStatus("error")
      setError("We couldn't send the reset email. Try again.")
    }
  }

  const showConfirmPanel = status === "confirm"
  const showRecoveredPanel = status === "recovered"

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
          <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-foreground/65">{copy.description}</p>

          <ol className="mt-7 flex flex-col gap-3" aria-label="Portal access process">
            {copy.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-navy-foreground/20 font-mono text-[10px] text-[color:var(--status-ok-dark)]">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-[13px] leading-relaxed text-navy-foreground/70">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/45">
          Email-verified · encrypted passwords · secure sessions
        </p>
      </div>

      <div className="bg-card p-6 sm:p-8">
        {showConfirmPanel ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <div className="flex items-center gap-2.5">
              <MailCheck className="size-5 shrink-0 text-[color:var(--status-ok)]" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Confirm your email</h2>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{email}</span>. Click it to activate your account —
              then you can sign in with your email and password anytime.
            </p>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="min-h-11 self-start font-mono text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Back to sign in
            </button>
          </div>
        ) : showRecoveredPanel ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <div className="flex items-center gap-2.5">
              <MailCheck className="size-5 shrink-0 text-[color:var(--status-ok)]" aria-hidden="true" />
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Check your email</h2>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{email}</span>, we sent a
              link to reset your password. It expires in about an hour.
            </p>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="min-h-11 self-start font-mono text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-1 rounded-lg border border-border bg-background p-1" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signin"}
                onClick={() => switchMode("signin")}
                className={`min-h-9 flex-1 rounded-md py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  mode === "signin"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                onClick={() => switchMode("register")}
                className={`min-h-9 flex-1 rounded-md py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  mode === "register"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create account
              </button>
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              {mode === "signin"
                ? role === "carrier"
                  ? "Carrier portal sign in"
                  : "Customer portal sign in"
                : role === "carrier"
                  ? "Create carrier account"
                  : "Create customer account"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {mode === "signin"
                ? "Enter your email and password to reach your portal."
                : "Set up your account. We'll email a link to confirm it before your first sign in."}
            </p>

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

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <input
                  type="password"
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === "signin" ? "Your password" : "At least 8 characters"}
                  className="min-h-11 rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 sm:text-sm"
                />
              </label>

              {mode === "register" && (
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
              )}

              {status === "error" && (
                <p role="alert" className="flex items-center gap-2 text-[13px] text-[color:var(--destructive)]">
                  <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {status === "submitting"
                  ? mode === "signin"
                    ? "Signing in"
                    : "Creating account"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>

              {mode === "signin" && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={status === "submitting"}
                  className="self-start font-mono text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                >
                  Forgot password?
                </button>
              )}
            </form>
          </>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-background p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Passwords are encrypted by Supabase Auth and never stored in plain text. Confirmation links are
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
