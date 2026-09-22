// The landing page's write paths. The launch decision is counted off these rows,
// so a silently dropped sign-up is the expensive bug here.
//   supabase start && pnpm build && pnpm start -p 3111 &
//   node scripts/api-check.mjs [http://localhost:3111]
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:3111';
// Each case gets its own client address: the limiter keys on it, so otherwise the
// check would trip its own rate limit and prove nothing about the endpoint.
let caller = 0;
const post = (path, body, ip = `10.0.0.${++caller % 250}`) =>
  fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

const email = `check-${Date.now()}@example.com`;

// A sign-up is recorded, and the same address twice is not an error to the reader.
let res = await post('/api/waitlist', { email: ` ${email.toUpperCase()} `, locale: 'uk', source: 'landing', utm: { utm_source: 'check' } });
assert.equal(res.status, 200, 'sign-up rejected');
assert.equal((await res.json()).status, 'ok');

res = await post('/api/waitlist', { email, locale: 'uk' });
assert.equal((await res.json()).status, 'duplicate', 'the same address twice must read as already signed up');

// Case and whitespace must not create a second row for the same person.
res = await post('/api/waitlist', { email: `  ${email}  `, locale: 'en' });
assert.equal((await res.json()).status, 'duplicate', 'email is not normalised before insert');

for (const bad of ['nope', '', 'a@b', 'x'.repeat(400) + '@example.com']) {
  res = await post('/api/waitlist', { email: bad, locale: 'en' });
  assert.equal(res.status, 400, `accepted an invalid address: ${bad.slice(0, 20)}`);
}

// Events the page sends are recorded; the sign-up event is not one of them, so
// the launch count cannot be inflated from the browser.
res = await post('/api/events', { name: 'price_click', locale: 'en', props: { price_shown: '$7' } });
assert.equal(res.status, 200, 'price click not recorded');

res = await post('/api/events', { name: 'waitlist_signup', locale: 'en' });
assert.equal(res.status, 400, 'waitlist_signup must not be acceptable from the browser');

res = await post('/api/events', { name: 'whatever', locale: 'en' });
assert.equal(res.status, 400, 'unknown events must be rejected');

// One address cannot hammer the endpoint.
const flood = [];
for (let i = 0; i < 8; i++) flood.push(await post('/api/waitlist', { email: `flood-${i}-${Date.now()}@example.com` }, '10.9.9.9'));
assert.ok(flood.some((r) => r.status === 429), 'the rate limiter never fired');

console.log('ok: waitlist normalises and dedupes, invalid addresses rejected, events locked down');
