// Theme tokens, ported verbatim from the Claude Design export (tokens.json + the
// derived fields the .dc.html boards computed at render time).

export type ThemeId = 'lisbon' | 'krakow' | 'tokyo' | 'barcelona';
export type Lang = 'en' | 'uk';

export interface Theme {
  name: string;
  city: string;
  echoLabel: string;
  paper: string;
  ink: string;
  primary: string;
  accent: string;
  accent2: string;
  muted: string;
  dark: string;
  motif: string;
  tag: 'solid' | 'underline' | 'outline';
  photo: string;
  echoMode: string;
  photoA: string;
  photoB: string;
  mapBg: string;
  park: string;
  parkOp: number;
  tagBg: string;
  tagFg: string;
  tagB: string;
  tagS: string;
  isBand: boolean;
  isRect: boolean;
  isCircle: boolean;
  isOffset: boolean;
  echoBar: boolean;
  darkMuted: string;
  photoDuo: boolean;
  photoBw: boolean;
  photoContrast: number;
}

export const THEMES: Record<ThemeId, Theme> = {
  lisbon: {
    name: 'Lisbon', city: 'LISBON', echoLabel: 'Lisboa',
    paper: '#F7F4EE', ink: '#1B1B1B', primary: '#1F4E9C', accent: '#F2A33A',
    accent2: '#E9E2D4', muted: '#5F5A50', dark: '#13294B',
    motif: 'band', tag: 'solid', photo: 'Duotone blue', echoMode: 'subtitle',
    photoA: '#1F4E9C', photoB: '#2A5CAF', mapBg: '#E9E2D4', park: '#F2A33A', parkOp: 0.35,
    tagBg: '#F2A33A', tagFg: '#1B1B1B', tagB: '#F2A33A', tagS: '#F2A33A',
    isBand: true, isRect: false, isCircle: false, isOffset: false,
    echoBar: false, darkMuted: '#CBC6BB', photoDuo: true, photoBw: false, photoContrast: 1,
  },
  krakow: {
    name: 'Kraków', city: 'KRAKÓW', echoLabel: 'Kraków',
    paper: '#F5F3EF', ink: '#161616', primary: '#7A1F2B', accent: '#D9A441',
    accent2: '#E7E1D6', muted: '#5E5850', dark: '#2B0F14',
    motif: 'rect', tag: 'underline', photo: 'Black and white', echoMode: 'vertical bar',
    photoA: '#3A3A3A', photoB: '#4A4A4A', mapBg: '#E7E1D6', park: '#D9A441', parkOp: 0.35,
    tagBg: 'transparent', tagFg: '#161616', tagB: '#D9A441', tagS: 'transparent',
    isBand: false, isRect: true, isCircle: false, isOffset: false,
    echoBar: true, darkMuted: '#CBC6BB', photoDuo: false, photoBw: true, photoContrast: 1,
  },
  tokyo: {
    name: 'Tokyo', city: 'TOKYO', echoLabel: '東京',
    paper: '#F6F6F4', ink: '#121212', primary: '#0E3F8C', accent: '#FF6A2B',
    accent2: '#C9CED8', muted: '#565B66', dark: '#0A2247',
    motif: 'circle', tag: 'solid', photo: 'Black and white', echoMode: 'vertical bar',
    photoA: '#3A3A3A', photoB: '#4A4A4A', mapBg: '#C9CED8', park: '#FF6A2B', parkOp: 0.3,
    tagBg: '#FF6A2B', tagFg: '#121212', tagB: '#FF6A2B', tagS: '#FF6A2B',
    isBand: false, isRect: false, isCircle: true, isOffset: false,
    echoBar: true, darkMuted: '#CBC6BB', photoDuo: false, photoBw: true, photoContrast: 1,
  },
  barcelona: {
    name: 'Barcelona', city: 'BARCELONA', echoLabel: 'Barcelona',
    paper: '#FFFFFF', ink: '#111111', primary: '#111111', accent: '#FF2E88',
    accent2: '#39E75F', muted: '#555555', dark: '#111111',
    motif: 'offset rect', tag: 'solid', photo: 'B/W high contrast', echoMode: 'subtitle',
    photoA: '#000000', photoB: '#1C1C1C', mapBg: '#F0F0F0', park: '#39E75F', parkOp: 0.45,
    tagBg: '#FF2E88', tagFg: '#111111', tagB: '#FF2E88', tagS: '#FF2E88',
    isBand: false, isRect: false, isCircle: false, isOffset: true,
    echoBar: false, darkMuted: '#CBC6BB', photoDuo: false, photoBw: true, photoContrast: 1.35,
  },
};

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];
export const LANGS: Lang[] = ['en', 'uk'];

export const theme = (id: string): Theme => THEMES[id as ThemeId] ?? THEMES.lisbon;

/** Places pages re-skin the theme for the inverted (dark) variant. */
export function invertTheme(T: Theme, inverted: boolean) {
  const fg = inverted ? T.paper : T.ink;
  return {
    ...T,
    bg: inverted ? T.dark : T.paper,
    fg,
    muted: inverted ? T.darkMuted : T.muted,
    numeral: inverted ? T.accent : T.primary,
    rule: inverted ? T.paper : T.ink,
    pageFg: inverted ? T.paper : T.primary,
    tagFg: T.tag === 'solid' ? T.ink : fg,
    tagB: T.tag === 'outline' ? fg : T.tagB,
    tagS: T.tag === 'outline' ? fg : T.tagS,
    photoA: inverted && T.photoA === T.dark ? '#3A3A3A' : T.photoA,
  };
}
