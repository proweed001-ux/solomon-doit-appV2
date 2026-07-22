import assert from 'node:assert/strict';
import test from 'node:test';
import { buildVisualProductClusters } from '../../src/promo-new/domain/visual-product-clusters';
import type { VisualProductSignature } from '../../src/promo-new/domain/visual-product-signatures';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

function card(id: string, classId: string, productText: string): ImportedCardCandidate {
  return {
    cardId: id,
    monthKey: 'JUL26',
    page: 1,
    sequence: Number(id.replace(/\D/g, '')) || 1,
    classId,
    imageUrl: '',
    rawText: productText,
    productText,
    pageClassText: classId,
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 60 },
    failureReasons: [],
  };
}

const signature: VisualProductSignature = {
  title: 'ff'.repeat(96),
  product: 'ff'.repeat(96),
  quality: 0.5,
};

test('OCR จริงของ Gillette Super Thin ห้ามรวมกับ Super Click แม้ภาพเหมือนกัน', () => {
  const input = [
    card('card-1', 'HFSXL', 'ยิลเล๓๕ ๑ ใบมีด ธปแปอร์ธิน'),
    card('card-2', 'HFSWS-S', 'ฮยลเลสส์ ๑ ไบมี๓ เปเปอร์ธิน'),
    card('card-3', 'HFSWS-L', 'ยลเลต๓ส์ ๑ ต้ามบมีต ซุปแบอร์คลิ๊ก'),
  ];
  const signatures = Object.fromEntries(input.map(item => [item.cardId, signature]));
  const result = buildVisualProductClusters(input, [], signatures);
  assert.equal(result.clusters.length, 1);
  assert.deepEqual(new Set(result.clusters[0].classIds), new Set(['HFSXL', 'HFSWS-S']));
  assert.equal(result.assignments.has('card-3'), false);
  assert.ok(result.rejectedConflicts >= 1);
});

test('OCR จริง H&S 140 มล. ทั้ง 6 Class ต้องรวมได้เมื่อภาพตรงกัน', () => {
  const input = [
    card('hs-1', 'HFSS', 'เฮดตแอนส์โซว์เตอร์ แหเมพ -re ยนาดต 140 ua. ซ์ -'),
    card('hs-2', 'HFSM', 'เฮสแอนด์ไซรว์แตอร์ ge, แมพู สูนาง 140 ua,'),
    card('hs-3', 'HFSL', 'เฮตแอนส์โทว์แตอร์ แมเพ © «| ชบาด 140 เผา. - ”'),
    card('hs-4', 'HFSXL', 'เฮอดแอนด์โซว์เตอร์ goSS แหมพมู aula 140มล .'),
    card('hs-5', 'HFSWS-S', 'เฮดแอนด์โซว์เตอร์ gos แตมเพ สนาด140va'),
    card('hs-6', 'HFSWS-L', 'เอตแอนด์โซว์เตอร์ 6 แหมเม ana 140มล .'),
  ];
  const signatures = Object.fromEntries(input.map(item => [item.cardId, signature]));
  const result = buildVisualProductClusters(input, [], signatures);
  assert.equal(result.clusters.length, 1);
  assert.deepEqual(new Set(result.clusters[0].classIds), new Set(['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L']));
});
