"use server"

import { sendMail, type MailAttachment } from "@/lib/mailer"
import { site } from "@/lib/site"

export type ApplicationState = {
  status: "idle" | "success" | "error"
  message?: string
}

const ROLES = ["Freight agent", "Owner-operator / independent contractor", "Accounting", "Operations / administrative"]
const MAX_RESUME_BYTES = 10 * 1024 * 1024
const RESUME_TYPES = /\.(pdf|docx?|rtf|txt|pages)$/i

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function submitApplication(_prev: ApplicationState, formData: FormData): Promise<ApplicationState> {
  const field = (key: string) => (formData.get(key) as string | null)?.trim() ?? ""
  const name = field("name")
  const role = field("role")
  const years = field("years")
  const location = field("location")
  const phone = field("phone")
  const email = field("email")
  const background = field("background")
  const resume = formData.get("resume")

  const missing = Object.entries({ name, role, years, location, phone, email }).filter(([, v]) => !v).map(([k]) => k)
  if (missing.length) return { status: "error", message: `Please fill in: ${missing.join(", ")}.` }
  if (!ROLES.includes(role)) return { status: "error", message: "Please choose a role of interest." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Please enter a valid email address." }
  if (background.length > 4000) return { status: "error", message: "Please keep your background under 4,000 characters." }

  const attachments: MailAttachment[] = []
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > MAX_RESUME_BYTES) return { status: "error", message: "Résumé must be under 10 MB." }
    if (!RESUME_TYPES.test(resume.name)) return { status: "error", message: "Résumé must be a PDF, Word, RTF, or text file." }
    attachments.push({
      filename: resume.name.replace(/[^\w.\- ]/g, "_"),
      content: Buffer.from(await resume.arrayBuffer()),
      contentType: resume.type || "application/octet-stream",
    })
  } else {
    return { status: "error", message: "Please attach your résumé." }
  }

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Role of interest", role],
    ["Years of experience", years],
    ["Current location", location],
    ["Phone", phone],
    ["Email", email],
    ["Background", background || "—"],
    ["Résumé", attachments[0].filename],
  ]

  const html = `
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;max-width:640px">
      <h2 style="margin:0 0 4px">Work With Us — Application Interest</h2>
      <p style="color:#64748b;margin:0 0 20px">Submitted from ${site.domain}/work-with-us</p>
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
      fromName: "Five Nines Careers",
      to: [site.infoEmail],
      replyTo: email,
      subject: `Application · ${role} · ${name}`,
      html,
      attachments,
    })
  } catch (error) {
    console.error("[work-with-us] send failed:", error instanceof Error ? error.message : error)
    return {
      status: "error",
      message: `Something went wrong sending your application. Email ${site.infoEmail} or call ${site.phone}.`,
    }
  }

  return { status: "success" }
}
