import type { Sku, SkuIdentity } from './types';

const BRAND_NAMES = [
  'HEAD & SHOULDERS', 'HEAD AND SHOULDERS', 'H&S', 'ORAL-B', 'ORAL B', 'OLD SPICE',
  'PANTENE', 'REJOICE', 'DOWNY', 'OLAY', 'GILLETTE', 'SAFEGUARD', 'VICKS', 'ARIEL',
  'FEBREZE', 'AMBI PUR', 'BRAUN', 'CREST', 'DASH', 'FAIRY', 'GAIN', 'HERBAL ESSENCES',
  'PAMPERS', 'TIDE', 'WHISPER', 'LENOR', 'JOY',
];

const THAI_BRAND_ALIASES: Array<{ canonical: string; aliases: string[]; maxDistance: number }> = [
  { canonical: 'H&S', aliases: ['เฮดแอนด์โชว์เดอร์', 'เฮดแอนด์โชว์เตอร์'], maxDistance: 4 },
  { canonical: 'PANTENE', aliases: ['แพนทีน'], maxDistance: 2 },
  { canonical: 'REJOICE', aliases: ['รีจอยส์', 'รีออยส์'], maxDistance: 2 },
  { canonical: 'DOWNY', aliases: ['ดาวน์นี่'], maxDistance: 2 },
  { canonical: 'OLAY', aliases: ['โอเลย์', 'โอเอย์'], maxDistance: 1 },
  { canonical: 'ORAL-B', aliases: ['ออรัลบี', 'ออรัลบ'], maxDistance: 2 },
  { canonical: 'GILLETTE', aliases: ['กิลเลตต์', 'ยิลเลตต์', 'ยิลเลตส์'], maxDistance: 2 },
  { canonical: 'SAFEGUARD', aliases: ['เซฟการ์ด'], maxDistance: 2 },
  { canonical: 'VICKS', aliases: ['วิคส์'], maxDistance: 1 },
  { canonical: 'AMBI PUR', aliases: ['แอมบิเพอร์', 'แอมบิเพอร์เอลเฟรชมิน'], maxDistance: 3 },
];

const PRODUCT_TYPES: Array<{ canonical: string; patterns: RegExp[]; aliases?: Array<{ value: string; maxDistance: number }> }> = [
  { canonical: 'แชมพู', patterns: [/แชมพู/iu, /SHAMPOO/iu], aliases: [{ value: 'แชมพู', maxDistance: 2 }] },
  { canonical: 'ครีมนวด', patterns: [/ครีมนวด/iu, /CONDITIONER/iu], aliases: [{ value: 'ครีมนวด', maxDistance: 2 }] },
  { canonical: 'ผงซักฟอก', patterns: [/ผงซักฟอก/iu, /POWDER\s*DETERGENT/iu] },
  { canonical: 'น้ำยาซักผ้า', patterns: [/น้ำยาซักผ้า/iu, /LIQUID\s*DETERGENT|LAUNDRY\s*LIQUID/iu] },
  { canonical: 'ปรับผ้านุ่ม', patterns: [/ปรับผ้านุ่ม/iu, /FABRIC\s*SOFTENER/iu], aliases: [{ value: 'ปรับผ้านุ่ม', maxDistance: 2 }] },
  { canonical: 'ผลิตภัณฑ์ล้างจาน', patterns: [/ล้างจาน/iu, /DISHWASH/iu] },
  { canonical: 'สบู่', patterns: [/สบู่/iu, /SOAP|BODY\s*WASH/iu], aliases: [{ value: 'สบู่', maxDistance: 1 }] },
  { canonical: 'ยาสีฟัน', patterns: [/ยาสีฟัน/iu, /TOOTHPASTE/iu] },
  { canonical: 'แปรงสีฟัน', patterns: [/แปรงสีฟัน/iu, /TOOTHBRUSH/iu], aliases: [{ value: 'แปรงสีฟัน', maxDistance: 2 }] },
  { canonical: 'มีดโกน', patterns: [/มีดโกน|ใบมีดโกน|ด้ามมีด|ใบมีด/iu, /RAZOR|BLADES?/iu] },
  { canonical: 'สกินแคร์', patterns: [/ครีมบ[ำํ]ารุง|เซรั่ม|มอยส์เจอไรเซอร์|โททัลไวท์|โททัลเอฟเฟ็คส์|ไวท์เรเดียนซ์/iu, /SERUM|CREAM|MOISTURI[ZS]ER|TOTAL\s*(?:WHITE|EFFECTS)/iu] },
  { canonical: 'ผ้าอ้อม', patterns: [/ผ้าอ้อม/iu, /DIAPERS?/iu] },
  { canonical: 'ยาอม', patterns: [/ยาอม/iu, /LOZENGES?/iu] },
  { canonical: 'ยาดม', patterns: [/ยาดม/iu, /INHALER/iu] },
  { canonical: 'ผลิตภัณฑ์ระงับกลิ่น', patterns: [/ระงับกลิ่น|โรลออน/iu, /DEODORANT/iu] },
];

