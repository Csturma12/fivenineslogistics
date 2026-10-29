"use server"

import { sendMail, type MailAttachment } from "@/lib/mailer"
import { site } from "@/lib/site"
import { APPLICATION_ROLES } from "@/lib/careers"

export type ApplicationState = {
  status: "idle" | "success" | "error"
  message?: string
}

const MAX_FILE_BYTES = 10 * 1024 * 1024
const DOC_TYPES = /\.(pdf|docx?|rtf|txt|pages|odt)$/i

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

async function readAttachment(file: FormDataEntryValue | null, label: string, required: boolean) {
  if (!(file instanceof File) || file.size === 0) {
    return required ? { error: `Please attach your ${label}.` } : { attachment: null }
  }
  if (file.size > MAX_FILE_BYTES) return { error: `${label[0].toUpperCase()}${label.slice(1)} must be under 10 MB.` }
  if (!DOC_TYPES.test(file.name)) return { error: `${label[0].toUpperCase()}${label.slice(1)} must be a PDF, Word, RTF, or text file.` }
  const attachment: MailAttachment = {
    filename: file.name.replace(/[^\w.\- ]/g, "_"),
    content: Buffer.from(await file.arrayBuffer()),
    contentType: file.type || "application/octet-stream",
  }
  return { attachment }
}

export async function submitApplication(_prev: ApplicationState, formData: FormData): Promise<ApplicationState> {
  const field = (key: string) => ((formData.get(key) as string | null) ?? "").trim().slice(0, 4000)

  const required = {
    "first name": field("first_name"),
    "last name": field("last_name"),
    email: field("email"),
    phone: field("phone"),
    location: field("location"),
    role: field("role"),
    "employment type": field("employment_type"),
    "years of experience": field("years"),
    "work authorization": field("authorized"),
  }
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k)
  if (missing.length) return { status: "error", message: `Please fill in: ${missing.join(", ")}.` }
  if (!(APPLICATION_ROLES as readonly string[]).includes(required.role)) {
    return { status: "error", message: "Please choose a position." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(required.email)) {
    return { status: "error", message: "Please enter a valid email address." }
  }
  if (formData.get("certify") !== "on") {
    return { status: "error", message: "Please confirm the information you provided is accurate." }
  }

  const references = [1, 2, 3]
    .map((n) => ({
      name: field(`ref${n}_name`),
      relationship: field(`ref${n}_relationship`),
      company: field(`ref${n}_company`),
      phone: field(`ref${n}_phone`),
      email: field(`ref${n}_email`),
    }))
    .filter((r) => r.name)

  const resume = await readAttachment(formData.get("resume"), "résumé", true)
  if ("error" in resume) return { status: "error", message: resume.error }
  const referenceDoc = await readAttachment(formData.get("references_file"), "references file", false)
  if ("error" in referenceDoc) return { status: "error", message: referenceDoc.error }

  if (references.length === 0 && !referenceDoc.attachment) {
    return { status: "error", message: "Please list at least one reference or attach a references document." }
  }

  const attachments = [resume.attachment, referenceDoc.attachment].filter((a): a is MailAttachment => Boolean(a))
  const name = `${required["first name"]} ${required["last name"]}`

  const sections: Array<[string, Array<[string, string]>]> = [
    [
      "Applicant",
      [
        ["Name", name],
        ["Email", required.email],
        ["Phone", required.phone],
        ["Street address", field("address") || "—"],
        ["City / State", required.location],
        ["ZIP", field("zip") || "—"],
        ["Authorized to work in US", required["work authorization"]],
        ["LinkedIn / portfolio", field("linkedin") || "—"],
      ],
    ],
    [
      "Position",
      [
        ["Position", required.role],
        ["Employment type", required["employment type"]],
        ["Available start date", field("start_date") || "—"],
        ["Desired compensation", field("compensation") || "—"],
        ["Willing to relocate", field("relocate") || "—"],
      ],
    ],
    [
      "Experience & qualifications",
      [
        ["Years of experience", required["years of experience"]],
        ["CDL", field("cdl") || "—"],
        ["MC / DOT (owner-operators)", field("mc_dot") || "—"],
        ["Most recent employer", field("employer") || "—"],
        ["Job title", field("job_title") || "—"],
        ["Dates employed", field("employment_dates") || "—"],
        ["Reason for leaving", field("leaving_reason") || "—"],
        ["Highest education", field("education") || "—"],
        ["Systems & skills", field("skills") || "—"],
      ],
    ],
    [
      "References",
      references.length
        ? references.map((r, i): [string, string] => [
            `Reference ${i + 1}`,
            [r.name, r.relationship, r.company, r.phone, r.email].filter(Boolean).join(" · "),
          ])
        : [["References", "See attached document"]],
    ],
    [
      "Additional",
      [
        ["Cover letter / background", field("cover_letter") || "—"],
        ["How they heard about us", field("source") || "—"],
        ["Attachments", attachments.map((a) => a.filename).join(", ")],
      ],
    ],
  ]

  const html = `
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;max-width:680px">
      <h2 style="margin:0 0 4px">Employment Application — ${escapeHtml(required.role)}</h2>
      <p style="color:#64748b;margin:0 0 20px">Submitted from ${site.domain}</p>
      ${sections
        .map(
          ([title, rows]) => `
        <h3 style="margin:20px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#334155">${escapeHtml(title)}</h3>
        <table style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              ([k, v]) => `<tr>
                <td style="padding:5px 12px 5px 0;color:#64748b;white-space:nowrap;vertical-align:top;width:200px">${escapeHtml(k)}</td>
                <td style="padding:5px 0;color:#0f172a;font-weight:600;white-space:pre-wrap">${escapeHtml(v)}</td>
              </tr>`,
            )
            .join("")}
        </table>`,
        )
        .join("")}
    </div>`

  try {
    await sendMail({
      fromName: "Five Nines Careers",
      to: [site.dispatchEmail],
      replyTo: required.email,
      subject: `Application · ${required.role} · ${name}`,
      html,
      attachments,
    })
  } catch (error) {
    console.error("[work-with-us] send failed:", error instanceof Error ? error.message : error)
    return {
      status: "error",
      message: `Something went wrong sending your application. Email ${site.dispatchEmail} or call ${site.phone}.`,
    }
  }

  return { status: "success" }
}
