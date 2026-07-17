import type { GroupingResult } from '../domain/grouping';
import type { PromotionFamily, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { GroupingWorkerRequest, GroupingWorkerResponse } from './grouping-worker';

const GROUPING_TIMEOUT_MS = 120_000;

export interface RunGroupingInput {
  monthKey: string;
  cards: ImportedCardCandidate[];
  existingSkus: Sku[];
  storedPrices: StoredPrice[];
  promotionFamilies: PromotionFamily[];
  visualSignatures: Record<string, string>;
  onProgress?: (message: string) => void;
}

export function runGroupingInWorker(input: RunGroupingInput): Promise<GroupingResult> {
  if (typeof Worker === 'undefined') return Promise.reject(new Error('browser_worker_unavailable'));

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./grouping-worker.ts', import.meta.url), { type: 'module' });
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      worker.terminate();
      callback();
    };
    const timer = window.setTimeout(() => finish(() => reject(new Error('grouping_worker_timeout'))), GROUPING_TIMEOUT_MS);

    worker.onerror = event => finish(() => reject(new Error(event.message || 'grouping_worker_failed')));
    worker.onmessage = (event: MessageEvent<GroupingWorkerResponse>) => {
      const message = event.data;
      if (message.type === 'progress') {
        input.onProgress?.(message.message);
        return;
      }
      if (message.type === 'error') {
        finish(() => reject(new Error(message.error)));
        return;
      }
      finish(() => resolve(message.result));
    };

    const request: GroupingWorkerRequest = {
      type: 'group',
      payload: {
        monthKey: input.monthKey,
        cards: input.cards,
        existingSkus: input.existingSkus,
        storedPrices: input.storedPrices,
        promotionFamilies: input.promotionFamilies,
        visualSignatures: input.visualSignatures,
      },
    };
    worker.postMessage(request);
  });
}
