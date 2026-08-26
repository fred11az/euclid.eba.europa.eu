import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://euclide-eba.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/*/search' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
