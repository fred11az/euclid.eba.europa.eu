import institutionsRaw from '@/data/institutions.json';
import newsRaw from '@/data/news.json';
import authoritiesRaw from '@/data/authorities.json';
import type { Locale } from '@/i18n/routing';

export type Localized = Record<string, string>;

/* ------------------------------------------------------------------ */
/* Two-layer entity schema (search_layer / detail_layer)               */
/* ------------------------------------------------------------------ */

export type LicenceType = 'CREDIT_INSTITUTION' | 'PAYMENT_INSTITUTION' | 'EMONEY_INSTITUTION';

export type ServiceEntry = {
  code: string;
  label: Localized;
  description?: Localized;
  islamic_compliant?: boolean;
  compliant?: boolean;
};

export type Supervisor = { code: string; name: string; country_code: string };

export type Entity = {
  id: string;
  entity_type: string;
  entity_subtype: string;
  source_verified: boolean;
  search_layer: {
    display_name: string;
    legal_name: string;
    country_code: string;
    city: string;
    logo_url: string | null;
    logo_width?: number;
    logo_height?: number;
    regulator_primary: string;
    status: { code: string; labels: Localized; color_badge: string };
    specialization_tags: string[];
    quick_summary: Localized;
  };
  detail_layer: {
    identity: {
      legal_name: string;
      legal_names_translations: Localized;
      commercial_names: string[];
      legal_form_code: string;
      legal_form_label: Localized;
      parent_company: { id: string; name: string; country_code: string; ownership_percentage: number } | null;
    };
    registration: {
      registration_number: string | null;
      registration_authority: string | null;
      registration_date: string | null;
      establishment_date: string;
      lei_code: string | null;
      bic_swift: string | null;
      vat_id: string | null;
      pending_source: boolean;
    };
    contact: {
      headquarters: {
        street: string | null;
        postal_code: string | null;
        city: string;
        country_code: string;
        pending_source: boolean;
      };
      communication: { email: string | null; phone: string | null; website: string };
      social_media: Record<string, string>;
    };
    regulation: {
      primary_supervisor: Supervisor;
      secondary_supervisors: Supervisor[];
      regulatory_status: { code: string; labels: Localized; approval_date: string | null };
      authorization_scope: Record<string, boolean>;
    };
    passporting: {
      status: string;
      eligible_eea: boolean;
      eligible_eu: boolean;
      eligible_countries: string[];
    };
    services: {
      banking_services: ServiceEntry[];
      credit_services: ServiceEntry[];
      islamic_finance_products: ServiceEntry[];
    };
    compliance: {
      sanctions_screening: { status: string; last_checked: string | null };
      aml_kyc: { status: string; last_audit: string | null };
      mifid2: { status: string };
      psd2: { status: string; strong_authentication: boolean; open_banking: boolean };
      psd3: { status: string; pending_source: boolean };
      gdpr: { status: string };
      deposit_guarantee: boolean;
    };
    corporate_structure: {
      parent_entity: { name: string; country: string } | null;
      subsidiaries: unknown[];
      branches: { name: string; country: string; city: string; regulator: string }[];
      pending_source: boolean;
    };
    financial_metrics: { pending_source: boolean; [k: string]: unknown };
    editorial: {
      description: Localized;
      certifications: {
        name: string;
        issuer: string;
        certification_date: string;
        validity_until: string;
      }[];
    };
    solidity: { score: number; components: Record<string, number> };
  };
  metadata_internal: {
    data_quality_score: number;
    completeness_score: number;
    sources: string[];
    next_refresh: string;
    flags: string[];
    licence_type: LicenceType;
    kind: string;
    tags: string[];
    founded: number;
  };
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

export const entities = institutionsRaw as unknown as Entity[];
export const news = newsRaw as NewsItem[];
export const authorities = authoritiesRaw as Record<string, Authority>;

/**
 * Flat projection of the search layer. Cards, lists and the search index only
 * ever need this; the full entity is reserved for the record page.
 */
export type Institution = {
  id: string;
  name: Localized;
  legalName: string;
  displayName: string;
  country: string;
  city: string;
  kind: string;
  entityType: string;
  website: string;
  bic: string | null;
  ibanPrefix: string;
  founded: number;
  regulators: string[];
  status: string;
  licenceType: LicenceType;
  depositGuarantee: boolean;
  description: Localized;
  tags: string[];
  completeness: number;
  verified: boolean;
  solidityScore: number;
  logo: string | null;
};

function toView(e: Entity): Institution {
  const s = e.search_layer;
  const d = e.detail_layer;
  return {
    id: e.id,
    name: d.identity.legal_names_translations,
    legalName: s.legal_name,
    displayName: s.display_name,
    country: s.country_code,
    city: s.city,
    kind: e.metadata_internal.kind,
    entityType: e.entity_type,
    website: d.contact.communication.website,
    bic: d.registration.bic_swift,
    ibanPrefix: s.country_code,
    founded: e.metadata_internal.founded,
    regulators: [d.regulation.primary_supervisor.name, ...d.regulation.secondary_supervisors.map((x) => x.name)],
    status: 'AUTHORIZED',
    licenceType: e.metadata_internal.licence_type,
    depositGuarantee: d.compliance.deposit_guarantee,
    description: s.quick_summary,
    tags: e.metadata_internal.tags,
    completeness: e.metadata_internal.completeness_score,
    verified: e.source_verified,
    solidityScore: d.solidity.score,
    logo: s.logo_url,
  };
}

export const institutions: Institution[] = entities.map(toView);

export const countryCodes = [...new Set(institutions.map((i) => i.country))].sort();
export const kinds = [...new Set(institutions.map((i) => i.kind))].sort();
export const tags = [...new Set(institutions.flatMap((i) => i.tags))].sort();
export const regulators = [...new Set(institutions.flatMap((i) => i.regulators))].sort();
export const categories = [...new Set(news.map((n) => n.category))];
export const serviceCodes = [
  ...new Set(
    entities.flatMap((e) => [
      ...e.detail_layer.services.banking_services.map((x) => x.code),
      ...e.detail_layer.services.credit_services.map((x) => x.code),
    ]),
  ),
].sort();

export const DATA_REVIEWED = '2026-08-26';

export function t(field: Localized, locale: string): string {
  return field[locale] ?? field.en ?? Object.values(field)[0] ?? '';
}

export function getEntity(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function entitiesWithService(code: string): Entity[] {
  return entities.filter((e) =>
    [...e.detail_layer.services.banking_services, ...e.detail_layer.services.credit_services].some(
      (s) => s.code === code,
    ),
  );
}

export function serviceLabel(code: string): Localized {
  for (const e of entities) {
    const hit = [...e.detail_layer.services.banking_services, ...e.detail_layer.services.credit_services].find(
      (s) => s.code === code,
    );
    if (hit) return hit.label;
  }
  return { en: code };
}

export const islamicEntities = entities.filter(
  (e) => e.detail_layer.services.islamic_finance_products.length > 0,
);

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

/** Visual band for the solidity meter. Editorial, not a credit rating. */
export function solidityBand(score: number): 'high' | 'medium' | 'low' {
  if (score >= 85) return 'high';
  if (score >= 70) return 'medium';
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
