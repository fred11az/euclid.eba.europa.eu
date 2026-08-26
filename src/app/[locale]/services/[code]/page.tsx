import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import InstitutionCard from '@/components/InstitutionCard';
import LinkTile from '@/components/LinkTile';
import {
  entitiesWithService,
  getInstitution,
  serviceCodes,
  serviceLabel,
  t as tr,
} from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceCodes.map((code) => ({ locale, code: code.toLowerCase() })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const upper = code.toUpperCase();
  if (!serviceCodes.includes(upper)) return {};
  const t = await getTranslations({ locale, namespace: 'services' });
  return {
    title: tr(serviceLabel(upper), locale),
    description: t('pageLead'),
    alternates: {
      canonical: `/${locale}/services/${code}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/services/${code}`])),
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const upper = code.toUpperCase();
  if (!serviceCodes.includes(upper)) notFound();

  const t = await getTranslations();
  const providers = entitiesWithService(upper)
    .map((e) => getInstitution(e.id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link href="/services" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('services.pageTitle')}
          </Link>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">{tr(serviceLabel(upper), locale)}</h1>
          <p className="mt-2 text-sm text-navy-200">{t('list.results', { count: providers.length })}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <h2 className="text-xl font-bold text-navy-900">{t('services.providers')}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((inst) => (
            <InstitutionCard key={inst.id} inst={inst} dense />
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('services.pageTitle')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {serviceCodes
              .filter((c) => c !== upper)
              .map((c) => (
                <LinkTile
                  key={c}
                  href={`/services/${c.toLowerCase()}`}
                  title={tr(serviceLabel(c), locale)}
                  meta={t('list.results', { count: entitiesWithService(c).length })}
                />
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
