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
