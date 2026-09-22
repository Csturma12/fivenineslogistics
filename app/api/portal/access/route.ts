import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createAdminClient } from "@/lib/supabase/admin"


// Preferred branded sender. Requires fivenineslogistics.com to be verified in Resend.
const PREFERRED_FROM = `Five Nines Portal <portal@${process.env.RESEND_EMAIL_DOMAIN}>`
// Always-verified Resend sandbox sender. Delivers only to the Resend account owner,
// but keeps the flow working until the branded domain is verified.
const SANDBOX_FROM = "Five Nines Portal <onboarding@resend.dev>"
const ADMIN_TO = process.env.PORTAL_ADMIN_EMAIL || "sturma@blbxcritical.com"

type Role = "customer" | "carrier"

type SendArgs = {
  to: string[]
  subject: string
  html: string
  replyTo?: string
  idempotencyKey: string
}

// Send from the branded domain; if Resend rejects it as unverified, transparently
// retry from the sandbox sender so a failed/pending domain never breaks the flow.
async function sendPortalEmail({ to, subject, html, replyTo, idempotencyKey }: SendArgs) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const base = { to, subject, html, ...(replyTo ? { replyTo } : {}) }

  const first = await resend.emails.send({ from: PREFERRED_FROM, ...base }, { idempotencyKey })
  if (!first.error) return first

  if (/not verified|domain/i.test(first.error.message)) {
    console.log("[v0] branded domain unverified, retrying from sandbox sender")
    return resend.emails.send({ from: SANDBOX_FROM, ...base }, { idempotencyKey: `${idempotencyKey}/sbx` })
  }

  return first
}

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
  const requestedRole = body.role
  const fullName = clean(body.fullName)
  const company = clean(body.company)

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 })
  }

  if (requestedRole !== "customer" && requestedRole !== "carrier") {
    return NextResponse.json({ error: "Choose a valid portal." }, { status: 400 })
  }

  const role: Role = requestedRole

  const supabase = createAdminClient()

  const { data: existing, error: selErr } = await supabase
    .from("portal_access_requests")
    .select("id,status,role,company")
    .eq("email", email)
    .maybeSingle()

  if (selErr) {
    console.error("[v0] portal select error:", selErr.message)
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 })
  }

  // Already approved by an admin -> issue a password-free sign-in link now.
  if (existing?.status === "authorized") {
    const approvedRole: Role = existing.role === "carrier" ? "carrier" : "customer"
    const approvedCompany = clean(existing.company) ?? (approvedRole === "carrier" ? "Your authority" : "Your account")
    const authorization = { role: approvedRole, company: approvedCompany }

    // Authorization belongs in protected app_metadata, never user-editable user_metadata.
    const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      app_metadata: authorization,
    })

    let authUserId = createdUser.user?.id
    if (createErr && /already|registered|exists/i.test(createErr.message)) {
      const { data: usersPage, error: usersErr } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      })
      if (usersErr) {
        console.error("[v0] listUsers error:", usersErr.message)
      }
      authUserId = usersPage?.users.find((user) => user.email?.toLowerCase() === email)?.id
    } else if (createErr) {
      console.error("[v0] createUser error:", createErr.message)
    }

    if (!authUserId) {
      return NextResponse.json({ error: "Could not prepare portal access. Try again." }, { status: 500 })
    }

    const { error: metadataErr } = await supabase.auth.admin.updateUserById(authUserId, {
      app_metadata: authorization,
    })
    if (metadataErr) {
      console.error("[v0] updateUser metadata error:", metadataErr.message)
      return NextResponse.json({ error: "Could not prepare portal access. Try again." }, { status: 500 })
    }

    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${req.nextUrl.origin}/auth/confirm` },
    })

    const hashedToken = linkData?.properties?.hashed_token
    if (linkErr || !hashedToken) {
      console.error("[v0] generateLink error:", linkErr?.message)
      return NextResponse.json({ error: "Could not create a sign-in link. Try again." }, { status: 500 })
    }

    // Point the recipient at our OWN confirm route (SSR token_hash flow),
    // not Supabase's implicit-hash redirect.
    const confirmUrl = `${req.nextUrl.origin}/auth/confirm?token_hash=${hashedToken}&type=magiclink&next=${encodeURIComponent(
      "/portal/home",
    )}`

    const { error: mailErr } = await sendPortalEmail({
      to: [email],
      subject: "Your Five Nines portal sign-in link",
      html: signInEmailHtml(confirmUrl),
      idempotencyKey: `portal-signin/${existing.id}/${Math.floor(Date.now() / 60000)}`,
    })

    if (mailErr) {
      console.error("[v0] signin mail error:", mailErr.message)
      return NextResponse.json({ error: "Could not send your link. Try again." }, { status: 500 })
    }

    return NextResponse.json({ outcome: "received" })
  }

  // New or still-pending -> record the request and notify an admin to approve it.
  let requestId = existing?.id as string | undefined

  if (existing) {
    await supabase
      .from("portal_access_requests")
      .update({ role, full_name: fullName, company })
      .eq("id", existing.id)
  } else {
    const { data: inserted, error: insErr } = await supabase
      .from("portal_access_requests")
      .insert({ email, role, full_name: fullName, company, status: "pending" })
      .select("id")
      .single()
    if (insErr) {
      console.error("[v0] portal insert error:", insErr.message)
      return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 })
    }
    requestId = inserted.id
  }

  const { error: adminMailErr } = await sendPortalEmail({
    to: [ADMIN_TO],
    replyTo: email,
    subject: `Portal access request — ${email} (${role})`,
    html: adminEmailHtml({ email, role, fullName, company, requestId }),
    idempotencyKey: `portal-request/${requestId}`,
  })

  if (adminMailErr) {
    // The request is saved regardless; the user still sees "pending".
    console.error("[v0] admin mail error:", adminMailErr.message)
  }

  return NextResponse.json({ outcome: "received" })
}

function shell(inner: string): string {
  return `<div style="margin:0;padding:24px;background:#0b0f14;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e9ee;">
      <div style="background:#16233a;padding:20px 24px;color:#ffffff;font-weight:600;letter-spacing:.02em;font-size:15px;">
        FIVE NINES <span style="color:#38bdf8;">·</span> LOGISTICS
      </div>
      <div style="padding:24px;color:#1b2430;font-size:14px;line-height:1.6;">${inner}</div>
      <div style="padding:16px 24px;border-top:1px solid #eef1f5;color:#8a94a3;font-size:11px;line-height:1.5;">
        Five Nines Logistics · Agent of Primary Freight LLC · MC# 841023 · Houston, TX
      </div>
    </div>
  </div>`
}

function signInEmailHtml(url: string): string {
  return shell(`
    <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#16233a;">Your control tower is ready.</p>
    <p style="margin:0 0 20px;">Click below to sign in to the Five Nines portal. No password needed — this secure link expires in about an hour.</p>
    <a href="${url}" style="display:inline-block;background:#16233a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;">Sign in to the portal</a>
    <p style="margin:20px 0 0;color:#8a94a3;font-size:12px;">If you didn't request this, you can ignore this email.</p>
  `)
}

function adminEmailHtml(r: {
  email: string
  role: Role
  fullName: string | null
  company: string | null
  requestId?: string
}): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#8a94a3;font-size:12px;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;">${label}</td><td style="padding:6px 0;color:#1b2430;font-size:14px;font-weight:500;">${value}</td></tr>`
  return shell(`
    <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#16233a;">New portal access request</p>
    <p style="margin:0 0 18px;">Someone asked for portal access. Approve them by setting <b>status = 'authorized'</b> on their row in <code style="background:#f1f4f8;padding:1px 5px;border-radius:4px;">portal_access_requests</code> — they'll then get a password-free sign-in link automatically the next time they enter their email.</p>
    <table style="border-collapse:collapse;margin:0 0 8px;">
      ${row("Email", r.email)}
      ${row("Role", r.role)}
      ${row("Name", r.fullName ?? "—")}
      ${row("Company", r.company ?? "—")}
      ${r.requestId ? row("Request ID", r.requestId) : ""}
    </table>
    <p style="margin:16px 0 0;color:#8a94a3;font-size:12px;">Reply to this email to reach the requester directly.</p>
  `)
}
