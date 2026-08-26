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
  // No cookie and no match: English. A supported Accept-Language wins over that.
  localePrefix: 'always',
  localeDetection: true,
  // An explicit choice outlives the browser session; without a maxAge the
  // cookie is dropped on close and the visitor is sent back to their
  // browser's language on the next visit.
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
});
