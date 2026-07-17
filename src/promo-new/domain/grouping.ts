import type { PromoCard, ProductGroup, PromotionFamily, Sku, SkuPrice } from './types';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import { createSkuCandidate } from './sku-identity';
import { inheritedSkuPrice, type StoredPrice } from './pricing';
import { resolveScopesSafely } from './scope-safety';
import {
  skuFromScope,
  type ProductScopeCandidate,
  type ScopeResolution,
} from './scope-matcher';

function stableHash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).toUpperCase().padStart(7, '0');
}

function displayNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));
}

export function buildSkuDisplayName(sku: Sku): string {
  const identity = sku.identity;
  const parts = [identity.brand, identity.productType].filter(Boolean);
  if (identity.variant) parts.push('สูตร/รุ่นรอยืนยันจากภาพ');
  if (identity.sizeValue > 0 && identity.sizeUnit) parts.push(`${displayNumber(identity.sizeValue)} ${identity.sizeUnit}`);
  if (identity.salesUnit) parts.push(identity.salesUnit);
  if (identity.packQuantity > 1) parts.push(`แพ็ค ${identity.packQuantity}`);
  return parts.join(' ').replace(/\s+/g, ' ').trim() || 'สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ';
}

function normalizedCandidate(sourceText: string): Sku {
  const candidate = createSkuCandidate(sourceText);
  if (candidate.status === 'quarantine') return candidate;
  return { ...candidate, canonicalName: buildSkuDisplayName(candidate) };
}

interface ResolvedCard {
  source: ImportedCardCandidate;
  observed: Sku;
  scope: ProductScopeCandidate | null;
  resolution: ScopeResolution;
  bucketKey: string | null;
}

function chooseObserved(members: ResolvedCard[]): Sku {
  const exactSizes = new Map<string, { count: number; confidence: number; sku: Sku }>();
  for (const member of members) {
    const identity = member.observed.identity;
    if (!(identity.sizeValue > 0) || !identity.sizeUnit) continue;
    const key = `${identity.sizeValue}|${identity.sizeUnit}`;
    const current = exactSizes.get(key) || { count: 0, confidence: 0, sku: member.observed };
    current.count += 1;
    current.confidence += member.source.confidence;
    if (member.observed.failureReasons.length < current.sku.failureReasons.length) current.sku = member.observed;
    exactSizes.set(key, current);
  }
  const sizeWinner = [...exactSizes.values()].sort((left, right) => (
    right.count - left.count || right.confidence - left.confidence || left.sku.failureReasons.length - right.sku.failureReasons.length
  ))[0]?.sku;
  if (sizeWinner) return sizeWinner;
  return [...members].sort((left, right) => (
    left.observed.failureReasons.length - right.observed.failureReasons.length
    || right.source.confidence - left.source.confidence
    || right.source.productText.length - left.source.productText.length
  ))[0].observed;
}

function familyForScope(scope: ProductScopeCandidate | null, families: PromotionFamily[]): PromotionFamily | null {
  return scope ? families.find(family => family.id === scope.familyId) || null : null;
}

export interface GroupingResult {
  skus: Sku[];
  prices: SkuPrice[];
  cards: PromoCard[];
  groups: ProductGroup[];
  quarantineCards: ImportedCardCandidate[];
  warnings: string[];
  diagnostics: {
    structuredScope: number;
    visualConsensus: number;
    exactIdentity: number;
    unresolved: number;
  };
}

