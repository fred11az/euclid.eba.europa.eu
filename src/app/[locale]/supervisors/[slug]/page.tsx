import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import InstitutionCard from '@/components/InstitutionCard';
import LinkTile from '@/components/LinkTile';
import { authorities, countryName, flag, getSupervisor, supervisorIndex } from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => supervisorIndex.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const sup = getSupervisor(slug);
  if (!sup) return {};
  const t = await getTranslations({ locale, namespace: 'supervisors' });
  return {
    title: sup.name,
    description: t('intro', { name: sup.name, count: sup.supervised.length }),
    alternates: {
      canonical: `/${locale}/supervisors/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/supervisors/${slug}`])),
    },
  };
}

export default async function SupervisorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const sup = getSupervisor(slug);
  if (!sup) notFound();

  const t = await getTranslations();
  // A supervisor with a single national mandate has an official register we can link to.
  const registerCountry = sup.countries.find((c) => authorities[c]?.authority.includes(sup.name.split(' (')[0]));
  const register = registerCountry ? authorities[registerCountry] : undefined;

  return (
    <>
      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link href="/supervisors" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('supervisors.title')}
          </Link>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">{sup.name}</h1>
          <p className="mt-2 text-sm text-navy-200">
            {t('supervisors.intro', { name: sup.name, count: sup.supervised.length })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {register && (
          <a
            href={register.register}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gold-500 px-5 text-sm font-semibold text-navy-900 hover:bg-gold-400"
          >
            {t('detail.officialRegister')} ↗
          </a>
        )}

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('supervisors.countries')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sup.countries.map((c) => (
              <LinkTile
                key={c}
                href={`/countries/${c.toLowerCase()}`}
                icon={flag(c)}
                title={countryName(c, locale)}
                meta={authorities[c]?.authority}
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-navy-900">{t('supervisors.supervises')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sup.supervised.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} dense />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
