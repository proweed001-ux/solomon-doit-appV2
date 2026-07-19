import type { Sku, SkuIdentity } from './types';
import { buildSkuIdentityKey, createSkuCandidate } from './sku-identity';
import { normalizeProductOcrText } from './product-text-normalizer';

const MASTER_MIN_SCORE = 85;
const MASTER_MIN_MARGIN = 8;

const BRAND_TYPE_DEFAULTS: Record<string, string> = {
  GILLETTE: 'มีดโกน',
  'ORAL-B': 'แปรงสีฟัน',
  OLAY: 'สกินแคร์',
  VICKS: 'ยาบาล์ม',
  'AMBI PUR': 'ผลิตภัณฑ์ปรับอากาศ',
  DOWNY: 'ปรับผ้านุ่ม',
};

const PLACEHOLDER_MASTER = /รอตรวจข้อความจาก\s*PDF|ไม่ทราบสินค้า|สินค้าใหม่ที่ยังอ่านชื่อไม่ครบ/iu;

export function repairCommonProductOcr(value: unknown): string {
  return normalizeProductOcrText(value);
}

function compact(value: unknown): string {
  return repairCommonProductOcr(value).toUpperCase().replace(/[^A-Z0-9ก-๙]+/gu, '');
}

function meaningfulEvidence(sku: Sku): string[] {
  return [...new Set([
    sku.canonicalName,
    ...sku.evidence.filter(value => value && !/^(?:legacy|compat):/iu.test(value)),
  ].map(value => repairCommonProductOcr(value)).filter(value => value && !PLACEHOLDER_MASTER.test(value)))];
}

function inferredIdentity(identity: SkuIdentity): SkuIdentity {
  const productType = identity.productType || BRAND_TYPE_DEFAULTS[identity.brand] || '';
  return { ...identity, productType };
}

function evidenceCandidate(value: string): Sku {
  const candidate = createSkuCandidate(repairCommonProductOcr(value));
  const identity = inferredIdentity(candidate.identity);
  const failureReasons = candidate.failureReasons.filter(reason => reason !== 'product_type_missing' || !identity.productType);
  return {
    ...candidate,
    identity,
    identityKey: buildSkuIdentityKey(identity),
    failureReasons,
    status: failureReasons.length ? 'quarantine' : 'candidate',
  };
}

function candidateQuality(candidate: Sku): number {
  const identity = candidate.identity;
  return (identity.brand ? 30 : 0)
    + (identity.productType ? 25 : 0)
    + (identity.sizeValue > 0 && identity.sizeUnit ? 25 : 0)
    + (identity.variant ? 12 : 0)
    + (candidate.failureReasons.length ? -candidate.failureReasons.length * 5 : 10);
}

function parsedMasterSku(master: Sku): Sku | null {
  const evidence = meaningfulEvidence(master);
  if (!evidence.length) return null;
  const parsed = evidence
    .map(value => evidenceCandidate(value))
    .sort((left, right) => candidateQuality(right) - candidateQuality(left))[0];
  if (!parsed.identity.brand) return null;
  const identity = {
    ...parsed.identity,
    salesUnit: master.identity.salesUnit || parsed.identity.salesUnit,
    packQuantity: master.identity.packQuantity > 1 ? master.identity.packQuantity : parsed.identity.packQuantity,
  };
  return {
    ...master,
    identity,
    identityKey: buildSkuIdentityKey(identity),
    evidence,
  };
}

function bigrams(value: string): string[] {
  const source = compact(value);
  if (source.length < 2) return source ? [source] : [];
  return Array.from({ length: source.length - 1 }, (_, index) => source.slice(index, index + 2));
}

function diceSimilarityFromBigrams(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const counts = new Map<string, number>();
  for (const item of a) counts.set(item, (counts.get(item) || 0) + 1);
  let overlap = 0;
  for (const item of b) {
    const remaining = counts.get(item) || 0;
    if (!remaining) continue;
    overlap += 1;
    counts.set(item, remaining - 1);
  }
  return (2 * overlap) / (a.length + b.length);
}

function diceSimilarity(left: string, right: string): number {
  return diceSimilarityFromBigrams(bigrams(left), bigrams(right));
}

function sameNumber(left: number, right: number): boolean {
  return Math.abs(left - right) <= 0.001;
}

interface ScoredMaster {
  sku: Sku;
  score: number;
  aliasSimilarity: number;
  variantSimilarity: number;
  criticalEvidence: number;
}

interface PreparedMaster {
  sku: Sku;
  evidenceBigrams: string[][];
}

function prepareMasters(existingSkus: Sku[]): PreparedMaster[] {
  return existingSkus
    .filter(sku => sku.status === 'active' && !PLACEHOLDER_MASTER.test(sku.canonicalName))
    .flatMap(sku => {
      const parsed = parsedMasterSku(sku);
      if (!parsed) return [];
      return [{ sku: parsed, evidenceBigrams: meaningfulEvidence(parsed).map(value => bigrams(value)) }];
    });
}

