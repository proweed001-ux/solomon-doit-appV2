import test from 'node:test';
import assert from 'node:assert/strict';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { makeCardId } from '../../src/promo-new/import/card-id';
import { recoverCachedCardClasses } from '../../src/promo-new/domain/class-recovery';

const MONTH = 'PROMO-2026-07';

function card(page: number, sequence: number, classId: string | null, pageClassText: string): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, sequence),
    monthKey: MONTH,
    page,
    sequence,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: 'สินค้า',
    productText: 'สินค้า',
    pageClassText,
    confidence: 0.5,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: classId ? [] : ['class_missing'],
  };
}

test('จัดกลุ่มจากแคชแก้ HFS-WH เป็น HFSM และย้าย visual signature ไป Card ID ใหม่', () => {
  const cards = [
    card(1, 1, 'HFSS', 'สำหรับร้าน HFS-S'),
    card(2, 1, null, 'สำหรับร้าน HFS-WH'),
    card(3, 1, null, 'สำหรับร้าน HFS-N'),
    card(4, 1, 'HFSL', 'สำหรับร้าน HFS-L'),
  ];
  const oldId = cards[1].cardId;
  const signatures = { [oldId]: 'aabbcc' };
  const result = recoverCachedCardClasses(cards, signatures);
  assert.equal(cards[1].classId, 'HFSM');
  assert.equal(cards[2].classId, 'HFSM');
  assert.match(cards[1].cardId, /-HFSM-/u);
  assert.equal(cards[1].failureReasons.includes('class_missing'), false);
  assert.equal(signatures[cards[1].cardId], 'aabbcc');
  assert.equal(signatures[oldId], undefined);
  assert.equal(result.changedCards, 2);
  assert.equal(result.recoveredPages, 2);
});

test('แคช WS-S และ WS-L ไม่ถูกแก้เป็น M', () => {
  const cards = [
    card(1, 1, 'HFSWS-S', 'สำหรับร้าน HFS-WS-S'),
    card(2, 1, 'HFSWS-L', 'สำหรับร้าน HFS-WS-L'),
  ];
  const result = recoverCachedCardClasses(cards, {});
  assert.deepEqual(cards.map(item => item.classId), ['HFSWS-S', 'HFSWS-L']);
  assert.equal(result.changedCards, 0);
});
