import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { applyPromotionFamily, buildSkuDisplayName } from '../../src/promo-new/domain/grouping';
import { applyPriceToGroup, missingSkuPrice, setCentralPrice } from '../../src/promo-new/domain/pricing';
import type { ProductGroup, PromoCard, PromotionFamily, PromotionTier, Sku } from '../../src/promo-new/domain/types';
import { validateSku } from '../../src/promo-new/domain/validation';
import { legacyMasterIdentity } from '../../src/promo-new/shared/legacy-system';

const read = (path: string) => readFileSync(path, 'utf8');

const tier = (sourceText = '1 ขวด ลด 8%'): PromotionTier => ({
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
  sourceText,
});

const sku = (overrides: Partial<Sku> = {}): Sku => ({
  id: 'sku:test',
  code: 'SKU-TEST',
  canonicalName: 'H&S แชมพู 140 มล.',
  identityKey: 'H&S|แชมพู||140|มล.|ขวด|1',
  identity: {
    brand: 'H&S',
    productType: 'แชมพู',
    variant: null,
    sizeValue: 140,
    sizeUnit: 'มล.',
    salesUnit: 'ขวด',
    packQuantity: 1,
  },
  status: 'active',
  evidence: [],
  failureReasons: [],
  ...overrides,
});

function card(id: string, classId: string, price = missingSkuPrice('sku:test')): PromoCard {
  return {
    id,
    monthKey: 'PROMO-2026-07',
    page: 1,
    sequence: id === 'card-s' ? 1 : 2,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    skuId: 'sku:test',
    productGroupId: 'group:test',
    promotionFamilyId: 'family:old',
    promotionTiers: [tier()],
    price,
    status: 'need_review',
    evidence: { rawText: '', productText: '', pageClassText: classId, confidence: 0.9, method: 'page_ocr', cropBounds: null },
    failureReasons: ['central_price_missing', `promotion_class_missing:${classId}`],
  };
}

function group(price = missingSkuPrice('sku:test')): ProductGroup {
  return {
    id: 'group:test',
    monthKey: 'PROMO-2026-07',
    skuId: 'sku:test',
    sku: sku(),
    cardIds: ['card-s', 'card-m'],
    classIds: ['HFSS', 'HFSM'],
    promotionFamilyId: 'family:old',
    price,
    status: 'need_review',
    failureReasons: ['central_price_missing', 'promotion_class_missing:HFSM'],
  };
}

const family = (includeM = true): PromotionFamily => ({
  id: includeM ? 'family:good' : 'family:missing-m',
  familyKey: includeM ? 'PF-GOOD' : 'PF-MISSING-M',
  name: 'H&S 140 มล.',
  scopeText: 'H&S แชมพู 140 มล.',
  sourceRows: [1],
  tiersByClass: {
    HFSS: [tier()],
    ...(includeM ? { HFSM: [tier('3 ขวด ลด 10%')] } : {}),
  },
  failureReasons: [],
});

test('central price clears stale price blockers from group and cards in one pass', () => {
  const currentGroup = group();
  currentGroup.failureReasons = ['central_price_missing'];
  const currentCards = [card('card-s', 'HFSS'), card('card-m', 'HFSM')].map(item => ({
    ...item,
    promotionFamilyId: 'family:good',
    failureReasons: ['central_price_missing'],
  }));
  const nextPrice = setCentralPrice(currentGroup.price, 41.15);
  const result = applyPriceToGroup({ ...currentGroup, promotionFamilyId: 'family:good' }, currentCards, nextPrice);
  assert.deepEqual(result.group.failureReasons, []);
  assert.equal(result.group.status, 'ready');
  assert.ok(result.cards.every(item => item.failureReasons.length === 0 && item.status === 'ready'));
});

test('correct promotion family removes old blockers and becomes ready on the first application', () => {
  const price = setCentralPrice(missingSkuPrice('sku:test'), 41.15);
  const currentGroup = { ...group(price), failureReasons: ['promotion_class_missing:HFSM', 'promotion_family_conflict'] };
  const currentCards = [card('card-s', 'HFSS', price), card('card-m', 'HFSM', price)].map(item => ({
    ...item,
    failureReasons: [`promotion_class_missing:${item.classId}`],
  }));
  const result = applyPromotionFamily(currentGroup, currentCards, family(true));
  assert.deepEqual(result.blockedClasses, []);
  assert.equal(result.group.status, 'ready');
  assert.deepEqual(result.group.failureReasons, []);
  assert.ok(result.cards.every(item => item.status === 'ready' && item.failureReasons.length === 0 && item.promotionTiers.length === 1));
});

