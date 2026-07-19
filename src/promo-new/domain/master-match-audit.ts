import type { GroupingResult } from './grouping';
import { matchProductMasterByText } from './master-text-matcher';
import { normalizeProductOcrText } from './product-text-normalizer';
import { createSkuCandidate } from './sku-identity';
import { resolveScopesSafely } from './scope-safety';
import type { ScopeResolution } from './scope-matcher';
import type { MasterMatchMethod, PromotionFamily, Sku } from './types';
import type { ImportedCardCandidate } from '../import/pdf-importer';

const AUDIT_CHUNK_SIZE = 12;

interface AuditEvidence {
  score: number | null;
  margin: number | null;
  method: MasterMatchMethod;
}

export interface MasterMatchAuditProgress {
  processed: number;
  total: number;
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

function evidenceForGroup(
  group: GroupingResult['groups'][number],
  sourceById: Map<string, ImportedCardCandidate>,
  existingSkus: Sku[],
  resolutions: Map<string, ScopeResolution>,
): AuditEvidence | null {
  if (!String(group.sku.id).startsWith('MASTER-')) return { score: null, margin: null, method: 'new_sku' };
  const sources = group.cardIds.flatMap(cardId => {
    const source = sourceById.get(cardId);
    return source ? [source] : [];
  });
  return textEvidence(group.sku, sources, existingSkus)
    || scopeEvidence(group.sku, sources, existingSkus, resolutions);
}

function applyAuditEvidence(result: GroupingResult, evidenceByGroup: Map<string, AuditEvidence>): GroupingResult {
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

function auditContext(
  imported: ImportedCardCandidate[],
  promotionFamilies: PromotionFamily[],
  visualSignatures: Record<string, string>,
  scopeResolutions?: Map<string, ScopeResolution>,
): { sourceById: Map<string, ImportedCardCandidate>; resolutions: Map<string, ScopeResolution> } {
  return {
    sourceById: new Map(imported.map(card => [card.cardId, card])),
    resolutions: scopeResolutions || resolveScopesSafely(imported, promotionFamilies, visualSignatures),
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
  const { sourceById, resolutions } = auditContext(imported, promotionFamilies, visualSignatures, scopeResolutions);
  const evidenceByGroup = new Map<string, AuditEvidence>();
  for (const group of result.groups) {
    const evidence = evidenceForGroup(group, sourceById, existingSkus, resolutions);
    if (evidence) evidenceByGroup.set(group.id, evidence);
  }
  return applyAuditEvidence(result, evidenceByGroup);
}

export async function attachMasterMatchAuditEvidenceAsync(
  result: GroupingResult,
  imported: ImportedCardCandidate[],
  existingSkus: Sku[],
  promotionFamilies: PromotionFamily[],
  visualSignatures: Record<string, string>,
  scopeResolutions?: Map<string, ScopeResolution>,
  onProgress?: (progress: MasterMatchAuditProgress) => void,
): Promise<GroupingResult> {
  const { sourceById, resolutions } = auditContext(imported, promotionFamilies, visualSignatures, scopeResolutions);
  const evidenceByGroup = new Map<string, AuditEvidence>();
  for (let index = 0; index < result.groups.length; index += 1) {
    const group = result.groups[index];
    const evidence = evidenceForGroup(group, sourceById, existingSkus, resolutions);
    if (evidence) evidenceByGroup.set(group.id, evidence);
    const processed = index + 1;
    if (processed % AUDIT_CHUNK_SIZE === 0 || processed === result.groups.length) {
      onProgress?.({ processed, total: result.groups.length });
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }
  }
  return applyAuditEvidence(result, evidenceByGroup);
}
