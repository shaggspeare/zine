# Travel Zine Generator: design export

Printable city-trip booklet (A5 portrait, 148 x 210 mm) with four themes, English and Ukrainian, and two sample issues (Lisbon, Tokyo).

## Open it

Open `index.html` in a browser. Pick a page on the left; the Theme and Language menus re-skin any page. Every variant is also a plain file in `pages/`, named `<Board>__<theme>__<lang>.html`. Oswald and PT Serif are bundled in `fonts/` (SIL Open Font License), so it works offline. The Japanese echo word 東京 uses Noto Sans JP from Google Fonts when online, and a system Japanese font otherwise.

## What is in the folder

- `index.html`: gallery of all pages.
- `pages/`: 77 static HTML pages, one per board, theme and language. Each is self-contained apart from the fonts and the photos in `assets/`.
- `assets/`: the photos, already toned (blue duotone for the Lisbon theme, black and white for the others), 1000 px on the long side.
- `tokens.json`: theme tokens (paper, ink, primary, accent, accent2, muted, darkPage, motif, tag style, photo treatment, echo mode) and page geometry.
- `source/`: the original editable Claude Design files (`*.dc.html`, `canvas.json`). Each has its markup, plus a script block holding the copy and theme table. They need the Claude Design runtime to render, so use `pages/` to view.

## Page geometry

The design is drawn at 4 px per mm: an A5 page is 592 x 840 px. Margins are 32 px outer, top and bottom (8 mm) and 40 px on the spine side (10 mm). Grid: 6 columns, 16 px gutter (4 mm), 12 px baseline (3 mm). Body text 12.7 px / 16.9 px is 9 pt / 12 pt. Printing an A5 page from `pages/*.html` applies a print stylesheet (`@page` 148 x 210 mm and zoom 0.9449) so the page comes out at true size; turn off "headers and footers" and set scale to 100% in the print dialog.

## How the themes work

One skeleton, many cities. Layout never changes between themes; only the tokens do. See `tokens.json`. Photos come in two treatments per image: `*-duotone.jpg` (Lisbon theme) and `*-bw.jpg` (other themes; Barcelona adds contrast 1.35 in CSS).

## Content notes

- Hours in brackets, such as `[10:00–18:00]`, and the issue lines (dates, temperatures) are placeholders, not verified facts.
- The QR codes are decorative placeholders and do not scan.
- Ukrainian copy is a working translation and needs a native review.

## Still to design (from the brief)

Intro feature, overview map, timeline, 5-stop and 2-page day variants, 2- and 4-place list variants, practical, notes, colophon, print-sheet view, and the app screens.

## Photo credits (Unsplash, free to use; credit is appreciated)

- Alfama dome view (Lisbon cover): Veronika Martinelli
- Rooftops and river (places page): Tom Byrom
- Bridge (places page): Malu Decks
- Skyline (theme board, components): Liam McKay
- Tram (Barcelona sample): Andre Lergier
- Tokyo Tower (Tokyo sample): Jaison Lin
- Tokyo alley (Tokyo cover): Yoav Aziz

Photographer names are taken from the downloaded file names; check each photo's page on Unsplash before publishing.
