import type { GroupingResult } from './grouping';
import { matchProductMasterByText } from './master-text-matcher';
import { normalizeProductOcrText } from './product-text-normalizer';
import { createSkuCandidate } from './sku-identity';
import { resolveScopesSafely } from './scope-safety';
import type { ScopeResolution } from './scope-matcher';
import type { MasterMatchMethod, PromotionFamily, Sku } from './types';
import type { ImportedCardCandidate } from '../import/pdf-importer';

interface AuditEvidence {
  score: number | null;
  margin: number | null;
  method: MasterMatchMethod;
}

function bounded(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(3))));
}

function sourceText(card: ImportedCardCandidate): string {
  return normalizeProductOcrText(card.productText || card.rawText);
}

function textEvidence(groupSku: Sku, sources: ImportedCardCandidate[], existingSkus: Sku[]): AuditEvidence | null {
  const matches = sources.flatMap(source => {
    const text = sourceText(source);
    const result = matchProductMasterByText(createSkuCandidate(text), text, existingSkus);
    return result.status === 'matched' && result.sku?.id === groupSku.id ? [result] : [];
  }).sort((left, right) => right.score - left.score || right.margin - left.margin);
  if (!matches.length) return null;
  return { score: bounded(matches[0].score), margin: bounded(matches[0].margin), method: 'master_text' };
}

function scopeEvidence(
  groupSku: Sku,
  sources: ImportedCardCandidate[],
  existingSkus: Sku[],
  resolutions: Map<string, ScopeResolution>,
): AuditEvidence | null {
  const candidates = sources.flatMap(source => {
    const resolution = resolutions.get(source.cardId);
    if (!resolution?.scope) return [];
    const scopeText = normalizeProductOcrText(`${resolution.scope.name} ${resolution.scope.rawText}`);
    const master = matchProductMasterByText(createSkuCandidate(scopeText), scopeText, existingSkus);
    if (master.status !== 'matched' || master.sku?.id !== groupSku.id) return [];
    return [{ resolution, master }];
  }).sort((left, right) => right.resolution.score - left.resolution.score || right.resolution.margin - left.resolution.margin);
  if (!candidates.length) return null;
  const best = candidates[0];
  return {
    score: bounded(Math.min(best.resolution.score, best.master.score)),
    margin: bounded(Math.min(best.resolution.margin, best.master.margin)),
    method: best.resolution.method === 'visual_consensus' ? 'visual_consensus' : 'structured_scope',
  };
}

export function attachMasterMatchAuditEvidence(
  result: GroupingResult,
  imported: ImportedCardCandidate[],
  existingSkus: Sku[],
  promotionFamilies: PromotionFamily[],
  visualSignatures: Record<string, string>,
  scopeResolutions?: Map<string, ScopeResolution>,
): GroupingResult {
  const sourceById = new Map(imported.map(card => [card.cardId, card]));
  const resolutions = scopeResolutions || resolveScopesSafely(imported, promotionFamilies, visualSignatures);
  const evidenceByGroup = new Map<string, AuditEvidence>();

  for (const group of result.groups) {
    if (!String(group.sku.id).startsWith('MASTER-')) {
      evidenceByGroup.set(group.id, { score: null, margin: null, method: 'new_sku' });
      continue;
    }
    const sources = group.cardIds.flatMap(cardId => {
      const source = sourceById.get(cardId);
      return source ? [source] : [];
    });
    const evidence = textEvidence(group.sku, sources, existingSkus)
      || scopeEvidence(group.sku, sources, existingSkus, resolutions);
    if (evidence) evidenceByGroup.set(group.id, evidence);
  }

  return {
    ...result,
    cards: result.cards.map(card => {
      const evidence = card.productGroupId ? evidenceByGroup.get(card.productGroupId) : null;
      return {
        ...card,
        evidence: {
          ...card.evidence,
          masterMatchScore: evidence?.score ?? null,
          masterMatchMargin: evidence?.margin ?? null,
          masterMatchMethod: evidence?.method ?? null,
        },
      };
    }),
  };
}
