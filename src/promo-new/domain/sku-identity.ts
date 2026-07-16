import type { Sku, SkuIdentity } from './types';

const BRAND_NAMES = [
  'HEAD & SHOULDERS', 'HEAD AND SHOULDERS', 'H&S', 'ORAL-B', 'ORAL B', 'OLD SPICE',
  'PANTENE', 'REJOICE', 'DOWNY', 'OLAY', 'GILLETTE', 'SAFEGUARD', 'VICKS', 'ARIEL',
  'FEBREZE', 'AMBI PUR', 'BRAUN', 'CREST', 'DASH', 'FAIRY', 'GAIN', 'HERBAL ESSENCES',
  'OLAY', 'ORAL-B', 'PAMPERS', 'TIDE', 'WHISPER', 'LENOR', 'JOY',
];

const PRODUCT_TYPES: Array<{ canonical: string; patterns: RegExp[] }> = [
  { canonical: 'แชมพู', patterns: [/แชมพู/iu, /SHAMPOO/iu] },
  { canonical: 'ครีมนวด', patterns: [/ครีมนวด/iu, /CONDITIONER/iu] },
  { canonical: 'ผงซักฟอก', patterns: [/ผงซักฟอก/iu, /POWDER\s*DETERGENT/iu] },
  { canonical: 'น้ำยาซักผ้า', patterns: [/น้ำยาซักผ้า/iu, /LIQUID\s*DETERGENT|LAUNDRY\s*LIQUID/iu] },
  { canonical: 'ปรับผ้านุ่ม', patterns: [/ปรับผ้านุ่ม/iu, /FABRIC\s*SOFTENER/iu] },
  { canonical: 'ผลิตภัณฑ์ล้างจาน', patterns: [/ล้างจาน/iu, /DISHWASH/iu] },
  { canonical: 'สบู่', patterns: [/สบู่/iu, /SOAP|BODY\s*WASH/iu] },
  { canonical: 'ยาสีฟัน', patterns: [/ยาสีฟัน/iu, /TOOTHPASTE/iu] },
  { canonical: 'แปรงสีฟัน', patterns: [/แปรงสีฟัน/iu, /TOOTHBRUSH/iu] },
  { canonical: 'มีดโกน', patterns: [/มีดโกน|ใบมีดโกน/iu, /RAZOR|BLADES?/iu] },
  { canonical: 'สกินแคร์', patterns: [/ครีมบ[ำํ]ารุง|เซรั่ม|มอยส์เจอไรเซอร์/iu, /SERUM|CREAM|MOISTURI[ZS]ER/iu] },
  { canonical: 'ผ้าอ้อม', patterns: [/ผ้าอ้อม/iu, /DIAPERS?/iu] },
  { canonical: 'ยาอม', patterns: [/ยาอม/iu, /LOZENGES?/iu] },
  { canonical: 'ยาดม', patterns: [/ยาดม/iu, /INHALER/iu] },
  { canonical: 'ผลิตภัณฑ์ระงับกลิ่น', patterns: [/ระงับกลิ่น|โรลออน/iu, /DEODORANT/iu] },
];

const SIZE_UNIT: Record<string, string> = {
  ML: 'มล.', 'มล': 'มล.', 'มล.': 'มล.', L: 'ลิตร', LT: 'ลิตร', 'ลิตร': 'ลิตร',
  G: 'กรัม', GM: 'กรัม', 'กรัม': 'กรัม', KG: 'กก.', 'กก': 'กก.', 'กก.': 'กก.',
  CM: 'ซม.', 'ซม': 'ซม.', 'ซม.': 'ซม.',
};

const SALES_UNITS = ['ขวด', 'ชิ้น', 'ซอง', 'ถุง', 'กล่อง', 'แพ็ค', 'แพค', 'ด้าม', 'หลอด', 'กระปุก', 'ชุด'];

export function normalizeProductText(value: unknown): string {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[×✕]/g, 'x')
    .replace(/\s+/g, ' ')
    .trim();
}

function identityOnlyText(value: string): string {
  return value.split(/(?:เมื่อ)?\s*ซื้อ|ลด\s*\d|แถม|ฟรี/iu)[0].trim();
}

