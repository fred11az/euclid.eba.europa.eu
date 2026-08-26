import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { institutions } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://euclide-eba.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/institutions', '/news', '/about'];
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
    for (const inst of institutions) {
      entries.push({
        url: `${SITE_URL}/${locale}/institutions/${inst.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/institutions/${inst.id}`]),
          ),
        },
      });
    }
  }
  return entries;
}
