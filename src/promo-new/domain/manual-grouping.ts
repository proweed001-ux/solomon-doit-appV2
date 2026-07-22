import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoCard, PromoDataset, ProductGroup, Sku, SkuPrice } from './types';

export interface ManualGroupingResult {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  movedCardIds: string[];
  targetGroupId: string;
}

type ManualTarget =
  | { groupId: string; skuId?: never }
  | { skuId: string; groupId?: never };

function emptyPrice(skuId: string): SkuPrice {
  return {
    skuId,
    pdfSourcePrice: null,
    centralOverridePrice: null,
    effectivePrice: null,
    source: 'missing',
    sourceReference: null,
    updatedAt: null,
  };
}

function groupForSku(dataset: PromoDataset, sku: Sku): ProductGroup {
  const existing = dataset.productGroups.find(group => group.skuId === sku.id);
  if (existing) return existing;
  const price = dataset.prices.find(item => item.skuId === sku.id) || emptyPrice(sku.id);
  return {
    id: `group:manual:${sku.id}`,
    monthKey: dataset.version.monthKey,
    skuId: sku.id,
    sku,
    cardIds: [],
    classIds: [],
    promotionFamilyId: null,
    price,
    status: 'need_review',
    failureReasons: price.effectivePrice ? [] : ['central_price_missing'],
  };
}

function cardFromQuarantine(source: ImportedCardCandidate, group: ProductGroup, dataset: PromoDataset): PromoCard {
  if (!source.classId) throw new Error(`การ์ด ${source.cardId} ไม่มี Class จึงยังจัดกลุ่มไม่ได้`);
  const family = dataset.promotionFamilies.find(item => item.id === group.promotionFamilyId);
  const tiers = family?.tiersByClass[source.classId] || [];
  return {
    id: source.cardId,
    monthKey: dataset.version.monthKey,
    page: source.page,
    sequence: source.sequence,
    classId: source.classId,
    imageUrl: source.imageUrl,
    skuId: group.skuId,
    productGroupId: group.id,
    promotionFamilyId: tiers.length ? group.promotionFamilyId : null,
    promotionTiers: tiers,
    price: group.price,
    status: 'need_review',
    evidence: {
      rawText: source.rawText,
      productText: source.productText,
      pageClassText: source.pageClassText,
      confidence: source.confidence,
      method: 'manual',
      cropBounds: {
        x: source.bounds.x,
        y: source.bounds.y,
        width: source.bounds.width,
        height: source.bounds.height,
      },
    },
    failureReasons: [],
  };
}

function moveCard(card: PromoCard, group: ProductGroup, dataset: PromoDataset): PromoCard {
  const family = dataset.promotionFamilies.find(item => item.id === group.promotionFamilyId);
  const tiers = card.classId ? family?.tiersByClass[card.classId] || [] : [];
  return {
    ...card,
    skuId: group.skuId,
    productGroupId: group.id,
    promotionFamilyId: tiers.length ? group.promotionFamilyId : null,
    promotionTiers: tiers,
    price: group.price,
    status: 'need_review',
    evidence: { ...card.evidence, method: 'manual' },
    failureReasons: card.failureReasons.filter(reason => !reason.startsWith('promotion_')),
  };
}

export function assignCardsManually(
  dataset: PromoDataset,
  quarantine: ImportedCardCandidate[],
  selectedCardIds: Iterable<string>,
  target: ManualTarget,
): ManualGroupingResult {
  const selected = new Set(selectedCardIds);
  if (!selected.size) throw new Error('เลือกการ์ดอย่างน้อย 1 ใบก่อนจัดกลุ่ม');

  let targetGroup = target.groupId
    ? dataset.productGroups.find(group => group.id === target.groupId)
    : undefined;
  if (!targetGroup && target.skuId) {
    const sku = dataset.skus.find(item => item.id === target.skuId && item.status !== 'quarantine');
    if (!sku) throw new Error('ไม่พบ SKU ปลายทางที่เลือก');
    targetGroup = groupForSku(dataset, sku);
  }
  if (!targetGroup) throw new Error('ไม่พบกลุ่มปลายทางที่เลือก');

  const existingSelected = dataset.cards.filter(card => selected.has(card.id));
  const quarantineSelected = quarantine.filter(card => selected.has(card.cardId));
  if (existingSelected.length + quarantineSelected.length !== selected.size) {
    throw new Error('มีการ์ดที่เลือกไม่อยู่ในชุดข้อมูลปัจจุบัน กรุณาเลือกใหม่');
  }

  const selectedExistingIds = new Set(existingSelected.map(card => card.id));
  const targetExisting = dataset.cards.filter(card =>
    card.productGroupId === targetGroup!.id && !selectedExistingIds.has(card.id));
  const incoming = [
    ...existingSelected.map(card => moveCard(card, targetGroup!, dataset)),
    ...quarantineSelected.map(card => cardFromQuarantine(card, targetGroup!, dataset)),
  ];
  const targetCards = [...targetExisting, ...incoming];
  const classes = targetCards.map(card => card.classId).filter((value): value is string => Boolean(value));
  const duplicateClass = classes.find((classId, index) => classes.indexOf(classId) !== index);
  if (duplicateClass) {
    throw new Error(`รวมไม่ได้: กลุ่มปลายทางจะมี Class ${duplicateClass} ซ้ำกัน`);
  }

  const movedById = new Map(incoming.map(card => [card.id, card]));
  const cards = dataset.cards.map(card => movedById.get(card.id) || card);
  quarantineSelected.forEach(source => cards.push(movedById.get(source.cardId)!));

  const groups: ProductGroup[] = [];
  const groupSeed = dataset.productGroups.some(group => group.id === targetGroup!.id)
    ? dataset.productGroups
    : [...dataset.productGroups, targetGroup];
  for (const group of groupSeed) {
    const members = cards.filter(card => card.productGroupId === group.id);
    if (!members.length) continue;
    if (group.id === targetGroup.id) {
      groups.push({
        ...targetGroup,
        cardIds: members.map(card => card.id),
        classIds: [...new Set(members.flatMap(card => card.classId ? [card.classId] : []))].sort(),
        status: 'need_review',
        failureReasons: targetGroup.failureReasons.filter(reason => !reason.startsWith('duplicate_class:')),
      });
    } else {
      groups.push({
        ...group,
        cardIds: members.map(card => card.id),
        classIds: [...new Set(members.flatMap(card => card.classId ? [card.classId] : []))].sort(),
      });
    }
  }

  return {
    dataset: {
      ...dataset,
      prices: dataset.prices.some(price => price.skuId === targetGroup.skuId)
        ? dataset.prices
        : [...dataset.prices, targetGroup.price],
      cards,
      productGroups: groups,
    },
    quarantine: quarantine.filter(card => !selected.has(card.cardId)),
    movedCardIds: [...selected],
    targetGroupId: targetGroup.id,
  };
}
