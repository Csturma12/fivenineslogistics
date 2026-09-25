import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const staffId = randomUUID();
const legacyCustomerId = randomUUID();
const legacyPath = `${legacyCustomerId}/${randomUUID()}/existing-bol.pdf`;
let upgrade = "";
before(async () => {
  await db.exec(`create schema auth; create table auth.users(id uuid primary key);
    create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create role anon; create role authenticated; create role service_role bypassrls;
    grant usage on schema public to anon,authenticated,service_role;`);
  await db.exec(await readFile(new URL("../scripts/portal-workflows.sql", import.meta.url), "utf8"));
  await db.query("insert into auth.users values($1)", [legacyCustomerId]);
  await db.query(`insert into fn_profiles(user_id,email,role,company)
    values($1,'customer@example.test','customer','Existing customer')`, [legacyCustomerId]);
  await db.query(`insert into fn_documents(user_id,kind,path,name)
    values($1,'bol',$2,'existing-bol.pdf')`, [legacyCustomerId, legacyPath]);
  upgrade = await readFile(new URL("../scripts/portal-master-packet-upgrade.sql", import.meta.url), "utf8");
  await db.exec(upgrade);
  await db.exec(upgrade);
  await db.query("insert into auth.users values($1)", [staffId]);
});
after(async () => { await db.close(); });

test("upgrade preserves customer files and accepts every current customer and splitter kind", async () => {
  const existing = await db.query<{ path: string; included_kinds: string[] }>(
    "select path,included_kinds from fn_documents where user_id=$1 and kind='bol'", [legacyCustomerId],
  );
  assert.equal(existing.rows[0].path, legacyPath);
  assert.deepEqual(existing.rows[0].included_kinds, []);
  for (const kind of ["po", "packing_list", "other"]) {
    const path = `${legacyCustomerId}/${randomUUID()}/${kind}.pdf`;
    await db.query("select fn_add_document($1,$2,$3,$4)", [legacyCustomerId, kind, path, `${kind}.pdf`]);
    assert.equal((await db.query<{ kind: string }>(
      "select kind from fn_documents where path=$1", [path],
    )).rows[0].kind, kind);
  }
  assert.equal((await db.query<{ file_size_limit: number }>(
    "select file_size_limit from storage.buckets where id='fn-private-documents'",
  )).rows[0].file_size_limit, 15_728_640);
});

async function carrier(details: Record<string, string> = {}) {
  const id = randomUUID();
  await db.query("insert into auth.users values($1)", [id]);
  await db.query(`insert into fn_profiles(user_id,email,role,company,details)
    values($1,'carrier@example.test','carrier','Fictional carrier',$2)`, [id, JSON.stringify({
    contact: "Sample dispatcher", phone: "555-0100", dot: "123456", equipment: "Flatbed",
    lanes: "TX", factoring: "no", insurance_expiry: "2099-12-31", contract_ack: "yes", ...details,
  })]);
  return id;
}
async function document(user: string, kind = "combined", name = "master.pdf") {
  const path = `${user}/${randomUUID()}/${name}`;
  await db.query("select fn_add_document($1,$2,$3,$4)", [user, kind, path, name]);
  return (await db.query<{ id: string }>("select id from fn_documents where path=$1", [path])).rows[0].id;
}
async function profile(user: string) {
  return (await db.query<{ status: string; version: number; highway_status: string; customer_account_id: string | null; review_note: string }>(
    "select status,version,highway_status,customer_account_id,review_note from fn_profiles where user_id=$1", [user],
  )).rows[0];
}
async function doc(id: string) {
  return (await db.query<{ kind: string; included_kinds: string[]; reviewed_by: string | null; reviewed_at: Date | null; path: string }>(
    "select kind,included_kinds,reviewed_by,reviewed_at,path from fn_documents where id=$1", [id],
  )).rows[0];
}
async function ready(user: string) {
  return (await db.query<{ ready: boolean }>("select fn_carrier_ready($1) as ready", [user])).rows[0].ready;
}
type Options = {
  actor?: string | null; staff?: boolean | null; version?: number | null; status?: string | null;
  highway?: string | null; account?: string | null; note?: string | null;
};
async function review(user: string, reviews: unknown = [], options: Options = {}) {
  return db.query("select fn_review_profile($1,$2,$3,$4,$5,$6,$7,$8,$9)", [
    options.actor === undefined ? staffId : options.actor,
    options.staff === undefined ? true : options.staff,
    user, options.version === undefined ? (await profile(user)).version : options.version,
    options.status === undefined ? "approved" : options.status,
    options.highway === undefined ? "verified" : options.highway,
    options.account === undefined ? "" : options.account,
    options.note === undefined ? "Reviewed private documents" : options.note,
    JSON.stringify(reviews),
  ]);
}
function checklist(id: string, kinds = ["packet", "coi", "w9"]) {
  return [{ id, confirmed: true, included_kinds: kinds }];
}
function revoke(id: string) {
  return [{ id, confirmed: false, included_kinds: [] }];
}
async function load() {
  const id = randomUUID();
  await db.query(`insert into fn_loads(id,external_id,status,origin_city,origin_state,dest_city,dest_state,auto_book,carrier_offer_usd)
    values($1::uuid,$1::text,'available','Houston','TX','Dallas','TX',true,1500)`, [id]);
  return id;
}

