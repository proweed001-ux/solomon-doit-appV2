import test from 'node:test';
import assert from 'node:assert/strict';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { exactCachedVisualSignatures } from '../../src/promo-new/domain/visual-consensus';

function card(cardId: string, imageUrl: string): ImportedCardCandidate {
  return {
    cardId,
    monthKey: 'PROMO-2026-07',
    page: 1,
    sequence: 1,
    classId: 'HFSM',
    imageUrl,
    rawText: '',
    productText: '',
    pageClassText: 'HFS-M',
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('ใช้ลายนิ้วมือจากแคชทันทีเมื่อ Card ID และรูปตรงกันครบ', () => {
  const cards = [card('CARD-A', 'image-a'), card('CARD-B', 'image-b')];
  const result = exactCachedVisualSignatures(cards, cards.map(item => ({ ...item })), {
    'CARD-A': 'aabb',
    'CARD-B': '',
  });
  assert.deepEqual(result, { 'CARD-A': 'aabb', 'CARD-B': '' });
});

test('ไม่ใช้ลายนิ้วมือเก่าเมื่อรูปหรือจำนวนการ์ดไม่ตรง', () => {
  const cards = [card('CARD-A', 'image-new')];
  assert.equal(exactCachedVisualSignatures(cards, [card('CARD-A', 'image-old')], { 'CARD-A': 'aabb' }), null);
  assert.equal(exactCachedVisualSignatures(cards, [], { 'CARD-A': 'aabb' }), null);
  assert.equal(exactCachedVisualSignatures(cards, cards, {}), null);
});
