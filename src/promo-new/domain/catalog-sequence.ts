import type { ImportedCardCandidate } from '../import/pdf-importer';
import { parseCardFingerprintEvidence, type CardMechanicEvidence } from './card-fingerprint';
import { visualSimilarity, type ProductScopeCandidate, type ScopeResolution } from './scope-matcher';
import type { PromotionFamily, PromotionTier } from './types';

const near = (left: number | null, right: number | null, tolerance = 0.05): boolean => (
  left != null && right != null && Math.abs(left - right) <= tolerance
);

function pageOrdinals(cards: ImportedCardCandidate[]): Map<string, number> {
  const pagesByClass = new Map<string, number[]>();
  for (const card of cards) {
    if (!card.classId) continue;
    const pages = pagesByClass.get(card.classId) || [];
    if (!pages.includes(card.page)) pages.push(card.page);
    pagesByClass.set(card.classId, pages);
  }
  const output = new Map<string, number>();
  for (const [classId, pages] of pagesByClass) {
    pages.sort((left, right) => left - right);
    pages.forEach((page, index) => output.set(`${classId}|${page}`, index));
  }
  return output;
}

function mechanicMatch(mechanic: CardMechanicEvidence, tier: PromotionTier): { fields: number; matches: number } {
  let fields = 0;
  let matches = 0;
  if (mechanic.minQuantity != null) {
    fields += 1;
    if (near(mechanic.minQuantity, tier.minQuantity, 0.01)) matches += 1;
  }
  if (mechanic.discountPercent != null) {
    fields += 1;
    if (tier.discountPercent != null && near(mechanic.discountPercent, tier.discountPercent)) matches += 1;
  }
  if (mechanic.freeQuantity != null) {
    fields += 1;
    if (near(mechanic.freeQuantity, tier.freeQuantity, 0.01)) matches += 1;
  }
  if (mechanic.bundlePrice != null) {
    fields += 1;
    if (tier.bundlePrice && near(mechanic.bundlePrice, tier.bundlePrice.amount)) matches += 1;
  }
  return { fields, matches };
}

function exactMechanicFields(card: ImportedCardCandidate, family: PromotionFamily): number {
  if (!card.classId) return 0;
  const tiers = family.tiersByClass[card.classId] || [];
  const evidence = parseCardFingerprintEvidence(card);
  let best = 0;
  for (const mechanic of evidence.mechanics) {
    for (const tier of tiers) {
      const compared = mechanicMatch(mechanic, tier);
      if (compared.fields > 0 && compared.matches === compared.fields) best = Math.max(best, compared.fields);
    }
  }
  return best;
}

function identityConflict(card: ImportedCardCandidate, scope: ProductScopeCandidate): boolean {
  const evidence = parseCardFingerprintEvidence(card);
  if (evidence.brand && evidence.brand !== scope.brand) return true;
  if (evidence.productType && evidence.productType !== scope.productType) {
    const broadHair = scope.productType === 'แชมพู/ครีมนวด' && ['แชมพู', 'ครีมนวด'].includes(evidence.productType);
    const packHair = scope.productType.startsWith('แพ็ค ') && ['แชมพู', 'ครีมนวด'].includes(evidence.productType);
    if (!broadHair && !packHair) return true;
  }
  if (evidence.sizeValue != null && evidence.sizeUnit && scope.minimumSize != null && scope.maximumSize != null && scope.sizeUnit) {
    if (evidence.sizeUnit !== scope.sizeUnit || evidence.sizeValue < scope.minimumSize || evidence.sizeValue > scope.maximumSize) return true;
  }
  return false;
}

interface Candidate {
  scope: ProductScopeCandidate;
  anchorClass: string;
  score: number;
  similarity: number;
  priceMatch: boolean;
  mechanicFields: number;
}

