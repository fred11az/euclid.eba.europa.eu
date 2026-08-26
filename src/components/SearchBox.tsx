'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { searchInstitutions } from '@/lib/search';
import { countryName, flag, t as tr } from '@/lib/data';

export default function SearchBox({
  autoFocus = false,
  size = 'md',
  initialQuery = '',
}: {
  autoFocus?: boolean;
  size?: 'md' | 'lg';
  initialQuery?: string;
}) {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => (open ? searchInstitutions(query, 6) : []), [query, open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    router.push(`/institutions/${id}`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && hits[active]) return go(hits[active].inst.id);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hits.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? hits.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const pad = size === 'lg' ? 'min-h-14 text-base' : 'min-h-12 text-sm';

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} role="search" className="flex w-full flex-col gap-2 xs:flex-row">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400">
            <path fill="currentColor" d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2m0 2a6 6 0 1 1 0 12a6 6 0 0 1 0-12" />
          </svg>
          <input
            type="search"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            aria-autocomplete="list"
            aria-expanded={open && hits.length > 0}
            aria-controls={listId}
            className={`w-full rounded-xl border border-navy-200 bg-white ps-11 pe-4 text-navy-900 shadow-sm placeholder:text-navy-400 ${pad}`}
          />
        </div>
        <button
          type="submit"
          className={`inline-flex items-center justify-center rounded-xl bg-gold-500 px-6 font-semibold text-navy-900 shadow-sm transition hover:bg-gold-400 ${pad}`}
        >
          {t('searchCta')}
        </button>
      </form>

      {open && hits.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-80 overflow-auto rounded-xl border border-navy-200 bg-white py-1 text-start shadow-xl"
        >
          {hits.map((hit, i) => (
            <li key={hit.inst.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(hit.inst.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-start ${i === active ? 'bg-navy-50' : ''}`}
              >
                <span aria-hidden="true" className="text-xl leading-none">{flag(hit.inst.country)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-navy-900">{tr(hit.inst.name, locale)}</span>
                  <span className="block truncate text-xs text-navy-500">
                    {hit.inst.city} · {countryName(hit.inst.country, locale)} · {hit.inst.bic}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
