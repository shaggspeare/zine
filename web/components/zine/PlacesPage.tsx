import type { Theme } from '@/lib/themes';
import { invertTheme } from '@/lib/themes';
import type { PlacesCopy } from '@/lib/copy';
import { QR_PLACE } from '@/lib/qr';
import { DISPLAY, Page, Qr, TEXT, Tag, label } from './primitives';
import { MASTHEAD } from './Covers';

export function PlacesPage({ t: base, l, inverted = false }: { t: Theme; l: PlacesCopy; inverted?: boolean }) {
  const t = invertTheme(base, inverted);
  return (
    <Page bg={t.bg} fg={t.fg} style={{ gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 6 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: t.pageFg }}>{MASTHEAD}</div>
        <div style={{ ...label, color: t.fg }}>{l.section}</div>
        <div style={{ ...label, color: t.muted, fontStyle: 'italic' }}>{l.echo}</div>
      </div>

      {l.places.map((p) => (
        <div key={p.n} style={{ display: 'flex', gap: 14, borderTop: `2px solid ${t.rule}`, paddingTop: 10, height: 214, boxSizing: 'border-box' }}>
          <div style={{ width: 92, flexShrink: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 92, lineHeight: 0.8, color: t.numeral }}>{p.n}</div>

          <div style={{ width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Tag t={t}>{p.cat}</Tag>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, lineHeight: 1.05, textTransform: 'uppercase' }}>{p.name}</div>
            <div style={{ fontFamily: TEXT, fontSize: 11, lineHeight: 1.35, color: t.muted }}>{p.addr}</div>
            {p.hasHours && (
              <div style={{ ...label, color: t.fg, letterSpacing: '0.05em' }}>{l.hours} · {p.hours}</div>
            )}
            <div style={{ fontFamily: TEXT, fontSize: 11.5, lineHeight: '15px', textWrap: 'pretty', marginTop: 2 }}>{p.blurb}</div>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', minWidth: 0 }}>
            {p.hasPhoto ? (
              <div style={{ position: 'relative', width: '100%', height: 100, overflow: 'hidden', background: t.photoA, border: `1px solid ${t.rule}`, boxSizing: 'border-box' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(t.photoDuo ? p.duo : p.bw) ?? ''}
                  alt=""
                  style={{
                    position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center 45%', filter: `contrast(${t.photoContrast})`,
                  }}
                />
              </div>
            ) : (
              // Typographic fallback when a place has no photo.
              <div style={{ position: 'relative', width: '100%', height: 100, background: t.accent, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 88, lineHeight: 0.8, color: t.ink, padding: '0 0 6px 8px' }}>{p.n}</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
              <Qr path={QR_PLACE} ink="#111111" border={t.rule} />
              <div style={{ ...label, color: t.fg }}>{l.dir}</div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, lineHeight: 1, color: t.pageFg }}>{l.page}</div>
      </div>
    </Page>
  );
}
