import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromotionFamily, PromotionTier } from './types';
import { createSkuCandidate, normalizeProductText } from './sku-identity';
import { visualSimilarity, type ProductScopeCandidate, type ScopeResolution } from './scope-matcher';

const clean = (value: unknown): string => normalizeProductText(value)
  .replace(/\u0E4D\u0E32/gu, '\u0E33')
  .replace(/[๐-๙]/g, digit => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(digit)))
  .replace(/\s+/g, ' ')
  .trim();

const numberValue = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number(value.replace(/,/g, '').replace(/O/giu, '0'));
  return Number.isFinite(parsed) ? parsed : null;
};

const uniqueNumbers = (values: Array<number | null>): number[] => [...new Set(values.filter((value): value is number => value != null))];

export interface CardMechanicEvidence {
  minQuantity: number | null;
  discountPercent: number | null;
  freeQuantity: number | null;
  bundlePrice: number | null;
}

export interface CardFingerprintEvidence {
  recommendedPrice: number | null;
  normalPrices: number[];
  averagePrices: number[];
  mechanics: CardMechanicEvidence[];
  brand: string | null;
  productType: string | null;
  sizeValue: number | null;
  sizeUnit: string | null;
  parsedFields: string[];
}

function firstMatch(text: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = numberValue(match?.[1]);
    if (value != null) return value;
  }
  return null;
}

function allMatches(text: string, patterns: RegExp[]): number[] {
  const values: Array<number | null> = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) values.push(numberValue(match[1]));
  }
  return uniqueNumbers(values);
}

function normalizeUnit(value: string | null | undefined): string | null {
  if (!value) return null;
  const source = clean(value).toUpperCase().replace(/[.\s]/g, '');
  if (['ML', 'VA', 'มล', 'บล'].includes(source)) return 'มล.';
  if (['G', 'GM', 'NSU', 'กรัม', 'กรับ'].includes(source)) return 'กรัม';
  if (['KG', 'กก'].includes(source)) return 'กก.';
  if (['L', 'LT', 'ลิตร'].includes(source)) return 'ลิตร';
  return clean(value);
}

function parseMechanics(text: string): CardMechanicEvidence[] {
  const output: CardMechanicEvidence[] = [];
  const quantityDiscount = /(?:เมื่อซื้อ|ซื้อ|ขั้นต่ำ)\s*(\d+(?:[.,]\d+)?)\s*(?:ชิ้น|ขวด|แพ็ค|แพค|กล่อง|ด้าม|ถุง|ซอง|ก้อน|กระปุก)?[^%\d]{0,34}(?:ลด|ส่วนลด)\s*(\d+(?:[.,]\d+)?)\s*%/giu;
  for (const match of text.matchAll(quantityDiscount)) {
    output.push({
      minQuantity: numberValue(match[1]),
      discountPercent: numberValue(match[2]),
      freeQuantity: null,
      bundlePrice: null,
    });
  }

  const quantityFree = /(?:เมื่อซื้อ|ซื้อ|ขั้นต่ำ)\s*(\d+(?:[.,]\d+)?)\s*(?:ชิ้น|ขวด|แพ็ค|แพค|กล่อง|ด้าม|ถุง|ซอง|ก้อน|กระปุก)?[^\d]{0,34}(?:แถมฟรี|แถม|ฟรี)\s*(\d+(?:[.,]\d+)?)/giu;
  for (const match of text.matchAll(quantityFree)) {
    output.push({
      minQuantity: numberValue(match[1]),
      discountPercent: null,
      freeQuantity: numberValue(match[2]),
      bundlePrice: null,
    });
  }

  const quantityBundle = /(?:เมื่อซื้อ|ซื้อ|ขั้นต่ำ)\s*(\d+(?:[.,]\d+)?)\s*(?:ชิ้น|ขวด|แพ็ค|แพค|กล่อง|ด้าม|ถุง|ซอง|ก้อน|กระปุก)?[^\d]{0,34}(?:ราคา|เพียง)\s*(\d+(?:[.,]\d+)?)\s*บาท/giu;
  for (const match of text.matchAll(quantityBundle)) {
    output.push({
      minQuantity: numberValue(match[1]),
      discountPercent: null,
      freeQuantity: null,
      bundlePrice: numberValue(match[2]),
    });
  }

  if (!output.length) {
    const quantity = firstMatch(text, [/(?:เมื่อซื้อ|ซื้อ|ขั้นต่ำ)\s*(\d+(?:[.,]\d+)?)/iu]);
    const discount = firstMatch(text, [/(?:ลด|ส่วนลด)\s*(\d+(?:[.,]\d+)?)\s*%/iu]);
    const free = firstMatch(text, [/(?:แถมฟรี|แถม|ฟรี)\s*(\d+(?:[.,]\d+)?)/iu]);
    if (quantity != null || discount != null || free != null) {
      output.push({ minQuantity: quantity, discountPercent: discount, freeQuantity: free, bundlePrice: null });
    }
  }

  return output.filter(item => Object.values(item).some(value => value != null));
}

