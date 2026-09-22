import { NextResponse } from 'next/server';
import { recordEvent, type EventName } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

const ALLOWED: EventName[] = ['page_view', 'sample_download', 'print_photo_submitted', 'price_click'];

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
  if (!rateLimit(`events:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: { name?: string; locale?: string; props?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  // waitlist_signup is recorded by the waitlist route itself, so it cannot be
  // faked from the browser and inflate the launch count.
  if (!ALLOWED.includes(body.name as EventName)) {
    return NextResponse.json({ error: 'unknown_event' }, { status: 400 });
  }

  await recordEvent(body.name as EventName, body.locale === 'uk' ? 'uk' : 'en', body.props ?? {});
  return NextResponse.json({ status: 'ok' });
}
