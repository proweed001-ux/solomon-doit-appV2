import type { ImportedCardCandidate } from '../import/pdf-importer';
import { buildSkuIdentityKey, createSkuCandidate, normalizeProductText } from './sku-identity';
import type { PromotionFamily, Sku, SkuIdentity } from './types';

const clean = (value: unknown): string => normalizeProductText(value).replace(/\s+/g, ' ').trim();
const compact = (value: unknown): string => clean(value).toUpperCase().replace(/[^A-Z0-9ก-๙&+]+/gu, '');

const BRANDS: Array<{ canonical: string; aliases: string[] }> = [
  { canonical: 'H&S', aliases: ['H&S', 'HEAD&SHOULDERS', 'HEADANDSHOULDERS', 'เฮดแอนด์โชว์เดอร์', 'เฮดแอนด์โชว์เตอร์', 'เฮดแอนด์โชวเดอร์'] },
  { canonical: 'PANTENE', aliases: ['PANTENE', 'PT', 'แพนทีน'] },
  { canonical: 'REJOICE', aliases: ['REJOICE', 'รีจอยส์', 'รีจ้อยส์', 'รีออยส์'] },
  { canonical: 'OLAY', aliases: ['OLAY', 'โอเลย์', 'โอเอย์'] },
  { canonical: 'ORAL-B', aliases: ['ORAL-B', 'ORALB', 'ออรัลบี', 'ออรัลบ'] },
  { canonical: 'GILLETTE', aliases: ['GILLETTE', 'กิลเลตต์', 'ยิลเลตต์', 'ยิลเลตส์'] },
  { canonical: 'DOWNY', aliases: ['DOWNY', 'ดาวน์นี่'] },
  { canonical: 'SAFEGUARD', aliases: ['SAFEGUARD', 'เซฟการ์ด'] },
  { canonical: 'VICKS', aliases: ['VICKS', 'วิคส์'] },
  { canonical: 'AMBI PUR', aliases: ['AMBI PUR', 'AMBIPUR', 'แอมบิเพอร์'] },
];

const TYPES: Array<{ canonical: string; aliases: RegExp[] }> = [
  { canonical: 'ทรีทเมนต์ซอง', aliases: [/ทรีทเมนต์/iu, /TREATMENT/iu] },
  { canonical: 'แชมพู', aliases: [/แชมพู/iu, /SHAMPOO/iu] },
  { canonical: 'ครีมนวด', aliases: [/ครีมนวด/iu, /CONDITIONER/iu] },
  { canonical: 'ปรับผ้านุ่ม', aliases: [/ปรับผ้านุ่ม/iu, /FABRIC\s*SOFTENER/iu] },
  { canonical: 'สบู่', aliases: [/สบู่/iu, /SOAP/iu] },
  { canonical: 'แปรงสีฟัน', aliases: [/แปรงสีฟัน/iu, /TOOTHBRUSH/iu] },
  { canonical: 'มีดโกน', aliases: [/มีดโกน|ใบมีด|ด้ามมีด|ซุปเปอร์ธิน|เวคเตอร์|บลูทู|บลูทรี|เฟลกซี่|ซุปเปอร์คลิ๊ก/iu, /RAZOR|BLADE|VECTOR|SUPER\s*THIN|SUPER\s*CLICK/iu] },
  { canonical: 'สกินแคร์', aliases: [/โอเลย์|โททัล|ไวท์เรเดียนซ์|โลชั่น|เซรั่ม|เดย์|ไนท์/iu, /TOTAL\s*(?:WHITE|EFFECTS)|WHITE\s*RADIANCE|SERUM|LOTION/iu] },
  { canonical: 'ยาบาล์ม', aliases: [/วิคส์|VICKS|VAPORUB/iu] },
  { canonical: 'ผลิตภัณฑ์ปรับอากาศ', aliases: [/แอมบิเพอร์|AMBI\s*PUR|FRESH\s*MINI/iu] },
];

