'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, localeMeta } from '@/i18n/routing';

/**
 * Real anchors, one per language, pointing at the current page. Unlike the
 * header's select these are crawlable and work without JavaScript, which is
 * what makes the alternates in the head verifiable.
 */
export default function LocaleLinks() {
  const active = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {locales.map((code) => (
        <li key={code}>
          <Link
            prefetch={false}
            // @ts-expect-error -- dynamic route params are forwarded as-is
            href={{ pathname, params }}
            locale={code}
            hrefLang={code}
            lang={code}
            dir={localeMeta[code].dir}
            aria-current={code === active ? 'true' : undefined}
            className={`inline-flex min-h-9 items-center ${
              code === active ? 'font-semibold text-gold-400' : 'text-navy-200 hover:text-white'
            }`}
          >
            {localeMeta[code].label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
