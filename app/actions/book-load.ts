"use server"

import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Where booking notifications land (same verified inbox used for capacity requests).
const DISPATCH_INBOX = "sturma@blbxcritical.com"

export type BookResult =
  | { ok: true }
  | { ok: false; reason: "unauthorized" | "taken" | "error" }

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export async function bookLoad(loadId: string): Promise<BookResult> {
  if (typeof loadId !== "string" || loadId.length === 0) {
    return { ok: false, reason: "error" }
  }

  // Verify the session and carrier role server-side (app_metadata is not user-editable).
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== "carrier") {
    return { ok: false, reason: "unauthorized" }
  }

  const email = user.email ?? ""
  const company =
    (typeof user.app_metadata?.company === "string" && user.app_metadata.company.trim()) || "Approved carrier"

  const admin = createAdminClient()

  // Atomic claim: only succeeds if the load is still 'available'. No read-then-write race.
  const { data: claimed, error } = await admin
    .from("loads")
    .update({
      status: "booked",
      booked_by_email: email,
      booked_by_company: company,
      booked_at: new Date().toISOString(),
    })
    .eq("id", loadId)
    .eq("status", "available")
    .select("id, reference, external_id, origin_city, origin_state, dest_city, dest_state, pickup_date, rate_usd")

  if (error) {
    console.log("[v0] bookLoad update error:", error.message)
    return { ok: false, reason: "error" }
  }

  if (!claimed || claimed.length === 0) {
    // 0 rows affected → already booked by someone else.
    return { ok: false, reason: "taken" }
  }

  const load = claimed[0]
  const lane = `${[load.origin_city, load.origin_state].filter(Boolean).join(", ") || "Origin"} → ${
    [load.dest_city, load.dest_state].filter(Boolean).join(", ") || "Destination"
  }`

  // Notify dispatch. Booking already succeeded, so a mail failure must not fail the booking.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const rows: Array<[string, string]> = [
      ["Load", load.reference || load.external_id || load.id],
      ["Lane", lane],
      ["Pickup", load.pickup_date || "TBD"],
      ["Rate", load.rate_usd != null ? `$${load.rate_usd}` : "Call for rate"],
      ["Carrier", company],
      ["Carrier email", email],
    ]
    await resend.emails.send(
      {
        from: `Five Nines Dispatch <dispatch@${process.env.RESEND_EMAIL_DOMAIN}>`,
        to: [DISPATCH_INBOX],
        replyTo: email,
        subject: `Load booked · ${load.reference || load.external_id || load.id} · ${company}`,
        html: `
          <div style="font-family:ui-monospace,Menlo,Consolas,monospace;max-width:640px">
            <h2 style="margin:0 0 4px">Load booked via portal</h2>
            <p style="color:#64748b;margin:0 0 20px">A carrier just booked a load on the board.</p>
            <table style="border-collapse:collapse;width:100%">
              ${rows
                .map(
                  ([k, v]) =>
                    `<tr><td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(
                      k,
                    )}</td><td style="padding:6px 0;color:#0f172a;font-weight:600">${escapeHtml(v)}</td></tr>`,
                )
                .join("")}
            </table>
          </div>`,
      },
      { idempotencyKey: `load-booked/${load.id}` },
    )
  } catch (mailError) {
    console.log("[v0] bookLoad notification failed:", (mailError as Error).message)
  }

  return { ok: true }
}