export function parseCardFingerprintEvidence(card: ImportedCardCandidate): CardFingerprintEvidence {
  const text = clean(`${card.rawText} ${card.productText}`);
  const sku = createSkuCandidate(card.productText || card.rawText);
  const recommendedPrice = firstMatch(text, [
    /ราคา(?:แนะนำ)?(?:ขาย)?ปลีก[^0-9]{0,36}(\d+(?:[.,]\d+)?)/iu,
    /RECOMMENDED\s*RETAIL[^0-9]{0,24}(\d+(?:[.,]\d+)?)/iu,
    /RETAIL\s*PRICE[^0-9]{0,24}(\d+(?:[.,]\d+)?)/iu,
  ]);
  const normalPrices = allMatches(text, [
    /(?:ปกติ|ราคาปกติ)[^0-9]{0,18}(\d+(?:[.,]\d+)?)/giu,
    /NORMAL\s*PRICE[^0-9]{0,18}(\d+(?:[.,]\d+)?)/giu,
  ]);
  const averagePrices = allMatches(text, [
    /(?:เฉลี่ย|ราคาเฉลี่ย)[^0-9]{0,18}(\d+(?:[.,]\d+)?)/giu,
    /AVERAGE[^0-9]{0,18}(\d+(?:[.,]\d+)?)/giu,
  ]);
  const mechanics = parseMechanics(text);
  const parsedFields = [
    ...(recommendedPrice != null ? ['recommended_price'] : []),
    ...(normalPrices.length ? ['normal_price'] : []),
    ...(averagePrices.length ? ['average_price'] : []),
    ...(mechanics.some(item => item.minQuantity != null) ? ['purchase_quantity'] : []),
    ...(mechanics.some(item => item.discountPercent != null) ? ['discount_percent'] : []),
    ...(mechanics.some(item => item.freeQuantity != null) ? ['free_quantity'] : []),
    ...(mechanics.some(item => item.bundlePrice != null) ? ['bundle_price'] : []),
  ];
  return {
    recommendedPrice,
    normalPrices,
    averagePrices,
    mechanics,
    brand: sku.identity.brand || null,
    productType: sku.identity.productType || null,
    sizeValue: sku.identity.sizeValue > 0 ? sku.identity.sizeValue : null,
    sizeUnit: normalizeUnit(sku.identity.sizeUnit),
    parsedFields,
  };
}

function near(left: number | null, right: number | null, tolerance = 0.05): boolean {
  return left != null && right != null && Math.abs(left - right) <= tolerance;
}

function mechanicTierScore(mechanic: CardMechanicEvidence, tier: PromotionTier): { score: number; fields: number; conflict: boolean } {
  let score = 0;
  let fields = 0;
  let conflict = false;
  if (mechanic.minQuantity != null) {
    fields += 1;
    if (near(mechanic.minQuantity, tier.minQuantity, 0.01)) score += 14;
    else conflict = true;
  }
  if (mechanic.discountPercent != null) {
    fields += 1;
    if (tier.discountPercent != null && near(mechanic.discountPercent, tier.discountPercent, 0.05)) score += 16;
    else conflict = true;
  }
  if (mechanic.freeQuantity != null) {
    fields += 1;
    if (near(mechanic.freeQuantity, tier.freeQuantity, 0.01)) score += 16;
    else conflict = true;
  }
  if (mechanic.bundlePrice != null) {
    fields += 1;
    if (tier.bundlePrice && near(mechanic.bundlePrice, tier.bundlePrice.amount, 0.05)) score += 16;
    else conflict = true;
  }
  return { score, fields, conflict };
}

