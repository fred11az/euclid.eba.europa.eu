'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import InstitutionCard from './InstitutionCard';
import { countryCodes, countryName, institutions, kinds, regulators, tags } from '@/lib/data';

const PER_PAGE = 24;

export default function InstitutionExplorer() {
  const t = useTranslations('list');
  const tk = useTranslations();
  const locale = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const country = params.get('country') ?? 'all';
  const kind = params.get('kind') ?? 'all';
  const tag = params.get('tag') ?? 'all';
  const regulator = params.get('regulator') ?? 'all';
  const sort = params.get('sort') ?? 'name';
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === 'all' || value === '') next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: key === 'page' });
  };

  const filtered = useMemo(() => {
    const list = institutions.filter(
      (i) =>
        (country === 'all' || i.country === country) &&
        (kind === 'all' || i.kind === kind) &&
        (tag === 'all' || i.tags.includes(tag)) &&
        (regulator === 'all' || i.regulators.includes(regulator)),
    );
    return list.sort((a, b) => {
      if (sort === 'completeness') return b.completeness - a.completeness;
      if (sort === 'founded') return a.founded - b.founded;
      return a.legalName.localeCompare(b.legalName, locale);
    });
  }, [country, kind, tag, regulator, sort, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const hasFilters = country !== 'all' || kind !== 'all' || tag !== 'all' || regulator !== 'all';

  const selectClass =
    'min-h-12 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900';

  return (
    <>
      <section aria-label={t('filters')} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-500">{t('country')}</span>
            <select className={selectClass} value={country} onChange={(e) => setParam('country', e.target.value)}>
              <option value="all">{t('all')}</option>
              {[...countryCodes]
                .sort((a, b) => countryName(a, locale).localeCompare(countryName(b, locale), locale))
                .map((c) => (
                  <option key={c} value={c}>
                    {countryName(c, locale)}
                  </option>
                ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-500">{t('kind')}</span>
            <select className={selectClass} value={kind} onChange={(e) => setParam('kind', e.target.value)}>
              <option value="all">{t('all')}</option>
              {kinds.map((k) => (
                <option key={k} value={k}>
                  {tk(`kinds.${k}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-500">{t('tag')}</span>
            <select className={selectClass} value={tag} onChange={(e) => setParam('tag', e.target.value)}>
              <option value="all">{t('all')}</option>
              {tags.map((x) => (
                <option key={x} value={x}>
                  {tk(`tags.${x}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-500">{t('regulator')}</span>
            <select className={selectClass} value={regulator} onChange={(e) => setParam('regulator', e.target.value)}>
              <option value="all">{t('all')}</option>
              {regulators.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-500">{t('sort')}</span>
            <select className={selectClass} value={sort} onChange={(e) => setParam('sort', e.target.value)}>
              <option value="name">{t('sortName')}</option>
              <option value="completeness">{t('sortCompleteness')}</option>
              <option value="founded">{t('sortFounded')}</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm font-medium text-navy-700">
            {t('results', { count: filtered.length })}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => router.push(pathname)}
              className="inline-flex min-h-11 items-center rounded-lg border border-navy-200 px-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              {t('reset')}
            </button>
          )}
        </div>
      </section>

      {slice.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-navy-200 p-10 text-center">
          <p className="text-lg font-semibold text-navy-900">{t('noResults')}</p>
          <p className="mt-2 text-navy-600">{t('noResultsLead')}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((inst) => (
            <InstitutionCard key={inst.id} inst={inst} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={current === 1}
            onClick={() => setParam('page', String(current - 1))}
            className="inline-flex min-h-12 items-center rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 disabled:opacity-40"
          >
            <span aria-hidden="true" className="flip-x inline-block">←</span> {tk('pagination.prev')}
          </button>
          <span className="text-sm text-navy-600">{tk('pagination.page', { page: current, total: totalPages })}</span>
          <button
            type="button"
            disabled={current === totalPages}
            onClick={() => setParam('page', String(current + 1))}
            className="inline-flex min-h-12 items-center rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 disabled:opacity-40"
          >
            {tk('pagination.next')} <span aria-hidden="true" className="flip-x inline-block">→</span>
          </button>
        </nav>
      )}

      <p className="mt-10 text-center text-sm text-navy-500">
        <Link href="/about" className="underline underline-offset-4 hover:text-navy-800">
          {tk('about.dataTitle')}
        </Link>
      </p>
    </>
  );
}
