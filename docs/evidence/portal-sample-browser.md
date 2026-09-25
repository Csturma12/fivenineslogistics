# Hydrated sample workspace: browser network assertion

The HTTP smoke suite validates server rendering and authorization. It does not
execute browser effects. This separate browser check covers hydration and client
actions and must accompany changes to sample workspace behavior.

## Observed browser result

On September 25, 2026, the authenticated owner opened the PR 38 preview and:

1. Reloaded the carrier load board and used Refresh after hydration.
2. Switched to Carrier setup and clicked Save draft.
3. Switched to Customer portal and clicked Request POD, then My documents.

The two submission actions showed the test-mode notice. Customer and carrier
documents were noninteractive sample labels. A complete CDP
`Network.requestWillBeSent` capture contained **57 browser requests, with zero
requests to `/api/portal/workspace` or `/api/portal/documents`**. The assertion
rejected truncated/incomplete capture windows; an earlier truncated window was
discarded and the check restarted. No real submission or document upload was made.

## Repeatable browser assertion

Use the browser tool's authenticated owner tab on `/portal/test`. Begin capture
before reloading. Run `collectSampleTraffic()` after each navigation/action so the
event buffer cannot overflow. Do not log request headers, cookies or bodies.

```js
const cdp = await tab.capabilities.get("cdp");
await cdp.send("Network.enable", {}, { timeoutMs: 1000 });
const methods = ["Network.requestWillBeSent"];
let cursor = (await cdp.readEvents({ methods, timeoutMs: 1000 })).cursor;
let observed = 0;
let pageRequests = 0;

async function collectSampleTraffic() {
  const result = await cdp.readEvents({
    afterSequence: cursor, methods, limit: 1000, timeoutMs: 1000,
  });
  if (result.truncated || result.hasMore)
    throw new Error("Incomplete capture: restart this check.");
  for (const event of result.events) {
    const url = new URL(event.params.request.url);
    observed++;
    if (url.pathname === "/portal/test") pageRequests++;
    if (/^\/api\/portal\/(workspace|documents)(?:\/|$)/.test(url.pathname))
      throw new Error("Sample workspace requested live portal data.");
  }
  cursor = result.cursor;
}

// Reload; use the three views and actions listed above through normal UI tools.
// Inspect the visible hydrated state and collect traffic after each step.
await collectSampleTraffic();
if (!observed || !pageRequests)
  throw new Error("No sample page load captured; the check did not run.");
await cdp.send("Network.disable", {}, { timeoutMs: 1000 });
```

This is a manual browser release check, not a claim that the HTTP suite or unit
tests provide browser coverage. Run against an isolated preview before production.
