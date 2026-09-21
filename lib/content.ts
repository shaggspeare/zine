// Sample booklet content. Stands in for what the wizard and the AI will produce
// later; the layout engine does not care where it came from.

import { COVER_LISBON, COVER_TOKYO, DAY_ALFAMA, PLACES_LISBON } from './copy';
import type { BookletContent, IssueId } from './layout';
import type { Lang } from './themes';

export function sampleContent(issue: IssueId, lang: Lang): BookletContent {
  return {
    issue,
    cover: (issue === 'tokyo' ? COVER_TOKYO : COVER_LISBON)[lang],
    coverVariant: 'a',
    days: [DAY_ALFAMA[lang]],
    places: PLACES_LISBON[lang],
    placesInverted: true,
  };
}
