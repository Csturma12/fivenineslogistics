import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import {
  carrierLoad,
  calendarDate,
  centralToday,
  money,
  profileDetails,
  safeHighwayUrl,
  setupMissing,
} from "../lib/portal-contract";
import { ingestRows } from "../lib/portal-ingest";
import { notificationHtml, notificationRecipient, PORTAL_DISPATCH_EMAIL } from "../lib/portal-notification";
import { filterCarrierLoads } from "../lib/portal-board";
import { allPortalRows, allPortalRowsAtVersion, comparePickupDate } from "../lib/portal-pages";
import { requireBridgeToken } from "../lib/portal-bridge-auth";

test("bridge requires a configured strong token and an exact bearer credential", () => {
  const token = "fictional-bridge-test-token-not-a-real-secret";
  const request = (value?: string) => new Request("https://example.test/api/tms/loads", { headers: value ? { authorization: value } : {} });
  assert.throws(() => requireBridgeToken(request(), undefined), /not configured/);
  assert.throws(() => requireBridgeToken(request(), "short"), /not configured/);
  assert.throws(() => requireBridgeToken(request(`Bearer ${"x".repeat(token.length)}`), token), /Unauthorized/);
  assert.throws(() => requireBridgeToken(request(token), token), /Unauthorized/);
  assert.doesNotThrow(() => requireBridgeToken(request(`Bearer ${token}`), token));
});

test("release switch hides auto-book and offer amounts even when feed provides them", () => {
  const row = carrierLoad({ id: "example", auto_book: true, carrier_offer_usd: 1500 }, false);
  assert.equal(row.auto_book, false);
  assert.equal(row.carrier_offer_usd, null);
});

test("all open loads are read across page boundaries and can be filtered by pickup and lane", async () => {
  const all = Array.from({ length: 1201 }, (_, n) => ({
    id: String(n), origin_city: n % 2 ? "Houston" : "Austin", origin_state: "TX",
    dest_city: "Dallas", dest_state: "TX", pickup_date: n % 2 ? "2026-10-05" : "2026-10-07",
    equipment: "Flatbed", status: "available", auto_book: false, carrier_offer_usd: null,
    delivery_date: null, weight_lbs: null, dimensions: null,
  }));
  const pages: Array<string | null> = [];
  const loaded = await allPortalRows(async (afterId) => {
    pages.push(afterId);
    // The first page's load 100 is reserved before page two is read.
    const remaining = pages.length === 1 ? all : all.filter(row => row.id !== "100");
    const candidates = remaining.filter(row => afterId === null || Number(row.id) > Number(afterId));
    return { data: candidates.slice(0, 500), count: candidates.length, error: null };
  });
  assert.equal(loaded.length, 1201);
  assert.deepEqual(pages, [null, "499", "999"]);
  assert.ok(loaded.some(row => row.id === "500"));
  assert.equal(filterCarrierLoads(loaded, {
    search: "flatbed", pickupFrom: "2026-10-05", pickupThrough: "2026-10-05",
    origin: "houston", destination: "TX",
  }).length, 600);
  assert.equal(filterCarrierLoads(loaded, {
    search: "", pickupFrom: "", pickupThrough: "", origin: "", destination: "",
  }).length, 1201);
  // A lower PostgREST max-rows setting must not silently cut the board short.
  const smallPages = await allPortalRows(async (afterId) => {
    const remaining = all.filter(row => afterId === null || Number(row.id) > Number(afterId));
    return { data: remaining.slice(0, 100), count: remaining.length, error: null };
  });
  assert.equal(smallPages.length, 1201);
});

test("a load made eligible behind the cursor is found after the feed revision changes", async () => {
  let version = "1";
  let inserted = false;
  const ids = ["b", "c", "d", "e"];
  const result = await allPortalRowsAtVersion(
    async (afterId) => {
      if (afterId === "c" && !inserted) {
        ids.unshift("a");
        inserted = true;
        version = "2";
      }
      const remaining = ids.filter((id) => afterId === null || id > afterId);
      const data = remaining.slice(0, 2).map((id) => ({ id }));
      return { data, count: remaining.length, error: null };
    },
    version,
    async () => version,
  );
  assert.deepEqual(result.rows.map((row) => row.id), ["a", "b", "c", "d", "e"]);
  assert.equal(result.version, "2");
});

