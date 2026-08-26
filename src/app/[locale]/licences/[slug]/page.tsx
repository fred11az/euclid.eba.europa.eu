import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import InstitutionCard from '@/components/InstitutionCard';
import LinkTile from '@/components/LinkTile';
import { getLicence, institutionsWithLicence, licences, t as tr } from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => licences.map((l) => ({ locale, slug: l.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lic = getLicence(slug);
  if (!lic) return {};
  const t = await getTranslations({ locale });
  return {
    title: t(`licence.${lic.type}`),
    description: tr(lic.summary, locale),
    alternates: {
      canonical: `/${locale}/licences/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/licences/${slug}`])),
    },
  };
}

export default async function LicencePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const lic = getLicence(slug);
  if (!lic) notFound();

  const t = await getTranslations();
  const holders = institutionsWithLicence(lic.type);

  return (
    <>
      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link href="/licences" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('licences.title')}
          </Link>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">{t(`licence.${lic.type}`)}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <p className="text-base leading-relaxed text-navy-700">{tr(lic.summary, locale)}</p>

        <section className="mt-6 rounded-2xl border-2 border-gold-500 bg-gold-500/10 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-600">
            {t('licences.whatItProtects')}
          </h2>
          <p className="mt-2 leading-relaxed text-navy-800">{tr(lic.protects, locale)}</p>
          <Link
            href="/glossary/deposit-guarantee"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-navy-800 underline underline-offset-4"
          >
            {t('common.learnMore')}
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('licences.title')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {licences
              .filter((l) => l.slug !== slug)
              .map((l) => (
                <LinkTile
                  key={l.slug}
                  href={`/licences/${l.slug}`}
                  title={t(`licence.${l.type}`)}
                  meta={t('list.results', { count: institutionsWithLicence(l.type).length })}
                />
              ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-navy-900">{t('licences.holders')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {holders.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} dense />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
