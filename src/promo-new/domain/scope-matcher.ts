import type { ImportedCardCandidate } from '../import/pdf-importer';
import { buildSkuIdentityKey, createSkuCandidate, normalizeProductText } from './sku-identity';
import type { PromotionFamily, Sku, SkuIdentity } from './types';

const clean = (value: unknown): string => normalizeProductText(value).replace(/\s+/g, ' ').trim();
const compact = (value: unknown): string => clean(value).toUpperCase().replace(/[^A-Z0-9ก-๙&+]+/gu, '');

const BRANDS: Array<{ canonical: string; aliases: string[] }> = [
  { canonical: 'H&S', aliases: ['H&S', 'HEAD&SHOULDERS', 'HEADANDSHOULDERS', 'เฮดแอนด์โชว์เดอร์', 'เฮดแอนด์โชว์เตอร์'] },
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

const TYPE_DEFAULTS: Record<string, string> = {
  'H&S': 'แชมพู', PANTENE: 'แชมพู', REJOICE: 'แชมพู', OLAY: 'สกินแคร์',
  'ORAL-B': 'แปรงสีฟัน', GILLETTE: 'มีดโกน', DOWNY: 'ปรับผ้านุ่ม',
  SAFEGUARD: 'สบู่', VICKS: 'ยาบาล์ม', 'AMBI PUR': 'ผลิตภัณฑ์ปรับอากาศ',
};

const UNIT_MAP: Record<string, string> = {
  ML: 'มล.', 'มล': 'มล.', 'มล.': 'มล.', L: 'ลิตร', LT: 'ลิตร', 'ลิตร': 'ลิตร',
  G: 'กรัม', GM: 'กรัม', 'กรัม': 'กรัม', KG: 'กก.', 'กก': 'กก.', 'กก.': 'กก.',
};

const SALES_UNITS: Record<string, string> = {
  'แชมพู': 'ขวด', 'ครีมนวด': 'ขวด', 'ทรีทเมนต์ซอง': 'ซอง', 'ปรับผ้านุ่ม': 'ถุง',
  'สบู่': 'ก้อน', 'แปรงสีฟัน': 'ด้าม', 'มีดโกน': 'ชิ้น', 'สกินแคร์': 'ชิ้น',
  'ยาบาล์ม': 'กระปุก', 'ผลิตภัณฑ์ปรับอากาศ': 'ชิ้น',
  'แพ็ค แชมพู+แชมพู': 'แพ็ค', 'แพ็ค แชมพู+ครีมนวด': 'แพ็ค',
};

const GENERIC_TOKENS = new Set([
  'ทุกสูตร', 'สินค้า', 'โปรโมชั่น', 'เฉพาะช่องทาง', 'ขั้นต่ำ', 'ลด', 'เมื่อซื้อ', 'ราคาแนะนำขายปลีก',
  'ขนาด', 'ยกเว้น', 'แพ็ค', 'แพค', 'ขวด', 'ชิ้น', 'ซอง', 'ถุง', 'กล่อง', 'ก้อน', 'ด้าม',
]);

function stableHash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).toUpperCase().padStart(7, '0');
}

function detectBrand(text: string): string | null {
  const source = compact(text);
  const matched = BRANDS.flatMap(brand => brand.aliases.map(alias => ({ canonical: brand.canonical, alias: compact(alias) })))
    .filter(item => item.alias && source.includes(item.alias))
    .sort((left, right) => right.alias.length - left.alias.length)[0];
  return matched?.canonical || null;
}

function detectTypes(text: string, brand: string): string[] {
  if (/แพ็ค|แพค|PACK/iu.test(text) && /แชมพู/iu.test(text) && /ครีมนวด/iu.test(text)) return ['แพ็ค แชมพู+ครีมนวด'];
  if (/แพ็ค|แพค|PACK/iu.test(text) && /แชมพู/iu.test(text) && /\+/u.test(text)) return ['แพ็ค แชมพู+แชมพู'];
  const found = TYPES.filter(type => type.aliases.some(pattern => pattern.test(text))).map(type => type.canonical);
  if (found.includes('แชมพู') && found.includes('ครีมนวด')) return ['แชมพู', 'ครีมนวด'];
  return found.length ? [...new Set(found)] : [TYPE_DEFAULTS[brand] || 'สินค้า'];
}

