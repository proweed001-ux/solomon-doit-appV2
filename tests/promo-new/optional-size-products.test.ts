import test from 'node:test';
import assert from 'node:assert/strict';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';

function card(text: string, classId = 'HFSS', sequence = 1): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, 1, sequence),
    monthKey: MONTH,
    page: 1,
    sequence,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: text,
    productText: text,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('Gillette รุ่นมีดโกนใช้รุ่นแทนขนาดและไม่ติด size_missing', () => {
  const result = groupImportedCards(MONTH, [card('ยิลเลตต์ ด้ามมีด ซุปเปอร์คลิ๊ก', 'HFSS')]);
  assert.equal(result.quarantineCards.length, 0);
  assert.equal(result.groups.length, 1);
  assert.equal(result.groups[0].sku.identity.brand, 'GILLETTE');
  assert.equal(result.groups[0].sku.identity.productType, 'มีดโกน');
  assert.ok(!result.groups[0].sku.failureReasons.includes('size_missing'));
  assert.ok(!result.groups[0].sku.failureReasons.includes('size_unit_missing'));
});

test('Olay แบบซองหรือกล่องใช้ชื่อรุ่นและบรรจุภัณฑ์แทนมล./กรัมได้', () => {
  const result = groupImportedCards(MONTH, [card('โอเลย์ โททัลไวท์ ซอง 1 กล่อง 6 ซอง', 'HFSS')]);
  assert.equal(result.quarantineCards.length, 0);
  assert.equal(result.groups.length, 1);
  assert.equal(result.groups[0].sku.identity.brand, 'OLAY');
  assert.equal(result.groups[0].sku.identity.productType, 'สกินแคร์');
  assert.ok(!result.groups[0].sku.failureReasons.includes('size_missing'));
});

test('H&S แชมพูยังต้องมีขนาดเพื่อป้องกันการรวม 65 มล. กับ 140 มล.', () => {
  const result = groupImportedCards(MONTH, [card('H&S แชมพู ทุกสูตร', 'HFSS')]);
  assert.equal(result.groups.length, 0);
  assert.equal(result.quarantineCards.length, 1);
  assert.ok(result.quarantineCards[0].failureReasons.includes('size_missing'));
  assert.ok(result.quarantineCards[0].failureReasons.includes('size_unit_missing'));
});
