import test from 'node:test';
import assert from 'node:assert/strict';
import { applyClassMatrixRecovery } from '../../src/promo-new/domain/class-matrix';
import type { ProductScopeCandidate, ScopeResolution } from '../../src/promo-new/domain/scope-matcher';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

const signatureA = 'ff00'.repeat(64);
const signatureB = '00ff'.repeat(64);

function scope(key: string, brand: string, priceLabel = ''): ProductScopeCandidate {
  return {
    key,
    familyId: `family:${key}`,
    familyKey: `family-key:${key}`,
    name: `${brand} แชมพู 65 มล. ${priceLabel}`.trim(),
    rawText: `${brand} แชมพู ขนาด 65 มล.`,
    brand,
    productType: 'แชมพู',
    minimumSize: 65,
    maximumSize: 65,
    sizeUnit: 'มล.',
    salesUnit: 'ขวด',
    packQuantity: 1,
    variant: null,
    variantTokens: [],
    classIds: ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'],
  };
}

function card(id: string, classId: string, sequence: number, text: string): ImportedCardCandidate {
  return {
    cardId: id,
    monthKey: 'PROMO-2026-07',
    page: classId === 'HFSS' ? 1 : classId === 'HFSM' ? 4 : 7,
    sequence,
    classId,
    imageUrl: '',
    rawText: text,
    productText: text,
    pageClassText: classId,
    confidence: 0.8,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

function anchored(scopeValue: ProductScopeCandidate): ScopeResolution {
  return { scope: scopeValue, score: 100, margin: 100, method: 'structured_scope' };
}

function unmatched(): ScopeResolution {
  return { scope: null, score: 0, margin: 0, method: 'unmatched' };
}

test('Class Matrix กู้การ์ด HFSM จากช่องว่างของสินค้าเดียวกันข้าม Class', () => {
  const hs = scope('hs-65', 'H&S');
  const pantene = scope('pantene-65', 'PANTENE');
  const cards = [
    card('hs-s', 'HFSS', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('hs-l', 'HFSL', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('pt-s', 'HFSS', 5, 'PANTENE แชมพู 65 มล. ราคาแนะนำขายปลีก 159 บาท'),
    card('pt-l', 'HFSL', 5, 'PANTENE แชมพู 65 มล. ราคาแนะนำขายปลีก 159 บาท'),
    card('target-m', 'HFSM', 3, 'ราคาแนะนำขายปลีก 99 บาท'),
  ];
  const resolutions = new Map<string, ScopeResolution>([
    ['hs-s', anchored(hs)], ['hs-l', anchored(hs)],
    ['pt-s', anchored(pantene)], ['pt-l', anchored(pantene)],
    ['target-m', unmatched()],
  ]);
  const signatures = {
    'hs-s': signatureA, 'hs-l': signatureA, 'target-m': signatureA,
    'pt-s': signatureB, 'pt-l': signatureB,
  };

  const result = applyClassMatrixRecovery(cards, [hs, pantene], resolutions, signatures);
  assert.equal(result.recovered, 1, `recovered=${result.recovered} ambiguous=${result.ambiguous} scope=${result.resolutions.get('target-m')?.scope?.key || 'none'}`);
  assert.equal(result.resolutions.get('target-m')?.scope?.key, hs.key);
  assert.equal((result.resolutions.get('target-m') as ScopeResolution & { matrix?: boolean }).matrix, true);
});

test('หนึ่ง Product Scope รับได้ไม่เกินหนึ่งการ์ดต่อ Class', () => {
  const hs = scope('hs-65', 'H&S');
  const cards = [
    card('hs-s', 'HFSS', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('hs-l', 'HFSL', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('hs-m-existing', 'HFSM', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('hs-m-extra', 'HFSM', 4, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
  ];
  const resolutions = new Map<string, ScopeResolution>([
    ['hs-s', anchored(hs)], ['hs-l', anchored(hs)], ['hs-m-existing', anchored(hs)], ['hs-m-extra', unmatched()],
  ]);
  const signatures = Object.fromEntries(cards.map(item => [item.cardId, signatureA]));

  const result = applyClassMatrixRecovery(cards, [hs], resolutions, signatures);
  assert.equal(result.recovered, 0);
  assert.equal(result.resolutions.get('hs-m-extra')?.scope, null);
});

test('เมื่อสองการ์ดแย่งช่อง HFSM เดียวกัน ระบบเลือกเฉพาะผู้ชนะที่คะแนนห่างชัด', () => {
  const hs = scope('hs-65', 'H&S');
  const cards = [
    card('hs-s', 'HFSS', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('hs-l', 'HFSL', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('best-m', 'HFSM', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('weak-m', 'HFSM', 7, 'ราคาแนะนำขายปลีก 99 บาท'),
  ];
  const resolutions = new Map<string, ScopeResolution>([
    ['hs-s', anchored(hs)], ['hs-l', anchored(hs)], ['best-m', unmatched()], ['weak-m', unmatched()],
  ]);
  const signatures = Object.fromEntries(cards.map(item => [item.cardId, signatureA]));

  const result = applyClassMatrixRecovery(cards, [hs], resolutions, signatures);
  assert.equal(result.recovered, 1);
  assert.equal(result.resolutions.get('best-m')?.scope?.key, hs.key);
  assert.equal(result.resolutions.get('weak-m')?.scope, null);
});

test('คะแนนเท่ากันระหว่างสอง Product Scope ต้องไม่เดากลุ่ม', () => {
  const first = scope('first', 'H&S');
  const second = { ...scope('second', 'H&S'), familyId: 'family:second' };
  const cards = [
    card('first-s', 'HFSS', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('first-l', 'HFSL', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('second-s', 'HFSS', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('second-l', 'HFSL', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
    card('target-m', 'HFSM', 3, 'H&S แชมพู 65 มล. ราคาแนะนำขายปลีก 99 บาท'),
  ];
  const resolutions = new Map<string, ScopeResolution>([
    ['first-s', anchored(first)], ['first-l', anchored(first)],
    ['second-s', anchored(second)], ['second-l', anchored(second)],
    ['target-m', unmatched()],
  ]);
  const signatures = Object.fromEntries(cards.map(item => [item.cardId, signatureA]));

  const result = applyClassMatrixRecovery(cards, [first, second], resolutions, signatures);
  assert.equal(result.recovered, 0);
  assert.equal(result.resolutions.get('target-m')?.scope, null);
  assert.ok(result.ambiguous >= 1);
});