test("one explicitly reviewed combined packet can satisfy setup and allow bidding", async () => {
  const user = await carrier();
  const id = await document(user);
  const before = await profile(user);
  await review(user, checklist(id));
  assert.equal(await ready(user), true);
  assert.equal((await profile(user)).version, before.version + 1);
  const saved = await doc(id);
  assert.deepEqual(saved.included_kinds, ["packet", "coi", "w9"]);
  assert.equal(saved.reviewed_by, staffId);
  assert.ok(saved.reviewed_at);
  const result = await db.query<{ bid: string }>(
    "select fn_bid_action($1,false,'submit',$2,1400,'',null,null) as bid", [user, await load()],
  );
  assert.ok(result.rows[0].bid);
});

test("unreviewed combined uploads do not grant approval or booking access", async () => {
  const user = await carrier();
  const id = await document(user);
  assert.deepEqual((await doc(id)).included_kinds, []);
  await assert.rejects(() => review(user), /Approval needs/);
  assert.equal((await profile(user)).status, "draft");
  // Even a mistakenly set approval flag is insufficient without reviewed coverage.
  await db.query("update fn_profiles set status='approved',highway_status='verified' where user_id=$1", [user]);
  assert.equal(await ready(user), false);
  const lane = await load();
  await assert.rejects(
    () => db.query("select fn_bid_action($1,false,'auto_book',$2,1500,'',null,null)", [user, lane]),
    /Approved carrier setup required/,
  );
});

test("missing factoring NOA rolls back the entire checklist and approval transaction", async () => {
  const user = await carrier({ factoring: "yes" });
  const id = await document(user);
  const beforeProfile = await profile(user), beforeDoc = await doc(id);
  await assert.rejects(() => review(user, checklist(id)), /Approval needs/);
  assert.deepEqual(await profile(user), beforeProfile);
  assert.deepEqual(await doc(id), beforeDoc);
  await review(user, checklist(id, ["packet", "coi", "w9", "noa"]));
  assert.equal(await ready(user), true);
});

test("partial checklist can be saved as changes requested but does not enable bids", async () => {
  const user = await carrier();
  const id = await document(user);
  await review(user, checklist(id, ["packet"]), { status: "changes_requested" });
  assert.deepEqual((await doc(id)).included_kinds, ["packet"]);
  assert.equal((await profile(user)).status, "changes_requested");
  assert.equal(await ready(user), false);
});

test("a stale version and a new upload cannot be silently approved", async () => {
  const user = await carrier();
  const id = await document(user);
  const version = (await profile(user)).version;
  await document(user, "coi", "replacement.pdf");
  await assert.rejects(() => review(user, checklist(id), { version }), /Profile changed/);
  assert.equal((await doc(id)).reviewed_by, null);
  await review(user, checklist(id));
  const approvedVersion = (await profile(user)).version;
  await document(user, "w9", "updated-tax.pdf");
  assert.equal((await profile(user)).status, "draft");
  assert.equal(await ready(user), false);
  await assert.rejects(() => review(user, checklist(id), { version: approvedVersion }), /Profile changed/);
});

