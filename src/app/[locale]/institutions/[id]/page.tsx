import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import Badge from '@/components/Badge';
import InstitutionCard from '@/components/InstitutionCard';
import NewsCard from '@/components/NewsCard';
import ShareButtons from '@/components/ShareButtons';
import LinkTile from '@/components/LinkTile';
import {
  authorities,
  solidityBand,
  countryName,
  entities,
  flag,
  formatDate,
  getEntity,
  getInstitution,
  licenceSlugFor,
  newsFor,
  similarTo,
  slugify,
  t as tr,
} from '@/lib/data';

const BAND = { high: 'bg-emerald-500', medium: 'bg-gold-500', low: 'bg-orange-500' } as const;

export function generateStaticParams() {
  return locales.flatMap((locale) => entities.map((e) => ({ locale, id: e.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const e = getEntity(id);
  if (!e) return {};
  return {
    title: e.search_layer.legal_name,
    description: tr(e.search_layer.quick_summary, locale),
    alternates: {
      canonical: `/${locale}/institutions/${id}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/institutions/${id}`])),
        'x-default': `/en/institutions/${id}`,
      },
    },
  };
}

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const e = getEntity(id);
  const view = getInstitution(id);
  if (!e || !view) notFound();

  const t = await getTranslations();
  const s = e.search_layer;
  const d = e.detail_layer;
  const authority = authorities[s.country_code];
  const related = newsFor(e.id).slice(0, 3);
  const similar = similarTo(view);
  const band = solidityBand(d.solidity.score);


  const StatusChip = ({ status }: { status: string }) => {
    const tone =
      status === 'COMPLIANT' || status === 'CLEAR'
        ? 'success'
        : status === 'PENDING' || status === 'COMPLIANT_PENDING'
          ? 'warning'
          : 'neutral';
    return <Badge tone={tone}>{t(`cstatus.${status}` as 'cstatus.PENDING')}</Badge>;
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <section id={id} className="mt-10 scroll-mt-20">
      <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      {children}
    </section>
  );

  // A full record is long by nature; jumping beats scrolling on a phone.
  const contents: Array<[string, string]> = [
    ['identity', t('section.identity')],
    ['registration', t('section.registration')],
    ['contact', t('section.contact')],
    ['regulation', t('section.regulation')],
    ['passporting', t('section.passporting')],
    ['services', t('section.services')],
    ['compliance', t('detail.compliance')],
    ['group', t('section.group')],
  ];

  /** Rows without a value are omitted rather than rendered empty. */
  const Rows = ({ rows }: { rows: Array<[string, React.ReactNode]> }) => (
    <dl className="mt-3 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
      {rows
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([label, value]) => (
          <div key={label} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
            <dt className="text-sm font-medium text-navy-500">{label}</dt>
            <dd className="text-sm text-navy-900">{value}</dd>
          </div>
        ))}
    </dl>
  );

  const FactLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="font-semibold underline decoration-navy-300 underline-offset-4 hover:text-navy-950">
      {children}
    </Link>
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': e.entity_type === 'credit_institution' ? 'BankOrCreditUnion' : 'FinancialService',
    name: s.legal_name,
    alternateName: s.display_name,
    url: d.contact.communication.website,
    description: tr(s.quick_summary, locale),
    address: { '@type': 'PostalAddress', addressLocality: s.city, addressCountry: s.country_code },
    ...(d.registration.bic_swift ? { identifier: d.registration.bic_swift } : {}),
    foundingDate: d.registration.establishment_date,
  };

  const scope = Object.entries(d.regulation.authorization_scope);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <Link href="/institutions" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span>&nbsp;{t('detail.back')}
          </Link>
          <div className="mt-2 flex flex-wrap items-start gap-4">
            {s.logo_url ? (
              <span className="inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                <Image
                  src={s.logo_url}
                  alt={s.legal_name}
                  width={s.logo_width ?? 200}
                  height={s.logo_height ?? 80}
                  priority
                  className="h-12 w-auto object-contain sm:h-14"
                />
              </span>
            ) : (
              <span aria-hidden="true" className="text-5xl leading-none">{flag(s.country_code)}</span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-tight sm:text-4xl">{s.display_name}</h1>
              <p className="mt-1 text-navy-200">{s.legal_name}</p>
              <p className="mt-1 text-sm text-navy-300">
                <span aria-hidden="true">{flag(s.country_code)}</span> {s.city} ·{' '}
                <Link href={`/countries/${s.country_code.toLowerCase()}`} className="underline underline-offset-2">
                  {countryName(s.country_code, locale)}
                </Link>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="success">
                  <span aria-hidden="true">✓</span> {tr(s.status.labels, locale)}
                </Badge>
                <Link href={`/licences/${licenceSlugFor(e.metadata_internal.licence_type)}`}>
                  <Badge tone="goldOnDark">{t(`licence.${e.metadata_internal.licence_type}`)}</Badge>
                </Link>
                <Badge tone="onDark">{t(`kinds.${e.metadata_internal.kind}`)}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-base leading-relaxed text-navy-700">{tr(d.editorial.description, locale)}</p>

            <nav aria-label={t('section.contents')} className="mt-6 rounded-2xl border border-navy-100 bg-navy-50/60 p-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-navy-500">
                {t('section.contents')}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {contents.map(([anchor, label]) => (
                  <li key={anchor}>
                    <a
                      href={`#${anchor}`}
                      className="inline-flex min-h-10 items-center rounded-lg bg-white px-3 text-sm text-navy-700 ring-1 ring-navy-100 hover:text-navy-950"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <Section id="identity" title={t('section.identity')}>
              <Rows
                rows={[
                  [t('detail.legalName'), <span key="l" className="font-semibold">{d.identity.legal_name}</span>],
                  [t('field.legalForm'), <span key="f">{tr(d.identity.legal_form_label, locale)} ({d.identity.legal_form_code})</span>],
                  [t('field.entityType'), t(`licence.${e.metadata_internal.licence_type}`)],
                  [
                    t('field.commercialNames'),
                    d.identity.commercial_names.length ? d.identity.commercial_names.join(' · ') : null,
                  ],
                  [
                    t('field.parent'),
                    d.identity.parent_company
                      ? `${d.identity.parent_company.name} (${d.identity.parent_company.ownership_percentage} %)`
                      : null,
                  ],
                ]}
              />
            </Section>

            <Section id="registration" title={t('section.registration')}>
              <Rows
                rows={[
                  [
                    t('detail.bic'),
                    d.registration.bic_swift ? (
                      <span key="b">
                        <span className="font-mono font-semibold">{d.registration.bic_swift}</span>{' '}
                        <FactLink href="/glossary/bic">?</FactLink>
                      </span>
                    ) : null,
                  ],
                  [
                    t('detail.iban'),
                    <span key="i">
                      <span className="font-mono font-semibold">{s.country_code}</span>{' '}
                      <FactLink href="/glossary/iban">?</FactLink>
                    </span>,
                  ],
                  [t('field.established'), <span key="e" className="font-semibold">{d.registration.establishment_date}</span>],
                  [
                    t('field.lei'),
                    d.registration.lei_code ? (
                      <span key="lei" className="font-mono font-semibold">{d.registration.lei_code}</span>
                    ) : null,
                  ],
                  [t('field.regAuthority'), d.registration.registration_authority],
                  [t('field.regNumber'), d.registration.registration_number],
                  [t('field.vat'), d.registration.vat_id],
                ]}
              />
            </Section>

            <Section id="contact" title={t('section.contact')}>
              <Rows
                rows={[
                  [
                    t('field.address'),
                    d.contact.headquarters.street
                      ? `${d.contact.headquarters.street}, ${d.contact.headquarters.postal_code} ${s.city}`
                      : `${s.city}, ${countryName(s.country_code, locale)}`,
                  ],
                  [
                    t('field.email'),
                    d.contact.communication.email ? (
                      <a key="em" href={`mailto:${d.contact.communication.email}`} className="font-semibold underline underline-offset-4">
                        {d.contact.communication.email}
                      </a>
                    ) : null,
                  ],
                  [
                    t('field.phone'),
                    d.contact.communication.phone ? (
                      <a key="ph" href={`tel:${d.contact.communication.phone.replace(/\s/g, '')}`} className="font-semibold underline underline-offset-4">
                        {d.contact.communication.phone}
                      </a>
                    ) : null,
                  ],
                  [
                    t('detail.website'),
                    <a
                      key="w"
                      href={d.contact.communication.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline underline-offset-4"
                    >
                      {d.contact.communication.website.replace(/^https?:\/\//, '')}
                    </a>,
                  ],
                ]}
              />

              {d.contact.regional_contacts?.length ? (
                <Rows
                  rows={d.contact.regional_contacts.map(
                    (rc) =>
                      [
                        `${t('field.regionalContact')} — ${countryName(rc.country_code, locale)}`,
                        <a
                          key={rc.email}
                          href={`mailto:${rc.email}`}
                          className="font-semibold underline underline-offset-4"
                        >
                          {rc.email}
                        </a>,
                      ] as [string, React.ReactNode],
                  )}
                />
              ) : null}

              {Object.keys(d.contact.social_media).length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{t('field.social')}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(d.contact.social_media).map(([network, url]) => (
                      <a
                        key={network}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center rounded-lg border border-navy-200 px-3 text-sm capitalize text-navy-700 hover:bg-navy-50"
                      >
                        {network}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            <Section id="regulation" title={t('section.regulation')}>
              <Rows
                rows={[
                  [
                    t('home.supervisedBy'),
                    <FactLink key="ps" href={`/supervisors/${slugify(d.regulation.primary_supervisor.name)}`}>
                      {d.regulation.primary_supervisor.name}
                    </FactLink>,
                  ],
                  ...(d.regulation.secondary_supervisors.length
                    ? ([
                        [
                          t('detail.regulators'),
                          <span key="ss">
                            {d.regulation.secondary_supervisors.map((sup, i) => (
                              <span key={sup.name}>
                                {i > 0 && ' · '}
                                <FactLink href={`/supervisors/${slugify(sup.name)}`}>{sup.name}</FactLink>
                              </span>
                            ))}
                          </span>,
                        ],
                      ] as Array<[string, React.ReactNode]>)
                    : []),
                  [
                    t('detail.status'),
                    <span key="rs" className="font-semibold text-emerald-700">
                      {tr(d.regulation.regulatory_status.labels, locale)}
                      {d.regulation.regulatory_status.approval_date
                        ? ` — ${formatDate(d.regulation.regulatory_status.approval_date, locale)}`
                        : ''}
                    </span>,
                  ],
                ]}
              />

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-navy-500">{t('section.scope')}</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {scope.map(([key, allowed]) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        allowed ? 'bg-emerald-500' : 'bg-navy-300'
                      }`}
                    >
                      {allowed ? '✓' : '—'}
                    </span>
                    <span className={allowed ? 'text-navy-800' : 'text-navy-400'}>
                      {t(`scope.${key}` as 'scope.deposit_taking')}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="passporting" title={t('section.passporting')}>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{t('passport.lead')}</p>
              <details className="mt-3 rounded-2xl border border-navy-100 bg-white p-4">
                <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold text-navy-800">
                  {t('passport.showAll', { count: d.passporting.eligible_countries.length })}
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.passporting.eligible_countries.map((c) => (
                  <Link
                    key={c}
                    href={`/countries/${c.toLowerCase()}`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 text-sm text-navy-700 hover:border-navy-400"
                  >
                      <span aria-hidden="true">{flag(c)}</span>
                      {countryName(c, locale)}
                    </Link>
                  ))}
                </div>
              </details>
              <Link
                href="/glossary/passporting"
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-navy-700 underline underline-offset-4"
              >
                {t('common.learnMore')}
              </Link>
            </Section>

            <Section id="services" title={t('section.services')}>
              {(
                [
                  [t('services.banking'), d.services.banking_services],
                  [t('services.credit'), d.services.credit_services],
                ] as const
              )
                .filter(([, list]) => list.length > 0)
                .map(([label, list]) => (
                  <div key={label} className="mt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{label}</h3>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {list.map((svc) => (
                        <LinkTile key={svc.code} href={`/services/${svc.code.toLowerCase()}`} title={tr(svc.label, locale)} />
                      ))}
                    </div>
                  </div>
                ))}

              {d.services.islamic_finance_products.length > 0 && (
                <div className="mt-6 rounded-2xl border-2 border-gold-500 bg-gold-500/10 p-5">
                  <h3 className="text-lg font-bold text-navy-900">{t('services.islamic')}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-700">{t('services.islamicLead')}</p>
                  <dl className="mt-4 space-y-3">
                    {d.services.islamic_finance_products.map((prod) => (
                      <div key={prod.code} className="rounded-xl bg-white p-4">
                        <dt className="text-sm font-semibold text-navy-900">{tr(prod.label, locale)}</dt>
                        {prod.description && (
                          <dd className="mt-1 text-sm leading-relaxed text-navy-600">
                            {tr(prod.description, locale)}
                          </dd>
                        )}
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Section>

            <Section id="compliance" title={t('detail.compliance')}>
              <ul className="mt-3 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
                {(
                  [
                    [t('detail.deposit'), d.compliance.deposit_guarantee ? 'COMPLIANT' : 'NOT_APPLICABLE', 'deposit-guarantee'],
                    [t('detail.psd2'), d.compliance.psd2.status, 'psd2'],
                    [t('detail.mifid'), d.compliance.mifid2.status, 'mifid2'],
                    [t('compliance.psd3'), d.compliance.psd3.status, null],
                    [t('compliance.sanctions'), d.compliance.sanctions_screening.status, null],
                    [t('compliance.aml'), d.compliance.aml_kyc.status, null],
                    [t('compliance.gdpr'), d.compliance.gdpr.status, null],
                  ] as Array<[string, string, string | null]>
                )
                  // A status we cannot source is left out rather than shown as unknown.
                  .filter(([, status]) => status !== 'PENDING')
                  .map(([label, status, term]) => (
                  <li key={label} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <span className="text-sm text-navy-800">
                      {term ? <FactLink href={`/glossary/${term}`}>{label}</FactLink> : label}
                    </span>
                    <StatusChip status={status} />
                    </li>
                  ))}
              </ul>
              <p className="mt-3 text-sm text-navy-600">
                {d.compliance.deposit_guarantee ? t('detail.depositYes') : t('detail.depositNo')}
              </p>
            </Section>

            <Section id="group" title={t('section.group')}>
              {d.corporate_structure.parent_entity && (
                <Rows rows={[[t('field.parent'), d.corporate_structure.parent_entity.name]]} />
              )}

              {d.corporate_structure.branches.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-500">
                    {t('field.branches')}
                  </h3>
                  <div className="mt-2 space-y-3">
                    {d.corporate_structure.branches.map((b) => (
                      <div key={b.name} className="rounded-2xl border border-navy-100 bg-white p-4">
                        <p className="text-sm font-semibold text-navy-900">
                          <span aria-hidden="true">{flag(b.country)}</span> {b.name}
                        </p>
                        <dl className="mt-2 space-y-1 text-sm">
                          {(
                            [
                              [t('field.legalForm'), b.legal_form],
                              [
                                t('field.address'),
                                b.address
                                  ? `${b.address.street}, ${b.address.postal_code} ${b.address.city}, ${countryName(b.address.country_code, locale)}`
                                  : b.city,
                              ],
                              [t('field.regNumber'), b.registration_number],
                              [
                                t('home.supervisedBy'),
                                <FactLink key={b.regulator} href={`/supervisors/${slugify(b.regulator)}`}>
                                  {b.regulator}
                                </FactLink>,
                              ],
                              [t('field.supervisorRef'), b.reference],
                              [
                                t('detail.iban'),
                                b.iban_prefix ? <span key="ib" className="font-mono">{b.iban_prefix}</span> : null,
                              ],
                            ] as Array<[string, React.ReactNode]>
                          )
                            .filter(([, v]) => v !== null && v !== undefined && v !== '')
                            .map(([label, value]) => (
                              <div key={label} className="flex flex-wrap gap-x-2">
                                <dt className="text-navy-500">{label} :</dt>
                                <dd className="font-medium text-navy-900">{value}</dd>
                              </div>
                            ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!d.corporate_structure.parent_entity && d.corporate_structure.branches.length === 0 && (
                <p className="mt-3 rounded-xl bg-navy-50 p-4 text-sm text-navy-600">{t('group.none')}</p>
              )}

              {d.service_channels?.remote && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-500">
                    {t('channels.title')}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-700">{t('channels.remote')}</p>
                </div>
              )}
            </Section>

            {d.editorial.certifications.length > 0 && (
              <Section id="certifications" title={t('field.certifications')}>
                <ul className="mt-3 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
                  {d.editorial.certifications.map((cert) => (
                    <li key={cert.name} className="px-4 py-3">
                      <p className="text-sm font-semibold text-navy-900">{cert.name}</p>
                      <p className="mt-0.5 text-xs text-navy-500">
                        {t('field.issuedBy')} {cert.issuer} · {t('field.validUntil')}{' '}
                        {formatDate(cert.validity_until, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {related.length > 0 && (
              <Section id="related" title={t('detail.related')}>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border-2 border-gold-500 bg-gold-500/10 p-5">
              <h2 className="text-lg font-bold text-navy-900">{t('detail.verify')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">{t('detail.verifyLead')}</p>
              <p className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-sm text-navy-900">{s.legal_name}</p>
              {authority && (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-navy-500">
                    {t('home.supervisedBy')}
                  </p>
                  <p className="text-sm text-navy-800">{authority.authority}</p>
                  <a
                    href={authority.register}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700"
                  >
                    {t('detail.officialRegister')} ↗
                  </a>
                </>
              )}
            </section>

            <section className="rounded-2xl border border-navy-100 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('detail.solidity')}</h2>
              <p className="mt-1 text-4xl font-bold text-navy-900">
                {d.solidity.score}
                <span className="text-lg text-navy-400">/100</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
                <div className={`h-full rounded-full ${BAND[band]}`} style={{ width: `${d.solidity.score}%` }} />
              </div>

              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-navy-500">
                {t('solidity.factors')}
              </h3>
              <dl className="mt-2 space-y-2">
                {(
                  [
                    ['guarantee', 30],
                    ['supervision', 25],
                    ['longevity', 20],
                    ['breadth', 20],
                    ['passport', 5],
                    ['editorial', 20],
                  ] as Array<[string, number]>
                ).map(([key, max]) => (
                  <div key={key}>
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <dt className="text-navy-600">{t(`solidity.${key}` as 'solidity.guarantee')}</dt>
                      <dd className="font-semibold text-navy-800">
                        {d.solidity.components[key]}
                        <span className="text-navy-400">/{max}</span>
                      </dd>
                    </div>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-navy-100">
                      <div
                        className="h-full rounded-full bg-navy-400"
                        style={{ width: `${(d.solidity.components[key] / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-navy-500">{t('detail.solidityNote')}</p>
            </section>

            <section className="rounded-2xl border border-navy-100 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('section.quality')}</h2>
              {e.source_verified && (
                <p className="mt-2">
                  <Badge tone="success">{t('quality.verified')}</Badge>
                </p>
              )}
              <dl className="mt-3 space-y-2 text-xs">
                <dt className="font-semibold uppercase tracking-wide text-navy-500">{t('quality.sources')}</dt>
                <dd className="text-navy-700">
                  <ul className="list-inside list-disc space-y-0.5">
                    {e.metadata_internal.sources.map((src) => (
                      <li key={src}>{src}</li>
                    ))}
                  </ul>
                </dd>
                <dt className="pt-2 font-semibold uppercase tracking-wide text-navy-500">{t('quality.nextRefresh')}</dt>
                <dd className="text-navy-700">{formatDate(e.metadata_internal.next_refresh, locale)}</dd>
              </dl>
            </section>

            <section className="space-y-3">
              <a
                href={d.contact.communication.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50"
              >
                {t('detail.visitSite')}
              </a>
              <ShareButtons title={s.legal_name} />
            </section>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('activities.title')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.metadata_internal.tags.map((tag) => (
              <LinkTile key={tag} href={`/activities/${tag}`} title={t(`tags.${tag}`)} />
            ))}
          </div>
        </section>

        {similar.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy-900">{t('detail.similar')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((x) => (
                <InstitutionCard key={x.id} inst={x} dense />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
