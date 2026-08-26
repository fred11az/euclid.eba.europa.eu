import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import InstitutionCard from '@/components/InstitutionCard';
import LinkTile from '@/components/LinkTile';
import { institutionsWithTag, tags } from '@/lib/data';

export function generateStaticParams() {
  return locales.flatMap((locale) => tags.map((tag) => ({ locale, tag })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  if (!tags.includes(tag)) return {};
  const t = await getTranslations({ locale });
  return {
    title: t(`tags.${tag}`),
    description: t('activities.intro', { count: institutionsWithTag(tag).length }),
    alternates: {
      canonical: `/${locale}/activities/${tag}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/activities/${tag}`])),
    },
  };
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);
  if (!tags.includes(tag)) notFound();

  const t = await getTranslations();
  const list = institutionsWithTag(tag);

  return (
    <>
      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link href="/activities" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('activities.title')}
          </Link>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">{t(`tags.${tag}`)}</h1>
          <p className="mt-2 text-sm text-navy-200">{t('activities.intro', { count: list.length })}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((inst) => (
            <InstitutionCard key={inst.id} inst={inst} dense />
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('activities.title')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tags
              .filter((x) => x !== tag)
              .map((x) => (
                <LinkTile
                  key={x}
                  href={`/activities/${x}`}
                  title={t(`tags.${x}`)}
                  meta={t('list.results', { count: institutionsWithTag(x).length })}
                />
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