test("a replacement master packet needs its own review even with old complete coverage", async () => {
  const user = await carrier();
  const first = await document(user);
  await review(user, checklist(first));
  const originalAudit = await doc(first);
  const replacement = await document(user, "combined", "updated-master.pdf");
  assert.equal((await profile(user)).status, "draft");
  assert.equal(await ready(user), false);
  await assert.rejects(() => review(user), /Approval needs/);
  await assert.rejects(() => review(user, checklist(first)), /Approval needs/);
  assert.deepEqual(await doc(first), originalAudit);
  assert.equal((await doc(replacement)).reviewed_by, null);
  // SQL readiness must also reject an accidentally restored approval flag.
  await db.query("update fn_profiles set status='approved' where user_id=$1", [user]);
  assert.equal(await ready(user), false);
  await review(user, checklist(replacement));
  assert.equal(await ready(user), true);
});

test("a pending master packet also blocks approval supported by separate legacy files", async () => {
  const user = await carrier();
  for (const kind of ["packet", "coi", "w9"]) await document(user, kind, `${kind}.pdf`);
  await review(user);
  const master = await document(user);
  await assert.rejects(() => review(user), /Approval needs/);
  await review(user, checklist(master));
  assert.equal(await ready(user), true);
});

test("another carrier's document cannot be reviewed and earlier updates roll back", async () => {
  const user = await carrier(), other = await carrier();
  const own = await document(user), foreign = await document(other);
  const before = await profile(user);
  await assert.rejects(() => review(user, [...checklist(own), ...checklist(foreign)]), /Packet not found/);
  assert.equal((await doc(own)).reviewed_by, null);
  assert.equal((await doc(foreign)).reviewed_by, null);
  assert.deepEqual(await profile(user), before);
});

test("anonymous and authenticated roles cannot execute review even with forged staff input", async () => {
  const user = await carrier();
  const id = await document(user);
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    try {
      await assert.rejects(() => review(user, checklist(id), { version: 2 }), /permission denied/);
    } finally { await db.exec("reset role"); }
  }
  assert.equal((await doc(id)).reviewed_by, null);
});

test("service-only review rejects false/null staff flags and unknown actors", async () => {
  const user = await carrier();
  const id = await document(user);
  assert.equal((await db.query<{ allowed: boolean }>(
    "select has_table_privilege('service_role','auth.users','select') as allowed",
  )).rows[0].allowed, false);
  await db.exec("set role service_role");
  try {
    for (const options of [{ staff: false }, { staff: null }, { actor: null }]) {
      await assert.rejects(() => review(user, checklist(id), options), /Staff required/);
    }
    await assert.rejects(() => review(user, checklist(id), { actor: randomUUID() }), /foreign key/);
    await review(user, checklist(id));
  } finally { await db.exec("reset role"); }
  assert.equal(await ready(user), true);
});

test("legacy individual files still satisfy approval without review metadata", async () => {
  const user = await carrier();
  const ids = [];
  for (const kind of ["packet", "coi", "w9"]) ids.push(await document(user, kind, `${kind}.pdf`));
  await review(user);
  assert.equal(await ready(user), true);
  for (const id of ids) {
    assert.equal((await doc(id)).reviewed_by, null);
    assert.deepEqual((await doc(id)).included_kinds, []);
  }
});

test("an existing packet can be classified without reuploading or changing its path", async () => {
  const user = await carrier();
  const id = await document(user, "packet", "legacy-packet.jpg");
  const path = (await doc(id)).path;
  await review(user, checklist(id));
  assert.equal((await doc(id)).kind, "combined");
  assert.equal((await doc(id)).path, path);
  assert.equal(await ready(user), true);
});

