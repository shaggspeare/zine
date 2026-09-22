import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Service role: it bypasses row level security, so it stays on the server. The
// landing page has no logged-in users, and every write is validated in the route.
export const db = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set; see .env.example');
  return createClient(url, key, { auth: { persistSession: false } });
};

export type EventName =
  | 'page_view'
  | 'waitlist_signup'
  | 'sample_download'
  | 'print_photo_submitted'
  | 'price_click';

/** Analytics we own, so the launch decision does not depend on a third party. */
export async function recordEvent(name: EventName, locale: string | null, props: Record<string, unknown> = {}) {
  const { error } = await db().from('events').insert({ name, locale, props });
  // An analytics write must never break the page it is measuring.
  if (error) console.error(`event ${name} not recorded:`, error.message);
}
