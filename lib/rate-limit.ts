// ponytail: in-process token bucket, so each server instance counts separately and
// it resets on deploy. Enough to stop a bored person with curl, which is the whole
// threat model for a waitlist. Move to Postgres or Upstash when there is more than
// one instance and abuse actually happens.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
    }
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}
