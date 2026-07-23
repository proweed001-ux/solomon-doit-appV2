import test from 'node:test';
import assert from 'node:assert/strict';
import { createManualSku, emptyManualPrice, ensureSkuInDataset, findSimilarProductMasters } from '../../src/promo-new/domain/manual-product';
import { createDemoDataset } from '../../src/promo-new/shared/demo-data';

const input = {
  canonicalName: 'แพนทีน แชมพู 500 มล.',
  brand: 'แพนทีน',
  productType: 'แชมพู',
  variant: '',
  sizeValue: 500,
  sizeUnit: 'มล.',
  salesUnit: 'ขวด',
  packQuantity: 1,
  aliases: ['แพนทีน 500', 'pantene shampoo 500 ml'],
};

test('manual Product Master creates an active structured SKU with aliases', () => {
  const sku = createManualSku(input, 'MASTER-00000000-0000-5000-8000-000000000001');
  assert.equal(sku.status, 'active');
  assert.equal(sku.identity.brand, 'แพนทีน');
  assert.equal(sku.identity.productType, 'แชมพู');
  assert.equal(sku.identity.sizeValue, 500);
  assert.equal(sku.identity.salesUnit, 'ขวด');
  assert.ok(sku.evidence.includes('แพนทีน 500'));
});

test('new Product Master starts with an empty price', () => {
  const sku = createManualSku(input);
  const price = emptyManualPrice(sku.id);
  assert.equal(price.source, 'missing');
  assert.equal(price.effectivePrice, null);
  assert.equal(price.centralOverridePrice, null);
});

test('adding a manual SKU to a dataset never invents a price', () => {
  const dataset = createDemoDataset('draft');
  const sku = createManualSku(input);
  const next = ensureSkuInDataset({ ...dataset, skus: [], prices: [], cards: [], productGroups: [] }, sku);
  assert.equal(next.skus.length, 1);
  assert.equal(next.prices.length, 1);
  assert.equal(next.prices[0].effectivePrice, null);
});

test('near-duplicate Product Master is warned even when normalized names are not exact', () => {
  const existing = createManualSku({
    ...input,
    canonicalName: 'แพนทีนแชมพู 500มล',
  }, 'MASTER-00000000-0000-5000-8000-000000000001');
  const matches = findSimilarProductMasters({
    ...input,
    canonicalName: 'แพนทีน แชมพู ขนาด 500 มล.',
  }, [existing]);

  assert.equal(matches[0]?.sku.id, existing.id);
  assert.ok(matches[0].score >= 0.58);
});
