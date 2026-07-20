import type { ImportedCardCandidate } from '../import/pdf-importer';
import { matchProductMasterByText } from './master-text-matcher';
import { visualSimilarity } from './scope-matcher';
import { createSkuCandidate, normalizeProductText } from './sku-identity';
import type { Sku } from './types';
import type { VisualProductSignature } from './visual-product-signatures';

const MIN_PRODUCT_SIMILARITY = 0.72;
const MIN_TITLE_SIMILARITY = 0.76;
const MIN_COMBINED_SIMILARITY = 0.82;
const STRONG_COMBINED_SIMILARITY = 0.94;
const MIN_NEIGHBOUR_MARGIN = 0.015;
const MAX_NEIGHBOUR_RANK = 2;

const EXPLICIT_VARIANTS: Array<{ canonical: string; patterns: RegExp[] }> = [
  { canonical: 'SUPERCLICK', patterns: [/SUPER\s*CLICK/iu, /ซุปเปอร์\s*คลิ(?:ก|๊ก)/iu] },
  { canonical: 'SUPERTHIN', patterns: [/SUPER\s*THIN/iu, /ซุปเปอร์\s*ธิน/iu] },
  { canonical: 'VECTOR', patterns: [/VECTOR/iu, /เวคเตอร์/iu] },
  { canonical: 'BLUE_2', patterns: [/BLUE\s*(?:II|2|TWO)/iu, /บลู\s*(?:ทู|2)/iu] },
  { canonical: 'BLUE_3', patterns: [/BLUE\s*(?:III|3|THREE)/iu, /บลู\s*(?:ทรี|3)/iu] },
  { canonical: 'KERATIN', patterns: [/KERATIN/iu, /เคราติน/iu] },
  { canonical: 'COLLAGEN', patterns: [/COLLAGEN/iu, /คอลลาเจน/iu] },
  { canonical: 'MICELLAR', patterns: [/MICELLAR/iu, /ไมเซลล่า|ไมเซล่า/iu] },
];

interface CardVisualEvidence {
  card: ImportedCardCandidate;
  sku: Sku;
  master: Sku | null;
  signature: VisualProductSignature;
  explicitVariants: string[];
}

interface PairEvidence {
  left: number;
  right: number;
  title: number;
  product: number;
  combined: number;
}

export interface VisualProductCluster {
  id: string;
  cardIds: string[];
  classIds: string[];
  representativeCardId: string;
  representativeText: string;
  masterSkuId: string | null;
  minimumProductSimilarity: number;
  averageCombinedSimilarity: number;
}

export interface VisualProductClusterResult {
  clusters: VisualProductCluster[];
  assignments: Map<string, VisualProductCluster>;
  comparedPairs: number;
  eligiblePairs: number;
  rejectedConflicts: number;
}

function compact(value: unknown): string {
  return normalizeProductText(value).toUpperCase().replace(/[^A-Z0-9ก-๙&]+/gu, '');
}

function explicitVariants(value: string): string[] {
  return EXPLICIT_VARIANTS.filter(variant => variant.patterns.some(pattern => pattern.test(value))).map(variant => variant.canonical);
}

function explicitVariantConflict(left: CardVisualEvidence, right: CardVisualEvidence): boolean {
  if (!left.explicitVariants.length || !right.explicitVariants.length) return false;
  return !left.explicitVariants.some(value => right.explicitVariants.includes(value));
}

function variantConflict(left: string | null, right: string | null): boolean {
  const a = compact(left);
  const b = compact(right);
  if (!a || !b || a === b || a.includes(b) || b.includes(a)) return false;
  const maximum = Math.max(a.length, b.length);
  let common = 0;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) if (a[index] === b[index]) common += 1;
  return maximum >= 5 && common / maximum < 0.45;
}

function identityConflict(left: Sku, right: Sku): boolean {
  const a = left.identity;
  const b = right.identity;
  if (a.brand && b.brand && a.brand !== b.brand) return true;
  if (a.productType && b.productType && a.productType !== b.productType) return true;
  if (a.sizeValue > 0 && b.sizeValue > 0) {
    if (a.sizeUnit && b.sizeUnit && a.sizeUnit !== b.sizeUnit) return true;
    if (Math.abs(a.sizeValue - b.sizeValue) > 0.05) return true;
  }
  if (a.packQuantity > 1 && b.packQuantity > 1 && a.packQuantity !== b.packQuantity) return true;
  return variantConflict(a.variant, b.variant);
}

