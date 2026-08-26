'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SearchBox from './SearchBox';
import InstitutionCard from './InstitutionCard';
import NewsCard from './NewsCard';
import { searchInstitutions, suggestions } from '@/lib/search';
import { news, t as tr } from '@/lib/data';

export default function SearchResults() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const t = useTranslations('search');
  const tl = useTranslations('list');
  const locale = useLocale();

  const hits = useMemo(() => searchInstitutions(q), [q]);
  const near = useMemo(() => (hits.length === 0 ? suggestions(q) : []), [q, hits.length]);
  const newsHits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return news
      .filter((n) => tr(n.title, locale).toLowerCase().includes(needle) || n.source.toLowerCase().includes(needle))
      .slice(0, 4);
  }, [q, locale]);

  return (
    <>
      <div className="max-w-2xl">
        <SearchBox size="lg" autoFocus initialQuery={q} />
      </div>

      {q.trim().length < 2 ? (
        <p className="mt-8 text-navy-600">{t('empty')}</p>
      ) : (
        <>
          <p className="mt-8 text-sm text-navy-600" aria-live="polite">
            {t('resultsFor', { q })} — {tl('results', { count: hits.length })}
          </p>

          {hits.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hits.map((hit) => (
                <InstitutionCard key={hit.inst.id} inst={hit.inst} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-navy-200 p-8">
              <p className="text-lg font-semibold text-navy-900">{t('none')}</p>
              <p className="mt-2 text-navy-600">{t('noneLead')}</p>
              {near.length > 0 && (
                <p className="mt-4 text-navy-800">
                  {t('tryThese')}{' '}
                  {near.map((inst, i) => (
                    <span key={inst.id}>
                      {i > 0 && ', '}
                      <Link
                        href={`/institutions/${inst.id}`}
                        className="font-semibold underline underline-offset-4"
                      >
                        {tr(inst.name, locale)}
                      </Link>
                    </span>
                  ))}
                  {' ?'}
                </p>
              )}
            </div>
          )}

          {newsHits.length > 0 && (
            <>
              <h2 className="mt-12 text-xl font-bold text-navy-900">{t('news')}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {newsHits.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
