# Euclide EBA

Site vitrine multilingue permettant à toute personne — dans l'Union européenne
comme ailleurs — de vérifier **quels établissements financiers sont autorisés à
exercer dans un pays européen donné**, et de remonter au registre officiel de
l'autorité compétente.

La plateforme est **mobile first**, statique (JAMstack, aucun backend) et
disponible en **7 langues**, arabe RTL compris.

---

## Stack

| Domaine | Choix |
| --- | --- |
| Framework | Next.js 15 (App Router, SSG) |
| Styles | Tailwind CSS v4 (tokens de marque EBA) |
| i18n | `next-intl` — routage `/{locale}/…`, détection `Accept-Language` |
| Données | JSON embarqué dans le repo (`src/data/`), schéma deux couches |
| Recherche | Index local, sans dépendance (voir plus bas) |
| Hébergement | Vercel (zero-config) |

### Pourquoi pas Lunr.js

Le corpus tient en quelques dizaines d'enregistrements. Un index Lunr coûterait
plus de poids de bundle qu'il n'en ferait gagner : `src/lib/search.ts` implémente
une recherche normalisée (tokens + sous-chaînes) avec tolérance aux fautes de
frappe par distance d'édition. Réponse en bien moins d'une milliseconde, zéro
dépendance. Si le corpus dépasse quelques milliers d'entrées, basculer sur un
index pré-calculé au build.

---

## Modèle de données

Les fiches suivent le schéma **deux couches** défini dans
`euclide-eba-data-model.json` :

- **`search_layer`** — ce qui suffit à une carte, une liste ou l'index de
  recherche : `display_name`, `legal_name`, `country_code`, `city`,
  `regulator_primary`, `status`, `specialization_tags`, `quick_summary`.
- **`detail_layer`** — la fiche complète : `identity`, `registration`,
  `contact`, `regulation` (superviseur principal + secondaires,
  `authorization_scope`), `passporting`, `services` (bancaires, crédit,
  finance islamique), `compliance`, `corporate_structure`,
  `financial_metrics`, `editorial`.
- **`metadata_internal`** — `completeness_score`, `sources`, `next_refresh`,
  `flags`.

`src/lib/data.ts` expose les entités complètes (`entities`, `getEntity`) pour
la fiche, et une projection plate de la couche de recherche (`institutions`)
pour les cartes, listes et l'index — la couche détail n'est jamais chargée
pour afficher une vignette.

### `pending_source` : ne rien inventer

Le schéma prévoit un drapeau `pending_source`. Il est respecté à la lettre :
LEI, numéro d'enregistrement, TVA, adresse postale, téléphone, courriel,
ratios prudentiels ne sont **pas** renseignés tant qu'ils ne peuvent pas être
repris d'une source vérifiable. L'interface affiche « Source en attente »
plutôt qu'une valeur plausible mais fausse.

### Indicateur de solidité : retiré

Le modèle ne comporte pas de champ de solidité — il a `financial_metrics`
(en attente de source) et `completeness_score`. Le score /100 inventé du
premier jet a donc été supprimé de l'interface au profit de la **complétude
de la fiche**, qui mesure la donnée et non la banque. C'est plus honnête :
publier une note de solidité maison sur des banques réelles était le point
le plus risqué du projet.

---

## Langues

`en` (défaut) · `fr` · `de` · `it` · `pt` · `es` · `ar` (RTL complet)

Les 146 clés d'interface sont traduites dans les 7 langues
(`messages/{locale}.json`). Les descriptions d'établissements et les actualités
sont composées à partir de gabarits de phrase rédigés dans chaque langue
(`scripts/build-data.mjs`) — ce ne sont pas des traductions automatiques.

Le RTL n'est pas seulement `dir="rtl"` : toute la mise en page utilise des
propriétés logiques (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`), et les flèches
directionnelles sont retournées via l'utilitaire `.flip-x`.

---

## Pages

| Route | Rôle |
| --- | --- |
| `/{locale}` | Accueil : recherche, sélecteur de pays + superviseur, 3 étapes de vérification, actualités |
| `/{locale}/institutions` | Explorateur : filtres pays / type / activité / superviseur, tri, pagination — **état porté par l'URL** |
| `/{locale}/institutions/[id]` | Fiche : identifiants, cadre réglementaire, garantie des dépôts, **bloc de vérification au registre officiel**, actualités liées, comparables |
| `/{locale}/search?q=` | Recherche plein texte avec autocomplétion et « vouliez-vous dire » |
| `/{locale}/news` | Fil d'actualités filtrable par catégorie |
| `/{locale}/countries/[code]` | Autorité compétente, registre officiel, agréments, établissements et actualités du pays |
| `/{locale}/supervisors/[slug]` | Une page par autorité : pays couverts, établissements supervisés |
| `/{locale}/licences/[slug]` | Ce qu'autorise chaque agrément et **ce qu'il protège vraiment** |
| `/{locale}/services/[code]` | Qui est autorisé à proposer chaque service |
| `/{locale}/activities/[tag]` | Établissements par segment d'activité |
| `/{locale}/glossary/[slug]` | 8 termes d'une fiche d'agrément, en langage clair |
| `/{locale}/news/[id]` | Actualité détaillée, reliée à la banque, au pays, au superviseur |
| `/{locale}/about` | Mission, méthodologie, limites + **table des 30 registres nationaux** |

`sitemap.xml`, `robots.txt`, balises `hreflang`, Open Graph et JSON-LD
(`BankOrCreditUnion` / `FinancialService`) sont générés automatiquement.

---

## Développement

```bash
npm install
npm run dev      # http://localhost:3000 → redirige selon Accept-Language
npm run build    # génère 539 fiches statiques (77 établissements × 7 langues)
npm start
```

## Mise à jour des données

Les sources de vérité sont les tableaux structurés de `scripts/build-data.mjs`
(établissements, gabarits d'actualités) et `src/data/authorities.json`
(autorité + registre officiel par pays).

```bash
npm run data     # régénère src/data/*.json et messages/*.json
```

Ajouter un établissement = une ligne dans le tableau `R` de
`scripts/build-data.mjs` ; les 7 descriptions sont composées automatiquement.

## Déploiement

Vercel détecte Next.js sans configuration. Une seule variable est utile :

```
NEXT_PUBLIC_SITE_URL=https://votre-domaine.eu
```

Elle alimente les URL canoniques, `hreflang` et le sitemap.

---

## Périmètre et limites

Euclide est un **service d'information indépendant**, pas une autorité de
supervision. Deux points à retenir avant toute mise en production publique :

0. **Aucune entité fictive n'est publiée.** L'entité `Vantex Bank AG` du
   fichier de modèle est un **exemple de schéma**, pas un établissement réel :
   la publier sur un site dont la raison d'être est de distinguer les
   établissements réellement agréés produirait exactement le préjudice que la
   plateforme cherche à empêcher. Elle a servi de référence de structure et
   rien d'autre. La branche « finance islamique » du modèle est exercée par
   **KT Bank AG** (Francfort, agréée BaFin), qui existe.
1. **Le jeu de données livré est une base de démonstration** construite à partir
   de sources publiques connues (registres EBA/BCE, registres nationaux). Chaque
   fiche doit être recoupée avec le registre de l'autorité compétente avant
   publication — l'interface renvoie systématiquement vers ce registre, qui seul
   fait foi.
2. **L'indicateur de solidité est éditorial**, pas une notation de crédit. Il est
   présenté comme tel sur chaque fiche.
