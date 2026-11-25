// Reads a customer-contact export (from TAI or a spreadsheet) into customers
// ready for the agent desk's "add customer" action. Header names vary between
// exports, so each field accepts the common spellings.
import type { CustomerInput } from "./portal-customer-contacts"

const ALIASES: Record<"company" | "accountId" | "name" | "first" | "last" | "email" | "phone", string[]> = {
  company: ["company", "company name", "customer", "customer name", "organization", "organization name", "account", "account name"],
  accountId: ["tai customer id", "customer id", "organization id", "organizationid", "org id", "tai id", "account id", "customerid"],
  name: ["contact", "contact name", "contactname", "name", "full name", "staff name"],
  first: ["first name", "first", "firstname"],
  last: ["last name", "last", "lastname"],
  email: ["email", "email address", "e-mail", "contact email", "login", "username"],
  phone: ["phone", "phone number", "contact phone", "mobile", "cell", "telephone"],
}

export type CsvSkip = { line: number; reason: string }
export type CsvResult = { customers: CustomerInput[]; skipped: CsvSkip[]; missingColumns: string[] }

export function parseCsv(textIn: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  const text = textIn.replace(/^﻿/, "")
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === "," || ch === "\t") { row.push(cell); cell = "" }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++
      row.push(cell); rows.push(row); row = []; cell = ""
    } else cell += ch
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  // Blank rows are kept so skip messages point at the real spreadsheet row.
  return rows
}

const norm = (s: string) => s.trim().toLowerCase().replace(/[_\s]+/g, " ")

export function customersFromCsv(text: string): CsvResult {
  const all = parseCsv(text)
  const start = all.findIndex((r) => r.some((c) => c.trim()))
  const header = start < 0 ? undefined : all[start]
  if (!header) return { customers: [], skipped: [], missingColumns: ["company", "TAI customer ID", "email", "contact name"] }
  const rows = all.slice(start + 1)
  const heads = header.map(norm)
  const col = (key: keyof typeof ALIASES) => heads.findIndex((h) => ALIASES[key].includes(h))
  const at = { company: col("company"), accountId: col("accountId"), name: col("name"), first: col("first"), last: col("last"), email: col("email"), phone: col("phone") }
  const missingColumns = [
    at.company < 0 ? "company" : "",
    at.accountId < 0 ? "TAI customer ID" : "",
    at.email < 0 ? "email" : "",
    at.name < 0 && at.first < 0 && at.last < 0 ? "contact name" : "",
  ].filter(Boolean)
  const byAccount = new Map<string, CustomerInput>()
  const skipped: CsvSkip[] = []
  const seen = new Set<string>()
  rows.forEach((r, i) => {
    const line = start + i + 2
    if (!r.some((c) => c.trim())) return
    const get = (n: number) => (n >= 0 ? (r[n] || "").trim() : "")
    const email = get(at.email).toLowerCase()
    const company = get(at.company)
    const accountId = get(at.accountId).replace(/\.0+$/, "")
    const name = get(at.name) || [get(at.first), get(at.last)].filter(Boolean).join(" ")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return skipped.push({ line, reason: email ? `"${email}" is not an email` : "no email" })
    if (!/^\d+$/.test(accountId)) return skipped.push({ line, reason: `${email}: no TAI customer ID` })
    if (!name) return skipped.push({ line, reason: `${email}: no contact name` })
    if (seen.has(email)) return skipped.push({ line, reason: `${email} is listed twice` })
    seen.add(email)
    const entry = byAccount.get(accountId) || { company, accountId, contacts: [] }
    if (!entry.company) entry.company = company
    entry.contacts.push({ name, email, phone: get(at.phone) })
    byAccount.set(accountId, entry)
  })
  const customers = [...byAccount.values()].filter((c) => {
    if (c.company) return true
    skipped.push({ line: 0, reason: `TAI customer ${c.accountId}: no company name` })
    return false
  })
  return { customers, skipped, missingColumns }
}
