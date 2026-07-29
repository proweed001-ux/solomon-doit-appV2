import test from 'node:test';
import assert from 'node:assert/strict';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import { parseCardFingerprintEvidence } from '../../src/promo-new/domain/card-fingerprint';
import { resolveScopesSafely } from '../../src/promo-new/domain/scope-safety';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';

function tier(classId: string, quantity: number, discount: number): [string, PromotionTier[]] {
  return [classId, [{
    tierNo: 1,
    type: 'cash_discount',
    minQuantity: quantity,
    maxQuantity: null,
    purchaseUnit: 'ชิ้น',
    discountPercent: discount,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: null,
    effectivePercentUsage: null,
    sourceText: `ซื้อ ${quantity} ชิ้น ลด ${discount}%`,
  }]];
}

function family(id: string, scopeText: string, discounts: Record<string, number>): PromotionFamily {
  return {
    id,
    familyKey: id.toUpperCase(),
    name: scopeText,
    scopeText,
    sourceRows: [2],
    tiersByClass: Object.fromEntries(Object.entries(discounts).map(([classId, discount]) => tier(classId, 6, discount))),
    failureReasons: [],
  };
}

function card(classId: string, page: number, rawText: string): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, 1),
    monthKey: MONTH,
    page,
    sequence: 1,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText,
    productText: '',
    pageClassText: classId,
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: ['product_text_missing'],
  };
}

function signature(seed: number, repeats = 192): string {
  const left = Math.max(0, Math.min(255, seed)).toString(16).padStart(2, '0');
  const right = Math.max(0, Math.min(255, 255 - seed)).toString(16).padStart(2, '0');
  return `${left}${right}`.repeat(repeats);
}

test('อ่านราคาขายปลีก ราคาปกติ ราคาเฉลี่ย และขั้นโปรโมชั่นจากข้อความการ์ด', () => {
  const source = card('HFSS', 1, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ปกติ 144.3/ชุด เฉลี่ย 24.05/ชิ้น ลด 15%');
  const evidence = parseCardFingerprintEvidence(source);
  assert.equal(evidence.recommendedPrice, 29);
  assert.deepEqual(evidence.normalPrices, [144.3]);
  assert.deepEqual(evidence.averagePrices, [24.05]);
  assert.deepEqual(evidence.mechanics, [{ minQuantity: 6, discountPercent: 15, freeQuantity: null, bundlePrice: null }]);
});

test('ชื่อเสียทุก Class แต่ราคา ภาพ และขั้นโปรตรง CSV ต้องรวมเข้าขอบเขตเดียวกัน', () => {
  const promo = family('family:gillette-super-click', 'GILLETTE ซุปเปอร์คลิ๊ก', {
    HFSS: 15,
    HFSM: 10,
    HFSL: 22,
  });
  const cards = [
    card('HFSS', 1, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 15%'),
    card('HFSM', 2, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 10%'),
    card('HFSL', 3, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 22%'),
  ];
  const same = signature(88);
  const resolved = resolveScopesSafely(cards, [promo], Object.fromEntries(cards.map(item => [item.cardId, same])));
  for (const item of cards) {
    assert.equal(resolved.get(item.cardId)?.scope?.familyId, promo.id);
    assert.equal(resolved.get(item.cardId)?.method, 'visual_consensus');
  }
});

test('ราคาเท่ากันและภาพเหมือน แต่ขั้นโปรชี้ได้สอง Family เท่ากันต้องไม่เดา', () => {
  const first = family('family:gillette-a', 'GILLETTE ซุปเปอร์คลิ๊ก', { HFSS: 15, HFSM: 10 });
  const second = family('family:gillette-b', 'GILLETTE เวคเตอร์', { HFSS: 15, HFSM: 10 });
  const cards = [
    card('HFSS', 1, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 15%'),
    card('HFSM', 2, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 10%'),
  ];
  const same = signature(92);
  const resolved = resolveScopesSafely(cards, [first, second], Object.fromEntries(cards.map(item => [item.cardId, same])));
  for (const item of cards) assert.equal(resolved.get(item.cardId)?.scope, null);
});

test('ราคาขายปลีกต่างกันห้ามรวมคลัสเตอร์แม้ภาพคล้ายและขั้นโปรเหมือนกัน', () => {
  const promo = family('family:gillette-super-click', 'GILLETTE ซุปเปอร์คลิ๊ก', { HFSS: 15, HFSM: 10 });
  const cards = [
    card('HFSS', 1, 'ราคาแนะนำขายปลีก 29 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 15%'),
    card('HFSM', 2, 'ราคาแนะนำขายปลีก 25 บาท/ชิ้น เมื่อซื้อ 6 ชิ้น ลด 10%'),
  ];
  const same = signature(100);
  const resolved = resolveScopesSafely(cards, [promo], Object.fromEntries(cards.map(item => [item.cardId, same])));
  for (const item of cards) assert.equal(resolved.get(item.cardId)?.scope, null);
});
