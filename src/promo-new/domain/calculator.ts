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
  for (const tier of ordered) {
    const withinMaximum = tier.maxQuantity == null || quantity <= tier.maxQuantity;
    if (quantity >= tier.minQuantity && withinMaximum) active = tier;
  }
  const next = ordered.find(tier => tier.minQuantity > quantity) || null;
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
    const percent = Math.max(0, Math.min(100, Number(active.discountPercent || 0)));
    cashDiscount = roundMoney(Math.min(grossAmount, grossAmount * percent / 100));
    netAmount = roundMoney(Math.max(0, grossAmount - cashDiscount));
  } else if (active?.type === 'free_goods') {
    giftQuantity = Math.floor(quantity / active.minQuantity) * active.freeQuantity;
    giftUnit = active.rewardUnit || active.purchaseUnit;
    cashDiscount = 0;
    netAmount = grossAmount;
  } else if (active?.type === 'bundle_price' && active.bundlePrice) {
    if (!Number.isFinite(active.bundlePrice.amount) || active.bundlePrice.amount <= 0) throw new Error('bundle_price_invalid');
    const bundles = Math.floor(quantity / active.minQuantity);
    const remainder = quantity % active.minQuantity;
    const computedBundleTotal = roundMoney(bundles * active.bundlePrice.amount + remainder * unitPrice);
    netAmount = Math.min(grossAmount, computedBundleTotal);
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
