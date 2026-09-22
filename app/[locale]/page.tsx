import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MARKETING, FAKE_DOOR_PRICE } from '@/lib/marketing-copy';
import { SAMPLES, sampleFiles } from '@/lib/samples';
import { theme, type Lang } from '@/lib/themes';
import { CoverA, ISSUE_LISBON, ISSUE_TOKYO } from '@/components/zine/Covers';
import { COVER_LISBON, COVER_TOKYO } from '@/lib/copy';
import { WaitlistForm, PriceButton, TrackedDownload } from './client';
import styles from './landing.module.css';

export const dynamicParams = false;
export const generateStaticParams = async () => [{ locale: 'en' }, { locale: 'uk' }];

const PHOTO_EMAIL = 'hello@example.com';

export default async function Landing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'uk') notFound();
  const lang = locale as Lang;
  const t = MARKETING[lang];
  const other = lang === 'en' ? 'uk' : 'en';

  return (
    <div className={styles.page} lang={lang}>
      <header className={styles.nav}>
        <span className={styles.wordmark}>Travel Zine</span>
        <nav>
          <a href="#samples">{t.nav.samples}</a>
          <a href="#how">{t.nav.how}</a>
          <a href="#faq">{t.nav.faq}</a>
          <Link href={`/${other}`} className={styles.lang}>{t.nav.other}</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>{t.hero.kicker}</p>
          <h1>{t.hero.headline}</h1>
          <p className={styles.deck}>{t.hero.deck}</p>
          <WaitlistForm lang={lang} copy={t.hero} />
        </div>
        <div className={styles.heroArt} aria-hidden>
          {/* The real renderer, at a quarter size: the sample is the product. */}
          <div className={styles.coverShot}>
            <CoverA t={theme('lisbon')} l={COVER_LISBON[lang]} issue={ISSUE_LISBON} />
          </div>
          <div className={`${styles.coverShot} ${styles.coverBehind}`}>
            <CoverA t={theme('tokyo')} l={COVER_TOKYO[lang]} issue={ISSUE_TOKYO} />
          </div>
        </div>
      </section>

      <section id="how" className={styles.section}>
        <h2>{t.how.title}</h2>
        <ol className={styles.steps}>
          {t.how.steps.map(([head, body], i) => (
            <li key={head}>
              <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{head}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="samples" className={styles.section}>
        <h2>{t.samples.title}</h2>
        <p className={styles.deck}>{t.samples.deck}</p>
        <div className={styles.samples}>
          {SAMPLES.map((s) => {
            const files = sampleFiles(s.id);
            return (
              <article key={s.id} className={styles.sample}>
                <div className={styles.sampleShot}>
                  <div className={styles.coverShot}>
                    <CoverA
                      t={theme(s.theme)}
                      l={(s.issue === 'tokyo' ? COVER_TOKYO : COVER_LISBON)[s.lang]}
                      issue={s.issue === 'tokyo' ? ISSUE_TOKYO : ISSUE_LISBON}
                    />
                  </div>
                </div>
                <h3>{s.title[lang]}</h3>
                <p>{s.blurb[lang]}</p>
                <p className={styles.sampleLinks}>
                  <Link href={`/booklet?theme=${s.theme}&lang=${s.lang}&issue=${s.issue}`}>{t.samples.view}</Link>
                  <TrackedDownload href={files.reading} sampleId={s.id} file="reading" lang={lang}>
                    {t.samples.reading}
                  </TrackedDownload>
                  <TrackedDownload href={files.print} sampleId={s.id} file="print" lang={lang}>
                    {t.samples.print}
                  </TrackedDownload>
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2>{t.price.title}</h2>
        <div className={styles.tiers}>
          <div className={styles.tier}>
            <h3>{t.price.free}</h3>
            <p className={styles.amount}>0</p>
            <p>{t.price.freeBody}</p>
          </div>
          <div className={`${styles.tier} ${styles.tierPaid}`}>
            <h3>{t.price.paid}</h3>
            <p className={styles.amount}>{FAKE_DOOR_PRICE.display} <small>{t.price.per}</small></p>
            <p>{t.price.paidBody}</p>
            <PriceButton lang={lang} copy={t.price} price={FAKE_DOOR_PRICE.display} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>{t.photo.title}</h2>
        <p className={styles.deck}>{t.photo.deck}</p>
        <p>
          <a className={styles.button} href={`mailto:${PHOTO_EMAIL}?subject=${encodeURIComponent('Printed one')}`}>
            {t.photo.cta}
          </a>{' '}
          <span className={styles.note}>{t.photo.hint}</span>
        </p>
      </section>

      <section id="faq" className={styles.section}>
        <h2>{t.faq.title}</h2>
        <dl className={styles.faq}>
          {t.faq.items.map(([q, a]) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className={styles.footer}>
        <p>{t.footer.placeholder}</p>
        <p>{t.footer.credits}</p>
        <p><Link href="/gallery">Design gallery</Link></p>
      </footer>
    </div>
  );
}
