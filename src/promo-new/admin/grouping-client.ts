import groupingWorkerUrl from './grouping-worker?worker&url';
import type { GroupingResult } from '../domain/grouping';
import type { PromotionFamily, PromoCard, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { GroupingWorkerRequest, GroupingWorkerResponse } from './grouping-worker';
import { validateGroupingWorkerAsset } from './grouping-worker-asset';

const GROUPING_TIMEOUT_MS = 120_000;
const WORKER_READY_TIMEOUT_MS = 15_000;
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

interface LoadedWorker {
  worker: Worker;
  cleanup: () => void;
  assetUrl: string;
}

function positionKey(page: number, sequence: number): string {
  return `${page}:${sequence}`;
}

export function prepareGroupingWorkerCards(cards: ImportedCardCandidate[]): PreparedWorkerCards {
  const imagesByPosition: Record<string, string> = {};
  const lightweightCards = cards.map(card => {
    const key = positionKey(card.page, card.sequence);
    if (Object.prototype.hasOwnProperty.call(imagesByPosition, key) && imagesByPosition[key] !== card.imageUrl) {
      throw new Error(`duplicate_card_position:${key}`);
    }
    imagesByPosition[key] = card.imageUrl;
    return { ...card, imageUrl: '' };
  });
  return { cards: lightweightCards, imagesByPosition };
}

export function restoreGroupingResultImages(
  result: GroupingResult,
  imagesByPosition: Record<string, string>,
): GroupingResult {
  if (!result || !Array.isArray(result.cards) || !Array.isArray(result.quarantineCards)) {
    throw new Error('grouping_worker_invalid_result');
  }
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

async function loadAuthenticatedWorker(onProgress?: (message: string) => void): Promise<LoadedWorker> {
  if (typeof Worker === 'undefined') throw new Error('browser_worker_unavailable');
  if (typeof fetch === 'undefined' || typeof Blob === 'undefined' || typeof URL?.createObjectURL !== 'function') {
    throw new Error('browser_worker_blob_unavailable');
  }

  onProgress?.('กำลังโหลด Worker bundle พร้อมสิทธิ์ Preview');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), WORKER_READY_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(groupingWorkerUrl, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
      headers: { Accept: 'text/javascript, application/javascript;q=0.9, */*;q=0.1' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`grouping_worker_asset_fetch_failed:${message}`);
  } finally {
    window.clearTimeout(timeout);
  }

  const source = await response.text();
  validateGroupingWorkerAsset(response.status, response.headers.get('content-type') || '', source);
  const blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  try {
    const worker = new Worker(blobUrl, { type: 'module', credentials: 'include', name: 'promo-grouping-worker' });
    return {
      worker,
      assetUrl: response.url || groupingWorkerUrl,
      cleanup: () => URL.revokeObjectURL(blobUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(blobUrl);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`grouping_worker_construct_failed:${message}`);
  }
}

function workerErrorMessage(event: ErrorEvent, assetUrl: string): string {
  const details = [
    event.message || 'unknown',
    event.filename || assetUrl,
    event.lineno ? `L${event.lineno}` : '',
    event.colno ? `C${event.colno}` : '',
  ].filter(Boolean).join(':');
  return `grouping_worker_runtime_error:${details}`;
}

export async function runGroupingInWorker(input: RunGroupingInput): Promise<GroupingResult> {
  const prepared = prepareGroupingWorkerCards(input.cards);
  const loaded = await loadAuthenticatedWorker(input.onProgress);
  const { worker, cleanup, assetUrl } = loaded;

  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    let settled = false;
    let requestSent = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.clearTimeout(readyTimer);
      window.clearInterval(heartbeat);
      worker.terminate();
      cleanup();
      callback();
    };
    const timer = window.setTimeout(() => finish(() => reject(new Error('grouping_worker_timeout'))), GROUPING_TIMEOUT_MS);
    const readyTimer = window.setTimeout(() => finish(() => reject(new Error('grouping_worker_ready_timeout'))), WORKER_READY_TIMEOUT_MS);
    const heartbeat = window.setInterval(() => {
      const elapsedSeconds = Math.max(1, Math.round((performance.now() - startedAt) / 1000));
      input.onProgress?.(`${requestSent ? 'Worker กำลังจัดกลุ่ม' : 'กำลังรอ Worker พร้อม'} · ${elapsedSeconds} วินาที`);
    }, HEARTBEAT_MS);

    worker.onerror = event => finish(() => reject(new Error(workerErrorMessage(event, assetUrl))));
    worker.onmessageerror = () => finish(() => reject(new Error('grouping_worker_message_decode_failed')));
    worker.onmessage = (event: MessageEvent<GroupingWorkerResponse>) => {
      const message = event.data;
      if (message.type === 'ready') {
        if (requestSent) return;
        requestSent = true;
        window.clearTimeout(readyTimer);
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
          input.onProgress?.(`Worker พร้อม · ส่งข้อมูลเบา ${prepared.cards.length} การ์ดโดยไม่คัดลอกรูป`);
          worker.postMessage(request);
        } catch (error) {
          finish(() => reject(error instanceof Error ? error : new Error(String(error))));
        }
        return;
      }
      if (message.type === 'progress') {
        input.onProgress?.(message.message);
        return;
      }
      if (message.type === 'error') {
        finish(() => reject(new Error(message.error)));
        return;
      }
      try {
        const restored = restoreGroupingResultImages(message.result, prepared.imagesByPosition);
        finish(() => resolve(restored));
      } catch (error) {
        finish(() => reject(error instanceof Error ? error : new Error(String(error))));
      }
    };
  });
}
