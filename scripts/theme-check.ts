// Runs the theme gates over every theme and the bundled fonts. Pure, so it needs
// nothing running: pnpm theme:check
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkAllThemes, checkFontCoverage, checkTheme, contrast, lightness } from '../lib/theme-gates';
import { THEMES, type ThemeId } from '../lib/themes';

// Known values, and a theme that must be rejected: a gate that cannot fail is not
// a gate, and every theme passing is only good news if failing is possible.
assert.equal(contrast('#000000', '#FFFFFF').toFixed(2), '21.00');
assert.equal(Math.round(lightness('#FFFFFF')), 100);
assert.equal(Math.round(lightness('#000000')), 0);

const unprintable = {
  ...THEMES.lisbon,
  ink: '#9A9A9A', // too pale to read on paper
  primary: '#F0A93C', // same lightness as the accent: one grey once printed
  accent: '#F2A33A',
  tagBg: '#F2A33A',
  tagFg: '#F5B15A',
};
const caught = checkTheme(unprintable).filter((f) => f.level === 'fail').map((f) => f.gate);
assert.ok(caught.includes('contrast'), 'the contrast gate missed unreadable body text');
assert.ok(caught.includes('grayscale'), 'the grayscale gate missed two colours that print as one');
assert.deepEqual(checkFontCoverage('@font-face{font-family:\'X\';unicode-range:U+0000-00FF}')
  .filter((f) => f.level === 'fail').length > 0, true, 'the font gate missed missing Cyrillic');

const fontsCss = readFileSync(new URL('../public/fonts/fonts.css', import.meta.url), 'utf8');

const results = checkAllThemes();
const fontFindings = checkFontCoverage(fontsCss);

let failed = 0;
for (const [id, findings] of Object.entries(results) as [ThemeId, ReturnType<typeof checkAllThemes>[ThemeId]][]) {
  const t = THEMES[id];
  const summary = [
    `ink/paper ${contrast(t.ink, t.paper).toFixed(1)}:1`,
    `paper/dark ${contrast(t.paper, t.dark).toFixed(1)}:1`,
    `L* primary ${lightness(t.primary).toFixed(0)}, accent ${lightness(t.accent).toFixed(0)}, paper ${lightness(t.paper).toFixed(0)}`,
  ].join(' · ');
  console.log(`${findings.some((f) => f.level === 'fail') ? 'FAIL' : ' ok '} ${t.name.padEnd(10)} ${summary}`);
  for (const f of findings) {
    console.log(`       ${f.level === 'fail' ? '✗' : '!'} ${f.gate}: ${f.message}`);
    if (f.level === 'fail') failed++;
  }
}

console.log(`${fontFindings.some((f) => f.level === 'fail') ? 'FAIL' : ' ok '} fonts      Latin + Cyrillic coverage for uk`);
for (const f of fontFindings) {
  console.log(`       ${f.level === 'fail' ? '✗' : '!'} ${f.gate}: ${f.message}`);
  if (f.level === 'fail') failed++;
}

if (failed) {
  console.error(`\n${failed} gate failure${failed === 1 ? '' : 's'}: these themes do not print safely`);
  process.exit(1);
}
console.log('\nok: every theme passes contrast, grayscale and font coverage');
