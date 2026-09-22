import type { Workspace, Profile } from "../lib/portal-contract";

export function previewWorkspace(view: string): Workspace {
  const carrier = view === "carrier" || view === "setup";
  const id = "11111111-1111-4111-8111-111111111111";
  const profile: Profile = {
    user_id: id,
    email: "preview@example.test",
    role: carrier ? "carrier" : "customer",
    company: carrier ? "Sample Carrier" : "Sample Customer",
    status: view === "setup" ? "draft" : "approved",
    highway_status: "verified",
    customer_account_id: carrier ? null : "sample-account",
    review_note: "",
    version: 1,
    details: {
      contact: "Sample contact",
      phone: "555-0100",
      dot: "1234567",
      equipment: "Flatbed / step deck",
      lanes: "Texas · Southeast",
      insurance_company: "Sample insurance",
      insurance_expiry: "2099-12-31",
      factoring: "no",
      contract_ack: "yes",
    },
  };
  const load = {
    id: "22222222-2222-4222-8222-222222222222",
    origin_city: "Houston",
    origin_state: "TX",
    dest_city: "Dallas",
    dest_state: "TX",
    pickup_date: "2026-09-23",
    delivery_date: "2026-09-24",
    equipment: "Flatbed · 48 ft",
    weight_lbs: 42000,
    dimensions: "40 × 8 × 8 ft",
    status: carrier ? "available" : "in_transit",
    auto_book: false,
    carrier_offer_usd: null,
    tracking_location: "Huntsville, TX",
    tracking_at: "2026-09-23T15:30:00Z",
  };
  return {
    email: profile.email,
    staff: view === "desk",
    profile,
    hint: profile.role,
    company: profile.company,
    documents: carrier
      ? ["packet", "coi", "w9"].map((kind) => ({
          id: kind,
          kind,
          name: `sample-${kind}.pdf`,
          user_id: id,
        }))
      : [],
    companyDocuments: [],
    loads: [
      load,
      {
        ...load,
        id: "33333333-3333-4333-8333-333333333333",
        origin_city: "Atlanta",
        origin_state: "GA",
        dest_city: "Nashville",
        dest_state: "TN",
        weight_lbs: 18500,
        dimensions: null,
        equipment: "Dry van · 53 ft",
        auto_book: false,
        carrier_offer_usd: null,
      },
    ],
    bids: carrier
      ? [
          {
            id: "sample-bid",
            load_id: load.id,
            user_id: id,
            amount: 1900,
            note: "",
            status: "countered",
            counter_amount: 1800,
            version: 2,
          },
        ]
      : [],
    requests: [],
    bookings: [],
    highwayUrl: null,
    profiles: [profile],
    notifications: [],
  };
}
