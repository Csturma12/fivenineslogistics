import { createSign, randomUUID } from "node:crypto"

// The only place this app sends email. Mail goes out through the Gmail API as a
// licensed Google Workspace user (MAIL_IMPERSONATE) via a service account with
// domain-wide delegation, using dispatch@ as a verified "Send mail as" address.

export const MAIL_FROM = process.env.MAIL_FROM || "dispatch@fivenineslogistics.com"

const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
// Media upload endpoint accepts raw RFC 2822 messages up to 35 MB (RFP attachments).
const SEND_URL = "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media"

export type MailAttachment = { filename: string; content: Buffer; contentType?: string }

export type MailMessage = {
  to: string[]
  cc?: string[]
  replyTo?: string
  subject: string
  html: string
  text?: string
  fromName?: string
  attachments?: MailAttachment[]
}

type ServiceAccount = { client_email: string; private_key: string }

// Accepts the key file as raw JSON or base64. Also repairs a paste that lost its
// leading `{"` (pasting the file on mobile drops it), e.g. `type": "service_account", ...}`.
function normalizeKeyJson(raw: string): string {
  const value = raw.trim()
  if (value.startsWith("{")) return value
  if (/^"?type"\s*:/.test(value)) return `{"${value.replace(/^"/, "")}`
  return Buffer.from(value, "base64").toString("utf8")
}

function config() {
  const raw = process.env.GOOGLE_SA_JSON
  const impersonate = process.env.MAIL_IMPERSONATE
  const missing = [!raw && "GOOGLE_SA_JSON", !impersonate && "MAIL_IMPERSONATE"].filter(Boolean)
  if (missing.length) throw new Error(`Email is not configured: missing ${missing.join(", ")}.`)

  const account = JSON.parse(normalizeKeyJson(raw!)) as ServiceAccount
  if (!account.client_email || !account.private_key) {
    throw new Error("GOOGLE_SA_JSON is not a valid service account key (client_email/private_key missing).")
  }
  return { account, impersonate: impersonate! }
}

export function isMailConfigured() {
  return Boolean(process.env.GOOGLE_SA_JSON && process.env.MAIL_IMPERSONATE)
}

const b64url = (input: Buffer | string) => Buffer.from(input).toString("base64url")

let cachedToken: { value: string; expiresAt: number } | null = null

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const { account, impersonate } = config()
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = b64url(
    JSON.stringify({ iss: account.client_email, sub: impersonate, scope: GMAIL_SEND_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )
  const signature = createSign("RSA-SHA256").update(`${header}.${claims}`).sign(account.private_key)
  const assertion = `${header}.${claims}.${b64url(signature)}`

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  })
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string; error?: string }
  if (!res.ok || !body.access_token) {
    throw new Error(`Google token exchange failed (${res.status}): ${body.error_description || body.error || "unknown error"}`)
  }
  cachedToken = { value: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 }
  return cachedToken.value
}

const encodeHeader = (value: string) => (/^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${Buffer.from(value).toString("base64")}?=`)
const wrap76 = (b64: string) => b64.replace(/.{1,76}/g, "$&\r\n")
const stripHtml = (html: string) =>
  html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>|<\/(p|div|tr|h\d)>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\n\s*\n\s*/g, "\n\n").trim()

function buildMime(msg: MailMessage): string {
  const alt = `alt_${randomUUID()}`
  const headers = [
    `From: ${encodeHeader(msg.fromName || "Five Nines Dispatch")} <${MAIL_FROM}>`,
    `To: ${msg.to.join(", ")}`,
    msg.cc?.length ? `Cc: ${msg.cc.join(", ")}` : "",
    `Reply-To: ${msg.replyTo || MAIL_FROM}`,
    `Subject: ${encodeHeader(msg.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
  ].filter(Boolean)

  const alternative = [
    `--${alt}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrap76(Buffer.from(msg.text || stripHtml(msg.html)).toString("base64")),
    `--${alt}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrap76(Buffer.from(msg.html).toString("base64")),
    `--${alt}--`,
  ].join("\r\n")

  if (!msg.attachments?.length) {
    return [...headers, `Content-Type: multipart/alternative; boundary="${alt}"`, "", alternative].join("\r\n")
  }

  const mixed = `mix_${randomUUID()}`
  const parts = msg.attachments.map((file) => {
    const name = encodeHeader(file.filename.replace(/["\r\n]/g, ""))
    return [
      `--${mixed}`,
      `Content-Type: ${file.contentType || "application/octet-stream"}; name="${name}"`,
      `Content-Disposition: attachment; filename="${name}"`,
      "Content-Transfer-Encoding: base64",
      "",
      wrap76(file.content.toString("base64")),
    ].join("\r\n")
  })
  return [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    "",
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    "",
    alternative,
    ...parts,
    `--${mixed}--`,
  ].join("\r\n")
}

// Sends one message and returns the Gmail message id. Throws on any failure;
// retries once on 429/5xx.
export async function sendMail(msg: MailMessage): Promise<string> {
  const mime = buildMime(msg)
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(SEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "message/rfc822" },
      body: mime,
    })
    if (res.ok) return ((await res.json()) as { id: string }).id

    const retryable = res.status === 429 || res.status >= 500
    const detail = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    const error = new Error(`Gmail send failed (${res.status}): ${detail?.error?.message || res.statusText}`)
    if (!retryable || attempt >= 1) {
      console.error(`[mailer] ${error.message} — to ${msg.to.join(", ")}, subject "${msg.subject}"`)
      throw error
    }
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
}
