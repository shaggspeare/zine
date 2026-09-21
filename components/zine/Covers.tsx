import type { Theme } from '@/lib/themes';
import type { CoverCopy } from '@/lib/copy';
import { Contents, DISPLAY, DISPLAY_JP, Page, TEXT, Tag, label } from './primitives';

/** Product name placeholder, as in the design export. */
export const MASTHEAD = '[NAME]';

export interface Issue {
  photoDuo: string;
  photoBw: string;
  objectPosition: string;
  /** Tokyo issue needs a CJK fallback in the display font stack. */
  jp?: boolean;
}

export const ISSUE_LISBON: Issue = {
  photoDuo: '/assets/lisbon-alfama-dome-duotone.jpg',
  photoBw: '/assets/lisbon-alfama-dome-bw.jpg',
  objectPosition: 'center 25%',
};

export const ISSUE_TOKYO: Issue = {
  photoDuo: '/assets/tokyo-alley-duotone.jpg',
  photoBw: '/assets/tokyo-alley-bw.jpg',
  objectPosition: 'center 40%',
  jp: true,
};

type CoverProps = { t: Theme; l: CoverCopy; issue: Issue };

const font = (issue: Issue) => (issue.jp ? DISPLAY_JP : DISPLAY);

export function CoverA({ t, l, issue }: CoverProps) {
  const d = font(issue);
  return (
    <Page bg={t.paper} fg={t.ink} style={{ gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
        <div style={{ fontFamily: d, fontWeight: 700, fontSize: 28, lineHeight: 1, letterSpacing: '0.02em', color: t.primary }}>{MASTHEAD}</div>
        <div style={{ ...label, fontFamily: d, color: t.muted, textAlign: 'right', maxWidth: 300 }}>{l.issue}</div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', background: t.photoA, height: 500, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.photoDuo ? issue.photoDuo : issue.photoBw}
          alt=""
          style={{
            position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: issue.objectPosition,
            filter: `contrast(${t.photoContrast})`,
          }}
        />
        {t.echoBar ? (
          <div style={{ position: 'absolute', right: 14, top: 14, bottom: 14, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: d, fontWeight: 600, fontSize: 22, letterSpacing: '0.12em', color: t.paper, writingMode: 'vertical-rl' }}>{l.echo}</div>
          </div>
        ) : (
          <div style={{ position: 'absolute', right: 14, top: 14, display: 'flex' }}>
            <Tag t={t} style={{ fontFamily: d, fontSize: 13, padding: '6px 10px' }}>{l.echo}</Tag>
          </div>
        )}
        <div style={{
          position: 'absolute', left: 14, bottom: 10, fontFamily: d, fontWeight: 700,
          fontSize: l.hA, lineHeight: 0.9, letterSpacing: '0.01em', color: t.paper,
        }}>{l.city}</div>
      </div>

      <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 22, lineHeight: 1.3, maxWidth: 440 }}>{l.deck}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginTop: 'auto' }}>
        <div style={{ width: 300 }}><Contents t={t} title={l.inside} items={l.items} font={d} /></div>
        <div style={{ width: 150, textAlign: 'right' }}>
          <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 12, lineHeight: 1.4, color: t.muted }}>{l.dedication}</div>
        </div>
      </div>
    </Page>
  );
}

export function CoverB({ t, l, issue }: CoverProps) {
  const d = font(issue);
  return (
    <Page bg={t.paper} fg={t.ink} style={{ flexDirection: 'row', gap: 24 }}>
      <div style={{ width: 184, height: 776, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{
          fontFamily: d, fontWeight: 700, fontSize: 232, lineHeight: 0.8, letterSpacing: '0.01em',
          color: t.primary, writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap',
        }}>{MASTHEAD}</div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ ...label, fontFamily: d, color: t.muted, maxWidth: 250, lineHeight: 1.5 }}>{l.issue}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: d, fontWeight: 700, fontSize: l.hB, lineHeight: 0.9, color: t.ink }}>{l.city}</div>
            <Tag t={t} style={{ fontFamily: d, fontSize: 13, padding: '6px 10px' }}>{l.echo}</Tag>
          </div>
          <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 22, lineHeight: 1.3, maxWidth: 300 }}>{l.deck}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Contents t={t} title={l.inside} items={l.items} font={d} />
          <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 12, lineHeight: 1.4, color: t.muted }}>{l.dedication}</div>
        </div>
      </div>
    </Page>
  );
}