test("pickup-date sorting keeps undated loads last in either direction", () => {
  const rows = [
    { id: "b", pickup_date: null },
    { id: "c", pickup_date: "2026-10-06" },
    { id: "a", pickup_date: "2026-10-05" },
  ];
  assert.deepEqual([...rows].sort((a, b) => comparePickupDate(a, b, "asc")).map((row) => row.id), ["a", "c", "b"]);
  assert.deepEqual([...rows].sort((a, b) => comparePickupDate(a, b, "desc")).map((row) => row.id), ["c", "a", "b"]);
});

const db = new PGlite();
before(async () => {
  await db.exec(`create schema auth; create table auth.users(id uuid primary key);
    create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create role anon; create role authenticated; create role service_role bypassrls;
    grant usage on schema public to anon,authenticated,service_role;`);
  await db.exec(
    await readFile(
      new URL("../scripts/portal-workflows.sql", import.meta.url),
      "utf8",
    ),
  );
  // Existing installations receive just the replacement procedure, not a schema reset.
  await db.exec(await readFile(new URL("../scripts/portal-email-upgrade.sql", import.meta.url), "utf8"));
  await db.exec(await readFile(new URL("../scripts/portal-load-scope-upgrade.sql", import.meta.url), "utf8"));
});
after(async () => {
  await db.close();
});
async function carrier() {
  const id = randomUUID();
  await db.query("insert into auth.users values($1)", [id]);
  await db.query(
    `insert into fn_profiles(user_id,email,role,company,status,highway_status,details) values($1,'carrier@example.test','carrier','Test carrier','approved','verified',$2)`,
    [
      id,
      JSON.stringify({
        contact: "Test",
        phone: "555",
        dot: "123",
        equipment: "Flatbed",
        lanes: "TX",
        factoring: "no",
        insurance_expiry: "2099-12-31",
        contract_ack: "yes",
      }),
    ],
  );
  for (const kind of ["packet", "coi", "w9"])
    await db.query(
      "insert into fn_documents(user_id,kind,path,name) values($1,$2,$3,$2)",
      [id, kind, randomUUID()],
    );
  return id;
}
async function customer(account: string) {
  const id = randomUUID();
  await db.query("insert into auth.users values($1)", [id]);
  await db.query(
    `insert into fn_profiles(user_id,email,role,status,customer_account_id) values($1,'customer@example.test','customer','approved',$2)`,
    [id, account],
  );
  return id;
}
async function load(account = "customer-a") {
  const id = randomUUID();
  await db.query(
    `insert into fn_loads(id,external_id,customer_account_id,status,origin_city,origin_state,dest_city,dest_state,auto_book,carrier_offer_usd) values($1::uuid,$1::text,$2,'available','Houston','TX','Dallas','TX',true,1500)`,
    [id, account],
  );
  return id;
}
async function bid(
  actor: string,
  action: string,
  loadId: string,
  amount: number | null = null,
  bidId: string | null = null,
  version: number | null = null,
  staff = false,
) {
  return db.query<{ id: string }>(
    "select fn_bid_action($1,$2,$3,$4,$5,$6,$7,$8) as id",
    [actor, staff, action, loadId, amount, "", bidId, version],
  );
}