test("unchanged review preserves the original reviewer/time; changed coverage updates audit", async () => {
  const user = await carrier();
  const id = await document(user);
  await review(user, checklist(id));
  const original = await doc(id);
  const secondStaff = randomUUID();
  await db.query("insert into auth.users values($1)", [secondStaff]);
  const version = (await profile(user)).version;
  await review(user, checklist(id, ["w9", "coi", "packet"]), { actor: secondStaff });
  assert.deepEqual(await doc(id), original);
  assert.equal((await profile(user)).version, version + 1);

  // Pre-existing rows may use the old alphabetical order. The same contents
  // must not transfer audit ownership merely because their array order differs.
  await db.query("update fn_documents set included_kinds=array['coi','packet','w9'] where id=$1", [id]);
  const legacyOrder = await doc(id);
  await review(user, checklist(id), { actor: secondStaff });
  assert.deepEqual(await doc(id), legacyOrder);

  await review(user, checklist(id, ["packet", "coi", "w9", "noa"]), { actor: secondStaff });
  assert.equal((await doc(id)).reviewed_by, secondStaff);
  assert.deepEqual((await doc(id)).included_kinds, ["packet", "coi", "w9", "noa"]);
});

test("an empty staff checklist is recorded but grants no document coverage", async () => {
  const user = await carrier();
  const id = await document(user);
  await review(user, checklist(id, []), { status: "changes_requested" });
  assert.equal((await doc(id)).reviewed_by, staffId);
  assert.deepEqual((await doc(id)).included_kinds, []);
  assert.equal(await ready(user), false);
});

test("revoking a reviewed packet removes readiness and cannot be approved in the same transaction", async () => {
  const user = await carrier();
  const id = await document(user);
  await review(user, checklist(id));
  const reviewed = await doc(id);
  const approved = await profile(user);
  assert.equal(await ready(user), true);

  await assert.rejects(() => review(user, revoke(id)), /Approval needs/);
  assert.deepEqual(await doc(id), reviewed);
  assert.deepEqual(await profile(user), approved);
  assert.equal(await ready(user), true);

  await review(user, revoke(id), { status: "changes_requested" });
  const revoked = await doc(id);
  assert.equal(revoked.kind, "combined");
  assert.deepEqual(revoked.included_kinds, []);
  assert.equal(revoked.reviewed_by, null);
  assert.equal(revoked.reviewed_at, null);
  assert.equal((await profile(user)).status, "changes_requested");
  assert.equal(await ready(user), false);
  await assert.rejects(() => review(user), /Approval needs/);
});

test("unconfirming a legacy standalone packet leaves it unchanged", async () => {
  const user = await carrier();
  const id = await document(user, "packet", "legacy-packet.pdf");
  const before = await doc(id);
  await review(user, revoke(id), { status: "changes_requested" });
  assert.deepEqual(await doc(id), before);
});

test("malformed, duplicate and arbitrary checklist entries are rejected atomically", async () => {
  const user = await carrier();
  const id = await document(user);
  const invalid: unknown[] = [
    null, {}, [null], [{ id }], [{ id, included_kinds: null }],
    [{ id, included_kinds: [null] }], [{ id, included_kinds: [1] }],
    [{ id, confirmed: "false", included_kinds: [] }],
    [{ id, confirmed: false, included_kinds: ["packet"] }],
    checklist(id, ["banking"]), checklist(id, ["packet", "packet"]),
    [...checklist(id), ...checklist(id)], [{ id: "invalid", included_kinds: [] }],
  ];
  for (const entries of invalid) {
    await assert.rejects(() => review(user, entries));
    assert.equal((await doc(id)).reviewed_by, null);
  }
  const coi = await document(user, "coi", "coi.pdf");
  await assert.rejects(() => review(user, checklist(coi)), /Packet not found/);
});

test("constraints prevent unreviewed, non-combined, unknown and null-member coverage", async () => {
  const user = await carrier();
  const combined = await document(user), single = await document(user, "coi", "coi.pdf");
  await assert.rejects(() => db.query("update fn_documents set included_kinds=array['coi'] where id=$1", [combined]), /check constraint/);
  await assert.rejects(() => db.query("update fn_documents set included_kinds=array['coi'],reviewed_by=$2,reviewed_at=now() where id=$1", [single, staffId]), /check constraint/);
  for (const kinds of [["banking"], [null]]) {
    await assert.rejects(() => db.query("update fn_documents set included_kinds=$2::text[],reviewed_by=$3,reviewed_at=now() where id=$1", [combined, kinds, staffId]), /check constraint/);
  }
  await assert.rejects(() => db.query("update fn_documents set reviewed_by=$2 where id=$1", [combined, staffId]), /check constraint/);
});

