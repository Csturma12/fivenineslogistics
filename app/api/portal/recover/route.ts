import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendPortalEmail, resetEmailHtml } from "@/lib/portal-mail"

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${req.nextUrl.origin}/auth/confirm` },
  })

  // Never leak whether an account exists — always report the same outcome.
  const hashedToken = linkData?.properties?.hashed_token
  if (linkErr || !hashedToken) {
    if (linkErr && !/not found|no user|registered/i.test(linkErr.message)) {
      console.error("[v0] recover generateLink error:", linkErr.message)
    }
    return NextResponse.json({ outcome: "sent" })
  }

  const confirmUrl = `${req.nextUrl.origin}/auth/confirm?token_hash=${hashedToken}&type=recovery&next=${encodeURIComponent(
    "/portal/reset-password",
  )}`

  const { error: mailErr } = await sendPortalEmail({
    to: [email],
    subject: "Reset your Five Nines portal password",
    html: resetEmailHtml(confirmUrl),
    idempotencyKey: `portal-reset/${email}/${Math.floor(Date.now() / 60000)}`,
  })

  if (mailErr) {
    console.error("[v0] recover mail error:", mailErr.message)
  }

  return NextResponse.json({ outcome: "sent" })
}
