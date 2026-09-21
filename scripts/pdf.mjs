// Render the booklet to PDF: an A5 reading file, imposed A4 and Letter sheets for
// duplex home printing, and the print guide. Needs a running server:
//   pnpm build && pnpm start -p 3111 &
//   node scripts/pdf.mjs [--base http://localhost:3111] [--theme lisbon] [--lang en]
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const base = arg('base', 'http://localhost:3111');
const themeId = arg('theme', 'lisbon');
const lang = arg('lang', 'en');
const outDir = new URL('../out/', import.meta.url);

// PDF points; A5 is exactly half of A4.
const MM = 72 / 25.4;
const A5 = { w: 148 * MM, h: 210 * MM };
const A4_LANDSCAPE = { w: 297 * MM, h: 210 * MM };
const LETTER_LANDSCAPE = { w: 11 * 72, h: 8.5 * 72 };
const FOLD_MARK = 3 * MM;
// Home ink is the reader's cost, so warn past 60% coverage (spec section 6.4).
const INK_BUDGET = 0.6;

/** Print one app route to PDF, at the page size its own CSS asks for. */
async function renderRoute(page, path) {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  await page.evaluate(() =>
    Promise.all([
      document.fonts.ready,
      ...[...document.images].map((img) => img.decode().catch(() => {})),
    ]),
  );
  return page.pdf({ preferCSSPageSize: true, printBackground: true });
}

/**
 * Ink coverage per page, measured on the rendered page rather than estimated from
 * the theme: a page that is 60% solid colour costs real money on a home printer
 * (spec section 6.4). Chromium does the pixel work, so this needs no image library.
 */
async function inkCoverage(page) {
  const shots = await page.locator('.zine-page').all();
  const coverage = [];
  for (const el of shots) {
    // Screenshot the page as it really renders, photos and all, then let the
    // browser decode it: no image library needed on this side.
    const png = (await el.screenshot()).toString('base64');
    coverage.push(await page.evaluate(async (b64) => {
      const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const canvas = new OffscreenCanvas(120, Math.round((120 * bitmap.height) / bitmap.width));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let ink = 0;
      for (let i = 0; i < data.length; i += 4) {
        // How far each pixel sits from blank paper, averaged over the page.
        ink += 1 - (data[i] + data[i + 1] + data[i + 2]) / 765;
      }
      return ink / (data.length / 4);
    }, png));
  }
  return coverage;
}

/**
 * Saddle-stitch imposition: two A5 pages per sheet side, folded in the middle and
 * stapled on the fold. Pages are 1-indexed here, as in the spec.
 */
function sheetOrder(n) {
  const sheets = [];
  for (let s = 0; s < n / 4; s++) {
    sheets.push([n - 2 * s, 1 + 2 * s]); // front: left, right
    sheets.push([2 + 2 * s, n - 1 - 2 * s]); // back
  }
  return sheets;
}

async function impose(readingBytes, sheet, label) {
  const src = await PDFDocument.load(readingBytes);
  const count = src.getPageCount();
  // The booklet must fold: pad with blanks to the next multiple of 4.
  const n = Math.ceil(count / 4) * 4;
  if (n !== count) console.warn(`! ${label}: ${count} pages padded to ${n} with blanks`);

  const out = await PDFDocument.create();
  const embedded = await out.embedPdf(readingBytes, [...Array(count).keys()]);

  // Measure the rendered page rather than assuming A5, so a wrong page size shows
  // up as a warning instead of as silently distorted art.
  const src0 = embedded[0];
  if (Math.abs(src0.width - A5.w) > 1 || Math.abs(src0.height - A5.h) > 1) {
    console.warn(`! ${label}: pages are ${src0.width.toFixed(1)} x ${src0.height.toFixed(1)} pt, expected A5 ${A5.w.toFixed(1)} x ${A5.h.toFixed(1)}`);
  }
  const scale = Math.min(sheet.w / 2 / src0.width, sheet.h / src0.height);
  const w = src0.width * scale;
  const h = src0.height * scale;
  const padX = (sheet.w - w * 2) / 2;
  const padY = (sheet.h - h) / 2;

  for (const [left, right] of sheetOrder(n)) {
    const side = out.addPage([sheet.w, sheet.h]);
    [left, right].forEach((pageNo, i) => {
      const embed = embedded[pageNo - 1];
      if (!embed) return; // padding blank
      side.drawPage(embed, { x: padX + i * w, y: padY, width: w, height: h });
    });
    // Fold marks at the centre, top and bottom, outside the page area.
    const cx = sheet.w / 2;
    for (const [y1, y2] of [[0, FOLD_MARK], [sheet.h - FOLD_MARK, sheet.h]]) {
      side.drawLine({ start: { x: cx, y: y1 }, end: { x: cx, y: y2 }, thickness: 0.25 });
    }
  }
  return out.save();
}

const browser = await chromium.launch();
const page = await browser.newPage();
await mkdir(outDir, { recursive: true });

const q = `?theme=${themeId}&lang=${lang}`;
const name = `${themeId}-${lang}`;
const write = async (suffix, bytes) => {
  await writeFile(new URL(`${name}-${suffix}.pdf`, outDir), bytes);
  console.log(`  out/${name}-${suffix}.pdf  ${(bytes.length / 1024).toFixed(0)} kB`);
};

console.log(`rendering ${base}/booklet${q}`);
const reading = await renderRoute(page, `/booklet${q}`);
await write('reading', reading);

// Ink budget: a warning, not a gate. It costs the reader money, not legibility.
const coverage = await inkCoverage(page);
coverage.forEach((c, i) => {
  if (c > INK_BUDGET) console.warn(`! page ${i + 1} is ${(c * 100).toFixed(0)}% ink, over the ${INK_BUDGET * 100}% budget`);
});
console.log(`  ink: ${coverage.map((c) => `${(c * 100).toFixed(0)}%`).join(' ')}`);

await write('print-A4', await impose(reading, A4_LANDSCAPE, 'A4'));
await write('print-Letter', await impose(reading, LETTER_LANDSCAPE, 'Letter'));
await write('print-guide', await renderRoute(page, `/print-guide${q}`));

await browser.close();
