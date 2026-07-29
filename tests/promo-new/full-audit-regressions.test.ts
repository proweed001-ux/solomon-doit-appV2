import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreGroupingResultImages, prepareGroupingWorkerCards } from '../../src/promo-new/admin/grouping-transport';
import { scorePromotionFamily } from '../../src/promo-new/domain/auto-match';
import { groupImportedCards, type GroupingResult } from '../../src/promo-new/domain/grouping';
import type { StoredPrice } from '../../src/promo-new/domain/pricing';
import type { ProductGroup, PromoCard, PromoDataset, PromotionFamily, PromotionTier, Sku, SkuPrice } from '../../src/promo-new/domain/types';
import { assertReadyForPublish } from '../../src/promo-new/domain/validation';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';
const MASTER_ID = 'MASTER-11111111-1111-5111-8111-111111111111';

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
  sourceText: '1 ขวด ลด 8%',
};

const family: PromotionFamily = {
  id: 'family:hs-140',
  familyKey: 'PF-HS-140',
  name: 'H&S แชมพู 140 มล.',
  scopeText: 'H&S แชมพู 140 มล. ทุกสูตร',
  sourceRows: [1],
  tiersByClass: { HFSS: [tier], HFSM: [tier] },
  failureReasons: [],
};

const master: Sku = {
  id: MASTER_ID,
  code: 'PM-HS-140',
  canonicalName: 'H&S แชมพู 140 มล.',
  identityKey: 'hsแชมพู140ml',
  identity: { brand: '', productType: '', variant: null, sizeValue: 0, sizeUnit: '', salesUnit: 'ขวด', packQuantity: 1 },
  status: 'active',
  evidence: ['H&S แชมพู 140 มล.', 'เฮดแอนด์โชว์เดอร์ แชมพู ขนาด 140 มล.'],
  failureReasons: [],
};

function imported(classId: string, page: number, productText: string, rawText = productText): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, 1),
    monthKey: MONTH,
    page,
    sequence: 1,
    classId,
    imageUrl: `data:image/webp;base64,${classId}`,
    rawText,
    productText,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: productText ? [] : ['product_text_missing'],
  };
}

function signature(seed: number): string {
  return seed.toString(16).padStart(2, '0').repeat(384);
}

test('legacy Product Master direct match and scope-recovered class share one Product Group', () => {
  const direct = imported('HFSS', 1, 'H&S แชมพู 140 มล.', 'ราคาแนะนำขายปลีก 49 บาท/ขวด H&S แชมพู 140 มล.');
  const recovered = imported('HFSM', 2, '', 'ราคาแนะนำขายปลีก 49 บาท/ขวด');
  const visual = signature(90);
  const prices: StoredPrice[] = [{
    skuIdentityKey: master.identityKey,
    skuId: master.id,
    amount: 49,
    currency: 'THB',
    sourceReference: 'legacy-master',
    updatedAt: new Date(0).toISOString(),
  }];
  const result = groupImportedCards(MONTH, [direct, recovered], [master], prices, [family], {
    [direct.cardId]: visual,
    [recovered.cardId]: visual,
  });
  assert.equal(result.quarantineCards.length, 0);
  assert.equal(result.groups.length, 1);
  assert.equal(result.groups[0].skuId, MASTER_ID);
  assert.deepEqual(result.groups[0].classIds, ['HFSM', 'HFSS']);
  assert.equal(result.groups[0].cardIds.length, 2);
  assert.ok(result.warnings.includes(`card:${recovered.cardId}:grouping_method:visual_consensus`));
});

test('size-specific Promotion Family is not auto-matched when Product Group has no size evidence', () => {
  const noSizeSku: Sku = {
    ...master,
    identity: { brand: 'H&S', productType: 'แชมพู', variant: null, sizeValue: 0, sizeUnit: '', salesUnit: 'ขวด', packQuantity: 1 },
  };
  const group = {
    id: 'group:no-size', monthKey: MONTH, skuId: noSizeSku.id, sku: noSizeSku,
    cardIds: ['card:no-size'], classIds: ['HFSS'], promotionFamilyId: null,
    price: { skuId: noSizeSku.id, pdfSourcePrice: null, centralOverridePrice: null, effectivePrice: null, source: 'missing', sourceReference: null, updatedAt: null },
    status: 'need_review', failureReasons: [],
  } satisfies ProductGroup;
  assert.equal(scorePromotionFamily(group, family), null);
});

