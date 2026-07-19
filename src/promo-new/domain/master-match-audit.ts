import type { GroupingResult } from './grouping';
import { matchProductMasterByText } from './master-text-matcher';
import { normalizeProductOcrText } from './product-text-normalizer';
import { createSkuCandidate } from './sku-identity';
import { resolveScopesSafely } from './scope-safety';
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
  sources: ImportedCardCandidate[],
  families: PromotionFamily[],
  visualSignatures: Record<string, string>,
): AuditEvidence | null {
  const resolutions = resolveScopesSafely(sources, families, visualSignatures);
  const candidates = sources.flatMap(source => {
    const resolution = resolutions.get(source.cardId);
    return resolution?.scope ? [resolution] : [];
  }).sort((left, right) => right.score - left.score || right.margin - left.margin);
  if (!candidates.length) return null;
  const best = candidates[0];
  return {
    score: bounded(best.score),
    margin: bounded(best.margin),
    method: best.method === 'visual_consensus' ? 'visual_consensus' : 'structured_scope',
  };
}

export function attachMasterMatchAuditEvidence(
  result: GroupingResult,
  imported: ImportedCardCandidate[],
  existingSkus: Sku[],
  promotionFamilies: PromotionFamily[],
  visualSignatures: Record<string, string>,
): GroupingResult {
  const sourceById = new Map(imported.map(card => [card.cardId, card]));
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
      || scopeEvidence(sources, promotionFamilies, visualSignatures);
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
