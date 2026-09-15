"use server"

import { Resend } from "resend"

// Where production leads land now that the domain is verified.
const LEAD_INBOX = "sturma@blbxcritical.com"

export type RequestState = {
  status: "idle" | "success" | "error"
  ticket?: string
  message?: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

function ticketId() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `RC-${n}`
}

export async function submitRequestCapacity(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const field = (key: string) => (formData.get(key) as string | null)?.trim() ?? ""

  const requestType = field("requestType") || "capacity"
  const name = field("name")
  const company = field("company")
  const email = field("email")
  const phone = field("phone")
  const origin = field("origin")
  const destination = field("destination")
  const mode = field("mode")
  const cadence = field("cadence")
  const details = field("details")

  const required = { name, company, email, origin, destination }
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length > 0) {
    return { status: "error", message: `Missing required field(s): ${missing.join(", ")}.` }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { status: "error", message: "Please enter a valid work email address." }
  }

  const ticket = requestType === "consulting" ? ticketId().replace("RC-", "SC-") : ticketId()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = `Five Nines Dispatch <dispatch@${process.env.RESEND_EMAIL_DOMAIN}>`

  const rows: Array<[string, string]> = [
    ["Request type", requestType === "consulting" ? "Supply chain consultation" : "Capacity"],
    ["Ticket", ticket],
    ["Contact", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Origin", origin],
    ["Destination", destination],
    ["Mode", mode || "—"],
    ["Cadence", cadence || "—"],
  ]

  const html = `
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;max-width:640px">
      <h2 style="margin:0 0 4px">New capacity request · ${escapeHtml(ticket)}</h2>
      <p style="color:#64748b;margin:0 0 20px">Submitted from fivenineslogistics.com</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                <td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>
                <td style="padding:6px 0;color:#0f172a;font-weight:600">${escapeHtml(v)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:20px">
        <div style="color:#64748b;margin-bottom:6px">Lane details</div>
        <div style="color:#0f172a;white-space:pre-wrap;line-height:1.5">${escapeHtml(details) || "—"}</div>
      </div>
    </div>`

  const { error } = await resend.emails.send(
    {
      from,
      to: [LEAD_INBOX],
      replyTo: email,
      subject: `${requestType === "consulting" ? "Consultation" : "Capacity"} request ${ticket} · ${company}`,
      html,
    },
    { idempotencyKey: `${requestType}-request/${email}/${origin}-${destination}` },
  )

  if (error) {
    console.log("[v0] Resend send failed:", error.message)
    return {
      status: "error",
      message: "Something went wrong sending your request. Call 24/7 dispatch and we'll log it manually.",
    }
  }

  return { status: "success", ticket }
}
