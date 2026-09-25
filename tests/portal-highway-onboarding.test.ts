import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileForm } from "../components/portal/workspace-forms";
import { CarrierBoard } from "../components/portal/carrier-board";
import { highwayOnboardingMailto } from "../lib/portal-highway-onboarding";
import { previewWorkspace } from "./portal-fixtures";

const noAction = async () => { throw new Error("Rendering must not submit an action."); };

function workspace(highwayStatus: string) {
  const data = previewWorkspace("setup");
  return {
    ...data,
    profile: { ...data.profile!, company: "Example Carrier & Sons", highway_status: highwayStatus },
  };
}

function setupHtml(highwayStatus: string, highwayUrl: string | null = null) {
  const data = workspace(highwayStatus);
  return renderToStaticMarkup(createElement(ProfileForm, {
    profile: data.profile, documents: data.documents, highwayUrl,
    act: noAction, upload: noAction, busy: false, readOnlySamples: true,
  }));
}

function mailtos(html: string): URL[] {
  return [...html.matchAll(/href="(mailto:[^"]+)"/g)]
    .map((match) => new URL(match[1].replaceAll("&amp;", "&")));
}

test("unverified carrier setup renders onboarding drafts with company and required contact prompts", () => {
  for (const status of ["awaiting_invitation", "invited"]) {
    const html = setupHtml(status);
    assert.ok(html.includes("Email onboarding"));
    const links = mailtos(html);
    assert.ok(links.length > 0);
    for (const link of links) {
      assert.equal(link.pathname, "onboarding@shipfivenines.com");
      assert.equal(link.searchParams.get("subject"), "Highway setup request - Example Carrier & Sons");
      const body = link.searchParams.get("body")!;
      for (const text of ["Please help me complete Highway setup.", "DOT number:", "MC number (if applicable):", "Contact name:", "Phone:"])
        assert.ok(body.includes(text), text);
    }
  }
});

test("verified carriers get a support draft rather than a repeated setup request", () => {
  const html = setupHtml("verified");
  assert.ok(html.includes("Your Highway verification is complete."));
  assert.ok(html.includes("Contact onboarding"));
  assert.ok(!html.includes("Email onboarding"));
  const links = mailtos(html);
  assert.ok(links.length > 0);
  for (const link of links) {
    assert.equal(link.pathname, "onboarding@shipfivenines.com");
    assert.equal(link.searchParams.get("subject"), "Highway setup support - Example Carrier & Sons");
    const body = link.searchParams.get("body")!;
    assert.ok(body.includes("I need help with my existing Highway setup."));
    assert.ok(!body.includes("Please help me complete Highway setup."));
  }
});

test("carrier text cannot inject mail recipients or query fields in either draft intent", () => {
  for (const intent of ["setup", "help"] as const) {
    const url = new URL(highwayOnboardingMailto("Acme & Sons?bcc=other@example.test\r\nInjected", intent));
    assert.equal(url.protocol, "mailto:");
    assert.equal(url.pathname, "onboarding@shipfivenines.com");
    assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
    assert.equal(url.searchParams.get("bcc"), null);
    assert.ok(url.searchParams.get("subject")!.includes("Acme & Sons?bcc=other@example.test Injected"));
    assert.ok(!/[\r\n]/.test(url.searchParams.get("subject")!));
    const emptyCompany = new URL(highwayOnboardingMailto("", intent));
    assert.equal(emptyCompany.searchParams.get("subject"), intent === "setup" ? "Highway setup request" : "Highway setup support");
  }
});

test("a configured Highway URL never replaces the temporary email-only workflow", () => {
  for (const status of ["awaiting_invitation", "verified"]) {
    const html = setupHtml(status, "https://app.highway.com/setup");
    assert.ok(!html.includes('href="https://app.highway.com/setup"'));
    assert.ok(mailtos(html).length > 0);
  }
});

test("blocked load boards offer setup email only when Highway is incomplete", () => {
  const incomplete = renderToStaticMarkup(createElement(CarrierBoard, {
    data: workspace("awaiting_invitation"), act: noAction, busy: false,
  }));
  assert.ok(incomplete.includes("To complete Highway setup, email"));
  const links = mailtos(incomplete);
  assert.equal(links.length, 1);
  assert.equal(links[0].pathname, "onboarding@shipfivenines.com");
  assert.equal(links[0].searchParams.get("subject"), "Highway setup request - Example Carrier & Sons");
  const verified = renderToStaticMarkup(createElement(CarrierBoard, {
    data: workspace("verified"), act: noAction, busy: false,
  }));
  assert.ok(!verified.includes("To complete Highway setup, email"));
  assert.equal(mailtos(verified).length, 0);
});