test("internal email escapes input, excludes unknown fields and protects its recipient", () => {
  const payload = { template: "fn_carrier_summary_v1", amount: 1500, source: "auto_book",
    state: "awaiting_dispatch", company: '<img src=x onerror="alert(1)">',
    customer_name: "PRIVATE_CUSTOMER", sell_rate: "PRIVATE_SELL", bank: "PRIVATE_BANK" };
  const event = { recipient: "sturma@blbxcritical.com", detail: JSON.stringify(payload) };
  const html = notificationHtml(event);
  assert.match(html, /\$1,500\.00/);
  assert.match(html, /PENDING DISPATCH CONFIRMATION/);
  assert.match(html, /&lt;img/);
  assert.match(html, /Not provided/);
  assert.doesNotMatch(html, /<img|PRIVATE_CUSTOMER|PRIVATE_SELL|PRIVATE_BANK/);
  assert.throws(() => notificationHtml({ ...event, recipient: "carrier@example.test" }), /recipient/);
  assert.equal(notificationRecipient({ recipient: "sturma@blbxcritical.com", subject: "New carrier bid" }), PORTAL_DISPATCH_EMAIL);
  assert.equal(notificationRecipient({ recipient: "sturma@blbxcritical.com", subject: "Carrier reservation - dispatch action required" }), PORTAL_DISPATCH_EMAIL);
  assert.equal(notificationRecipient({ recipient: "carrier@example.test", subject: "Your load bid has an update" }), "carrier@example.test");
  assert.throws(() => notificationHtml({ ...event, detail: JSON.stringify({ ...payload, amount: null }) }), /Invalid/);
  assert.throws(() => notificationHtml({ ...event, detail: '{"template":"future"}' }), /Unsupported/);
  assert.match(notificationHtml({ recipient: "carrier@example.test", detail: "Old <alert>" }), /Old &lt;alert&gt;/);
});

test("bid and booking emails retain submission snapshots and use the correct carrier", async () => {
  const c = await carrier(), l = await load();
  await db.query("update fn_profiles set details=details||$2::jsonb where user_id=$1", [c,
    JSON.stringify({ mc: "MC-123", bank_account: "PRIVATE_BANK", tax_id: "PRIVATE_TAX" })]);
  await db.query("update fn_loads set weight_lbs=42000,dimensions='48 x 8 x 8 ft',equipment='Flatbed' where id=$1", [l]);
  const submitted = await bid(c, "submit", l, 1400);
  const first = await db.query<{ detail: string; recipient: string }>(
    "select detail,recipient from fn_notifications where detail::text like $1 and subject='New carrier bid'", [`%${submitted.rows[0].id}%`]);
  assert.equal(first.rows.length, 1);
  const snapshot = JSON.parse(first.rows[0].detail);
  assert.equal(snapshot.company, "Test carrier");
  assert.equal(snapshot.contact, "Test");
  assert.equal(snapshot.phone, "555");
  assert.equal(snapshot.email, "carrier@example.test");
  assert.equal(first.rows[0].recipient, PORTAL_DISPATCH_EMAIL);
  assert.equal(snapshot.amount, 1400);
  assert.equal(snapshot.dimensions, "48 x 8 x 8 ft");
  assert.equal(snapshot.weight_lbs, 42000);
  assert.equal(snapshot.mc, "MC-123");
  assert.equal(snapshot.state, "bid_submitted");
  assert.ok(!("customer_account_id" in snapshot));
  assert.doesNotMatch(first.rows[0].detail, /PRIVATE_BANK|PRIVATE_TAX/);
  assert.match(notificationHtml(first.rows[0]), /BID RECEIVED/);
  await db.query("update fn_profiles set company='Updated carrier' where user_id=$1", [c]);
  const accepted = await bid(randomUUID(), "accept", l, null, submitted.rows[0].id, 1, true);
  const booked = await db.query<{ detail: string; recipient: string }>(
    "select detail,recipient from fn_notifications where subject='Carrier reservation - dispatch action required' and detail like $1", [`%${accepted.rows[0].id}%`]);
  assert.equal(booked.rows.length, 1);
  assert.equal(booked.rows[0].recipient, PORTAL_DISPATCH_EMAIL);
  assert.equal(JSON.parse(booked.rows[0].detail).company, "Updated carrier");
  assert.equal(JSON.parse(booked.rows[0].detail).amount, 1400);
  assert.match(notificationHtml(booked.rows[0]), /Draft booking summary/);
  const unchanged = await db.query<{ detail: string }>("select detail from fn_notifications where subject='New carrier bid' and detail like $1", [`%${submitted.rows[0].id}%`]);
  assert.equal(unchanged.rows[0].detail, first.rows[0].detail);
});

