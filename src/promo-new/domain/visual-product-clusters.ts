import type { ImportedCardCandidate } from '../import/pdf-importer';
import { matchProductMasterByText } from './master-text-matcher';
import { normalizeProductOcrText } from './product-text-normalizer';
import { createSkuCandidate } from './sku-identity';
import type { Sku } from './types';
import type { VisualProductSignature } from './visual-product-signatures';

const MIN_PAIR_SCORE = 0.70;
const ANCHOR_CLASS = 'HFSM';
const CLASS_ORDER = ['HFSS', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'];

interface ExplicitVariantRule {
  canonical: string;
  family: string;
  patterns: RegExp[];
}

const EXPLICIT_VARIANTS: ExplicitVariantRule[] = [
  { canonical: 'SUPERTHIN_TWO', family: 'RAZOR_MODEL', patterns: [/SUPER\s*THIN\s*(?:2|TWO)/iu, /ซุปเปอร์\s*ธิน\s*(?:ทู|2)/iu] },
  { canonical: 'SUPERCLICK', family: 'RAZOR_MODEL', patterns: [/SUPER\s*CLICK/iu, /ซุปเปอร์\s*คลิ(?:ก|๊ก)/iu] },
  { canonical: 'SUPERTHIN', family: 'RAZOR_MODEL', patterns: [/SUPER\s*THIN/iu, /ซุปเปอร์\s*ธิน/iu] },
  { canonical: 'VECTOR_HANDLE', family: 'RAZOR_MODEL', patterns: [/(?:VECTOR|เวคเตอร์).{0,18}(?:HANDLE|ด้าม)/iu, /(?:HANDLE|ด้าม).{0,18}(?:VECTOR|เวคเตอร์)/iu] },
  { canonical: 'VECTOR_BLADE', family: 'RAZOR_MODEL', patterns: [/(?:VECTOR|เวคเตอร์).{0,18}(?:BLADE|ใบมีด)/iu, /(?:BLADE|ใบมีด).{0,18}(?:VECTOR|เวคเตอร์)/iu] },
  { canonical: 'BLUE_2', family: 'RAZOR_MODEL', patterns: [/BLUE\s*(?:II|2|TWO)/iu, /บลู\s*(?:ทู|2)/iu] },
  { canonical: 'BLUE_3', family: 'RAZOR_MODEL', patterns: [/BLUE\s*(?:III|3|THREE)/iu, /บลู\s*(?:ทรี|3)/iu] },
  { canonical: 'FLEXI_WIPE', family: 'RAZOR_MODEL', patterns: [/FLEXI|WIPE/iu, /เฟล(?:็|ิ)?ก?ซี่|ไวป์/iu] },
  { canonical: 'TOTAL_WHITE', family: 'OLAY_LINE', patterns: [/TOTAL\s*WHITE/iu, /โททัล\s*ไวท์/iu] },
  { canonical: 'TOTAL_EFFECTS', family: 'OLAY_LINE', patterns: [/TOTAL\s*EFFECTS/iu, /โททัล\s*เอฟเฟ็ค/iu] },
  { canonical: 'WHITE_RADIANCE', family: 'OLAY_LINE', patterns: [/WHITE\s*RADIANCE/iu, /ไวท์\s*เรเดียนซ์|ไวท์แร[ดตส]?เ[ดตส]?ียนซ์/iu] },
  { canonical: 'NO_CAP', family: 'CAP_STATE', patterns: [/NO\s*CAP/iu, /ไม่มีฝา/iu] },
  { canonical: 'WITH_CAP', family: 'CAP_STATE', patterns: [/WITH\s*CAP/iu, /(?:^|[^ไม่])มีฝา/iu] },
];

interface CardVisualEvidence {
  card: ImportedCardCandidate;
  normalizedText: string;
  scoreText: string;
  numbers: number[];
  sku: Sku;
  master: Sku | null;
  signature: VisualProductSignature;
  explicitVariants: Map<string, string>;
}

interface PairEvidence {
  left: number;
  right: number;
  score: number;
  textSimilarity: number;
  numberSimilarity: number;
  prefixSimilarity: number;
  colorSimilarity: number;
  productHashSimilarity: number;
  titleHashSimilarity: number;
  edgeSimilarity: number;
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

function scoreNormalizedText(value: unknown): string {
  return normalizeProductOcrText(value)
    .toLocaleLowerCase('th-TH')
    .replace(/([0-9])\s*(?:v?a|ua|va|มล\.?|ml\.?)\b/giu, '$1 ml ')
    .replace(/[^0-9a-zก-๙]+/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function numbers(value: string): number[] {
  return [...value.matchAll(/\d{1,4}/gu)]
    .map(match => Number(match[0]))
    .filter(value => Number.isInteger(value) && value > 0 && value < 5_000);
}

function lcsRatio(left: string, right: string): number {
  if (!left || !right) return 0;
  const previous = new Uint16Array(right.length + 1);
  const current = new Uint16Array(right.length + 1);
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    current.fill(0);
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      current[rightIndex + 1] = left[leftIndex] === right[rightIndex]
        ? previous[rightIndex] + 1
        : Math.max(previous[rightIndex + 1], current[rightIndex]);
    }
    previous.set(current);
  }
  return 2 * previous[right.length] / (left.length + right.length);
}

function explicitVariants(value: string): Map<string, string> {
  const output = new Map<string, string>();
  for (const rule of EXPLICIT_VARIANTS) {
    if (output.has(rule.family)) continue;
    if (rule.patterns.some(pattern => pattern.test(value))) output.set(rule.family, rule.canonical);
  }
  return output;
}

function explicitVariantConflict(left: CardVisualEvidence, right: CardVisualEvidence): boolean {
  for (const [family, value] of left.explicitVariants) {
    const other = right.explicitVariants.get(family);
    if (other && other !== value) return true;
  }
  return false;
}

function strongIdentityConflict(left: CardVisualEvidence, right: CardVisualEvidence): boolean {
  if (left.master && right.master) return left.master.id !== right.master.id;
  const a = (left.master || left.sku).identity;
  const b = (right.master || right.sku).identity;
  // OCR brand/type text varies heavily between classes. They contribute to the similarity score,
  // but cannot become hard blockers unless Product Master already identified both cards above.
  if (a.sizeValue > 0 && b.sizeValue > 0 && a.sizeUnit && b.sizeUnit) {
    if (a.sizeUnit !== b.sizeUnit) return true;
    if (Math.abs(a.sizeValue - b.sizeValue) > 0.05) return true;
  }
  if (a.packQuantity > 1 && b.packQuantity > 1 && a.packQuantity !== b.packQuantity) return true;
  return false;
}

function evidenceFor(card: ImportedCardCandidate, existingSkus: Sku[], signature: VisualProductSignature): CardVisualEvidence {
  const normalizedText = normalizeProductOcrText(card.productText || '');
  const sku = createSkuCandidate(normalizedText);
  const match = matchProductMasterByText(sku, normalizedText, existingSkus);
  return {
    card,
    normalizedText,
    scoreText: scoreNormalizedText(card.productText || ''),
    numbers: numbers(scoreNormalizedText(card.productText || '')),
    sku,
    master: match.status === 'matched' && match.sku ? match.sku : null,
    signature,
    explicitVariants: explicitVariants(normalizedText),
  };
}

function hashBytes(value: string): number[] {
  if (!value || value.length % 2) return [];
  const output: number[] = [];
  for (let index = 0; index < value.length; index += 2) {
    const parsed = Number.parseInt(value.slice(index, index + 2), 16);
    if (!Number.isFinite(parsed)) return [];
    output.push(parsed);
  }
  return output;
}

function hashSimilarity(left: string, right: string): number {
  const a = hashBytes(left);
  const b = hashBytes(right);
  if (!a.length || a.length !== b.length) return 0;
  let different = 0;
  for (let index = 0; index < a.length; index += 1) if ((a[index] > 127) !== (b[index] > 127)) different += 1;
  return 1 - different / a.length;
}

function histogramCorrelation(left: number[], right: number[]): number {
  if (!left.length || left.length !== right.length) return 0;
  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length;
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length;
  let numerator = 0;
  let leftLength = 0;
  let rightLength = 0;
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index] - leftMean;
    const b = right[index] - rightMean;
    numerator += a * b;
    leftLength += a * a;
    rightLength += b * b;
  }
  const correlation = numerator / Math.max(Number.EPSILON, Math.sqrt(leftLength * rightLength));
  return Math.max(0, Math.min(1, (correlation + 1) / 2));
}

