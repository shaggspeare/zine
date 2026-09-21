import type { Lang, Theme } from '@/lib/themes';
import { MAP_ATTRIBUTION, type Credit } from '@/lib/credits';
import { DISPLAY, Page, TEXT, label } from './primitives';
import { MASTHEAD } from './Covers';

const COPY = {
  en: {
    title: 'Colophon',
    photos: 'Photographs',
    maps: 'Maps',
    about: 'About this booklet',
    body: 'Printed at home on A4 and folded to A5. The hours in brackets and the issue line are placeholders, not verified facts: check before you go. The QR codes are decorative in this sample.',
    made: `Made with ${MASTHEAD}`,
    page: 'p.',
  },
  uk: {
    title: 'Вихідні дані',
    photos: 'Світлини',
    maps: 'Карти',
    about: 'Про цей буклет',
    body: 'Надруковано вдома на A4 і складено до A5. Години в дужках і рядок випуску — це заповнювачі, а не перевірені дані: перевірте перед виходом. QR-коди в цьому зразку декоративні.',
    made: `Зроблено з ${MASTHEAD}`,
    page: 'с.',
  },
} as const;

export interface CreditLine extends Credit {
  /** 1-based page the photo appears on, as the reader counts them. */
  page: number;
}

export function ColophonPage({
  t, lang, echo, credits, branding = true,
}: {
  t: Theme;
  lang: Lang;
  echo: string;
  credits: CreditLine[];
  /** Free tier keeps the back-cover line; a paid unlock removes it. */
  branding?: boolean;
}) {
  const l = COPY[lang];
  return (
    <Page bg={t.paper} fg={t.ink} style={{ gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${t.ink}`, paddingBottom: 6 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: t.primary }}>{MASTHEAD}</div>
        <div style={{ ...label, color: t.muted, fontStyle: 'italic' }}>{echo}</div>
      </div>

      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 0.9, textTransform: 'uppercase', color: t.primary }}>{l.title}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: `2px solid ${t.ink}`, paddingTop: 8 }}>
        <div style={{ ...label, color: t.ink }}>{l.photos}</div>
        {credits.map((c) => (
          <div key={`${c.author}-${c.page}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: TEXT, fontSize: 11.5, lineHeight: 1.4 }}>
              {c.author} · {c.license} · {c.source}
            </span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12, color: t.primary, whiteSpace: 'nowrap' }}>
              {l.page} {String(c.page).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: `2px solid ${t.ink}`, paddingTop: 8 }}>
        <div style={{ ...label, color: t.ink }}>{l.maps}</div>
        <div style={{ fontFamily: TEXT, fontSize: 11.5, lineHeight: 1.4 }}>{MAP_ATTRIBUTION}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: `2px solid ${t.ink}`, paddingTop: 8 }}>
        <div style={{ ...label, color: t.ink }}>{l.about}</div>
        <div style={{ fontFamily: TEXT, fontSize: 11.5, lineHeight: '15px', textWrap: 'pretty' }}>{l.body}</div>
      </div>

      {branding && (
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ ...label, color: t.muted, letterSpacing: '0.12em' }}>{l.made}</div>
        </div>
      )}
    </Page>
  );
}