function normalizedUnit(value: string): string {
  const key = value.toUpperCase().replace(/[.\s]/g, '');
  return UNIT_MAP[key] || UNIT_MAP[value] || value;
}

function detectSize(text: string): { minimum: number | null; maximum: number | null; unit: string | null } {
  const source = clean(text).replace(/\s+/g, '');
  const unit = '(ML|มล\.?|L|LT|ลิตร|G|GM|กรัม|KG|กก\.?)';
  const range = source.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*[-–+]\\s*(\\d+(?:[.,]\\d+)?)\\s*' + unit, 'iu'));
  if (range) return { minimum: Number(range[1].replace(',', '.')), maximum: Number(range[2].replace(',', '.')), unit: normalizedUnit(range[3]) };
  const exact = source.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*' + unit, 'iu'));
  if (exact) {
    const value = Number(exact[1].replace(',', '.'));
    return { minimum: value, maximum: value, unit: normalizedUnit(exact[2]) };
  }
  return { minimum: null, maximum: null, unit: null };
}

function sourceSegments(scopeText: string): string[] {
  const prepared = clean(scopeText)
    .replace(/แชมพู\s*\/\s*ครีมนวด/giu, 'แชมพูและครีมนวด')
    .replace(/SHAMPOO\s*\/\s*CONDITIONER/giu, 'SHAMPOO AND CONDITIONER');
  return prepared.split(/\s*\/\s*(?=(?:H&S|HEAD|PT\b|PANTENE|REJOICE|OLAY|ORAL|GILLETTE|DOWNY|SAFEGUARD|VICKS|AMBI|เฮด|แพนทีน|รีจ|โอเลย์|ออรัล|ยิลเลตต์|กิลเลตต์|ดาวน์นี่|เซฟการ์ด|วิคส์|แอมบิ))/iu).map(clean).filter(Boolean);
}

function usefulTokens(value: string): string[] {
  const withoutNumbers = clean(value).replace(/\d+(?:[.,]\d+)?\s*(?:ML|มล\.?|L|LT|ลิตร|G|GM|กรัม|KG|กก\.?)?/giu, ' ');
  return withoutNumbers.split(/[^A-Z0-9ก-๙&+]+/giu)
    .map(token => token.trim())
    .filter(token => token.length >= 3 && !GENERIC_TOKENS.has(token) && !BRANDS.some(brand => brand.aliases.some(alias => compact(alias) === compact(token))) && !TYPES.some(type => type.aliases.some(pattern => pattern.test(token))));
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
      for (const productType of detectTypes(segment, brand)) {
        const variantTokens = usefulTokens(segment);
        const variant = variantTokens.length ? variantTokens.join(' ') : null;
        const sizeKey = size.minimum == null ? 'NA' : `${size.minimum}-${size.maximum}-${size.unit}`;
        const key = `${family.familyKey}|${brand}|${productType}|${sizeKey}|${variant || 'ALL'}`;
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
          packQuantity: /แพ็ค|แพค|PACK/iu.test(segment) ? 1 : 1,
          variant,
          variantTokens,
          classIds: Object.keys(family.tiersByClass),
        });
      }
    }
  }
  return [...new Map(scopes.map(scope => [scope.key, scope])).values()];
}

function sizeCompatible(sku: Sku, scope: ProductScopeCandidate): boolean | null {
  if (!scope.minimumSize || !scope.maximumSize || !scope.sizeUnit) return null;
  if (!sku.identity.sizeValue || !sku.identity.sizeUnit) return null;
  if (sku.identity.sizeUnit !== scope.sizeUnit) return false;
  return sku.identity.sizeValue >= scope.minimumSize && sku.identity.sizeValue <= scope.maximumSize;
}

function typeCompatible(sku: Sku, scope: ProductScopeCandidate, rawText: string): boolean | null {
  if (!sku.identity.productType) return null;
  if (sku.identity.productType === scope.productType) return true;
  if (scope.productType.startsWith('แพ็ค ') && /แพ็ค|แพค|PACK/iu.test(rawText)) return true;
  return false;
}