function edgeSimilarity(left: number[], right: number[]): number {
  if (!left.length || left.length !== right.length) return 0;
  let squared = 0;
  for (let index = 0; index < left.length; index += 1) squared += (left[index] - right[index]) ** 2;
  return 1 - Math.min(1, Math.sqrt(squared) / 1.5);
}

function numberAgreement(left: number[], right: number[]): { similarity: number; conflict: boolean } {
  if (!left.length || !right.length) return { similarity: 0.5, conflict: false };
  const a = new Set(left);
  const b = new Set(right);
  const shared = [...a].filter(value => b.has(value));
  const union = new Set([...a, ...b]);
  return { similarity: shared.length / Math.max(1, union.size), conflict: shared.length === 0 };
}

function pairEvidence(left: CardVisualEvidence, right: CardVisualEvidence): PairEvidence | null {
  if (!left.card.classId || !right.card.classId || left.card.classId === right.card.classId) return null;
  if (!left.scoreText || !right.scoreText) return null;
  if (!left.signature.title || !left.signature.product || !right.signature.title || !right.signature.product) return null;
  if (explicitVariantConflict(left, right) || strongIdentityConflict(left, right)) return null;
  const textSimilarity = lcsRatio(left.scoreText, right.scoreText);
  const number = numberAgreement(left.numbers, right.numbers);
  const leftPrefix = left.scoreText.split(' ').slice(0, 2).join(' ');
  const rightPrefix = right.scoreText.split(' ').slice(0, 2).join(' ');
  const prefixSimilarity = lcsRatio(leftPrefix, rightPrefix);
  const colorSimilarity = histogramCorrelation(left.signature.colorHistogram, right.signature.colorHistogram);
  const productHashSimilarity = hashSimilarity(left.signature.product, right.signature.product);
  const titleHashSimilarity = hashSimilarity(left.signature.title, right.signature.title);
  const edges = edgeSimilarity(left.signature.edgeHistogram, right.signature.edgeHistogram);
  const score = 0.55 * textSimilarity
    + 0.15 * number.similarity
    + 0.10 * prefixSimilarity
    + 0.10 * colorSimilarity
    + 0.05 * productHashSimilarity
    + 0.03 * titleHashSimilarity
    + 0.02 * edges
    - (number.conflict ? 0.30 : 0);
  return {
    left: -1,
    right: -1,
    score,
    textSimilarity,
    numberSimilarity: number.similarity,
    prefixSimilarity,
    colorSimilarity,
    productHashSimilarity,
    titleHashSimilarity,
    edgeSimilarity: edges,
  };
}

