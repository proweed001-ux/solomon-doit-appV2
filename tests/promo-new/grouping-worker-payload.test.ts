import test from 'node:test';
import assert from 'node:assert/strict';
import type { GroupingResult } from '../../src/promo-new/domain/grouping';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { prepareGroupingWorkerCards, restoreGroupingResultImages } from '../../src/promo-new/admin/grouping-client';

function card(cardId: string, imageUrl: string): ImportedCardCandidate {
  return {
    cardId,
    monthKey: 'PROMO-2026-07',
    page: 4,
    sequence: 7,
    classId: 'HFSM',
    imageUrl,
    rawText: 'H&S 65 มล.',
    productText: 'H&S แชมพู 65 มล.',
    pageClassText: 'HFS-WH',
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('payload เข้า Worker ไม่คัดลอกรูป base64 ขนาดใหญ่', () => {
  const image = `data:image/png;base64,${'A'.repeat(1_000_000)}`;
  const prepared = prepareGroupingWorkerCards([card('OLD-ID', image)]);
  assert.equal(prepared.cards[0].imageUrl, '');
  assert.equal(prepared.imagesByPosition['4:7'], image);
  assert.ok(JSON.stringify(prepared.cards).length < 2_000);
});

test('ประกอบรูปกลับด้วยหน้าและลำดับแม้ Class recovery เปลี่ยน Card ID', () => {
  const image = 'data:image/png;base64,IMAGE';
  const prepared = prepareGroupingWorkerCards([card('OLD-ID', image)]);
  const grouped = {
    cards: [{ id: 'NEW-HFSM-ID', page: 4, sequence: 7, imageUrl: '' }],
    quarantineCards: [{ ...card('NEW-HFSM-ID', ''), classId: 'HFSM' }],
  } as unknown as GroupingResult;
  const restored = restoreGroupingResultImages(grouped, prepared.imagesByPosition);
  assert.equal(restored.cards[0].imageUrl, image);
  assert.equal(restored.quarantineCards[0].imageUrl, image);
});