export function groupImportedCards(
  monthKey: string,
  imported: ImportedCardCandidate[],
  existingSkus: Sku[] = [],
  storedPrices: StoredPrice[] = [],
  promotionFamilies: PromotionFamily[] = [],
  visualSignatures: Record<string, string> = {},
): GroupingResult {
  const scopeResolutions = promotionFamilies.length
    ? resolveScopesSafely(imported, promotionFamilies, visualSignatures)
    : new Map<string, ScopeResolution>();
  const existingByIdentity = new Map(existingSkus.map(sku => [sku.identityKey, sku]));
  const diagnostics = { structuredScope: 0, visualConsensus: 0, exactIdentity: 0, unresolved: 0 };

  const resolved: ResolvedCard[] = imported.map(source => {
    const observed = normalizedCandidate(source.productText || source.rawText);
    const resolution = scopeResolutions.get(source.cardId) || { scope: null, score: 0, margin: 0, method: 'unmatched' as const };
    const scope = resolution.scope;
    if (scope) {
      if (resolution.method === 'visual_consensus') diagnostics.visualConsensus += 1;
      else diagnostics.structuredScope += 1;
      return { source, observed, scope, resolution, bucketKey: `scope:${scope.key}` };
    }
    if (observed.status !== 'quarantine' && source.classId) {
      diagnostics.exactIdentity += 1;
      return { source, observed, scope: null, resolution, bucketKey: `identity:${observed.identityKey}` };
    }
    diagnostics.unresolved += 1;
    return { source, observed, scope: null, resolution, bucketKey: null };
  });

  const unresolved = resolved.filter(item => !item.bucketKey || !item.source.classId);
  const quarantineCards = unresolved.map(item => ({
    ...item.source,
    failureReasons: [...new Set([
      ...item.source.failureReasons,
      ...item.observed.failureReasons,
      ...(item.source.classId ? [] : ['class_missing']),
      'product_scope_unresolved',
    ])],
  }));
  const accepted = resolved.filter((item): item is ResolvedCard & { bucketKey: string } => Boolean(item.bucketKey && item.source.classId));
  const buckets = new Map<string, Array<ResolvedCard & { bucketKey: string }>>();
  for (const item of accepted) {
    const key = `${monthKey}|${item.bucketKey}`;
    const list = buckets.get(key) || [];
    list.push(item);
    buckets.set(key, list);
  }

  const prices = new Map<string, SkuPrice>();
  const cards: PromoCard[] = [];
  const groups: ProductGroup[] = [];
  const skus = new Map<string, Sku>();
  const warnings: string[] = [];

  for (const [key, members] of buckets) {
    const scope = members[0].scope;
    const observed = chooseObserved(members);
    let sku = scope ? skuFromScope(scope, observed, existingSkus) : existingByIdentity.get(observed.identityKey) || observed;
    if (!scope && sku.status !== 'quarantine') sku = { ...sku, canonicalName: buildSkuDisplayName(sku) };
    skus.set(sku.id, sku);
    const groupId = `group:${stableHash(key)}`;
    const price = inheritedSkuPrice(sku, storedPrices);
    prices.set(sku.id, price);
    const classIds = members.map(member => member.source.classId as string);
    const duplicateClasses = [...new Set(classIds.filter((classId, index) => classIds.indexOf(classId) !== index))];
    const family = familyForScope(scope, promotionFamilies);
    const familyFailures = family?.failureReasons.length ? [`promotion_family_needs_review:${family.id}`] : [];
    const missingFamilyClasses = family ? [...new Set(classIds)].filter(classId => !family.tiersByClass[classId]?.length) : [];
    const failureReasons = [...new Set([
      ...(sku.status === 'active' ? [] : sku.status === 'candidate' ? ['new_sku_requires_confirmation'] : sku.failureReasons),
      ...duplicateClasses.map(classId => `duplicate_class:${classId}`),
      ...(!price.effectivePrice ? ['central_price_missing'] : []),
      ...missingFamilyClasses.map(classId => `promotion_class_missing:${classId}`),
      ...familyFailures,
    ])];

    const groupCards = members.map(member => {
      const tiers = family && member.source.classId ? family.tiersByClass[member.source.classId] || [] : [];
      const cardFailures = [...new Set([
        ...member.source.failureReasons.filter(reason => !['product_text_missing', 'class_missing'].includes(reason)),
        ...(sku.status === 'quarantine' ? sku.failureReasons : []),
        ...(family && !tiers.length ? [`promotion_class_missing:${member.source.classId}`] : []),
        ...familyFailures,
      ])];
      return {
        id: member.source.cardId,
        monthKey,
        page: member.source.page,
        sequence: member.source.sequence,
        classId: member.source.classId,
        imageUrl: member.source.imageUrl,
        skuId: sku.id,
        productGroupId: groupId,
        promotionFamilyId: family?.id || null,
        promotionTiers: tiers,
        price,
        status: price.effectivePrice && sku.status === 'active' && tiers.length && !cardFailures.length ? 'ready' as const : 'need_review' as const,
        evidence: {
          rawText: member.source.rawText,
          productText: member.source.productText,
          pageClassText: member.source.pageClassText,
          confidence: member.source.confidence,
          method: member.source.evidenceMethod,
          cropBounds: {
            x: member.source.bounds.x,
            y: member.source.bounds.y,
            width: member.source.bounds.width,
            height: member.source.bounds.height,
          },
        },
        failureReasons: cardFailures,
      } satisfies PromoCard;
    });
    cards.push(...groupCards);
    const blocked = duplicateClasses.length > 0 || missingFamilyClasses.length > 0;
    groups.push({
      id: groupId,
      monthKey,
      skuId: sku.id,
      sku,
      cardIds: groupCards.map(card => card.id),
      classIds: [...new Set(classIds)].sort(),
      promotionFamilyId: family?.id || null,
      price,
      status: blocked ? 'blocked' : price.effectivePrice && sku.status === 'active' && family && !failureReasons.length ? 'ready' : 'need_review',
      failureReasons,
    });
    for (const member of members) {
      warnings.push(`card:${member.source.cardId}:grouping_method:${member.resolution.scope ? member.resolution.method : 'exact_identity'}`);
    }
  }

  for (const card of quarantineCards) warnings.push(`card:${card.cardId}:${card.failureReasons.join(',') || 'sku_quarantine'}`);
  warnings.push(`grouping:structured_scope:${diagnostics.structuredScope}`);
  warnings.push(`grouping:visual_consensus:${diagnostics.visualConsensus}`);
  warnings.push(`grouping:exact_identity:${diagnostics.exactIdentity}`);
  warnings.push(`grouping:unresolved:${diagnostics.unresolved}`);
  return {
    skus: [...skus.values()],
    prices: [...prices.values()],
    cards,
    groups,
    quarantineCards,
    warnings: [...new Set(warnings)],
    diagnostics,
  };
}

