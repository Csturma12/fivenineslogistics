"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CircleAlert, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type State = "checking" | "ready" | "invalid" | "submitting" | "error"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [state, setState] = useState<State>("checking")
  const [error, setError] = useState("")

  // A valid recovery link establishes a session before landing here. No session
  // means the link was missing, expired, or already used.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setState(data.user ? "ready" : "invalid")
    })
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (state === "submitting") return

    if (password.length < 8) {
      setState("error")
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setState("error")
      setError("Passwords do not match.")
      return
    }

    setState("submitting")
    setError("")

    const supabase = createClient()
    const { error: updateErr } = await supabase.auth.updateUser({ password })

    if (updateErr) {
      setState("error")
      setError(updateErr.message || "Could not update your password. Try the link again.")
      return
    }

    router.replace("/portal/home")
    router.refresh()
  }

  if (state === "checking") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8" aria-live="polite">
        <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
      </div>
    )
  }

  if (state === "invalid") {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <CircleAlert className="size-5 shrink-0 text-[color:var(--destructive)]" aria-hidden="true" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">This reset link isn&apos;t valid</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The link may have expired or already been used. Request a new one from the sign-in page.
        </p>
        <Link
          href="/portal"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to sign in
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Choose a new password</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Enter a new password for your Five Nines portal account. You&apos;ll be signed in right after.
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">New password</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 sm:text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Confirm password</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Re-enter your password"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 sm:text-sm"
          />
        </label>

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
          {state === "submitting" ? "Updating" : "Update password"}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </form>

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-background p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Your password is encrypted by Supabase Auth and never stored in plain text.
        </p>
      </div>
    </div>
  )
}
