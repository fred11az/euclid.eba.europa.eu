import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import LinkTile from '@/components/LinkTile';
import { countryCodes, countryName, flag, institutionsIn } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'countries' });
  return { title: t('title'), description: t('lead') };
}

export default async function CountriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('countries');
  const tl = await getTranslations('list');

  const sorted = [...countryCodes].sort((a, b) =>
    countryName(a, locale).localeCompare(countryName(b, locale), locale),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-navy-600">{t('lead')}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((code) => (
          <LinkTile
            key={code}
            href={`/countries/${code.toLowerCase()}`}
            icon={flag(code)}
            title={countryName(code, locale)}
            meta={tl('results', { count: institutionsIn(code).length })}
          />
        ))}
      </div>
    </div>
  );
}