test("auto-book and counter acceptance summaries capture the accepted buy amount", async () => {
  for (const source of ["auto_book", "counter"]) {
    const c = await carrier(), l = await load();
    let reservation;
    if (source === "auto_book") reservation = await bid(c, "auto_book", l, 1500);
    else {
      const submitted = await bid(c, "submit", l, 1400);
      await bid(randomUUID(), "counter", l, 1350, submitted.rows[0].id, 1, true);
      reservation = await bid(c, "accept_counter", l, null, submitted.rows[0].id, 2);
    }
    const events = await db.query<{ detail: string; recipient: string }>(
      "select detail,recipient from fn_notifications where subject='Carrier reservation - dispatch action required' and detail like $1", [`%${reservation.rows[0].id}%`]);
    assert.equal(events.rows.length, 1);
    const payload = JSON.parse(events.rows[0].detail);
    assert.equal(payload.source, source);
    assert.equal(payload.amount, source === "auto_book" ? 1500 : 1350);
    assert.equal(payload.email, "carrier@example.test");
    assert.match(notificationHtml(events.rows[0]), /PENDING DISPATCH CONFIRMATION/);
  }
});

test("carrier projection strips customer information, sell rate, notes and identifiers", () => {
  const projected = carrierLoad({
    id: "test",
    origin_city: "A",
    origin_state: "TX",
    dest_city: "B",
    dest_state: "TX",
    status: "available",
    auto_book: false,
    carrier_offer_usd: 1500,
    rate_usd: 5000,
    customer: "Secret",
    customer_account_id: "secret",
    tracking_location: "PRIVATE_LOCATION",
    notes: "Secret",
    external_id: "private",
  });
  assert.equal(projected.carrier_offer_usd, null);
  for (const field of [
    "rate_usd",
    "customer",
    "customer_account_id",
    "tracking_location",
    "notes",
    "external_id",
  ])
    assert.ok(!(field in projected));
  assert.equal(
    carrierLoad({ ...projected, auto_book: true, carrier_offer_usd: 1500 })
      .carrier_offer_usd,
    1500,
  );
});
test("input validators reject malformed dates, nonpositive money, unsafe Highway links and self-approval", () => {
  for (const date of ["2026-02-30", "2026-99-99", "tomorrow"])
    assert.throws(() => calendarDate(date));
  for (const amount of [0, -2, "1.001", "1e4", Infinity, 1000001])
    assert.throws(() => money(amount));
  assert.equal(calendarDate("2028-02-29"), "2028-02-29");
  assert.equal(safeHighwayUrl("https://highway.com.evil.test/setup"), null);
  assert.equal(safeHighwayUrl("javascript:alert(1)"), null);
  assert.equal(
    safeHighwayUrl("https://app.highway.com/setup"),
    "https://app.highway.com/setup",
  );
  assert.ok(!("status" in profileDetails({ status: "approved" })));
  assert.equal(centralToday(new Date("2026-09-20T02:00:00Z")), "2026-09-19");
});
test("factoring requires NOA and expired insurance blocks setup", () => {
  const missing = setupMissing(
    {
      role: "carrier",
      company: "test",
      details: {
        contact: "x",
        phone: "x",
        dot: "x",
        equipment: "x",
        lanes: "x",
        factoring: "yes",
        insurance_expiry: "2020-01-01",
        contract_ack: "yes",
      },
    },
    ["packet", "coi", "w9"].map((kind) => ({ id: kind, kind })),
    "2026-09-20",
  );
  assert.deepEqual(missing, ["NOA", "Current insurance expiry"]);
});
test("feed requires explicit carrier offer; never promotes unknown statuses or sell rates", () => {
  const row = {
    external_id: "x",
    origin_city: "A",
    origin_state: "TX",
    dest_city: "B",
    dest_state: "TX",
    observed_at: "2026-09-20T12:00:00Z",
    status: "available",
    auto_book: true,
    rate_usd: 8000,
  };
  const now = new Date("2026-09-20T13:00:00Z");
  assert.throws(() => ingestRows(row, now));
  assert.throws(() =>
    ingestRows({ ...row, status: "UNKNOWN", carrier_offer_usd: 2000 }, now),
  );
  const [safe] = ingestRows(
    {
      ...row,
      carrier_offer_usd: 2000,
      customer_name: "secret",
      notes: "secret",
    },
    now,
  );
  assert.equal(safe.carrier_offer_usd, 2000);
  assert.ok(!("rate_usd" in safe));
  assert.ok(!("customer_name" in safe));
  assert.ok(!("notes" in safe));
  assert.ok(!("reserved_by" in safe));
  assert.throws(() =>
    ingestRows(
      [
        { ...row, auto_book: false },
        { ...row, auto_book: false },
      ],
      now,
    ),
  );
});
test("database denies direct authenticated and anonymous access", async () => {
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(
      () => db.query("select * from fn_profiles"),
      /permission denied/,
    );
    await assert.rejects(
      () => db.query("select fn_carrier_ready($1)", [randomUUID()]),
      /permission denied/,
    );
    await db.exec("reset role");
  }
});
test("unapproved, expired, document-incomplete and nonstaff accounts cannot transact", async () => {
  const c = await carrier(),
    l = await load();
  await db.query(`update fn_profiles set status='draft' where user_id=$1`, [c]);
  await assert.rejects(() => bid(c, "auto_book", l, 1500));
  await db.query(
    `update fn_profiles set status='approved',details=jsonb_set(details,'{insurance_expiry}','"2020-01-01"') where user_id=$1`,
    [c],
  );
  await assert.rejects(() => bid(c, "submit", l, 1400));
  await db.query(
    `update fn_profiles set details=jsonb_set(details,'{insurance_expiry}','"2099-12-31"') where user_id=$1`,
    [c],
  );
  await db.query(`delete from fn_documents where user_id=$1 and kind='w9'`, [
    c,
  ]);
  await assert.rejects(() => bid(c, "auto_book", l, 1500));
  await assert.rejects(() => bid(c, "accept", l, null, randomUUID(), 1, false));
});
test("two competing reservation calls produce exactly one booking and atomic notifications", async () => {
  const a = await carrier(),
    b = await carrier(),
    l = await load();
  const outcomes = await Promise.allSettled([
    bid(a, "auto_book", l, 1500),
    bid(b, "auto_book", l, 1500),
  ]);
  assert.equal(outcomes.filter((x) => x.status === "fulfilled").length, 1);
  const bookings = await db.query(
    "select * from fn_bookings where load_id=$1",
    [l],
  );
  assert.equal(bookings.rows.length, 1);
  const booked = bookings.rows[0] as Record<string, unknown>;
  assert.equal(booked.status, "awaiting_dispatch");
  const notifications = await db.query(
    "select * from fn_notifications where detail like $1",
    [`%${l}%`],
  );
  assert.equal(notifications.rows.length, 1);
});
test("counteroffer requires owner consent and the latest bid version", async () => {
  const a = await carrier(),
    other = await carrier(),
    l = await load();
  const id = (await bid(a, "submit", l, 1700)).rows[0].id;
  await bid(other, "counter", l, 1600, id, 1, true);
  await assert.rejects(() => bid(other, "accept", l, null, id, 2, true));
  await assert.rejects(() => bid(other, "accept_counter", l, null, id, 2));
  await assert.rejects(() => bid(a, "accept_counter", l, null, id, 1));
  await bid(a, "accept_counter", l, null, id, 2);
  const result = await db.query<{ amount: string }>(
    "select amount from fn_bookings where load_id=$1",
    [l],
  );
  assert.equal(Number(result.rows[0].amount), 1600);
});
test("staff acceptance rechecks current insurance and approval", async () => {
  const a = await carrier(),
    l = await load();
  const id = (await bid(a, "submit", l, 1700)).rows[0].id;
  await db.query(
    `update fn_profiles set details=jsonb_set(details,'{insurance_expiry}','"2020-01-01"') where user_id=$1`,
    [a],
  );
  await assert.rejects(() => bid(a, "accept", l, null, id, 1, true));
});
test("profile edits and uploads invalidate approval without unsuspending an account", async () => {
  const a = await carrier();
  await db.query("select fn_save_profile($1,$2,$3,false)", [
    a,
    "Updated",
    "{}",
  ]);
  assert.equal(
    (
      await db.query<{ status: string }>(
        "select status from fn_profiles where user_id=$1",
        [a],
      )
    ).rows[0].status,
    "draft",
  );
  await db.query(`update fn_profiles set status='suspended' where user_id=$1`, [
    a,
  ]);
  await db.query("select fn_add_document($1,$2,$3,$4)", [
    a,
    "w9",
    randomUUID(),
    "file.pdf",
  ]);
  assert.equal(
    (
      await db.query<{ status: string }>(
        "select status from fn_profiles where user_id=$1",
        [a],
      )
    ).rows[0].status,
    "suspended",
  );
});
test("POD/invoice requests cannot cross customer account boundaries", async () => {
  const owner = await customer("A"),
    other = await customer("B"),
    l = await load("A");
  await assert.rejects(() =>
    db.query(`select fn_customer_request($1,'pod',$2,'{}')`, [other, l]),
  );
  await db.query(`select fn_customer_request($1,'pod',$2,'{}')`, [owner, l]);
  assert.equal(
    (await db.query("select * from fn_requests where load_id=$1", [l])).rows
      .length,
    1,
  );
});
test("stale loads and changed offers cannot be booked", async () => {
  const a = await carrier(),
    l = await load();
  await assert.rejects(() => bid(a, "auto_book", l, 1499));
  await db.query(
    `update fn_loads set updated_at=now()-interval '25 hours' where id=$1`,
    [l],
  );
  await assert.rejects(() => bid(a, "auto_book", l, 1500));
});
test("feed preserves reservations and blocks stale equal-time scope replays", async () => {
  const a = await carrier(),
    l = await load();
  await bid(a, "auto_book", l, 1500);
  const original = (
    await db.query<Record<string, unknown>>(
      "select * from fn_loads where id=$1",
      [l],
    )
  ).rows[0];
  const newer = {
    ...original,
    origin_city: "New origin",
    customer_account_id: "101",
    reserved_by: null,
    updated_at: new Date(Date.now() + 1000).toISOString(),
  };
  await db.query("select fn_ingest_loads($1)", [JSON.stringify([newer])]);
  // The TAI clock does not advance when a local name correction withdraws an
  // old customer ID. A same-clock snapshot must immediately revoke access.
  await db.query("select fn_ingest_loads($1)", [JSON.stringify([{ ...newer, customer_account_id: null }])]);
  await db.query("select fn_ingest_loads($1)", [JSON.stringify([newer])]);
  await db.query("select fn_ingest_loads($1)", [
    JSON.stringify([
      {
        ...newer,
        origin_city: "Old origin",
        updated_at: "2020-01-01T00:00:00Z",
      },
    ]),
  ]);
  const row = (
    await db.query<Record<string, unknown>>(
      "select * from fn_loads where id=$1",
      [l],
    )
  ).rows[0];
  assert.equal(row.reserved_by, a);
  assert.equal(row.origin_city, "New origin");
  assert.equal(row.customer_account_id, null);
});

