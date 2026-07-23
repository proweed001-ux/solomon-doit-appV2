import type { PromoCard, ProductGroup, PromotionFamily, Sku, SkuPrice } from './types';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import { buildSkuIdentityKey, createSkuCandidate } from './sku-identity';
import { inheritedSkuPrice, type StoredPrice } from './pricing';
import { matchProductMasterByText, type MasterTextMatch } from './master-text-matcher';
import { normalizeProductOcrText } from './product-text-normalizer';
import { resolveScopesSafely } from './scope-safety';
import { skuFromScope, type ProductScopeCandidate, type ScopeResolution } from './scope-matcher';

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

const BRAND_TYPE_DEFAULTS: Record<string, string> = {
  GILLETTE: 'มีดโกน',
  'ORAL-B': 'แปรงสีฟัน',
  OLAY: 'สกินแคร์',
  VICKS: 'ยาบาล์ม',
  'AMBI PUR': 'ผลิตภัณฑ์ปรับอากาศ',
  DOWNY: 'ปรับผ้านุ่ม',
};

const TYPE_SALES_UNITS: Record<string, string> = {
  'มีดโกน': 'ชิ้น',
  'แปรงสีฟัน': 'ด้าม',
  'สกินแคร์': 'ชิ้น',
  'ยาบาล์ม': 'กระปุก',
  'ผลิตภัณฑ์ปรับอากาศ': 'ชิ้น',
  'ปรับผ้านุ่ม': 'ถุง',
};

function sizeIsOptional(sourceText: string, sku: Sku): boolean {
  const productType = sku.identity.productType;
  if (productType === 'มีดโกน' || productType === 'แปรงสีฟัน') return true;
  const packOrModelIdentity = /ซอง|กล่อง|แพ็ค|แพค|ถุงเติมขนาดใหญ่|รุ่น|ซุปเปอร์|SUPER|VECTOR|BLADE|ด้าม|ใบมีด/iu.test(sourceText);
  return packOrModelIdentity && Boolean(sku.identity.brand) && Boolean(sku.identity.variant || productType);
}

function normalizeEvidenceRequirements(sourceText: string, sourceSku: Sku): Sku {
  const identity = { ...sourceSku.identity };
  const inferredType = identity.productType || BRAND_TYPE_DEFAULTS[identity.brand] || '';
  if (inferredType && !identity.productType) {
    identity.productType = inferredType;
    identity.salesUnit = TYPE_SALES_UNITS[inferredType] || identity.salesUnit;
  }
  let failureReasons = sourceSku.failureReasons.filter(reason => reason !== 'product_type_missing' || !inferredType);
  const working = { ...sourceSku, identity };
  if (sizeIsOptional(sourceText, working)) {
    failureReasons = failureReasons.filter(reason => !['size_missing', 'size_unit_missing'].includes(reason));
  }
  const identityKey = buildSkuIdentityKey(identity);
  const hash = stableHash(identityKey);
  return {
    ...sourceSku,
    id: `sku:${hash}`,
    code: `SKU-${hash}`,
    identity,
    identityKey,
    status: failureReasons.length ? 'quarantine' : 'candidate',
    failureReasons: [...new Set(failureReasons)],
  };
}

export function buildSkuDisplayName(sku: Sku): string {
  const identity = sku.identity;
  const parts = [identity.brand, identity.productType].filter(Boolean);
  if (identity.variant) parts.push(identity.variant);
  if (identity.sizeValue > 0 && identity.sizeUnit) parts.push(`${displayNumber(identity.sizeValue)} ${identity.sizeUnit}`);
  if (identity.salesUnit) parts.push(identity.salesUnit);
  if (identity.packQuantity > 1) parts.push(`แพ็ค ${identity.packQuantity}`);
  return parts.join(' ').replace(/\s+/g, ' ').trim() || 'สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ';
}

function normalizedCandidate(sourceText: string): Sku {
  const candidate = normalizeEvidenceRequirements(sourceText, createSkuCandidate(sourceText));
  if (candidate.status === 'quarantine') return candidate;
  return { ...candidate, canonicalName: buildSkuDisplayName(candidate) };
}

