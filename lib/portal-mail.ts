import { Resend } from "resend"


// Preferred branded sender. Requires fivenineslogistics.com to be verified in Resend.
const PREFERRED_FROM = `Five Nines Portal <portal@${process.env.RESEND_EMAIL_DOMAIN}>`
// Always-verified Resend sandbox sender. Delivers only to the Resend account owner,
// but keeps the flow working until the branded domain is verified.
const SANDBOX_FROM = "Five Nines Portal <onboarding@resend.dev>"

type SendArgs = {
  to: string[]
  subject: string
  html: string
  replyTo?: string
  idempotencyKey: string
}

// Send from the branded domain; if Resend rejects it as unverified, transparently
// retry from the sandbox sender so a failed/pending domain never breaks the flow.
export async function sendPortalEmail({ to, subject, html, replyTo, idempotencyKey }: SendArgs) {
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

export function verifyEmailHtml(url: string): string {
  return shell(`
    <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#16233a;">Confirm your account.</p>
    <p style="margin:0 0 20px;">Welcome to the Five Nines portal. Confirm your email to activate your account — after this you'll sign in anytime with your email and password. This link expires in about an hour.</p>
    <a href="${url}" style="display:inline-block;background:#16233a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;">Confirm my account</a>
    <p style="margin:20px 0 0;color:#8a94a3;font-size:12px;">If you didn't create this account, you can ignore this email.</p>
  `)
}

export function resetEmailHtml(url: string): string {
  return shell(`
    <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#16233a;">Reset your password.</p>
    <p style="margin:0 0 20px;">We received a request to reset the password on your Five Nines portal account. Click below to choose a new one. This link expires in about an hour.</p>
    <a href="${url}" style="display:inline-block;background:#16233a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;">Choose a new password</a>
    <p style="margin:20px 0 0;color:#8a94a3;font-size:12px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
  `)
}
