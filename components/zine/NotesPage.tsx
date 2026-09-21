import type { Theme } from '@/lib/themes';
import type { Lang } from '@/lib/themes';
import { DISPLAY, Page, label } from './primitives';
import { MASTHEAD } from './Covers';

const COPY = {
  en: { title: 'Notes', hint: 'What you changed, what you skipped, what to tell people about.' },
  uk: { title: 'Нотатки', hint: 'Що змінили, що пропустили, про що варто розповісти.' },
} as const;

/** Lined page. Also the padding that brings the booklet to a multiple of four. */
export function NotesPage({ t, lang, echo }: { t: Theme; lang: Lang; echo: string }) {
  const l = COPY[lang];
  // 7 mm ruling at 4 px/mm, as in the design tokens.
  const lines = 24;
  return (
    <Page bg={t.paper} fg={t.ink} style={{ gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${t.ink}`, paddingBottom: 6 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: t.primary }}>{MASTHEAD}</div>
        <div style={{ ...label, color: t.ink }}>{l.title}</div>
        <div style={{ ...label, color: t.muted, fontStyle: 'italic' }}>{echo}</div>
      </div>

      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 0.9, textTransform: 'uppercase', color: t.primary }}>{l.title}</div>
      <div style={{ ...label, color: t.muted, fontStyle: 'italic', letterSpacing: '0.04em' }}>{l.hint}</div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 4 }}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} style={{ height: 28, borderBottom: `1px solid ${t.muted}` }} />
        ))}
      </div>
    </Page>
  );
}
