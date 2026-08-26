'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const LINKS = [
  { href: '/', key: 'home' },
  { href: '/institutions', key: 'institutions' },
  { href: '/countries', key: 'countries' },
  { href: '/news', key: 'news' },
] as const;

/** Shown in full on the mobile sheet, where there is room for the whole map. */
const SECONDARY = [
  { href: '/supervisors', key: 'supervisors' },
  { href: '/glossary', key: 'glossary' },
  { href: '/about', key: 'about' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 text-white backdrop-blur supports-[backdrop-filter]:bg-navy-900/85">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/brand/eba-logo.png"
            alt="Euclide EBA"
            width={588}
            height={274}
            priority
            className="h-9 w-auto rounded-sm"
          />
          <span className="sr-only">Euclide EBA</span>
        </Link>

        <nav aria-label="Main" className="ms-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition hover:bg-white/10 ${
                    isActive(l.href) ? 'bg-white/10 text-gold-400' : 'text-navy-100'
                  }`}
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-navy-100 transition hover:bg-white/10"
              >
                <SearchIcon />
                {t('search')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/10 md:hidden"
          >
            <span className="sr-only">{open ? t('close') : t('menu')}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {open ? (
                <path fill="currentColor" d="m5.6 4.2 14.2 14.2-1.4 1.4L4.2 5.6z M18.4 4.2l1.4 1.4L5.6 19.8l-1.4-1.4z" />
              ) : (
                <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-white/10 md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {[...LINKS, ...SECONDARY, { href: '/search', key: 'search' } as const].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={`flex min-h-12 items-center rounded-lg px-3 text-base font-medium ${
                    isActive(l.href) ? 'text-gold-400' : 'text-navy-100'
                  }`}
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2m0 2a6 6 0 1 1 0 12a6 6 0 0 1 0-12"
      />
    </svg>
  );
}
