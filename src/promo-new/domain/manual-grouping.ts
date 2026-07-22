import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoCard, PromoDataset, ProductGroup, Sku, SkuPrice } from './types';

export interface ManualGroupingResult {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  movedCardIds: string[];
  targetGroupId: string;
}

export interface ManualUnassignResult {
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
  removedCardIds: string[];
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
    failureReasons: card.failureReasons.filter(reason => !reason.startsWith('promotion_') && !reason.startsWith('duplicate_class:')),
  };
}

function rebuildGroups(groups: ProductGroup[], cards: PromoCard[], targetGroup?: ProductGroup): ProductGroup[] {
  const seed = targetGroup && !groups.some(group => group.id === targetGroup.id)
    ? [...groups, targetGroup]
    : groups;
  return seed.flatMap(group => {
    const members = cards.filter(card => card.productGroupId === group.id);
    if (!members.length) return [];
    const base = targetGroup?.id === group.id ? targetGroup : group;
    return [{
      ...base,
      cardIds: members.map(card => card.id),
      classIds: [...new Set(members.flatMap(card => card.classId ? [card.classId] : []))].sort(),
      status: 'need_review' as const,
      failureReasons: base.failureReasons.filter(reason => !reason.startsWith('duplicate_class:')),
    }];
  });
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
  const uniqueIncoming = new Map(incoming.map(card => [card.id, card]));
  const targetCards = [...targetExisting, ...uniqueIncoming.values()];
  if (new Set(targetCards.map(card => card.id)).size !== targetCards.length) {
    throw new Error('รวมไม่ได้: พบการ์ดใบเดิมซ้ำในกลุ่มปลายทาง');
  }

  const movedById = new Map(uniqueIncoming);
  const cards = dataset.cards.map(card => movedById.get(card.id) || card);
  quarantineSelected.forEach(source => {
    if (!cards.some(card => card.id === source.cardId)) cards.push(movedById.get(source.cardId)!);
  });

  return {
    dataset: {
      ...dataset,
      prices: dataset.prices.some(price => price.skuId === targetGroup.skuId)
        ? dataset.prices
        : [...dataset.prices, targetGroup.price],
      cards,
      productGroups: rebuildGroups(dataset.productGroups, cards, targetGroup),
    },
    quarantine: quarantine.filter(card => !selected.has(card.cardId)),
    movedCardIds: [...selected],
    targetGroupId: targetGroup.id,
  };
}

function toImportedCard(card: PromoCard): ImportedCardCandidate {
  const bounds = card.evidence.cropBounds || { x: 0, y: 0, width: 1, height: 1 };
  const evidenceMethod = card.evidence.method === 'pdf_text' || card.evidence.method === 'page_ocr'
    ? card.evidence.method
    : 'none';
  return {
    cardId: card.id,
    monthKey: card.monthKey,
    page: card.page,
    sequence: card.sequence,
    classId: card.classId,
    imageUrl: card.imageUrl || '',
    rawText: card.evidence.rawText,
    productText: card.evidence.productText,
    pageClassText: card.evidence.pageClassText,
    confidence: card.evidence.confidence,
    evidenceMethod,
    bounds,
    failureReasons: ['manual_unassigned'],
  };
}

export function unassignCardsManually(
  dataset: PromoDataset,
  quarantine: ImportedCardCandidate[],
  selectedCardIds: Iterable<string>,
): ManualUnassignResult {
  const selected = new Set(selectedCardIds);
  if (!selected.size) throw new Error('เลือกการ์ดในกลุ่มอย่างน้อย 1 ใบก่อนนำออก');
  const removed = dataset.cards.filter(card => selected.has(card.id));
  if (removed.length !== selected.size) throw new Error('นำออกได้เฉพาะการ์ดที่อยู่ในกลุ่มปัจจุบัน');
  const cards = dataset.cards.filter(card => !selected.has(card.id));
  const existingQuarantine = new Set(quarantine.map(card => card.cardId));
  const nextQuarantine = [...quarantine];
  for (const card of removed) {
    if (!existingQuarantine.has(card.id)) nextQuarantine.push(toImportedCard(card));
  }
  return {
    dataset: {
      ...dataset,
      cards,
      productGroups: rebuildGroups(dataset.productGroups, cards),
    },
    quarantine: nextQuarantine,
    removedCardIds: removed.map(card => card.id),
  };
}
