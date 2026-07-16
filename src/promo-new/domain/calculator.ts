import type { PromotionTier } from './types';

export interface PromotionCalculation {
  quantity: number;
  unitPrice: number;
  grossAmount: number;
  activeTier: PromotionTier | null;
  nextTier: PromotionTier | null;
  cashDiscount: number;
  giftQuantity: number;
  giftUnit: string | null;
  netAmount: number;
  purchasedUnitPrice: number;
  effectiveUnitPriceIncludingGifts: number;
}

export const roundMoney = (value: number): number => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export function selectPromotionTier(tiers: PromotionTier[], quantity: number): { active: PromotionTier | null; next: PromotionTier | null } {
  const ordered = [...tiers].sort((left, right) => left.minQuantity - right.minQuantity || left.tierNo - right.tierNo);
  let active: PromotionTier | null = null;
  let next: PromotionTier | null = null;
  for (const tier of ordered) {
    const withinMaximum = tier.maxQuantity == null || quantity <= tier.maxQuantity;
    if (quantity >= tier.minQuantity && withinMaximum) active = tier;
    else if (quantity < tier.minQuantity && !next) next = tier;
  }
  if (!active) {
    const reached = ordered.filter(tier => quantity >= tier.minQuantity);
    active = reached[reached.length - 1] || null;
  }
  if (active) next = ordered.find(tier => tier.minQuantity > active!.minQuantity) || null;
  return { active, next };
}

export function calculatePromotion(unitPrice: number, quantityInput: number, tiers: PromotionTier[]): PromotionCalculation {
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) throw new Error('unit_price_invalid');
  const quantity = Math.max(1, Math.floor(Number(quantityInput) || 1));
  const { active, next } = selectPromotionTier(tiers, quantity);
  const grossAmount = roundMoney(unitPrice * quantity);
  let cashDiscount = 0;
  let giftQuantity = 0;
  let giftUnit: string | null = null;
  let netAmount = grossAmount;
  if (active?.type === 'cash_discount') {
    cashDiscount = roundMoney(grossAmount * Number(active.discountPercent || 0) / 100);
    netAmount = roundMoney(grossAmount - cashDiscount);
  } else if (active?.type === 'free_goods') {
    giftQuantity = Math.floor(quantity / active.minQuantity) * active.freeQuantity;
    giftUnit = active.rewardUnit || active.purchaseUnit;
    // effectivePercent is display-only. It must never reduce cash here.
    cashDiscount = 0;
    netAmount = grossAmount;
  } else if (active?.type === 'bundle_price' && active.bundlePrice) {
    const bundles = Math.floor(quantity / active.minQuantity);
    const remainder = quantity % active.minQuantity;
    netAmount = roundMoney(bundles * active.bundlePrice.amount + remainder * unitPrice);
    cashDiscount = roundMoney(grossAmount - netAmount);
  }
  return {
    quantity,
    unitPrice: roundMoney(unitPrice),
    grossAmount,
    activeTier: active,
    nextTier: next,
    cashDiscount,
    giftQuantity,
    giftUnit,
    netAmount,
    purchasedUnitPrice: roundMoney(netAmount / quantity),
    effectiveUnitPriceIncludingGifts: roundMoney(netAmount / Math.max(1, quantity + giftQuantity)),
  };
}
