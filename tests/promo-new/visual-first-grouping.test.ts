import assert from 'node:assert/strict';
import test from 'node:test';
import { buildVisualProductClusters } from '../../src/promo-new/domain/visual-product-clusters';
import type { VisualProductSignature } from '../../src/promo-new/domain/visual-product-signatures';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

const classes = ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'];

function card(id: string, classId: string, productText: string): ImportedCardCandidate {
  return {
    cardId: id,
    monthKey: 'PROMO-2026-07',
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

function encoded(active: number[]): string {
  const values = Array.from({ length: 256 }, () => 0);
  for (const index of active) values[index] = 255;
  return values.map(value => value.toString(16).padStart(2, '0')).join('');
}

const sameSignature: VisualProductSignature = {
  title: encoded([1, 4, 8, 16, 24, 40]),
  product: encoded([2, 3, 9, 18, 35, 60, 75]),
  colorHistogram: Array.from({ length: 24 * 12 }, (_, index) => index === 10 ? 1 : 0),
  edgeHistogram: Array.from({ length: 6 * 4 }, () => 0.1),
  quality: 0.5,
};

function signatures(cards: ImportedCardCandidate[], signature = sameSignature): Record<string, VisualProductSignature> {
  return Object.fromEntries(cards.map(item => [item.cardId, signature]));
}

test('same product can form one anchored visual cluster across classes', () => {
  const input = classes.slice(0, 3).map((classId, index) => card(`card-${index + 1}`, classId, 'H&S แชมพู 65 มล.'));
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 1);
  assert.deepEqual(new Set(result.clusters[0].classIds), new Set(classes.slice(0, 3)));
  assert.equal(result.assignments.size, 3);
});

test('real JUL26 H&S 140 ml OCR variants form one six-class cluster', () => {
  const texts = [
    "เฮตแอนด์โชว์เตอร์ แชม ' 2 ซ ยนาต 140 va.",
    'เฮตแอนส์โซว์เตอร์ แชมพู ยขนาด 140 va. ๕@,,, <',
    'เฮตแอนส์โซว์เตอร์ แชมพู aura 140 va. : 5 ๆ',
    'เฮ แอนส์โธว์เตอร์ แชมพู ยนาต 140 มล. , - ก .',
    'เฮสตแอนส์โซว์เตอร์ แชมพู ยขนาด 140 va.',
    'เฮดตแอนส์โซว์เสตอร์ แชมพู ยขนาด 140 va. <',
  ];
  const input = classes.map((classId, index) => card(`hs140-${index + 1}`, classId, texts[index]));
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 1);
  assert.equal(result.assignments.size, 6);
  assert.deepEqual(new Set(result.clusters[0].classIds), new Set(classes));
});

test('different known sizes never merge even when image signatures are identical', () => {
  const input = [
    card('card-1', 'HFSS', 'H&S แชมพู 65 มล.'),
    card('card-2', 'HFSM', 'H&S แชมพู 140 มล.'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 0);
  assert.ok(result.rejectedConflicts >= 1);
});

test('Gillette Super Click and Super Thin never merge', () => {
  const input = [
    card('card-1', 'HFSS', 'GILLETTE มีดโกน SUPER CLICK ด้าม'),
    card('card-2', 'HFSM', 'GILLETTE มีดโกน SUPER THIN ด้าม'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 0);
  assert.ok(result.rejectedConflicts >= 1);
});

test('Gillette Blue 2 and Blue 3 never merge', () => {
  const input = [
    card('card-1', 'HFSS', 'GILLETTE BLUE 2 มีดโกน'),
    card('card-2', 'HFSM', 'GILLETTE BLUE 3 มีดโกน'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 0);
  assert.ok(result.rejectedConflicts >= 1);
});

test('two cards from the same class can never enter one visual cluster', () => {
  const input = [
    card('card-1', 'HFSS', 'PANTENE แชมพู 70 มล.'),
    card('card-2', 'HFSS', 'PANTENE แชมพู 70 มล.'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 0);
});

test('cross-class residual products can cluster even when HFSM anchor is absent', () => {
  const input = [
    card('card-1', 'HFSL', 'SAFEGUARD สบู่ก้อน ขนาด 80 กรัม'),
    card('card-2', 'HFSXL', 'เซฟการ์ด สบู่ก้อน ขนาด 80 กรับ'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 1);
  assert.equal(result.assignments.size, 2);
});

test('image similarity alone cannot auto-group cards without usable text similarity', () => {
  const input = [
    card('card-1', 'HFSS', 'อ่านข้อความไม่ได้'),
    card('card-2', 'HFSM', 'ข้อความเสีย'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 0);
});

test('an anchored product cannot pull a completely unidentified card into its cluster', () => {
  const input = [
    card('card-1', 'HFSS', 'VICKS ยาบาล์ม 25 กรัม'),
    card('card-2', 'HFSM', 'อ่านข้อความไม่ได้'),
  ];
  const result = buildVisualProductClusters(input, [], signatures(input));
  assert.equal(result.clusters.length, 0);
  assert.equal(result.assignments.size, 0);
});
