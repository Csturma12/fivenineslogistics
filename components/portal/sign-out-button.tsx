"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function signOut() {
    setBusy(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace("/portal")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
    >
      <LogOut className="size-3.5" aria-hidden="true" />
      {busy ? "Signing out" : "Sign out"}
    </button>
  )
}
