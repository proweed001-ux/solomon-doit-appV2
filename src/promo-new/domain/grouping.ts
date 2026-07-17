import type { PromoCard, ProductGroup, PromotionFamily, Sku, SkuPrice } from './types';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import { createSkuCandidate } from './sku-identity';
import { inheritedSkuPrice, type StoredPrice } from './pricing';

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

export interface GroupingResult {
  skus: Sku[];
  prices: SkuPrice[];
  cards: PromoCard[];
  groups: ProductGroup[];
  quarantineCards: ImportedCardCandidate[];
  warnings: string[];
}

export function groupImportedCards(
  monthKey: string,
  imported: ImportedCardCandidate[],
  existingSkus: Sku[] = [],
  storedPrices: StoredPrice[] = [],
): GroupingResult {
  const skuByIdentity = new Map(existingSkus.map(sku => [sku.identityKey, sku]));
  const resolved = imported.map(source => {
    const candidate = normalizedCandidate(source.productText);
    const sku = skuByIdentity.get(candidate.identityKey) || candidate;
    if (!skuByIdentity.has(sku.identityKey)) skuByIdentity.set(sku.identityKey, sku);
    return { source, sku };
  });
  const quarantineCards = resolved.filter(item => item.sku.status === 'quarantine' || !item.source.classId).map(item => item.source);
  const accepted = resolved.filter(item => item.sku.status !== 'quarantine' && item.source.classId);
  const buckets = new Map<string, typeof accepted>();
  accepted.forEach(item => {
    const key = `${monthKey}|${item.sku.identityKey}`;
    const list = buckets.get(key) || [];
    list.push(item);
    buckets.set(key, list);
  });
  const prices = new Map<string, SkuPrice>();
  const cards: PromoCard[] = [];
  const groups: ProductGroup[] = [];
  const warnings: string[] = [];

  for (const [key, members] of buckets) {
    const sku = members[0].sku;
    const groupId = `group:${stableHash(key)}`;
    const price = inheritedSkuPrice(sku, storedPrices);
    prices.set(sku.id, price);
    const classIds = members.map(member => member.source.classId as string);
    const duplicateClasses = classIds.filter((classId, index) => classIds.indexOf(classId) !== index);
    const failureReasons = [...new Set([
      ...(sku.status !== 'active' ? ['new_sku_requires_confirmation'] : []),
      ...(duplicateClasses.length ? duplicateClasses.map(classId => `duplicate_class:${classId}`) : []),
      ...(!price.effectivePrice ? ['central_price_missing'] : []),
    ])];
    const groupCards = members.map(member => {
      const card: PromoCard = {
        id: member.source.cardId,
        monthKey,
        page: member.source.page,
        sequence: member.source.sequence,
        classId: member.source.classId,
        imageUrl: member.source.imageUrl,
        skuId: sku.id,
        productGroupId: groupId,
        promotionFamilyId: null,
        promotionTiers: [],
        price,
        status: 'need_review',
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
        failureReasons: [...member.source.failureReasons.filter(reason => !['product_text_missing', 'class_missing'].includes(reason))],
      };
      return card;
    });
    cards.push(...groupCards);
    groups.push({
      id: groupId,
      monthKey,
      skuId: sku.id,
      sku,
      cardIds: groupCards.map(card => card.id),
      classIds: [...new Set(classIds)].sort(),
      promotionFamilyId: null,
      price,
      status: failureReasons.some(reason => reason.startsWith('duplicate_class')) ? 'blocked' : 'need_review',
      failureReasons,
    });
  }
  quarantineCards.forEach(card => warnings.push(`card:${card.cardId}:${card.failureReasons.join(',') || 'sku_quarantine'}`));
  return {
    skus: [...new Map(resolved.map(item => [item.sku.id, item.sku])).values()],
    prices: [...prices.values()],
    cards,
    groups,
    quarantineCards,
    warnings,
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
  const cards = allCards.map(card => {
    if (!group.cardIds.includes(card.id) || !card.classId) return card;
    const tiers = family.tiersByClass[card.classId];
    const failureReasons = card.failureReasons.filter(reason => !reason.startsWith('promotion_'));
    return {
      ...card,
      promotionFamilyId: family.id,
      promotionTiers: tiers,
      failureReasons,
      status: card.price.effectivePrice && group.sku.status === 'active' && tiers.length && !failureReasons.length ? 'ready' as const : 'need_review' as const,
    };
  });
  return { group: nextGroup, cards, blockedClasses: [] };
}
