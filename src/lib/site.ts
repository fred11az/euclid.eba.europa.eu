/**
 * Absolute base for canonical URLs, hreflang alternates, Open Graph images and
 * the sitemap.
 *
 * Order matters. A hard-coded fallback is dangerous here: a canonical pointing
 * at a domain the site does not own tells search engines to index that domain
 * instead, and social crawlers fetch the preview image from it, so the share
 * card comes back empty. Vercel injects the two VERCEL_ variables at build
 * time, which keeps preview deployments self-referential and production on its
 * own domain even before a custom one is attached.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = 'Euclide EBA';