function familyMechanicScore(evidence: CardFingerprintEvidence, family: PromotionFamily, classId: string): { score: number; fields: number; conflict: boolean } {
  const tiers = family.tiersByClass[classId] || [];
  if (!tiers.length || !evidence.mechanics.length) return { score: 0, fields: 0, conflict: false };
  let best = { score: -1, fields: 0, conflict: true };
  for (const mechanic of evidence.mechanics) {
    for (const tier of tiers) {
      const compared = mechanicTierScore(mechanic, tier);
      if (compared.score > best.score || (compared.score === best.score && compared.fields > best.fields)) best = compared;
    }
  }
  return best.score < 0 ? { score: 0, fields: 0, conflict: false } : best;
}

function scopeIdentityConflict(evidence: CardFingerprintEvidence, scope: ProductScopeCandidate): boolean {
  if (evidence.brand && evidence.brand !== scope.brand) return true;
  if (evidence.productType && evidence.productType !== scope.productType) {
    const broadHair = scope.productType === 'แชมพู/ครีมนวด' && ['แชมพู', 'ครีมนวด'].includes(evidence.productType);
    const packHair = scope.productType.startsWith('แพ็ค ') && ['แชมพู', 'ครีมนวด'].includes(evidence.productType);
    if (!broadHair && !packHair) return true;
  }
  if (evidence.sizeValue != null && evidence.sizeUnit && scope.minimumSize != null && scope.maximumSize != null && scope.sizeUnit) {
    if (evidence.sizeUnit !== scope.sizeUnit || evidence.sizeValue < scope.minimumSize || evidence.sizeValue > scope.maximumSize) return true;
  }
  return false;
}

interface FingerprintCluster {
  cards: ImportedCardCandidate[];
  evidence: Map<string, CardFingerprintEvidence>;
  averageSimilarity: number;
}

class UnionFind {
  private readonly parent: number[];
  constructor(size: number) { this.parent = Array.from({ length: size }, (_, index) => index); }
  find(index: number): number {
    if (this.parent[index] !== index) this.parent[index] = this.find(this.parent[index]);
    return this.parent[index];
  }
  union(left: number, right: number): void {
    const a = this.find(left); const b = this.find(right);
    if (a !== b) this.parent[b] = a;
  }
}

function buildClusters(cards: ImportedCardCandidate[], visualSignatures: Record<string, string>): FingerprintCluster[] {
  const evidence = new Map(cards.map(card => [card.cardId, parseCardFingerprintEvidence(card)]));
  const union = new UnionFind(cards.length);
  for (let left = 0; left < cards.length; left += 1) {
    const a = cards[left];
    const aEvidence = evidence.get(a.cardId)!;
    if (!a.classId || aEvidence.recommendedPrice == null) continue;
    for (let right = left + 1; right < cards.length; right += 1) {
      const b = cards[right];
      const bEvidence = evidence.get(b.cardId)!;
      if (!b.classId || a.classId === b.classId || !near(aEvidence.recommendedPrice, bEvidence.recommendedPrice)) continue;
      if (aEvidence.brand && bEvidence.brand && aEvidence.brand !== bEvidence.brand) continue;
      if (aEvidence.productType && bEvidence.productType && aEvidence.productType !== bEvidence.productType) continue;
      if (aEvidence.sizeValue != null && bEvidence.sizeValue != null && (aEvidence.sizeUnit !== bEvidence.sizeUnit || !near(aEvidence.sizeValue, bEvidence.sizeValue, 0.01))) continue;
      const similarity = visualSimilarity(visualSignatures[a.cardId], visualSignatures[b.cardId]);
      if (similarity >= 0.94) union.union(left, right);
    }
  }

  const components = new Map<number, ImportedCardCandidate[]>();
  cards.forEach((card, index) => {
    const root = union.find(index);
    const members = components.get(root) || [];
    members.push(card);
    components.set(root, members);
  });

  return [...components.values()].flatMap(members => {
    if (members.length < 2) return [];
    const classes = members.map(card => card.classId).filter(Boolean);
    if (new Set(classes).size !== classes.length) return [];
    const similarities: number[] = [];
    for (let left = 0; left < members.length; left += 1) {
      for (let right = left + 1; right < members.length; right += 1) {
        similarities.push(visualSimilarity(visualSignatures[members[left].cardId], visualSignatures[members[right].cardId]));
      }
    }
    const minimum = Math.min(...similarities);
    if (minimum < 0.89) return [];
    return [{ cards: members, evidence, averageSimilarity: similarities.reduce((sum, value) => sum + value, 0) / similarities.length }];
  });
}

