/// <reference lib="webworker" />

import { groupImportedCards } from '../domain/grouping';
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
    const result = groupImportedCards(
      payload.monthKey,
      payload.cards,
      payload.existingSkus,
      payload.storedPrices,
      payload.promotionFamilies,
      payload.visualSignatures,
    );
    workerScope.postMessage({ type: 'result', result } satisfies GroupingWorkerResponse);
  } catch (error) {
    workerScope.postMessage({
      type: 'error',
      error: String((error as Error).message || error),
    } satisfies GroupingWorkerResponse);
  }
};
