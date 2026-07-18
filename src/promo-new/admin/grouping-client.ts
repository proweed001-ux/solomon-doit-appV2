import type { GroupingResult } from '../domain/grouping';
import type { PromotionFamily, PromoCard, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { GroupingWorkerRequest, GroupingWorkerResponse } from './grouping-worker';

const GROUPING_TIMEOUT_MS = 120_000;
const HEARTBEAT_MS = 1_000;

export interface RunGroupingInput {
  monthKey: string;
  cards: ImportedCardCandidate[];
  existingSkus: Sku[];
  storedPrices: StoredPrice[];
  promotionFamilies: PromotionFamily[];
  visualSignatures: Record<string, string>;
  onProgress?: (message: string) => void;
}

interface PreparedWorkerCards {
  cards: ImportedCardCandidate[];
  imagesByPosition: Record<string, string>;
}

function positionKey(page: number, sequence: number): string {
  return `${page}:${sequence}`;
}

export function prepareGroupingWorkerCards(cards: ImportedCardCandidate[]): PreparedWorkerCards {
  const imagesByPosition: Record<string, string> = {};
  const lightweightCards = cards.map(card => {
    imagesByPosition[positionKey(card.page, card.sequence)] = card.imageUrl;
    return { ...card, imageUrl: '' };
  });
  return { cards: lightweightCards, imagesByPosition };
}

export function restoreGroupingResultImages(
  result: GroupingResult,
  imagesByPosition: Record<string, string>,
): GroupingResult {
  const restorePromoCard = (card: PromoCard): PromoCard => ({
    ...card,
    imageUrl: imagesByPosition[positionKey(card.page, card.sequence)] || '',
  });
  const restoreCandidate = (card: ImportedCardCandidate): ImportedCardCandidate => ({
    ...card,
    imageUrl: imagesByPosition[positionKey(card.page, card.sequence)] || '',
  });
  return {
    ...result,
    cards: result.cards.map(restorePromoCard),
    quarantineCards: result.quarantineCards.map(restoreCandidate),
  };
}

export function runGroupingInWorker(input: RunGroupingInput): Promise<GroupingResult> {
  if (typeof Worker === 'undefined') return Promise.reject(new Error('browser_worker_unavailable'));

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./grouping-worker.ts', import.meta.url), { type: 'module' });
    const prepared = prepareGroupingWorkerCards(input.cards);
    const startedAt = performance.now();
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.clearInterval(heartbeat);
      worker.terminate();
      callback();
    };
    const timer = window.setTimeout(() => finish(() => reject(new Error('grouping_worker_timeout'))), GROUPING_TIMEOUT_MS);
    const heartbeat = window.setInterval(() => {
      const elapsedSeconds = Math.max(1, Math.round((performance.now() - startedAt) / 1000));
      input.onProgress?.(`Worker กำลังจัดกลุ่ม · ${elapsedSeconds} วินาที`);
    }, HEARTBEAT_MS);

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
      const restored = restoreGroupingResultImages(message.result, prepared.imagesByPosition);
      finish(() => resolve(restored));
    };

    const request: GroupingWorkerRequest = {
      type: 'group',
      payload: {
        monthKey: input.monthKey,
        cards: prepared.cards,
        existingSkus: input.existingSkus,
        storedPrices: input.storedPrices,
        promotionFamilies: input.promotionFamilies,
        visualSignatures: input.visualSignatures,
      },
    };
    try {
      input.onProgress?.(`ส่งข้อมูลเบา ${prepared.cards.length} การ์ดไป Worker โดยไม่คัดลอกรูป`);
      worker.postMessage(request);
    } catch (error) {
      finish(() => reject(error instanceof Error ? error : new Error(String(error))));
    }
  });
}
