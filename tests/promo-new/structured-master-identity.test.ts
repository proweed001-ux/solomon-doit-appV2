import assert from 'node:assert/strict';
import test from 'node:test';
import { applyStructuredIdentity } from '../../api/promo-legacy-auth.js';

function sku(overrides: Record<string, unknown> = {}) {
  return {
    id: 'MASTER-11111111-1111-5111-8111-111111111111',
    code: 'PM-1111111111',
    canonicalName: 'สินค้า',
    identityKey: 'สินค้า',
    identity: {
      brand: 'สินค้า',
      productType: 'สินค้า',
      variant: null,
      sizeValue: 0,
      sizeUnit: '',
      salesUnit: 'ชิ้น',
      packQuantity: 1,
      ...overrides,
    },
    status: 'active',
    evidence: [],
    failureReasons: [],
  };
}

test('null Structured Size does not erase a size parsed from the canonical name', () => {
  const result = applyStructuredIdentity(
    sku({ brand: 'H&S', productType: 'H&S แชมพู 65 มล.', sizeValue: 65, sizeUnit: 'ML', salesUnit: 'ขวด' }),
    {
      canonical_name: 'H&S แชมพู ทุกสูตร 65 มล.',
      brand: null,
      product_type: null,
      variant: null,
      size_value: null,
      size_unit: null,
      sales_unit: null,
      unit_label: 'ขวด',
      pack_quantity: null,
    },
  );
  assert.equal(result.identity.sizeValue, 65);
  assert.equal(result.identity.sizeUnit, 'ML');
  assert.equal(result.identity.salesUnit, 'ขวด');
  assert.equal(result.identity.variant, null);
});

test('a size-less legacy Product Master receives a stable model fallback instead of null variant', () => {
  const result = applyStructuredIdentity(
    sku({ brand: 'ยิลเลตต์', productType: 'ยิลเลตต์ ด้ามมีด Super Click', salesUnit: 'ด้าม' }),
    {
      canonical_name: 'ยิลเลตต์ ด้ามมีด Super Click',
      brand: null,
      product_type: null,
      variant: null,
      size_value: null,
      size_unit: null,
      sales_unit: null,
      unit_label: 'ด้าม',
      pack_quantity: null,
    },
  );
  assert.equal(result.identity.sizeValue, 0);
  assert.equal(result.identity.variant, 'ยิลเลตต์ ด้ามมีด Super Click');
});

test('confirmed Structured Identity overrides fallbacks without being cleared by null fields', () => {
  const base = sku({
    brand: 'ดาวน์นี่',
    productType: 'ดาวน์นี่ ปรับผ้านุ่ม 480 มล.',
    sizeValue: 480,
    sizeUnit: 'มล.',
    salesUnit: 'ถุง',
  });
  const allFormula = applyStructuredIdentity(base, {
    canonical_name: 'ดาวน์นี่ ปรับผ้านุ่ม ถุงเติม 480 มล. ทุกสูตร/กลุ่มสูตรน้ำหอม',
    brand: 'ดาวน์นี่',
    product_type: 'ปรับผ้านุ่ม',
    variant: 'ทุกสูตร/กลุ่มสูตรน้ำหอม',
    size_value: 480,
    size_unit: 'มล.',
    sales_unit: 'ถุง',
    unit_label: 'ถุง',
    pack_quantity: 1,
  });
  const sunrise = applyStructuredIdentity(base, {
    canonical_name: 'ดาวน์นี่ ซันไรซ์เฟรช 480 มล.',
    brand: 'ดาวน์นี่',
    product_type: 'ปรับผ้านุ่ม',
    variant: 'ซันไรซ์เฟรช',
    size_value: 480,
    size_unit: 'มล.',
    sales_unit: 'ถุง',
    unit_label: 'ถุง',
    pack_quantity: 1,
  });
  assert.equal(allFormula.identity.productType, 'ปรับผ้านุ่ม');
  assert.equal(allFormula.identity.variant, 'ทุกสูตร/กลุ่มสูตรน้ำหอม');
  assert.equal(sunrise.identity.variant, 'ซันไรซ์เฟรช');
  assert.notEqual(allFormula.identity.variant, sunrise.identity.variant);
});
