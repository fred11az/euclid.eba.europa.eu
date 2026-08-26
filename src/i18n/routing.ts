import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fr', 'de', 'it', 'pt', 'es', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { label: string; english: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'English', english: 'English', dir: 'ltr' },
  fr: { label: 'Français', english: 'French', dir: 'ltr' },
  de: { label: 'Deutsch', english: 'German', dir: 'ltr' },
  it: { label: 'Italiano', english: 'Italian', dir: 'ltr' },
  pt: { label: 'Português', english: 'Portuguese', dir: 'ltr' },
  es: { label: 'Español', english: 'Spanish', dir: 'ltr' },
  ar: { label: 'العربية', english: 'Arabic', dir: 'rtl' },
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});
