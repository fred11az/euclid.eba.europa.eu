'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { authorities, countryCodes, countryName, flag, institutions } from '@/lib/data';
import Badge from './Badge';

export default function CountryPicker() {
  const t = useTranslations('home');
  const tl = useTranslations('list');
  const locale = useLocale();
  const [code, setCode] = useState('');

  const sorted = [...countryCodes].sort((a, b) =>
    countryName(a, locale).localeCompare(countryName(b, locale), locale),
  );
  const authority = code ? authorities[code] : undefined;
  const count = code ? institutions.filter((i) => i.country === code).length : 0;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
      <label className="block">
        <span className="text-sm font-semibold text-navy-800">{t('chooseCountry')}</span>
        <select
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-navy-200 bg-white px-3 text-base text-navy-900"
        >
          <option value="">— {t('chooseCountry')} —</option>
          {sorted.map((c) => (
            <option key={c} value={c}>
              {countryName(c, locale)}
            </option>
          ))}
        </select>
      </label>

      {authority && (
        <div className="mt-4 rounded-xl bg-navy-50 p-4">
          <p className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <span aria-hidden="true">{flag(code)}</span>
            {countryName(code, locale)}
          </p>
          <dl className="mt-3 space-y-1 text-sm">
            <dt className="font-medium text-navy-500">{t('supervisedBy')}</dt>
            <dd className="text-navy-900">{authority.authority}</dd>
          </dl>
          {authority.ssm && (
            <p className="mt-2">
              <Badge tone="gold">{t('ssm')}</Badge>
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={{ pathname: '/institutions', query: { country: code } }}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700"
            >
              {tl('results', { count })}
            </Link>
            <a
              href={authority.register}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-navy-300 px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              {t('seeRegister')}
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14zM5 5h5v2H6v11h11v-4h2v6H4V5z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
