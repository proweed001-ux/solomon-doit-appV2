import type { ProductGroup, PromoDataset, PromotionFamily } from './types';

const normalize = (value: unknown): string => String(value || '')
  .normalize('NFKC')
  .toUpperCase()
  .replace(/\u0E4D\u0E32/gu, '\u0E33')
  .replace(/[^A-Z0-9ก-๙.]+/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const BRAND_ALIASES: Record<string, string[]> = {
  'H&S': ['H&S', 'HEAD SHOULDERS', 'HEAD AND SHOULDERS', 'เฮดแอนด์โชว์เดอร์', 'เฮดแอนด์โชว์เตอร์'],
  PANTENE: ['PANTENE', 'แพนทีน'],
  REJOICE: ['REJOICE', 'รีจอยส์', 'รีจ้อยส์', 'รีออยส์'],
  DOWNY: ['DOWNY', 'ดาวน์นี่'],
  OLAY: ['OLAY', 'โอเลย์', 'โอเอย์'],
  'ORAL-B': ['ORAL-B', 'ORAL B', 'ออรัลบี', 'ออรัลบ'],
  GILLETTE: ['GILLETTE', 'กิลเลตต์', 'ยิลเลตต์', 'ยิลเลตส์'],
  SAFEGUARD: ['SAFEGUARD', 'เซฟการ์ด'],
  VICKS: ['VICKS', 'วิคส์'],
  'AMBI PUR': ['AMBI PUR', 'AMBIPUR', 'แอมบิเพอร์'],
};

const TYPE_ALIASES: Record<string, string[]> = {
  'แชมพู': ['แชมพู', 'SHAMPOO'],
  'ครีมนวด': ['ครีมนวด', 'CONDITIONER'],
  'ทรีทเมนต์ซอง': ['ทรีทเมนต์', 'TREATMENT'],
  'ผงซักฟอก': ['ผงซักฟอก', 'POWDER DETERGENT'],
  'น้ำยาซักผ้า': ['น้ำยาซักผ้า', 'LAUNDRY LIQUID', 'LIQUID DETERGENT'],
  'ปรับผ้านุ่ม': ['ปรับผ้านุ่ม', 'FABRIC SOFTENER'],
  'สบู่': ['สบู่', 'SOAP', 'BODY WASH'],
  'ยาสีฟัน': ['ยาสีฟัน', 'TOOTHPASTE'],
  'แปรงสีฟัน': ['แปรงสีฟัน', 'TOOTHBRUSH'],
  'มีดโกน': ['มีดโกน', 'ใบมีด', 'ด้ามมีด', 'RAZOR', 'BLADE'],
  'สกินแคร์': ['สกินแคร์', 'ครีมบำรุง', 'เซรั่ม', 'TOTAL EFFECTS', 'TOTAL WHITE', 'WHITE RADIANCE'],
  'ยาบาล์ม': ['ยาบาล์ม', 'BALM', 'VAPORUB'],
  'ผลิตภัณฑ์ปรับอากาศ': ['ผลิตภัณฑ์ปรับอากาศ', 'AIR CARE', 'FRESH MINI'],
};

const UNIT_ALIASES: Record<string, string[]> = {
  'มล.': ['ML', 'มล', 'มล.'],
  'ลิตร': ['L', 'LT', 'ลิตร'],
  'กรัม': ['G', 'GM', 'กรัม'],
  'กก.': ['KG', 'กก', 'กก.'],
};

function includesAlias(text: string, aliases: string[]): boolean {
  return aliases.some(alias => text.includes(normalize(alias)));
}

function mentionedKeys(text: string, aliases: Record<string, string[]>): string[] {
  return Object.entries(aliases).filter(([, values]) => includesAlias(text, values)).map(([key]) => key);
}

function sizeEvidence(text: string): Array<{ minimum: number; maximum: number; unit: string }> {
  const output: Array<{ minimum: number; maximum: number; unit: string }> = [];
  const unitSource = '(ML|มล\\.?|L|LT|ลิตร|G|GM|กรัม|KG|กก\\.?)';
  const range = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*[-–]\\s*(\\d+(?:[.,]\\d+)?)\\s*${unitSource}`, 'giu');
  const exact = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*${unitSource}`, 'giu');
  const consumed: Array<{ start: number; end: number }> = [];
  for (const match of text.matchAll(range)) {
    const start = match.index || 0;
    consumed.push({ start, end: start + match[0].length });
    const unit = Object.entries(UNIT_ALIASES).find(([, aliases]) => includesAlias(normalize(match[3]), aliases))?.[0] || normalize(match[3]);
    output.push({ minimum: Number(match[1].replace(',', '.')), maximum: Number(match[2].replace(',', '.')), unit });
  }
  for (const match of text.matchAll(exact)) {
    const start = match.index || 0;
    const end = start + match[0].length;
    if (consumed.some(span => start < span.end && end > span.start)) continue;
    const value = Number(match[1].replace(',', '.'));
    const unit = Object.entries(UNIT_ALIASES).find(([, aliases]) => includesAlias(normalize(match[2]), aliases))?.[0] || normalize(match[2]);
    output.push({ minimum: value, maximum: value, unit });
  }
  return output.filter(item => Number.isFinite(item.minimum) && Number.isFinite(item.maximum));
}