function pairKey(left: number, right: number): string {
  return left < right ? `${left}:${right}` : `${right}:${left}`;
}

/** Maximum-weight one-to-one assignment with one row-specific dummy column at the acceptance threshold. */
function maximumAssignment(weights: number[][]): number[] {
  const rows = weights.length;
  if (!rows) return [];
  const realColumns = weights[0]?.length || 0;
  const columns = realColumns + rows;
  const padded = weights.map((row, rowIndex) => Array.from({ length: columns }, (_, column) => {
    if (column < realColumns) return row[column];
    return column === realColumns + rowIndex ? MIN_PAIR_SCORE : -10;
  }));
  const u = Array(rows + 1).fill(0);
  const v = Array(columns + 1).fill(0);
  const p = Array(columns + 1).fill(0);
  const way = Array(columns + 1).fill(0);
  for (let row = 1; row <= rows; row += 1) {
    p[0] = row;
    let column0 = 0;
    const minimum = Array(columns + 1).fill(Number.POSITIVE_INFINITY);
    const used = Array(columns + 1).fill(false);
    do {
      used[column0] = true;
      const row0 = p[column0];
      let delta = Number.POSITIVE_INFINITY;
      let column1 = 0;
      for (let column = 1; column <= columns; column += 1) {
        if (used[column]) continue;
        const cost = 1 - padded[row0 - 1][column - 1] - u[row0] - v[column];
        if (cost < minimum[column]) { minimum[column] = cost; way[column] = column0; }
        if (minimum[column] < delta) { delta = minimum[column]; column1 = column; }
      }
      for (let column = 0; column <= columns; column += 1) {
        if (used[column]) { u[p[column]] += delta; v[column] -= delta; }
        else minimum[column] -= delta;
      }
      column0 = column1;
    } while (p[column0] !== 0);
    do {
      const column1 = way[column0];
      p[column0] = p[column1];
      column0 = column1;
    } while (column0 !== 0);
  }
  const assignment = Array(rows).fill(-1);
  for (let column = 1; column <= columns; column += 1) if (p[column] > 0) assignment[p[column] - 1] = column - 1;
  return assignment;
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

function groupHasConflict(indices: number[], evidence: CardVisualEvidence[]): boolean {
  const classes = indices.map(index => evidence[index].card.classId).filter(Boolean);
  if (new Set(classes).size !== classes.length) return true;
  for (let left = 0; left < indices.length; left += 1) {
    for (let right = left + 1; right < indices.length; right += 1) {
      if (explicitVariantConflict(evidence[indices[left]], evidence[indices[right]])
        || strongIdentityConflict(evidence[indices[left]], evidence[indices[right]])) return true;
    }
  }
  return false;
}

function representative(indices: number[], evidence: CardVisualEvidence[]): CardVisualEvidence {
  const anchor = indices.map(index => evidence[index]).find(item => item.card.classId === ANCHOR_CLASS);
  if (anchor) return anchor;
  return indices.map(index => evidence[index]).sort((left, right) =>
    Number(Boolean(right.master)) - Number(Boolean(left.master))
    || left.sku.failureReasons.length - right.sku.failureReasons.length
    || right.card.confidence - left.card.confidence
    || right.normalizedText.length - left.normalizedText.length,
  )[0];
}

function clusterStats(indices: number[], pairs: Map<string, PairEvidence>): { minimumProduct: number; averageScore: number } {
  const available: PairEvidence[] = [];
  for (let left = 0; left < indices.length; left += 1) {
    for (let right = left + 1; right < indices.length; right += 1) {
      const pair = pairs.get(pairKey(indices[left], indices[right]));
      if (pair) available.push(pair);
    }
  }
  return {
    minimumProduct: available.length ? Math.min(...available.map(pair => pair.productHashSimilarity)) : 0,
    averageScore: available.length ? available.reduce((sum, pair) => sum + pair.score, 0) / available.length : 0,
  };
}

export function buildVisualProductClusters(
  cards: ImportedCardCandidate[],
  existingSkus: Sku[],
  signatures: Record<string, VisualProductSignature>,
): VisualProductClusterResult {
  const emptySignature: VisualProductSignature = { title: '', product: '', colorHistogram: [], edgeHistogram: [], quality: 0 };
  const evidence = cards.map(card => evidenceFor(card, existingSkus, signatures[card.cardId] || emptySignature));
  const pairs = new Map<string, PairEvidence>();
  let comparedPairs = 0;
  let rejectedConflicts = 0;
  for (let left = 0; left < evidence.length; left += 1) {
    for (let right = left + 1; right < evidence.length; right += 1) {
      if (!evidence[left].card.classId || evidence[left].card.classId === evidence[right].card.classId) continue;
      comparedPairs += 1;
      if (explicitVariantConflict(evidence[left], evidence[right]) || strongIdentityConflict(evidence[left], evidence[right])) {
        rejectedConflicts += 1;
        continue;
      }
      const pair = pairEvidence(evidence[left], evidence[right]);
      if (pair) pairs.set(pairKey(left, right), { ...pair, left, right });
    }
  }

  const anchorIndices = evidence.map((item, index) => ({ item, index }))
    .filter(entry => entry.item.card.classId === ANCHOR_CLASS)
    .map(entry => entry.index);
  const fallbackAnchorClass = anchorIndices.length
    ? ANCHOR_CLASS
    : [...new Set(evidence.map(item => item.card.classId).filter((value): value is string => Boolean(value)))]
      .sort((left, right) => evidence.filter(item => item.card.classId === right).length - evidence.filter(item => item.card.classId === left).length)[0];
  const anchors = anchorIndices.length
    ? anchorIndices
    : evidence.map((item, index) => ({ item, index })).filter(entry => entry.item.card.classId === fallbackAnchorClass).map(entry => entry.index);
  const groups = anchors.map(index => [index]);
  const assigned = new Set(anchors);
  const assignmentOrder = fallbackAnchorClass === ANCHOR_CLASS
    ? CLASS_ORDER
    : [...new Set(evidence.map(item => item.card.classId).filter((value): value is string => Boolean(value)))].filter(value => value !== fallbackAnchorClass);

  for (const classId of assignmentOrder) {
    const rows = evidence.map((item, index) => ({ item, index }))
      .filter(entry => entry.item.card.classId === classId && !assigned.has(entry.index))
      .map(entry => entry.index);
    if (!rows.length || !groups.length) continue;
    const weights = rows.map(row => groups.map(group => {
      const pairScores = group.map(member => pairs.get(pairKey(row, member))?.score || -10);
      return Math.max(...pairScores);
    }));
    const assignment = maximumAssignment(weights);
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const column = assignment[rowIndex];
      if (column < 0 || column >= groups.length) continue;
      const score = weights[rowIndex][column];
      if (score < MIN_PAIR_SCORE) continue;
      const candidate = [...groups[column], rows[rowIndex]];
      if (groupHasConflict(candidate, evidence)) continue;
      groups[column] = candidate;
      assigned.add(rows[rowIndex]);
    }
  }

  const residual = evidence.map((_, index) => index).filter(index => !assigned.has(index));
  const residualPosition = new Map(residual.map((index, position) => [index, position]));
  const union = new UnionFind(residual.length);
  const edges = [...pairs.values()]
    .filter(pair => pair.score >= MIN_PAIR_SCORE && residualPosition.has(pair.left) && residualPosition.has(pair.right))
    .sort((left, right) => right.score - left.score);
  for (const edge of edges) {
    const leftPosition = residualPosition.get(edge.left) as number;
    const rightPosition = residualPosition.get(edge.right) as number;
    const leftRoot = union.find(leftPosition);
    const rightRoot = union.find(rightPosition);
    if (leftRoot === rightRoot) continue;
    const candidate = residual.filter((_, position) => {
      const root = union.find(position);
      return root === leftRoot || root === rightRoot;
    });
    if (groupHasConflict(candidate, evidence)) continue;
    union.union(leftRoot, rightRoot);
  }
  const residualGroups = new Map<number, number[]>();
  residual.forEach((cardIndex, position) => {
    const root = union.find(position);
    const members = residualGroups.get(root) || [];
    members.push(cardIndex);
    residualGroups.set(root, members);
  });

  const finalGroups = [
    ...groups.filter(group => group.length >= 2),
    ...[...residualGroups.values()].filter(group => group.length >= 2),
  ];
  const clusters: VisualProductCluster[] = [];
  for (const indices of finalGroups) {
    if (groupHasConflict(indices, evidence)) continue;
    const selected = representative(indices, evidence);
    const master = selected.master || indices.map(index => evidence[index].master).find(Boolean) || null;
    const representativeText = master?.canonicalName || selected.normalizedText;
    if (!representativeText) continue;
    const stats = clusterStats(indices, pairs);
    clusters.push({
      id: `visual:${indices.map(index => evidence[index].card.cardId).sort().join('|')}`,
      cardIds: indices.map(index => evidence[index].card.cardId),
      classIds: indices.map(index => evidence[index].card.classId as string),
      representativeCardId: selected.card.cardId,
      representativeText,
      masterSkuId: master?.id || null,
      minimumProductSimilarity: Number(stats.minimumProduct.toFixed(4)),
      averageCombinedSimilarity: Number(stats.averageScore.toFixed(4)),
    });
  }
  const assignments = new Map<string, VisualProductCluster>();
  for (const cluster of clusters) for (const cardId of cluster.cardIds) assignments.set(cardId, cluster);
  return {
    clusters,
    assignments,
    comparedPairs,
    eligiblePairs: [...pairs.values()].filter(pair => pair.score >= MIN_PAIR_SCORE).length,
    rejectedConflicts,
  };
}
