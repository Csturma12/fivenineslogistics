const http = require('node:http');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const path = require('node:path');
const assert = require('node:assert/strict');
const cwd = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
assert.ok(args.every(arg => arg === '--webpack'), 'Only the optional --webpack build flag is supported.');
const calls = [];
const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z', app_metadata: {}, user_metadata: {}, is_anonymous: false };
const users = {
    company: { ...user, email: 'Chris@ShipFiveNines.COM' },
    colleague: { ...user, email: 'dispatch@shipfivenines.com', app_metadata: { owner: true, email: 'chris@shipfivenines.com' } },
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
    if (req.method === 'POST' && url.pathname.startsWith('/storage/v1/object/upload/sign/fn-private-documents/company/')) {
        calls.push({ type: 'storage-sign', method: req.method, path: url.pathname });
        // This fake response only issues a token. No document bytes or rows are created.
        return res.end(JSON.stringify({ url: `${url.pathname.replace('/storage/v1', '')}?token=synthetic-upload-only` }));
    }
    calls.push({ type: 'data', method: req.method, path: url.pathname });
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 500;
        return res.end('{"message":"Unexpected write"}');
    }
    if (url.pathname.startsWith('/rest/v1/')) {
        res.setHeader('Content-Range', '*/0');
        return res.end('[]');
    }
    res.statusCode = 404;
    res.end('{}');
});
const delay = ms => new Promise(r => setTimeout(r, ms));
async function listen(server) { server.listen(0, '127.0.0.1'); await once(server, 'listening'); return server.address().port; }
async function stopChild(child) {
    if (!child || child.exitCode !== null || child.signalCode !== null) return;
    const stopped = once(child, 'exit');
    if (process.platform === 'win32') {
        // Stop only the process tree spawned by this harness, including a stuck
        // compiler worker. No other Next/dev processes are selected by name.
        const kill = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
        await once(kill, 'exit');
    } else child.kill('SIGTERM');
    await stopped;
}
(async () => {
    let child, logs = '';
    try {
        const supabasePort = await listen(stub);
        // Build and runtime use the same local Auth endpoint because Next inlines
        // NEXT_PUBLIC variables during the build. Do not reuse a hosted build.
        const env = { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${supabasePort}`, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'synthetic-anon-key-for-local-smoke', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-key-for-local-smoke' };
        console.log(`Building production app with synthetic Auth settings${args.includes('--webpack') ? ' (webpack)' : ''}...`);
        child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build', ...args], { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.on('data', x => logs += x);
        child.stderr.on('data', x => logs += x);
        let buildTimer;
        const exit = once(child, 'exit');
        let buildExit;
        try {
            [buildExit] = await Promise.race([
                exit,
                new Promise((_, reject) => {
                    buildTimer = setTimeout(() => reject(new Error('Production build timed out after 5 minutes.')), 300_000);
                }),
            ]);
        } finally {
            clearTimeout(buildTimer);
        }
        assert.equal(buildExit, 0, 'Production build failed.');
        console.log('Production build passed. Starting isolated HTTP checks...');
        logs = '';
        // Only the runtime child uses this guard. It restricts fetch/http/https;
        // it is not an OS firewall. Build-time public font downloads are allowed.
        const runtimeEnv = { ...env, NODE_OPTIONS: `--require=${JSON.stringify(path.join(__dirname, 'fixtures', 'portal-smoke-network-guard.cjs'))}` };
        // Let the OS assign the app's port directly, without a release/rebind race.
        child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '0'], { cwd, env: runtimeEnv, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.on('data', x => logs += x);
        child.stderr.on('data', x => logs += x);
        let origin;
        let ready = false;
        for (let i = 0; i < 80; i++) {
            if (child.exitCode !== null)
                throw Error('Next exited');
            const listening = logs.match(/Local:\s+http:\/\/127\.0\.0\.1:(\d+)(?:\s|$)/);
            if (!listening) {
                await delay(250);
                continue;
            }
            // NextURL canonicalizes loopback hosts to localhost.
            origin = `http://localhost:${listening[1]}`;
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
            for (const [entry, label] of [['/portal', 'Carrier'], ['/portal/customer', 'Customer']]) {
                const portal = await request(entry, kind);
                assert.equal(portal.status, 200);
                assert.match(portal.text, new RegExp(`${label} portal sign in`));
                assert.doesNotMatch(portal.text, /Loading your workspace|Welcome to your portal/);
                console.log(`PASS ${kind || 'logged-out'} ${entry} => sign-in wall; workspace absent`);
            }
        }
        assert.equal(calls.filter(x => x.type === 'data').length, 0, 'unauthenticated/unverified access must not reach data');
        for (const kind of [null, 'unconfirmed', 'anonymous']) {
            const denied = await request('/portal/test', kind);
            assert.ok([307, 308].includes(denied.status));
            assert.equal(new URL(denied.location, origin).pathname, '/agent-desk');
            assert.doesNotMatch(denied.text, /Sample Carrier|Sample Customer/);
        }
        for (const kind of ['external', 'colleague']) {
            const denied = await request('/portal/test', kind, undefined, true);
            assert.equal(denied.status, 404);
            assert.doesNotMatch(denied.text, /Sample Carrier|Sample Customer/);
        }
        for (const view of ['setup', 'carrier', 'customer']) {
            const sample = await request(`/portal/test?view=${view}`, 'company');
            assert.equal(sample.status, 200, sample.text);
            assert.match(sample.text, /TEST MODE/);
            assert.match(sample.text, view === 'customer' ? /Customer portal/ : /Carrier portal/);
            assert.doesNotMatch(sample.text, /\/api\/portal\/documents\?id=/);
            if (view === 'setup') {
                assert.match(sample.text, /onboarding@shipfivenines\.com/);
                assert.match(sample.text, /awaiting_invitation/);
            }
        }
        assert.equal((await request('/portal/preview', 'company')).status, 404);
        assert.equal(calls.filter(x => x.type === 'data').length, 0, 'sample pages must never query profile, shipment, or document data');
        console.log('PASS owner-only sample views; others denied; development preview stays 404; zero data calls');
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
        assert.match(company.text, /href="\/portal\/test"/);
        assert.doesNotMatch(company.text, /Agent desk access restricted/);
        console.log('PASS company page => Portal review desk');
        const colleague = await request('/agent-desk', 'colleague');
        assert.equal(colleague.status, 200);
        assert.doesNotMatch(colleague.text, /href="\/portal\/test"/);
        const desk = await request('/api/portal/workspace?desk=1', 'company');
        assert.equal(desk.status, 200, desk.text);
        assert.equal(JSON.parse(desk.text).staff, true);
        console.log('PASS confirmed mixed-case company desk GET => 200 staff:true');
        const signed = await request('/api/portal/documents', 'company', { action: 'sign', kind: 'company', name: 'synthetic.pdf', size: 50, title: 'Synthetic only' });
        assert.equal(signed.status, 200, signed.text);
        const signedBody = JSON.parse(signed.text);
        assert.match(signedBody.path, /^company\/[0-9a-f-]+\/synthetic\.pdf$/);
        assert.equal(signedBody.token, 'synthetic-upload-only');
        assert.equal(calls.filter(x => x.type === 'storage-sign').length, 1);
        console.log('PASS confirmed company document sign => 200 private company path; one local token response, no upload');
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
        console.log(`SUCCESS final build: auth requests=${calls.filter(x => x.type === 'auth').length}; data reads=${calls.filter(x => x.type === 'data').length}; data writes=0; synthetic storage signatures=1; no real signup/email/upload attempts`);
    }
    catch (e) {
        console.error(e.stack || e);
        console.error('NEXT OUTPUT', logs.slice(-4000));
        process.exitCode = 1;
    }
    finally {
        await stopChild(child);
        await new Promise(r => stub.close(r));
        console.log('Servers stopped.');
    }
})();
