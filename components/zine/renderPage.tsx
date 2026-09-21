// Maps a PageSpec to its variant component. The renderer never decides layout:
// it draws what the layout engine put on the page (spec section 2.3).

import type { PageSpec } from '@/lib/layout';
import { theme, type Lang, type ThemeId } from '@/lib/themes';
import { CoverA, CoverB, CoverC, ISSUE_LISBON, ISSUE_TOKYO } from './Covers';
import { ColophonPage } from './ColophonPage';
import { DayPage } from './DayPage';
import { NotesPage } from './NotesPage';
import { PlacesPage } from './PlacesPage';

const COVERS = { 'cover.a': CoverA, 'cover.b': CoverB, 'cover.c': CoverC };

export function renderPage(page: PageSpec, themeId: ThemeId, lang: Lang, branding = true) {
  const t = theme(themeId);

  switch (page.spreadType) {
    case 'cover': {
      const Cover = COVERS[page.variantId];
      return <Cover t={t} l={page.copy} issue={page.issue === 'tokyo' ? ISSUE_TOKYO : ISSUE_LISBON} />;
    }
    case 'day':
      return <DayPage t={t} l={page.copy} />;
    case 'places':
      return <PlacesPage t={t} l={page.copy} inverted={page.variantId === 'places.inverted'} />;
    case 'notes':
      return <NotesPage t={t} lang={lang} echo={t.echoLabel} />;
    case 'colophon':
      return <ColophonPage t={t} lang={lang} echo={t.echoLabel} credits={page.credits} branding={branding} />;
  }
}
