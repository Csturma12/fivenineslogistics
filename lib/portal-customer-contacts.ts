// Customer contacts work the way TAI does: a customer is a TAI customer ID plus
// the people who sign in for it. Adding a customer means adding at least one
// contact, and every contact gets their own email login for the customer portal.
//
// No "server-only" import: the agent desk route and scripts/import-customer-contacts.ts
// both use this, each passing its own service-role client and mail sender.
import type { SupabaseClient } from "@supabase/supabase-js"
import { PORTAL_USERNAME_DOMAIN } from "./portal-username"

export type ContactInput = { name: string; email: string; phone: string }
export type CustomerInput = { company: string; accountId: string; contacts: ContactInput[] }

export type ContactOutcome = {
  email: string
  status: "created" | "updated" | "failed"
  invited: boolean
  message?: string
}

export class ContactProblem extends Error {}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(value: unknown, max: number): string {
  if (value == null) return ""
  if (typeof value !== "string" && typeof value !== "number") throw new ContactProblem("Check the form fields and try again.")
  const out = String(value).trim()
  if (out.length > max) throw new ContactProblem("Check the form fields and try again.")
  return out
}

/** Validates an "add customer" request. Throws ContactProblem with a message a person can act on. */
export function parseCustomerInput(raw: unknown): CustomerInput {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  const company = field(body.company, 160)
  const accountId = field(body.accountId, 40)
  if (!company) throw new ContactProblem("Enter the customer's company name.")
  if (!/^\d+$/.test(accountId)) throw new ContactProblem("Enter the customer's TAI customer ID (numbers only).")
  if (!Array.isArray(body.contacts) || body.contacts.length === 0)
    throw new ContactProblem("Add at least one contact. Each contact gets their own portal login.")
  if (body.contacts.length > 50) throw new ContactProblem("Add up to 50 contacts at a time.")
  const seen = new Set<string>()
  const contacts = body.contacts.map((c, i) => {
    const row = (c && typeof c === "object" ? c : {}) as Record<string, unknown>
    const email = field(row.email, 254).toLowerCase()
    const name = field(row.name, 120)
    const phone = field(row.phone, 40)
    const n = i + 1
    if (!name) throw new ContactProblem(`Contact ${n}: enter a name.`)
    if (!EMAIL.test(email)) throw new ContactProblem(`Contact ${n}: enter a valid email.`)
    if (email.endsWith(`@${PORTAL_USERNAME_DOMAIN}`))
      throw new ContactProblem(`Contact ${n}: use the contact's real email address.`)
    if (seen.has(email)) throw new ContactProblem(`Contact ${n}: ${email} is listed twice.`)
    seen.add(email)
    return { name, email, phone }
  })
  return { company, accountId, contacts }
}

export function inviteEmailHtml(input: { name: string; company: string; url: string; signInUrl: string }): string {
  const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!)
  return `<div style="margin:0;padding:24px;background:#0b0f14;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e9ee;">
      <div style="background:#16233a;padding:20px 24px;color:#ffffff;font-weight:600;letter-spacing:.02em;font-size:15px;">
        FIVE NINES <span style="color:#38bdf8;">·</span> LOGISTICS
      </div>
      <div style="padding:24px;color:#1b2430;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#16233a;">Your Five Nines customer portal login is ready.</p>
        <p style="margin:0 0 20px;">Hi ${esc(input.name)}, we set up portal access for you at ${esc(input.company)}. Your login is this email address. Click below to choose your password, then sign in anytime to see your shipments and send us requests.</p>
        <a href="${esc(input.url)}" style="display:inline-block;background:#16233a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;">Choose my password</a>
        <p style="margin:20px 0 0;color:#8a94a3;font-size:12px;">This link expires soon. If it has, go to <a href="${esc(input.signInUrl)}" style="color:#8a94a3;">${esc(input.signInUrl)}</a>, enter this email and choose "Forgot password".</p>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #eef1f5;color:#8a94a3;font-size:11px;line-height:1.5;">
        Five Nines Logistics · Agent of Primary Freight LLC · MC# 841023 · Houston, TX
      </div>
    </div>
  </div>`
}

type SendMail = (args: { to: string[]; subject: string; html: string }) => Promise<{ error: { message: string } | null }>

async function findUserId(db: SupabaseClient, email: string): Promise<string | undefined> {
  // The admin API has no lookup by email; page through (the portal has a few hundred users).
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new ContactProblem("Could not look up existing logins. Try again.")
    const hit = data.users.find((u) => u.email?.toLowerCase() === email)
    if (hit) return hit.id
    if (data.users.length < 1000) return undefined
  }
  return undefined
}

