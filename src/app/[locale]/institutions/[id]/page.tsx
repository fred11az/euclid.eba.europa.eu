import type { Metadata } from 'next';
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
  countryName,
  flag,
  getInstitution,
  institutions,
  licenceSlugFor,
  newsFor,
  similarTo,
  slugify,
  solidityBand,
  t as tr,
} from '@/lib/data';

/** Renders a fact value as a link when it has a page of its own. */
function FactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="underline decoration-navy-300 underline-offset-4 hover:text-navy-950">
      {children}
    </Link>
  );
}

const BAND = { high: 'bg-emerald-500', medium: 'bg-gold-500', low: 'bg-orange-500' } as const;

export function generateStaticParams() {
  return locales.flatMap((locale) => institutions.map((inst) => ({ locale, id: inst.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const inst = getInstitution(id);
  if (!inst) return {};
  return {
    title: tr(inst.name, locale),
    description: tr(inst.description, locale),
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

  const inst = getInstitution(id);
  if (!inst) notFound();

  const t = await getTranslations();
  const name = tr(inst.name, locale);
  const authority = authorities[inst.country];
  const related = newsFor(inst.id).slice(0, 3);
  const similar = similarTo(inst);
  const band = solidityBand(inst.solidityScore);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': inst.licenceType === 'CREDIT_INSTITUTION' ? 'BankOrCreditUnion' : 'FinancialService',
    name: inst.legalName,
    url: inst.website,
    description: tr(inst.description, locale),
    address: { '@type': 'PostalAddress', addressLocality: inst.city, addressCountry: inst.country },
    identifier: inst.bic,
    foundingDate: String(inst.founded),
  };

  const facts: Array<[string, React.ReactNode]> = [
    [t('detail.legalName'), inst.legalName],
    [
      t('detail.hq'),
      <span key="hq">
        {inst.city},{' '}
        <FactLink href={`/countries/${inst.country.toLowerCase()}`}>
          {countryName(inst.country, locale)}
        </FactLink>
      </span>,
    ],
    [
      t('detail.bic'),
      <span key="bic">
        <span className="font-mono">{inst.bic}</span>{' '}
        <FactLink href="/glossary/bic">?</FactLink>
      </span>,
    ],
    [
      t('detail.iban'),
      <span key="iban">
        <span className="font-mono">{inst.ibanPrefix}</span>{' '}
        <FactLink href="/glossary/iban">?</FactLink>
      </span>,
    ],
    [t('detail.founded'), inst.founded],
    [
      t('detail.regulators'),
      <span key="regs">
        {inst.regulators.map((r, i) => (
          <span key={r}>
            {i > 0 && ' · '}
            <FactLink href={`/supervisors/${slugify(r)}`}>{r}</FactLink>
          </span>
        ))}
      </span>,
    ],
    [
      t('detail.status'),
      <FactLink key="lic" href={`/licences/${licenceSlugFor(inst.licenceType)}`}>
        {t(`licence.${inst.licenceType}`)}
      </FactLink>,
    ],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <Link href="/institutions" className="inline-flex min-h-11 items-center text-sm text-navy-200 hover:text-white">
            <span aria-hidden="true" className="flip-x inline-block">←</span> {t('detail.back')}
          </Link>
          <div className="mt-3 flex flex-wrap items-start gap-4">
            <span aria-hidden="true" className="text-5xl leading-none">{flag(inst.country)}</span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-tight sm:text-4xl">{name}</h1>
              <p className="mt-1 text-navy-200">
                {inst.city} · {countryName(inst.country, locale)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="success"><span aria-hidden="true">✓</span> {t(`status.${inst.status}`)}</Badge>
                <Link href={`/licences/${licenceSlugFor(inst.licenceType)}`}>
                  <Badge tone="gold">{t(`licence.${inst.licenceType}`)}</Badge>
                </Link>
                <Badge>{t(`kinds.${inst.kind}`)}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-navy-900">{t('detail.overview')}</h2>
            <p className="mt-3 text-base leading-relaxed text-navy-700">{tr(inst.description, locale)}</p>

            <h2 className="mt-10 text-xl font-bold text-navy-900">{t('detail.identifiers')}</h2>
            <dl className="mt-3 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
              {facts.map(([label, value]) => (
                <div key={label} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                  <dt className="text-sm font-medium text-navy-500">{label}</dt>
                  <dd className="text-sm font-semibold text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 text-xl font-bold text-navy-900">{t('detail.compliance')}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {([
                [t('detail.psd2'), inst.psd2Compliant, 'psd2'],
                [t('detail.mifid'), inst.mifid2Compliant, 'mifid2'],
                [t('detail.passport'), inst.passporting, 'passporting'],
                [t('detail.deposit'), inst.depositGuarantee, 'deposit-guarantee'],
              ] as Array<[string, boolean, string]>).map(([label, ok, term]) => (
                <li key={label}>
                  <Link
                    href={`/glossary/${term}`}
                    className="flex min-h-14 items-center gap-2 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm transition hover:border-navy-300"
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        ok ? 'bg-emerald-500' : 'bg-navy-300'
                      }`}
                    >
                      {ok ? '✓' : '—'}
                    </span>
                    <span className="flex-1 text-navy-800">{label}</span>
                    <span aria-hidden="true" className="flip-x text-navy-300">›</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-navy-600">
              {inst.depositGuarantee ? t('detail.depositYes') : t('detail.depositNo')}
            </p>

            {related.length > 0 && (
              <>
                <h2 className="mt-10 text-xl font-bold text-navy-900">{t('detail.related')}</h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border-2 border-gold-500 bg-gold-500/10 p-5">
              <h2 className="text-lg font-bold text-navy-900">{t('detail.verify')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">{t('detail.verifyLead')}</p>
              <p className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-sm text-navy-900">{inst.legalName}</p>
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
                    {t('detail.officialRegister')}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path fill="currentColor" d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14zM5 5h5v2H6v11h11v-4h2v6H4V5z" />
                    </svg>
                  </a>
                </>
              )}
            </section>

            <section className="rounded-2xl border border-navy-100 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('detail.solidity')}</h2>
              <p className="mt-1 text-3xl font-bold text-navy-900">
                {inst.solidityScore}
                <span className="text-lg text-navy-400">/100</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
                <div className={`h-full rounded-full ${BAND[band]}`} style={{ width: `${inst.solidityScore}%` }} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-navy-500">{t('detail.solidityNote')}</p>
            </section>

            <section className="space-y-3">
              <a
                href={inst.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-navy-200 px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50"
              >
                {t('detail.visitSite')}
              </a>
              <ShareButtons title={name} />
            </section>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-500">{t('activities.title')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {inst.tags.map((tag) => (
              <LinkTile key={tag} href={`/activities/${tag}`} title={t(`tags.${tag}`)} />
            ))}
          </div>
        </section>

        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-navy-900">{t('detail.similar')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((s) => (
                <InstitutionCard key={s.id} inst={s} dense />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
