import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import LinkTile from '@/components/LinkTile';
import { getTerm, glossary, t as tr } from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => glossary.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  return {
    title: tr(term.label, locale),
    description: tr(term.body, locale).slice(0, 160),
    alternates: {
      canonical: `/${locale}/glossary/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/glossary/${slug}`])),
    },
  };
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const term = getTerm(slug);
  if (!term) notFound();

  const t = await getTranslations('glossary');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: tr(term.label, locale),
    description: tr(term.body, locale),
    inDefinedTermSet: 'Euclide EBA',
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/glossary" className="inline-flex min-h-11 items-center text-sm text-navy-500 hover:text-navy-900">
        <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('title')}
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">{tr(term.label, locale)}</h1>
      <p className="mt-4 text-lg leading-relaxed text-navy-700">{tr(term.body, locale)}</p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('allTerms')}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {glossary
            .filter((g) => g.slug !== slug)
            .map((g) => (
              <LinkTile key={g.slug} href={`/glossary/${g.slug}`} title={tr(g.label, locale)} />
            ))}
        </div>
      </section>
    </div>
  );
}