function Motif({ t }: { t: Theme }) {
  const abs = (style: React.CSSProperties) => ({ position: 'absolute' as const, ...style });
  if (t.isBand) {
    return (
      <>
        <div style={abs({ left: 0, top: 0, width: 520, height: 96, background: t.primary })} />
        <div style={abs({ left: 0, top: 96, width: 520, height: 18, background: t.accent })} />
        <div style={abs({ left: 0, top: 114, width: 520, height: 62, background: t.accent2 })} />
        <div style={abs({ left: 0, top: 176, width: 520, height: 96, background: t.primary })} />
        <div style={abs({ left: 0, top: 272, width: 520, height: 18, background: t.accent })} />
        <div style={abs({ left: 0, top: 290, width: 520, height: 80, background: t.primary })} />
        <div style={abs({ left: 300, top: 0, width: 8, height: 370, background: t.paper })} />
        <div style={abs({ left: 380, top: 0, width: 8, height: 370, background: t.paper })} />
      </>
    );
  }
  if (t.isRect) {
    return (
      <>
        <div style={abs({ left: 0, top: 0, width: 520, height: 370, background: t.primary })} />
        <div style={abs({ left: 280, top: 150, width: 240, height: 220, background: t.accent })} />
        <div style={abs({ left: 40, top: 40, width: 130, height: 130, border: `6px solid ${t.paper}`, boxSizing: 'border-box' })} />
      </>
    );
  }
  if (t.isCircle) {
    return (
      <>
        <div style={abs({ left: 0, top: 0, width: 520, height: 370, background: t.accent2 })} />
        <div style={abs({ left: 150, top: 20, width: 330, height: 330, borderRadius: '50%', background: t.accent })} />
        <div style={abs({ left: 20, top: 110, width: 230, height: 230, borderRadius: '50%', background: t.primary })} />
      </>
    );
  }
  return (
    <>
      <div style={abs({ left: 60, top: 60, width: 400, height: 290, background: t.accent })} />
      <div style={abs({ left: 30, top: 30, width: 400, height: 290, background: t.primary })} />
      <div style={abs({ left: 0, top: 340, width: 520, height: 30, background: t.accent2 })} />
    </>
  );
}

export function CoverC({ t, l, issue }: CoverProps) {
  const d = font(issue);
  return (
    <Page bg={t.paper} fg={t.ink} style={{ gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
        <div style={{ fontFamily: d, fontWeight: 700, fontSize: 28, lineHeight: 1, letterSpacing: '0.02em', color: t.primary }}>{MASTHEAD}</div>
        <div style={{ ...label, fontFamily: d, color: t.muted, textAlign: 'right', maxWidth: 300 }}>{l.issue}</div>
      </div>

      <div style={{ position: 'relative', width: 520, height: 370, flexShrink: 0, overflow: 'hidden' }}>
        <Motif t={t} />
      </div>

      <div style={{ fontFamily: d, fontWeight: 700, fontSize: l.hC, lineHeight: 0.85, letterSpacing: '0.01em', color: t.primary, marginTop: 2 }}>{l.city}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
        <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 20, lineHeight: 1.3, maxWidth: 340 }}>{l.deck}</div>
        <Tag t={t} style={{ fontFamily: d, fontSize: 13, padding: '6px 10px' }}>{l.echo}</Tag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginTop: 'auto' }}>
        <div style={{ width: 300 }}><Contents t={t} title={l.inside} items={l.items} font={d} /></div>
        <div style={{ width: 150, textAlign: 'right' }}>
          <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 12, lineHeight: 1.4, color: t.muted }}>{l.dedication}</div>
        </div>
      </div>
    </Page>
  );
}
