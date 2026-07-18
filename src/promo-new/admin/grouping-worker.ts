/// <reference lib="webworker" />

import { groupImportedCards } from '../domain/grouping';
import { applyClassMatrixRecovery } from '../domain/class-matrix';
import { buildProductScopes } from '../domain/scope-matcher';
import { resolveScopesSafely } from '../domain/scope-safety';
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
  | { type: 'progress'; message: string }
  | { type: 'result'; result: ReturnType<typeof groupImportedCards> }
  | { type: 'error'; error: string };

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<GroupingWorkerRequest>) => {
  if (event.data?.type !== 'group') return;
  try {
    workerScope.postMessage({ type: 'progress', message: 'กำลังวิเคราะห์ Class, Product Scope และหลักฐานภาพ' } satisfies GroupingWorkerResponse);
    const payload = event.data.payload;
    const initial = resolveScopesSafely(payload.cards, payload.promotionFamilies, payload.visualSignatures);
    const scopes = buildProductScopes(payload.promotionFamilies);
    const matrix = applyClassMatrixRecovery(payload.cards, scopes, initial, payload.visualSignatures);
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
    workerScope.postMessage({
      type: 'progress',
      message: `Class Matrix กู้ ${matrix.recovered} การ์ด · คลุมเครือ ${matrix.ambiguous} การ์ด`,
    } satisfies GroupingWorkerResponse);
    const result = groupImportedCards(
      payload.monthKey,
      hintedCards,
      payload.existingSkus,
      payload.storedPrices,
      payload.promotionFamilies,
      payload.visualSignatures,
    );
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
    result.warnings = [...new Set([
      ...result.warnings,
      `grouping:class_matrix:${matrix.recovered}`,
      `grouping:class_matrix_ambiguous:${matrix.ambiguous}`,
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