interface ScopeRank {
  scope: ProductScopeCandidate;
  score: number;
  mechanicFields: number;
  mechanicCards: number;
  structuredAnchors: number;
}

function rankScopeForCluster(
  cluster: FingerprintCluster,
  scope: ProductScopeCandidate,
  family: PromotionFamily,
  current: Map<string, ScopeResolution>,
): ScopeRank | null {
  const classIds = cluster.cards.map(card => card.classId as string);
  if (classIds.some(classId => !scope.classIds.includes(classId) || !family.tiersByClass[classId]?.length)) return null;
  const structuredScopes = cluster.cards
    .map(card => current.get(card.cardId))
    .filter(resolution => resolution?.method === 'structured_scope' && resolution.scope)
    .map(resolution => resolution!.scope!);
  if (structuredScopes.some(anchor => anchor.key !== scope.key)) return null;

  let score = 20 + Math.round(cluster.averageSimilarity * 20);
  let mechanicFields = 0;
  let mechanicCards = 0;
  let structuredAnchors = 0;
  for (const card of cluster.cards) {
    const cardEvidence = cluster.evidence.get(card.cardId)!;
    if (scopeIdentityConflict(cardEvidence, scope)) return null;
    if (cardEvidence.brand === scope.brand) score += 8;
    if (cardEvidence.productType === scope.productType) score += 5;
    if (cardEvidence.sizeValue != null && scope.minimumSize != null && scope.maximumSize != null
      && cardEvidence.sizeValue >= scope.minimumSize && cardEvidence.sizeValue <= scope.maximumSize) score += 6;
    const mechanic = familyMechanicScore(cardEvidence, family, card.classId as string);
    if (mechanic.conflict && mechanic.score === 0 && mechanic.fields >= 2) return null;
    if (mechanic.fields > 0) {
      mechanicFields += mechanic.fields;
      mechanicCards += 1;
      score += mechanic.score;
    }
    if (current.get(card.cardId)?.method === 'structured_scope') {
      structuredAnchors += 1;
      score += 80;
    }
  }
  return { scope, score, mechanicFields, mechanicCards, structuredAnchors };
}

export function applyCardFingerprintClusters(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
  scopes: ProductScopeCandidate[],
  current: Map<string, ScopeResolution>,
  visualSignatures: Record<string, string>,
): Map<string, ScopeResolution> {
  const output = new Map(current);
  const familyById = new Map(families.map(family => [family.id, family]));
  for (const cluster of buildClusters(cards, visualSignatures)) {
    if (cluster.cards.every(card => output.get(card.cardId)?.scope)) continue;
    const ranked = scopes.flatMap(scope => {
      const family = familyById.get(scope.familyId);
      if (!family || family.failureReasons.length) return [];
      const rank = rankScopeForCluster(cluster, scope, family, output);
      return rank ? [rank] : [];
    }).sort((left, right) => right.score - left.score || right.structuredAnchors - left.structuredAnchors || left.scope.name.localeCompare(right.scope.name, 'th'));
    const best = ranked[0];
    const second = ranked[1];
    if (!best) continue;
    const margin = best.score - (second?.score || 0);
    const hasStrongAnchor = best.structuredAnchors > 0;
    const hasMechanicConsensus = best.mechanicCards >= Math.min(2, cluster.cards.length) && best.mechanicFields >= Math.min(4, cluster.cards.length * 2);
    if ((!hasStrongAnchor && !hasMechanicConsensus) || best.score < 70 || (second && margin < 14)) continue;
    for (const card of cluster.cards) {
      const existing = output.get(card.cardId);
      if (existing?.scope) continue;
      output.set(card.cardId, {
        scope: best.scope,
        score: Number(best.score.toFixed(1)),
        margin: Number(margin.toFixed(1)),
        method: 'visual_consensus',
      });
    }
  }
  return output;
}