test("insurance, Highway and required carrier information still gate approval", async () => {
  const invalidDetails: Record<string, string>[] = [
    { insurance_expiry: "2020-01-01" }, { insurance_expiry: "2099-99-99" },
    { insurance_expiry: "not-a-date" }, { contract_ack: "no" }, { factoring: "" },
    { dot: "" }, { equipment: "" }, { lanes: "" }, { contact: "" }, { phone: "" },
  ];
  for (const details of invalidDetails) {
    const user = await carrier(details);
    const id = await document(user);
    await assert.rejects(() => review(user, checklist(id)));
    assert.equal((await doc(id)).reviewed_by, null);
    assert.equal(await ready(user), false);
  }
  const user = await carrier();
  const id = await document(user);
  for (const highway of ["awaiting_invitation", "invited"]) {
    await assert.rejects(() => review(user, checklist(id), { highway }), /Approval needs/);
  }
});

test("invalid outcomes, versions, Highway, account and note fail before approval", async () => {
  const user = await carrier();
  const id = await document(user);
  for (const options of [
    { status: "draft" }, { status: null }, { highway: "unknown" }, { highway: null },
    { version: null }, { note: null }, { note: "x".repeat(1001) }, { account: "x".repeat(121) },
  ]) {
    await assert.rejects(() => review(user, checklist(id), options));
    assert.equal((await doc(id)).reviewed_by, null);
  }
});

test("combined upload preserves suspension and invalidates earlier approval", async () => {
  const user = await carrier();
  await db.query("update fn_profiles set status='suspended' where user_id=$1", [user]);
  const version = (await profile(user)).version;
  await document(user);
  assert.equal((await profile(user)).status, "suspended");
  assert.equal((await profile(user)).version, version + 1);
  assert.equal(await ready(user), false);
});

test("customer approval still requires an exact account link and rejects carrier document reviews", async () => {
  const user = await carrier();
  await db.query("update fn_profiles set role='customer' where user_id=$1", [user]);
  await assert.rejects(() => review(user), /company details/);
  await assert.rejects(() => review(user, checklist(randomUUID()), { account: "account-123" }), /Only carrier/);
  await review(user, [], { account: " account-123 " });
  assert.equal((await profile(user)).customer_account_id, "account-123");
});

test("reapplying the upgrade preserves reviewed data, service-only functions and private storage", async () => {
  const user = await carrier();
  const id = await document(user);
  await review(user, checklist(id));
  const before = await doc(id);
  await db.exec(upgrade);
  assert.deepEqual(await doc(id), before);
  assert.equal(await ready(user), true);
  const functions = await db.query<{ proname: string; prosecdef: boolean }>(
    "select proname,prosecdef from pg_proc where proname in ('fn_review_profile','fn_carrier_ready')",
  );
  assert.equal(functions.rows.length, 2);
  assert.ok(functions.rows.every((f) => !f.prosecdef));
  assert.equal((await db.query<{ public: boolean }>("select public from storage.buckets where id='fn-private-documents'")).rows[0].public, false);
  assert.equal((await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where oid='fn_documents'::regclass")).rows[0].relrowsecurity, true);
  for (const role of ["anon", "authenticated"]) {
    assert.equal((await db.query<{ allowed: boolean }>(
      "select has_function_privilege($1,'fn_review_profile(uuid,boolean,uuid,integer,text,text,text,text,jsonb)','execute') as allowed", [role],
    )).rows[0].allowed, false);
  }
});

test("historical baselines refuse to replace upgraded carrier readiness", async () => {
  const before = (await db.query<{ body: string }>(
    "select pg_get_functiondef('public.fn_carrier_ready(uuid)'::regprocedure) as body",
  )).rows[0].body;
  for (const name of ["portal-workflows.sql", "website-project-baseline.sql"]) {
    const sql = await readFile(new URL(`../scripts/${name}`, import.meta.url), "utf8");
    await assert.rejects(() => db.exec(sql), /Master-packet upgrade is installed/);
    await db.exec("rollback");
    const after = (await db.query<{ body: string }>(
      "select pg_get_functiondef('public.fn_carrier_ready(uuid)'::regprocedure) as body",
    )).rows[0].body;
    assert.equal(after, before, `${name} must not replace carrier readiness`);
  }
});
