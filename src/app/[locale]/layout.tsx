import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, localeMeta, locales, type Locale } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://euclide-eba.vercel.app';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: '%s · Euclide EBA' },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        'x-default': `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Euclide EBA',
      title: t('title'),
      description: t('description'),
      locale,
      images: ['/brand/eba-reception.jpg'],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = localeMeta[locale as Locale].dir;
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html lang={locale} dir={dir}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a href="#main" className="skip-link">
            {t('skip')}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