export function applyPromotionFamily(
  group: ProductGroup,
  allCards: PromoCard[],
  family: PromotionFamily,
): { group: ProductGroup; cards: PromoCard[]; blockedClasses: string[] } {
  const blockedClasses = group.classIds.filter(classId => !family.tiersByClass[classId]?.length);
  if (blockedClasses.length) {
    const reason = blockedClasses.map(classId => `promotion_class_missing:${classId}`);
    return {
      group: { ...group, promotionFamilyId: null, status: 'blocked', failureReasons: [...new Set([...group.failureReasons, ...reason])] },
      cards: allCards,
      blockedClasses,
    };
  }
  const familyFailures = family.failureReasons.length ? [`promotion_family_needs_review:${family.id}`] : [];
  const nextGroup: ProductGroup = {
    ...group,
    promotionFamilyId: family.id,
    status: group.price.effectivePrice && group.sku.status === 'active' && !group.failureReasons.length && !familyFailures.length ? 'ready' : 'need_review',
    failureReasons: [...new Set([...group.failureReasons.filter(reason => !reason.startsWith('promotion_class_missing:')), ...familyFailures])],
  };
  const nextCards = allCards.map(card => {
    if (!group.cardIds.includes(card.id) || !card.classId) return card;
    const tiers = family.tiersByClass[card.classId];
    const cardFailureReasons = card.failureReasons.filter(reason => !reason.startsWith('promotion_'));
    return {
      ...card,
      promotionFamilyId: family.id,
      promotionTiers: tiers,
      failureReasons: cardFailureReasons,
      status: card.price.effectivePrice && group.sku.status === 'active' && tiers.length && !cardFailureReasons.length ? 'ready' as const : 'need_review' as const,
    };
  });
  return { group: nextGroup, cards: nextCards, blockedClasses: [] };
}
