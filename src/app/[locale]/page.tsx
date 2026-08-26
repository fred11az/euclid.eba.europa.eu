import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import SearchBox from '@/components/SearchBox';
import CountryPicker from '@/components/CountryPicker';
import InstitutionCard from '@/components/InstitutionCard';
import NewsCard from '@/components/NewsCard';
import { countryCodes, institutions, news } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const featured = [...institutions].sort((a, b) => b.solidityScore - a.solidityScore).slice(0, 6);
  const latest = news.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <Image
          src="/brand/eba-reception.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-0 bg-gradient-to-b from-navy-900/80 via-navy-900/85 to-navy-900"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">{t('kicker')}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{t('title')}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">{t('lead')}</p>

          <div className="mt-7 max-w-2xl">
            <SearchBox size="lg" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/institutions"
              className="inline-flex min-h-12 items-center rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              {t('exploreCta')}
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-center sm:max-w-lg sm:text-start">
            {[
              [institutions.length, t('statsInstitutions')],
              [countryCodes.length, t('statsCountries')],
              [locales.length, t('statsLanguages')],
            ].map(([value, label]) => (
              <div key={String(label)}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-2xl font-bold text-gold-400 sm:text-3xl">{value}</span>
                  <span className="mt-0.5 block text-xs text-navy-200 sm:text-sm">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Country entry point */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t('checkTitle')}</h2>
            <p className="mt-3 text-base leading-relaxed text-navy-600">{t('checkLead')}</p>
          </div>
          <CountryPicker />
        </div>
      </section>

      {/* Three steps */}
      <section className="bg-navy-50/70 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t('howTitle')}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-bold text-navy-900">
                  {n}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{t(`how${n}Title` as 'how1Title')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{t(`how${n}Text` as 'how1Text')}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured institutions */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t('featured')}</h2>
            <p className="mt-2 text-navy-600">{t('featuredLead')}</p>
          </div>
          <Link href="/institutions" className="text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
            {t('exploreCta')} <span aria-hidden="true" className="flip-x inline-block">→</span>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((inst) => (
            <InstitutionCard key={inst.id} inst={inst} />
          ))}
        </div>
      </section>

      {/* News */}
      <section className="bg-navy-50/70 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t('latestNews')}</h2>
            <Link href="/news" className="text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
              {t('allNews')} <span aria-hidden="true" className="flip-x inline-block">→</span>
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
