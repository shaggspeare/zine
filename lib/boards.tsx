import { COVER_LISBON, COVER_TOKYO, DAY_ALFAMA, PLACES_LISBON } from './copy';
import { theme, type Lang, type ThemeId } from './themes';
import { CoverA, CoverB, CoverC, ISSUE_LISBON, ISSUE_TOKYO } from '@/components/zine/Covers';
import { ColophonPage } from '@/components/zine/ColophonPage';
import { DayPage } from '@/components/zine/DayPage';
import { NotesPage } from '@/components/zine/NotesPage';
import { PlacesPage } from '@/components/zine/PlacesPage';
import { sampleContent } from './content';
import { layout } from './layout';

export interface Board {
  slug: string;
  title: string;
  group: string;
  defaults: { theme: ThemeId; lang: Lang };
  render: (themeId: ThemeId, lang: Lang) => React.ReactNode;
}

const cover = (
  slug: string, title: string, group: string, defaultTheme: ThemeId,
  Component: typeof CoverA, copy: typeof COVER_LISBON, issue: typeof ISSUE_LISBON,
): Board => ({
  slug, title, group,
  defaults: { theme: defaultTheme, lang: 'en' },
  render: (themeId, lang) => <Component t={theme(themeId)} l={copy[lang]} issue={issue} />,
});

export const BOARDS: Board[] = [
  cover('cover-a-lisbon', 'Cover A, photo-led · Lisbon', 'Covers, Lisbon issue', 'lisbon', CoverA, COVER_LISBON, ISSUE_LISBON),
  cover('cover-b-lisbon', 'Cover B, type-led · Lisbon', 'Covers, Lisbon issue', 'lisbon', CoverB, COVER_LISBON, ISSUE_LISBON),
  cover('cover-c-lisbon', 'Cover C, motif-led · Lisbon', 'Covers, Lisbon issue', 'lisbon', CoverC, COVER_LISBON, ISSUE_LISBON),
  cover('cover-a-tokyo', 'Cover A, photo-led · Tokyo', 'Covers, Tokyo issue', 'tokyo', CoverA, COVER_TOKYO, ISSUE_TOKYO),
  cover('cover-b-tokyo', 'Cover B, type-led · Tokyo', 'Covers, Tokyo issue', 'tokyo', CoverB, COVER_TOKYO, ISSUE_TOKYO),
  cover('cover-c-tokyo', 'Cover C, motif-led · Tokyo', 'Covers, Tokyo issue', 'tokyo', CoverC, COVER_TOKYO, ISSUE_TOKYO),
  {
    slug: 'day-alfama', title: 'Day 02, Alfama · Lisbon', group: 'Inner pages, Lisbon',
    defaults: { theme: 'lisbon', lang: 'en' },
    render: (themeId, lang) => <DayPage t={theme(themeId)} l={DAY_ALFAMA[lang]} />,
  },
  {
    slug: 'places-light', title: 'Places, light · Lisbon', group: 'Inner pages, Lisbon',
    defaults: { theme: 'lisbon', lang: 'en' },
    render: (themeId, lang) => <PlacesPage t={theme(themeId)} l={PLACES_LISBON[lang]} />,
  },
  {
    slug: 'places-inverted', title: 'Places, inverted · Lisbon', group: 'Inner pages, Lisbon',
    defaults: { theme: 'lisbon', lang: 'en' },
    render: (themeId, lang) => <PlacesPage t={theme(themeId)} l={PLACES_LISBON[lang]} inverted />,
  },
  {
    slug: 'notes', title: 'Notes', group: 'Back matter',
    defaults: { theme: 'lisbon', lang: 'en' },
    render: (themeId, lang) => <NotesPage t={theme(themeId)} lang={lang} echo={theme(themeId).echoLabel} />,
  },
  {
    slug: 'colophon', title: 'Colophon', group: 'Back matter',
    defaults: { theme: 'lisbon', lang: 'en' },
    render: (themeId, lang) => {
      const t = theme(themeId);
      const { pages } = layout(sampleContent('lisbon', lang), { theme: themeId, lang, tier: 'paid' });
      const colophon = pages.find((p) => p.spreadType === 'colophon');
      return (
        <ColophonPage
          t={t}
          lang={lang}
          echo={t.echoLabel}
          credits={colophon?.spreadType === 'colophon' ? colophon.credits : []}
        />
      );
    },
  },
];

export const boardBySlug = (slug: string) => BOARDS.find((b) => b.slug === slug);

export const GROUPS = BOARDS.reduce<{ group: string; boards: Board[] }[]>((acc, b) => {
  const g = acc.find((x) => x.group === b.group);
  if (g) g.boards.push(b);
  else acc.push({ group: b.group, boards: [b] });
  return acc;
}, []);
