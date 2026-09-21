import type { Theme } from '@/lib/themes';
import type { DayCopy } from '@/lib/copy';
import { QR_DAY } from '@/lib/qr';
import { DISPLAY, Page, Qr, TEXT, Tag, label } from './primitives';
import { MASTHEAD } from './Covers';

/** Placeholder day map: illustrative geometry, tinted from the theme. */
function DayMap({ t }: { t: Theme }) {
  return (
    <svg viewBox="0 0 163 360" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <rect x="0" y="0" width="163" height="360" fill={t.mapBg} />
      <path d="M0 268 C 40 250, 80 282, 163 258 L163 360 L0 360 Z" fill={t.primary} fillOpacity="0.28" />
      <path d="M96 40 L150 30 L156 96 L110 104 Z" fill={t.park} fillOpacity={t.parkOp} />
      <path d="M14 196 L62 188 L70 226 L20 236 Z" fill={t.park} fillOpacity={t.parkOp} />
      <path d="M0 60 L60 84 L104 150 L163 168" fill="none" stroke={t.paper} strokeWidth="5" />
      <path d="M40 0 L52 110 L46 250" fill="none" stroke={t.paper} strokeWidth="4" />
      <path d="M0 140 L90 120 L163 124" fill="none" stroke={t.paper} strokeWidth="3" />
      <path d="M120 0 L104 150 L128 240" fill="none" stroke={t.paper} strokeWidth="3" />
      <path d="M112 62 L84 120 L64 172 L92 214" fill="none" stroke={t.ink} strokeWidth="1.6" strokeDasharray="4 3" />
      {[
        { cx: 112, cy: 62, n: '04' },
        { cx: 64, cy: 172, n: '05' },
        { cx: 92, cy: 214, n: '06' },
      ].map((p) => (
        <g key={p.n}>
          <circle cx={p.cx} cy={p.cy} r="12" fill={t.accent} stroke={t.ink} strokeWidth="1.6" />
          <text x={p.cx} y={p.cy + 4.5} textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="12" fill={t.ink}>{p.n}</text>
        </g>
      ))}
      <text x="148" y="20" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="12" fill={t.ink}>N</text>
      <path d="M148 24 L148 36" stroke={t.ink} strokeWidth="1.6" />
      <path d="M10 344 L58 344" stroke={t.ink} strokeWidth="2" />
      <text x="10" y="336" fontFamily="Oswald, sans-serif" fontWeight="500" fontSize="9" fill={t.ink}>200 m</text>
    </svg>
  );
}

export function DayPage({ t, l }: { t: Theme; l: DayCopy }) {
  return (
    <Page bg={t.paper} fg={t.ink} style={{ gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${t.ink}`, paddingBottom: 6 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: t.primary }}>{MASTHEAD}</div>
        <div style={{ ...label, color: t.ink }}>{l.section}</div>
        <div style={{ ...label, color: t.muted }}>{l.date}</div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 108, lineHeight: 0.78, color: t.primary }}>{l.num}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 2, minWidth: 0 }}>
          <div style={{ ...label, color: t.muted, fontStyle: 'italic' }}>{l.echo}</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, lineHeight: 1, textTransform: 'uppercase', color: t.ink }}>{l.title}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexGrow: 1, minHeight: 0 }}>
        <div style={{ width: 341, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: TEXT, fontSize: 12.5, lineHeight: '16.5px', textWrap: 'pretty' }}>{l.intro}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {l.stops.map((s) => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: `2px solid ${t.ink}`, paddingTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag t={t}>{s.slot}</Tag>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, lineHeight: 1, color: t.primary }}>{s.n}</div>
                </div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, lineHeight: 1.05, textTransform: 'uppercase' }}>{s.name}</div>
                <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 11, lineHeight: 1.3, color: t.muted }}>{s.meta}</div>
                <div style={{ fontFamily: TEXT, fontSize: 11.5, lineHeight: '14.5px', textWrap: 'pretty' }}>{s.blurb}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
          <div style={{ flexGrow: 1, minHeight: 0, border: `1px solid ${t.ink}`, overflow: 'hidden' }}>
            <DayMap t={t} />
          </div>
          <div style={{ fontFamily: TEXT, fontSize: 9.2, lineHeight: 1.2, color: t.muted }}>{l.credit}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
            <Qr path={QR_DAY} ink={t.ink} border={t.ink} />
            <div style={{ ...label, color: t.ink }}>{l.walk}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: `2px solid ${t.ink}`, paddingTop: 6 }}>
        <div style={{ ...label, color: t.ink, paddingBottom: 2 }}>{l.notes}</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: 27, borderBottom: `1px solid ${t.muted}` }} />
        ))}
      </div>
    </Page>
  );
}
