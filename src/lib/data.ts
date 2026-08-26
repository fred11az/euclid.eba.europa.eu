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
