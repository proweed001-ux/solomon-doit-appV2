/// <reference lib="webworker" />

import { groupImportedCards } from '../domain/grouping';
import { attachMasterMatchAuditEvidenceAsync } from '../domain/master-match-audit';
import { buildVisualProductClusters } from '../domain/visual-product-clusters';
import type { VisualProductSignature } from '../domain/visual-product-signatures';
import type { PromotionFamily, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import type { ScopeResolution } from '../domain/scope-matcher';
import type { ImportedCardCandidate } from '../import/pdf-importer';

export interface GroupingWorkerRequest {
  type: 'group';
  payload: {
    monthKey: string;
    cards: ImportedCardCandidate[];
    existingSkus: Sku[];
    storedPrices: StoredPrice[];
    promotionFamilies: PromotionFamily[];
    visualSignatures: Record<string, VisualProductSignature>;
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
    const nameOnlyCards = payload.cards.map(card => ({
      ...card,
      // Full-card text contains price and promotion wording. It is never used as identity evidence.
      rawText: card.productText || '',
    }));
    const noScopes = new Map<string, ScopeResolution>();

    progress('กำลังรวมสินค้าจากภาพชื่อและรูปสินค้า โดยไม่ใช้ราคา โปรโมชั่น หรือ Scope');
    const visualStarted = performance.now();
    const visual = buildVisualProductClusters(nameOnlyCards, payload.existingSkus, payload.visualSignatures);
    const clusteredCards = nameOnlyCards.map(card => {
      const cluster = visual.assignments.get(card.cardId);
      return cluster ? { ...card, productText: cluster.representativeText, rawText: cluster.representativeText } : card;
    });
    progress(`Visual-first เสร็จ ${seconds(visualStarted)} · ${visual.clusters.length} กลุ่ม · ${visual.assignments.size} การ์ด`);

    const originalEvidence = new Map(payload.cards.map(card => [card.cardId, {
      productText: card.productText,
      rawText: card.rawText,
      pageClassText: card.pageClassText,
    }]));

    const groupingStarted = performance.now();
    let result = groupImportedCards(
      payload.monthKey,
      clusteredCards,
      payload.existingSkus,
      [],
      [],
      {},
      noScopes,
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
    result = await attachMasterMatchAuditEvidenceAsync(
      result,
      clusteredCards,
      payload.existingSkus,
      [],
      {},
      noScopes,
      state => progress(`ตรวจชื่อกับ Product Master ${state.processed}/${state.total} กลุ่ม`),
    );
    progress(`ตรวจชื่อกับ Product Master เสร็จ ${seconds(auditStarted)} · รวม ${seconds(totalStarted)}`);
    result.warnings = [...new Set([
      ...result.warnings,
      'grouping:mode:visual_first_anchored',
      'grouping:visual_uses_title_and_product_only',
      'grouping:price_manual_admin',
      'grouping:promotion_family_manual_admin',
      'grouping:scope_matching_disabled',
      'grouping:full_card_text_disabled',
      `grouping:visual_clusters:${visual.clusters.length}`,
      `grouping:visual_clustered_cards:${visual.assignments.size}`,
      `grouping:visual_compared_pairs:${visual.comparedPairs}`,
      `grouping:visual_eligible_pairs:${visual.eligiblePairs}`,
      `grouping:visual_rejected_conflicts:${visual.rejectedConflicts}`,
      `grouping:worker_elapsed_ms:${Math.max(0, Math.round(performance.now() - totalStarted))}`,
    ])];
    workerScope.postMessage({ type: 'result', result } satisfies GroupingWorkerResponse);
  } catch (error) {
    workerScope.postMessage({
      type: 'error',
      error: String((error as Error).message || error),
    } satisfies GroupingWorkerResponse);
  }
};
