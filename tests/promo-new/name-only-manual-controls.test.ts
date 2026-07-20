import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { autoAssignPromotionFamilies } from '../../src/promo-new/domain/auto-match';
import type { PromoDataset } from '../../src/promo-new/domain/types';

test('name-only mode leaves Promotion Family unassigned for manual dropdown selection', () => {
  const dataset = {
    warnings: ['grouping:mode:name_only'],
    promotionFamilies: [{
      id: 'family:matching',
      familyKey: 'HNS-140',
      name: 'H&S แชมพู 140 มล.',
      scopeText: 'H&S แชมพู 120-140 มล.',
      sourceRows: [1],
      tiersByClass: { HFSS: [{ sourceText: '1 ขวด ลด 8%' }] },
      failureReasons: [],
    }],
    productGroups: [{
      id: 'group:1',
      promotionFamilyId: null,
      classIds: ['HFSS'],
      sku: {
        identity: { brand: 'H&S', productType: 'แชมพู', sizeValue: 140, sizeUnit: 'มล.', variant: null },
        canonicalName: 'H&S แชมพู 140 มล.',
        evidence: ['H&S แชมพู 140 มล.'],
      },
    }],
    cards: [{ id: 'card:1', productGroupId: 'group:1', promotionFamilyId: null, promotionTiers: [] }],
  } as unknown as PromoDataset;

  const result = autoAssignPromotionFamilies(dataset);
  assert.equal(result.matched, 0);
  assert.equal(result.ambiguous, 0);
  assert.equal(result.unmatched, 1);
  assert.equal(result.dataset.productGroups[0].promotionFamilyId, null);
  assert.equal(result.dataset.cards[0].promotionFamilyId, null);
  assert.deepEqual(result.dataset.cards[0].promotionTiers, []);
  assert.ok(result.dataset.warnings.includes('promotion_family_manual_selection_required'));
});

test('runtime grouping cannot use stored prices, CSV families, visual evidence or full-card text', () => {
  const worker = readFileSync('src/promo-new/admin/grouping-worker.ts', 'utf8');
  const client = readFileSync('src/promo-new/admin/grouping-client.ts', 'utf8');
  assert.match(worker, /rawText: card\.productText \|\| ''/u);
  assert.match(worker, /payload\.existingSkus,[\s\n]*\[\],[\s\n]*\[\],[\s\n]*\{\},[\s\n]*noScopes/u);
  assert.match(worker, /grouping:price_manual_admin/u);
  assert.match(worker, /grouping:promotion_family_manual_admin/u);
  assert.match(worker, /grouping:full_card_text_disabled/u);
  assert.doesNotMatch(worker, /payload\.storedPrices,[\s\n]*payload\.promotionFamilies/u);
  assert.doesNotMatch(worker, /resolveTextFirstScopesSafely|resolveScopesSafely|applyClassMatrixRecovery|repairCardsWithMasterBackedScopes/u);
  assert.match(client, /storedPrices: \[\]/u);
  assert.match(client, /promotionFamilies: \[\]/u);
  assert.match(client, /visualSignatures: \{\}/u);
  assert.match(client, /โดยไม่ส่งรูป ราคา หรือโปรโมชั่น/u);
});

test('Admin retains manual price input and CSV/XLSM Promotion Family dropdown', () => {
  const admin = readFileSync('src/promo-new/admin/main.tsx', 'utf8');
  assert.match(admin, /<option value="">เลือกจาก CSV\/XLSM<\/option>/u);
  assert.match(admin, /ราคากลางต่อชิ้น/u);
  assert.match(admin, /setCentralPrice\(group\.price, amount\)/u);
  assert.match(admin, /applyPromotionFamily\(priced\.group, priced\.cards, family\)/u);
});