function validDataset(): PromoDataset {
  const sku: Sku = {
    id: MASTER_ID,
    code: 'PM-HS-140',
    canonicalName: 'H&S แชมพู 140 มล.',
    identityKey: 'hsแชมพู140ml',
    identity: { brand: 'H&S', productType: 'แชมพู', variant: null, sizeValue: 140, sizeUnit: 'มล.', salesUnit: 'ขวด', packQuantity: 1 },
    status: 'active', evidence: [], failureReasons: [],
  };
  const price: SkuPrice = {
    skuId: sku.id,
    pdfSourcePrice: null,
    centralOverridePrice: { amount: 49, currency: 'THB' },
    effectivePrice: { amount: 49, currency: 'THB' },
    source: 'central_override', sourceReference: 'test', updatedAt: new Date(0).toISOString(),
  };
  const card: PromoCard = {
    id: 'CARD-VALID', monthKey: MONTH, page: 1, sequence: 1, classId: 'HFSS',
    imageUrl: 'data:image/webp;base64,AA==', skuId: sku.id, productGroupId: 'group:valid',
    promotionFamilyId: family.id, promotionTiers: [tier], price, status: 'ready',
    evidence: { rawText: sku.canonicalName, productText: sku.canonicalName, pageClassText: 'HFSS', confidence: 0.95, method: 'page_ocr', cropBounds: null },
    failureReasons: [],
  };
  const group: ProductGroup = {
    id: 'group:valid', monthKey: MONTH, skuId: sku.id, sku, cardIds: [card.id], classIds: ['HFSS'],
    promotionFamilyId: family.id, price, status: 'ready', failureReasons: [],
  };
  return {
    schema: 'promo-system-rebuild-v1',
    version: { id: 'draft-valid', monthKey: MONTH, revision: 1, status: 'draft', previousVersionId: null, createdAt: new Date(0).toISOString(), createdBy: 'test', publishedAt: null, source: { pdfName: 'promo.pdf', workbookName: 'promo.xlsm', pdfHash: null, workbookHash: null } },
    skus: [sku], prices: [price], cards: [card], productGroups: [group], promotionFamilies: [family], warnings: [],
  };
}

test('publish validation checks blockers and cross references, not ready labels alone', () => {
  const valid = validDataset();
  assert.equal(assertReadyForPublish(valid).ok, true);

  const candidate = structuredClone(valid);
  candidate.skus[0].status = 'candidate';
  candidate.skus[0].failureReasons = ['new_sku_requires_confirmation'];
  candidate.productGroups[0].sku = candidate.skus[0];
  const candidateResult = assertReadyForPublish(candidate);
  assert.equal(candidateResult.ok, false);
  assert.ok(candidateResult.errors.some(error => error.includes('sku_not_active')));

  const brokenLink = structuredClone(valid);
  brokenLink.cards[0].productGroupId = 'group:other';
  const linkResult = assertReadyForPublish(brokenLink);
  assert.equal(linkResult.ok, false);
  assert.ok(linkResult.errors.some(error => error.includes('card_group_not_found')));

  const duplicateGroup = structuredClone(valid);
  duplicateGroup.productGroups.push({ ...duplicateGroup.productGroups[0], id: 'group:duplicate' });
  const duplicateResult = assertReadyForPublish(duplicateGroup);
  assert.equal(duplicateResult.ok, false);
  assert.ok(duplicateResult.errors.includes('duplicate_product_group_for_sku'));
});

test('worker result must conserve every input card exactly once', () => {
  const source = [imported('HFSS', 1, 'H&S แชมพู 140 มล.'), imported('HFSM', 2, 'H&S แชมพู 140 มล.')];
  const prepared = prepareGroupingWorkerCards(source);
  const incomplete = {
    cards: [{ id: source[0].cardId, page: 1, sequence: 1, imageUrl: '' }],
    quarantineCards: [],
  } as unknown as GroupingResult;
  assert.throws(() => restoreGroupingResultImages(incomplete, prepared.imagesByPosition), /grouping_worker_card_count_mismatch/u);

  const duplicate = {
    cards: [
      { id: source[0].cardId, page: 1, sequence: 1, imageUrl: '' },
      { id: source[0].cardId, page: 2, sequence: 1, imageUrl: '' },
    ],
    quarantineCards: [],
  } as unknown as GroupingResult;
  assert.throws(() => restoreGroupingResultImages(duplicate, prepared.imagesByPosition), /grouping_worker_duplicate_card_id/u);
});

test('worker input rejects duplicate page and sequence even when images are identical', () => {
  const first = imported('HFSS', 1, 'H&S แชมพู 140 มล.');
  const second = { ...first, cardId: 'CARD-DUPLICATE' };
  assert.throws(() => prepareGroupingWorkerCards([first, second]), /duplicate_card_position:1:1/u);
});
