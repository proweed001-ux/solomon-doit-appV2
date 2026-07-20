/// <reference lib="webworker" />

import { groupImportedCards } from '../domain/grouping';
import { attachMasterMatchAuditEvidenceAsync } from '../domain/master-match-audit';
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
    const workingCards = payload.cards.map(card => ({
      ...card,
      // Grouping is intentionally name-only. Never fall back to full-card text,
      // because it contains prices and promotion wording from other zones.
      rawText: card.productText || '',
    }));
    const noScopes = new Map<string, ScopeResolution>();

    progress('กำลังจับกลุ่มจากชื่อสินค้ามุมขวาบนและ Product Master เท่านั้น');
    progress('ไม่ใช้ราคา โปรโมชั่น Tier Scope หรือรูปภาพเป็นหลักฐานจัดกลุ่ม');

    const originalEvidence = new Map(payload.cards.map(card => [card.cardId, {
      productText: card.productText,
      rawText: card.rawText,
      pageClassText: card.pageClassText,
    }]));

    const groupingStarted = performance.now();
    let result = groupImportedCards(
      payload.monthKey,
      workingCards,
      payload.existingSkus,
      [],
      [],
      {},
      noScopes,
    );
    progress(`สร้าง SKU และ Product Group จากชื่อเสร็จ ${seconds(groupingStarted)} · ${result.groups.length} กลุ่ม · unresolved ${result.diagnostics.unresolved}`);

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
      workingCards,
      payload.existingSkus,
      [],
      {},
      noScopes,
      state => progress(`ตรวจชื่อกับ Product Master ${state.processed}/${state.total} กลุ่ม`),
    );
    progress(`ตรวจชื่อกับ Product Master เสร็จ ${seconds(auditStarted)} · รวม ${seconds(totalStarted)}`);
    result.warnings = [...new Set([
      ...result.warnings,
      'grouping:mode:name_only',
      'grouping:price_manual_admin',
      'grouping:promotion_family_manual_admin',
      'grouping:scope_matching_disabled',
      'grouping:visual_matching_disabled',
      'grouping:full_card_text_disabled',
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
