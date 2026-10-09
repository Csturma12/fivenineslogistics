import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CarrierBoard } from "../components/portal/carrier-board";
import { pickupWindow } from "../lib/portal-load-window";
import { allPortalRows } from "../lib/portal-pages";
import { samplePortalWorkspace } from "../lib/portal-sample-data";

test("pickup searches cover fourteen calendar dates, including leap day and DST", () => {
  assert.deepEqual(pickupWindow("2028-02-25", "2028-02-25"), {
    from: "2028-02-25", through: "2028-03-09", until: "2028-03-10",
  });
  assert.deepEqual(pickupWindow("2026-03-07", "2026-03-07"), {
    from: "2026-03-07", through: "2026-03-20", until: "2026-03-21",
  });
  assert.equal(pickupWindow("", "2026-10-08").from, "2026-10-08");
  assert.equal(pickupWindow("2026-10-01", "2026-10-08").from, "2026-10-08");
  assert.throws(() => pickupWindow("2026-02-30", "2026-02-01"));
});

test("keyset paging returns all loads even when the server caps page size", async () => {
  const ids = Array.from({ length: 1201 }, (_, i) => i + 1);
  const cursors: Array<number | string | null> = [];
  const rows = await allPortalRows<{ id: number }>(async (afterId) => {
    cursors.push(afterId);
    const remaining = ids.filter((id) => afterId == null || id > Number(afterId));
    return {
      data: remaining.slice(0, 300).map((id) => ({ id })),
      count: remaining.length,
      error: null,
    };
  });
  assert.equal(rows.length, 1201);
  assert.deepEqual(cursors, [null, 300, 600, 900, 1200]);
  assert.deepEqual([rows[0].id, rows.at(-1)?.id], [1, 1201]);
});

test("paging fails instead of silently returning a partial board", async () => {
  await assert.rejects(
    allPortalRows(async () => ({ data: [], count: 5, error: null })),
    /load board could not be refreshed/i,
  );
});

test("carrier board exposes pickup date, exact equipment types and a bid form", () => {
  const html = renderToStaticMarkup(createElement(CarrierBoard, {
    data: samplePortalWorkspace("carrier"),
    act: async () => true,
    busy: false,
    pickupFrom: "2099-01-04",
  }));
  assert.match(html, /Pickup from/);
  assert.match(html, /2099-01-04 through 2099-01-17/);
  assert.match(html, /Flatbed · 48 ft/);
  assert.match(html, /Dry van · 53 ft/);
  assert.match(html, /Submit bid/);
});
