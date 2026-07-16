import type { Money, PromoCard, ProductGroup, Sku, SkuPrice } from './types';

export interface StoredPrice {
  skuIdentityKey: string;
  skuId: string;
  amount: number;
  currency: 'THB';
  sourceReference: string;
  updatedAt: string;
}

const money = (amount: number): Money => ({ amount: Number(amount.toFixed(2)), currency: 'THB' });

export function missingSkuPrice(skuId: string, pdfSourceAmount: number | null = null): SkuPrice {
  const pdf = pdfSourceAmount && pdfSourceAmount > 0 ? money(pdfSourceAmount) : null;
  return {
    skuId,
    pdfSourcePrice: pdf,
    centralOverridePrice: null,
    effectivePrice: pdf,
    source: pdf ? 'pdf' : 'missing',
    sourceReference: pdf ? 'pdf_source_price' : null,
    updatedAt: null,
  };
}

export function inheritedSkuPrice(sku: Sku, storedPrices: StoredPrice[]): SkuPrice {
  const exact = storedPrices.find(price => price.skuIdentityKey === sku.identityKey);
  if (!exact) return missingSkuPrice(sku.id);
  return {
    skuId: sku.id,
    pdfSourcePrice: null,
    centralOverridePrice: money(exact.amount),
    effectivePrice: money(exact.amount),
    source: 'central_override',
    sourceReference: exact.sourceReference,
    updatedAt: exact.updatedAt,
  };
}

export function setCentralPrice(current: SkuPrice, amount: number, sourceReference = 'admin_input'): SkuPrice {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('central_price_invalid');
  const central = money(amount);
  return {
    ...current,
    centralOverridePrice: central,
    effectivePrice: central,
    source: 'central_override',
    sourceReference,
    updatedAt: new Date().toISOString(),
  };
}

export function applyPriceToGroup(group: ProductGroup, cards: PromoCard[], price: SkuPrice): { group: ProductGroup; cards: PromoCard[] } {
  if (price.skuId !== group.skuId) throw new Error('price_sku_mismatch');
  const nextGroup: ProductGroup = {
    ...group,
    price,
    status: price.effectivePrice && group.promotionFamilyId && !group.failureReasons.length ? 'ready' : group.status,
  };
  const nextCards = cards.map(card => group.cardIds.includes(card.id) ? {
    ...card,
    price,
    status: price.effectivePrice && card.promotionFamilyId && card.promotionTiers.length && !card.failureReasons.length ? 'ready' as const : card.status,
  } : card);
  return { group: nextGroup, cards: nextCards };
}
