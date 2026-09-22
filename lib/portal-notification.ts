/** Pure renderer: only explicitly selected operational fields enter internal emails. */
const escape = (value: unknown): string =>
  String(value ?? "Not provided").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const fields = [
  ["reference", "Request reference"], ["submitted_at", "Submitted at (UTC)"],
  ["company", "Carrier company"], ["contact", "Contact name"],
  ["email", "Email"], ["phone", "Phone"], ["address", "Company address"],
  ["mc", "MC number"], ["dot", "USDOT number"],
  ["profile_status", "Portal approval"], ["highway_status", "Highway status"],
  ["insurance_company", "Insurance company"], ["insurance_expiry", "Insurance expiration"],
  ["factoring", "Uses factoring"], ["factor_name", "Factoring company"],
  ["load_reference", "TAI load reference (internal)"],
  ["origin", "Origin"], ["destination", "Destination"],
  ["pickup_date", "Pickup date"], ["delivery_date", "Delivery date"],
  ["equipment", "Load equipment"], ["weight_lbs", "Weight (lb)"],
  ["dimensions", "Dimensions"], ["note", "Carrier notes"],
] as const;

export function notificationHtml(event: { recipient: string; detail: string }): string {
  const internal = event.recipient.toLowerCase() === "sturma@blbxcritical.com";
  const link = `<p><a href="https://fivenineslogistics.com/${internal ? "agent-desk" : "portal/home"}">Open Five Nines to review</a></p>`;
  let data: Record<string, unknown> | undefined;
  try { data = JSON.parse(event.detail); } catch { /* Existing plain-text queue entries. */ }
  if (data && data.template === "fn_carrier_summary_v1") {
    // Never send the internal summary to a carrier if an event is misrouted.
    if (!internal) throw new Error("Internal summary recipient mismatch");
    if (!["bid", "auto_book", "counter"].includes(String(data.source)) ||
        !["bid_submitted", "awaiting_dispatch"].includes(String(data.state)) ||
        typeof data.amount !== "number" || !Number.isFinite(data.amount) || data.amount <= 0)
      throw new Error("Invalid carrier summary");
    const pendingBid = data.state === "bid_submitted";
    const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.amount);
    const row = (label: string, value: unknown) => `<tr><th scope="row" style="padding:9px;text-align:left;border-bottom:1px solid #e2e8f0;width:42%">${escape(label)}</th><td style="padding:9px;border-bottom:1px solid #e2e8f0;white-space:pre-wrap;overflow-wrap:anywhere">${escape(value === "" ? null : value)}</td></tr>`;
    return `<div style="background:#f1f5f9;padding:24px;font-family:Arial,sans-serif;color:#133457"><div style="max-width:640px;margin:auto;background:white;padding:24px">
      <p style="font-size:12px;letter-spacing:2px">FIVE NINES LOGISTICS · INTERNAL</p>
      <h1 style="font-size:24px">${pendingBid ? "Carrier bid summary" : "Draft booking summary"}</h1>
      <p style="background:#fff7ed;padding:14px"><strong>${pendingBid ? "BID RECEIVED — REVIEW REQUIRED" : "PENDING DISPATCH CONFIRMATION"}</strong><br>This is a mock operational summary, not a rate confirmation or authorization to dispatch a truck.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${row(pendingBid ? "Carrier bid (USD)" : "Carrier offer accepted (USD)", amount)}${row("Source", data.source === "auto_book" ? "Auto-book request" : data.source === "counter" ? "Carrier accepted counteroffer" : "Carrier bid")}${fields.map(([key, label]) => row(label, data[key])).join("")}</table>
      <p>${pendingBid ? "Accept, deny, or counter in the authenticated desk." : "Verify availability and complete the existing TAI assignment/write-back process before sending a final rate confirmation."}</p>
      <p>Customer pricing, tax documents, banking details, and private document links are intentionally excluded. Review protected documents in the portal.</p>${link}</div></div>`;
  }
  // Do not leak an unknown structured payload if a future template is unsupported.
  if (data && typeof data === "object") throw new Error("Unsupported notification template");
  return `<p>${escape(event.detail)}</p>${link}`;
}
