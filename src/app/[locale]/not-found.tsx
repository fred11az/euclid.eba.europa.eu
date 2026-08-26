import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl font-bold text-navy-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy-900">{t('search.none')}</h1>
      <p className="mt-2 text-navy-600">{t('search.noneLead')}</p>
      <Link
        href="/institutions"
        className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-navy-800 px-6 font-semibold text-white hover:bg-navy-700"
      >
        {t('home.exploreCta')}
      </Link>
    </div>
  );
}
