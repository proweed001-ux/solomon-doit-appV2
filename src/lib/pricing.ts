export function safeNum(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  const raw = String(value).trim();
  const isParenNegative = /^\(.*\)$/.test(raw);
  const cleaned = raw
    .replace(/,/g, '')
    .replace(/[฿$]/g, '')
    .replace(/[()]/g, '')
    .trim();

  if (!cleaned || cleaned === '-' || cleaned === '—') return 0;

  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return isParenNegative ? -Math.abs(n) : n;
}

export function safeQty(value: unknown): number {
  const n = safeNum(value);
  if (n === 0) return 0;
  return Math.round(n);
}

export function roundMoney(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round((safeNum(value) + Number.EPSILON) * factor) / factor;
}

export function unitPriceFromAmount(amount: number, qtyPcs: number): number {
  const qty = safeQty(qtyPcs);
  if (qty === 0) return 0;
  return roundMoney(safeNum(amount) / qty);
}

export function lineTotal(qtyPcs: number, unitPrice: number): number {
  return roundMoney(safeQty(qtyPcs) * safeNum(unitPrice));
}
