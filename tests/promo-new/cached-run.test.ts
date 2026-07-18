import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareCachedRun, visualSignaturesComplete } from '../../src/promo-new/admin/cached-run';
import type { PdfImportResult } from '../../src/promo-new/import/pdf-importer';
import { makeCardId } from '../../src/promo-new/import/card-id';

const monthKey = 'PROMO-2026-07';

function imported(): PdfImportResult {
  const cards = [
    {
      cardId: makeCardId(monthKey, 'HFSS', 1, 1), monthKey, page: 1, sequence: 1, classId: 'HFSS',
      imageUrl: 'data:image/webp;base64,S', rawText: 'สินค้า S', productText: 'สินค้า S', pageClassText: 'สำหรับร้าน HFS-S',
      confidence: 0.9, evidenceMethod: 'page_ocr' as const, bounds: { x: 0, y: 0, width: 10, height: 10 }, failureReasons: [],
    },
    {
      cardId: makeCardId(monthKey, null, 2, 1), monthKey, page: 2, sequence: 1, classId: null,
      imageUrl: 'data:image/webp;base64,M', rawText: 'สินค้า M', productText: 'สินค้า M', pageClassText: 'สำหรับร้าน HFS-WH',
      confidence: 0.4, evidenceMethod: 'page_ocr' as const, bounds: { x: 0, y: 0, width: 10, height: 10 }, failureReasons: ['class_missing'],
    },
    {
      cardId: makeCardId(monthKey, 'HFSL', 3, 1), monthKey, page: 3, sequence: 1, classId: 'HFSL',
      imageUrl: 'data:image/webp;base64,L', rawText: 'สินค้า L', productText: 'สินค้า L', pageClassText: 'สำหรับร้าน HFS-L',
      confidence: 0.9, evidenceMethod: 'page_ocr' as const, bounds: { x: 0, y: 0, width: 10, height: 10 }, failureReasons: [],
    },
  ];
  return { cards, warnings: [], diagnostics: [] } as unknown as PdfImportResult;
}

test('เตรียมแคชแก้ Class แบบเบาโดยไม่แก้ object ต้นฉบับ', () => {
  const source = imported();
  const oldMId = source.cards[1].cardId;
  const signatures = Object.fromEntries(source.cards.map(card => [card.cardId, `sig:${card.page}`]));
  const prepared = prepareCachedRun(source, signatures);

  assert.equal(source.cards[1].classId, null);
  assert.equal(prepared.imported.cards[1].classId, 'HFSM');
  assert.match(prepared.imported.cards[1].cardId, /-HFSM-/u);
  assert.equal(prepared.visualSignatures[prepared.imported.cards[1].cardId], 'sig:2');
  assert.equal(prepared.visualSignatures[oldMId], undefined);
  assert.equal(prepared.changedClasses, 1);
  assert.equal(prepared.recoveredPages, 1);
});

test('ตรวจลายนิ้วมือครบโดยอิง Card ID ปัจจุบัน', () => {
  const source = imported();
  const signatures = Object.fromEntries(source.cards.map(card => [card.cardId, 'sig']));
  assert.equal(visualSignaturesComplete(source, signatures), true);
  delete signatures[source.cards[1].cardId];
  assert.equal(visualSignaturesComplete(source, signatures), false);
});
