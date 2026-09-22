import { NextResponse } from 'next/server';
import { db, recordEvent } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

/** Deliberately loose: rejecting valid addresses costs more than a stray row. */
const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
  if (!rateLimit(`waitlist:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: { email?: string; locale?: string; source?: string; utm?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const locale = body.locale === 'uk' ? 'uk' : 'en';
  if (!looksLikeEmail(email) || email.length > 320) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const { error } = await db().from('waitlist').insert({
    email,
    locale,
    source: body.source ?? null,
    utm: body.utm ?? {},
  });

  // Unique violation: already signed up, which is a success from their side.
  if (error?.code === '23505') return NextResponse.json({ status: 'duplicate' });
  if (error) {
    console.error('waitlist insert failed:', error.message);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  await recordEvent('waitlist_signup', locale, { source: body.source ?? null, ...body.utm });
  return NextResponse.json({ status: 'ok' });
}
