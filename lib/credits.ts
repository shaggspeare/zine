// Photo licensing, keyed by the asset the page places. Attribution is a legal
// requirement and is never hidden, in any tier (spec section 8.5).
// Photographer names come from the downloaded file names in the design export;
// check each photo's page on Unsplash before publishing.

export interface Credit {
  author: string;
  license: string;
  source: string;
}

export const CREDITS: Record<string, Credit> = {
  '/assets/lisbon-alfama-dome': { author: 'Veronika Martinelli', license: 'Unsplash License', source: 'Unsplash' },
  '/assets/lisbon-rooftops-river': { author: 'Tom Byrom', license: 'Unsplash License', source: 'Unsplash' },
  '/assets/lisbon-bridge': { author: 'Malu Decks', license: 'Unsplash License', source: 'Unsplash' },
  '/assets/lisbon-skyline': { author: 'Liam McKay', license: 'Unsplash License', source: 'Unsplash' },
  '/assets/lisbon-tram': { author: 'Andre Lergier', license: 'Unsplash License', source: 'Unsplash' },
  '/assets/tokyo-tower': { author: 'Jaison Lin', license: 'Unsplash License', source: 'Unsplash' },
  '/assets/tokyo-alley': { author: 'Yoav Aziz', license: 'Unsplash License', source: 'Unsplash' },
};

/** Strip the treatment suffix: one photo, one credit, whatever the theme did to it. */
export const creditFor = (src: string): Credit | undefined =>
  CREDITS[src.replace(/-(duotone|bw|color)\.jpg$/, '')];

export const MAP_ATTRIBUTION = '© OpenStreetMap contributors';
