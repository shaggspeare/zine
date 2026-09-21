// Gates every theme has to pass (spec section 6.4). A theme that fails these still
// looks fine on screen and then falls apart on paper: unreadable on a home printer,
// or a grey mush once someone prints it in black and white.

import { THEMES, type Theme, type ThemeId } from './themes';

export interface Finding {
  gate: 'contrast' | 'grayscale' | 'fontCoverage';
  level: 'fail' | 'warn';
  message: string;
}

const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = [0, 1, 2].map((i) => {
    const c = channel(hex, i);
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * CIE L*, the perceptual lightness a black-and-white printer reduces the page to.
 * Two colours with similar L* print as the same grey, however different they look.
 */
export function lightness(hex: string): number {
  const y = luminance(hex);
  return 116 * (y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116) - 16;
}

const AA_BODY = 4.5;
const AA_DISPLAY = 3;
const GRAY_GAP = 20;

export function checkTheme(t: Theme): Finding[] {
  const findings: Finding[] = [];
  const fail = (gate: Finding['gate'], message: string) => findings.push({ gate, level: 'fail', message });
  const warn = (gate: Finding['gate'], message: string) => findings.push({ gate, level: 'warn', message });

  const ratio = (a: string, b: string) => contrast(a, b).toFixed(2);

  // Body text has to be readable on both the light page and the inverted one.
  if (contrast(t.ink, t.paper) < AA_BODY) fail('contrast', `body ink on paper is ${ratio(t.ink, t.paper)}:1, needs ${AA_BODY}`);
  if (contrast(t.paper, t.dark) < AA_BODY) fail('contrast', `body on the dark page is ${ratio(t.paper, t.dark)}:1, needs ${AA_BODY}`);
  if (contrast(t.muted, t.paper) < AA_BODY) warn('contrast', `secondary text on paper is ${ratio(t.muted, t.paper)}:1, under ${AA_BODY}`);
  if (contrast(t.darkMuted, t.dark) < AA_BODY) warn('contrast', `secondary text on the dark page is ${ratio(t.darkMuted, t.dark)}:1, under ${AA_BODY}`);

  // Headlines are large, so the display threshold applies.
  if (contrast(t.primary, t.paper) < AA_DISPLAY) fail('contrast', `display type on paper is ${ratio(t.primary, t.paper)}:1, needs ${AA_DISPLAY}`);

  // Tags are small caps on a solid field: body threshold.
  if (t.tagBg !== 'transparent' && contrast(t.tagFg, t.tagBg) < AA_BODY) {
    fail('contrast', `tag text on its own field is ${ratio(t.tagFg, t.tagBg)}:1, needs ${AA_BODY}`);
  }

  // Black and white printing collapses the palette to lightness alone.
  const grays: [string, string][] = [['primary', t.primary], ['accent', t.accent], ['paper', t.paper]];
  for (let i = 0; i < grays.length; i++) {
    for (let j = i + 1; j < grays.length; j++) {
      const gap = Math.abs(lightness(grays[i][1]) - lightness(grays[j][1]));
      if (gap < GRAY_GAP) {
        fail('grayscale', `${grays[i][0]} and ${grays[j][0]} are ${gap.toFixed(1)} L* apart, needs ${GRAY_GAP} to survive black-and-white printing`);
      }
    }
  }

  return findings;
}

export const checkAllThemes = (): Record<ThemeId, Finding[]> =>
  Object.fromEntries(
    (Object.keys(THEMES) as ThemeId[]).map((id) => [id, checkTheme(THEMES[id])]),
  ) as Record<ThemeId, Finding[]>;

/**
 * Ukrainian needs і ї є ґ and the apostrophe U+2019 on top of the basic Cyrillic
 * block; a font missing them renders tofu in half the booklet.
 * ponytail: checks the @font-face unicode-ranges, which is what the browser routes
 * on. Swap in fontkit if a font ever comes from outside Fontsource.
 */
export function checkFontCoverage(fontsCss: string): Finding[] {
  const required: [string, number][] = [
    ['і', 0x0456], ['ї', 0x0457], ['є', 0x0454], ['ґ', 0x0491], ['’', 0x2019],
  ];
  const families = [...fontsCss.matchAll(/font-family:'([^']+)'/g)].map((m) => m[1]);
  const ranges = [...fontsCss.matchAll(/unicode-range:([^;}]+)/g)].flatMap((m) =>
    m[1].split(',').map((part) => {
      const [from, to] = part.trim().replace(/^U\+/i, '').split('-');
      const lo = parseInt(from, 16);
      return [lo, to ? parseInt(to, 16) : lo] as [number, number];
    }),
  );

  const findings: Finding[] = [];
  for (const [glyph, code] of required) {
    if (!ranges.some(([lo, hi]) => code >= lo && code <= hi)) {
      findings.push({ gate: 'fontCoverage', level: 'fail', message: `no font covers ${glyph} (U+${code.toString(16).toUpperCase()})` });
    }
  }
  if (new Set(families).size < 2) {
    findings.push({ gate: 'fontCoverage', level: 'warn', message: `expected a display and a text family, found ${[...new Set(families)].join(', ') || 'none'}` });
  }
  return findings;
}
