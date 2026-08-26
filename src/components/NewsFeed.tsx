'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import NewsCard from './NewsCard';
import { categories, news } from '@/lib/data';

const PER_PAGE = 12;

export default function NewsFeed() {
  const t = useTranslations();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = params.get('category') ?? 'all';
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const filtered = useMemo(
    () => (category === 'all' ? news : news.filter((n) => n.category === category)),
    [category],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('news.category')}>
        {['all', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setParam('category', c)}
            aria-pressed={category === c}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition ${
              category === c
                ? 'bg-navy-800 text-white'
                : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
            }`}
          >
            {c === 'all' ? t('list.all') : t(`categories.${c}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={current === 1}
            onClick={() => setParam('page', String(current - 1))}
            className="inline-flex min-h-12 items-center rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 disabled:opacity-40"
          >
            <span aria-hidden="true" className="flip-x inline-block">←</span> {t('pagination.prev')}
          </button>
          <span className="text-sm text-navy-600">{t('pagination.page', { page: current, total: totalPages })}</span>
          <button
            type="button"
            disabled={current === totalPages}
            onClick={() => setParam('page', String(current + 1))}
            className="inline-flex min-h-12 items-center rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 disabled:opacity-40"
          >
            {t('pagination.next')} <span aria-hidden="true" className="flip-x inline-block">→</span>
          </button>
        </nav>
      )}
    </>
  );
}