function cardConflict(left: CardVisualEvidence, right: CardVisualEvidence): boolean {
  if (explicitVariantConflict(left, right)) return true;
  if (identityConflict(left.master || left.sku, right.master || right.sku)) return true;
  return Boolean(left.master && right.master && left.master.id !== right.master.id);
}

function evidenceFor(card: ImportedCardCandidate, existingSkus: Sku[], signature: VisualProductSignature): CardVisualEvidence {
  const sku = createSkuCandidate(card.productText || '');
  const match = matchProductMasterByText(sku, card.productText || '', existingSkus);
  return {
    card,
    sku,
    master: match.status === 'matched' && match.sku ? match.sku : null,
    signature,
    explicitVariants: explicitVariants(card.productText || ''),
  };
}

function pairEvidence(left: CardVisualEvidence, right: CardVisualEvidence): PairEvidence | null {
  if (!left.card.classId || !right.card.classId || left.card.classId === right.card.classId) return null;
  if (!left.signature.title || !left.signature.product || !right.signature.title || !right.signature.product) return null;
  if (cardConflict(left, right)) return null;
  const title = visualSimilarity(left.signature.title, right.signature.title);
  const product = visualSimilarity(left.signature.product, right.signature.product);
  const combined = title * 0.62 + product * 0.38;
  const sameMaster = Boolean(left.master && right.master && left.master.id === right.master.id);
  const eligible = product >= (sameMaster ? 0.68 : MIN_PRODUCT_SIMILARITY)
    && (title >= MIN_TITLE_SIMILARITY || sameMaster)
    && combined >= (sameMaster ? 0.78 : MIN_COMBINED_SIMILARITY);
  return eligible ? { left: -1, right: -1, title, product, combined } : null;
}

class UnionFind {
  private readonly parent: number[];
  constructor(size: number) { this.parent = Array.from({ length: size }, (_, index) => index); }
  find(index: number): number {
    if (this.parent[index] !== index) this.parent[index] = this.find(this.parent[index]);
    return this.parent[index];
  }
  union(left: number, right: number): void {
    const a = this.find(left);
    const b = this.find(right);
    if (a !== b) this.parent[b] = a;
  }
}

function completeEnough(sku: Sku): boolean {
  const identity = sku.identity;
  const optionalSize = ['มีดโกน', 'แปรงสีฟัน', 'สกินแคร์'].includes(identity.productType) && Boolean(identity.variant);
  return Boolean(identity.brand && identity.productType && ((identity.sizeValue > 0 && identity.sizeUnit) || optionalSize));
}

function representative(members: CardVisualEvidence[]): CardVisualEvidence {
  return [...members].sort((left, right) =>
    Number(Boolean(right.master)) - Number(Boolean(left.master))
    || left.sku.failureReasons.length - right.sku.failureReasons.length
    || right.signature.quality - left.signature.quality
    || right.card.confidence - left.card.confidence
    || right.card.productText.length - left.card.productText.length,
  )[0];
}

function clusterPairStats(indices: number[], pairByKey: Map<string, PairEvidence>): { minimumProduct: number; averageCombined: number } | null {
  const pairs: PairEvidence[] = [];
  for (let left = 0; left < indices.length; left += 1) {
    for (let right = left + 1; right < indices.length; right += 1) {
      const a = Math.min(indices[left], indices[right]);
      const b = Math.max(indices[left], indices[right]);
      const pair = pairByKey.get(`${a}:${b}`);
      if (!pair || pair.product < MIN_PRODUCT_SIMILARITY) return null;
      pairs.push(pair);
    }
  }
  if (!pairs.length) return null;
  return {
    minimumProduct: Math.min(...pairs.map(pair => pair.product)),
    averageCombined: pairs.reduce((sum, pair) => sum + pair.combined, 0) / pairs.length,
  };
}

