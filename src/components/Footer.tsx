import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { DATA_REVIEWED } from '@/lib/data';
import LocaleLinks from './LocaleLinks';

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-white">Euclide EBA</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-navy-200">{t('footer.disclaimer')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-400">{t('footer.sections')}</p>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              {(
                [
                  ['/institutions', 'nav.institutions'],
                  ['/countries', 'nav.countries'],
                  ['/supervisors', 'nav.supervisors'],
                  ['/activities', 'activities.title'],
                  ['/services', 'nav.services'],
                  ['/licences', 'licences.title'],
                  ['/glossary', 'nav.glossary'],
                  ['/news', 'nav.news'],
                  ['/search', 'nav.search'],
                  ['/about', 'nav.about'],
                ] as const
              ).map(([href, key]) => (
                <li key={href}>
                  <Link className="inline-flex min-h-9 items-center hover:text-white" href={href}>
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav aria-label={t('nav.language')} className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-400">{t('nav.language')}</p>
          <LocaleLinks />
        </nav>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Euclide EBA. {t('footer.rights')}</p>
          <p>{t('footer.updated')} : <time dateTime={DATA_REVIEWED}>{DATA_REVIEWED}</time></p>
        </div>
      </div>
    </footer>
  );
}
