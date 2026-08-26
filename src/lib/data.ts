import institutionsRaw from '@/data/institutions.json';
import newsRaw from '@/data/news.json';
import authoritiesRaw from '@/data/authorities.json';
import type { Locale } from '@/i18n/routing';

export type Localized = Record<string, string>;

export type Institution = {
  id: string;
  name: Localized;
  legalName: string;
  country: string;
  city: string;
  kind: string;
  logo: string | null;
  website: string;
  bic: string;
  ibanPrefix: string;
  lei: string | null;
  founded: number;
  regulators: string[];
  status: 'AUTHORIZED';
  licenceType: 'CREDIT_INSTITUTION' | 'PAYMENT_INSTITUTION' | 'EMONEY_INSTITUTION';
  depositGuarantee: boolean;
  mifid2Compliant: boolean;
  psd2Compliant: boolean;
  passporting: boolean;
  description: Localized;
  tags: string[];
  solidityScore: number;
};

export type NewsItem = {
  id: string;
  institutionId: string;
  country: string;
  date: string;
  category: string;
  title: Localized;
  snippet: Localized;
  source: string;
  sourceUrl: string;
};

export type Authority = { authority: string; register: string; ssm: boolean };

export const institutions = institutionsRaw as Institution[];
export const news = newsRaw as NewsItem[];
export const authorities = authoritiesRaw as Record<string, Authority>;

export const countryCodes = [...new Set(institutions.map((i) => i.country))].sort();
export const kinds = [...new Set(institutions.map((i) => i.kind))].sort();
export const tags = [...new Set(institutions.flatMap((i) => i.tags))].sort();
export const regulators = [...new Set(institutions.flatMap((i) => i.regulators))].sort();
export const categories = [...new Set(news.map((n) => n.category))];

export const DATA_REVIEWED = '2026-08-20';

export function t(field: Localized, locale: string): string {
  return field[locale] ?? field.en ?? Object.values(field)[0] ?? '';
}

export function getInstitution(id: string): Institution | undefined {
  return institutions.find((i) => i.id === id);
}

export function newsFor(id: string): NewsItem[] {
  return news.filter((n) => n.institutionId === id);
}

export function similarTo(inst: Institution, limit = 4): Institution[] {
  return institutions
    .filter((i) => i.id !== inst.id)
    .map((i) => {
      let score = 0;
      if (i.country === inst.country) score += 3;
      if (i.kind === inst.kind) score += 2;
      score += i.tags.filter((tag) => inst.tags.includes(tag)).length;
      return { i, score };
    })
    .sort((a, b) => b.score - a.score || a.i.legalName.localeCompare(b.i.legalName))
    .slice(0, limit)
    .map((x) => x.i);
}

/** ISO 3166-1 alpha-2 -> regional indicator flag. */
export function flag(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

export function countryName(code: string, locale: Locale | string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function formatDate(date: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date));
  } catch {
    return date;
  }
}

export function solidityBand(score: number): 'high' | 'medium' | 'low' {
  if (score >= 78) return 'high';
  if (score >= 72) return 'medium';
  return 'low';
}

/* ------------------------------------------------------------------ */
/* Sub-page taxonomies                                                 */
/* ------------------------------------------------------------------ */

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Every distinct supervisor, with a stable slug and the entities it covers. */
export const supervisorIndex = regulators.map((name) => {
  const supervised = institutions.filter((i) => i.regulators.includes(name));
  return {
    slug: slugify(name),
    name,
    supervised,
    countries: [...new Set(supervised.map((i) => i.country))].sort(),
  };
});

export function getSupervisor(slug: string) {
  return supervisorIndex.find((s) => s.slug === slug);
}

export function institutionsIn(country: string) {
  return institutions
    .filter((i) => i.country === country)
    .sort((a, b) => a.legalName.localeCompare(b.legalName));
}

export function newsIn(country: string) {
  return news.filter((n) => n.country === country);
}

export function institutionsWithTag(tag: string) {
  return institutions.filter((i) => i.tags.includes(tag));
}

export function institutionsWithLicence(type: Institution['licenceType']) {
  return institutions.filter((i) => i.licenceType === type);
}

export function getNews(id: string) {
  return news.find((n) => n.id === id);
}

export function relatedNews(item: NewsItem, limit = 3) {
  return news
    .filter((n) => n.id !== item.id && (n.category === item.category || n.country === item.country))
    .slice(0, limit);
}

/* ---- Editorial content (glossary, licence explainers) ---- */

import contentRaw from '@/data/content.json';

export type GlossaryTerm = { slug: string; label: Localized; body: Localized };
export type LicenceExplainer = {
  slug: string;
  type: Institution['licenceType'];
  summary: Localized;
  protects: Localized;
};

export const glossary = (contentRaw as { glossary: GlossaryTerm[] }).glossary;
export const licences = (contentRaw as { licences: LicenceExplainer[] }).licences;

export const getTerm = (slug: string) => glossary.find((g) => g.slug === slug);
export const getLicence = (slug: string) => licences.find((l) => l.slug === slug);
export const licenceSlugFor = (type: Institution['licenceType']) =>
  licences.find((l) => l.type === type)?.slug ?? '';
