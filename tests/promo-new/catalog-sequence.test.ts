import assert from 'node:assert/strict';
import test from 'node:test';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { resolveScopesSafely } from '../../src/promo-new/domain/scope-safety';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';

function tier(classId: string, discountPercent: number): PromotionTier {
  return {
    tierNo: 1,
    type: 'cash_discount',
    minQuantity: 6,
    maxQuantity: null,
    purchaseUnit: 'ชิ้น',
    discountPercent,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: discountPercent,
    effectivePercentUsage: null,
    sourceText: `${classId} ซื้อ 6 ชิ้น ลด ${discountPercent}%`,
  };
}

const family: PromotionFamily = {
  id: 'family:gillette-super-click',
  familyKey: 'FAMILY:GILLETTE-SUPER-CLICK',
  name: 'GILLETTE มีดโกน ซุปเปอร์คลิ๊ก',
  scopeText: 'GILLETTE มีดโกน ซุปเปอร์คลิ๊ก',
  sourceRows: [1, 2, 3],
  tiersByClass: {
    HFSS: [tier('HFSS', 15)],
    HFSM: [tier('HFSM', 10)],
    HFSL: [tier('HFSL', 22)],
  },
  failureReasons: [],
};

function card(cardId: string, page: number, sequence: number, classId: string, productText: string, rawText: string): ImportedCardCandidate {
  return {
    cardId,
    monthKey: 'PROMO-2026-07',
    page,
    sequence,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText,
    productText,
    pageClassText: classId,
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

const samePackSignature = 'ff0010ff'.repeat(96);

test('ตำแหน่งเดียวกันข้าม Class + ภาพเดียวกัน + ขั้นโปรตรง ช่วยกู้การ์ดที่ชื่อและราคาอ่านไม่ได้', () => {
  const cards = [
    card('HFSS-1', 1, 1, 'HFSS', 'GILLETTE มีดโกน ซุปเปอร์คลิ๊ก', 'ราคาแนะนำขายปลีก 29 บาท เมื่อซื้อ 6 ชิ้น ลด 15%'),
    card('HFSM-1', 2, 1, 'HFSM', 'GILLETTE มีดโกน ซุปเปอร์คลิ๊ก', 'ราคาแนะนำขายปลีก 29 บาท เมื่อซื้อ 6 ชิ้น ลด 10%'),
    card('HFSL-1', 3, 1, 'HFSL', 'อ่านชื่อสินค้าไม่ได้', 'เมื่อซื้อ 6 ชิ้น ลด 22%'),
  ];
  const signatures = Object.fromEntries(cards.map(item => [item.cardId, samePackSignature]));
  const resolved = resolveScopesSafely(cards, [family], signatures);
  assert.equal(resolved.get('HFSL-1')?.scope?.familyId, family.id);
  assert.equal(resolved.get('HFSL-1')?.method, 'visual_consensus');
});

test('รูปคล้ายแต่ลำดับห่างและไม่มีราคา ไม่ถูกลากเข้ากลุ่ม', () => {
  const cards = [
    card('HFSS-1', 1, 1, 'HFSS', 'GILLETTE มีดโกน ซุปเปอร์คลิ๊ก', 'ราคาแนะนำขายปลีก 29 บาท เมื่อซื้อ 6 ชิ้น ลด 15%'),
    card('HFSM-1', 2, 1, 'HFSM', 'GILLETTE มีดโกน ซุปเปอร์คลิ๊ก', 'ราคาแนะนำขายปลีก 29 บาท เมื่อซื้อ 6 ชิ้น ลด 10%'),
    card('HFSL-9', 3, 9, 'HFSL', 'อ่านชื่อสินค้าไม่ได้', 'เมื่อซื้อ 6 ชิ้น ลด 22%'),
  ];
  const signatures = Object.fromEntries(cards.map(item => [item.cardId, samePackSignature]));
  const resolved = resolveScopesSafely(cards, [family], signatures);
  assert.equal(resolved.get('HFSL-9')?.scope, null);
});
