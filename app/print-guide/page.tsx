import { theme, type Lang, type ThemeId } from '@/lib/themes';
import { THEMES } from '@/lib/themes';
import { DISPLAY, Page, TEXT, label } from '@/components/zine/primitives';
import { MASTHEAD } from '@/components/zine/Covers';

const COPY = {
  en: {
    title: 'How to print this',
    deck: 'Four steps, one stapler.',
    steps: [
      ['Print double-sided', 'Flip on the short edge. Choose “Actual size” or 100% scale, never “Fit to page”, and turn off headers and footers.'],
      ['Test sheet 1 first', 'Print only the first sheet and check that the back lines up the right way up before printing the rest.'],
      ['Stack and fold', 'Keep the sheets in the order they came out, stack them, then fold the pile in half along the centre.'],
      ['Staple twice', 'Staple on the fold, a third of the way in from each end. Three sheets hold fine without staples.'],
    ],
    tip: 'Paper of 100–120 gsm makes it feel like a magazine. Plain 80 gsm works, but the photos show through.',
    fold: 'Fold here',
    sheet: 'A4 sheet, landscape',
  },
  uk: {
    title: 'Як це надрукувати',
    deck: 'Чотири кроки й степлер.',
    steps: [
      ['Друкуйте двобічно', 'Перевертання по короткому краю. Оберіть «Фактичний розмір» або 100%, а не «Вмістити на сторінку», і вимкніть колонтитули.'],
      ['Спершу перевірте аркуш 1', 'Надрукуйте лише перший аркуш і перевірте, чи зворот став правильним боком, перш ніж друкувати решту.'],
      ['Складіть стос', 'Збережіть порядок аркушів, складіть їх у стос і зігніть навпіл по центру.'],
      ['Два скоби', 'Зшийте по згину, відступивши з обох боків приблизно на третину. Три аркуші тримаються й без скоб.'],
    ],
    tip: 'Папір 100–120 г/м² дає відчуття журналу. Звичайний 80 г/м² теж годиться, але фото просвічують.',
    fold: 'Згин',
    sheet: 'Аркуш A4, альбомна',
  },
} as const;

/** Sheet with a fold line and two A5 halves, the shape the imposed PDF prints. */
function FoldDiagram({ t, folds }: { t: ReturnType<typeof theme>; folds: string }) {
  return (
    <svg viewBox="0 0 520 190" width="100%" style={{ display: 'block' }}>
      <rect x="10" y="10" width="500" height="150" fill={t.accent2} stroke={t.ink} strokeWidth="2" />
      <line x1="260" y1="10" x2="260" y2="160" stroke={t.ink} strokeWidth="1.5" strokeDasharray="6 5" />
      <rect x="40" y="38" width="180" height="94" fill={t.primary} />
      <rect x="300" y="38" width="180" height="94" fill={t.paper} stroke={t.muted} strokeWidth="1.5" />
      <text x="330" y="92" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="28" fill={t.primary}>1</text>
      <text x="196" y="92" textAnchor="end" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="28" fill={t.paper}>4</text>
      <path d="M260 168 L260 182" stroke={t.accent} strokeWidth="2" />
      <text x="268" y="182" fontFamily="Oswald, sans-serif" fontWeight="500" fontSize="12" letterSpacing="1" fill={t.ink}>{folds.toUpperCase()}</text>
      {[64, 106].map((y) => (
        <g key={y}>
          <rect x="255" y={y} width="10" height="3" fill={t.ink} />
        </g>
      ))}
    </svg>
  );
}

export default async function PrintGuide({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; lang?: string }>;
}) {
  const q = await searchParams;
  const t = theme(q.theme && q.theme in THEMES ? (q.theme as ThemeId) : 'lisbon');
  const lang: Lang = q.lang === 'uk' ? 'uk' : 'en';
  const l = COPY[lang];

  return (
    <Page bg={t.paper} fg={t.ink} style={{ gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${t.ink}`, paddingBottom: 6 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: t.primary }}>{MASTHEAD}</div>
        <div style={{ ...label, color: t.muted }}>{l.sheet}</div>
      </div>

      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, lineHeight: 0.95, textTransform: 'uppercase', color: t.primary }}>{l.title}</div>
      <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 18, lineHeight: 1.3 }}>{l.deck}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        {l.steps.map(([head, body], i) => (
          <div key={head} style={{ display: 'flex', gap: 14, borderTop: `2px solid ${t.ink}`, paddingTop: 8 }}>
            <div style={{ width: 46, flexShrink: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 0.8, color: t.accent }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, lineHeight: 1.05, textTransform: 'uppercase' }}>{head}</div>
              <div style={{ fontFamily: TEXT, fontSize: 12, lineHeight: '16px', textWrap: 'pretty' }}>{body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <FoldDiagram t={t} folds={l.fold} />
        <div style={{ fontFamily: TEXT, fontStyle: 'italic', fontSize: 11.5, lineHeight: 1.4, color: t.muted }}>{l.tip}</div>
      </div>
    </Page>
  );
}
