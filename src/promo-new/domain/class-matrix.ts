import type { ImportedCardCandidate } from '../import/pdf-importer';
import { createSkuCandidate, normalizeProductText } from './sku-identity';
import { visualSimilarity, type ProductScopeCandidate, type ScopeResolution } from './scope-matcher';

const MIN_SCORE = 82;
const CARD_MARGIN = 7;
const SLOT_MARGIN = 5;

const clean = (value: unknown): string => normalizeProductText(value).replace(/\s+/g, ' ').trim();

function retailPrice(value: string): number | null {
  const text = clean(value);
  const patterns = [
    /ราคา(?:แนะนำ)?ขายปลีก[^0-9]{0,24}(\d+(?:[.,]\d+)?)\s*บาท/iu,
    /(\d+(?:[.,]\d+)?)\s*บาท\s*\/\s*(?:ขวด|ชิ้น|ด้าม|ถุง|ซอง|กล่อง|แพ็ค|ก้อน|กระปุก)/iu,
    /RETAIL[^0-9]{0,24}(\d+(?:[.,]\d+)?)/iu,
  ];
  for (const pattern of patterns) {
    const amount = Number(text.match(pattern)?.[1]?.replace(',', '.'));
    if (Number.isFinite(amount) && amount > 0 && amount < 5000) return amount;
  }
  return null;
}

function sameProductType(observed: string, expected: string): boolean | null {
  if (!observed) return null;
  if (observed === expected) return true;
  if (expected === 'แชมพู/ครีมนวด' && (observed === 'แชมพู' || observed === 'ครีมนวด')) return null;
  if (expected.startsWith('แพ็ค ') && observed.startsWith('แพ็ค ')) return null;
  return false;
}

function sizeEvidence(card: ImportedCardCandidate): { value: number; unit: string } | null {
  const sku = createSkuCandidate(`${card.productText} ${card.rawText}`);
  return sku.identity.sizeValue > 0 && sku.identity.sizeUnit
    ? { value: sku.identity.sizeValue, unit: sku.identity.sizeUnit }
    : null;
}

function sizeCompatibility(card: ImportedCardCandidate, scope: ProductScopeCandidate): 'exact' | 'unknown' | 'conflict' {
  if (scope.minimumSize == null || scope.maximumSize == null || !scope.sizeUnit) return 'unknown';
  const observed = sizeEvidence(card);
  if (!observed) return 'unknown';
  if (observed.unit !== scope.sizeUnit) return 'conflict';
  return observed.value >= scope.minimumSize && observed.value <= scope.maximumSize ? 'exact' : 'conflict';
}

function priceMode(cards: ImportedCardCandidate[]): { amount: number; count: number } | null {
  const counts = new Map<number, number>();
  for (const card of cards) {
    const amount = retailPrice(`${card.productText} ${card.rawText}`);
    if (amount == null) continue;
    const rounded = Math.round(amount * 100) / 100;
    counts.set(rounded, (counts.get(rounded) || 0) + 1);
  }
  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0] - right[0]);
  return ranked[0] ? { amount: ranked[0][0], count: ranked[0][1] } : null;
}

interface MatrixScope {
  scope: ProductScopeCandidate;
  anchors: ImportedCardCandidate[];
  occupiedClasses: Set<string>;
}

interface Edge {
  card: ImportedCardCandidate;
  target: MatrixScope;
  score: number;
  evidence: string[];
}

