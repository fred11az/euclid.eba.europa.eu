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
| Données | JSON embarqué dans le repo (`src/data/`) |
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

1. **Le jeu de données livré est une base de démonstration** construite à partir
   de sources publiques connues (registres EBA/BCE, registres nationaux). Chaque
   fiche doit être recoupée avec le registre de l'autorité compétente avant
   publication — l'interface renvoie systématiquement vers ce registre, qui seul
   fait foi.
2. **L'indicateur de solidité est éditorial**, pas une notation de crédit. Il est
   présenté comme tel sur chaque fiche.
