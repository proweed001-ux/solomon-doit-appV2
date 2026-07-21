import GroupingWorker from './grouping-worker?worker&inline';
import type { GroupingResult } from '../domain/grouping';
import type { PromotionFamily, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import { buildVisualProductSignatures, type VisualProductSignature } from '../domain/visual-product-signatures';
import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { GroupingWorkerRequest, GroupingWorkerResponse } from './grouping-worker';
import { prepareGroupingWorkerCards, restoreGroupingResultImages } from './grouping-transport';

const GROUPING_STALL_TIMEOUT_MS = 120_000;
const GROUPING_HARD_TIMEOUT_MS = 300_000;
const WORKER_READY_TIMEOUT_MS = 15_000;
const HEARTBEAT_MS = 1_000;

export interface RunGroupingInput {
  monthKey: string;
  cards: ImportedCardCandidate[];
  existingSkus: Sku[];
  // Kept for Admin compatibility. Price and Promotion Family are never sent to grouping.
  storedPrices?: StoredPrice[];
  promotionFamilies?: PromotionFamily[];
  visualSignatures?: Record<string, VisualProductSignature>;
  onProgress?: (message: string) => void;
}

function validHex(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 64 && value.length % 2 === 0 && /^[0-9a-f]+$/iu.test(value);
}

function validNumberArray(value: unknown, expectedLength: number): value is number[] {
  return Array.isArray(value)
    && value.length === expectedLength
    && value.every(item => Number.isFinite(item) && Number(item) >= 0);
}

function validVisualProductSignature(value: unknown): value is VisualProductSignature {
  if (!value || typeof value !== 'object') return false;
  const signature = value as Partial<VisualProductSignature>;
  return validHex(signature.title)
    && validHex(signature.product)
    && validNumberArray(signature.colorHistogram, 24 * 12)
    && validNumberArray(signature.edgeHistogram, 6 * 4)
    && Number.isFinite(signature.quality)
    && Number(signature.quality) > 0;
}

export function visualProductSignaturesComplete(
  cards: ImportedCardCandidate[],
  signatures: Record<string, VisualProductSignature> | null | undefined,
): signatures is Record<string, VisualProductSignature> {
  if (!signatures || cards.length === 0) return false;
  return cards.every(card => validVisualProductSignature(signatures[card.cardId]));
}

function createInlineWorker(): Worker {
  if (typeof Worker === 'undefined') throw new Error('browser_worker_unavailable');
  try {
    return new GroupingWorker({ name: 'promo-grouping-worker' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`grouping_worker_inline_create_failed:${message}`);
  }
}

function workerErrorMessage(event: ErrorEvent): string {
  const details = [
    event.message || 'unknown',
    event.filename || 'inline-worker',
    event.lineno ? `L${event.lineno}` : '',
    event.colno ? `C${event.colno}` : '',
  ].filter(Boolean).join(':');
  return `grouping_worker_runtime_error:${details}`;
}

export async function runGroupingInWorker(input: RunGroupingInput): Promise<GroupingResult> {
  if (!Array.isArray(input.existingSkus) || input.existingSkus.length === 0) {
    throw new Error('product_master_required_before_grouping');
  }
  if (!input.cards.length) throw new Error('cards_required_before_grouping');

  input.onProgress?.(`Product Master พร้อม ${input.existingSkus.length} รายการ · ตรวจลายนิ้วมือภาพ`);
  let visualSignatures: Record<string, VisualProductSignature> | undefined = input.visualSignatures;
  if (!visualProductSignaturesComplete(input.cards, visualSignatures)) {
    input.onProgress?.(`ลายนิ้วมือเดิมไม่ครบ · สร้างใหม่จากรูป ${input.cards.length} การ์ด`);
    visualSignatures = await buildVisualProductSignatures(input.cards, (completed, total) => {
      input.onProgress?.(`สร้างลายนิ้วมือชื่อและรูปสินค้า ${completed}/${total}`);
    });
  }
  if (!visualProductSignaturesComplete(input.cards, visualSignatures)) {
    const map = visualSignatures as Record<string, VisualProductSignature> | undefined;
    const completed = input.cards.filter(card => validVisualProductSignature(map?.[card.cardId])).length;
    throw new Error(`visual_signatures_incomplete:${completed}/${input.cards.length}`);
  }

  const prepared = prepareGroupingWorkerCards(input.cards);
  const worker = createInlineWorker();

  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    let settled = false;
    let requestSent = false;
    let lastWorkerMessage = 'ยังไม่ได้รับข้อความจาก Worker';
    let stallTimer = 0;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(stallTimer);
      window.clearTimeout(hardTimer);
      window.clearTimeout(readyTimer);
      window.clearInterval(heartbeat);
      worker.terminate();
      callback();
    };
    const resetStallTimer = () => {
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(() => finish(() => reject(new Error(`grouping_worker_stalled:${lastWorkerMessage}`))), GROUPING_STALL_TIMEOUT_MS);
    };
    const hardTimer = window.setTimeout(() => finish(() => reject(new Error(`grouping_worker_hard_timeout:${lastWorkerMessage}`))), GROUPING_HARD_TIMEOUT_MS);
    const readyTimer = window.setTimeout(() => finish(() => reject(new Error('grouping_worker_ready_timeout'))), WORKER_READY_TIMEOUT_MS);
    const heartbeat = window.setInterval(() => {
      const elapsedSeconds = Math.max(1, Math.round((performance.now() - startedAt) / 1000));
      input.onProgress?.(`${requestSent ? lastWorkerMessage : 'กำลังรอ Inline Worker พร้อม'} · ${elapsedSeconds} วินาที`);
    }, HEARTBEAT_MS);

    worker.onerror = event => finish(() => reject(new Error(workerErrorMessage(event))));
    worker.onmessageerror = () => finish(() => reject(new Error('grouping_worker_message_decode_failed')));
    worker.onmessage = (event: MessageEvent<GroupingWorkerResponse>) => {
      const message = event.data;
      if (!message || typeof message.type !== 'string') {
        finish(() => reject(new Error('grouping_worker_invalid_message')));
        return;
      }
      resetStallTimer();
      if (message.type === 'ready') {
        if (requestSent) return;
        requestSent = true;
        lastWorkerMessage = 'Worker พร้อมและกำลังรับลายนิ้วมือภาพ';
        window.clearTimeout(readyTimer);
        const request: GroupingWorkerRequest = {
          type: 'group',
          payload: {
            monthKey: input.monthKey,
            cards: prepared.cards,
            existingSkus: input.existingSkus,
            storedPrices: [],
            promotionFamilies: [],
            visualSignatures,
          },
        };
        try {
          input.onProgress?.(`Inline Worker พร้อม · ส่ง ${prepared.cards.length} การ์ดและลายนิ้วมือครบ โดยไม่ส่งรูป ราคา หรือโปรโมชั่น`);
          worker.postMessage(request);
        } catch (error) {
          finish(() => reject(error instanceof Error ? error : new Error(String(error))));
        }
        return;
      }
      if (message.type === 'progress') {
        lastWorkerMessage = message.message;
        input.onProgress?.(message.message);
        return;
      }
      if (message.type === 'error') {
        finish(() => reject(new Error(message.error)));
        return;
      }
      lastWorkerMessage = 'Worker ส่งผลลัพธ์แล้ว กำลังคืนรูปการ์ด';
      try {
        const restored = restoreGroupingResultImages(message.result, prepared.imagesByPosition);
        finish(() => resolve(restored));
      } catch (error) {
        finish(() => reject(error instanceof Error ? error : new Error(String(error))));
      }
    };
  });
}
