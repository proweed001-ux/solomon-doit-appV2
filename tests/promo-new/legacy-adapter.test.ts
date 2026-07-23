import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLegacyMasterData,
  buildLegacyPromoDataset,
  toLegacyClassId,
  toLegacyMonthId,
  toModernClassId,
  toModernMonthKey,
} from '../../api/_promo-new/legacy-adapter.js';

test('แปลงเดือนและ Class ระหว่างระบบเดิมกับระบบใหม่', () => {
  assert.equal(toLegacyMonthId('PROMO-2026-07'), 'JUL26');
  assert.equal(toLegacyMonthId('2026-08'), 'AUG26');
  assert.equal(toLegacyMonthId('JUL26'), 'JUL26');
  assert.equal(toModernMonthKey({ id: 'JUL26', year_month: '2026-07' }), 'PROMO-2026-07');
  assert.equal(toModernClassId('HFSWSS'), 'HFSWS-S');
  assert.equal(toModernClassId('HFSWSL'), 'HFSWS-L');
  assert.equal(toLegacyClassId('HFSWS-S'), 'HFSWSS');
  assert.equal(toLegacyClassId('HFSWS-L'), 'HFSWSL');
});

test('แปลงกลุ่มสินค้าเดิมข้าม Class เป็น PromoDataset ใหม่', () => {
  const masterId = '11111111-1111-5111-8111-111111111111';
  const month = {
    id: 'JUL26',
    label: 'โปรโมชัน กรกฎาคม 2026',
    year_month: '2026-07',
    status: 'published',
    source_pdf: 'jul.pdf',
    source_price_file: 'jul.xlsm',
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-02T00:00:00.000Z',
    published_at: '2026-07-03T00:00:00.000Z',
  };
  const cards = [
    {
      card_id: 'JUL26-HFSS-001', promo_month_id: 'JUL26', class_id: 'HFSS', page_no: 1, card_no: 1,
      promo_title: 'H&S แชมพู 65 มล.', raw_text: 'ซื้อ 3 ขวด ลด 5%', status: 'ready', image_url: 'https://example/S.webp',
      sort_order: 1001, base_unit_price: 49, unit_label: 'ขวด', group_id: 'PG-JUL26-HS65', product_group_name: 'H&S แชมพู 65 มล.',
      product_group_match_score: 0.99, master_product_id: masterId, master_product_name: 'H&S แชมพู 65 มล.',
    },
    {
      card_id: 'JUL26-HFSM-001', promo_month_id: 'JUL26', class_id: 'HFSM', page_no: 4, card_no: 1,
      promo_title: 'H&S แชมพู 65 มล.', raw_text: 'ซื้อ 6 ขวด ลด 8%', status: 'ready', image_url: 'https://example/M.webp',
      sort_order: 2001, base_unit_price: 49, unit_label: 'ขวด', group_id: 'PG-JUL26-HS65', product_group_name: 'H&S แชมพู 65 มล.',
      product_group_match_score: 0.98, master_product_id: masterId, master_product_name: 'H&S แชมพู 65 มล.',
    },
  ];
  const tiers = [
    { tier_id: 'S1', card_id: 'JUL26-HFSS-001', tier_no: 1, min_qty_text: 'ซื้อ 3 ขวด ลด 5%', min_qty: 3, max_qty: null, unit: 'ขวด', discount_percent: 5, free_qty: 0, note: null },
    { tier_id: 'M1', card_id: 'JUL26-HFSM-001', tier_no: 1, min_qty_text: 'ซื้อ 6 ขวด ลด 8%', min_qty: 6, max_qty: null, unit: 'ขวด', discount_percent: 8, free_qty: 0, note: null },
  ];
  const groups = [{
    group_id: 'PG-JUL26-HS65', promo_month_id: 'JUL26', anchor_card_id: 'JUL26-HFSS-001', canonical_name: 'H&S แชมพู 65 มล.',
    status: 'active', master_product_id: masterId, created_at: month.created_at, updated_at: month.updated_at,
  }];
  const masters = [{
    master_product_id: masterId, canonical_name: 'H&S แชมพู 65 มล.', normalized_key: 'hsแชมพู65ml', unit_label: 'ขวด', status: 'active', updated_at: month.updated_at,
  }];
  const masterPrices = [{ master_product_id: masterId, base_unit_price: 49, unit_label: 'ขวด', source_month: 'JUL26', updated_at: month.updated_at }];

  const dataset = buildLegacyPromoDataset({ month, cards, tiers, groups, masters, masterPrices });
  assert.ok(dataset);
  assert.equal(dataset.version.monthKey, 'PROMO-2026-07');
  assert.equal(dataset.version.status, 'published');
  assert.equal(dataset.cards.length, 2);
  assert.deepEqual(dataset.cards.map(card => card.classId), ['HFSS', 'HFSM']);
  assert.equal(dataset.productGroups.length, 1);
  assert.equal(dataset.productGroups[0].status, 'ready');
  assert.equal(dataset.promotionFamilies[0].tiersByClass.HFSS[0].discountPercent, 5);
  assert.equal(dataset.promotionFamilies[0].tiersByClass.HFSM[0].discountPercent, 8);
  assert.equal(dataset.prices[0].effectivePrice?.amount, 49);
});

test('Master Data เดิมถูกแปลงเป็น SKU และราคาถาวรของระบบใหม่', () => {
  const masters = [{
    master_product_id: '22222222-2222-5222-8222-222222222222',
    canonical_name: 'Downy 100 มล.',
    normalized_key: 'downy100ml',
    unit_label: 'ถุง',
    status: 'active',
  }];
  const prices = [{
    master_product_id: masters[0].master_product_id,
    base_unit_price: 12.5,
    source_month: 'JUL26',
    updated_at: '2026-07-01T00:00:00.000Z',
  }];
  const result = buildLegacyMasterData(masters, prices);
  assert.equal(result.skus.length, 1);
  assert.equal(result.skus[0].status, 'active');
  assert.equal(result.prices[0].amount, 12.5);
  assert.equal(result.prices[0].skuIdentityKey, 'downy100ml');
});
