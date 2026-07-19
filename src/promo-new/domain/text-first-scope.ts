import type { ImportedCardCandidate } from '../import/pdf-importer';
import { recoverCachedCardClasses } from './class-recovery';
import { buildProductScopes, resolveStructuredScope, type ProductScopeCandidate, type ScopeResolution } from './scope-matcher';
import { createSkuCandidate, normalizeProductText } from './sku-identity';
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

function canonicalizeStandaloneAliases(value: string): string {
  return clean(value).replace(/(^|[^A-Z0-9])PT(?=$|[^A-Z0-9])/giu, '$1PANTENE');
}

function exclusions(scope: ProductScopeCandidate): string[] {
  const source = clean(scope.rawText).split(/\bEXCEPT\b|ยกเว้น/iu)[1] || '';
  const connectors = new Set(['และ', 'AND', 'OR']);
  return [...new Set(tokens(source).filter(token => token.length >= 2 && !connectors.has(token)))];
}

function positiveEvidence(text: string): string {
  return clean(text).split(/\bEXCEPT\b|ยกเว้น/iu)[0].trim();
}

function contradictsScope(text: string, scope: ProductScopeCandidate): boolean {
  const positive = positiveEvidence(text);
  const source = compact(positive);
  const target = compact(scope.rawText);
  const sourceNoCap = source.includes(compact('ไม่มีฝา'));
  const sourceWithCap = source.includes(compact('มีฝา')) && !sourceNoCap;
  const targetNoCap = target.includes(compact('ไม่มีฝา'));
  const targetWithCap = target.includes(compact('มีฝา')) && !targetNoCap;
  if ((sourceNoCap && targetWithCap) || (sourceWithCap && targetNoCap)) return true;
  const evidenceTokens = new Set(tokens(positive));
  return exclusions(scope).some(token => evidenceTokens.has(token));
}

function safeStructuredResolution(card: ImportedCardCandidate, scopes: ProductScopeCandidate[]): ScopeResolution {
  const evidence = `${card.productText} ${card.rawText}`;
  const brand = safeBrand(evidence);
  const normalizedCard = brand === 'PANTENE' && tokens(evidence).includes('PT')
    ? {
      ...card,
      productText: canonicalizeStandaloneAliases(card.productText),
      rawText: canonicalizeStandaloneAliases(card.rawText),
    }
    : card;
  const resolution = resolveStructuredScope(normalizedCard, scopes);
  const scope = resolution.scope;
  if (!scope) return resolution;
  if (!brand || brand !== scope.brand || contradictsScope(evidence, scope)) {
    return { scope: null, score: resolution.score, margin: resolution.margin, method: 'unmatched' };
  }
  return resolution;
}

export function resolveTextFirstScopesSafely(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
): Map<string, ScopeResolution> {
  recoverCachedCardClasses(cards, {});
  const scopes = buildProductScopes(families);
  return new Map(cards.map(card => [card.cardId, safeStructuredResolution(card, scopes)]));
}
