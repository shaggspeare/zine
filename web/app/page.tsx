'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BOARDS, GROUPS } from '@/lib/boards';
import { LANGS, THEMES, THEME_IDS, type Lang } from '@/lib/themes';
import styles from './gallery.module.css';

const LANG_NAMES: Record<Lang, string> = { en: 'English', uk: 'Українська' };

export default function Gallery() {
  const [slug, setSlug] = useState(BOARDS[0].slug);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang | null>(null);
  const [zoom, setZoom] = useState(0.75);

  const board = BOARDS.find((b) => b.slug === slug)!;
  const t = themeId ?? board.defaults.theme;
  const l = lang ?? board.defaults.lang;

  const pick = (next: string) => { setSlug(next); setThemeId(null); setLang(null); };

  return (
    <div className={styles.shell}>
      <aside className={styles.aside}>
        <div>
          <h1 className={styles.h1}>Travel Zine Generator</h1>
          <p className={styles.sub}>
            Covers and inner pages for a printable A5 city booklet. Lisbon and Tokyo issues;
            four themes; English and Ukrainian.
          </p>
        </div>

        <div className={styles.ctl}>
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={t} onChange={(e) => setThemeId(e.target.value)}>
            {THEME_IDS.map((id) => <option key={id} value={id}>{THEMES[id].name}</option>)}
          </select>

          <label htmlFor="lang">Language</label>
          <select id="lang" value={l} onChange={(e) => setLang(e.target.value as Lang)}>
            {LANGS.map((id) => <option key={id} value={id}>{LANG_NAMES[id]}</option>)}
          </select>

          <label htmlFor="zoom">Zoom</label>
          <select id="zoom" value={zoom} onChange={(e) => setZoom(Number(e.target.value))}>
            {[1, 0.75, 0.5].map((z) => <option key={z} value={z}>{Math.round(z * 100)}%</option>)}
          </select>
        </div>

        <nav>
          {GROUPS.map((g) => (
            <div key={g.group} className={styles.grp}>
              <h2>{g.group}</h2>
              {g.boards.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => pick(b.slug)}
                  aria-current={b.slug === slug ? 'page' : undefined}
                >
                  {b.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.bar}>
          <span className={styles.title}>{board.title}</span>
          <span>
            <Link href={`/p/${board.slug}?theme=${t}&lang=${l}`}>Open page on its own</Link>
            {' · '}
            <Link href={`/booklet?theme=${t}&lang=${l}`}>Whole booklet</Link>
          </span>
        </div>
        <div className={styles.stage}>
          <div className={styles.frame} style={{ zoom }}>
            {board.render(t, l)}
          </div>
        </div>
      </main>
    </div>
  );
}