function usefulTokens(value: string): Set<string> {
  const ignored = new Set(['ทุกสูตร', 'ขนาด', 'สินค้า', 'โปรโมชั่น', 'เฉพาะช่องทาง', 'CLASS', 'PROMOTION']);
  return new Set(normalize(value).split(' ').filter(token => token.length >= 3 && !ignored.has(token) && !/^\d+(?:\.\d+)?$/.test(token)));
}

export interface FamilyMatch {
  family: PromotionFamily;
  score: number;
  reasons: string[];
}

export function scorePromotionFamily(group: ProductGroup, family: PromotionFamily): FamilyMatch | null {
  if (family.failureReasons.length) return null;
  if (group.classIds.some(classId => !family.tiersByClass[classId]?.length)) return null;
  const scope = normalize(`${family.name} ${family.scopeText}`);
  const brands = mentionedKeys(scope, BRAND_ALIASES);
  const types = mentionedKeys(scope, TYPE_ALIASES);
  const sizes = sizeEvidence(scope);
  const identity = group.sku.identity;
  let score = 3;
  const reasons = ['class_coverage'];

  if (brands.length) {
    if (!brands.includes(identity.brand)) return null;
    score += 5;
    reasons.push('brand');
  }
  if (types.length) {
    if (!types.includes(identity.productType)) return null;
    score += 4;
    reasons.push('product_type');
  }
  if (sizes.length) {
    if (!(identity.sizeValue > 0) || !identity.sizeUnit) return null;
    const matchedSize = sizes.some(size => size.unit === identity.sizeUnit && identity.sizeValue >= size.minimum && identity.sizeValue <= size.maximum);
    if (!matchedSize) return null;
    score += 5;
    reasons.push('size');
  }

  const groupTokens = usefulTokens([group.sku.canonicalName, group.sku.identity.variant || '', ...group.sku.evidence].join(' '));
  const scopeTokens = usefulTokens(scope);
  const overlap = [...groupTokens].filter(token => scopeTokens.has(token)).length;
  score += Math.min(3, overlap);
  if (overlap) reasons.push(`token_overlap:${overlap}`);

  if (!brands.length && !types.length && !sizes.length) return null;
  return { family, score, reasons };
}

export function findPromotionFamily(group: ProductGroup, families: PromotionFamily[]): { match: FamilyMatch | null; ambiguous: FamilyMatch[] } {
  const ranked = families
    .map(family => scorePromotionFamily(group, family))
    .filter((item): item is FamilyMatch => Boolean(item))
    .sort((left, right) => right.score - left.score || left.family.name.localeCompare(right.family.name, 'th'));
  const best = ranked[0] || null;
  if (!best || best.score < 10) return { match: null, ambiguous: ranked.slice(0, 3) };
  const second = ranked[1];
  if (second && best.score - second.score < 2) return { match: null, ambiguous: ranked.slice(0, 3) };
  return { match: best, ambiguous: [] };
}

export function autoAssignPromotionFamilies(dataset: PromoDataset): {
  dataset: PromoDataset;
  matched: number;
  ambiguous: number;
  unmatched: number;
} {
  let ambiguous = 0;
  let unmatched = 0;
  const warnings = [...dataset.warnings];
  const productGroups = dataset.productGroups.map(group => {
    const result = findPromotionFamily(group, dataset.promotionFamilies);
    if (result.ambiguous.length > 1) {
      ambiguous += 1;
      warnings.push(`group:${group.id}:promotion_family_ambiguous:${result.ambiguous.map(item => item.family.id).join(',')}`);
    } else {
      unmatched += 1;
      if (result.match) warnings.push(`group:${group.id}:promotion_family_suggested:${result.match.family.id}`);
      else warnings.push(`group:${group.id}:promotion_family_unmatched`);
    }
    return {
      ...group,
      promotionFamilyId: null,
      status: 'need_review' as const,
      failureReasons: [...new Set([...(group.failureReasons || []).filter(reason => !reason.startsWith('promotion_')), 'promotion_pending_review'])],
    };
  });
  const cards = dataset.cards.map(card => ({
    ...card,
    promotionFamilyId: null,
    promotionTiers: [],
    status: 'need_review' as const,
    failureReasons: [...new Set([...(card.failureReasons || []).filter(reason => !reason.startsWith('promotion_')), 'promotion_pending_review'])],
  }));
  warnings.push('promotion_family_manual_selection_required');
  return { dataset: { ...dataset, cards, productGroups, warnings: [...new Set(warnings)] }, matched: 0, ambiguous, unmatched };
}
