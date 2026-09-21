// Checks on the generated files themselves: a booklet that folds wrong cannot be
// hot-fixed once it is on someone's table. Run after `pnpm pdf`:
//   node scripts/pdf-check.mjs [out/lisbon-en]
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';

const stem = process.argv[2] ?? 'out/lisbon-en';
const MM = 72 / 25.4;
const near = (a, b, tol = 1) => Math.abs(a - b) <= tol;

const load = async (suffix) => PDFDocument.load(await readFile(`${stem}-${suffix}.pdf`));
const sizes = (doc) => doc.getPages().map((p) => p.getSize());

const reading = await load('reading');
const a4 = await load('print-A4');
const letter = await load('print-Letter');
const guide = await load('print-guide');

const n = reading.getPageCount();
assert.equal(n % 4, 0, `reading PDF has ${n} pages, must be a multiple of 4 to fold`);

for (const { width, height } of sizes(reading)) {
  assert.ok(near(width, 148 * MM) && near(height, 210 * MM),
    `reading page is ${width.toFixed(1)} x ${height.toFixed(1)} pt, expected A5`);
}

assert.equal(a4.getPageCount(), n / 2, 'A4 sheets should be two booklet pages per side');
for (const { width, height } of sizes(a4)) {
  assert.ok(near(width, 297 * MM) && near(height, 210 * MM),
    `A4 sheet is ${width.toFixed(1)} x ${height.toFixed(1)} pt, expected A4 landscape`);
}

assert.equal(letter.getPageCount(), n / 2, 'Letter sheets should be two booklet pages per side');
for (const { width, height } of sizes(letter)) {
  assert.ok(near(width, 792) && near(height, 612),
    `Letter sheet is ${width.toFixed(1)} x ${height.toFixed(1)} pt, expected Letter landscape`);
}

assert.equal(guide.getPageCount(), 1, `print guide should be one page, got ${guide.getPageCount()}`);

// Chromium embeds and subsets the fonts; without them the booklet reflows on
// another machine.
const fonts = await readFile(`${stem}-reading.pdf`).then((b) => {
  const raw = b.toString('latin1');
  return ['Oswald', 'PTSerif'].filter((f) => raw.includes(f));
});
assert.deepEqual(fonts, ['Oswald', 'PTSerif'], `fonts missing from the reading PDF: found ${fonts}`);

const mb = (await readFile(`${stem}-print-A4.pdf`)).length / 1024 / 1024;
assert.ok(mb < 20, `A4 PDF is ${mb.toFixed(1)} MB, over the 20 MB budget`);

console.log(`ok: ${n}-page booklet, ${a4.getPageCount()} sheets, A5 exact, fonts embedded, ${mb.toFixed(1)} MB`);
