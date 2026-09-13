'use client';

import { useTranslations } from 'next-intl';

interface Director {
  id: string;
  name: string;
  title: {
    en: string;
    fr: string;
    de: string;
    it: string;
    pt: string;
    es: string;
    ar: string;
  };
  image: string;
  bio: {
    en: string;
    fr: string;
    de: string;
    it: string;
    pt: string;
    es: string;
    ar: string;
  };
  email: string;
  phone: string;
}

interface DirectorsGridProps {
  directors: Director[];
  locale: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromInitials(initials: string): { bg: string; text: string } {
  const colors = [
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-purple-500', text: 'text-white' },
    { bg: 'bg-emerald-500', text: 'text-white' },
    { bg: 'bg-amber-500', text: 'text-white' },
    { bg: 'bg-rose-500', text: 'text-white' },
    { bg: 'bg-cyan-500', text: 'text-white' },
    { bg: 'bg-indigo-500', text: 'text-white' },
    { bg: 'bg-teal-500', text: 'text-white' },
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function DirectorsGrid({ directors, locale }: DirectorsGridProps) {
  const t = useTranslations();
  const lang = locale as keyof Director['title'];

  const [ceoDirector, ...otherDirectors] = directors;
  const ceoInitials = getInitials(ceoDirector.name);
  const ceoColor = getColorFromInitials(ceoInitials);

  return (
    <div className="space-y-12">
      {/* CEO Section - Featured */}
      <div className="rounded-2xl border-2 border-navy-200 bg-gradient-to-br from-navy-50 to-white p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <div className="flex justify-center md:justify-start">
            <div className={`h-64 w-64 rounded-xl shadow-md flex items-center justify-center ${ceoColor.bg}`}>
              <span className={`text-5xl font-bold ${ceoColor.text}`}>{ceoInitials}</span>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="inline-block rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white mb-2">
                {t('detail.ceo')}
              </div>
              <h3 className="text-2xl font-bold text-navy-900">{ceoDirector.name}</h3>
              <p className="mt-1 text-lg font-semibold text-navy-700">{ceoDirector.title[lang]}</p>
            </div>
            <p className="text-navy-700 leading-relaxed">{ceoDirector.bio[lang]}</p>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`mailto:${ceoDirector.email}`}
                className="inline-flex items-center text-sm text-navy-600 hover:text-navy-900 font-medium"
              >
                <span className="mr-2">✉</span> {ceoDirector.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Other Directors Grid */}
      {otherDirectors.length > 0 && (
        <div>
          <h3 className="mb-6 text-lg font-bold text-navy-900">{t('detail.executiveTeam')}</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherDirectors.map((director) => {
              const initials = getInitials(director.name);
              const color = getColorFromInitials(initials);
              return (
                <div
                  key={director.id}
                  className="overflow-hidden rounded-xl border border-navy-100 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className={`aspect-video flex items-center justify-center ${color.bg}`}>
                    <span className={`text-3xl font-bold ${color.text}`}>{initials}</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-navy-900">{director.name}</h4>
                    <p className="mt-1 text-sm font-medium text-navy-700">{director.title[lang]}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-navy-600 leading-relaxed">{director.bio[lang]}</p>
                    <div className="mt-4 space-y-2 border-t border-navy-100 pt-3">
                      <a
                        href={`mailto:${director.email}`}
                        className="block text-xs text-navy-600 hover:text-navy-900 font-medium truncate"
                        title={director.email}
                      >
                        {director.email}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