const GENERIC_TYPE_PATTERNS = [
  /แชมพู|SHAMPOO/iu, /ครีมนวด|CONDITIONER/iu, /ทรีทเมนต์|TREATMENT/iu,
  /ปรับผ้านุ่ม|FABRIC\s*SOFTENER/iu, /สบู่(?:ก้อน)?|SOAP/iu,
  /แปรงสีฟัน|TOOTHBRUSH/iu, /มีดโกน|ใบมีด|ด้ามมีด|RAZOR|BLADE/iu,
  /สกินแคร์|ยาบาล์ม|ผลิตภัณฑ์ปรับอากาศ/iu,
];

const TYPE_DEFAULTS: Record<string, string> = {
  'H&S': 'แชมพู', PANTENE: 'แชมพู', REJOICE: 'แชมพู', OLAY: 'สกินแคร์',
  'ORAL-B': 'แปรงสีฟัน', GILLETTE: 'มีดโกน', DOWNY: 'ปรับผ้านุ่ม',
  SAFEGUARD: 'สบู่', VICKS: 'ยาบาล์ม', 'AMBI PUR': 'ผลิตภัณฑ์ปรับอากาศ',
};

const UNIT_MAP: Record<string, string> = {
  ML: 'มล.', VA: 'มล.', 'มล': 'มล.', 'มล.': 'มล.', 'บล': 'มล.', 'บล.': 'มล.',
  L: 'ลิตร', LT: 'ลิตร', 'ลิตร': 'ลิตร',
  G: 'กรัม', GM: 'กรัม', NSU: 'กรัม', 'กรัม': 'กรัม', 'กรับ': 'กรัม',
  KG: 'กก.', 'กก': 'กก.', 'กก.': 'กก.',
};

const SALES_UNITS: Record<string, string> = {
  'แชมพู': 'ขวด', 'ครีมนวด': 'ขวด', 'แชมพู/ครีมนวด': 'ขวด', 'ทรีทเมนต์ซอง': 'ซอง', 'ปรับผ้านุ่ม': 'ถุง',
  'สบู่': 'ก้อน', 'แปรงสีฟัน': 'ด้าม', 'มีดโกน': 'ชิ้น', 'สกินแคร์': 'ชิ้น',
  'ยาบาล์ม': 'กระปุก', 'ผลิตภัณฑ์ปรับอากาศ': 'ชิ้น',
  'แพ็ค แชมพู+แชมพู': 'แพ็ค', 'แพ็ค แชมพู+ครีมนวด': 'แพ็ค',
};

const GENERIC_TOKENS = new Set([
  'ทุกสูตร', 'สินค้า', 'โปรโมชั่น', 'เฉพาะช่องทาง', 'ขั้นต่ำ', 'ลด', 'เมื่อซื้อ', 'ราคาแนะนำขายปลีก',
  'ขนาด', 'ยกเว้น', 'แพ็ค', 'แพค', 'ขวด', 'ชิ้น', 'ซอง', 'ถุง', 'ถุงเติม', 'กล่อง', 'ก้อน', 'ด้าม',
  'รุ่น', 'รุ่นแผง', 'แผง', 'สูตร', 'แถม',
]);

function stableHash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).toUpperCase().padStart(7, '0');
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

function fuzzyContains(sourceValue: string, targetValue: string): boolean {
  const source = compact(sourceValue);
  const target = compact(targetValue);
  if (!source || !target) return false;
  if (source.includes(target)) return true;
  const allowance = Math.max(1, Math.min(5, Math.floor(target.length * 0.28)));
  const minimum = Math.max(1, target.length - allowance);
  const maximum = Math.min(source.length, target.length + allowance);
  for (let length = minimum; length <= maximum; length += 1) {
    for (let index = 0; index + length <= source.length; index += 1) {
      if (editDistance(source.slice(index, index + length), target) <= allowance) return true;
    }
  }
  return false;
}

function detectBrand(text: string): string | null {
  const source = compact(text);
  const exact = BRANDS.flatMap(brand => brand.aliases.map(alias => ({ canonical: brand.canonical, alias: compact(alias) })))
    .filter(item => item.alias && source.includes(item.alias))
    .sort((left, right) => right.alias.length - left.alias.length)[0];
  if (exact) return exact.canonical;
  const fuzzy = BRANDS.flatMap(brand => brand.aliases.map(alias => ({ canonical: brand.canonical, alias })))
    .filter(item => compact(item.alias).length >= 5 && fuzzyContains(text, item.alias));
  return new Set(fuzzy.map(item => item.canonical)).size === 1 ? fuzzy[0]?.canonical || null : null;
}