export function applyCatalogSequenceRecovery(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
  current: Map<string, ScopeResolution>,
  visualSignatures: Record<string, string>,
): Map<string, ScopeResolution> {
  const output = new Map(current);
  const ordinals = pageOrdinals(cards);
  const familyById = new Map(families.map(family => [family.id, family]));
  const anchors = cards.filter(card => current.get(card.cardId)?.method === 'structured_scope' && current.get(card.cardId)?.scope && card.classId);

  for (const card of cards) {
    if (!card.classId || output.get(card.cardId)?.scope) continue;
    const ordinal = ordinals.get(`${card.classId}|${card.page}`);
    if (ordinal == null) continue;
    const evidence = parseCardFingerprintEvidence(card);
    const candidates: Candidate[] = [];

    for (const anchor of anchors) {
      if (!anchor.classId || anchor.classId === card.classId) continue;
      const anchorOrdinal = ordinals.get(`${anchor.classId}|${anchor.page}`);
      if (anchorOrdinal == null || Math.abs(anchorOrdinal - ordinal) > 1) continue;
      const sequenceDistance = Math.abs(anchor.sequence - card.sequence);
      if (sequenceDistance > 2) continue;
      const scope = current.get(anchor.cardId)?.scope;
      if (!scope || !scope.classIds.includes(card.classId) || identityConflict(card, scope)) continue;
      const family = familyById.get(scope.familyId);
      if (!family || family.failureReasons.length || !family.tiersByClass[card.classId]?.length) continue;
      const anchorEvidence = parseCardFingerprintEvidence(anchor);
      if (evidence.recommendedPrice != null && anchorEvidence.recommendedPrice != null
        && !near(evidence.recommendedPrice, anchorEvidence.recommendedPrice)) continue;
      const priceMatch = near(evidence.recommendedPrice, anchorEvidence.recommendedPrice);
      const mechanicFields = exactMechanicFields(card, family);
      const similarity = visualSimilarity(visualSignatures[card.cardId], visualSignatures[anchor.cardId]);
      const sameOrdinal = anchorOrdinal === ordinal;
      const required = sameOrdinal && sequenceDistance === 0
        ? priceMatch && mechanicFields > 0 ? 0.68 : priceMatch ? 0.74 : mechanicFields >= 2 ? 0.78 : 0.90
        : sequenceDistance <= 1 && priceMatch && mechanicFields > 0 ? 0.80
          : sequenceDistance <= 1 && priceMatch ? 0.86
            : 0.94;
      if (similarity < required) continue;
      const identityFields = Number(Boolean(evidence.brand)) + Number(Boolean(evidence.productType)) + Number(evidence.sizeValue != null);
      const score = similarity * 60
        + (sameOrdinal ? 10 : 4)
        + (sequenceDistance === 0 ? 12 : sequenceDistance === 1 ? 6 : 2)
        + (priceMatch ? 18 : 0)
        + Math.min(18, mechanicFields * 6)
        + Math.min(9, identityFields * 3);
      candidates.push({ scope, anchorClass: anchor.classId, score, similarity, priceMatch, mechanicFields });
    }

    const byScope = new Map<string, Candidate[]>();
    for (const candidate of candidates) {
      const list = byScope.get(candidate.scope.key) || [];
      const previous = list.findIndex(item => item.anchorClass === candidate.anchorClass);
      if (previous < 0) list.push(candidate);
      else if (candidate.score > list[previous].score) list[previous] = candidate;
      byScope.set(candidate.scope.key, list);
    }
    const ranked = [...byScope.values()].map(matches => {
      matches.sort((left, right) => right.score - left.score);
      const selected = matches.slice(0, 3);
      const average = selected.reduce((sum, item) => sum + item.score, 0) / selected.length;
      return {
        scope: selected[0].scope,
        matches: selected,
        score: average + Math.max(0, selected.length - 1) * 8,
      };
    }).sort((left, right) => right.score - left.score);
    const best = ranked[0];
    const second = ranked[1];
    if (!best) continue;
    const margin = best.score - (second?.score || 0);
    const multiAnchor = best.matches.length >= 2
      && best.score >= 76
      && best.matches.some(item => item.priceMatch || item.mechanicFields >= 2)
      && (!second || margin >= 9);
    const singleAnchor = best.matches.length === 1
      && best.matches[0].priceMatch
      && best.matches[0].mechanicFields >= 2
      && best.matches[0].similarity >= 0.88
      && best.score >= 88
      && (!second || margin >= 14);
    if (!multiAnchor && !singleAnchor) continue;
    output.set(card.cardId, {
      scope: best.scope,
      score: Number(best.score.toFixed(1)),
      margin: Number(margin.toFixed(1)),
      method: 'visual_consensus',
    });
  }
  return output;
}
