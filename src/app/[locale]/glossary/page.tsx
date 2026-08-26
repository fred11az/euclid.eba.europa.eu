import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { glossary, t as tr } from '@/lib/data';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'glossary' });
  return { title: t('title'), description: t('lead') };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('glossary');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('title')}</h1>
      <p className="mt-2 text-navy-600">{t('lead')}</p>
      <div className="mt-6 space-y-3">
        {glossary.map((term) => (
          <Link
            key={term.slug}
            href={`/glossary/${term.slug}`}
            className="block rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition hover:border-navy-300 hover:shadow-md"
          >
            <h2 className="text-base font-semibold text-navy-900">{tr(term.label, locale)}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-navy-600">{tr(term.body, locale)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
