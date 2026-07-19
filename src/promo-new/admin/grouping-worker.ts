/// <reference lib="webworker" />

import { groupImportedCards } from '../domain/grouping';
import { applyClassMatrixRecovery } from '../domain/class-matrix';
import { attachMasterMatchAuditEvidence } from '../domain/master-match-audit';
import { buildProductScopes } from '../domain/scope-matcher';
import { resolveScopesSafely } from '../domain/scope-safety';
import { resolveTextFirstScopesSafely } from '../domain/text-first-scope';
import type { PromotionFamily, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import type { ImportedCardCandidate } from '../import/pdf-importer';

export interface GroupingWorkerRequest {
  type: 'group';
  payload: {
    monthKey: string;
    cards: ImportedCardCandidate[];
    existingSkus: Sku[];
    storedPrices: StoredPrice[];
    promotionFamilies: PromotionFamily[];
    visualSignatures: Record<string, string>;
  };
}

export type GroupingWorkerResponse =
  | { type: 'ready' }
  | { type: 'progress'; message: string }
  | { type: 'result'; result: ReturnType<typeof groupImportedCards> }
  | { type: 'error'; error: string };

const workerScope = self as unknown as DedicatedWorkerGlobalScope;
const seconds = (startedAt: number): string => `${((performance.now() - startedAt) / 1000).toFixed(1)} วินาที`;
const progress = (message: string): void => workerScope.postMessage({ type: 'progress', message } satisfies GroupingWorkerResponse);
workerScope.postMessage({ type: 'ready' } satisfies GroupingWorkerResponse);

workerScope.onmessage = async (event: MessageEvent<GroupingWorkerRequest>) => {
  if (event.data?.type !== 'group') return;
  try {
    const totalStarted = performance.now();
    const payload = event.data.payload;
    const hasVisualEvidence = Object.values(payload.visualSignatures).some(value => typeof value === 'string' && value.length >= 64);
    progress(hasVisualEvidence
      ? 'กำลังเทียบ Product Master, ชื่อสินค้า, Class, Promotion Scope และหลักฐานภาพ'
      : 'กำลังเทียบ Product Master, ชื่อสินค้า, Class และ Promotion Scope แบบ text-first');

    const scopeStarted = performance.now();
    const initial = hasVisualEvidence
      ? resolveScopesSafely(payload.cards, payload.promotionFamilies, payload.visualSignatures)
      : await resolveTextFirstScopesSafely(payload.cards, payload.promotionFamilies, state => {
        progress(`เทียบ Scope ${state.processed}/${state.total} การ์ด · candidate ${state.candidateComparisons} · Scope ทั้งหมด ${state.scopeCount}`);
      });
    progress(`วิเคราะห์ Promotion Scope เสร็จ ${seconds(scopeStarted)} · ${initial.size}/${payload.cards.length} การ์ด`);

    const matrixStarted = performance.now();
    const scopes = hasVisualEvidence ? buildProductScopes(payload.promotionFamilies) : [];
    const matrix = hasVisualEvidence
      ? applyClassMatrixRecovery(payload.cards, scopes, initial, payload.visualSignatures)
      : { resolutions: initial, recovered: 0, ambiguous: 0 };
    const originalEvidence = new Map(payload.cards.map(card => [card.cardId, {
      productText: card.productText,
      rawText: card.rawText,
      pageClassText: card.pageClassText,
    }]));
    const hintedCards = payload.cards.map(card => {
      const resolution = matrix.resolutions.get(card.cardId) as (typeof initial extends Map<string, infer R> ? R : never) & { matrix?: boolean };
      if (!resolution?.scope || !resolution.matrix) return card;
      return {
        ...card,
        productText: `${resolution.scope.rawText} ${card.productText}`.trim(),
        rawText: `${resolution.scope.rawText} ${card.rawText}`.trim(),
      };
    });
    progress(hasVisualEvidence
      ? `Class Matrix กู้ ${matrix.recovered} การ์ด · คลุมเครือ ${matrix.ambiguous} การ์ด · ${seconds(matrixStarted)}`
      : 'ข้าม Class Matrix, catalog sequence และ fingerprint เพราะไม่มีลายนิ้วมือภาพ');

    const groupingStarted = performance.now();
    let result = groupImportedCards(
      payload.monthKey,
      hintedCards,
      payload.existingSkus,
      payload.storedPrices,
      payload.promotionFamilies,
      payload.visualSignatures,
      matrix.resolutions,
    );
    progress(`สร้าง SKU และ Product Group เสร็จ ${seconds(groupingStarted)} · ${result.groups.length} กลุ่ม · unresolved ${result.diagnostics.unresolved}`);
    result.cards = result.cards.map(card => {
      const original = originalEvidence.get(card.id);
      return original ? {
        ...card,
        evidence: {
          ...card.evidence,
          productText: original.productText,
          rawText: original.rawText,
          pageClassText: original.pageClassText,
        },
      } : card;
    });

    const auditStarted = performance.now();
    result = attachMasterMatchAuditEvidence(
      result,
      payload.cards,
      payload.existingSkus,
      payload.promotionFamilies,
      payload.visualSignatures,
      matrix.resolutions,
    );
    progress(`ตรวจหลักฐาน Product Master เสร็จ ${seconds(auditStarted)} · รวม ${seconds(totalStarted)}`);
    result.warnings = [...new Set([
      ...result.warnings,
      `grouping:class_matrix:${matrix.recovered}`,
      `grouping:class_matrix_ambiguous:${matrix.ambiguous}`,
      `grouping:worker_elapsed_ms:${Math.max(0, Math.round(performance.now() - totalStarted))}`,
      ...(hasVisualEvidence ? [] : ['grouping:visual_matching_disabled_text_first']),
      ...payload.cards.flatMap(card => {
        const resolution = matrix.resolutions.get(card.cardId) as (typeof initial extends Map<string, infer R> ? R : never) & { matrix?: boolean };
        return resolution?.matrix ? [`card:${card.cardId}:grouping_method:class_matrix`] : [];
      }),
    ])];
    workerScope.postMessage({ type: 'result', result } satisfies GroupingWorkerResponse);
  } catch (error) {
    workerScope.postMessage({
      type: 'error',
      error: String((error as Error).message || error),
    } satisfies GroupingWorkerResponse);
  }
};