function normalizedUnit(value: string): string {
  const key = value.toUpperCase().replace(/[.\s]/g, '');
  return UNIT_MAP[key] || UNIT_MAP[value] || value;
}

interface SizeEvidence {
  minimum: number | null;
  maximum: number | null;
  unit: string | null;
}

function detectSize(text: string): SizeEvidence {
  const source = clean(text).replace(/\s+/g, '');
  const unit = '(ML|VA|มล\.?|บล\.?|L|LT|ลิตร|G|GM|NSU|กรัม|กรับ|KG|กก\.?)';
  const range = source.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*[-–+]\\s*(\\d+(?:[.,]\\d+)?)\\s*' + unit, 'iu'));
  if (range) return { minimum: Number(range[1].replace(',', '.')), maximum: Number(range[2].replace(',', '.')), unit: normalizedUnit(range[3]) };
  const exact = source.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*' + unit, 'iu'));
  if (exact) {
    const value = Number(exact[1].replace(',', '.'));
    return { minimum: value, maximum: value, unit: normalizedUnit(exact[2]) };
  }
  return { minimum: null, maximum: null, unit: null };
}

function detectTypes(text: string, brand: string, size: SizeEvidence): string[] {
  const isPack = /แพ็ค|แพค|PACK/iu.test(text);
  const hasShampoo = /แชมพู|SHAMPOO/iu.test(text);
  const hasConditioner = /ครีมนวด|CONDITIONER/iu.test(text);
  if (isPack && hasShampoo && hasConditioner) return ['แพ็ค แชมพู+ครีมนวด'];
  if (isPack && hasShampoo && /\+/u.test(text)) return ['แพ็ค แชมพู+แชมพู'];
  if (hasShampoo && hasConditioner) {
    const exactLarge = size.minimum != null && size.minimum === size.maximum && size.minimum >= 300;
    return exactLarge ? ['แชมพู/ครีมนวด'] : ['แชมพู', 'ครีมนวด'];
  }
  const found = TYPES.filter(type => type.aliases.some(pattern => pattern.test(text))).map(type => type.canonical);
  return found.length ? [...new Set(found)] : [TYPE_DEFAULTS[brand] || 'สินค้า'];
}

function sourceSegments(scopeText: string): string[] {
  const prepared = clean(scopeText)
    .replace(/แชมพู\s*\/\s*ครีมนวด/giu, 'แชมพูและครีมนวด')
    .replace(/SHAMPOO\s*\/\s*CONDITIONER/giu, 'SHAMPOO AND CONDITIONER');
  return prepared.split(/\s*\/\s*(?=(?:H&S|HEAD|PT\b|PANTENE|REJOICE|OLAY|ORAL|GILLETTE|DOWNY|SAFEGUARD|VICKS|AMBI|เฮด|แพนทีน|รีจ|โอเลย์|ออรัล|ยิลเลตต์|กิลเลตต์|ดาวน์นี่|เซฟการ์ด|วิคส์|แอมบิ))/iu).map(clean).filter(Boolean);
}

function specialQualifiers(value: string): string[] {
  const text = clean(value);
  const output: string[] = [];
  if (/แพ็ค\s*2\s*แถม\s*1|PACK\s*2\s*(?:FREE|PLUS)\s*1/iu.test(text)) output.push('Q_PACK_2_PLUS_1');
  if (/แพ็ค\s*1\s*แถม\s*1|PACK\s*1\s*(?:FREE|PLUS)\s*1/iu.test(text)) output.push('Q_PACK_1_PLUS_1');
  if (/ถุงเติมขนาดใหญ่|LARGE\s*REFILL/iu.test(text)) output.push('Q_LARGE_REFILL');
  if (/ซุปเปอร์ธิน\s*ทู|SUPER\s*THIN\s*(?:2|TWO)/iu.test(text)) output.push('Q_SUPERTHIN_TWO');
  if (/ด้ามมีด|RAZOR\s*HANDLE/iu.test(text)) output.push('Q_HANDLE');
  if (/ใบมีด|BLADE/iu.test(text)) output.push('Q_BLADE');
  return output;
}

