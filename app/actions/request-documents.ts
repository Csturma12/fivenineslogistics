"use server"

import { sendMail } from "@/lib/mailer"
import { site } from "@/lib/site"

export type DocumentRequestState = {
  status: "idle" | "success" | "error"
  ticket?: string
  message?: string
}

const LEAD_INBOX = process.env.LEAD_INBOX_EMAIL || "sturma@blbxcritical.com"

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function submitDocumentRequest(
  _prev: DocumentRequestState,
  formData: FormData,
): Promise<DocumentRequestState> {
  const field = (key: string) => (formData.get(key) as string | null)?.trim() ?? ""
  const audience = field("audience") === "carrier" ? "carrier" : "shipper"
  const name = field("name")
  const company = field("company")
  const email = field("email")
  const phone = field("phone")
  const mcNumber = field("mc_number")
  const notes = field("notes")
  const documents = formData.getAll("documents").map(String)

  const missing = Object.entries({ name, company, email }).filter(([, v]) => !v).map(([k]) => k)
  if (missing.length) {
    return { status: "error", message: `Missing required field(s): ${missing.join(", ")}.` }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid work email address." }
  }
  if (!documents.length) {
    return { status: "error", message: "Select at least one document." }
  }

  const ticket = `DOC-${Math.floor(1000 + Math.random() * 9000)}`
  const rows: Array<[string, string]> = [
    ["Ticket", ticket],
    ["Requested by", audience === "carrier" ? "Carrier (onboarding)" : "Shipper / 3PL partner (compliance packet)"],
    ["Contact", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone || "—"],
    ["MC / DOT", mcNumber || "—"],
    ["Documents", documents.join("\n")],
    ["Notes", notes || "—"],
  ]

  const html = `
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;max-width:640px">
      <h2 style="margin:0 0 4px">Document request · ${escapeHtml(ticket)}</h2>
      <p style="color:#64748b;margin:0 0 20px">Submitted from ${site.domain}/request-documents</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                <td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>
                <td style="padding:6px 0;color:#0f172a;font-weight:600;white-space:pre-wrap">${escapeHtml(v)}</td>
              </tr>`,
          )
          .join("")}
      </table>
    </div>`

  try {
    await sendMail({
      fromName: "Five Nines Compliance",
      to: [LEAD_INBOX],
      replyTo: email,
      subject: `Document request ${ticket} · ${company} · ${audience}`,
      html,
    })
  } catch (error) {
    console.error("[request-documents] send failed:", error instanceof Error ? error.message : error, { ticket })
    return {
      status: "error",
      message: `Something went wrong sending your request. Email ${site.dispatchEmail} or call ${site.phone} and we'll send the packet manually.`,
    }
  }

  return { status: "success", ticket }
}