test('promotion family missing a class clears stale tiers instead of leaving old promotion data', () => {
  const price = setCentralPrice(missingSkuPrice('sku:test'), 41.15);
  const result = applyPromotionFamily(group(price), [card('card-s', 'HFSS', price), card('card-m', 'HFSM', price)], family(false));
  assert.equal(result.group.status, 'blocked');
  assert.deepEqual(result.blockedClasses, ['HFSM']);
  const members = result.cards.filter(item => result.group.cardIds.includes(item.id));
  assert.ok(members.every(item => item.promotionFamilyId === null && item.promotionTiers.length === 0 && item.status === 'need_review'));
});

test('model-based SKU may omit numeric size while shampoo still requires size', () => {
  const gillette = sku({
    canonicalName: 'Gillette มีดโกน ซุปเปอร์ธิน',
    identityKey: 'GILLETTE|มีดโกน|ซุปเปอร์ธิน|0||ชิ้น|1',
    identity: { brand: 'GILLETTE', productType: 'มีดโกน', variant: 'ซุปเปอร์ธิน', sizeValue: 0, sizeUnit: '', salesUnit: 'ชิ้น', packQuantity: 1 },
  });
  assert.ok(!validateSku(gillette).includes('size_missing'));
  assert.ok(!validateSku(gillette).includes('size_unit_missing'));
  const shampoo = sku({ identity: { brand: 'H&S', productType: 'แชมพู', variant: null, sizeValue: 0, sizeUnit: '', salesUnit: 'ขวด', packQuantity: 1 } });
  assert.ok(validateSku(shampoo).includes('size_missing'));
  assert.ok(validateSku(shampoo).includes('size_unit_missing'));
});

test('new SKU display name keeps the observed variant instead of a generic placeholder', () => {
  const value = buildSkuDisplayName(sku({ identity: { brand: 'H&S', productType: 'แชมพู', variant: 'คูลเมนทอล', sizeValue: 140, sizeUnit: 'มล.', salesUnit: 'ขวด', packQuantity: 1 } }));
  assert.match(value, /คูลเมนทอล/u);
  assert.doesNotMatch(value, /สูตร\/รุ่นรอยืนยัน/u);
});

test('different SKU identities create different deterministic legacy Product Master IDs', async () => {
  const cool = await legacyMasterIdentity('sku-identity|H&S|แชมพู|คูลเมนทอล|140|มล.|ขวด|1');
  const smooth = await legacyMasterIdentity('sku-identity|H&S|แชมพู|สมูทแอนด์ซิลกี้|140|มล.|ขวด|1');
  assert.notEqual(cool, smooth);
  assert.equal(cool, await legacyMasterIdentity('sku-identity|H&S|แชมพู|คูลเมนทอล|140|มล.|ขวด|1'));
});

test('PDF importer checks Product Master readiness before reading file bytes and has no preflight per-card OCR', () => {
  const source = read('src/promo-new/import/pdf-importer.ts');
  const guardAt = source.indexOf('assertProductMasterReady();');
  const bytesAt = source.indexOf('file.arrayBuffer()');
  assert.ok(guardAt >= 0 && bytesAt > guardAt);
  assert.doesNotMatch(source, /productFieldOcr\(/u);
  assert.doesNotMatch(source, /อ่านหัวการ์ด/u);
});

test('workbook and Product Master are validated before main opens PDF', () => {
  const main = read('src/promo-new/admin/main.tsx');
  const parser = read('src/promo-new/import/workbook-parser.ts');
  const loadInputsAt = main.indexOf('const [parsedWorkbook, master]');
  const pdfAt = main.indexOf('importPromotionPdf(pdf');
  assert.ok(loadInputsAt >= 0 && pdfAt > loadInputsAt);
  assert.match(main, /assertWorkbookReady\(parsedWorkbook\)/u);
  assert.match(parser, /throw new Error\('promotion_family_not_found_in_workbook'\)/u);
  assert.match(parser, /throw new Error\('promotion_tiers_not_found_in_workbook'\)/u);
});

test('dry-run validates without Draft ID and write handlers block dry-run directly', () => {
  const main = read('src/promo-new/admin/main.tsx');
  assert.match(main, /!dryRun && !savedVersionId/u);
  assert.match(main, /if \(!dataset \|\| !session \|\| demo \|\| dryRun\) return;/u);
  assert.match(main, /if \(!dataset \|\| !session \|\| demo \|\| dryRun \|\| !savedVersionId/u);
  assert.match(main, /FINAL-UPLOAD-AUDIT-20260719/u);
});
