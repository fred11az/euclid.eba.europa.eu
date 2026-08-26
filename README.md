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

### Champs vides : aucun

Une fiche n'affiche jamais de champ en attente. Deux règles :

- **Une ligne sans valeur n'est pas rendue.** Le composant `Rows` filtre les
  valeurs nulles ; une conformité que l'on ne peut pas sourcer est retirée de
  la liste plutôt qu'affichée en « inconnu ». Une fiche montre donc uniquement
  ce qui est établi.
- **Ce qui peut être établi l'est.** Le registre national du commerce est
  renseigné pour les 30 pays (`Handelsregister`, `RCS`, `Registro delle
  Imprese`…), l'adresse retombe sur ville + pays, le site officiel est
  toujours présent.

Les identifiants propres à chaque entité — LEI, numéro d'immatriculation,
TVA, téléphone, courriel — ne sont renseignés que sur les fiches dont la
donnée a été fournie et vérifiée (`source_verified: true`). Voir
`Vantex Bank AG` pour une fiche complète à 92 %.

### Indicateur de solidité

Score éditorial sur 100, **calculé** à partir des champs de la fiche et
affiché avec son détail, de sorte qu'un lecteur voit d'où viennent les
points :

| Composante | Max | Source |
| --- | --- | --- |
| Protection des fonds des clients | 30 | type d'agrément, garantie des dépôts |
| Niveau de supervision | 25 | supervision BCE directe, nombre d'autorités |
| Ancienneté | 20 | date de création |
| Étendue de l'agrément | 20 | `authorization_scope` |
| Passeport européen | 5 | `passporting.status` |

Le calcul est dans `solidity()` (`scripts/build-data.mjs`) et les composantes
sont stockées dans `detail_layer.solidity.components`. Ce n'est pas une
notation de crédit et la fiche le précise.

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

Elle alimente les URL canoniques, `hreflang`, l'`og:image` et le sitemap.

Sans elle, `src/lib/site.ts` retombe sur `VERCEL_PROJECT_PRODUCTION_URL`
puis `VERCEL_URL`, tous deux injectés par Vercel au build : les
prédéploiements se référencent eux-mêmes et la production se référence
elle-même. **Ne jamais remettre un domaine en dur comme repli** : une URL
canonique pointant vers un domaine qui n'est pas le vôtre indique aux
moteurs d'indexer ce domaine à votre place, et les robots des réseaux
sociaux y cherchent l'image d'aperçu — la carte de partage revient vide.

### Branche de production

La production suit `main`. Le dépôt n'ayant pas eu de branche par défaut à
la création du projet Vercel, celui-ci pointe encore sur la branche de
travail : à basculer dans **Vercel → Settings → Git → Production Branch**
(et **GitHub → Settings → Branches → Default branch**) sur `main`.

### Garder Next.js à jour — sinon Vercel refuse de publier

Vercel bloque le déploiement d'une version de Next.js portant un avis de
sécurité critique. Le build réussit, puis s'arrête à `Deploying outputs…`
avec `Vulnerable version of Next.js detected`. Le message n'apparaît pas
dans les erreurs de build : chercher la cause dans le code est une impasse.

```bash
npm audit                       # une ligne "next | critical" = déploiement bloqué
npm install next@latest         # dans la même majeure
npm run build                   # revalider avant de pousser
```

---

## Périmètre et limites

Euclide est un **service d'information indépendant**, pas une autorité de
supervision. Deux points à retenir avant toute mise en production publique :

1. **Le jeu de données livré est une base de démonstration** construite à partir
   de sources publiques connues (registres EBA/BCE, registres nationaux). Chaque
   fiche doit être recoupée avec le registre de l'autorité compétente avant
   publication — l'interface renvoie systématiquement vers ce registre, qui seul
   fait foi.
2. **L'indicateur de solidité est éditorial**, pas une notation de crédit. Il
   est calculé, détaillé et présenté comme tel sur chaque fiche.
3. **Les identifiants réglementaires ne sont jamais générés.** Un LEI ou un
   numéro d'immatriculation est vérifiable publiquement (GLEIF, registres du
   commerce) : une valeur inventée serait détectée et détruirait la crédibilité
   de la plateforme. Ces champs viennent d'une source ou n'apparaissent pas.
