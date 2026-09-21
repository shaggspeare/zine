// The layout engine. Pure and deterministic: the same content and options always
// produce the same pages, byte for byte (spec section 7.6). It decides what goes on
// every page; the renderer only draws what it is told.

import type { CoverCopy, DayCopy, PlacesCopy, PlaceItem } from './copy';
import { creditFor } from './credits';
import type { Lang, ThemeId } from './themes';

export type SpreadType = 'cover' | 'day' | 'places' | 'notes' | 'colophon';

export type PageSpec =
  | { index: number; side: Side; spreadType: 'cover'; variantId: 'cover.a' | 'cover.b' | 'cover.c'; copy: CoverCopy; issue: IssueId }
  | { index: number; side: Side; spreadType: 'day'; variantId: 'day.3stops'; copy: DayCopy }
  | { index: number; side: Side; spreadType: 'places'; variantId: 'places.light' | 'places.inverted'; copy: PlacesCopy }
  | { index: number; side: Side; spreadType: 'notes'; variantId: 'notes.lined' }
  | { index: number; side: Side; spreadType: 'colophon'; variantId: 'colophon.credits'; credits: CreditLine[] };

export type Side = 'left' | 'right';
export type IssueId = 'lisbon' | 'tokyo';
export type Tier = 'free' | 'paid';

export interface CreditLine {
  author: string;
  license: string;
  source: string;
  page: number;
}

export interface BookletContent {
  issue: IssueId;
  cover: CoverCopy;
  coverVariant: 'a' | 'b' | 'c';
  days: DayCopy[];
  places: PlacesCopy;
  /** Alternate light and inverted places pages, as the sample booklet does. */
  placesInverted: boolean;
}

export interface LayoutOptions {
  theme: ThemeId;
  lang: Lang;
  tier: Tier;
}

/** Spec section 13.1. The free tier still prints at full quality, just shorter. */
export const entitlements = (tier: Tier) =>
  tier === 'free' ? { maxPages: 8, branding: true } : { maxPages: 20, branding: false };

/** Places per page in the variants we have drawn. */
export const PLACES_PER_PAGE = 3;
const MAX_NOTES = 3;

export const chunk = <T,>(items: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

/** Page 1 is a right-hand page, as in any bound booklet. */
const sideOf = (index: number): Side => (index % 2 === 0 ? 'right' : 'left');

type Draft =
  | { spreadType: 'cover'; variantId: 'cover.a' | 'cover.b' | 'cover.c'; copy: CoverCopy; issue: IssueId }
  | { spreadType: 'day'; variantId: 'day.3stops'; copy: DayCopy }
  | { spreadType: 'places'; variantId: 'places.light' | 'places.inverted'; copy: PlacesCopy }
  | { spreadType: 'notes'; variantId: 'notes.lined' }
  | { spreadType: 'colophon'; variantId: 'colophon.credits'; credits: CreditLine[] };

export interface LayoutResult {
  pages: PageSpec[];
  /** What had to give way to fit the page budget, for the editor to show. */
  dropped: { spreadType: SpreadType; reason: 'pageBudget' }[];
}

export function layout(content: BookletContent, options: LayoutOptions): LayoutResult {
  const { maxPages } = entitlements(options.tier);
  const dropped: LayoutResult['dropped'] = [];

  // 1. Skeleton in reading order: cover, days, places, back cover.
  const cover: Draft = {
    spreadType: 'cover',
    variantId: `cover.${content.coverVariant}` as 'cover.a',
    copy: content.cover,
    issue: content.issue,
  };
  const days: Draft[] = content.days.map((copy) => ({ spreadType: 'day', variantId: 'day.3stops', copy }));

  const placesPages: Draft[] = chunk(content.places.places, PLACES_PER_PAGE).map((places, i) => ({
    spreadType: 'places',
    variantId: content.placesInverted && i % 2 === 1 ? 'places.inverted' : 'places.light',
    copy: { ...content.places, places },
  }));

  // 2. Cut to the page budget before padding. Days are the plan, so places go first,
  // but one places page always survives: a guide with no addresses is not a guide.
  let body = [...days, ...placesPages];
  const fits = (n: number) => 1 + n + 1 <= maxPages; // cover + body + colophon
  while (!fits(body.length) && body.filter((p) => p.spreadType === 'places').length > 1) {
    const last = body.map((p) => p.spreadType).lastIndexOf('places');
    body.splice(last, 1);
    dropped.push({ spreadType: 'places', reason: 'pageBudget' });
  }
  while (!fits(body.length) && body.filter((p) => p.spreadType === 'day').length > 1) {
    body.pop();
    dropped.push({ spreadType: 'day', reason: 'pageBudget' });
  }

  // 3. A booklet is folded sheets, so the page count must be a multiple of four.
  //    Notes pages are the padding; they sit before the back cover.
  let notes = (4 - ((1 + body.length + 1) % 4)) % 4;
  while (notes > MAX_NOTES || 1 + body.length + notes + 1 > maxPages) {
    // No room to pad up: drop a page and try the next multiple down.
    const last = body.map((p) => p.spreadType).lastIndexOf('places');
    const cut = last === -1 ? body.length - 1 : last;
    if (cut < 0) break;
    dropped.push({ spreadType: body[cut].spreadType, reason: 'pageBudget' });
    body = body.filter((_, i) => i !== cut);
    notes = (4 - ((1 + body.length + 1) % 4)) % 4;
  }

  const drafts: Draft[] = [
    cover,
    ...body,
    ...Array.from({ length: notes }, (): Draft => ({ spreadType: 'notes', variantId: 'notes.lined' })),
    { spreadType: 'colophon', variantId: 'colophon.credits', credits: [] },
  ];

  // 4. Credits are collected from the photos actually placed, with the page the
  //    reader will find them on (spec section 8.5).
  const credits: CreditLine[] = [];
  const seen = new Set<string>();
  drafts.forEach((d, i) => {
    for (const src of photosOf(d)) {
      const credit = creditFor(src);
      if (!credit || seen.has(credit.author)) continue;
      seen.add(credit.author);
      credits.push({ ...credit, page: i + 1 });
    }
  });

  const pages = drafts.map((d, index): PageSpec => {
    const base = { index, side: sideOf(index) };
    return d.spreadType === 'colophon'
      ? { ...base, ...d, credits }
      : ({ ...base, ...d } as PageSpec);
  });

  return { pages, dropped };
}

/** Photo sources a drafted page will place. Cover photos depend on the issue. */
function photosOf(d: Draft): string[] {
  if (d.spreadType === 'cover') {
    return d.variantId === 'cover.a'
      ? [d.issue === 'tokyo' ? '/assets/tokyo-alley-bw.jpg' : '/assets/lisbon-alfama-dome-bw.jpg']
      : [];
  }
  if (d.spreadType === 'places') {
    return d.copy.places.flatMap((p: PlaceItem) => (p.bw ? [p.bw] : []));
  }
  return [];
}
