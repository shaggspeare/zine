import { COVER_LISBON, COVER_TOKYO, DAY_ALFAMA, PLACES_LISBON } from './copy';
import { theme, type Lang } from './themes';
import { CoverA, CoverB, CoverC, ISSUE_LISBON, ISSUE_TOKYO } from '@/components/zine/Covers';
import { DayPage } from '@/components/zine/DayPage';
import { PlacesPage } from '@/components/zine/PlacesPage';

export interface Board {
  slug: string;
  title: string;
  group: string;
  defaults: { theme: string; lang: Lang };
  render: (themeId: string, lang: Lang) => React.ReactNode;
}

const cover = (
  slug: string, title: string, group: string, defaultTheme: string,
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
];

export const boardBySlug = (slug: string) => BOARDS.find((b) => b.slug === slug);

export const GROUPS = BOARDS.reduce<{ group: string; boards: Board[] }[]>((acc, b) => {
  const g = acc.find((x) => x.group === b.group);
  if (g) g.boards.push(b);
  else acc.push({ group: b.group, boards: [b] });
  return acc;
}, []);

/** Reading order of the Lisbon sample booklet. */
export const BOOKLET = ['cover-a-lisbon', 'day-alfama', 'places-light', 'places-inverted'];
