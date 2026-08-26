import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import LinkTile from '@/components/LinkTile';
import { countryName, supervisorIndex } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'supervisors' });
  return { title: t('title'), description: t('lead') };
}

export default async function SupervisorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('supervisors');
  const tl = await getTranslations('list');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-navy-600">{t('lead')}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[...supervisorIndex]
          .sort((a, b) => b.supervised.length - a.supervised.length)
          .map((s) => (
            <LinkTile
              key={s.slug}
              href={`/supervisors/${s.slug}`}
              title={s.name}
              meta={`${tl('results', { count: s.supervised.length })} · ${s.countries
                .map((c) => countryName(c, locale))
                .join(', ')}`}
            />
          ))}
      </div>
    </div>
  );
}
