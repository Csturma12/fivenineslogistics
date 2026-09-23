import { Resend } from "resend"


// Branded sender. Used whenever RESEND_EMAIL_DOMAIN is configured.
const EMAIL_DOMAIN = process.env.RESEND_EMAIL_DOMAIN
const PREFERRED_FROM = EMAIL_DOMAIN ? `Five Nines Portal <portal@${EMAIL_DOMAIN}>` : null
// Resend sandbox sender. IMPORTANT: it only delivers to the Resend account owner's
// own address — every other recipient is silently dropped. Use only when no branded
// domain is configured (e.g. local dev).
const SANDBOX_FROM = "Five Nines Portal <onboarding@resend.dev>"

type SendArgs = {
  to: string[]
  subject: string
  html: string
  replyTo?: string
  idempotencyKey: string
}

// When a branded domain is configured we send ONLY from it. We deliberately do not
// fall back to the sandbox sender on error: that sender reaches only the Resend
// account owner, so a silent fallback blackholes mail to real carriers/customers
// (exactly the failure mode that hid a broken carrier-setup email). Instead we log
// the failure loudly and return the error to the caller.
export async function sendPortalEmail({ to, subject, html, replyTo, idempotencyKey }: SendArgs) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const base = { to, subject, html, ...(replyTo ? { replyTo } : {}) }

  if (PREFERRED_FROM) {
    const res = await resend.emails.send({ from: PREFERRED_FROM, ...base }, { idempotencyKey })
    if (res.error) {
      console.error(
        `[v0] portal email FAILED from ${PREFERRED_FROM} to ${to.join(", ")}: ${res.error.message}. ` +
          `Not falling back to the sandbox sender (it only reaches the Resend account owner). ` +
          `Verify that ${EMAIL_DOMAIN} is still verified in Resend.`,
      )
    }
    return res
  }

  // No branded domain configured — local/dev only. This reaches only the Resend
  // account owner, so it must never be relied on in production.
  console.warn(
    "[v0] RESEND_EMAIL_DOMAIN is not set; sending from the Resend sandbox sender, " +
      "which only delivers to the Resend account owner.",
  )
  return resend.emails.send({ from: SANDBOX_FROM, ...base }, { idempotencyKey: `${idempotencyKey}/sbx` })
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
