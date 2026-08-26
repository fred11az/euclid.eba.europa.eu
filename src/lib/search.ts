import { institutions, type Institution } from './data';

/**
 * Local search over the embedded dataset. The corpus is small (fewer than a
 * hundred records), so a dedicated index library would cost more bundle weight
 * than it saves: normalised substring + token matching answers in well under a
 * millisecond and supports typo tolerance through edit distance.
 */

const normalise = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

type Indexed = { inst: Institution; haystack: string; name: string };

const index: Indexed[] = institutions.map((inst) => ({
  inst,
  name: normalise(inst.legalName),
  haystack: normalise(
    [
      inst.legalName,
      Object.values(inst.name).join(' '),
      inst.bic,
      inst.city,
      inst.country,
      inst.kind,
      inst.regulators.join(' '),
      inst.tags.join(' '),
    ].join(' '),
  ),
}));

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

export type Hit = { inst: Institution; score: number };

export function searchInstitutions(query: string, limit = 50): Hit[] {
  const q = normalise(query);
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const hits: Hit[] = [];
  for (const entry of index) {
    let score = 0;
    for (const term of terms) {
      if (entry.name.startsWith(term)) score += 12;
      else if (entry.name.includes(term)) score += 8;
      else if (entry.haystack.includes(term)) score += 4;
      else {
        // Typo tolerance against individual words of the legal name.
        const near = entry.name.split(/\s+/).some((w) => editDistance(w, term) <= (term.length > 5 ? 2 : 1));
        if (near) score += 3;
        else {
          score = -1;
          break;
        }
      }
    }
    if (score > 0) hits.push({ inst: entry.inst, score: score + entry.inst.solidityScore / 1000 });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Closest legal names, used for "did you mean" when nothing matched. */
export function suggestions(query: string, limit = 3): Institution[] {
  const q = normalise(query);
  if (q.length < 3) return [];
  return index
    .map((e) => ({ inst: e.inst, d: Math.min(...e.name.split(/\s+/).map((w) => editDistance(w, q))) }))
    .filter((x) => x.d <= 3)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.inst);
}
