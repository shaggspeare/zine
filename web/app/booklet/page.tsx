import { Fragment } from 'react';
import { BOOKLET, boardBySlug } from '@/lib/boards';
import { THEMES, type Lang, type ThemeId } from '@/lib/themes';

/** Sample booklet in reading order. Print it (A5, 100% scale) to get the reading PDF. */
export default async function BookletPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; lang?: string }>;
}) {
  const q = await searchParams;
  const themeId = (q.theme && q.theme in THEMES ? q.theme : 'lisbon') as ThemeId;
  const lang: Lang = q.lang === 'uk' ? 'uk' : 'en';

  return (
    <div className="booklet-stack">
      {BOOKLET.map((slug) => {
        const board = boardBySlug(slug);
        return board ? <Fragment key={slug}>{board.render(themeId, lang)}</Fragment> : null;
      })}
    </div>
  );
}
