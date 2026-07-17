import test from 'node:test';
import assert from 'node:assert/strict';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { buildProductScopes, resolveScopesWithVisualConsensus } from '../../src/promo-new/domain/scope-matcher';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';
const CLASSES = ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'];

function imported(productText: string, classId: string, page: number, sequence = 1): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, sequence),
    monthKey: MONTH,
    page,
    sequence,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: productText,
    productText,
    pageClassText: classId,
    confidence: 0.94,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: productText ? [] : ['product_text_missing'],
  };
}

function tiers(classIds = CLASSES): Record<string, PromotionTier[]> {
  return Object.fromEntries(classIds.map((classId, index) => [classId, [{
    tierNo: 1,
    type: 'cash_discount',
    minQuantity: 6,
    maxQuantity: null,
    purchaseUnit: 'ขวด',
    discountPercent: 10 + index,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: null,
    effectivePercentUsage: null,
    sourceText: `ซื้อ 6 ขวด ลด ${10 + index}%`,
  }]]));
}

function family(id: string, scopeText: string, classIds = CLASSES): PromotionFamily {
  return {
    id,
    familyKey: id.toUpperCase(),
    name: scopeText,
    scopeText,
    sourceRows: [2],
    tiersByClass: tiers(classIds),
    failureReasons: [],
  };
}

function repeatedHex(value: number): string {
  return value.toString(16).padStart(2, '0').repeat(192);
}

test('H&S 140 มล. OCR ต่างกันรวมเป็นกลุ่มเดียวครบหก Class ด้วย Product Scope', () => {
  const promo = family('family:hair-120-140', 'เฮดแอนด์โชว์เดอร์ แชมพู 120-140 มล. / แพนทีน แชมพูและครีมนวด 100-120 มล. ทุกสูตร');
  const evidence = [
    'H&S แชมพู ทุกสูตร ขนาด 140 มล.',
    'เฮดแอนด์โชว์เดอร์ แชมพู 140 มล. สูตรเย็น',
    'เฮดแอนด์โชว์เตอร์ แซมพู ขนาด 140 มล.',
    'H&S SHAMPOO 140 ML COOL',
    'เฮดแอนด์โชว์เดอร์ แชมพู 140 มล. ชมพู',
    'H&S แชมพู 140 มล. ทุกสูร',
  ];
  const grouped = groupImportedCards(MONTH, evidence.map((text, index) => imported(text, CLASSES[index], index + 1)), [], [], [promo]);
  assert.equal(grouped.quarantineCards.length, 0);
  assert.equal(grouped.groups.length, 1);
  assert.equal(grouped.groups[0].cardIds.length, 6);
  assert.deepEqual(grouped.groups[0].classIds, [...CLASSES].sort());
  assert.equal(grouped.groups[0].promotionFamilyId, promo.id);
});

test('Family รวมหลายแบรนด์ถูกขยายเป็น Product Scope แยก H&S Pantene Rejoice และแชมพู/ครีมนวด', () => {
  const promo = family('family:hair-small', 'H&S แชมพู 60-65 มล / PT แชมพูและครีมนวด 60-70 มล / รีจ้อยส์ แชมพูและครีมนวด 60-70 มล ทุกสูตร');
  const scopes = buildProductScopes([promo]);
  const identities = scopes.map(scope => `${scope.brand}|${scope.productType}`);
  assert.ok(identities.includes('H&S|แชมพู'));
  assert.ok(identities.includes('PANTENE|แชมพู'));
  assert.ok(identities.includes('PANTENE|ครีมนวด'));
  assert.ok(identities.includes('REJOICE|แชมพู'));
  assert.ok(identities.includes('REJOICE|ครีมนวด'));
});

test('Pantene แชมพูและครีมนวดขนาดเดียวกันไม่ถูกรวมแม้อยู่ Promotion Family เดียว', () => {
  const promo = family('family:pantene-small', 'แพนทีน แชมพูและครีมนวด 60-70 มล. ทุกสูตร', ['HFSS']);
  const grouped = groupImportedCards(MONTH, [
    imported('Pantene แชมพู ทุกสูตร 70 มล.', 'HFSS', 1, 1),
    imported('Pantene ครีมนวด ทุกสูตร 60 มล.', 'HFSS', 1, 2),
  ], [], [], [promo]);
  assert.equal(grouped.groups.length, 2);
  assert.deepEqual(grouped.groups.map(group => group.sku.identity.productType).sort(), ['ครีมนวด', 'แชมพู']);
});

test('Olay ซองมีฝาและไม่มีฝาไม่ถูกรวมเป็น SKU เดียว', () => {
  const withCap = family('family:olay-cap', 'โอเลย์ โททัลไวท์ ซอง มีฝา', ['HFSS', 'HFSM']);
  const withoutCap = family('family:olay-no-cap', 'โอเลย์ โททัลไวท์ ซอง ไม่มีฝา', ['HFSS', 'HFSM']);
  const grouped = groupImportedCards(MONTH, [
    imported('โอเลย์ โททัลไวท์ ซอง มีฝา', 'HFSS', 1),
    imported('โอเลย์ โททัลไวท์ ซอง ไม่มีฝา', 'HFSM', 2),
  ], [], [], [withCap, withoutCap]);
  assert.equal(grouped.groups.length, 2);
  assert.notEqual(grouped.groups[0].sku.identityKey, grouped.groups[1].sku.identityKey);
  assert.deepEqual(new Set(grouped.groups.map(group => group.promotionFamilyId)), new Set([withCap.id, withoutCap.id]));
});

