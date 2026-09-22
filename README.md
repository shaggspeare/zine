# Travel Zine

A printable A5 city-trip booklet (148 × 210 mm) rendered in the browser: four themes,
English and Ukrainian, Lisbon and Tokyo sample issues. Next.js App Router, Postgres
via Supabase for the waitlist. No AI yet — the renderer and the landing page first,
per phases 1 and 2 of the implementation spec.

```
pnpm install
supabase start    # local Postgres for the waitlist; needs Docker
cp .env.example .env.local   # fill from `supabase status`
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

## Routes

| Route | What |
| --- | --- |
| `/` → `/en`, `/uk` | Landing page and waitlist |
| `/gallery` | Board gallery: theme / language / zoom controls |
| `/p/<slug>?theme=&lang=` | One board on its own, print-ready |
| `/booklet?theme=&lang=` | Lisbon sample in reading order, one A5 page per sheet |
| `/print-guide?theme=&lang=` | One page: printer settings, fold and staple |

Slugs: `cover-a-lisbon`, `cover-b-lisbon`, `cover-c-lisbon`, `cover-a-tokyo`,
`cover-b-tokyo`, `cover-c-tokyo`, `day-alfama`, `places-light`, `places-inverted`,
`notes`, `colophon`.

Themes: `lisbon`, `krakow`, `tokyo`, `barcelona`. Languages: `en`, `uk`.
`/booklet` also takes `issue=lisbon|tokyo` and `tier=free|paid`.

## How it fits together

Layout never changes between themes; only the tokens do. Every board is one React
component that reads theme tokens and copy, so any board renders in any theme and
either language — pages are derived from data, never edited directly (spec §2.3).

- `lib/themes.ts` — the four themes, plus the derivation for inverted (dark) pages.
- `lib/copy.ts` — booklet copy in EN and UK, extracted verbatim from the design export.
- `lib/layout.ts` — the layout engine (below).
- `lib/content.ts` — the sample booklet's content, standing in for the wizard's output.
- `lib/credits.ts` — photo licensing, keyed by asset.
- `lib/boards.tsx` — board registry used by the gallery and the single-board route.
- `components/zine/` — `primitives.tsx` (A5 shell, tag, contents list, QR), the variants, and `renderPage.tsx`, which maps a `PageSpec` to its variant.
- `public/assets`, `public/fonts` — photos and Oswald / PT Serif (SIL OFL), bundled so it works offline.

## Layout engine

`layout(content, { theme, lang, tier })` in `lib/layout.ts` is pure and deterministic:
the same content always gives the same pages. It builds the skeleton (cover → days →
places → back cover), paginates places three to a page, cuts to the tier's page budget
(free 8, paid 20) reporting every cut in `dropped`, then pads with notes pages so the
count is a multiple of four — a booklet is folded sheets, so nothing else folds. The
colophon's photo credits are collected from the photos actually placed, with the page
number the reader will find them on, because attribution is a legal requirement and
never hidden in any tier (spec §8.5).

The renderer never decides layout; it draws the `PageSpec` it is handed.

Pages are drawn at 4 px per mm (592 × 840 px). Printing applies `@page 148mm 210mm`
and `zoom: .9449`, so an A5 page comes out at true size.

## PDF export

Headless Chromium prints the same routes the browser shows, so the preview is the
print output, and pdf-lib imposes the A5 pages onto sheets in saddle-stitch order:
fold the stack in half, staple on the fold, and the pages read 1, 2, 3, 4.

```
pnpm build && pnpm start -p 3111 &
pnpm pdf                     # --theme krakow --lang uk --base http://host
pnpm pdf:check
```

Writes to `out/` (gitignored):

| File | What |
| --- | --- |
| `<theme>-<lang>-reading.pdf` | A5 pages in order, for screen and phone |
| `<theme>-<lang>-print-A4.pdf` | Imposed A4 sheets, duplex, flip on short edge |
| `<theme>-<lang>-print-Letter.pdf` | The same, scaled to half-Letter |
| `<theme>-<lang>-print-guide.pdf` | One page: printer settings, fold and staple |

`pnpm pdf:check` asserts what a reprint cannot fix: page count a multiple of 4, exact
A5 and A4 page boxes, one sheet per two booklet pages, fonts embedded, under 20 MB.

## Checks

```
pnpm theme:check    # every theme prints legibly, in colour and in black and white
pnpm layout:check   # 640 layouts fold in fours, stay in budget, credit every photo
pnpm check          # 9 boards x 4 themes x 2 languages match the design export
pnpm pdf:check      # the generated PDFs are printable and fold correctly
pnpm api:check      # the waitlist records, dedupes and rejects properly
```

`theme:check` and `layout:check` are pure and need nothing running.

## Theme gates

`lib/theme-gates.ts` holds the rules a theme has to pass before it can ship (spec
§6.4), because a theme that fails them looks fine on screen and then falls apart on
paper:

- **Contrast** — WCAG AA 4.5:1 for body text on the paper and on the dark page, 3:1
  for display type, 4.5:1 for tag text on its own field.
- **Grayscale** — primary, accent and paper must sit at least 20 L\* apart, so the
  booklet still reads when someone prints it in black and white.
- **Font coverage** — the bundled fonts must cover і ї є ґ and the apostrophe U+2019,
  or half the Ukrainian booklet renders as tofu.
- **Ink budget** — `pnpm pdf` measures real coverage per rendered page and warns past
  60%; it is the reader's money, not their legibility, so it warns rather than fails.

All four themes pass. The gates are self-tested against a deliberately unprintable
theme, so "everything passes" means the gates can still fail.

Known: the inverted places page runs about 72% ink, over the budget. It is not in the
sample booklet, but a layout that uses it should expect the warning.

`scripts/check.mjs` renders every board variant and asserts the text and the set of
colours match `design/pages/*.html` exactly. Both checks need a running server.

## Landing page and waitlist

`/` redirects to `/en` or `/uk` by `Accept-Language`; the locale lives in the URL
(spec §12.1). The page carries the seven sections the spec asks for, including the
fake-door price, which records the click and then says plainly that nothing is live.

The three samples are rendered by the real renderer, so they cannot drift from the
product: the covers on the page are the actual components, and `pnpm samples`
regenerates the downloadable PDFs in `public/samples` through the PDF pipeline.

Sign-ups and events go to Postgres via Supabase (`supabase/migrations`). The launch
gate is 200 organic sign-ups in four weeks, so `source` and `utm` are stored on the
row — paid traffic has to be separable later. `waitlist_signup` is recorded by the
server, never accepted from the browser, so the count cannot be inflated.

Not wired up yet: double opt-in email (the `confirmed_at` column is waiting for it),
PostHog, and the MapLibre/PMTiles maps, which the sample pages stand in for with the
placeholder map from the design export.

## design/

The original Claude Design export, kept as the visual reference and as the fixture the
check compares against: `design/index.html` (open it in a browser), `design/pages/` (77
static variants), `design/source/` (editable `.dc.html` originals), `design/tokens.json`.
Nothing in the app imports from it at runtime.

`Travel Zine Generator — Claude Code Implementation Spec.md` is the product spec; the
build order lives in its section 17.

## Credits

Photos from Unsplash (see `design/README.md`). The maps and QR codes on the sample
pages are decorative placeholders. Hours in brackets are placeholders, not verified
facts. The Ukrainian copy is a working translation and needs a native review.
