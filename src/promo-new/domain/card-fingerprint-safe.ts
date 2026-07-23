import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromotionFamily, PromotionTier } from './types';
import { applyCardFingerprintClusters, parseCardFingerprintEvidence, type CardMechanicEvidence } from './card-fingerprint';
import { visualSimilarity, type ProductScopeCandidate, type ScopeResolution } from './scope-matcher';

const near = (left: number | null, right: number | null, tolerance = 0.05): boolean => (
  left != null && right != null && Math.abs(left - right) <= tolerance
);

function mechanicMatchesTier(mechanic: CardMechanicEvidence, tier: PromotionTier): { fields: number; matches: number } {
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

function hasExactMechanicSupport(card: ImportedCardCandidate, family: PromotionFamily): boolean {
  if (!card.classId) return false;
  const tiers = family.tiersByClass[card.classId] || [];
  const evidence = parseCardFingerprintEvidence(card);
  return evidence.mechanics.some(mechanic => tiers.some(tier => {
    const compared = mechanicMatchesTier(mechanic, tier);
    return compared.fields >= 2 && compared.matches === compared.fields;
  }));
}

function directlySupportedByAnchor(
  card: ImportedCardCandidate,
  anchors: ImportedCardCandidate[],
  family: PromotionFamily,
  visualSignatures: Record<string, string>,
): boolean {
  const evidence = parseCardFingerprintEvidence(card);
  const hasIdentityEvidence = Boolean(evidence.brand || evidence.productType || evidence.sizeValue != null);
  const mechanicSupport = hasExactMechanicSupport(card, family);
  for (const anchor of anchors) {
    const anchorEvidence = parseCardFingerprintEvidence(anchor);
    const priceMatches = near(evidence.recommendedPrice, anchorEvidence.recommendedPrice);
    if (!priceMatches) continue;
    const similarity = visualSimilarity(visualSignatures[card.cardId], visualSignatures[anchor.cardId]);
    if (hasIdentityEvidence && similarity >= 0.92) return true;
    if (mechanicSupport && similarity >= 0.94) return true;
    if (card.sequence === anchor.sequence && similarity >= 0.985) return true;
  }
  return false;
}

export function applySafeCardFingerprintClusters(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
  scopes: ProductScopeCandidate[],
  current: Map<string, ScopeResolution>,
  visualSignatures: Record<string, string>,
): Map<string, ScopeResolution> {
  const candidate = applyCardFingerprintClusters(cards, families, scopes, current, visualSignatures);
  const output = new Map(candidate);
  const cardById = new Map(cards.map(card => [card.cardId, card]));
  const familyById = new Map(families.map(family => [family.id, family]));

  for (const card of cards) {
    const before = current.get(card.cardId);
    const after = candidate.get(card.cardId);
    if (before?.scope || !after?.scope) continue;
    const family = familyById.get(after.scope.familyId);
    if (!family) {
      output.set(card.cardId, before || { scope: null, score: 0, margin: 0, method: 'unmatched' });
      continue;
    }
    const anchors = cards.filter(anchor => (
      current.get(anchor.cardId)?.method === 'structured_scope'
      && current.get(anchor.cardId)?.scope?.key === after.scope?.key
    ));
    // Clusters with no text anchor are accepted only by the stricter multi-card mechanic
    // consensus inside applyCardFingerprintClusters. When anchors exist, every recovered
    // card must prove a direct relationship to an original structured anchor.
    if (!anchors.length) continue;
    if (!directlySupportedByAnchor(card, anchors, family, visualSignatures)) {
      output.set(card.cardId, before || { scope: null, score: 0, margin: 0, method: 'unmatched' });
    }
  }

  // Remove orphan assignments that no longer have another card in the same scope. This
  // prevents a rejected bridge from leaving a one-card fingerprint result behind.
  const counts = new Map<string, number>();
  for (const [cardId, resolution] of output) {
    if (!resolution.scope) continue;
    const wasStructured = current.get(cardId)?.method === 'structured_scope';
    if (!wasStructured) counts.set(resolution.scope.key, (counts.get(resolution.scope.key) || 0) + 1);
  }
  for (const [cardId, resolution] of output) {
    if (!resolution.scope || current.get(cardId)?.scope) continue;
    const hasStructuredAnchor = cards.some(anchor => current.get(anchor.cardId)?.method === 'structured_scope' && current.get(anchor.cardId)?.scope?.key === resolution.scope?.key);
    if (!hasStructuredAnchor && (counts.get(resolution.scope.key) || 0) < 2) {
      output.set(cardId, current.get(cardId) || { scope: null, score: 0, margin: 0, method: 'unmatched' });
    }
  }

  // Ensure no stale card reference can influence the result.
  for (const cardId of output.keys()) if (!cardById.has(cardId)) output.delete(cardId);
  return output;
}
