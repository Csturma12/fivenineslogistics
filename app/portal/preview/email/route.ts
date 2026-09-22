import { notificationHtml } from "@/lib/portal-notification";

export const dynamic = "force-dynamic";

/** Local-only sample. No database, notification queue, or email provider calls. */
export function GET(request: Request) {
  if (process.env.NODE_ENV !== "development")
    return new Response("Not found", { status: 404 });
  const requested = new URL(request.url).searchParams.get("type");
  const type = requested === "bid" || requested === "counter" ? requested : "auto_book";
  const title = type === "bid" ? "New carrier bid" : "Carrier reservation — dispatch action required";
  const email = notificationHtml({
    recipient: "sturma@blbxcritical.com",
    detail: JSON.stringify({
      template: "fn_carrier_summary_v1",
      reference: "SAMPLE-REQUEST-1042",
      submitted_at: "2026-09-20 15:00 UTC (sample)",
      source: type,
      state: type === "bid" ? "bid_submitted" : "awaiting_dispatch",
      amount: type === "bid" ? 1850 : type === "counter" ? 1750 : 1800,
      company: "Sample Carrier LLC — fictional",
      contact: "Alex Morgan (sample)",
      email: "dispatch@example.test",
      phone: "(713) 555-0142",
      address: "100 Example Way, Houston, TX (sample)",
      mc: "SAMPLE-MC", dot: "SAMPLE-DOT",
      profile_status: "Approved (sample only)",
      highway_status: "Verified (sample only)",
      insurance_company: "Example Insurance — fictional",
      insurance_expiry: "2027-06-30",
      factoring: "No", factor_name: "Not applicable",
      load_reference: "SAMPLE-TAI-1042",
      origin: "Houston, TX", destination: "Dallas, TX",
      pickup_date: "2026-12-02", delivery_date: "2026-12-03",
      equipment: "53 ft flatbed", weight_lbs: 42000,
      dimensions: "48 ft L × 8 ft W × 8 ft H",
      note: "Sample: truck available for a morning pickup. Straps and tarps available. Driver details to follow after dispatch confirmation.",
    }),
  });
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Five Nines — team email preview</title><style>body{margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#133457}header{max-width:688px;margin:24px auto 0;padding:0 24px}nav{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}nav a{padding:10px 14px;border:1px solid #133457;border-radius:6px;color:#133457;text-decoration:none}nav a[aria-current=page]{background:#133457;color:white}h1{margin:10px 0}header p{line-height:1.5}</style></head><body><header><p style="font-size:12px;letter-spacing:2px">LOCAL PREVIEW · FICTIONAL DATA · NO EMAIL SENT</p><h1>Your team's notification</h1><nav aria-label="Email examples">${[["bid", "New bid"], ["auto_book", "Auto-book request"], ["counter", "Accepted counteroffer"]].map(([value, label]) => `<a href="?type=${value}"${type === value ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav><p><strong>To:</strong> sturma@blbxcritical.com<br><strong>Subject:</strong> ${title}</p></header>${email}</body></html>`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  });
}
