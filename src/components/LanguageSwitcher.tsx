'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeMeta, type Locale } from '@/i18n/routing';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t('language')}</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute inset-inline-start-2 start-2 h-4 w-4 text-navy-200">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20m0 2c1.2 0 2.6 1.9 3.2 5H8.8C9.4 5.9 10.8 4 12 4M6.7 5.9A12 12 0 0 0 5.6 9H4.3a8 8 0 0 1 2.4-3.1M4.1 11h1.3q-.1 1 0 2H4.1a8 8 0 0 1 0-2m.2 4h1.3a12 12 0 0 0 1.1 3.1A8 8 0 0 1 4.3 15M8.8 15h6.4c-.6 3.1-2 5-3.2 5s-2.6-1.9-3.2-5m-.4-2a17 17 0 0 1 0-2h7.2a17 17 0 0 1 0 2zm8.9 5.1a12 12 0 0 0 1.1-3.1h1.3a8 8 0 0 1-2.4 3.1M19.9 13h-1.3q.1-1 0-2h1.3a8 8 0 0 1 0 2m-1.5-4a12 12 0 0 0-1.1-3.1A8 8 0 0 1 19.7 9z" />
      </svg>
      <select
        aria-label={t('language')}
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => {
            router.replace(
              // @ts-expect-error -- dynamic route params are forwarded as-is
              { pathname, params },
              { locale: next },
            );
          });
        }}
        className="min-h-11 appearance-none rounded-lg border border-white/20 bg-white/10 py-2 ps-8 pe-8 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
      >
        {locales.map((code) => (
          <option key={code} value={code} className="text-navy-900">
            {localeMeta[code].label}
          </option>
        ))}
      </select>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute end-2 h-4 w-4 text-navy-200">
        <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5z" />
      </svg>
    </label>
  );
}