const SIZE_UNIT: Record<string, string> = {
  ML: 'มล.', 'มล': 'มล.', 'มล.': 'มล.', 'บล': 'มล.', 'บล.': 'มล.',
  L: 'ลิตร', LT: 'ลิตร', 'ลิตร': 'ลิตร',
  G: 'กรัม', GM: 'กรัม', 'กรัม': 'กรัม', 'กรับ': 'กรัม',
  KG: 'กก.', 'กก': 'กก.', 'กก.': 'กก.',
  CM: 'ซม.', 'ซม': 'ซม.', 'ซม.': 'ซม.',
  'ด้าม': 'ด้าม', 'ใบ': 'ใบ',
};

const SALES_UNITS = ['ขวด', 'ชิ้น', 'ซอง', 'ถุง', 'กล่อง', 'แพ็ค', 'แพค', 'ด้าม', 'หลอด', 'กระปุก', 'ก้อน', 'ชุด'];

const THAI_DIGITS: Record<string, string> = { '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4', '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9' };

export function normalizeProductText(value: unknown): string {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[๐-๙]/g, digit => THAI_DIGITS[digit])
    .replace(/[×✕]/g, 'x')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,])/g, '$1')
    .trim();
}

function identityOnlyText(value: string): string {
  return value.split(/(?:เมื่อ)?\s*ซื้อ|ลด\s*\d|แถม|ฟรี/iu)[0].trim();
}

function comparable(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9ก-๙&]+/gu, '');
}

function editDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

interface ApproximateMatch {
  index: number;
  length: number;
  raw: string;
  distance: number;
}

function approximateSubstring(text: string, expected: string, maxDistance: number): ApproximateMatch | null {
  const source = comparable(text);
  const target = comparable(expected);
  if (!source || !target) return null;
  const exactIndex = source.indexOf(target);
  if (exactIndex >= 0) return { index: exactIndex, length: target.length, raw: source.slice(exactIndex, exactIndex + target.length), distance: 0 };
  let best: ApproximateMatch | null = null;
  const minimumLength = Math.max(1, target.length - maxDistance);
  const maximumLength = Math.min(source.length, target.length + maxDistance);
  for (let length = minimumLength; length <= maximumLength; length += 1) {
    for (let index = 0; index + length <= source.length; index += 1) {
      const raw = source.slice(index, index + length);
      const distance = editDistance(raw, target);
      if (!best || distance < best.distance || (distance === best.distance && Math.abs(length - target.length) < Math.abs(best.length - target.length))) {
        best = { index, length, raw, distance };
      }
    }
  }
  return best && best.distance <= maxDistance ? best : null;
}

interface DetectedBrand {
  canonical: string;
  raw: string;
  index: number;
}

