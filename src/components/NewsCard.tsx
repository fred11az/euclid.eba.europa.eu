import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatDate, getInstitution, t as tr, type NewsItem } from '@/lib/data';
import Badge from './Badge';

export default function NewsCard({ item }: { item: NewsItem }) {
  const locale = useLocale();
  const t = useTranslations();
  const inst = getInstitution(item.institutionId);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="gold">{t(`categories.${item.category}`)}</Badge>
        <time dateTime={item.date} className="text-xs text-navy-500">
          {formatDate(item.date, locale)}
        </time>
      </div>
      <h3 className="mt-2 text-base font-semibold leading-snug text-navy-900">{tr(item.title, locale)}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600">{tr(item.snippet, locale)}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-sm">
        {inst && (
          <Link href={`/institutions/${inst.id}`} className="font-medium text-navy-700 underline underline-offset-2 hover:text-navy-900">
            {tr(inst.name, locale)}
          </Link>
        )}
        <span className="text-xs text-navy-500">
          {t('news.source')} : {item.source}
        </span>
      </div>
    </article>
  );
}