type GroupingMethod = 'master_text' | 'structured_scope' | 'visual_consensus' | 'exact_identity' | 'unmatched';

interface ResolvedCard {
  source: ImportedCardCandidate;
  observed: Sku;
  scope: ProductScopeCandidate | null;
  resolution: ScopeResolution;
  masterMatch: MasterTextMatch;
  groupingMethod: GroupingMethod;
  bucketKey: string | null;
}

function scopeMasterMatch(scope: ProductScopeCandidate, existingSkus: Sku[]): MasterTextMatch {
  const evidence = normalizeProductOcrText(`${scope.name} ${scope.rawText}`);
  return matchProductMasterByText(normalizedCandidate(evidence), evidence, existingSkus);
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
  const sizeWinner = [...exactSizes.values()].sort((left, right) => right.count - left.count || right.confidence - left.confidence || left.sku.failureReasons.length - right.sku.failureReasons.length)[0]?.sku;
  if (sizeWinner) return sizeWinner;
  return [...members].sort((left, right) => left.observed.failureReasons.length - right.observed.failureReasons.length || right.source.confidence - left.source.confidence || right.source.productText.length - left.source.productText.length)[0].observed;
}

function familyForMembers(members: ResolvedCard[], families: PromotionFamily[]): { family: PromotionFamily | null; conflict: boolean } {
  const familyIds = [...new Set(members.map(member => member.scope?.familyId).filter((value): value is string => Boolean(value)))];
  if (familyIds.length !== 1) return { family: null, conflict: familyIds.length > 1 };
  return { family: families.find(item => item.id === familyIds[0]) || null, conflict: false };
}

export interface GroupingResult {
  skus: Sku[];
  prices: SkuPrice[];
  cards: PromoCard[];
  groups: ProductGroup[];
  quarantineCards: ImportedCardCandidate[];
  warnings: string[];
  diagnostics: { masterText: number; structuredScope: number; visualConsensus: number; exactIdentity: number; unresolved: number };
}

