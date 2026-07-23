import assert from 'node:assert/strict';
import test from 'node:test';
import type { PromoDataset, PromotionTier, Sku } from '../../src/promo-new/domain/types';
import { buildLegacyUploadPlan, legacyMasterIdentity } from '../../src/promo-new/shared/legacy-system';

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

function dataset(variant: string): PromoDataset {
  const sku: Sku = {
    id: `sku:${variant}`,
    code: `SKU-${variant}`,
    canonicalName: `H&S แชมพู ${variant} 140 มล.`,
    identityKey: `H&S|แชมพู|${variant}|140|มล.|ขวด|1`,
    identity: {
      brand: 'H&S',
      productType: 'แชมพู',
      variant,
      sizeValue: 140,
      sizeUnit: 'มล.',
      salesUnit: 'ขวด',
      packQuantity: 1,
    },
    status: 'active',
    evidence: [],
    failureReasons: [],
  };
  const price = {
    skuId: sku.id,
    pdfSourcePrice: null,
    centralOverridePrice: { amount: 41.15, currency: 'THB' as const },
    effectivePrice: { amount: 41.15, currency: 'THB' as const },
    source: 'central_override' as const,
    sourceReference: 'test',
    updatedAt: new Date(0).toISOString(),
  };
  return {
    schema: 'promo-system-rebuild-v1',
    version: {
      id: 'draft-test',
      monthKey: 'PROMO-2026-07',
      revision: 1,
      status: 'draft',
      previousVersionId: null,
      createdAt: new Date(0).toISOString(),
      createdBy: 'test',
      publishedAt: null,
      source: { pdfName: 'promo.pdf', workbookName: 'promo.xlsm', pdfHash: null, workbookHash: null },
    },
    skus: [sku],
    prices: [price],
    cards: [{
      id: 'CARD-TEST',
      monthKey: 'PROMO-2026-07',
      page: 1,
      sequence: 1,
      classId: 'HFSS',
      imageUrl: 'data:image/webp;base64,AA==',
      skuId: sku.id,
      productGroupId: 'group:test',
      promotionFamilyId: 'family:test',
      promotionTiers: [tier],
      price,
      status: 'ready',
      evidence: {
        rawText: sku.canonicalName,
        productText: sku.canonicalName,
        pageClassText: 'HFSS',
        confidence: 0.95,
        method: 'page_ocr',
        cropBounds: null,
      },
      failureReasons: [],
    }],
    productGroups: [{
      id: 'group:test',
      monthKey: 'PROMO-2026-07',
      skuId: sku.id,
      sku,
      cardIds: ['CARD-TEST'],
      classIds: ['HFSS'],
      promotionFamilyId: 'family:test',
      price,
      status: 'ready',
      failureReasons: [],
    }],
    promotionFamilies: [{
      id: 'family:test',
      familyKey: 'PF-TEST',
      name: 'H&S test',
      scopeText: sku.canonicalName,
      sourceRows: [1],
      tiersByClass: { HFSS: [tier] },
      failureReasons: [],
    }],
    warnings: [],
  };
}

test('new Product Master ID is derived from the exact normalized key sent to Edge', async () => {
  const plan = await buildLegacyUploadPlan(dataset('คูลเมนทอล'));
  const card = plan.cards[0];
  assert.equal(card.master_is_new, true);
  assert.equal(card.master_product_id, await legacyMasterIdentity(card.master_normalized_key));
});

test('different variants remain different through the complete legacy upload plan', async () => {
  const cool = (await buildLegacyUploadPlan(dataset('คูลเมนทอล'))).cards[0];
  const smooth = (await buildLegacyUploadPlan(dataset('สมูทแอนด์ซิลกี้'))).cards[0];
  assert.notEqual(cool.master_normalized_key, smooth.master_normalized_key);
  assert.notEqual(cool.master_product_id, smooth.master_product_id);
});
