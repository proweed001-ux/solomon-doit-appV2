import assert from 'node:assert/strict';
import test from 'node:test';
import { repairCardsWithMasterBackedScopes } from '../../src/promo-new/domain/master-backed-card-repair';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { createSkuCandidate } from '../../src/promo-new/domain/sku-identity';
import type { PromotionFamily, PromotionTier, Sku } from '../../src/promo-new/domain/types';
import { chooseTrustedCardHeaderText } from '../../src/promo-new/import/card-header-ocr';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

const MONTH = 'PROMO-2026-07';

const tier: PromotionTier = {
  tierNo: 1,
  type: 'cash_discount',
  minQuantity: 1,
  maxQuantity: null,
  purchaseUnit: 'ขวด',
  discountPercent: 8,
  freeQuantity: 0,
  rewardUnit: null,
  bundlePrice: null,
  effectivePercent: null,
  effectivePercentUsage: null,
  sourceText: 'ขั้นต่ำ 1 ขวด ลด 8%',
};

const smallFamily: PromotionFamily = {
  id: 'family:hs-60-65',
  familyKey: 'PF-HS-60-65',
  name: 'H&S แชมพู 60-65 มล.',
  scopeText: 'H&S แชมพู 60-65 มล. ทุกสูตร',
  sourceRows: [157],
  tiersByClass: { HFSS: [tier], HFSM: [tier] },
  failureReasons: [],
};

const largeFamily: PromotionFamily = {
  id: 'family:hs-120-140',
  familyKey: 'PF-HS-120-140',
  name: 'H&S แชมพู 120-140 มล.',
  scopeText: 'H&S แชมพู 120-140 มล. ทุกสูตร',
  sourceRows: [158],
  tiersByClass: { HFSS: [tier], HFSM: [tier] },
  failureReasons: [],
};

function master(size: number): Sku {
  return {
    id: `MASTER-HS-${size}`,
    code: `PM-HS-${size}`,
    canonicalName: `H&S แชมพู ${size} มล. ขวด`,
    identityKey: `H&S|แชมพู||${size.toFixed(3)}|มล|ขวด|1`,
    identity: {
      brand: 'H&S',
      productType: 'แชมพู',
      variant: null,
      sizeValue: size,
      sizeUnit: 'มล.',
      salesUnit: 'ขวด',
      packQuantity: 1,
    },
    status: 'active',
    evidence: [`H&S แชมพู ${size} มล.`],
    failureReasons: [],
  };
}

function card(classId: string, page: number, productText: string): ImportedCardCandidate {
  return {
    cardId: `CARD-${classId}-${page}`,
    monthKey: MONTH,
    page,
    sequence: 1,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: productText,
    productText,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('JUL26 H&S 65 uses repeated OCR size evidence and rejects a one-off 365 reading', () => {
  const selected = chooseTrustedCardHeaderText('H&S แชมพู ทุกสูตร', [
    'H&S แชมพู ทุกสูตร ขนาด 365 มล.',
    'เฮดแอนด์โชว์เดอร์ แชมพู ทุกสูตร ขนาด 65 มล.',
    'H&S แชมพู ทุกสูตร ขนาด 65 มล.',
  ]);
  const parsed = createSkuCandidate(selected);
  assert.equal(parsed.identity.sizeValue, 65);
  assert.equal(parsed.identity.sizeUnit, 'มล.');

  const untrusted = chooseTrustedCardHeaderText('H&S แชมพู ทุกสูตร', [
    'H&S แชมพู ทุกสูตร ขนาด 365 มล.',
  ]);
  assert.equal(createSkuCandidate(untrusted).identity.sizeValue, 0);
});

test('JUL26 H&S 140 range is canonicalized to the unique active 140 ml Product Master', () => {
  const existing = [master(65), master(140)];
  const source = card('HFSM', 4, 'เฮดแอนด์โชว์เดอร์ แชมพู ทุกสูตร ขนาด 140 มล.');
  const repaired = repairCardsWithMasterBackedScopes(source ? [source] : [], [smallFamily, largeFamily], existing);
  assert.equal(repaired.repaired, 1);
  assert.equal(repaired.cards[0].productText, 'H&S แชมพู 140 มล. ขวด');

  const grouped = groupImportedCards(MONTH, repaired.cards, existing, [], [smallFamily, largeFamily]);
  assert.equal(grouped.quarantineCards.length, 0);
  assert.equal(grouped.groups.length, 1);
  assert.equal(grouped.groups[0].skuId, 'MASTER-HS-140');
  assert.deepEqual(grouped.groups[0].classIds, ['HFSM']);
});

test('JUL26 H&S 365 conflict is quarantined instead of becoming a new exact-identity SKU', () => {
  const existing = [master(65), master(140)];
  const source = card('HFSS', 1, 'H&S แชมพู 365 มล. ขวด');
  const repaired = repairCardsWithMasterBackedScopes([source], [smallFamily, largeFamily], existing);
  assert.equal(repaired.rejectedConflictingSizes, 1);
  assert.ok(repaired.cards[0].failureReasons.includes('ocr_size_conflicts_workbook_scope'));
  assert.equal(createSkuCandidate(repaired.cards[0].productText).identity.sizeValue, 0);

  const grouped = groupImportedCards(MONTH, repaired.cards, existing, [], [smallFamily, largeFamily]);
  assert.equal(grouped.groups.some(group => group.sku.identity.sizeValue === 365), false);
  assert.equal(grouped.quarantineCards.length, 1);
});
