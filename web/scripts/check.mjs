// Port check: every board must render the same text and the same colours as the
// original design export in ../pages. Run a server first:
//   pnpm build && pnpm start -p 3111 &
//   node scripts/check.mjs http://localhost:3111
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:3111';
const boards = [
  ['cover-a-lisbon', 'CoverA-Lisbon'], ['cover-b-lisbon', 'CoverB-Lisbon'], ['cover-c-lisbon', 'CoverC-Lisbon'],
  ['cover-a-tokyo', 'CoverA-Tokyo'], ['cover-b-tokyo', 'CoverB-Tokyo'], ['cover-c-tokyo', 'CoverC-Tokyo'],
  ['day-alfama', 'DayPage-Alfama'], ['places-light', 'Places-Light'], ['places-inverted', 'Places-Inverted'],
];
const themes = ['lisbon', 'krakow', 'tokyo', 'barcelona'];
const langs = ['en', 'uk'];

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'", '#39': "'", nbsp: ' ' };
const text = (html) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x27|#39|amp|lt|gt|quot|nbsp);/g, (_, e) => entities[e])
    .replace(/\s+/g, ' ')
    .trim();

// Colours actually painted, so a wrong token shows up even when the copy matches.
const colors = (html) => [...new Set(html.match(/#[0-9A-Fa-f]{6}/g) ?? [])].sort().join(' ');

let checked = 0;
for (const [slug, file] of boards) {
  for (const theme of themes) {
    for (const lang of langs) {
      const expected = readFileSync(new URL(`../../pages/${file}__${theme}__${lang}.html`, import.meta.url), 'utf8');
      const got = await fetch(`${base}/p/${slug}?theme=${theme}&lang=${lang}`).then((r) => r.text());
      const where = `${slug} ${theme} ${lang}`;
      assert.equal(text(got.split('<body>')[1]), text(expected.split('<body>')[1]), `text differs: ${where}`);
      assert.equal(colors(got.split('<body>')[1]), colors(expected.split('<body>')[1]), `colours differ: ${where}`);
      checked++;
    }
  }
}
console.log(`ok: ${checked} board renders match the design export`);
