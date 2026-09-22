import { calendarDate, money, PortalProblem, text } from "./portal-contract";

/** A deliberately narrow feed contract. Customer/sell rates have no destination. */
export function ingestRows(body: unknown, now = new Date()) {
  const rows = Array.isArray(body) ? body : [body];
  if (!rows.length || rows.length > 100)
    throw new PortalProblem("Send between 1 and 100 loads per batch.");
  const ids = new Set<string>();
  return rows.map((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new PortalProblem("Invalid load.");
    const row = raw as Record<string, unknown>;
    const external_id = text(row.external_id, 120);
    if (!external_id || ids.has(external_id))
      throw new PortalProblem(
        "Each external_id must be present and unique within the batch.",
      );
    ids.add(external_id);
    const status = text(row.status, 30);
    if (
      !["available", "booked", "in_transit", "delivered", "cancelled"].includes(
        status,
      )
    )
      throw new PortalProblem("Supply an explicit valid load status.");
    const required = (key: string) => {
      const value = text(row[key], 120);
      if (!value) throw new PortalProblem(`Missing ${key}.`);
      return value;
    };
    const observed = text(row.observed_at, 40);
    const timestamp = Date.parse(observed);
    if (
      !Number.isFinite(timestamp) ||
      !/(Z|[+-]\d{2}:\d{2})$/.test(observed) ||
      timestamp > now.getTime() + 300_000
    )
      throw new PortalProblem(
        "observed_at must be a valid timestamp with timezone, not in the future.",
      );
    const pickup_date = calendarDate(row.pickup_date) || null,
      delivery_date = calendarDate(row.delivery_date) || null;
    if (pickup_date && delivery_date && delivery_date < pickup_date)
      throw new PortalProblem("Delivery precedes pickup.");
    const weight = row.weight_lbs == null ? null : Number(row.weight_lbs);
    if (
      weight != null &&
      (!Number.isFinite(weight) || weight <= 0 || weight > 2_000_000)
    )
      throw new PortalProblem("Invalid weight_lbs.");
    if (row.auto_book != null && typeof row.auto_book !== "boolean")
      throw new PortalProblem("auto_book must be a boolean.");
    const auto_book = row.auto_book === true;
    const carrier_offer_usd =
      row.carrier_offer_usd == null ? null : money(row.carrier_offer_usd);
    if (auto_book && carrier_offer_usd === null)
      throw new PortalProblem(
        "Auto-book requires an explicit separate carrier_offer_usd.",
      );
    const trackingRaw =
      row.tracking_at == null ? null : text(row.tracking_at, 40);
    if (
      trackingRaw &&
      (!Number.isFinite(Date.parse(trackingRaw)) ||
        !/(Z|[+-]\d{2}:\d{2})$/.test(trackingRaw) ||
        Date.parse(trackingRaw) > now.getTime() + 300_000)
    )
      throw new PortalProblem("Invalid tracking_at.");
    return {
      external_id,
      status,
      customer_account_id: text(row.customer_account_id ?? "", 120) || null,
      origin_city: required("origin_city"),
      origin_state: required("origin_state"),
      dest_city: required("dest_city"),
      dest_state: required("dest_state"),
      pickup_date,
      delivery_date,
      equipment: text(row.equipment ?? "", 200) || null,
      weight_lbs: weight,
      dimensions: text(row.dimensions ?? "", 300) || null,
      auto_book,
      carrier_offer_usd,
      tracking_location: text(row.tracking_location ?? "", 300) || null,
      tracking_at: trackingRaw ? new Date(trackingRaw).toISOString() : null,
      updated_at: new Date(timestamp).toISOString(),
    };
  });
}
