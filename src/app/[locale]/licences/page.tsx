import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { institutionsWithLicence, licences, t as tr } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'licences' });
  return { title: t('title'), description: t('lead') };
}

export default async function LicencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('licences.title')}</h1>
      <p className="mt-2 text-navy-600">{t('licences.lead')}</p>
      <div className="mt-6 space-y-4">
        {licences.map((l) => (
          <Link
            key={l.slug}
            href={`/licences/${l.slug}`}
            className="block rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition hover:border-navy-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-navy-900">{t(`licence.${l.type}`)}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600">{tr(l.summary, locale)}</p>
            <p className="mt-3 text-sm font-semibold text-navy-700">
              {t('list.results', { count: institutionsWithLicence(l.type).length })} ›
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
