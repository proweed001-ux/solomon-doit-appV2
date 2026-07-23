import test from 'node:test';
import assert from 'node:assert/strict';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';

function tiers(classId: string): Record<string, PromotionTier[]> {
  return { [classId]: [{
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
  }] };
}

function family(id: string, scopeText: string, classId: string): PromotionFamily {
  return {
    id,
    familyKey: id.toUpperCase(),
    name: scopeText,
    scopeText,
    sourceRows: [2],
    tiersByClass: tiers(classId),
    failureReasons: [],
  };
}

function card(productText: string, rawText: string, classId: string, sequence: number): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, 1, sequence),
    monthKey: MONTH,
    page: 1,
    sequence,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText,
    productText,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('Gillette ใบมีดซุปเปอร์ธินไม่รวมกับซุปเปอร์ธิน ทู รุ่นแผง', () => {
  const classId = 'HFSL';
  const blade = family('family:gillette-superthin-blade', 'ยิลเลตต์ ใบมีด ซุปเปอร์ธิน', classId);
  const superThinTwo = family('family:gillette-superthin-two', 'ยิลเลตต์ ซุปเปอร์ธิน ทู รุ่นแผง', classId);
  const grouped = groupImportedCards(MONTH, [
    card('GILLETTE ใบมีด ซุปเปอร์ธิน', 'ราคาแนะนำขายปลีก 29 บาท/กล่อง ยิลเลตต์ ใบมีด ซุปเปอร์ธิน', classId, 1),
    card('GILLETTE ซุปเปอร์ธิน ทู รุ่นแผง', 'ราคาแนะนำขายปลีก 25 บาท/ด้าม ยิลเลตต์ ซุปเปอร์ธิน ทู รุ่นแผง', classId, 2),
  ], [], [], [blade, superThinTwo]);
  assert.equal(grouped.groups.length, 2);
  assert.deepEqual(new Set(grouped.groups.map(group => group.promotionFamilyId)), new Set([blade.id, superThinTwo.id]));
});

test('คำหลังยกเว้นไม่ถูกใช้จับ Safeguard เป็นสูตรที่ถูกยกเว้น', () => {
  const classId = 'HFSS';
  const purePink = family('family:safeguard-pure-pink', 'เซฟการ์ด สบู่ Pure White / Pink Aloe 58 กรัม', classId);
  const otherFormula = family('family:safeguard-other', 'เซฟการ์ด สบู่สูตรอื่น ขนาด 48-58 กรัม ยกเว้น Pure White และ Pink Aloe', classId);
  const grouped = groupImportedCards(MONTH, [
    card(
      'SAFEGUARD สบู่สูตรอื่น 58 กรัม',
      'เซฟการ์ด สบู่สูตรอื่น ขนาด 58 กรัม ยกเว้น Pure White และ Pink Aloe ราคาแนะนำขายปลีก 15.5 บาท/ชิ้น',
      classId,
      1,
    ),
  ], [], [], [purePink, otherFormula]);
  assert.equal(grouped.groups.length, 1);
  assert.equal(grouped.groups[0].promotionFamilyId, otherFormula.id);
});
