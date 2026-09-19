import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendPortalEmail, verifyEmailHtml } from "@/lib/portal-mail"

type Role = "customer" | "carrier"

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function clean(v: unknown): string | null {
  if (typeof v !== "string") return null
  const t = v.trim().slice(0, 120)
  return t.length ? t : null
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body.password === "string" ? body.password : ""
  const requestedRole = body.role
  const fullName = clean(body.fullName)
  const company = clean(body.company)

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }
  if (requestedRole !== "customer" && requestedRole !== "carrier") {
    return NextResponse.json({ error: "Choose a valid portal." }, { status: 400 })
  }

  const role: Role = requestedRole
  const supabase = createAdminClient()

  // generateLink(type:signup) creates the (unconfirmed) user AND returns a
  // confirmation token we email ourselves via Resend — the built-in Supabase
  // mailer only reaches org addresses and is heavily rate-limited.
  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName },
      redirectTo: `${req.nextUrl.origin}/auth/confirm`,
    },
  })

  if (linkErr) {
    if (/registered|already|exists/i.test(linkErr.message)) {
      return NextResponse.json(
        { error: "An account with this email already exists. Sign in or reset your password." },
        { status: 409 },
      )
    }
    if (/password/i.test(linkErr.message)) {
      return NextResponse.json({ error: linkErr.message }, { status: 400 })
    }
    console.error("[v0] register generateLink error:", linkErr.message)
    return NextResponse.json({ error: "Could not create your account. Try again." }, { status: 500 })
  }

  const userId = linkData.user?.id
  const hashedToken = linkData.properties?.hashed_token
  if (!userId || !hashedToken) {
    return NextResponse.json({ error: "Could not create your account. Try again." }, { status: 500 })
  }

  // Role/company are trust-neutral here (they only pick the portal view), but
  // still belong in protected app_metadata, never user-editable user_metadata.
  const { error: metaErr } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role, company: company ?? (role === "carrier" ? "Your authority" : "Your account") },
  })
  if (metaErr) {
    console.error("[v0] register metadata error:", metaErr.message)
    return NextResponse.json({ error: "Could not finish setting up your account. Try again." }, { status: 500 })
  }

  const confirmUrl = `${req.nextUrl.origin}/auth/confirm?token_hash=${hashedToken}&type=signup&next=${encodeURIComponent(
    "/portal/home",
  )}`

  const { error: mailErr } = await sendPortalEmail({
    to: [email],
    subject: "Confirm your Five Nines portal account",
    html: verifyEmailHtml(confirmUrl),
    idempotencyKey: `portal-verify/${userId}/${Math.floor(Date.now() / 60000)}`,
  })

  if (mailErr) {
    console.error("[v0] register mail error:", mailErr.message)
    return NextResponse.json(
      { error: "Account created, but we could not send the confirmation email. Try again shortly." },
      { status: 500 },
    )
  }

  return NextResponse.json({ outcome: "confirm" })
}
