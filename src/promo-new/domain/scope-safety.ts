import type { ImportedCardCandidate } from '../import/pdf-importer';
import { createSkuCandidate, normalizeProductText } from './sku-identity';
import {
  buildProductScopes,
  resolveStructuredScope,
  visualSimilarity,
  type ProductScopeCandidate,
  type ScopeResolution,
} from './scope-matcher';
import type { PromotionFamily } from './types';

const clean = (value: unknown): string => normalizeProductText(value).replace(/\s+/g, ' ').trim();
const tokens = (value: unknown): string[] => clean(value).toUpperCase().split(/[^A-Z0-9ก-๙&]+/gu).filter(Boolean);
const compact = (value: unknown): string => tokens(value).join('');

const BRAND_EVIDENCE: Record<string, string[]> = {
  'H&S': ['H&S', 'HEAD&SHOULDERS', 'HEADANDSHOULDERS', 'เฮดแอนด์โชว์เดอร์', 'เฮดแอนด์โชว์เตอร์', 'เฮดแอนด์โชวเดอร์'],
  PANTENE: ['PANTENE', 'PT', 'แพนทีน'],
  REJOICE: ['REJOICE', 'รีจอยส์', 'รีจ้อยส์', 'รีออยส์'],
  OLAY: ['OLAY', 'โอเลย์', 'โอเอย์'],
  'ORAL-B': ['ORAL-B', 'ORALB', 'ออรัลบี', 'ออรัลบ'],
  GILLETTE: ['GILLETTE', 'กิลเลตต์', 'ยิลเลตต์', 'ยิลเลตส์'],
  DOWNY: ['DOWNY', 'ดาวน์นี่'],
  SAFEGUARD: ['SAFEGUARD', 'เซฟการ์ด'],
  VICKS: ['VICKS', 'วิคส์'],
  'AMBI PUR': ['AMBI PUR', 'AMBIPUR', 'แอมบิเพอร์'],
};

const UNIT_MAP: Record<string, string> = {
  ML: 'มล.', VA: 'มล.', 'มล': 'มล.', 'มล.': 'มล.', 'บล': 'มล.', 'บล.': 'มล.',
  L: 'ลิตร', LT: 'ลิตร', 'ลิตร': 'ลิตร',
  G: 'กรัม', GM: 'กรัม', NSU: 'กรัม', 'กรัม': 'กรัม', 'กรับ': 'กรัม',
  KG: 'กก.', 'กก': 'กก.', 'กก.': 'กก.',
};

interface SizeEvidence {
  minimum: number;
  maximum: number;
  unit: string;
}

function explicitAlias(text: string, alias: string): boolean {
  const normalized = clean(alias).toUpperCase();
  if (/^[A-Z0-9]{1,3}$/u.test(normalized)) return tokens(text).includes(normalized);
  return compact(text).includes(compact(alias));
}

function safeBrand(text: string): string | null {
  const explicit = Object.entries(BRAND_EVIDENCE)
    .filter(([, aliases]) => aliases.some(alias => explicitAlias(text, alias)))
    .map(([brand]) => brand);
  if (new Set(explicit).size === 1) return explicit[0];
  const parsed = createSkuCandidate(text).identity.brand;
  return parsed && Object.prototype.hasOwnProperty.call(BRAND_EVIDENCE, parsed) ? parsed : null;
}

function sizeEvidence(text: string): SizeEvidence | null {
  const source = clean(text).replace(/\s+/g, '');
  const unit = '(ML|VA|มล\.?|บล\.?|L|LT|ลิตร|G|GM|NSU|กรัม|กรับ|KG|กก\.?)';
  const range = source.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*[-–+]\\s*(\\d+(?:[.,]\\d+)?)\\s*' + unit, 'iu'));
  if (range) return {
    minimum: Number(range[1].replace(',', '.')),
    maximum: Number(range[2].replace(',', '.')),
    unit: UNIT_MAP[range[3].toUpperCase().replace(/[.\s]/g, '')] || UNIT_MAP[range[3]] || range[3],
  };
  const exact = source.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*' + unit, 'iu'));
  if (!exact) return null;
  const value = Number(exact[1].replace(',', '.'));
  return {
    minimum: value,
    maximum: value,
    unit: UNIT_MAP[exact[2].toUpperCase().replace(/[.\s]/g, '')] || UNIT_MAP[exact[2]] || exact[2],
  };
}

function sizeCompatible(size: SizeEvidence | null, scope: ProductScopeCandidate): boolean | null {
  if (!size) return null;
  if (scope.minimumSize == null || scope.maximumSize == null || !scope.sizeUnit) return null;
  return size.unit === scope.sizeUnit && size.minimum >= scope.minimumSize && size.maximum <= scope.maximumSize;
}

function retailPrice(text: string): number | null {
  const source = clean(text);
  const patterns = [
    /ราคา(?:แนะนำ)?ขายปลีก[^0-9]{0,24}(\d+(?:[.,]\d+)?)\s*บาท/iu,
    /(\d+(?:[.,]\d+)?)\s*บาท\s*\/\s*(?:ขวด|ชิ้น|ด้าม|ถุง|ซอง|กล่อง|แพ็ค|ก้อน|กระปุก)/iu,
    /RETAIL[^0-9]{0,24}(\d+(?:[.,]\d+)?)/iu,
  ];
  for (const pattern of patterns) {
    const amount = Number(source.match(pattern)?.[1]?.replace(',', '.'));
    if (Number.isFinite(amount) && amount > 0 && amount < 5000) return amount;
  }
  return null;
}

