import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import {
  countryCodes,
  glossary,
  institutions,
  licences,
  news,
  serviceCodes,
  supervisorIndex,
  tags,
} from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://euclide-eba.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/institutions',
    '/countries',
    '/supervisors',
    '/activities',
    '/services',
    '/licences',
    '/glossary',
    '/news',
    '/about',
  ];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '/news' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        },
      });
    }
    const detail: string[] = [
      ...institutions.map((i) => `/institutions/${i.id}`),
      ...countryCodes.map((c) => `/countries/${c.toLowerCase()}`),
      ...supervisorIndex.map((s) => `/supervisors/${s.slug}`),
      ...tags.map((t) => `/activities/${t}`),
      ...serviceCodes.map((c) => `/services/${c.toLowerCase()}`),
      ...licences.map((l) => `/licences/${l.slug}`),
      ...glossary.map((g) => `/glossary/${g.slug}`),
      ...news.map((n) => `/news/${n.id}`),
    ];
    for (const path of detail) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        },
      });
    }
  }
  return entries;
}
