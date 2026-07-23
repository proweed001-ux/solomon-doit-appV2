import test from 'node:test';
import assert from 'node:assert/strict';
import type { PromoDataset, PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { autoAssignPromotionFamilies } from '../../src/promo-new/domain/auto-match';
import { calculatePromotion, selectPromotionTier } from '../../src/promo-new/domain/calculator';
import { buildSkuDisplayName, groupImportedCards } from '../../src/promo-new/domain/grouping';
import { confirmSkuCandidate, createSkuCandidate } from '../../src/promo-new/domain/sku-identity';
import { nextDraftVersion } from '../../src/promo-new/domain/versioning';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';

function imported(productText: string, classId: string, page: number): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, 1),
    monthKey: MONTH,
    page,
    sequence: 1,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: productText,
    productText,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'pdf_text',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

function tier(classId: string, discount = 10): [string, PromotionTier[]] {
  return [classId, [{
    tierNo: 1,
    type: 'cash_discount',
    minQuantity: 3,
    maxQuantity: null,
    purchaseUnit: 'ขวด',
    discountPercent: discount,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: null,
    effectivePercentUsage: null,
    sourceText: `ซื้อ 3 ขวด ลด ${discount}%`,
  }]];
}

function family(id: string, scopeText: string): PromotionFamily {
  return {
    id,
    familyKey: id.toUpperCase(),
    name: scopeText,
    scopeText,
    sourceRows: [2],
    tiersByClass: Object.fromEntries([tier('HFSS'), tier('HFSM', 12)]),
    failureReasons: [],
  };
}

test('ช่วง Tier ที่มี max ไม่ให้ส่วนลดเมื่อซื้อเกินช่วง', () => {
  const range: PromotionTier = {
    tierNo: 1,
    type: 'cash_discount',
    minQuantity: 1,
    maxQuantity: 2,
    purchaseUnit: 'ชิ้น',
    discountPercent: 24,
    freeQuantity: 0,
    rewardUnit: null,
    bundlePrice: null,
    effectivePercent: null,
    effectivePercentUsage: null,
    sourceText: 'ซื้อ 1-2 ชิ้น ลด 24%',
  };
  assert.equal(selectPromotionTier([range], 3).active, null);
  const result = calculatePromotion(100, 3, [range]);
  assert.equal(result.cashDiscount, 0);
  assert.equal(result.netAmount, 300);
});

test('ชื่อแสดงผลสร้างจาก identity ไม่แสดงประโยค OCR ดิบ', () => {
  const sku = createSkuCandidate('แพ น ท ี น แช ม พ ู ๑ ท ุ ก ส ู ต ร ขนาด 70 ม ล.');
  const name = buildSkuDisplayName(sku);
  assert.match(name, /PANTENE/u);
  assert.match(name, /แชมพู/u);
  assert.match(name, /70 มล\./u);
  assert.doesNotMatch(name, /แพ น ท/u);
});

test('โหลด SKU และราคาเดิมได้ แต่ Promotion Family ที่ดูตรงยังต้องตรวจราย Card', () => {
  const sku = confirmSkuCandidate(createSkuCandidate('Pantene แชมพู ทุกสูตร ขนาด 70 มล. ขวด'));
  const grouped = groupImportedCards(MONTH, [
    imported('Pantene แชมพู ทุกสูตร ขนาด 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู ทุกสูตร ขนาด 70 มล. ขวด', 'HFSM', 2),
  ], [sku], [{
    skuIdentityKey: sku.identityKey,
    skuId: sku.id,
    amount: 19.75,
    currency: 'THB',
    sourceReference: 'previous_month',
    updatedAt: '2026-07-01T00:00:00Z',
  }]);
  const dataset: PromoDataset = {
    schema: 'promo-system-rebuild-v1',
    version: nextDraftVersion(MONTH, [], null),
    skus: grouped.skus,
    prices: grouped.prices,
    cards: grouped.cards,
    productGroups: grouped.groups,
    promotionFamilies: [family('family:pantene-70', 'Pantene แชมพู 70 มล. ทุกสูตร')],
    warnings: [],
  };
  const result = autoAssignPromotionFamilies(dataset);
  assert.equal(result.matched, 0);
  assert.equal(result.unmatched, 1);
  assert.equal(result.dataset.productGroups[0].promotionFamilyId, null);
  assert.equal(result.dataset.productGroups[0].price.effectivePrice?.amount, 19.75);
  assert.equal(result.dataset.productGroups[0].status, 'need_review');
  assert.deepEqual(result.dataset.cards.map(card => card.status), ['need_review', 'need_review']);
  assert.ok(result.dataset.cards.every(card => card.promotionFamilyId === null && card.promotionTiers.length === 0));
});

test('Family ที่คะแนนสูสีกันไม่ถูกเลือกอัตโนมัติ', () => {
  const sku = confirmSkuCandidate(createSkuCandidate('Pantene แชมพู ทุกสูตร ขนาด 70 มล. ขวด'));
  const grouped = groupImportedCards(MONTH, [imported('Pantene แชมพู ทุกสูตร ขนาด 70 มล. ขวด', 'HFSS', 1)], [sku], [{
    skuIdentityKey: sku.identityKey,
    skuId: sku.id,
    amount: 20,
    currency: 'THB',
    sourceReference: 'previous_month',
    updatedAt: '2026-07-01T00:00:00Z',
  }]);
  const first = family('family:first', 'Pantene แชมพู 70 มล. ทุกสูตร');
  first.tiersByClass = Object.fromEntries([tier('HFSS')]);
  const second = family('family:second', 'Pantene แชมพู 70 มล. ทุกสูตร');
  second.tiersByClass = Object.fromEntries([tier('HFSS', 12)]);
  const dataset: PromoDataset = {
    schema: 'promo-system-rebuild-v1',
    version: nextDraftVersion(MONTH, [], null),
    skus: grouped.skus,
    prices: grouped.prices,
    cards: grouped.cards,
    productGroups: grouped.groups,
    promotionFamilies: [first, second],
    warnings: [],
  };
  const result = autoAssignPromotionFamilies(dataset);
  assert.equal(result.matched, 0);
  assert.equal(result.ambiguous, 1);
  assert.equal(result.dataset.productGroups[0].promotionFamilyId, null);
});
