import test from 'node:test';
import assert from 'node:assert/strict';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { resolveScopesSafely } from '../../src/promo-new/domain/scope-safety';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';

function tier(classId: string): [string, PromotionTier[]] {
  return [classId, [{
    tierNo: 1,
    type: 'cash_discount',
    minQuantity: 6,
    maxQuantity: null,
    purchaseUnit: 'ชิ้น',
    discountPercent: 10,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: null,
    effectivePercentUsage: null,
    sourceText: 'ซื้อ 6 ชิ้น ลด 10%',
  }]];
}

function family(id: string, scopeText: string, classIds: string[]): PromotionFamily {
  return {
    id,
    familyKey: id.toUpperCase(),
    name: scopeText,
    scopeText,
    sourceRows: [2],
    tiersByClass: Object.fromEntries(classIds.map(classId => tier(classId))),
    failureReasons: [],
  };
}

function card(text: string, classId: string, page: number, sequence = 1): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, sequence),
    monthKey: MONTH,
    page,
    sequence,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: text,
    productText: text,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: text ? [] : ['product_text_missing'],
  };
}

function vectorSignature(first: number, second: number, repeats = 96): string {
  const pair = `${first.toString(16).padStart(2, '0')}${second.toString(16).padStart(2, '0')}`;
  return pair.repeat(repeats);
}

test('PT ต้องเป็นคำเดี่ยว ไม่อ่าน CAPTURE หรือ ADAPTER เป็น Pantene', () => {
  const promo = family('family:pantene-70', 'PT แชมพู 70 มล. ทุกสูตร', ['HFSS']);
  const falseAlias = card('CAPTURE แชมพู 70 ML', 'HFSS', 1);
  const realAlias = card('PT แชมพู 70 ML', 'HFSS', 2);
  const resolved = resolveScopesSafely([falseAlias, realAlias], [promo]);
  assert.equal(resolved.get(falseAlias.cardId)?.scope, null);
  assert.equal(resolved.get(falseAlias.cardId)?.method, 'unmatched');
  assert.equal(resolved.get(realAlias.cardId)?.scope?.brand, 'PANTENE');
  assert.equal(resolved.get(realAlias.cardId)?.method, 'structured_scope');
});

test('สูตรที่ระบุหลังคำว่ายกเว้น CM และ AF ต้องไม่เข้า Product Scope', () => {
  const promo = family('family:hs-370', 'H&S แชมพู 370 มล. ทุกสูตร ยกเว้น CM, AF', ['HFSS', 'HFSM']);
  const excluded = card('H&S แชมพู CM 370 มล.', 'HFSS', 1);
  const normal = card('H&S แชมพู COOL 370 มล.', 'HFSM', 2);
  const resolved = resolveScopesSafely([excluded, normal], [promo]);
  assert.equal(resolved.get(excluded.cardId)?.scope, null);
  assert.equal(resolved.get(excluded.cardId)?.method, 'unmatched');
  assert.equal(resolved.get(normal.cardId)?.scope?.familyId, promo.id);
});

test('การ์ดที่กู้ด้วยภาพห้ามกลายเป็น anchor ส่งความผิดไป Class ถัดไป', () => {
  const promo = family('family:vicks-5', 'VICKS ขนาด 5 กรัม', ['HFSS', 'HFSM', 'HFSL']);
  const anchor = card('VICKS Vaporub 5 กรัม ราคาแนะนำขายปลีก 30 บาท/ชิ้น', 'HFSS', 1, 1);
  const recovered = card('', 'HFSM', 2, 1);
  recovered.rawText = 'ราคาแนะนำขายปลีก 30 บาท/ชิ้น';
  const third = card('', 'HFSL', 3, 1);
  third.rawText = 'ราคาแนะนำขายปลีก 30 บาท/ชิ้น';

  const resolved = resolveScopesSafely([anchor, recovered, third], [promo], {
    [anchor.cardId]: vectorSignature(255, 0),
    [recovered.cardId]: vectorSignature(247, 62),
    [third.cardId]: vectorSignature(225, 120),
  });

  assert.equal(resolved.get(anchor.cardId)?.method, 'structured_scope');
  assert.equal(resolved.get(recovered.cardId)?.method, 'visual_consensus');
  assert.equal(resolved.get(third.cardId)?.scope, null);
  assert.equal(resolved.get(third.cardId)?.method, 'unmatched');
});
