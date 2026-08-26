import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import InstitutionCard from '@/components/InstitutionCard';
import NewsCard from '@/components/NewsCard';
import LinkTile from '@/components/LinkTile';
import Badge from '@/components/Badge';
import {
  authorities,
  countryCodes,
  countryName,
  flag,
  institutionsIn,
  licenceSlugFor,
  newsIn,
  slugify,
} from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => countryCodes.map((code) => ({ locale, code: code.toLowerCase() })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const upper = code.toUpperCase();
  if (!countryCodes.includes(upper)) return {};
  const t = await getTranslations({ locale, namespace: 'countries' });
  const name = countryName(upper, locale);
  return {
    title: name,
    description: t('intro', { count: institutionsIn(upper).length, country: name }),
    alternates: {
      canonical: `/${locale}/countries/${code}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/countries/${code}`])),
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const upper = code.toUpperCase();
  if (!countryCodes.includes(upper)) notFound();

  const t = await getTranslations();
  const name = countryName(upper, locale);
  const authority = authorities[upper];
  const list = institutionsIn(upper);
  const items = newsIn(upper).slice(0, 3);

  const byLicence = Object.entries(
    list.reduce<Record<string, number>>((acc, i) => {
      acc[i.licenceType] = (acc[i.licenceType] ?? 0) + 1;
      return acc;
    }, {}),
  );

  const neighbours = countryCodes
    .filter((c) => c !== upper)
    .sort((a, b) => countryName(a, locale).localeCompare(countryName(b, locale), locale))
    .slice(0, 6);

  return (
    <>
      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link href="/countries" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('countries.title')}
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <span aria-hidden="true" className="text-5xl leading-none">{flag(upper)}</span>
            <div>
              <h1 className="text-2xl font-bold sm:text-4xl">{name}</h1>
              <p className="mt-1 text-sm text-navy-200">{t('countries.intro', { count: list.length, country: name })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {authority && (
          <section className="rounded-2xl border-2 border-gold-500 bg-gold-500/10 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-navy-500">{t('home.supervisedBy')}</h2>
            <p className="mt-1 text-lg font-semibold text-navy-900">{authority.authority}</p>
            {authority.ssm && <p className="mt-2"><Badge tone="gold">{t('home.ssm')}</Badge></p>}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={authority.register}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700"
              >
                {t('detail.officialRegister')} ↗
              </a>
              <Link
                href={`/supervisors/${slugify(authority.authority)}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-navy-300 px-4 text-sm font-semibold text-navy-800 hover:bg-white"
              >
                {t('common.learnMore')}
              </Link>
            </div>
          </section>
        )}

        {byLicence.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('countries.breakdown')}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {byLicence.map(([type, count]) => (
                <LinkTile
                  key={type}
                  href={`/licences/${licenceSlugFor(type as 'CREDIT_INSTITUTION')}`}
                  title={t(`licence.${type}`)}
                  meta={t('list.results', { count })}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-navy-900">{t('countries.institutionsHere')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} dense />
            ))}
          </div>
        </section>

        {items.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy-900">{t('countries.newsHere')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('countries.others')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {neighbours.map((c) => (
              <LinkTile
                key={c}
                href={`/countries/${c.toLowerCase()}`}
                icon={flag(c)}
                title={countryName(c, locale)}
                meta={t('list.results', { count: institutionsIn(c).length })}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
