// Scope: the app's fetch/http/https clients only, not arbitrary sockets or an
// operating-system firewall. Other host spellings intentionally fail closed.
const allowed = ['127.0.0.1', 'localhost', '::1', '[::1]'];
const check = input => {
    const host = typeof input === 'string' || input instanceof URL ? new URL(input).hostname : input.url ? new URL(input.url).hostname : input.hostname || input.host;
    if (!allowed.includes(host))
        throw new Error('SMOKE blocked non-local network request');
};
const originalFetch = globalThis.fetch;
globalThis.fetch = (input, options) => { check(input); return originalFetch(input, options); };
for (const name of ['http', 'https']) {
    const module = require(name);
    for (const method of ['request', 'get']) {
        const original = module[method];
        module[method] = function (input, ...args) { check(input); return original.call(this, input, ...args); };
    }
}
