# Travel Zine

A printable A5 city-trip booklet (148 × 210 mm) rendered in the browser: four themes,
English and Ukrainian, Lisbon and Tokyo sample issues. Next.js App Router, no database
and no AI yet — the renderer first, per phase 1 of the implementation spec.

```
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

## Routes

| Route | What |
| --- | --- |
| `/` | Gallery: board list, theme / language / zoom controls |
| `/p/<slug>?theme=&lang=` | One board on its own, print-ready |
| `/booklet?theme=&lang=` | Lisbon sample in reading order, one A5 page per sheet |
| `/print-guide?theme=&lang=` | One page: printer settings, fold and staple |

Slugs: `cover-a-lisbon`, `cover-b-lisbon`, `cover-c-lisbon`, `cover-a-tokyo`,
`cover-b-tokyo`, `cover-c-tokyo`, `day-alfama`, `places-light`, `places-inverted`.

Themes: `lisbon`, `krakow`, `tokyo`, `barcelona`. Languages: `en`, `uk`.

## How it fits together

Layout never changes between themes; only the tokens do. Every board is one React
component that reads theme tokens and copy, so any board renders in any theme and
either language — pages are derived from data, never edited directly (spec §2.3).

- `lib/themes.ts` — the four themes, plus the derivation for inverted (dark) pages.
- `lib/copy.ts` — booklet copy in EN and UK, extracted verbatim from the design export.
- `lib/boards.tsx` — board registry used by the gallery and both page routes.
- `components/zine/` — `primitives.tsx` (A5 shell, tag, contents list, QR), `Covers.tsx`, `DayPage.tsx`, `PlacesPage.tsx`.
- `public/assets`, `public/fonts` — photos and Oswald / PT Serif (SIL OFL), bundled so it works offline.

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
pnpm check       # 9 boards x 4 themes x 2 languages match the design export
pnpm pdf:check   # the generated PDFs are printable and fold correctly
```

`scripts/check.mjs` renders every board variant and asserts the text and the set of
colours match `design/pages/*.html` exactly. Both checks need a running server.

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
