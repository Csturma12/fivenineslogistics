const http = require('node:http');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const path = require('node:path');
const assert = require('node:assert/strict');
const { existsSync } = require('node:fs');
const cwd = path.resolve(__dirname, '..');
assert.ok(existsSync(path.join(cwd, '.next', 'BUILD_ID')), 'Build the app before running the HTTP access tests.');
const calls = [];
const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z', app_metadata: {}, user_metadata: {}, is_anonymous: false };
const users = {
    company: { ...user, email: 'Chris@ShipFiveNines.COM' },
    external: { ...user, email: 'outsider@example.test', app_metadata: { staff: true, role: 'staff' }, user_metadata: { staff: true, email: 'chris@shipfivenines.com' } },
    unconfirmed: { ...user, email: 'chris@shipfivenines.com', email_confirmed_at: null },
    anonymous: { ...user, email: 'chris@shipfivenines.com', is_anonymous: true }
};
const encode = x => Buffer.from(JSON.stringify(x)).toString('base64url');
const exp = Math.floor(Date.now() / 1000) + 3600;
const tokens = Object.fromEntries(Object.keys(users).map(kind => [kind, `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp, smoke: kind })}.synthetic-signature`]));
const cookie = (kind, spoof = false) => `sb-127-auth-token=base64-${encode({ access_token: tokens[kind], refresh_token: 'synthetic-refresh', token_type: 'bearer', expires_in: 3600, expires_at: exp, user: spoof ? users.company : users[kind] })}`;
const stub = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Content-Type', 'application/json');
    if (['/auth/v1/verify', '/auth/v1/token'].includes(url.pathname)) {
        calls.push({ type: 'auth', method: req.method, path: url.pathname, kind: 'company' });
        return res.end(JSON.stringify({ access_token: tokens.company, refresh_token: 'synthetic-refresh', expires_in: 3600, token_type: 'bearer', user: users.company }));
    }
    if (url.pathname === '/auth/v1/user') {
        const kind = Object.keys(tokens).find(k => `Bearer ${tokens[k]}` === req.headers.authorization);
        calls.push({ type: 'auth', method: req.method, path: url.pathname, kind });
        if (!kind) {
            res.statusCode = 401;
            return res.end('{"message":"Synthetic unauthorized"}');
        }
        return res.end(JSON.stringify(users[kind]));
    }
    calls.push({ type: 'data', method: req.method, path: url.pathname });
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 500;
        return res.end('{"message":"Unexpected write"}');
    }
    if (url.pathname.startsWith('/rest/v1/'))
        return res.end('[]');
    res.statusCode = 404;
    res.end('{}');
});
const delay = ms => new Promise(r => setTimeout(r, ms));
async function listen(server) { server.listen(0, '127.0.0.1'); await once(server, 'listening'); return server.address().port; }
(async () => {
    let child, logs = '';
    try {
        const supabasePort = await listen(stub), reservation = http.createServer(), port = await listen(reservation);
        await new Promise(r => reservation.close(r));
        // NextURL canonicalizes loopback hosts to localhost. Use that same
        // origin so redirect assertions check the exact effective app origin.
        const origin = `http://localhost:${port}`;
        // Only synthetic credentials enter this isolated child. The preload rejects
        // non-local traffic even if a future built bundle contains an inlined URL.
        const env = { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${supabasePort}`, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'synthetic-anon-key-for-local-smoke', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-key-for-local-smoke', NODE_OPTIONS: `--require=${JSON.stringify(path.join(__dirname, 'fixtures', 'portal-smoke-network-guard.cjs'))}` };
        child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.on('data', x => logs += x);
        child.stderr.on('data', x => logs += x);
        let ready = false;
        for (let i = 0; i < 80; i++) {
            if (child.exitCode !== null)
                throw Error('Next exited');
            try {
                await fetch(origin + '/api/portal/workspace', { signal: AbortSignal.timeout(1000) });
                ready = true;
                break;
            }
            catch {
                await delay(250);
            }
        }
        assert.ok(ready, 'server ready');
        async function request(url, kind, body, spoof = false) { const r = await fetch(origin + url, { method: body ? 'POST' : 'GET', redirect: 'manual', headers: { ...(kind ? { Cookie: cookie(kind, spoof) + '; sb-127-auth-token-code-verifier=base64-' + encode('synthetic-pkce-verifier-for-local-only-smoke') } : {}), ...(body ? { Origin: origin, 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(10000) }); return { status: r.status, text: await r.text(), location: r.headers.get('location') }; }
        for (const kind of [null, 'unconfirmed', 'anonymous']) {
            const r = await request('/agent-desk', kind);
            assert.equal(r.status, 200);
            assert.match(r.text, /Agent desk sign in/);
            assert.doesNotMatch(r.text, /Portal review desk/);
            assert.equal((await request('/api/portal/workspace?desk=1', kind)).status, 401);
            console.log(`PASS ${kind || 'logged-out'} page => staff sign-in wall, desk absent; desk API 401`);
        }
        assert.equal(calls.filter(x => x.type === 'data').length, 0, 'unauthenticated/unverified access must not reach data');
        const external = await request('/agent-desk', 'external', undefined, true);
        assert.equal(external.status, 200);
        assert.match(external.text, /Agent desk access restricted/);
        assert.doesNotMatch(external.text, /Portal review desk/);
        console.log('PASS external verified identity with spoofed company cookie => restricted wall');
        assert.equal((await request('/api/portal/workspace?desk=1', 'external', undefined, true)).status, 403);
        console.log('PASS external desk GET => 403');
        assert.equal(calls.filter(x => x.type === 'data').length, 0, 'external desk page/API must not read data');
        const before = calls.filter(x => x.type === 'data').length;
        for (const action of ['review_profile', 'accept', 'deny', 'counter', 'complete_request', 'retry_notifications']) {
            const r = await request('/api/portal/workspace', 'external', { action }, true);
            assert.equal(r.status, 403, action + ': ' + r.text);
            console.log(`PASS external ${action} POST => 403`);
        }
        const sign = await request('/api/portal/documents', 'external', { action: 'sign', kind: 'company', name: 'synthetic.pdf', size: 50, title: 'Synthetic only' }, true);
        assert.equal(sign.status, 403);
        assert.equal(calls.filter(x => x.type === 'data').length, before);
        console.log('PASS company sign upload => 403; all denied staff POSTs produced zero data calls');
        const beforeRegistration = calls.length;
        const signup = await request('/api/portal/register', null, { role: 'staff', email: 'outsider@example.test', password: 'SyntheticPasswordOnly123!', fullName: 'Synthetic smoke' });
        assert.equal(signup.status, 400, signup.text);
        assert.match(signup.text, /@shipfivenines\.com/);
        assert.equal(calls.length, beforeRegistration);
        console.log('PASS external-domain staff registration => 400; zero Auth/admin/data calls');
        const company = await request('/agent-desk', 'company');
        assert.equal(company.status, 200);
        assert.match(company.text, /Portal review desk/);
        assert.doesNotMatch(company.text, /Agent desk access restricted/);
        console.log('PASS company page => Portal review desk');
        const desk = await request('/api/portal/workspace?desk=1', 'company');
        assert.equal(desk.status, 200, desk.text);
        assert.equal(JSON.parse(desk.text).staff, true);
        console.log('PASS confirmed mixed-case company desk GET => 200 staff:true');
        const ordinary = await request('/api/portal/workspace', 'external', undefined, true);
        assert.equal(ordinary.status, 200, ordinary.text);
        assert.equal(JSON.parse(ordinary.text).staff, false);
        console.log('PASS external ordinary portal GET => 200 staff:false');
        for (const kind of ['company', 'external']) {
            const home = await request('/portal/home', kind);
            assert.ok([307, 308].includes(home.status), home.text);
            const target = new URL(home.location, origin);
            assert.equal(target.origin, origin);
            assert.equal(target.pathname, kind === 'company' ? '/agent-desk' : '/portal');
            console.log(`PASS ${kind} /portal/home => ${target.pathname}`);
        }
        for (const route of ['confirm', 'callback']) {
            const expectedEndpoint = route === 'confirm' ? '/auth/v1/verify' : '/auth/v1/token';
            const count = calls.filter(x => x.path === expectedEndpoint).length;
            const query = route === 'confirm' ? 'token_hash=synthetic-token-hash&type=signup' : 'code=synthetic-code';
            const result = await request(`/auth/${route}?${query}&next=${encodeURIComponent('@attacker.example/steal')}`, 'company');
            assert.ok([302, 303, 307, 308].includes(result.status), result.text);
            assert.equal(calls.filter(x => x.path === expectedEndpoint).length, count + 1, route + ' must perform successful mock verification/exchange');
            const target = new URL(result.location, origin);
            assert.notEqual(target.pathname, '/auth/error', 'must test success branch');
            assert.equal(target.origin, origin, 'auth success redirect must stay same-origin');
            console.log(`PASS ${route} success + attacker next => same-origin ${target.pathname}`);
        }
        assert.equal(calls.filter(x => x.type === 'data' && !['GET', 'HEAD'].includes(x.method)).length, 0);
        console.log(`SUCCESS final build: auth requests=${calls.filter(x => x.type === 'auth').length}; data reads=${calls.filter(x => x.type === 'data').length}; writes=0; local synthetic backend only; no real signup/email attempts`);
    }
    catch (e) {
        console.error(e.stack || e);
        console.error('NEXT OUTPUT', logs.slice(-4000));
        process.exitCode = 1;
    }
    finally {
        if (child && child.exitCode === null) {
            const stopped = once(child, 'exit');
            child.kill();
            await stopped;
        }
        await new Promise(r => stub.close(r));
        console.log('Servers stopped.');
    }
})();