function usefulTokens(value: string): string[] {
  const positiveScope = clean(value).split(/\bEXCEPT\b|ยกเว้น/iu)[0].trim();
  const withoutNumbers = positiveScope.replace(/\d+(?:[.,]\d+)?\s*(?:ML|VA|มล\.?|บล\.?|L|LT|ลิตร|G|GM|NSU|กรัม|กรับ|KG|กก\.?)?/giu, ' ');
  const regular = withoutNumbers.split(/[^A-Z0-9ก-๙&+]+/giu)
    .map(token => token.trim())
    .filter(token => token.length >= 3
      && !GENERIC_TOKENS.has(token)
      && !BRANDS.some(brand => brand.aliases.some(alias => compact(alias) === compact(token)))
      && !GENERIC_TYPE_PATTERNS.some(pattern => pattern.test(token)));
  return [...new Set([...regular, ...specialQualifiers(positiveScope)])];
}

export interface ProductScopeCandidate {
  key: string;
  familyId: string;
  familyKey: string;
  name: string;
  rawText: string;
  brand: string;
  productType: string;
  minimumSize: number | null;
  maximumSize: number | null;
  sizeUnit: string | null;
  salesUnit: string;
  packQuantity: number;
  variant: string | null;
  variantTokens: string[];
  classIds: string[];
}

export interface ScopeResolution {
  scope: ProductScopeCandidate | null;
  score: number;
  margin: number;
  method: 'structured_scope' | 'visual_consensus' | 'unmatched';
}

export function buildProductScopes(families: PromotionFamily[]): ProductScopeCandidate[] {
  const scopes: ProductScopeCandidate[] = [];
  for (const family of families) {
    for (const segment of sourceSegments(family.scopeText || family.name)) {
      const brand = detectBrand(segment);
      if (!brand) continue;
      const size = detectSize(segment);
      for (const productType of detectTypes(segment, brand, size)) {
        const variantTokens = usefulTokens(segment);
        const variant = variantTokens.length ? variantTokens.filter(token => !token.startsWith('Q_')).join(' ') || null : null;
        const sizeKey = size.minimum == null ? 'NA' : `${size.minimum}-${size.maximum}-${size.unit}`;
        const key = `${family.familyKey}|${brand}|${productType}|${sizeKey}|${variantTokens.join('+') || 'ALL'}`;
        const sizeLabel = size.minimum == null ? '' : size.minimum === size.maximum
          ? `${size.minimum} ${size.unit}`
          : `${size.minimum}-${size.maximum} ${size.unit}`;
        scopes.push({
          key,
          familyId: family.id,
          familyKey: family.familyKey,
          name: [brand, productType, variant, sizeLabel].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
          rawText: segment,
          brand,
          productType,
          minimumSize: size.minimum,
          maximumSize: size.maximum,
          sizeUnit: size.unit,
          salesUnit: SALES_UNITS[productType] || 'ชิ้น',
          packQuantity: 1,
          variant,
          variantTokens,
          classIds: Object.keys(family.tiersByClass),
        });
      }
    }
  }
  return [...new Map(scopes.map(scope => [scope.key, scope])).values()];
}

function bestObservedCandidate(source: ImportedCardCandidate): Sku {
  const candidates = [createSkuCandidate(source.productText), createSkuCandidate(`${source.productText} ${source.rawText}`)]
    .sort((left, right) => left.failureReasons.length - right.failureReasons.length
      || Number(Boolean(right.identity.brand)) - Number(Boolean(left.identity.brand))
      || Number(Boolean(right.identity.sizeValue)) - Number(Boolean(left.identity.sizeValue)));
  return candidates[0];
}

type SizeMatch = 'exact' | 'near' | 'unknown' | 'conflict';

function sizeMatch(sku: Sku, scope: ProductScopeCandidate, fallback: SizeEvidence | null = null): SizeMatch {
  if (scope.minimumSize == null || scope.maximumSize == null || !scope.sizeUnit) return 'unknown';
  const value = sku.identity.sizeValue || fallback?.minimum || 0;
  const maximum = sku.identity.sizeValue || fallback?.maximum || 0;
  const unit = sku.identity.sizeUnit || fallback?.unit || '';
  if (!(value > 0) || !unit) return 'unknown';
  if (unit !== scope.sizeUnit) return 'conflict';
  if (value >= scope.minimumSize && maximum <= scope.maximumSize) return 'exact';
  if (scope.minimumSize === scope.maximumSize && value === maximum) {
    const difference = Math.abs(value - scope.minimumSize);
    const relative = difference / Math.max(value, scope.minimumSize);
    if (difference <= 5 && relative <= 0.05) return 'near';
  }
  return 'conflict';
}

