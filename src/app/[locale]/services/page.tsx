import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import LinkTile from '@/components/LinkTile';
import { entitiesWithService, serviceCodes, serviceLabel, t as tr } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('pageTitle'), description: t('pageLead') };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('services.pageTitle')}</h1>
      <p className="mt-2 max-w-2xl text-navy-600">{t('services.pageLead')}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {serviceCodes.map((code) => (
          <LinkTile
            key={code}
            href={`/services/${code.toLowerCase()}`}
            title={tr(serviceLabel(code), locale)}
            meta={t('list.results', { count: entitiesWithService(code).length })}
          />
        ))}
      </div>
    </div>
  );
}
