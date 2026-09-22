import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Locale lives in the URL (/en, /uk). Ukrainian speakers land on /uk
 * (spec section 12.1).
 */
export default async function Root() {
  const accept = (await headers()).get('accept-language') ?? '';
  redirect(/\buk\b/i.test(accept.split(',')[0] ?? '') ? '/uk' : '/en');
}