function typeCompatible(sku: Sku, scope: ProductScopeCandidate, rawText: string): boolean | null {
  if (scope.productType === 'แชมพู/ครีมนวด') {
    if (/แชมพู|SHAMPOO/iu.test(rawText) && /ครีมนวด|CONDITIONER/iu.test(rawText)) return true;
    if (sku.identity.productType === 'แชมพู' || sku.identity.productType === 'ครีมนวด') return null;
  }
  if (!sku.identity.productType) return null;
  if (sku.identity.productType === scope.productType) return true;
  if (scope.productType.startsWith('แพ็ค ') && /แพ็ค|แพค|PACK/iu.test(rawText)) return true;
  return false;
}

function qualifierMatches(evidence: string, token: string): boolean {
  if (token === 'Q_PACK_2_PLUS_1') return /แพ็ค\s*2\s*แถม\s*1|PACK\s*2\s*(?:FREE|PLUS)\s*1/iu.test(evidence);
  if (token === 'Q_PACK_1_PLUS_1') return /แพ็ค\s*1\s*แถม\s*1|PACK\s*1\s*(?:FREE|PLUS)\s*1/iu.test(evidence);
  if (token === 'Q_LARGE_REFILL') return /ถุงเติมขนาดใหญ่|LARGE\s*REFILL/iu.test(evidence);
  if (token === 'Q_SUPERTHIN_TWO') return fuzzyContains(evidence, 'ซุปเปอร์ธิน ทู') || /SUPER\s*THIN\s*(?:2|TWO)/iu.test(evidence);
  if (token === 'Q_HANDLE') return fuzzyContains(evidence, 'ด้ามมีด') || /RAZOR\s*HANDLE/iu.test(evidence);
  if (token === 'Q_BLADE') return fuzzyContains(evidence, 'ใบมีด') || /BLADE/iu.test(evidence);
  return fuzzyContains(evidence, token);
}

function tokenOverlap(text: string, scope: ProductScopeCandidate): number {
  if (!scope.variantTokens.length) return 0;
  const positiveEvidence = clean(text).split(/\bEXCEPT\b|ยกเว้น/iu)[0].trim();
  return scope.variantTokens.filter(token => qualifierMatches(positiveEvidence, token)).length / scope.variantTokens.length;
}

function contradictsVariant(evidence: string, scope: ProductScopeCandidate): boolean {
  const source = compact(evidence);
  const target = compact(scope.rawText);
  const sourceNoCap = source.includes(compact('ไม่มีฝา'));
  const sourceWithCap = source.includes(compact('มีฝา')) && !sourceNoCap;
  const targetNoCap = target.includes(compact('ไม่มีฝา'));
  const targetWithCap = target.includes(compact('มีฝา')) && !targetNoCap;
  return (sourceNoCap && targetWithCap) || (sourceWithCap && targetNoCap);
}

function extractRetailPrice(value: string): number | null {
  const text = clean(value);
  const patterns = [
    /ราคา(?:แนะนำ)?ขายปลีก[^0-9]{0,24}(\d+(?:[.,]\d+)?)\s*บาท/iu,
    /(\d+(?:[.,]\d+)?)\s*บาท\s*\/\s*(?:ขวด|ชิ้น|ด้าม|ถุง|ซอง|กล่อง|แพ็ค|ก้อน|กระปุก)/iu,
    /RETAIL[^0-9]{0,24}(\d+(?:[.,]\d+)?)/iu,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const amount = Number(match?.[1]?.replace(',', '.'));
    if (Number.isFinite(amount) && amount > 0 && amount < 5000) return amount;
  }
  return null;
}

