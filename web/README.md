# Travel Zine — Next.js app

The Claude Design export (`../pages/*.html`) ported to React. One component per board,
driven by theme tokens and copy, so any board renders in any of the four themes and
both languages — the same "data model is the source of truth" rule as the spec (§2.3).

```
pnpm dev          # http://localhost:3000
pnpm build
pnpm start
```

## Routes

| Route | What |
| --- | --- |
| `/` | Gallery: board list, theme / language / zoom controls (replaces `index.html`) |
| `/p/<slug>?theme=&lang=` | One board on its own, print-ready |
| `/booklet?theme=&lang=` | Lisbon sample in reading order, one A5 page per sheet |

Slugs: `cover-a-lisbon`, `cover-b-lisbon`, `cover-c-lisbon`, `cover-a-tokyo`,
`cover-b-tokyo`, `cover-c-tokyo`, `day-alfama`, `places-light`, `places-inverted`.

## Files

- `lib/themes.ts` — the four themes plus the inverted-page derivation.
- `lib/copy.ts` — booklet copy (EN/UK), extracted verbatim from the export.
- `components/zine/` — `primitives.tsx` (A5 page shell, tag, contents, QR), `Covers.tsx`, `DayPage.tsx`, `PlacesPage.tsx`.
- `lib/boards.tsx` — board registry used by the gallery and both routes.

Pages are drawn at 4 px/mm (592 × 840 px). Printing applies `@page 148mm 210mm` and
`zoom: .9449` so an A5 page comes out at true size — set 100% scale and no headers
in the print dialog. Browser "Save as PDF" is the export for now.

## Check

`scripts/check.mjs` renders all 9 boards × 4 themes × 2 languages and asserts the text
and the colour set match the original export byte for byte:

```
pnpm build && pnpm start -p 3111 &
pnpm check
```