function exclusions(scope: ProductScopeCandidate): string[] {
  const source = clean(scope.rawText).split(/\bEXCEPT\b|ยกเว้น/iu)[1] || '';
  return [...new Set(tokens(source).filter(token => token.length >= 2))];
}

function contradictsScope(text: string, scope: ProductScopeCandidate): boolean {
  const source = compact(text);
  const target = compact(scope.rawText);
  const sourceNoCap = source.includes(compact('ไม่มีฝา'));
  const sourceWithCap = source.includes(compact('มีฝา')) && !sourceNoCap;
  const targetNoCap = target.includes(compact('ไม่มีฝา'));
  const targetWithCap = target.includes(compact('มีฝา')) && !targetNoCap;
  if ((sourceNoCap && targetWithCap) || (sourceWithCap && targetNoCap)) return true;
  const evidenceTokens = new Set(tokens(text));
  return exclusions(scope).some(token => evidenceTokens.has(token));
}

function productTypeCompatible(text: string, scope: ProductScopeCandidate): boolean | null {
  const observed = createSkuCandidate(text).identity.productType;
  if (!observed) return null;
  if (observed === scope.productType) return true;
  if (scope.productType === 'แชมพู/ครีมนวด' && (observed === 'แชมพู' || observed === 'ครีมนวด')) return null;
  if (scope.productType.startsWith('แพ็ค ') && /แพ็ค|แพค|PACK/iu.test(text)) return null;
  return false;
}

function safeStructuredResolution(card: ImportedCardCandidate, scopes: ProductScopeCandidate[]): ScopeResolution {
  const resolution = resolveStructuredScope(card, scopes);
  const scope = resolution.scope;
  if (!scope) return resolution;
  const evidence = `${card.productText} ${card.rawText}`;
  const brand = safeBrand(evidence);
  if (!brand || brand !== scope.brand || contradictsScope(evidence, scope)) {
    return { scope: null, score: resolution.score, margin: resolution.margin, method: 'unmatched' };
  }
  return resolution;
}

export function resolveScopesSafely(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
  visualSignatures: Record<string, string> = {},
): Map<string, ScopeResolution> {
  const scopes = buildProductScopes(families);
  const resolutions = new Map(cards.map(card => [card.cardId, safeStructuredResolution(card, scopes)]));
  const anchors = cards.filter(card => resolutions.get(card.cardId)?.method === 'structured_scope');
  const classesByScope = new Map<string, Set<string>>();
  for (const anchor of anchors) {
    const scope = resolutions.get(anchor.cardId)?.scope;
    if (!scope || !anchor.classId) continue;
    const classes = classesByScope.get(scope.key) || new Set<string>();
    classes.add(anchor.classId);
    classesByScope.set(scope.key, classes);
  }

  for (const card of cards) {
    if (resolutions.get(card.cardId)?.scope || !card.classId) continue;
    const evidence = `${card.productText} ${card.rawText}`;
    const brand = safeBrand(evidence);
    const size = sizeEvidence(evidence);
    const price = retailPrice(evidence);
    const observedType = createSkuCandidate(evidence).identity.productType;
    const rankedByScope = new Map<string, { scope: ProductScopeCandidate; similarity: number }>();

    for (const anchor of anchors) {
      if (!anchor.classId || anchor.classId === card.classId) continue;
      const scope = resolutions.get(anchor.cardId)?.scope;
      if (!scope || !scope.classIds.includes(card.classId) || classesByScope.get(scope.key)?.has(card.classId)) continue;
      if (contradictsScope(evidence, scope)) continue;
      if (brand && brand !== scope.brand) continue;
      if (sizeCompatible(size, scope) === false) continue;
      if (productTypeCompatible(evidence, scope) === false) continue;

      const anchorEvidence = `${anchor.productText} ${anchor.rawText}`;
      const anchorPrice = retailPrice(anchorEvidence);
      if (price != null && anchorPrice != null && Math.abs(price - anchorPrice) > 0.05) continue;
      const priceAnchor = price != null && anchorPrice != null && Math.abs(price - anchorPrice) <= 0.05;
      const identityAnchor = Boolean(brand && (size || observedType));
      const exactPositionPriceAnchor = Boolean(priceAnchor && card.sequence === anchor.sequence);
      if (!identityAnchor && !exactPositionPriceAnchor) continue;

      const similarity = visualSimilarity(visualSignatures[card.cardId], visualSignatures[anchor.cardId]);
      const required = identityAnchor ? 0.92 : 0.985;
      if (similarity < required) continue;
      const current = rankedByScope.get(scope.key);
      if (!current || similarity > current.similarity) rankedByScope.set(scope.key, { scope, similarity });
    }

    const ranked = [...rankedByScope.values()].sort((left, right) => right.similarity - left.similarity);
    const best = ranked[0];
    const second = ranked[1];
    const margin = best ? best.similarity - (second?.similarity || 0) : 0;
    if (best && (!second || margin >= 0.04)) {
      resolutions.set(card.cardId, {
        scope: best.scope,
        score: Number((best.similarity * 100).toFixed(1)),
        margin: Number((margin * 100).toFixed(1)),
        method: 'visual_consensus',
      });
    }
  }
  return resolutions;
}
