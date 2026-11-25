import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TruckNeeds } from "../components/truck-needs";
import { buildTruckNeeds, type TruckNeedRow } from "../lib/truck-needs";

const row = (over: Partial<TruckNeedRow> = {}): TruckNeedRow => ({
  status: "Committed",
  carrier_name: "",
  customer_name: "Acme Steel",
  from_city: "HOUSTON",
  from_state: "tx",
  to_city: "birmingham",
  to_state: "AL",
  ship_date: "2026-11-25",
  equipment_type: "Flatbed",
  ...over,
});

test("only booked pickups without a carrier inside the window are counted", () => {
  const needs = buildTruckNeeds(
    [
      row(),
      row({ ship_date: "2026-11-25T08:00:00" }),
      row({ ship_date: "2026-11-27" }),
      row({ status: "Quote" }),
      row({ status: "Dispatched" }),
      row({ status: "Cancelled" }),
      row({ carrier_name: "Fast Trucking" }),
      row({ ship_date: "2026-11-23" }),
      row({ ship_date: "2026-12-01" }),
      row({ ship_date: "" }),
      row({ to_city: "" }),
      row({ from_state: "Texas" }),
      row({ customer_name: "Quality Sausage Co., LLC" }),
    ],
    "2026-11-24",
  );
  assert.equal(needs.days.length, 7);
  assert.equal(needs.days[0], "2026-11-24");
  assert.equal(needs.days[6], "2026-11-30");
  assert.equal(needs.totalPickups, 3);
  assert.deepEqual(needs.lanes, [
    {
      key: "houston, tx|birmingham, al|flatbed",
      origin: "Houston, TX",
      destination: "Birmingham, AL",
      equipment: "Flatbed",
      perDay: [0, 2, 0, 1, 0, 0, 0],
      total: 3,
    },
  ]);
});

test("the published result and markup carry no customer, rate or load number", () => {
  const rows = [
    { ...row(), shipment_id: "132675254", sell: 4321, buy: 3210, notes: "gate code 99" } as TruckNeedRow,
    row({ to_city: "Mobile", equipment_type: "Step Deck" }),
  ];
  const needs = buildTruckNeeds(rows, "2026-11-24");
  const html = renderToStaticMarkup(createElement(TruckNeeds, { needs }));
  for (const published of [JSON.stringify(needs), html]) {
    for (const secret of ["Acme", "132675254", "4321", "3210", "gate code"]) {
      assert.equal(published.includes(secret), false, secret);
    }
  }
  assert.match(html, /Where we need a truck/);
  assert.match(html, /Houston, TX/);
  assert.match(html, /Step Deck/);
});

test("the lane list is capped, soonest pickup first, and the section hides without data", () => {
  const rows = Array.from({ length: 5 }, (_, i) => row({ to_city: `City ${i}`, ship_date: `2026-11-2${8 - i}` }));
  const needs = buildTruckNeeds(rows, "2026-11-24", 7, 3);
  assert.deepEqual(needs.lanes.map((lane) => lane.destination), ["City 4, AL", "City 3, AL", "City 2, AL"]);
  assert.equal(needs.moreLanes, 2);
  assert.equal(needs.totalPickups, 5);
  assert.equal(renderToStaticMarkup(createElement(TruckNeeds, { needs: null })), "");
  const empty = renderToStaticMarkup(createElement(TruckNeeds, { needs: buildTruckNeeds([], "2026-11-24") }));
  assert.match(empty, /No open pickups are posted/);
  assert.equal(empty.includes("<table"), false);
  assert.equal(empty.includes("<ul"), false);
});