function scoreScope(source: ImportedCardCandidate, scope: ProductScopeCandidate): number | null {
  if (!source.classId || !scope.classIds.includes(source.classId)) return null;
  const evidence = `${source.productText} ${source.rawText}`;
  if (contradictsVariant(evidence, scope)) return null;
  const sku = bestObservedCandidate(source);
  const evidenceSize = detectSize(evidence);
  let score = 5;
  if (sku.identity.brand) {
    if (sku.identity.brand !== scope.brand) return null;
    score += 35;
  } else if (detectBrand(evidence) === scope.brand) score += 28;
  else return null;

  const type = typeCompatible(sku, scope, evidence);
  if (type === false) return null;
  const evidenceTypes = detectTypes(evidence, scope.brand, evidenceSize);
  score += type === true ? 25 : evidenceTypes.includes(scope.productType) ? 20 : 4;

  const size = sizeMatch(sku, scope, evidenceSize);
  if (size === 'conflict') return null;
  if (scope.minimumSize != null && size === 'unknown') return null;
  score += size === 'exact' ? 25 : size === 'near' ? 16 : 8;

  const overlap = tokenOverlap(evidence, scope);
  if (scope.variantTokens.length && overlap === 0) return null;
  if (overlap > 0) score += 15 + Math.round(overlap * 10);
  return score;
}

export function resolveStructuredScope(source: ImportedCardCandidate, scopes: ProductScopeCandidate[]): ScopeResolution {
  const ranked = scopes.flatMap(scope => {
    const score = scoreScope(source, scope);
    return score == null ? [] : [{ scope, score }];
  }).sort((left, right) => right.score - left.score || left.scope.name.localeCompare(right.scope.name, 'th'));
  const best = ranked[0];
  const second = ranked[1];
  const margin = best ? best.score - (second?.score || 0) : 0;
  if (!best || best.score < 62 || (second && margin < 10)) return { scope: null, score: best?.score || 0, margin, method: 'unmatched' };
  return { scope: best.scope, score: best.score, margin, method: 'structured_scope' };
}

function signatureVector(signature: string | undefined): number[] {
  if (!signature || signature.length % 2) return [];
  const values: number[] = [];
  for (let index = 0; index < signature.length; index += 2) values.push(parseInt(signature.slice(index, index + 2), 16));
  return values.some(value => Number.isFinite(value)) ? values : [];
}

export function visualSimilarity(left: string | undefined, right: string | undefined): number {
  const a = signatureVector(left);
  const b = signatureVector(right);
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0; let aa = 0; let bb = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index]; aa += a[index] * a[index]; bb += b[index] * b[index];
  }
  return dot / Math.max(1, Math.sqrt(aa * bb));
}

