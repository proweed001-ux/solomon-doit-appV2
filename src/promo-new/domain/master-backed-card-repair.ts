import type { ImportedCardCandidate } from '../import/pdf-importer';
import { buildProductScopes, type ProductScopeCandidate } from './scope-matcher';
import { createSkuCandidate, normalizeProductText } from './sku-identity';
import type { PromotionFamily, Sku } from './types';

const clean = (value: unknown): string => normalizeProductText(value).replace(/\s+/g, ' ').trim();
const compact = (value: unknown): string => clean(value).toUpperCase().replace(/[^A-Z0-9ก-๙&]+/gu, '');

interface PreparedMaster {
  original: Sku;
  parsed: Sku;
}

function prepareMaster(master: Sku): PreparedMaster {
  const evidence = [master.canonicalName, ...master.evidence].filter(Boolean).join(' ');
  return { original: master, parsed: createSkuCandidate(evidence) };
}

function sameNumber(left: number, right: number): boolean {
  return Math.abs(left - right) <= 0.001;
}

function variantCompatible(scope: ProductScopeCandidate, sku: Sku): boolean {
  const scopeVariant = compact(scope.variant || '');
  const skuVariant = compact(sku.identity.variant || '');
  if (!scopeVariant) return !skuVariant;
  return Boolean(skuVariant && (skuVariant.includes(scopeVariant) || scopeVariant.includes(skuVariant)));
}

function masterFitsScope(master: PreparedMaster, scope: ProductScopeCandidate): boolean {
  const identity = master.parsed.identity;
  if (master.original.status !== 'active') return false;
  if (identity.brand !== scope.brand || identity.productType !== scope.productType) return false;
  if (Math.max(1, identity.packQuantity || 1) !== Math.max(1, scope.packQuantity || 1)) return false;
  if (!variantCompatible(scope, master.parsed)) return false;
  if (scope.minimumSize == null || scope.maximumSize == null || !scope.sizeUnit) {
    return !(identity.sizeValue > 0) || !identity.sizeUnit;
  }
  return identity.sizeValue >= scope.minimumSize
    && identity.sizeValue <= scope.maximumSize
    && identity.sizeUnit === scope.sizeUnit;
}

function scopeMatchesObservedSize(scope: ProductScopeCandidate, observed: Sku): boolean {
  const value = observed.identity.sizeValue;
  const unit = observed.identity.sizeUnit;
  if (!(value > 0) || !unit) return true;
  if (scope.minimumSize == null || scope.maximumSize == null || !scope.sizeUnit) return true;
  return unit === scope.sizeUnit && value >= scope.minimumSize && value <= scope.maximumSize;
}

function relevantScopes(card: ImportedCardCandidate, observed: Sku, scopes: ProductScopeCandidate[]): ProductScopeCandidate[] {
  if (!card.classId || !observed.identity.brand || !observed.identity.productType) return [];
  return scopes.filter(scope => (
    scope.classIds.includes(card.classId as string)
    && scope.brand === observed.identity.brand
    && scope.productType === observed.identity.productType
    && variantCompatible(scope, observed)
  ));
}

function uniqueMasterForObserved(
  observed: Sku,
  scopes: ProductScopeCandidate[],
  preparedMasters: PreparedMaster[],
): Sku | null {
  const fittingScopes = scopes.filter(scope => scopeMatchesObservedSize(scope, observed));
  if (!fittingScopes.length) return null;
  const candidates = preparedMasters.filter(master => {
    const identity = master.parsed.identity;
    return fittingScopes.some(scope => masterFitsScope(master, scope))
      && (!(observed.identity.sizeValue > 0)
        || (sameNumber(identity.sizeValue, observed.identity.sizeValue)
          && identity.sizeUnit === observed.identity.sizeUnit));
  });
  const unique = [...new Map(candidates.map(master => [master.original.id, master.original])).values()];
  return unique.length === 1 ? unique[0] : null;
}

function safeObservedText(observed: Sku): string {
  return [observed.identity.brand, observed.identity.productType, observed.identity.variant]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface MasterBackedCardRepairResult {
  cards: ImportedCardCandidate[];
  repaired: number;
  rejectedConflictingSizes: number;
  warnings: string[];
}

export function repairCardsWithMasterBackedScopes(
  cards: ImportedCardCandidate[],
  families: PromotionFamily[],
  existingSkus: Sku[],
): MasterBackedCardRepairResult {
  const scopes = buildProductScopes(families);
  const preparedMasters = existingSkus.map(prepareMaster);
  let repaired = 0;
  let rejectedConflictingSizes = 0;
  const warnings: string[] = [];

  const output = cards.map(card => {
    const sourceText = clean(card.productText || card.rawText);
    const observed = createSkuCandidate(sourceText);
    const candidates = relevantScopes(card, observed, scopes);
    if (!candidates.length) return card;

    const matchingScopes = candidates.filter(scope => scopeMatchesObservedSize(scope, observed));
    if (observed.identity.sizeValue > 0 && observed.identity.sizeUnit && !matchingScopes.length) {
      rejectedConflictingSizes += 1;
      warnings.push(`card:${card.cardId}:ocr_size_conflicts_workbook_scope`);
      return {
        ...card,
        productText: safeObservedText(observed),
        failureReasons: [...new Set([...card.failureReasons, 'ocr_size_conflicts_workbook_scope'])],
      };
    }

    const master = uniqueMasterForObserved(observed, candidates, preparedMasters);
    if (!master) return card;
    repaired += 1;
    warnings.push(`card:${card.cardId}:master_backed_scope_repair:${master.id}`);
    return {
      ...card,
      productText: master.canonicalName,
      rawText: clean(`${card.rawText} ${master.canonicalName}`),
      failureReasons: card.failureReasons.filter(reason => reason !== 'product_text_missing'),
    };
  });

  return {
    cards: output,
    repaired,
    rejectedConflictingSizes,
    warnings: [...new Set(warnings)],
  };
}
