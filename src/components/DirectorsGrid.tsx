'use client';

import Image from 'next/image';
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
}

interface DirectorsGridProps {
  directors: Director[];
  locale: string;
}

export default function DirectorsGrid({ directors, locale }: DirectorsGridProps) {
  const t = useTranslations();
  const lang = locale as keyof Director['title'];

  const [ceoDirector, ...otherDirectors] = directors;

  return (
    <div className="space-y-12">
      {/* CEO Section - Featured */}
      <div className="rounded-2xl border-2 border-navy-200 bg-gradient-to-br from-navy-50 to-white p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <div className="flex justify-center md:justify-start">
            <Image
              src={ceoDirector.image}
              alt={ceoDirector.name}
              width={256}
              height={320}
              className="rounded-xl shadow-md object-cover"
            />
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
          </div>
        </div>
      </div>

      {/* Other Directors Grid */}
      {otherDirectors.length > 0 && (
        <div>
          <h3 className="mb-6 text-lg font-bold text-navy-900">{t('detail.executiveTeam')}</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherDirectors.map((director) => {
              return (
                <div
                  key={director.id}
                  className="overflow-hidden rounded-xl border border-navy-100 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative w-full aspect-video">
                    <Image
                      src={director.image}
                      alt={director.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-navy-900">{director.name}</h4>
                    <p className="mt-1 text-sm font-medium text-navy-700">{director.title[lang]}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-navy-600 leading-relaxed">{director.bio[lang]}</p>
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