function tokenOverlap(text: string, scope: ProductScopeCandidate): number {
  if (!scope.variantTokens.length) return 1;
  const source = compact(text);
  return scope.variantTokens.filter(token => source.includes(compact(token))).length / scope.variantTokens.length;
}

function scoreScope(source: ImportedCardCandidate, scope: ProductScopeCandidate): number | null {
  if (!source.classId || !scope.classIds.includes(source.classId)) return null;
  const evidence = `${source.productText} ${source.rawText}`;
  const sku = createSkuCandidate(source.productText || source.rawText);
  let score = 5;
  if (sku.identity.brand) {
    if (sku.identity.brand !== scope.brand) return null;
    score += 35;
  } else if (detectBrand(evidence) === scope.brand) score += 28;
  else score += 5;

  const type = typeCompatible(sku, scope, evidence);
  if (type === false) return null;
  score += type === true ? 25 : detectTypes(evidence, scope.brand).includes(scope.productType) ? 20 : 4;

  const size = sizeCompatible(sku, scope);
  if (size === false) return null;
  score += size === true ? 25 : scope.minimumSize == null ? 8 : 3;

  const overlap = tokenOverlap(evidence, scope);
  score += Math.round(overlap * 25);
  if (scope.variantTokens.length && overlap === 0 && score < 75) return null;
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
    const observed = createSkuCandidate(card.productText || card.rawText);
    const byScope = new Map<string, { scope: ProductScopeCandidate; similarity: number }>();
    for (const reference of resolvedCards) {
      if (reference.classId === card.classId) continue;
      const scope = resolutions.get(reference.cardId)?.scope;
      if (!scope || classesByScope.get(scope.key)?.has(card.classId)) continue;
      if (observed.identity.brand && observed.identity.brand !== scope.brand) continue;
      if (observed.identity.productType && typeCompatible(observed, scope, card.productText) === false) continue;
      if (sizeCompatible(observed, scope) === false) continue;
      const similarity = visualSimilarity(visualSignatures[card.cardId], visualSignatures[reference.cardId]);
      const current = byScope.get(scope.key);
      if (!current || similarity > current.similarity) byScope.set(scope.key, { scope, similarity });
    }
    const ranked = [...byScope.values()].sort((left, right) => right.similarity - left.similarity);
    const best = ranked[0];
    const second = ranked[1];
    const margin = best ? best.similarity - (second?.similarity || 0) : 0;
    if (best && best.similarity >= 0.90 && (!second || margin >= 0.025)) {
      resolutions.set(card.cardId, { scope: best.scope, score: Number((best.similarity * 100).toFixed(1)), margin: Number((margin * 100).toFixed(1)), method: 'visual_consensus' });
      const classes = classesByScope.get(best.scope.key) || new Set<string>();
      classes.add(card.classId); classesByScope.set(best.scope.key, classes);
      resolvedCards.push(card);
    }
  }
  return resolutions;
}

export function skuFromScope(scope: ProductScopeCandidate, observed: Sku, existingSkus: Sku[]): Sku {
  const observedSizeCompatible = observed.identity.sizeValue > 0 && observed.identity.sizeUnit === scope.sizeUnit
    && (scope.minimumSize == null || (observed.identity.sizeValue >= scope.minimumSize && observed.identity.sizeValue <= (scope.maximumSize || scope.minimumSize)));
  const identity: SkuIdentity = {
    brand: scope.brand,
    productType: scope.productType,
    variant: scope.variant,
    sizeValue: observedSizeCompatible ? observed.identity.sizeValue : scope.minimumSize || 0,
    sizeUnit: scope.sizeUnit || observed.identity.sizeUnit || '',
    salesUnit: scope.salesUnit,
    packQuantity: Math.max(1, observed.identity.packQuantity || scope.packQuantity || 1),
  };
  const identityKey = buildSkuIdentityKey(identity);
  const existing = existingSkus.find(sku => sku.identityKey === identityKey);
  if (existing) return existing;
  const requiresRangeReview = scope.minimumSize != null && scope.maximumSize != null && scope.minimumSize !== scope.maximumSize && !observedSizeCompatible;
  const failureReasons = requiresRangeReview ? ['scope_size_range_requires_master_confirmation'] : [];
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
