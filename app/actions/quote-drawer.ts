"use server"

import { sendMail } from "@/lib/mailer"
import { site } from "@/lib/site"

export type QuoteMode = "STANDARD-SPOT" | "PROJECT-RFP" | "EMERGENCY-HOTSHOT"

export type QuoteDrawerResult = {
  ok: boolean
  reference: string
  message?: string
}

// Inbox that reads production leads; override per environment without a code change.
const LEAD_INBOX = process.env.LEAD_INBOX_EMAIL || "sturma@blbxcritical.com"
// Optional email-to-SMS gateway (e.g. 2055550100@vtext.com) that pages the on-call coordinator.
const DISPATCH_PAGER = process.env.DISPATCH_PAGER_EMAIL

const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const modeLabel: Record<QuoteMode, string> = {
  "STANDARD-SPOT": "Spot / critical single move",
  "PROJECT-RFP": "Multi-lane project / BOM / RFP",
  "EMERGENCY-HOTSHOT": "LINE-DOWN EMERGENCY HOTSHOT",
}

function rowsHtml(rows: Array<[string, string]>) {
  return rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;white-space:pre-wrap">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("")
}

/**
 * Sends the dispatch notification for a Request Capacity drawer submission.
 * The Supabase `loads` insert happens client-side (RLS: anon insert, status = 'quoted');
 * this action is the human-alert path and runs even when Supabase is not configured.
 */
export async function notifyQuoteDrawer(mode: QuoteMode, formData: FormData): Promise<QuoteDrawerResult> {
  const field = (key: string) => (formData.get(key) as string | null)?.trim() ?? ""
  const reference = field("reference") || `5N-${Math.floor(1000 + Math.random() * 9000)}`
  const persisted = field("persisted") === "true"

  const contactEmail = field("email")
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { ok: false, reference, message: "Please enter a valid work email address." }
  }

  let rows: Array<[string, string]> = []
  let subject = ""
  const attachments: Array<{ filename: string; content: Buffer }> = []

  if (mode === "STANDARD-SPOT") {
    const required = ["origin", "destination", "pickup", "equipment", "weight", "commodity", "name", "email", "phone"]
    const missing = required.filter((k) => !field(k))
    if (missing.length) {
      return { ok: false, reference, message: `Missing required field(s): ${missing.join(", ")}.` }
    }
    rows = [
      ["Origin", field("origin")],
      ["Destination", field("destination")],
      ["Pickup / ready", field("pickup")],
      ["Delivery constraint", field("constraint")],
      ["Equipment", field("equipment")],
      ["Weight (lbs)", field("weight")],
      ["Commodity / dims / value", field("commodity")],
      ["Site requirements", formData.getAll("site_req").map(String).join(", ") || "—"],
      ["Contact", field("name")],
      ["Email", field("email")],
      ["Phone", field("phone")],
      ["Load board", persisted ? "Posted to Supabase loads as 'quoted'" : "Not persisted (Supabase unavailable)"],
    ]
    subject = `Capacity request ${reference} · ${field("origin")} → ${field("destination")} · ${field("equipment")}`
  } else if (mode === "PROJECT-RFP") {
    const missing = ["name", "email"].filter((k) => !field(k))
    if (missing.length) {
      return { ok: false, reference, message: `Missing required field(s): ${missing.join(", ")}.` }
    }
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0)
    let total = 0
    for (const file of files) {
      total += file.size
      if (total > MAX_ATTACHMENT_BYTES) {
        return { ok: false, reference, message: "Attachments exceed 20 MB total. Email the files to dispatch instead." }
      }
      attachments.push({ filename: file.name, content: Buffer.from(await file.arrayBuffer()) })
    }
    rows = [
      ["Contact / company", field("name")],
      ["Email", field("email")],
      ["Project notes", field("notes") || "—"],
      ["Files", files.length ? files.map((f) => `${f.name} (${Math.round(f.size / 1024)} KB)`).join("\n") : "None attached"],
    ]
    subject = `Project RFP ${reference} · ${field("name")} · ${files.length} file(s)`
  } else {
    const missing = ["contact", "lane", "freight", "deadline"].filter((k) => !field(k))
    if (missing.length) {
      return { ok: false, reference, message: `Missing required field(s): ${missing.join(", ")}.` }
    }
    rows = [
      ["Contact + cell", field("contact")],
      ["Pickup → delivery", field("lane")],
      ["Freight + weight", field("freight")],
      ["Hard deadline", field("deadline")],
    ]
    subject = `🚨 LINE-DOWN ${reference} · ${field("lane")} · deadline ${field("deadline")}`
  }

  const html = `
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;max-width:640px">
      <div style="display:inline-block;padding:4px 10px;border:1px solid ${mode === "EMERGENCY-HOTSHOT" ? "#ef4444" : "#f59e0b"};color:${mode === "EMERGENCY-HOTSHOT" ? "#b91c1c" : "#b45309"};font-size:12px;letter-spacing:.08em;text-transform:uppercase">${escapeHtml(modeLabel[mode])}</div>
      <h2 style="margin:12px 0 4px">${escapeHtml(reference)} · ${escapeHtml(modeLabel[mode])}</h2>
      <p style="color:#64748b;margin:0 0 20px">Submitted from ${site.domain} Request Capacity drawer · ${new Date().toUTCString()}</p>
      <table style="border-collapse:collapse;width:100%">${rowsHtml(rows)}</table>
      ${
        mode === "EMERGENCY-HOTSHOT"
          ? `<p style="margin-top:20px;color:#b91c1c;font-weight:700">15-minute callback SLA. Call the contact now.</p>`
          : `<p style="margin-top:20px;color:#64748b">60-minute all-in quote SLA.</p>`
      }
    </div>`

  const to = [LEAD_INBOX]
  if (mode === "EMERGENCY-HOTSHOT" && DISPATCH_PAGER) to.push(DISPATCH_PAGER)

  try {
    await sendMail({
      fromName: "Five Nines Dispatch",
      to,
      replyTo: contactEmail || undefined,
      subject,
      html,
      attachments: attachments.length ? attachments : undefined,
    })
  } catch (error) {
    console.error("[quote-drawer] send failed:", error instanceof Error ? error.message : error, { reference, mode })
    return {
      ok: persisted,
      reference,
      message: persisted
        ? undefined
        : `Something went wrong sending your request. Call 24/7 dispatch at ${site.phone} and we'll log it manually.`,
    }
  }

  return { ok: true, reference }
}
