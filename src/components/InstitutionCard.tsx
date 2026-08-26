import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { completenessBand, countryName, flag, t as tr, type Institution } from '@/lib/data';
import Badge from './Badge';

const BAND = {
  high: 'bg-emerald-500',
  medium: 'bg-gold-500',
  low: 'bg-orange-500',
} as const;

export default function InstitutionCard({ inst, dense = false }: { inst: Institution; dense?: boolean }) {
  const locale = useLocale();
  const t = useTranslations();
  const band = completenessBand(inst.completeness);

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition hover:border-navy-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="text-2xl leading-none">{flag(inst.country)}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-navy-900">
            <Link href={`/institutions/${inst.id}`} className="after:absolute after:inset-0">
              {tr(inst.name, locale)}
            </Link>
          </h3>
          <p className="relative z-10 mt-0.5 text-sm text-navy-500">
            {inst.city} ·{' '}
            <Link
              href={`/countries/${inst.country.toLowerCase()}`}
              className="underline decoration-navy-300 underline-offset-2 hover:text-navy-800"
            >
              {countryName(inst.country, locale)}
            </Link>
          </p>
        </div>
      </div>

      {!dense && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">{tr(inst.description, locale)}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge tone="success">
          <span aria-hidden="true">✓</span> {t(`status.${inst.status}`)}
        </Badge>
        <Badge>{t(`kinds.${inst.kind}`)}</Badge>
        {inst.depositGuarantee && <Badge tone="gold">{t('detail.deposit')}</Badge>}
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between text-xs text-navy-500">
          <span>{t('quality.completeness')}</span>
          <span className="font-semibold text-navy-800">{Math.round(inst.completeness * 100)}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
          <div className={`h-full rounded-full ${BAND[band]}`} style={{ width: `${Math.round(inst.completeness * 100)}%` }} />
        </div>
      </div>
    </article>
  );
}