test('ภาพข้าม Class ช่วยกู้การ์ดที่ไม่มีข้อความเมื่อมีผู้ชนะชัดเจน', () => {
  const promo = family('family:vicks-5', 'วิคส์ ขนาด 5 กรัม', ['HFSS', 'HFSM']);
  const reference = imported('VICKS Vaporub 5 กรัม', 'HFSS', 1);
  const missing = imported('', 'HFSM', 2);
  const signatures = {
    [reference.cardId]: repeatedHex(80),
    [missing.cardId]: repeatedHex(80),
  };
  const resolutions = resolveScopesWithVisualConsensus([reference, missing], [promo], signatures);
  assert.equal(resolutions.get(reference.cardId)?.method, 'structured_scope');
  assert.equal(resolutions.get(missing.cardId)?.method, 'visual_consensus');
  const grouped = groupImportedCards(MONTH, [reference, missing], [], [], [promo], signatures);
  assert.equal(grouped.groups.length, 1);
  assert.equal(grouped.groups[0].cardIds.length, 2);
  assert.equal(grouped.quarantineCards.length, 0);
});

test('ภาพที่คล้ายสอง Product Scope เท่ากันไม่ถูกเดาอัตโนมัติ', () => {
  const small = family('family:vicks-5', 'วิคส์ ขนาด 5 กรัม', ['HFSS', 'HFSXL']);
  const large = family('family:vicks-10', 'วิคส์ ขนาด 10 กรัม', ['HFSM', 'HFSXL']);
  const five = imported('VICKS Vaporub 5 กรัม', 'HFSS', 1);
  const ten = imported('VICKS Vaporub 10 กรัม', 'HFSM', 2);
  const unknown = imported('', 'HFSXL', 3);
  const same = repeatedHex(90);
  const resolutions = resolveScopesWithVisualConsensus([five, ten, unknown], [small, large], {
    [five.cardId]: same,
    [ten.cardId]: same,
    [unknown.cardId]: same,
  });
  assert.equal(resolutions.get(unknown.cardId)?.scope, null);
  assert.equal(resolutions.get(unknown.cardId)?.method, 'unmatched');
});

test('Downy สูตรเฉพาะชนะขอบเขตทุกสูตร และการ์ดที่ไม่มีชื่อสูตรไม่ถูกบังคับเข้าสูตรเฉพาะ', () => {
  const generic = family('family:downy-all', 'ดาวน์นี่ ปรับผ้านุ่ม ทุกสูตร ขนาด 470-700 มล.', ['HFSS']);
  const passion = family('family:downy-passion', 'ดาวน์นี่ ปรับผ้านุ่ม สูตร Passion ขนาด 480 มล.', ['HFSS']);
  const passionGrouped = groupImportedCards(MONTH, [
    imported('DOWNY ปรับผ้านุ่ม PASSION 480 มล.', 'HFSS', 1),
  ], [], [], [generic, passion]);
  assert.equal(passionGrouped.groups.length, 1);
  assert.equal(passionGrouped.groups[0].promotionFamilyId, passion.id);

  const genericGrouped = groupImportedCards(MONTH, [
    imported('DOWNY ปรับผ้านุ่ม ทุกสูตร 480 มล.', 'HFSS', 2),
  ], [], [], [generic, passion]);
  assert.equal(genericGrouped.groups.length, 1);
  assert.equal(genericGrouped.groups[0].promotionFamilyId, generic.id);
});

test('Pantene แชมพู/ครีมนวดขนาดใหญ่เป็น Product Scope เดียวแต่ไม่สร้าง SKU ราคาเดียวอัตโนมัติ', () => {
  const promo = family('family:pantene-large-composite', 'แพนทีน แชมพู/ครีมนวด ขนาด 380 มล. ทุกสูตร', ['HFSS', 'HFSM']);
  const scopes = buildProductScopes([promo]);
  assert.equal(scopes.length, 1);
  assert.equal(scopes[0].productType, 'แชมพู/ครีมนวด');
  const grouped = groupImportedCards(MONTH, [
    imported('Pantene แชมพู / ครีมนวด ทุกสูตร 380 มล.', 'HFSS', 1),
    imported('Pantene shampoo conditioner 380 ml', 'HFSM', 2),
  ], [], [], [promo]);
  assert.equal(grouped.groups.length, 1);
  assert.equal(grouped.groups[0].cardIds.length, 2);
  assert.equal(grouped.groups[0].sku.status, 'quarantine');
  assert.ok(grouped.groups[0].sku.failureReasons.includes('scope_composite_requires_master_confirmation'));
});
