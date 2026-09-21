import type { CSSProperties, ReactNode } from 'react';

/** A5 at 4 px/mm, as drawn in the design export. */
export const PAGE_W = 592;
export const PAGE_H = 840;

export const DISPLAY = "Oswald, 'Arial Narrow', sans-serif";
export const DISPLAY_JP = "Oswald, 'Noto Sans JP', 'Arial Narrow', sans-serif";
export const TEXT = "'PT Serif', Georgia, serif";

export const label: CSSProperties = {
  fontFamily: DISPLAY, fontWeight: 500, fontSize: 10, letterSpacing: '0.08em',
  textTransform: 'uppercase', lineHeight: 1.2,
};

export function Page({
  bg, fg, children, style,
}: { bg: string; fg: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="zine-page" style={{
      width: PAGE_W, height: PAGE_H, boxSizing: 'border-box',
      padding: '32px 32px 32px 40px', background: bg, color: fg,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', ...style,
    }}>
      {children}
    </div>
  );
}

/** Theme-styled tag chip (solid / underline / outline). */
export function Tag({
  t, children, style,
}: {
  t: { tagBg: string; tagFg: string; tagB: string; tagS: string };
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{
      ...label, display: 'inline-flex', alignSelf: 'flex-start',
      lineHeight: 1, padding: '4px 7px',
      background: t.tagBg, color: t.tagFg,
      border: `2px solid ${t.tagB}`,
      borderTopColor: t.tagS, borderLeftColor: t.tagS, borderRightColor: t.tagS,
      ...style,
    }}>
      {children}
    </div>
  );
}

/** "Inside" contents list used by all three covers. */
export function Contents({
  t, title, items, font,
}: {
  t: { ink: string; primary: string };
  title: string;
  items: { title: string; page: string }[];
  font: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ ...label, fontFamily: font, color: t.ink, paddingBottom: 6 }}>{title}</div>
      {items.map((it) => (
        <div key={it.title} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          borderTop: `1px solid ${t.ink}`, padding: '5px 0',
        }}>
          <span style={{ fontFamily: TEXT, fontSize: 13, lineHeight: 1.3 }}>{it.title}</span>
          <span style={{ fontFamily: font, fontWeight: 600, fontSize: 13, color: t.primary }}>{it.page}</span>
        </div>
      ))}
    </div>
  );
}

export function Qr({ path, ink, border }: { path: string; ink: string; border: string }) {
  return (
    <div style={{ padding: 6, background: '#FFFFFF', border: `1px solid ${border}` }}>
      <svg viewBox="0 0 21 21" width={60} height={60} style={{ display: 'block' }} shapeRendering="crispEdges">
        <path d={path} fill={ink} />
      </svg>
    </div>
  );
}
