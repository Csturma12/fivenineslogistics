import { sendMail } from "@/lib/mailer"

type SendArgs = {
  to: string[]
  subject: string
  html: string
  replyTo?: string
  // Kept for call-site compatibility; Gmail has no idempotency keys, and the
  // portal outbox already guards against duplicate notifications.
  idempotencyKey?: string
}

// Returns { data, error } so callers can report failures without throwing.
export async function sendPortalEmail({ to, subject, html, replyTo }: SendArgs) {
  try {
    const id = await sendMail({ to, subject, html, replyTo, fromName: "Five Nines Portal" })
    return { data: { id }, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[portal-mail] email to ${to.join(", ")} FAILED: ${message}`)
    return { data: null, error: { message } }
  }
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
