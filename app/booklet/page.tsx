import { Fragment } from 'react';
import { sampleContent } from '@/lib/content';
import { entitlements, layout, type IssueId, type Tier } from '@/lib/layout';
import { renderPage } from '@/components/zine/renderPage';
import { THEMES, type Lang, type ThemeId } from '@/lib/themes';

/**
 * The booklet, assembled by the layout engine. Print it (A5, 100% scale) for the
 * reading PDF, or run `pnpm pdf` for the imposed sheets.
 */
export default async function BookletPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; lang?: string; issue?: string; tier?: string }>;
}) {
  const q = await searchParams;
  const themeId = (q.theme && q.theme in THEMES ? q.theme : 'lisbon') as ThemeId;
  const lang: Lang = q.lang === 'uk' ? 'uk' : 'en';
  const issue: IssueId = q.issue === 'tokyo' ? 'tokyo' : 'lisbon';
  const tier: Tier = q.tier === 'free' ? 'free' : 'paid';

  const { pages } = layout(sampleContent(issue, lang), { theme: themeId, lang, tier });
  const { branding } = entitlements(tier);

  return (
    <div className="booklet-stack">
      {pages.map((page) => (
        <Fragment key={page.index}>{renderPage(page, themeId, lang, branding)}</Fragment>
      ))}
    </div>
  );
}