function edgeFor(
  card: ImportedCardCandidate,
  target: MatrixScope,
  signatures: Record<string, string>,
): Edge | null {
  if (!card.classId || !target.scope.classIds.includes(card.classId) || target.occupiedClasses.has(card.classId)) return null;
  const anchors = target.anchors.filter(anchor => anchor.classId && anchor.classId !== card.classId);
  if (!anchors.length) return null;

  const evidenceText = `${card.productText} ${card.rawText}`;
  const observed = createSkuCandidate(evidenceText);
  const evidence: string[] = [];
  let score = 0;

  if (observed.identity.brand) {
    if (observed.identity.brand !== target.scope.brand) return null;
    score += 15;
    evidence.push('brand');
  }

  const type = sameProductType(observed.identity.productType, target.scope.productType);
  if (type === false) return null;
  if (type === true) {
    score += 8;
    evidence.push('type');
  }

  const size = sizeCompatibility(card, target.scope);
  if (size === 'conflict') return null;
  if (size === 'exact') {
    score += 10;
    evidence.push('size');
  }

  const similarities = anchors
    .map(anchor => visualSimilarity(signatures[card.cardId], signatures[anchor.cardId]))
    .filter(value => value > 0)
    .sort((left, right) => right - left);
  const bestVisual = similarities[0] || 0;
  const secondVisual = similarities[1] || 0;
  if (bestVisual < 0.9) return null;
  score += bestVisual * 60;
  evidence.push(`visual:${bestVisual.toFixed(3)}`);
  const multiAnchorVisual = secondVisual >= 0.9;
  if (multiAnchorVisual) {
    score += 8;
    evidence.push(`visual2:${secondVisual.toFixed(3)}`);
  }
  const visualOnlyConsensus = bestVisual >= 0.985 && secondVisual >= 0.96;
  if (visualOnlyConsensus) {
    score += 8;
    evidence.push('visual-strong-consensus');
  }

  const observedPrice = retailPrice(evidenceText);
  const anchorPrice = priceMode(anchors);
  let priceMatch = false;
  if (observedPrice != null && anchorPrice) {
    if (Math.abs(observedPrice - anchorPrice.amount) <= 0.05) {
      priceMatch = true;
      score += 15;
      evidence.push('price');
    } else if (anchorPrice.count >= 2) {
      return null;
    }
  }

  const nearestSequence = Math.min(...anchors.map(anchor => Math.abs(anchor.sequence - card.sequence)));
  if (nearestSequence === 0) {
    score += 6;
    evidence.push('position');
  } else if (nearestSequence === 1) {
    score += 4;
    evidence.push('position-near');
  } else if (nearestSequence === 2) {
    score += 2;
  }

  score += Math.min(5, anchors.length);
  const strongIdentity = Boolean(observed.identity.brand && (type === true || size === 'exact'));
  if (!strongIdentity && !priceMatch && !multiAnchorVisual && !visualOnlyConsensus) return null;

  return { card, target, score: Number(score.toFixed(3)), evidence };
}

export interface ClassMatrixResult {
  resolutions: Map<string, ScopeResolution>;
  recovered: number;
  ambiguous: number;
}

export function applyClassMatrixRecovery(
  cards: ImportedCardCandidate[],
  scopes: ProductScopeCandidate[],
  input: Map<string, ScopeResolution>,
  signatures: Record<string, string> = {},
): ClassMatrixResult {
  const resolutions = new Map(input);
  const scopeByKey = new Map(scopes.map(scope => [scope.key, scope]));
  const matrixScopes = new Map<string, MatrixScope>();

  for (const card of cards) {
    const resolution = resolutions.get(card.cardId);
    if (!resolution?.scope || !card.classId) continue;
    const scope = scopeByKey.get(resolution.scope.key) || resolution.scope;
    const current = matrixScopes.get(scope.key) || { scope, anchors: [], occupiedClasses: new Set<string>() };
    current.anchors.push(card);
    current.occupiedClasses.add(card.classId);
    matrixScopes.set(scope.key, current);
  }

  const unresolved = cards.filter(card => card.classId && !resolutions.get(card.cardId)?.scope);
  const edges = unresolved.flatMap(card => [...matrixScopes.values()].flatMap(target => {
    const edge = edgeFor(card, target, signatures);
    return edge ? [edge] : [];
  }));

  const byCard = new Map<string, Edge[]>();
  for (const edge of edges) {
    const list = byCard.get(edge.card.cardId) || [];
    list.push(edge);
    byCard.set(edge.card.cardId, list);
  }

  const cardWinners: Edge[] = [];
  let ambiguous = 0;
  for (const card of unresolved) {
    const ranked = (byCard.get(card.cardId) || []).sort((left, right) => right.score - left.score || left.target.scope.key.localeCompare(right.target.scope.key));
    const best = ranked[0];
    const second = ranked[1];
    const margin = best ? best.score - (second?.score || 0) : 0;
    if (!best || best.score < MIN_SCORE || (second && margin < CARD_MARGIN)) {
      if (best) ambiguous += 1;
      continue;
    }
    cardWinners.push(best);
  }

  const bySlot = new Map<string, Edge[]>();
  for (const edge of cardWinners) {
    const slot = `${edge.target.scope.key}|${edge.card.classId}`;
    const list = bySlot.get(slot) || [];
    list.push(edge);
    bySlot.set(slot, list);
  }

  let recovered = 0;
  for (const ranked of bySlot.values()) {
    ranked.sort((left, right) => right.score - left.score || left.card.cardId.localeCompare(right.card.cardId));
    const best = ranked[0];
    const second = ranked[1];
    const margin = best.score - (second?.score || 0);
    if (second && margin < SLOT_MARGIN) {
      ambiguous += ranked.length;
      continue;
    }
    resolutions.set(best.card.cardId, {
      scope: best.target.scope,
      score: Number(best.score.toFixed(1)),
      margin: Number(margin.toFixed(1)),
      method: 'visual_consensus',
      matrix: true,
      matrixEvidence: best.evidence,
    } as ScopeResolution & { matrix: true; matrixEvidence: string[] });
    recovered += 1;
  }

  return { resolutions, recovered, ambiguous };
}
