import type { PromoTier } from './promoTypes';

export type PromoCalcResult = {
  qty: number;
  unitPrice: number | null;
  gross: number | null;
  discountPercent: number;
  discountAmount: number | null;
  freeQty: number;
  totalQtyReceived: number;
  net: number | null;
  averagePrice: number | null;
  tier?: PromoTier;
};

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function money(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '-';
  return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmt(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '-';
  return value.toLocaleString('th-TH', { maximumFractionDigits: 2 });
}

export function bestTier(qty: number, tiers: PromoTier[]): PromoTier | undefined {
  return tiers
    .filter(tier => (tier.min_qty ?? 0) <= qty)
    .sort((a, b) => (b.min_qty ?? 0) - (a.min_qty ?? 0))[0];
}

export function calculatePromo(qtyInput: number, unitPrice: number | null | undefined, tiers: PromoTier[]): PromoCalcResult {
  const qty = Number.isFinite(qtyInput) && qtyInput > 0 ? qtyInput : 0;
  const price = unitPrice != null && Number.isFinite(unitPrice) && unitPrice > 0 ? unitPrice : null;
  const tier = bestTier(qty, tiers);
  const discountPercent = tier?.discount_percent ?? 0;
  const freeQty = tier?.free_qty ?? 0;
  const gross = price == null ? null : round2(qty * price);
  const discountAmount = gross == null ? null : round2(gross * discountPercent / 100);
  const net = gross == null || discountAmount == null ? null : round2(gross - discountAmount);
  const totalQtyReceived = qty + freeQty;
  const averagePrice = net == null || totalQtyReceived <= 0 ? null : round2(net / totalQtyReceived);

  return { qty, unitPrice: price, gross, discountPercent, discountAmount, freeQty, totalQtyReceived, net, averagePrice, tier };
}