function detectBrand(text: string): DetectedBrand | null {
  const compact = comparable(text);
  const exact = [...BRAND_NAMES].sort((a, b) => b.length - a.length).find(brand => compact.includes(comparable(brand)));
  if (exact) {
    const raw = comparable(exact);
    const canonical = exact === 'HEAD AND SHOULDERS' || exact === 'HEAD & SHOULDERS' ? 'H&S' : exact === 'ORAL B' ? 'ORAL-B' : exact;
    return { canonical, raw, index: compact.indexOf(raw) };
  }
  const thaiMatches = THAI_BRAND_ALIASES.flatMap(brand => brand.aliases.flatMap(alias => {
    const match = approximateSubstring(compact, alias, brand.maxDistance);
    return match ? [{ ...match, canonical: brand.canonical }] : [];
  })).sort((left, right) => left.distance - right.distance || right.length - left.length);
  if (thaiMatches.length) {
    const best = thaiMatches[0];
    const competing = thaiMatches.find(match => match.canonical !== best.canonical);
    if (!competing || competing.distance >= best.distance + 1) return { canonical: best.canonical, raw: best.raw, index: best.index };
  }
  const first = text.match(/^([A-Z][A-Z0-9&' -]{1,28})(?=\s|$)/)?.[1]?.trim();
  return first ? { canonical: first, raw: comparable(first), index: compact.indexOf(comparable(first)) } : null;
}

interface DetectedProductType {
  canonical: string;
  raw: string;
  index: number;
}

function detectProductTypes(text: string, brand: DetectedBrand | null, size: DetectedSize): DetectedProductType[] {
  const compact = comparable(text);
  const scopeStart = Math.max(0, brand?.index || 0);
  const scopeEnd = size.index > scopeStart ? size.index : compact.length;
  const approximateScope = compact.slice(scopeStart, scopeEnd);
  const found = new Map<string, DetectedProductType>();
  for (const type of PRODUCT_TYPES) {
    for (const pattern of type.patterns) {
      const match = text.match(pattern);
      if (match) {
        const raw = comparable(match[0]);
        found.set(type.canonical, { canonical: type.canonical, raw, index: compact.indexOf(raw) });
        break;
      }
    }
    if (!found.has(type.canonical)) {
      const approximate = type.aliases?.map(alias => approximateSubstring(approximateScope, alias.value, alias.maxDistance)).find(Boolean);
      if (approximate) found.set(type.canonical, { canonical: type.canonical, raw: approximate.raw, index: approximate.index + scopeStart });
    }
  }
  return [...found.values()];
}

interface DetectedSize {
  value: number | null;
  unit: string | null;
  raw: string | null;
  index: number;
  failureReason: string | null;
}

function normalizedSizeUnit(rawUnit: string): string | null {
  const compact = rawUnit.toUpperCase().replace(/[.\s]/g, '');
  return SIZE_UNIT[compact] || SIZE_UNIT[rawUnit] || null;
}

function detectSize(text: string): DetectedSize {
  const unitPattern = '(?:ML|มล\\.?|บล\\.?|L|LT|ลิตร|G|GM|กรัม|กรับ|KG|กก\\.?|CM|ซม\\.?|ด้าม|ใบ)';
  const sizeSource = text.replace(/\s+/g, '');
  const ambiguous = sizeSource.match(new RegExp(`(\\d+(?:[.,]\\d+)?)([-–+])(\\d+(?:[.,]\\d+)?)(${unitPattern})`, 'iu'));
  if (ambiguous && (ambiguous[2] === '+' || Number(ambiguous[1].replace(',', '.')) !== Number(ambiguous[3].replace(',', '.')))) {
    return { value: null, unit: normalizedSizeUnit(ambiguous[4]), raw: ambiguous[0], index: comparable(text).indexOf(comparable(ambiguous[0])), failureReason: ambiguous[2] === '+' ? 'multi_component_size' : 'size_range_ambiguous' };
  }
  const matches = [...sizeSource.matchAll(new RegExp(`(\\d+(?:[.,]\\d+)?)(${unitPattern})`, 'giu'))];
  if (!matches.length) return { value: null, unit: null, raw: null, index: -1, failureReason: null };
  const match = matches[0];
  const value = Number(match[1].replace(',', '.'));
  return {
    value: Number.isFinite(value) && value > 0 ? value : null,
    unit: normalizedSizeUnit(match[2]),
    raw: match[0],
    index: comparable(text).indexOf(comparable(match[0])),
    failureReason: null,
  };
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

function detectSalesUnit(text: string, productType: string | null): string {
  const found = SALES_UNITS.find(unit => new RegExp(unit, 'iu').test(text));
  if (found) return found === 'แพค' ? 'แพ็ค' : found;
  const defaults: Record<string, string> = {
    'แชมพู': 'ขวด', 'ครีมนวด': 'ขวด', 'น้ำยาซักผ้า': 'ขวด', 'ปรับผ้านุ่ม': 'ขวด',
    'สบู่': 'ก้อน', 'แปรงสีฟัน': 'ด้าม', 'มีดโกน': 'ชิ้น', 'ยาบาล์ม': 'กระปุก',
    'สกินแคร์': 'ชิ้น', 'ผลิตภัณฑ์ปรับอากาศ': 'ชิ้น',
  };
  return productType ? defaults[productType] || 'ชิ้น' : 'ชิ้น';
}

function isPlausibleSize(productType: string | null, size: DetectedSize): boolean {
  if (!size.value || !size.unit || !productType) return true;
  if ((productType === 'แชมพู' || productType === 'ครีมนวด') && size.unit === 'มล.') return size.value >= 10 && size.value <= 2000;
  if (productType === 'ปรับผ้านุ่ม' && size.unit === 'มล.') return size.value >= 10 && size.value <= 10000;
  if (productType === 'สกินแคร์') return size.value <= 1000;
  if (productType === 'สบู่' && size.unit === 'กรัม') return size.value <= 500;
  if (productType === 'ยาบาล์ม' && size.unit === 'กรัม') return size.value <= 100;
  return size.value <= 10000;
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

function removeApproximate(value: string, expected: string, maxDistance: number): string {
  const source = comparable(value);
  const match = approximateSubstring(source, expected, maxDistance);
  if (!match) return source;
  return `${source.slice(0, match.index)}${source.slice(match.index + match.length)}`;
}

function variantText(text: string, brand: DetectedBrand | null, productType: DetectedProductType | null, size: DetectedSize, packRaw: string | null): string | null {
  const compact = comparable(text);
  const start = brand?.index ?? 0;
  const end = size.raw && size.index >= start ? size.index + comparable(size.raw).length : compact.length;
  let value = compact.slice(start, end);
  for (const remove of [brand?.raw, productType?.raw, size.raw ? comparable(size.raw) : null, packRaw ? comparable(packRaw) : null].filter((item): item is string => Boolean(item))) {
    value = value.replace(remove, '');
  }
  value = removeApproximate(value, 'ทุกสูตร', 3);
  for (const ocrGeneric of ['กุกตู', 'กุกรูส', 'กุกสูต', 'กุกจ', 'ทุกฮูตร', 'ทุกสูร', 'ทุกสูดร']) {
    value = removeApproximate(value, ocrGeneric, 1);
  }
  value = removeApproximate(value, 'ขนาด', 3);
  for (const unit of SALES_UNITS) value = value.replace(comparable(unit), '');
  value = value.replace(/(?:ราคาขายปลีก|ราคาแนะนำขายปลีก|ปลีก)/giu, ' ');
  value = value.replace(/[^A-Zก-๙]+/giu, ' ').replace(/\s+/g, ' ').trim();
  return comparable(value).length >= 3 ? value : null;
}

export function createSkuCandidate(productEvidence: string): Sku {
  const displaySource = identityOnlyText(normalizeProductText(productEvidence));
  const source = displaySource;
  const brand = detectBrand(source);
  const size = detectSize(source);
  const detectedTypes = detectProductTypes(source, brand, size);
  let productType = detectedTypes[0] || null;
  if (brand?.canonical === 'VICKS' && size.unit === 'กรัม') productType = { canonical: 'ยาบาล์ม', raw: '', index: brand.index };
  if (brand?.canonical === 'AMBI PUR') productType = { canonical: 'ผลิตภัณฑ์ปรับอากาศ', raw: '', index: brand.index };
  if (brand?.canonical === 'OLAY') productType = { canonical: 'สกินแคร์', raw: '', index: brand.index };
  const pack = detectPack(source);
  const salesUnit = detectSalesUnit(source, productType?.canonical || null);
  const variant = variantText(source, brand, productType, size, pack.raw);
  const failureReasons = [
    ...(!brand ? ['brand_missing'] : []),
    ...(!productType ? ['product_type_missing'] : []),
    ...(detectedTypes.length > 1 ? ['multiple_product_types'] : []),
    ...(size.failureReason ? [size.failureReason] : []),
    ...(!size.value ? ['size_missing'] : []),
    ...(!size.unit ? ['size_unit_missing'] : []),
    ...(!isPlausibleSize(productType?.canonical || null, size) ? ['size_out_of_range'] : []),
  ];
  const identity: SkuIdentity = {
    brand: brand?.canonical || '',
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
    canonicalName: displaySource || 'สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ',
    identityKey,
    identity,
    status: failureReasons.length ? 'quarantine' : 'candidate',
    evidence: displaySource ? [displaySource] : [],
    failureReasons: [...new Set(failureReasons)],
  };
}

export function confirmSkuCandidate(sku: Sku): Sku {
  if (sku.failureReasons.length) throw new Error(`sku_evidence_incomplete:${sku.failureReasons.join(',')}`);
  return { ...sku, status: 'active' };
}

export function sameSku(left: Sku, right: Sku): boolean {
  return left.identityKey === right.identityKey;
}
