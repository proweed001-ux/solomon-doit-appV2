import assert from 'node:assert/strict';
import test from 'node:test';
import { applyPromotionFamily, groupImportedCards } from '../../src/promo-new/domain/grouping';
import { attachMasterMatchAuditEvidence } from '../../src/promo-new/domain/master-match-audit';
import type { PromoDataset, PromotionFamily, PromotionTier, Sku } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { buildLegacyUploadPlan } from '../../src/promo-new/shared/legacy-system';

const masterId = 'MASTER-11111111-1111-5111-8111-111111111111';

const master: Sku = {
  id: masterId,
  code: 'PM-HS-140',
  canonicalName: 'H&S แชมพู 140 มล.',
  identityKey: 'legacy-hs-140',
  identity: {
    brand: '',
    productType: '',
    variant: null,
    sizeValue: 0,
    sizeUnit: '',
    salesUnit: 'ขวด',
    packQuantity: 1,
  },
  status: 'active',
  evidence: ['เฮดแอนด์โชว์เดอร์ แชมพู ขนาด 140 มล.', 'H&S SHAMPOO 140 ML'],
  failureReasons: [],
};

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
  scopeText: 'H&S แชมพู 140 มล.',
  sourceRows: [1],
  tiersByClass: { HFSS: [tier] },
  failureReasons: [],
};

const source: ImportedCardCandidate = {
  cardId: 'CARD-PROMO-2026-07-HFSS-P001-C001',
  monthKey: 'PROMO-2026-07',
  page: 1,
  sequence: 1,
  classId: 'HFSS',
  imageUrl: 'data:image/webp;base64,AA==',
  rawText: 'เฮดแอนโชเดอ แซมพู 14O บล. 1 ขวด ลด 8%',
  productText: 'เฮดแอนโชเดอ แซมพู 14O บล.',
  pageClassText: 'HFSS',
  confidence: 0.91,
  evidenceMethod: 'page_ocr',
  bounds: { x: 0, y: 0, width: 100, height: 100 },
  failureReasons: [],
};

function buildDataset(): PromoDataset {
  const grouped = groupImportedCards(
    'PROMO-2026-07',
    [source],
    [master],
    [{
      skuIdentityKey: master.identityKey,
      skuId: master.id,
      amount: 41.15,
      currency: 'THB',
      sourceReference: 'master-price',
      updatedAt: new Date(0).toISOString(),
    }],
    [family],
    {},
  );
  const audited = attachMasterMatchAuditEvidence(grouped, [source], [master], [family], {});
  assert.equal(audited.groups.length, 1);
  const applied = applyPromotionFamily(audited.groups[0], audited.cards, family);
  return {
    schema: 'promo-system-rebuild-v1',
    version: {
      id: 'draft-audit',
      monthKey: 'PROMO-2026-07',
      revision: 1,
      status: 'draft',
      previousVersionId: null,
      createdAt: new Date(0).toISOString(),
      createdBy: 'test',
      publishedAt: null,
      source: { pdfName: 'promo.pdf', workbookName: 'promo.xlsm', pdfHash: null, workbookHash: null },
    },
    skus: audited.skus,
    prices: audited.prices,
    cards: applied.cards,
    productGroups: [applied.group],
    promotionFamilies: [family],
    warnings: audited.warnings,
  };
}

test('real matcher score, margin and method reach the legacy upload plan unchanged', async () => {
  const dataset = buildDataset();
  assert.equal(dataset.cards.length, 1);
  assert.equal(dataset.cards[0].status, 'ready');
  assert.equal(dataset.productGroups[0].status, 'ready');
  const evidence = dataset.cards[0].evidence;
  assert.equal(evidence.masterMatchMethod, 'master_text');
  assert.ok(Number(evidence.masterMatchScore) >= 85);
  assert.ok(Number(evidence.masterMatchMargin) >= 8);
  const plan = await buildLegacyUploadPlan(dataset);
  assert.equal(plan.cards[0].master_product_id, masterId.slice(7).toLowerCase());
  assert.equal(plan.cards[0].master_match_score, evidence.masterMatchScore);
  assert.equal(plan.cards[0].master_match_margin, evidence.masterMatchMargin);
  assert.equal(plan.cards[0].detection_method, 'promo_system_rebuild_master_text');
});

test('legacy plan blocks an existing Product Master when matcher evidence is absent', async () => {
  const dataset = buildDataset();
  dataset.cards = dataset.cards.map(card => ({
    ...card,
    evidence: { ...card.evidence, masterMatchScore: null, masterMatchMargin: null, masterMatchMethod: null },
  }));
  await assert.rejects(() => buildLegacyUploadPlan(dataset), /legacy_master_match_evidence_missing/u);
});