export function buildVisualProductClusters(
  cards: ImportedCardCandidate[],
  existingSkus: Sku[],
  signatures: Record<string, VisualProductSignature>,
): VisualProductClusterResult {
  const evidence = cards.map(card => evidenceFor(card, existingSkus, signatures[card.cardId] || { title: '', product: '', quality: 0 }));
  const pairs: PairEvidence[] = [];
  const pairByKey = new Map<string, PairEvidence>();
  let comparedPairs = 0;
  let rejectedConflicts = 0;

  for (let left = 0; left < evidence.length; left += 1) {
    for (let right = left + 1; right < evidence.length; right += 1) {
      if (!evidence[left].card.classId || evidence[left].card.classId === evidence[right].card.classId) continue;
      comparedPairs += 1;
      if (cardConflict(evidence[left], evidence[right])) {
        rejectedConflicts += 1;
        continue;
      }
      const pair = pairEvidence(evidence[left], evidence[right]);
      if (!pair) continue;
      const complete = { ...pair, left, right };
      pairs.push(complete);
      pairByKey.set(`${left}:${right}`, complete);
    }
  }

  const rankedByCard = new Map<number, PairEvidence[]>();
  for (const pair of pairs) {
    for (const index of [pair.left, pair.right]) {
      const ranked = rankedByCard.get(index) || [];
      ranked.push(pair);
      rankedByCard.set(index, ranked);
    }
  }
  for (const ranked of rankedByCard.values()) ranked.sort((a, b) => b.combined - a.combined || b.product - a.product);

  const eligibleEdges = pairs.filter(pair => {
    const leftRanked = rankedByCard.get(pair.left) || [];
    const rightRanked = rankedByCard.get(pair.right) || [];
    const leftRank = leftRanked.indexOf(pair);
    const rightRank = rightRanked.indexOf(pair);
    if (leftRank < 0 || rightRank < 0) return false;
    const sameMaster = Boolean(evidence[pair.left].master && evidence[pair.right].master && evidence[pair.left].master?.id === evidence[pair.right].master?.id);
    if (sameMaster || pair.combined >= STRONG_COMBINED_SIMILARITY) return true;
    if (leftRank >= MAX_NEIGHBOUR_RANK || rightRank >= MAX_NEIGHBOUR_RANK) return false;
    const leftMargin = pair.combined - (leftRanked[MAX_NEIGHBOUR_RANK]?.combined || 0);
    const rightMargin = pair.combined - (rightRanked[MAX_NEIGHBOUR_RANK]?.combined || 0);
    return leftMargin >= MIN_NEIGHBOUR_MARGIN && rightMargin >= MIN_NEIGHBOUR_MARGIN;
  }).sort((a, b) => b.combined - a.combined || b.product - a.product);

  const union = new UnionFind(evidence.length);
  const membersByRoot = new Map<number, Set<number>>(evidence.map((_, index) => [index, new Set([index])]));
  for (const edge of eligibleEdges) {
    const leftRoot = union.find(edge.left);
    const rightRoot = union.find(edge.right);
    if (leftRoot === rightRoot) continue;
    const candidate = [...(membersByRoot.get(leftRoot) || []), ...(membersByRoot.get(rightRoot) || [])];
    const classes = candidate.map(index => evidence[index].card.classId).filter(Boolean);
    if (new Set(classes).size !== classes.length) continue;
    let conflict = false;
    for (let left = 0; left < candidate.length && !conflict; left += 1) {
      for (let right = left + 1; right < candidate.length; right += 1) {
        if (cardConflict(evidence[candidate[left]], evidence[candidate[right]])) { conflict = true; break; }
      }
    }
    if (conflict || !clusterPairStats(candidate, pairByKey)) continue;
    union.union(leftRoot, rightRoot);
    const root = union.find(leftRoot);
    membersByRoot.delete(leftRoot);
    membersByRoot.delete(rightRoot);
    membersByRoot.set(root, new Set(candidate));
  }

  const components = new Map<number, number[]>();
  evidence.forEach((_, index) => {
    const root = union.find(index);
    const members = components.get(root) || [];
    members.push(index);
    components.set(root, members);
  });

  const clusters: VisualProductCluster[] = [];
  for (const indices of components.values()) {
    if (indices.length < 2) continue;
    const members = indices.map(index => evidence[index]);
    if (!members.some(member => member.master || completeEnough(member.sku))) continue;
    const stats = clusterPairStats(indices, pairByKey);
    if (!stats) continue;
    const selected = representative(members);
    const selectedMaster = selected.master || members.find(member => member.master)?.master || null;
    const representativeText = selectedMaster?.canonicalName || selected.card.productText;
    if (!representativeText) continue;
    clusters.push({
      id: `visual:${members.map(member => member.card.cardId).sort().join('|')}`,
      cardIds: members.map(member => member.card.cardId),
      classIds: members.map(member => member.card.classId as string),
      representativeCardId: selected.card.cardId,
      representativeText,
      masterSkuId: selectedMaster?.id || null,
      minimumProductSimilarity: Number(stats.minimumProduct.toFixed(4)),
      averageCombinedSimilarity: Number(stats.averageCombined.toFixed(4)),
    });
  }

  const assignments = new Map<string, VisualProductCluster>();
  for (const cluster of clusters) for (const cardId of cluster.cardIds) assignments.set(cardId, cluster);
  return { clusters, assignments, comparedPairs, eligiblePairs: eligibleEdges.length, rejectedConflicts };
}
