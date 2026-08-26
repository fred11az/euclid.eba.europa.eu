import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import NewsFeed from '@/components/NewsFeed';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });
  return { title: t('title'), description: t('lead') };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-navy-600">{t('lead')}</p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-navy-500">…</p>}>
          <NewsFeed />
        </Suspense>
      </div>
    </div>
  );
}