test("load-feed revisions change only for affected customer scopes", async () => {
  const l = await load("revision-account-a");
  const original = (
    await db.query<Record<string, unknown>>("select * from fn_loads where id=$1", [l])
  ).rows[0];
  const version = async (scope: string) => {
    const rows = await db.query<{ version: number }>(
      "select version from fn_load_sync_state where id=$1",
      [scope],
    );
    return rows.rows[0]?.version || 0;
  };
  const accountA = "customer:revision-account-a";
  const accountB = "customer:revision-account-b";
  const beforeA = await version(accountA);
  const beforeB = await version(accountB);
  const updated = {
    ...original,
    updated_at: new Date(Date.parse(String(original.updated_at)) + 1000).toISOString(),
  };
  await db.query("select fn_ingest_loads($1)", [JSON.stringify([updated])]);
  assert.ok((await version(accountA)) > beforeA);
  assert.equal(await version(accountB), beforeB);
  await db.query("select fn_ingest_loads($1)", [
    JSON.stringify([{
      ...updated,
      customer_account_id: "revision-account-b",
      updated_at: new Date(Date.parse(updated.updated_at) + 1000).toISOString(),
    }]),
  ]);
  assert.ok((await version(accountA)) > beforeA);
  assert.ok((await version(accountB)) > beforeB);
});