function detectBrand(text: string): string | null {
  const upper = text.toUpperCase();
  const exact = [...BRAND_NAMES].sort((a, b) => b.length - a.length).find(brand => upper.includes(brand));
  if (exact === 'HEAD AND SHOULDERS' || exact === 'HEAD & SHOULDERS') return 'H&S';
  if (exact === 'ORAL B') return 'ORAL-B';
  if (exact) return exact;
  const first = text.match(/^([A-Z][A-Z0-9&' -]{1,28})(?=\s|$)/)?.[1]?.trim();
  return first || null;
}

function detectProductType(text: string): { canonical: string; raw: string } | null {
  for (const type of PRODUCT_TYPES) {
    for (const pattern of type.patterns) {
      const match = text.match(pattern);
      if (match) return { canonical: type.canonical, raw: match[0] };
    }
  }
  return null;
}

function detectSize(text: string): { value: number | null; unit: string | null; raw: string | null } {
  const matches = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(ML|มล\.?|L|LT|ลิตร|G|GM|กรัม|KG|กก\.?|CM|ซม\.?)(?![A-Zก-๙])/giu)];
  if (!matches.length) return { value: null, unit: null, raw: null };
  const match = matches[0];
  const value = Number(match[1].replace(',', '.'));
  const rawUnit = match[2].toUpperCase().replace(/\.$/, '');
  const unit = SIZE_UNIT[rawUnit] || SIZE_UNIT[match[2]] || match[2];
  return { value: Number.isFinite(value) && value > 0 ? value : null, unit, raw: match[0] };
}

function detectPack(text: string): { quantity: number; raw: string | null } {
  const patterns = [
    /(?:แพ็ค|แพค|PACK)\s*(?:ละ|X)?\s*(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)?/iu,
    /(\d{1,3})\s*(?:ชิ้น|ขวด|ซอง|ถุง|ด้าม|หลอด)\s*\/(?:แพ็ค|แพค|PACK)/iu,
    /(?:^|\s)[Xx]\s*(\d{1,3})(?:\s|$)/u,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const quantity = Number(match?.[1]);
    if (match && Number.isInteger(quantity) && quantity > 0) return { quantity, raw: match[0] };
  }
  return { quantity: 1, raw: null };
}

function detectSalesUnit(text: string): string {
  const found = SALES_UNITS.find(unit => new RegExp(unit, 'iu').test(text));
  return found === 'แพค' ? 'แพ็ค' : found || 'ชิ้น';
}

function stableHash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).toUpperCase().padStart(7, '0');
}

function canonicalPart(value: unknown): string {
  return normalizeProductText(value).toUpperCase().replace(/[^A-Z0-9ก-๙]+/gu, ' ').trim();
}

export function buildSkuIdentityKey(identity: SkuIdentity): string {
  return [
    canonicalPart(identity.brand), canonicalPart(identity.productType), canonicalPart(identity.variant || ''),
    Number(identity.sizeValue).toFixed(3), canonicalPart(identity.sizeUnit), canonicalPart(identity.salesUnit), String(identity.packQuantity),
  ].join('|');
}

function variantText(text: string, brand: string | null, productTypeRaw: string | null, sizeRaw: string | null, packRaw: string | null): string | null {
  let value = text;
  for (const remove of [brand, productTypeRaw, sizeRaw, packRaw].filter((item): item is string => Boolean(item))) {
    value = value.replace(new RegExp(remove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu'), ' ');
  }
  for (const unit of SALES_UNITS) value = value.replace(new RegExp(unit, 'giu'), ' ');
  value = value.replace(/\s+/g, ' ').trim();
  return value || null;
}

export function createSkuCandidate(productEvidence: string): Sku {
  const source = identityOnlyText(normalizeProductText(productEvidence));
  const brand = detectBrand(source);
  const productType = detectProductType(source);
  const size = detectSize(source);
  const pack = detectPack(source);
  const salesUnit = detectSalesUnit(source);
  const variant = variantText(source, brand, productType?.raw || null, size.raw, pack.raw);
  const failureReasons = [
    ...(!brand ? ['brand_missing'] : []),
    ...(!productType ? ['product_type_missing'] : []),
    ...(!size.value ? ['size_missing'] : []),
    ...(!size.unit ? ['size_unit_missing'] : []),
  ];
  const identity: SkuIdentity = {
    brand: brand || '',
    productType: productType?.canonical || '',
    variant,
    sizeValue: size.value || 0,
    sizeUnit: size.unit || '',
    salesUnit,
    packQuantity: pack.quantity,
  };
  const identityKey = buildSkuIdentityKey(identity);
  const code = `SKU-${stableHash(identityKey)}`;
  return {
    id: `sku:${stableHash(identityKey)}`,
    code,
    canonicalName: source || 'สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ',
    identityKey,
    identity,
    status: failureReasons.length ? 'quarantine' : 'candidate',
    evidence: source ? [source] : [],
    failureReasons,
  };
}

export function confirmSkuCandidate(sku: Sku): Sku {
  if (sku.failureReasons.length) throw new Error(`sku_evidence_incomplete:${sku.failureReasons.join(',')}`);
  return { ...sku, status: 'active' };
}

export function sameSku(left: Sku, right: Sku): boolean {
  return left.identityKey === right.identityKey;
}
