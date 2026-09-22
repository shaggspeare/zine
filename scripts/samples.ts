// Renders the landing page's sample booklets into public/samples, by running the
// real PDF pipeline once per sample. The samples are the product, not mockups, so
// they are generated rather than kept by hand:
//   pnpm build && pnpm start -p 3111 &
//   pnpm samples
import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { SAMPLES } from '../lib/samples';

const base = process.argv[2] ?? 'http://localhost:3111';

for (const s of SAMPLES) {
  console.log(`\n${s.id}: ${s.issue} issue, ${s.theme} theme, ${s.lang}`);
  execFileSync(
    'node',
    ['scripts/pdf.mjs', '--base', base, '--theme', s.theme, '--lang', s.lang,
      '--issue', s.issue, '--dir', 'public/samples', '--name', s.id],
    { stdio: 'inherit' },
  );
  // The pipeline always writes all four files; only the two the page links are
  // worth carrying in the repo. Letter and the guide are a `pnpm pdf` away.
  for (const extra of ['print-Letter', 'print-guide']) {
    rmSync(new URL(`../public/samples/${s.id}-${extra}.pdf`, import.meta.url), { force: true });
  }
}

console.log(`\nok: ${SAMPLES.length} samples in public/samples`);
