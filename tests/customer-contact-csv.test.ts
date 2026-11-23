import { test } from "node:test";
import assert from "node:assert/strict";
import { customersFromCsv } from "../lib/customer-contact-csv";
import { ContactProblem, parseCustomerInput } from "../lib/portal-customer-contacts";

test("contact export groups contacts under their TAI customer", () => {
  const csv = [
    "Customer Name,Organization Id,First Name,Last Name,Email,Phone",
    'Acme Refractory,1201,Dana,Lee,Dana@Acme.example,555-0100',
    '"Acme Refractory",1201,Sam,Ortiz,sam@acme.example,',
    "Blue Kiln Co,1302,Pat,Kim,pat@bluekiln.example,555-0102",
    "Blue Kiln Co,,No,Id,noid@bluekiln.example,",
    "Blue Kiln Co,1302,Bad,Email,not-an-email,",
    "Blue Kiln Co,1302,Pat,Again,pat@bluekiln.example,",
  ].join("\r\n");
  const out = customersFromCsv(csv);
  assert.deepEqual(out.missingColumns, []);
  assert.equal(out.customers.length, 2);
  assert.deepEqual(out.customers[0], {
    company: "Acme Refractory",
    accountId: "1201",
    contacts: [
      { name: "Dana Lee", email: "dana@acme.example", phone: "555-0100" },
      { name: "Sam Ortiz", email: "sam@acme.example", phone: "" },
    ],
  });
  assert.deepEqual(out.skipped.map((s) => s.line), [5, 6, 7]);
});

test("contact export reports the columns it could not find", () => {
  assert.deepEqual(customersFromCsv("Company,Email\nAcme,a@acme.example\n").missingColumns, ["TAI customer ID", "contact name"]);
});

test("adding a customer requires at least one contact with a real email", () => {
  const base = { company: "Acme", accountId: "1201" };
  assert.throws(() => parseCustomerInput({ ...base, contacts: [] }), ContactProblem);
  assert.throws(() => parseCustomerInput({ ...base, contacts: [{ name: "A", email: "acme@portal.fivenineslogistics.com" }] }), /real email/);
  assert.throws(() => parseCustomerInput({ ...base, accountId: "abc", contacts: [{ name: "A", email: "a@acme.example" }] }), /TAI customer ID/);
  assert.throws(() => parseCustomerInput({ ...base, contacts: [{ name: "A", email: "a@x.example" }, { name: "B", email: "A@x.example" }] }), /twice/);
  assert.deepEqual(parseCustomerInput({ ...base, contacts: [{ name: " Dana ", email: "Dana@Acme.example", phone: 5550100 }] }), {
    company: "Acme", accountId: "1201", contacts: [{ name: "Dana", email: "dana@acme.example", phone: "5550100" }],
  });
});