export function resolveScopesWithVisualConsensus(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
  visualSignatures: Record<string, string> = {},
): Map<string, ScopeResolution> {
  const scopes = buildProductScopes(families);
  const resolutions = new Map(cards.map(card => [card.cardId, resolveStructuredScope(card, scopes)]));
  const resolvedCards = cards.filter(card => resolutions.get(card.cardId)?.scope);
  const classesByScope = new Map<string, Set<string>>();
  for (const card of resolvedCards) {
    const scope = resolutions.get(card.cardId)?.scope;
    if (!scope || !card.classId) continue;
    const classes = classesByScope.get(scope.key) || new Set<string>();
    classes.add(card.classId); classesByScope.set(scope.key, classes);
  }

  for (const card of cards) {
    if (resolutions.get(card.cardId)?.scope || !card.classId) continue;
    const evidence = `${card.productText} ${card.rawText}`;
    const observed = bestObservedCandidate(card);
    const observedSize = detectSize(evidence);
    const observedBrand = observed.identity.brand || detectBrand(evidence);
    const observedPrice = extractRetailPrice(evidence);
    const byScope = new Map<string, { scope: ProductScopeCandidate; similarity: number; anchored: boolean }>();
    for (const reference of resolvedCards) {
      if (reference.classId === card.classId) continue;
      const scope = resolutions.get(reference.cardId)?.scope;
      if (!scope || classesByScope.get(scope.key)?.has(card.classId)) continue;
      if (contradictsVariant(evidence, scope)) continue;
      if (observedBrand && observedBrand !== scope.brand) continue;
      const type = typeCompatible(observed, scope, evidence);
      if (type === false) continue;
      if (sizeMatch(observed, scope, observedSize) === 'conflict') continue;
      const referencePrice = extractRetailPrice(`${reference.productText} ${reference.rawText}`);
      if (observedPrice != null && referencePrice != null && Math.abs(observedPrice - referencePrice) > 0.05) continue;
      const variantEvidence = tokenOverlap(evidence, scope);
      const priceAnchor = observedPrice != null && referencePrice != null && Math.abs(observedPrice - referencePrice) <= 0.05;
      const anchored = Boolean(observedBrand || priceAnchor || sizeMatch(observed, scope, observedSize) === 'exact' || variantEvidence > 0);
      if (!anchored) continue;
      const similarity = visualSimilarity(visualSignatures[card.cardId], visualSignatures[reference.cardId]);
      const required = observedBrand && (!scope.variantTokens.length || variantEvidence > 0) ? 0.90
        : priceAnchor && (!scope.variantTokens.length || variantEvidence > 0) ? 0.94
          : 0.97;
      if (similarity < required) continue;
      const current = byScope.get(scope.key);
      if (!current || similarity > current.similarity) byScope.set(scope.key, { scope, similarity, anchored });
    }
    const ranked = [...byScope.values()].sort((left, right) => right.similarity - left.similarity);
    const best = ranked[0];
    const second = ranked[1];
    const margin = best ? best.similarity - (second?.similarity || 0) : 0;
    if (best && (!second || margin >= 0.035)) {
      resolutions.set(card.cardId, { scope: best.scope, score: Number((best.similarity * 100).toFixed(1)), margin: Number((margin * 100).toFixed(1)), method: 'visual_consensus' });
      const classes = classesByScope.get(best.scope.key) || new Set<string>();
      classes.add(card.classId); classesByScope.set(best.scope.key, classes);
      resolvedCards.push(card);
    }
  }
  return resolutions;
}

export function skuFromScope(scope: ProductScopeCandidate, observed: Sku, existingSkus: Sku[]): Sku {
  const observedSize = observed.identity.sizeValue > 0 ? observed.identity.sizeValue : 0;
  const exactSize = observedSize > 0 && observed.identity.sizeUnit === scope.sizeUnit
    && (scope.minimumSize == null || (observedSize >= scope.minimumSize && observedSize <= (scope.maximumSize || scope.minimumSize)));
  const nearSize = observedSize > 0 && observed.identity.sizeUnit === scope.sizeUnit && scope.minimumSize === scope.maximumSize
    && Math.abs(observedSize - Number(scope.minimumSize)) <= 5
    && Math.abs(observedSize - Number(scope.minimumSize)) / Math.max(observedSize, Number(scope.minimumSize)) <= 0.05;
  const identity: SkuIdentity = {
    brand: scope.brand,
    productType: scope.productType,
    variant: scope.variant,
    sizeValue: exactSize || nearSize ? observedSize : scope.minimumSize || 0,
    sizeUnit: scope.sizeUnit || observed.identity.sizeUnit || '',
    salesUnit: scope.salesUnit,
    packQuantity: Math.max(1, observed.identity.packQuantity || scope.packQuantity || 1),
  };
  const identityKey = buildSkuIdentityKey(identity);
  const existing = existingSkus.find(sku => sku.identityKey === identityKey);
  if (existing) return existing;
  const requiresRangeReview = scope.minimumSize != null && scope.maximumSize != null && scope.minimumSize !== scope.maximumSize;
  const requiresCompositeReview = scope.productType.includes('/') || scope.productType.startsWith('แพ็ค ');
  const sizeConflict = nearSize && !exactSize;
  const failureReasons = [
    ...(requiresRangeReview ? ['scope_size_range_requires_master_confirmation'] : []),
    ...(requiresCompositeReview ? ['scope_composite_requires_master_confirmation'] : []),
    ...(sizeConflict ? ['scope_size_source_conflict'] : []),
  ];
  const hash = stableHash(scope.key);
  return {
    id: `sku:${hash}`,
    code: `SKU-${hash}`,
    canonicalName: scope.name,
    identityKey,
    identity,
    status: failureReasons.length ? 'quarantine' : 'candidate',
    evidence: [...new Set([scope.rawText, ...observed.evidence].filter(Boolean))],
    failureReasons,
  };
}
