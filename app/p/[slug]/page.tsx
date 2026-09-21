import { notFound } from 'next/navigation';
import { BOARDS, boardBySlug } from '@/lib/boards';
import { THEMES, type Lang, type ThemeId } from '@/lib/themes';

export const dynamicParams = false;
export const generateStaticParams = async () => BOARDS.map((b) => ({ slug: b.slug }));

type Search = { theme?: string; lang?: string };

export default async function BoardPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const q = await searchParams;
  const board = boardBySlug(slug);
  if (!board) notFound();

  const themeId = (q.theme && q.theme in THEMES ? q.theme : board.defaults.theme) as ThemeId;
  const lang: Lang = q.lang === 'uk' ? 'uk' : 'en';

  return board.render(themeId, lang);
}
