import { test } from "node:test";
import assert from "node:assert/strict";
import { packetReviews, setupMissing, PortalProblem, type PortalDoc } from "../lib/portal-contract";
import { previewWorkspace } from "./portal-fixtures";

const packetId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const otherId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const pending: PortalDoc = { id: packetId, kind: "combined", name: "master.pdf" };
const reviewed: PortalDoc = {
  ...pending, reviewed_at: "2026-09-23T12:00:00Z", included_kinds: ["packet", "coi", "w9"],
};
const today = "2026-09-23";
const profile = () => previewWorkspace("carrier").profile!;

test("one pending master packet can be submitted but cannot approve or open loads", () => {
  assert.deepEqual(setupMissing(profile(), [pending], today, "submission"), []);
  const blocked = setupMissing(profile(), [pending], today);
  for (const reason of ["Master packet review", "PACKET", "COI", "W9"])
    assert.ok(blocked.includes(reason), `approval must require ${reason}`);
});

test("a legacy single packet also allows submission without splitting or reuploading", () => {
  const legacy = { ...pending, kind: "packet" };
  assert.deepEqual(setupMissing(profile(), [legacy], today, "submission"), []);
  assert.ok(setupMissing(profile(), [legacy], today).includes("COI"));
});

test("only confirmed master content satisfies required document types", () => {
  assert.deepEqual(setupMissing(profile(), [reviewed], today), []);
  assert.ok(setupMissing(profile(), [{ ...reviewed, reviewed_at: null }], today).includes("W9"));
  assert.ok(setupMissing(profile(), [{ ...reviewed, included_kinds: ["packet", "coi"] }], today).includes("W9"));
  // A reviewed incomplete packet prompts for the actual omission, not more files merely to meet a count.
  assert.ok(setupMissing(profile(), [{ ...reviewed, included_kinds: ["packet", "coi"] }], today, "submission").includes("W9"));
});

test("NOA remains conditional and a new pending master cannot reuse an old review", () => {
  const p = profile();
  p.details.factoring = "yes";
  assert.ok(setupMissing(p, [reviewed], today).includes("NOA"));
  assert.deepEqual(setupMissing(p, [{ ...reviewed, included_kinds: ["packet", "coi", "w9", "noa"] }], today), []);
  assert.ok(setupMissing(profile(), [reviewed, { ...pending, id: otherId }], today).includes("Master packet review"));
});

test("one packet does not waive profile details or current insurance", () => {
  const p = profile();
  p.details.insurance_expiry = "2020-01-01";
  p.details.phone = "";
  const missing = setupMissing(p, [pending], today, "submission");
  assert.ok(missing.includes("Current insurance expiry"));
  assert.ok(missing.includes("phone"));
});

test("staff packet selection is allowlisted and belongs to the fetched carrier documents", () => {
  assert.deepEqual(packetReviews([{ id: packetId, confirmed: true, included_kinds: ["w9", "packet"] }], [pending]), [
    { id: packetId, confirmed: true, included_kinds: ["packet", "w9"] },
  ]);
  assert.deepEqual(packetReviews([{ id: packetId, confirmed: false, included_kinds: [] }], [reviewed]), [
    { id: packetId, confirmed: false, included_kinds: [] },
  ]);
  for (const value of [
    null, {}, "packet", [null],
    [{ id: packetId, confirmed: true, included_kinds: "packet" }],
    [{ id: packetId, confirmed: true, included_kinds: [null] }],
    [{ id: packetId, confirmed: true, included_kinds: ["coi", "coi"] }],
    [{ id: packetId, confirmed: true, included_kinds: ["approved"] }],
    [{ id: packetId, confirmed: false, included_kinds: ["packet"] }],
    [{ id: packetId, included_kinds: [] }],
  ]) assert.throws(() => packetReviews(value, [pending]), PortalProblem);
  for (const value of [
    [{ id: otherId, confirmed: true, included_kinds: ["packet"] }],
    [{ id: packetId, confirmed: true, included_kinds: [] }, { id: packetId, confirmed: true, included_kinds: [] }],
  ]) assert.throws(
    () => packetReviews(value, [pending]),
    (error) => error instanceof PortalProblem && error.status === 409,
  );
  assert.throws(() => packetReviews([{ id: packetId, confirmed: true, included_kinds: ["coi"] }], [{ ...pending, kind: "coi" }]), PortalProblem);
});
