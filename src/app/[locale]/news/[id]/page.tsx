import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import Badge from '@/components/Badge';
import NewsCard from '@/components/NewsCard';
import InstitutionCard from '@/components/InstitutionCard';
import {
  countryName,
  flag,
  formatDate,
  getInstitution,
  getNews,
  news,
  relatedNews,
  slugify,
  t as tr,
} from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => news.map((n) => ({ locale, id: n.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const item = getNews(id);
  if (!item) return {};
  return {
    title: tr(item.title, locale),
    description: tr(item.snippet, locale),
    alternates: {
      canonical: `/${locale}/news/${id}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/news/${id}`])),
    },
    openGraph: { type: 'article', publishedTime: item.date },
  };
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const item = getNews(id);
  if (!item) notFound();

  const t = await getTranslations();
  const inst = getInstitution(item.institutionId);
  const related = relatedNews(item);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: tr(item.title, locale),
    datePublished: item.date,
    description: tr(item.snippet, locale),
    publisher: { '@type': 'Organization', name: 'Euclide EBA' },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/news" className="inline-flex min-h-11 items-center text-sm text-navy-500 hover:text-navy-900">
        <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('newsItem.back')}
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Link href={{ pathname: '/news', query: { category: item.category } }}>
          <Badge tone="gold">{t(`categories.${item.category}`)}</Badge>
        </Link>
        <time dateTime={item.date} className="text-sm text-navy-500">
          {formatDate(item.date, locale)}
        </time>
        <Link href={`/countries/${item.country.toLowerCase()}`} className="text-sm text-navy-500 hover:text-navy-900">
          <span aria-hidden="true">{flag(item.country)}</span> {countryName(item.country, locale)}
        </Link>
      </div>

      <h1 className="mt-3 text-2xl font-bold leading-snug text-navy-900 sm:text-4xl">{tr(item.title, locale)}</h1>
      <p className="mt-4 text-lg leading-relaxed text-navy-700">{tr(item.snippet, locale)}</p>

      <p className="mt-6 text-sm text-navy-600">
        {t('news.source')} :{' '}
        <Link href={`/supervisors/${slugify(item.source)}`} className="font-semibold underline underline-offset-4">
          {item.source}
        </Link>
      </p>

      <p className="mt-6 rounded-xl bg-navy-50 p-4 text-sm leading-relaxed text-navy-600">
        {t('newsItem.disclaimer')}
      </p>

      {inst && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('newsItem.concerns')}</h2>
          <div className="mt-3">
            <InstitutionCard inst={inst} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-navy-900">{t('newsItem.related')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