export function groupImportedCards(
  monthKey: string,
  imported: ImportedCardCandidate[],
  existingSkus: Sku[] = [],
  storedPrices: StoredPrice[] = [],
  promotionFamilies: PromotionFamily[] = [],
  visualSignatures: Record<string, string> = {},
  precomputedScopeResolutions?: Map<string, ScopeResolution>,
): GroupingResult {
  const scopeResolutions = precomputedScopeResolutions
    || (promotionFamilies.length ? resolveScopesSafely(imported, promotionFamilies, visualSignatures) : new Map<string, ScopeResolution>());
  const existingByIdentity = new Map(existingSkus.map(sku => [sku.identityKey, sku]));
  const scopeMasterMatches = new Map<string, MasterTextMatch>();
  const diagnostics = { masterText: 0, structuredScope: 0, visualConsensus: 0, exactIdentity: 0, unresolved: 0 };
  const resolved: ResolvedCard[] = imported.map(source => {
    const sourceText = normalizeProductOcrText(source.productText || source.rawText);
    const observed = normalizedCandidate(sourceText);
    const directMasterMatch = matchProductMasterByText(observed, sourceText, existingSkus);
    const resolution = scopeResolutions.get(source.cardId) || { scope: null, score: 0, margin: 0, method: 'unmatched' as const };
    const scope = resolution.scope;
    if (directMasterMatch.status === 'matched' && directMasterMatch.sku && source.classId) {
      diagnostics.masterText += 1;
      return { source, observed, scope, resolution, masterMatch: directMasterMatch, groupingMethod: 'master_text', bucketKey: `master:${directMasterMatch.sku.id}` };
    }
    if (scope) {
      if (resolution.method === 'visual_consensus') diagnostics.visualConsensus += 1;
      else diagnostics.structuredScope += 1;
      let matched = scopeMasterMatches.get(scope.key);
      if (!matched) {
        matched = scopeMasterMatch(scope, existingSkus);
        scopeMasterMatches.set(scope.key, matched);
      }
      const method = resolution.method === 'visual_consensus' ? 'visual_consensus' : 'structured_scope';
      if (matched.status === 'matched' && matched.sku) {
        return { source, observed, scope, resolution, masterMatch: matched, groupingMethod: method, bucketKey: `master:${matched.sku.id}` };
      }
      return { source, observed, scope, resolution, masterMatch: directMasterMatch, groupingMethod: method, bucketKey: `scope:${scope.key}` };
    }
    if (observed.status !== 'quarantine' && source.classId) {
      diagnostics.exactIdentity += 1;
      return { source, observed, scope: null, resolution, masterMatch: directMasterMatch, groupingMethod: 'exact_identity', bucketKey: `identity:${observed.identityKey}` };
    }
    diagnostics.unresolved += 1;
    return { source, observed, scope: null, resolution, masterMatch: directMasterMatch, groupingMethod: 'unmatched', bucketKey: null };
  });
  const unresolved = resolved.filter(item => !item.bucketKey || !item.source.classId);
  const quarantineCards = unresolved.map(item => ({
    ...item.source,
    failureReasons: [...new Set([
      ...item.source.failureReasons,
      ...item.observed.failureReasons,
      ...(item.masterMatch.status === 'ambiguous' ? ['product_master_ambiguous'] : []),
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
    const observed = chooseObserved(members);
    const matchedMaster = members.find(member => member.masterMatch.status === 'matched' && member.masterMatch.sku)?.masterMatch.sku || null;
    const { family, conflict: familyConflict } = familyForMembers(members, promotionFamilies);
    const primaryScope = members.find(member => member.scope)?.scope || null;
    let sku = matchedMaster || (primaryScope ? skuFromScope(primaryScope, observed, existingSkus) : existingByIdentity.get(observed.identityKey) || observed);
    if (!matchedMaster && !primaryScope && sku.status !== 'quarantine') sku = { ...sku, canonicalName: buildSkuDisplayName(sku) };
    skus.set(sku.id, sku);
    const groupId = `group:${stableHash(key)}`;
    const price = inheritedSkuPrice(sku, storedPrices);
    prices.set(sku.id, price);
    const classIds = members.map(member => member.source.classId as string);
    const duplicateClasses = [...new Set(classIds.filter((classId, index) => classIds.indexOf(classId) !== index))];
    const familyFailures = [
      ...(familyConflict ? ['promotion_family_conflict'] : []),
      ...(family?.failureReasons.length ? [`promotion_family_needs_review:${family.id}`] : []),
    ];
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
          cropBounds: { x: member.source.bounds.x, y: member.source.bounds.y, width: member.source.bounds.width, height: member.source.bounds.height },
        },
        failureReasons: cardFailures,
      } satisfies PromoCard;
    });
    cards.push(...groupCards);
    const blocked = duplicateClasses.length > 0 || missingFamilyClasses.length > 0 || familyConflict;
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
    for (const member of members) warnings.push(`card:${member.source.cardId}:grouping_method:${member.groupingMethod}`);
  }
  for (const card of quarantineCards) warnings.push(`card:${card.cardId}:${card.failureReasons.join(',') || 'sku_quarantine'}`);
  warnings.push(`grouping:master_text:${diagnostics.masterText}`);
  warnings.push(`grouping:structured_scope:${diagnostics.structuredScope}`);
  warnings.push(`grouping:visual_consensus:${diagnostics.visualConsensus}`);
  warnings.push(`grouping:exact_identity:${diagnostics.exactIdentity}`);
  warnings.push(`grouping:unresolved:${diagnostics.unresolved}`);
  return { skus: [...skus.values()], prices: [...prices.values()], cards, groups, quarantineCards, warnings: [...new Set(warnings)], diagnostics };
}

const withoutPromotionBlockers = (reasons: string[]): string[] => reasons.filter(reason => (
  !reason.startsWith('promotion_class_missing:')
  && !reason.startsWith('promotion_family_needs_review:')
  && reason !== 'promotion_family_conflict'
));

export function applyPromotionFamilyToCard(
  group: ProductGroup,
  allCards: PromoCard[],
  cardId: string,
  family: PromotionFamily | null,
): { group: ProductGroup; cards: PromoCard[]; blockedClasses: string[] } {
  const targetCard = allCards.find(card => card.id === cardId && group.cardIds.includes(card.id));
  if (!targetCard || !targetCard.classId) throw new Error('promotion_card_not_found');
  const baseFailures = withoutPromotionBlockers(targetCard.failureReasons);
  const tiers = family?.tiersByClass[targetCard.classId] || [];
  const familyFailures = family?.failureReasons.length ? [`promotion_family_needs_review:${family.id}`] : [];
  const missingReason = !family || !tiers.length ? [`promotion_class_missing:${targetCard.classId}`] : [];
  const cardFailures = [...new Set([...baseFailures, ...familyFailures, ...missingReason])];
  const cards = allCards.map(card => card.id === targetCard.id ? {
    ...card,
    promotionFamilyId: family && tiers.length ? family.id : null,
    promotionTiers: tiers,
    failureReasons: cardFailures,
    status: card.price.effectivePrice && group.sku.status === 'active' && tiers.length && !cardFailures.length ? 'ready' as const : 'need_review' as const,
  } : card);
  const members = cards.filter(card => group.cardIds.includes(card.id));
  const familyIds = [...new Set(members.map(card => card.promotionFamilyId).filter((value): value is string => Boolean(value)))];
  const missingCards = members.filter(card => !card.promotionFamilyId || !card.promotionTiers.length);
  const groupFailures = withoutPromotionBlockers(group.failureReasons)
    .filter(reason => !reason.startsWith('promotion_card_missing:'));
  missingCards.forEach(card => groupFailures.push(`promotion_card_missing:${card.id}`));
  const uniqueFailures = [...new Set(groupFailures)];
  const nextGroup: ProductGroup = {
    ...group,
    promotionFamilyId: familyIds.length === 1 && missingCards.length === 0 ? familyIds[0] : null,
    status: group.price.effectivePrice && group.sku.status === 'active' && members.every(card => card.status === 'ready') && !uniqueFailures.length
      ? 'ready'
      : missingReason.length ? 'blocked' : 'need_review',
    failureReasons: uniqueFailures,
  };
  return { group: nextGroup, cards, blockedClasses: missingReason.length ? [targetCard.classId] : [] };
}

export function applyPromotionFamily(
  group: ProductGroup,
  allCards: PromoCard[],
  family: PromotionFamily,
): { group: ProductGroup; cards: PromoCard[]; blockedClasses: string[] } {
  const blockedClasses = group.classIds.filter(classId => !family.tiersByClass[classId]?.length);
  const baseGroupFailures = withoutPromotionBlockers(group.failureReasons);
  if (blockedClasses.length) {
    const reasons = blockedClasses.map(classId => `promotion_class_missing:${classId}`);
    const blockedCards = allCards.map(card => {
      if (!group.cardIds.includes(card.id) || !card.classId) return card;
      const cardFailures = withoutPromotionBlockers(card.failureReasons);
      if (blockedClasses.includes(card.classId)) cardFailures.push(`promotion_class_missing:${card.classId}`);
      return { ...card, promotionFamilyId: null, promotionTiers: [], failureReasons: [...new Set(cardFailures)], status: 'need_review' as const };
    });
    return {
      group: { ...group, promotionFamilyId: null, status: 'blocked', failureReasons: [...new Set([...baseGroupFailures, ...reasons])] },
      cards: blockedCards,
      blockedClasses,
    };
  }
  const familyFailures = family.failureReasons.length ? [`promotion_family_needs_review:${family.id}`] : [];
  const nextGroupFailures = [...new Set([...baseGroupFailures, ...familyFailures])];
  const nextGroup: ProductGroup = {
    ...group,
    promotionFamilyId: family.id,
    status: group.price.effectivePrice && group.sku.status === 'active' && !nextGroupFailures.length ? 'ready' : 'need_review',
    failureReasons: nextGroupFailures,
  };
  const nextCards = allCards.map(card => {
    if (!group.cardIds.includes(card.id) || !card.classId) return card;
    const tiers = family.tiersByClass[card.classId];
    const cardFailureReasons = [...new Set([...withoutPromotionBlockers(card.failureReasons), ...familyFailures])];
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