function scoreMaster(observed: Sku, sourceTextBigrams: string[], master: PreparedMaster): ScoredMaster | null {
  const left = inferredIdentity(observed.identity);
  const right = inferredIdentity(master.sku.identity);
  let score = 0;
  let criticalEvidence = 0;

  if (left.brand && right.brand) {
    if (left.brand !== right.brand) return null;
    score += 35;
    criticalEvidence += 1;
  }

  if (left.productType && right.productType) {
    if (left.productType !== right.productType) return null;
    score += 30;
    criticalEvidence += 1;
  }

  if (left.sizeValue > 0 && right.sizeValue > 0) {
    if (!sameNumber(left.sizeValue, right.sizeValue)) return null;
    if (left.sizeUnit && right.sizeUnit && left.sizeUnit !== right.sizeUnit) return null;
    score += 25;
    criticalEvidence += 1;
  }

  if (left.packQuantity > 1 && right.packQuantity > 1) {
    if (left.packQuantity !== right.packQuantity) return null;
    score += 5;
  }

  const leftVariant = left.variant || '';
  const rightVariant = right.variant || '';
  if (Boolean(leftVariant) !== Boolean(rightVariant)) return null;
  const variantSimilarity = leftVariant && rightVariant ? diceSimilarity(leftVariant, rightVariant) : 0;
  if (leftVariant && rightVariant) {
    if (variantSimilarity < 0.42) return null;
    score += Math.round(20 * variantSimilarity);
  }

  const aliasSimilarity = Math.max(...master.evidenceBigrams.map(value => diceSimilarityFromBigrams(sourceTextBigrams, value)), 0);
  if (aliasSimilarity >= 0.45) score += Math.round(10 * aliasSimilarity);

  const missingSizeOnEitherSide = !(left.sizeValue > 0 && right.sizeValue > 0);
  if (missingSizeOnEitherSide && variantSimilarity < 0.6 && criticalEvidence < 3) return null;
  if (criticalEvidence < 2) return null;

  return { sku: master.sku, score, aliasSimilarity, variantSimilarity, criticalEvidence };
}

export interface MasterTextMatch {
  status: 'matched' | 'ambiguous' | 'unmatched';
  sku: Sku | null;
  score: number;
  margin: number;
  candidateCount: number;
}

export type ProductMasterTextMatcher = (observedInput: Sku, sourceTextInput: string) => MasterTextMatch;

function matchPreparedProductMasterByText(
  observedInput: Sku,
  sourceTextInput: string,
  preparedMasters: PreparedMaster[],
): MasterTextMatch {
  const sourceText = repairCommonProductOcr(sourceTextInput);
  const inputIdentity = inferredIdentity(observedInput.identity);
  const normalizedInput: Sku = {
    ...observedInput,
    identity: inputIdentity,
    identityKey: buildSkuIdentityKey(inputIdentity),
  };
  const repaired = evidenceCandidate(sourceText);
  const observed = candidateQuality(repaired) > candidateQuality(normalizedInput) ? repaired : normalizedInput;
  const sourceTextBigrams = bigrams(sourceText);
  const scored = preparedMasters
    .flatMap(master => {
      const result = scoreMaster(observed, sourceTextBigrams, master);
      return result ? [result] : [];
    })
    .sort((left, right) => right.score - left.score || right.aliasSimilarity - left.aliasSimilarity);

  const best = scored[0];
  const second = scored[1];
  if (!best) return { status: 'unmatched', sku: null, score: 0, margin: 0, candidateCount: 0 };
  const margin = best.score - (second?.score || 0);
  if (best.score < MASTER_MIN_SCORE) {
    return { status: 'unmatched', sku: null, score: best.score, margin, candidateCount: scored.length };
  }
  if (second && margin < MASTER_MIN_MARGIN) {
    return { status: 'ambiguous', sku: null, score: best.score, margin, candidateCount: scored.length };
  }
  return { status: 'matched', sku: best.sku, score: best.score, margin, candidateCount: scored.length };
}

export function createProductMasterTextMatcher(existingSkus: Sku[]): ProductMasterTextMatcher {
  const preparedMasters = prepareMasters(existingSkus);
  return (observedInput, sourceTextInput) => matchPreparedProductMasterByText(observedInput, sourceTextInput, preparedMasters);
}

const MATCHER_CACHE = new WeakMap<Sku[], ProductMasterTextMatcher>();

export function matchProductMasterByText(
  observedInput: Sku,
  sourceTextInput: string,
  existingSkus: Sku[],
): MasterTextMatch {
  let matcher = MATCHER_CACHE.get(existingSkus);
  if (!matcher) {
    matcher = createProductMasterTextMatcher(existingSkus);
    MATCHER_CACHE.set(existingSkus, matcher);
  }
  return matcher(observedInput, sourceTextInput);
}
