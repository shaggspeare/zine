'use client';

import { useState, type ReactNode } from 'react';
import type { Lang } from '@/lib/themes';
import type { MarketingCopy } from '@/lib/marketing-copy';
import styles from './landing.module.css';

/** UTM tags travel with the sign-up: paid traffic is excluded from the launch count. */
function utmFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 120);
  }
  if (document.referrer) utm.referrer = document.referrer.slice(0, 200);
  return utm;
}

const track = (name: string, lang: Lang, props: Record<string, unknown>) =>
  navigator.sendBeacon?.('/api/events', new Blob([JSON.stringify({ name, locale: lang, props })], { type: 'application/json' }));

export function WaitlistForm({ lang, copy }: { lang: Lang; copy: MarketingCopy['hero'] }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'duplicate' | 'invalid' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale: lang, source: 'landing', utm: utmFromUrl() }),
      });
      const data = await res.json();
      if (res.ok) setState(data.status === 'duplicate' ? 'duplicate' : 'ok');
      else setState(res.status === 400 ? 'invalid' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'ok' || state === 'duplicate') {
    return <p className={styles.thanks} role="status">{state === 'ok' ? copy.thanks : copy.duplicate}</p>;
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.srOnly} htmlFor="email">{copy.placeholder}</label>
      <input
        id="email"
        type="email"
        required
        value={email}
        placeholder={copy.placeholder}
        onChange={(e) => { setEmail(e.target.value); if (state !== 'idle') setState('idle'); }}
      />
      <button type="submit" disabled={state === 'sending'}>{copy.cta}</button>
      <p className={styles.note} role={state === 'invalid' || state === 'error' ? 'alert' : undefined}>
        {state === 'invalid' ? copy.invalid : state === 'error' ? copy.error : copy.note}
      </p>
    </form>
  );
}

/** Fake door: records that the price was right, then says plainly that it is not live. */
export function PriceButton({ lang, copy, price }: { lang: Lang; copy: MarketingCopy['price']; price: string }) {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <button
        className={styles.button}
        onClick={() => { track('price_click', lang, { price_shown: price }); setClicked(true); }}
      >
        {copy.cta}
      </button>
      <p className={styles.note} role={clicked ? 'status' : undefined}>
        {clicked ? copy.reserved : copy.honest}
      </p>
    </>
  );
}

export function TrackedDownload({
  href, sampleId, file, lang, children,
}: {
  href: string; sampleId: string; file: 'reading' | 'print'; lang: Lang; children: ReactNode;
}) {
  return (
    <a href={href} download onClick={() => track('sample_download', lang, { sample_id: sampleId, file })}>
      {children}
    </a>
  );
}