/**
 * Creates (or refreshes) each contact's login, links it to the TAI customer ID,
 * approves it, and emails a "choose your password" link. Safe to run again for
 * the same contact: it re-links and re-sends the invite.
 */
export async function provisionCustomer(
  db: SupabaseClient,
  input: CustomerInput,
  opts: { origin: string; send: SendMail; invite?: boolean },
): Promise<ContactOutcome[]> {
  const out: ContactOutcome[] = []
  for (const contact of input.contacts) {
    try {
      out.push(await provisionContact(db, input, contact, opts))
    } catch (e) {
      out.push({ email: contact.email, status: "failed", invited: false, message: e instanceof Error ? e.message : String(e) })
    }
  }
  return out
}

async function provisionContact(
  db: SupabaseClient,
  customer: CustomerInput,
  contact: ContactInput,
  opts: { origin: string; send: SendMail; invite?: boolean },
): Promise<ContactOutcome> {
  const app_metadata = { role: "customer", company: customer.company }
  let userId: string | undefined
  let status: ContactOutcome["status"] = "created"

  const { data: created, error: createErr } = await db.auth.admin.createUser({
    email: contact.email,
    email_confirm: true,
    app_metadata,
    user_metadata: { full_name: contact.name },
  })
  if (created?.user) userId = created.user.id
  else if (createErr && /already|registered|exists/i.test(createErr.message)) {
    status = "updated"
    userId = await findUserId(db, contact.email)
  } else if (createErr) throw new ContactProblem(createErr.message)
  if (!userId) throw new ContactProblem("Could not find or create this login.")

  const { data: existing, error: readErr } = await db
    .from("fn_profiles").select("role,status,version,details").eq("user_id", userId).maybeSingle()
  if (readErr) throw new ContactProblem("Could not read this contact's portal profile.")
  if (existing && existing.role !== "customer")
    throw new ContactProblem(`${contact.email} already has a ${existing.role} portal login.`)

  if (status === "updated") {
    const { error } = await db.auth.admin.updateUserById(userId, { app_metadata })
    if (error) throw new ContactProblem("Could not update this login.")
  }

  const details = { ...((existing?.details as Record<string, unknown>) || {}), contact: contact.name, phone: contact.phone }
  // Re-adding a suspended contact re-links them but does not lift the suspension.
  const suspended = existing?.status === "suspended"
  const row = {
    user_id: userId,
    email: contact.email,
    role: "customer",
    company: customer.company,
    customer_account_id: customer.accountId,
    status: suspended ? "suspended" : "approved",
    details,
    updated_at: new Date().toISOString(),
  }
  if (existing) {
    // Only write over the version we read, so a save made meanwhile is not lost.
    const { data: saved, error } = await db
      .from("fn_profiles")
      .update({ ...row, version: (existing.version ?? 1) + 1 })
      .eq("user_id", userId)
      .eq("version", existing.version ?? 1)
      .select("user_id")
    if (error) throw new ContactProblem("Could not save this contact's portal profile.")
    if (!saved?.length) throw new ContactProblem("This contact's profile changed while saving. Try again.")
  } else {
    const { error } = await db.from("fn_profiles").insert(row)
    if (error) throw new ContactProblem("Could not save this contact's portal profile.")
  }

  if (suspended)
    return { email: contact.email, status, invited: false, message: "Saved, but this login is suspended. Re-approve it in Setup reviews first." }
  if (opts.invite === false) return { email: contact.email, status, invited: false }
  const sent = await sendCustomerInvite(db, { email: contact.email, name: contact.name, company: customer.company }, opts)
  return { email: contact.email, status, ...sent }
}

/** Emails a contact a link to choose their password. Changes nothing about their access. */
export async function sendCustomerInvite(
  db: SupabaseClient,
  contact: { email: string; name: string; company: string },
  opts: { origin: string; send: SendMail },
): Promise<{ invited: boolean; message?: string }> {
  const { data: link, error: linkErr } = await db.auth.admin.generateLink({
    type: "recovery",
    email: contact.email,
    options: { redirectTo: `${opts.origin}/auth/confirm` },
  })
  const hashed = link?.properties?.hashed_token
  if (linkErr || !hashed) return { invited: false, message: "Login saved, but the invite link could not be made. Use Resend." }
  const url = `${opts.origin}/auth/confirm?token_hash=${hashed}&type=recovery&next=${encodeURIComponent("/portal/reset-password")}`
  const { error: mailErr } = await opts.send({
    to: [contact.email],
    subject: "Your Five Nines customer portal login",
    html: inviteEmailHtml({ name: contact.name, company: contact.company, url, signInUrl: `${opts.origin}/portal/customer` }),
  })
  if (mailErr) return { invited: false, message: "Login saved, but the invite email failed. Use Resend." }
  return { invited: true }
}
