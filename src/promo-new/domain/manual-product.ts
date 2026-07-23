import type { PromoDataset, Sku, SkuIdentity, SkuPrice } from './types';

export interface ManualProductInput {
  canonicalName: string;
  brand: string;
  productType: string;
  variant: string;
  sizeValue: number;
  sizeUnit: string;
  salesUnit: string;
  packQuantity: number;
  aliases: string[];
}

const clean = (value: unknown): string => String(value || '').replace(/\s+/gu, ' ').trim();

function stableHash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).toUpperCase().padStart(7, '0');
}

export function normalizeManualProductKey(value: string): string {
  return clean(value).toLowerCase().normalize('NFKC').replace(/[^a-z0-9ก-๙]+/gu, '');
}

function tokens(value: string): Set<string> {
  return new Set(clean(value).toLowerCase().normalize('NFKC').split(/[^a-z0-9ก-๙]+/gu).filter(token => token.length >= 2));
}

function dice(left: string, right: string): number {
  const bigrams = (value: string) => {
    const normalized = normalizeManualProductKey(value);
    const result = new Map<string, number>();
    for (let index = 0; index < normalized.length - 1; index += 1) {
      const key = normalized.slice(index, index + 2);
      result.set(key, (result.get(key) || 0) + 1);
    }
    return result;
  };
  const a = bigrams(left);
  const b = bigrams(right);
  let overlap = 0;
  a.forEach((count, key) => { overlap += Math.min(count, b.get(key) || 0); });
  const total = [...a.values()].reduce((sum, count) => sum + count, 0)
    + [...b.values()].reduce((sum, count) => sum + count, 0);
  return total ? (2 * overlap) / total : 0;
}

export interface SimilarMasterMatch {
  sku: Sku;
  score: number;
}

export function findSimilarProductMasters(input: ManualProductInput, skus: Sku[]): SimilarMasterMatch[] {
  const query = [
    input.canonicalName,
    input.brand,
    input.productType,
    input.variant,
    input.sizeValue || '',
    input.sizeUnit,
    input.salesUnit,
    input.packQuantity,
  ].join(' ');
  const queryTokens = tokens(query);
  return skus.flatMap(sku => {
    const candidate = [
      sku.canonicalName,
      sku.identity.brand,
      sku.identity.productType,
      sku.identity.variant || '',
      sku.identity.sizeValue || '',
      sku.identity.sizeUnit,
      sku.identity.salesUnit,
      sku.identity.packQuantity,
      ...sku.evidence,
    ].join(' ');
    const candidateTokens = tokens(candidate);
    const intersection = [...queryTokens].filter(token => candidateTokens.has(token)).length;
    const union = new Set([...queryTokens, ...candidateTokens]).size;
    const tokenScore = union ? intersection / union : 0;
    const score = Math.max(dice(input.canonicalName, sku.canonicalName), dice(query, candidate), tokenScore);
    return score >= 0.58 ? [{ sku, score }] : [];
  }).sort((left, right) => right.score - left.score || left.sku.canonicalName.localeCompare(right.sku.canonicalName, 'th')).slice(0, 5);
}

export function validateManualProductInput(input: ManualProductInput): string[] {
  const errors: string[] = [];
  if (clean(input.canonicalName).length < 3) errors.push('กรอกชื่อกลุ่มสินค้าอย่างน้อย 3 ตัวอักษร');
  if (!clean(input.brand)) errors.push('กรอกแบรนด์');
  if (!clean(input.productType)) errors.push('กรอกประเภทสินค้า');
  if (!clean(input.salesUnit)) errors.push('เลือกหน่วยขาย');
  if (!Number.isFinite(input.sizeValue) || input.sizeValue < 0) errors.push('ขนาดสินค้าต้องเป็นเลขตั้งแต่ 0 ขึ้นไป');
  if (input.sizeValue > 0 && !clean(input.sizeUnit)) errors.push('กรอกหน่วยขนาด');
  if (!Number.isInteger(input.packQuantity) || input.packQuantity < 1 || input.packQuantity > 999) errors.push('จำนวนต่อแพ็กต้องเป็นจำนวนเต็ม 1-999');
  return [...new Set(errors)];
}

export function emptyManualPrice(skuId: string): SkuPrice {
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

export function createManualSku(input: ManualProductInput, persistedId?: string): Sku {
  const errors = validateManualProductInput(input);
  if (errors.length) throw new Error(errors.join(' · '));
  const canonicalName = clean(input.canonicalName);
  const identity: SkuIdentity = {
    brand: clean(input.brand),
    productType: clean(input.productType),
    variant: clean(input.variant) || null,
    sizeValue: Number(input.sizeValue || 0),
    sizeUnit: clean(input.sizeUnit),
    salesUnit: clean(input.salesUnit),
    packQuantity: Number(input.packQuantity),
  };
  const identityKey = normalizeManualProductKey([
    canonicalName,
    identity.brand,
    identity.productType,
    identity.variant || '',
    identity.sizeValue || '',
    identity.sizeUnit,
    identity.salesUnit,
    identity.packQuantity,
  ].join('|'));
  const id = persistedId || `MANUAL-${stableHash(identityKey)}`;
  return {
    id,
    code: id.startsWith('MASTER-') ? `PM-${id.slice(7).replace(/-/gu, '').slice(0, 10).toUpperCase()}` : `PM-NEW-${stableHash(identityKey)}`,
    canonicalName,
    identityKey,
    identity,
    status: 'active',
    evidence: [...new Set(['manual_product_master', ...input.aliases.map(clean).filter(Boolean)])],
    failureReasons: [],
  };
}

export function ensureSkuInDataset(dataset: PromoDataset, sku: Sku): PromoDataset {
  const duplicate = dataset.skus.find(item => item.id !== sku.id && item.identityKey === sku.identityKey && item.status === 'active');
  if (duplicate) throw new Error(`มีกลุ่มใกล้เคียงอยู่แล้ว: ${duplicate.canonicalName}`);
  const skus = dataset.skus.some(item => item.id === sku.id)
    ? dataset.skus.map(item => item.id === sku.id ? sku : item)
    : [...dataset.skus, sku];
  const prices = dataset.prices.some(item => item.skuId === sku.id)
    ? dataset.prices
    : [...dataset.prices, emptyManualPrice(sku.id)];
  return { ...dataset, skus, prices };
}
