import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { authorities, countryName, flag } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('lead') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const th = await getTranslations('home');

  const sections = [
    ['missionTitle', 'missionText'],
    ['dataTitle', 'dataText'],
    ['limitTitle', 'limitText'],
    ['langTitle', 'langText'],
  ] as const;

  const rows = Object.entries(authorities).sort(([a], [b]) =>
    countryName(a, locale).localeCompare(countryName(b, locale), locale),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('title')}</h1>
      <p className="mt-3 text-lg leading-relaxed text-navy-600">{t('lead')}</p>

      {sections.map(([title, text]) => (
        <section key={title} className="mt-10">
          <h2 className="text-xl font-bold text-navy-900">{t(title)}</h2>
          <p className="mt-3 leading-relaxed text-navy-700">{t(text)}</p>
        </section>
      ))}

      <section className="mt-12">
        <h2 className="text-xl font-bold text-navy-900">{t('registersTitle')}</h2>
        <ul className="mt-4 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
          {rows.map(([code, a]) => (
            <li key={code} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true" className="text-xl">{flag(code)}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-navy-900">{countryName(code, locale)}</span>
                  <span className="block text-xs text-navy-500">{a.authority}</span>
                </span>
              </span>
              <a
                href={a.register}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-navy-200 px-3 text-sm font-medium text-navy-800 hover:bg-navy-50"
              >
                {th('seeRegister')} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
