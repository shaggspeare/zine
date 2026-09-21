// The layout engine's invariants. A booklet that is not a multiple of four cannot
// be folded, and a photo without its credit is a licensing problem, so both are
// asserted here rather than discovered on paper.
//   pnpm layout:check
import assert from 'node:assert/strict';
import { layout, entitlements, chunk, PLACES_PER_PAGE } from '../lib/layout';
import type { BookletContent, IssueId, Tier } from '../lib/layout';
import { sampleContent } from '../lib/content';
import { THEME_IDS, LANGS, type Lang } from '../lib/themes';

const themes = THEME_IDS;
const langs = LANGS;
const tiers: Tier[] = ['free', 'paid'];
const issues: IssueId[] = ['lisbon', 'tokyo'];

/** Sample content stretched to n days and m places, to exercise the page budget. */
const grown = (lang: Lang, days: number, places: number): BookletContent => {
  const base = sampleContent('lisbon', lang);
  return {
    ...base,
    days: Array.from({ length: days }, (_, i) => ({ ...base.days[0], num: String(i + 1).padStart(2, '0') })),
    places: {
      ...base.places,
      places: Array.from({ length: places }, (_, i) => ({
        ...base.places.places[i % base.places.places.length],
        n: String(i + 1).padStart(2, '0'),
      })),
    },
  };
};

let cases = 0;
for (const theme of themes) {
  for (const lang of langs) {
    for (const tier of tiers) {
      for (const issue of issues) {
        for (const days of [1, 2, 3, 5]) {
          for (const places of [1, 3, 4, 9, 12]) {
            const opts = { theme, lang, tier };
            const content = { ...grown(lang, days, places), issue };
            const { pages } = layout(content, opts);
            const where = `${issue}/${theme}/${lang}/${tier} ${days}d ${places}p`;

            assert.equal(pages.length % 4, 0, `${where}: ${pages.length} pages, must fold in fours`);
            assert.ok(pages.length <= entitlements(tier).maxPages, `${where}: over the page budget`);
            assert.ok(pages.length >= 4, `${where}: too few pages`);

            // The cover opens the booklet and the colophon is the back cover.
            const colophon = pages.at(-1)!;
            assert.equal(pages[0].spreadType, 'cover', `${where}: does not open on the cover`);
            assert.equal(colophon.spreadType, 'colophon', `${where}: does not end on the colophon`);
            if (colophon.spreadType !== 'colophon') throw new Error('unreachable');

            // Page 1 is a right-hand page; sides alternate from there.
            pages.forEach((p, i) => {
              assert.equal(p.index, i, `${where}: page ${i} is indexed ${p.index}`);
              assert.equal(p.side, i % 2 === 0 ? 'right' : 'left', `${where}: page ${i} on the wrong side`);
            });

            // Notes pad the booklet up, and never more than three of them.
            const notes = pages.filter((p) => p.spreadType === 'notes').length;
            assert.ok(notes <= 3, `${where}: ${notes} notes pages, at most 3 may be padding`);

            // Every photo placed is credited, with the page the reader finds it on.
            for (const c of colophon.credits) {
              assert.ok(c.author && c.license && c.source, `${where}: incomplete credit`);
              assert.ok(c.page >= 1 && c.page <= pages.length, `${where}: credit points at page ${c.page}`);
            }
            assert.ok(colophon.credits.length > 0, `${where}: photos placed but nothing credited`);

            // Determinism: same input, same pages (spec section 7.6).
            assert.deepEqual(layout(content, opts).pages, pages, `${where}: layout is not deterministic`);
            cases++;
          }
        }
      }
    }
  }
}

// Places fill pages before a new one is started.
assert.deepEqual(chunk([1, 2, 3, 4], 3), [[1, 2, 3], [4]]);
assert.deepEqual(chunk([], PLACES_PER_PAGE), []);

// A trip too long for the free tier is cut down, not printed over budget.
const big = layout({ ...grown('en', 5, 12), issue: 'lisbon' }, { theme: 'lisbon', lang: 'en', tier: 'free' });
assert.ok(big.pages.length <= 8, 'free tier must cap at 8 pages');
assert.ok(big.dropped.length > 0, 'cutting pages must be reported, not silent');
assert.ok(big.pages.some((p) => p.spreadType === 'places'), 'a guide must keep at least one places page');

console.log(`ok: ${cases} layouts fold in fours, stay in budget and credit every photo`);
