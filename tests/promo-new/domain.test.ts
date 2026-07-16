import test from 'node:test';
import assert from 'node:assert/strict';
import type { PromoCard, ProductGroup, PromotionFamily, Sku } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { makeCardId } from '../../src/promo-new/import/card-id';
import { normalizeClassId } from '../../src/promo-new/import/class-id';
import { parsePromotionMatrix } from '../../src/promo-new/import/workbook-parser';
import { parsePromotionTiers } from '../../src/promo-new/import/promotion-parser';
import { evaluateGrid } from '../../src/promo-new/import/grid-detector';
import { calculatePromotion } from '../../src/promo-new/domain/calculator';
import { applyPromotionFamily, groupImportedCards } from '../../src/promo-new/domain/grouping';
import { applyPriceToGroup, inheritedSkuPrice, setCentralPrice, type StoredPrice } from '../../src/promo-new/domain/pricing';
import { confirmSkuCandidate, createSkuCandidate } from '../../src/promo-new/domain/sku-identity';
import { activePublishedVersion, nextDraftVersion, publishedOnly, rollbackTarget } from '../../src/promo-new/domain/versioning';
import { createDemoDataset } from '../../src/promo-new/shared/demo-data';

const MONTH = 'TEST-2026-01';

function imported(productText: string, classId: string, page: number, sequence = 1): ImportedCardCandidate {
  return {
    cardId: makeCardId(MONTH, classId, page, sequence),
    monthKey: MONTH,
    page,
    sequence,
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

function family(classes: Record<string, number>, id = 'family:test'): PromotionFamily {
  return {
    id,
    familyKey: `PF-${id}`,
    name: 'Test family',
    scopeText: 'หลายแบรนด์',
    sourceRows: [2, 3],
    tiersByClass: Object.fromEntries(Object.entries(classes).map(([classId, discount]) => [classId, [{
      tierNo: 1,
      type: 'cash_discount' as const,
      minQuantity: 3,
      maxQuantity: null,
      purchaseUnit: 'ชิ้น',
      discountPercent: discount,
      freeQuantity: 0,
      rewardUnit: null,
      bundlePrice: null,
      effectivePercent: null,
      effectivePercentUsage: null,
      sourceText: `ซื้อ 3 ชิ้น ลด ${discount}%`,
    }]])),
    failureReasons: [],
  };
}

test('1. สินค้าเดียวกันหลาย Class รวมเป็น Product Group เดียว', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSM', 2),
  ]);
  assert.equal(result.groups.length, 1);
  assert.deepEqual(result.groups[0].classIds, ['HFSM', 'HFSS']);
  assert.equal(result.groups[0].cardIds.length, 2);
});

test('2. แชมพูและครีมนวดไม่ถูกรวมกัน', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene ครีมนวด Aqua 70 มล. ขวด', 'HFSM', 2),
  ]);
  assert.equal(result.groups.length, 2);
  assert.notEqual(result.groups[0].sku.identityKey, result.groups[1].sku.identityKey);
});

test('3. ขนาดต่างกันไม่ถูกรวมกัน', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู Aqua 120 มล. ขวด', 'HFSM', 2),
  ]);
  assert.equal(result.groups.length, 2);
});

test('4. ทุกแบรนด์ตัวอย่างได้รับการจัดกลุ่ม ไม่ใช่เฉพาะ Pantene', () => {
  const samples = [
    'Pantene แชมพู Aqua 70 มล. ขวด', 'H&S แชมพู Cool 65 มล. ขวด', 'Rejoice แชมพู Rich 70 มล. ขวด',
    'Downy ปรับผ้านุ่ม Mystique 330 มล. ถุง', 'Olay ครีมบำรุง Total Effects 50 กรัม กระปุก',
    'Oral-B ยาสีฟัน Fresh 100 กรัม หลอด', 'Gillette มีดโกน Vector 20 กรัม แพ็ค',
    'Safeguard สบู่ Pure 100 กรัม ชิ้น', 'Vicks ยาอม Honey 20 กรัม ซอง', 'Ariel ผงซักฟอก Sunrise 700 กรัม ถุง',
  ];
  const result = groupImportedCards(MONTH, samples.map((text, index) => imported(text, `CLASS${index + 1}`, index + 1)));
  assert.equal(result.groups.length, samples.length);
  assert.equal(result.quarantineCards.length, 0);
});

test('5. CSV หนึ่ง Promotion Family ใช้กับหลาย Product Group ได้', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('H&S แชมพู Cool 65 มล. ขวด', 'HFSS', 2),
  ]);
  const shared = family({ HFSS: 5 });
  const applied = result.groups.map(group => applyPromotionFamily(group, result.cards, shared));
  assert.equal(applied.filter(item => item.group.promotionFamilyId === shared.id).length, 2);
});

test('6. Promotion tiers แจกตาม Class ถูกต้อง', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSM', 2),
  ]);
  const applied = applyPromotionFamily(result.groups[0], result.cards, family({ HFSS: 5, HFSM: 12 }));
  assert.equal(applied.cards.find(card => card.classId === 'HFSS')?.promotionTiers[0].discountPercent, 5);
  assert.equal(applied.cards.find(card => card.classId === 'HFSM')?.promotionTiers[0].discountPercent, 12);
});

test('7. CSV ไม่มี Class ที่ต้องใช้แล้วต้อง Block', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSM', 2),
  ]);
  const applied = applyPromotionFamily(result.groups[0], result.cards, family({ HFSS: 5 }));
  assert.deepEqual(applied.blockedClasses, ['HFSM']);
  assert.equal(applied.group.status, 'blocked');
  assert.equal(applied.group.promotionFamilyId, null);
});

test('8. ราคา SKU เดียวกันซิงค์ทุก Class', () => {
  const result = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSM', 2),
  ]);
  const price = setCentralPrice(result.groups[0].price, 19.75);
  const applied = applyPriceToGroup(result.groups[0], result.cards, price);
  assert.deepEqual(applied.cards.map(card => card.price.effectivePrice?.amount), [19.75, 19.75]);
});

test('9. เดือนใหม่พบ SKU เดิมแล้วดึงราคาเดิม', () => {
  const sku = confirmSkuCandidate(createSkuCandidate('Pantene แชมพู Aqua 70 มล. ขวด'));
  const prices: StoredPrice[] = [{ skuIdentityKey: sku.identityKey, skuId: sku.id, amount: 18.5, currency: 'THB', sourceReference: 'previous_month', updatedAt: '2026-01-01T00:00:00Z' }];
  const next = groupImportedCards('TEST-2026-02', [{ ...imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1), monthKey: 'TEST-2026-02' }], [sku], prices);
  assert.equal(next.groups[0].price.effectivePrice?.amount, 18.5);
  assert.equal(next.groups[0].price.source, 'central_override');
});

test('10. สินค้าใหม่แสดงชื่อและสถานะต้องกรอกราคา', () => {
  const result = groupImportedCards(MONTH, [imported('Rejoice แชมพู Rich 120 มล. ขวด', 'HFSS', 1)]);
  assert.match(result.groups[0].sku.canonicalName, /Rejoice/i);
  assert.equal(result.groups[0].price.effectivePrice, null);
  assert.ok(result.groups[0].failureReasons.includes('central_price_missing'));
});

test('11. SKU ใหม่ไม่ยืมราคาสินค้าใกล้เคียง', () => {
  const oldSku = confirmSkuCandidate(createSkuCandidate('Rejoice แชมพู Rich 70 มล. ขวด'));
  const newSku = createSkuCandidate('Rejoice แชมพู Rich 120 มล. ขวด');
  const inherited = inheritedSkuPrice(newSku, [{ skuIdentityKey: oldSku.identityKey, skuId: oldSku.id, amount: 17, currency: 'THB', sourceReference: 'old', updatedAt: '2026-01-01T00:00:00Z' }]);
  assert.equal(inherited.effectivePrice, null);
  assert.equal(inherited.source, 'missing');
});

test('12. ซื้อแถมไม่ถูกคิดเป็นส่วนลดเงินสด', () => {
  const result = calculatePromotion(20, 6, [{ tierNo: 1, type: 'free_goods', minQuantity: 3, maxQuantity: null, purchaseUnit: 'ชิ้น', discountPercent: null, freeQuantity: 1, rewardUnit: 'ชิ้น', bundlePrice: null, effectivePercent: 25, effectivePercentUsage: 'display_only', sourceText: 'ซื้อ 3 ฟรี 1' }]);
  assert.equal(result.grossAmount, 120);
  assert.equal(result.cashDiscount, 0);
  assert.equal(result.giftQuantity, 2);
  assert.equal(result.netAmount, 120);
});

test('13. Card ID ไม่ซ้ำ', () => {
  const ids = new Set<string>();
  for (let page = 1; page <= 5; page += 1) for (let sequence = 1; sequence <= 8; sequence += 1) ids.add(makeCardId(MONTH, 'HFSS', page, sequence));
  assert.equal(ids.size, 40);
});

test('14. ไม่มีการ์ดหายหรือซ้ำระหว่างจัดกลุ่ม', () => {
  const input = [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSM', 2),
    imported('H&S แชมพู Cool 65 มล. ขวด', 'HFSS', 3),
  ];
  const result = groupImportedCards(MONTH, input);
  assert.equal(result.cards.length + result.quarantineCards.length, input.length);
  assert.equal(new Set(result.cards.map(card => card.id)).size, result.cards.length);
});

test('15. Frontend เลือกเฉพาะข้อมูล Published', () => {
  const draft = createDemoDataset('draft');
  const published = createDemoDataset('published');
  published.version.revision = 2;
  assert.deepEqual(publishedOnly([draft, published]).map(item => item.version.status), ['published']);
  assert.equal(activePublishedVersion([draft, published], published.version.monthKey)?.version.revision, 2);
});

test('16. Rollback กลับเวอร์ชันเดิมได้', () => {
  const published = createDemoDataset('published').version;
  const current = { ...published, id: '00000000-0000-4000-8000-000000000002', revision: 2, previousVersionId: published.id };
  const old = { ...published, status: 'archived' as const };
  assert.equal(rollbackTarget([old, current], current.id)?.id, old.id);
});

test('Draft version ใช้ UUID ที่ Backend และ Storage ตรวจสอบร่วมกันได้', () => {
  const draft = nextDraftVersion(MONTH, [], null);
  assert.match(draft.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.equal(draft.id.includes(MONTH), false);
});

test('Promotion workbook รวมหลายแถว Class เป็น Family เดียว', () => {
  const parsed = parsePromotionMatrix([
    ['Promotion Family', 'สินค้า', 'Class', 'โปรโมชั่น'],
    ['HAIR-01', 'H&S / Pantene / Rejoice 60-70 ml', 'HFSS', 'ซื้อ 3 ชิ้น ลด 5%'],
    ['', '', 'HFSM/HFS-WH', 'ซื้อ 3 ชิ้น ลด 10%'],
  ], 'Sheet1');
  assert.equal(parsed.families.length, 1);
  assert.deepEqual(Object.keys(parsed.families[0].tiersByClass).sort(), ['HFSM', 'HFSS']);
});

test('CSV แบบ Description คอลัมน์เดียวรวม Family และแยก tier ตาม Class', () => {
  const parsed = parsePromotionMatrix([
    ['Description'],
    ['Pantene แชมพู 70 มล. ทุกสูตร ขั้นต่ำ 6 ขวด ลด 10%, ขั้นต่ำ 12 ขวด ลด 17% [เฉพาะช่องทาง HFSS]'],
    ['Pantene แชมพู 70 มล. ทุกสูตร ขั้นต่ำ 12 ขวด ลด 12%, ขั้นต่ำ 48 ขวด ลด 20% [เฉพาะช่องทาง HFSWS-L]'],
  ], 'Description');
  assert.equal(parsed.families.length, 1);
  assert.deepEqual(Object.keys(parsed.families[0].tiersByClass).sort(), ['HFSS', 'HFSWS-L']);
  assert.deepEqual(parsed.families[0].tiersByClass.HFSS.map(tier => tier.discountPercent), [10, 17]);
  assert.deepEqual(parsed.families[0].tiersByClass['HFSWS-L'].map(tier => tier.discountPercent), [12, 20]);
});

test('Promotion parser รองรับช่วงจำนวนและหลักฐานจำนวนชิ้นในวงเล็บ', () => {
  const range = parsePromotionTiers('ขั้นต่ำ 1-2 ชิ้น เท่านั้น ลด 24%');
  assert.deepEqual(range.tiers.map(tier => [tier.minQuantity, tier.maxQuantity, tier.discountPercent]), [[1, 2, 24]]);
  const packs = parsePromotionTiers('ขั้นต่ำ 1 แพ็ค (3 ชิ้น) ลด 20%, 32 แพ็ค (96 ชิ้น) ลด 25%');
  assert.deepEqual(packs.tiers.map(tier => [tier.minQuantity, tier.purchaseUnit, tier.discountPercent]), [[1, 'แพ็ค', 20], [32, 'แพ็ค', 25]]);
});

test('PDF grid รองรับจำนวนคอลัมน์ต่างกันในแต่ละแถวโดยไม่ hardcode', () => {
  const regions = [
    ...Array.from({ length: 4 }, (_, column) => ({ x: 60 + column * 348, y: 190, width: 330, height: 200 })),
    ...Array.from({ length: 5 }, (_, column) => ({ x: 60 + column * 279, y: 405, width: 264, height: 200 })),
    ...Array.from({ length: 5 }, (_, column) => ({ x: 60 + column * 279, y: 620, width: 264, height: 200 })),
  ];
  const result = evaluateGrid(regions, 10, 1500, 844);
  assert.deepEqual(result.diagnostics.rowCounts, [4, 5, 5]);
  assert.equal(result.diagnostics.status, 'ok');
});

test('Class parser ให้ HFS ที่มีหลักฐานครบมาก่อน OCR noise และไม่เดาค่าที่ขาด', () => {
  assert.equal(normalizeClassId('PANTENE PROMOTION สำหรับร้าน HFS-XL'), 'HFSXL');
  assert.equal(normalizeClassId('noise HFS-WS-S'), 'HFSWS-S');
  assert.equal(normalizeClassId('HFS-'), null);
});

test('Calculator เลือก Tier สูงสุดที่จำนวนซื้อถึงและปัด 0.01 บาท', () => {
  const tiers = family({ HFSS: 5 }).tiersByClass.HFSS;
  tiers.push({ ...tiers[0], tierNo: 2, minQuantity: 6, discountPercent: 10, sourceText: 'ซื้อ 6 ลด 10%' });
  const result = calculatePromotion(19.99, 7, tiers);
  assert.equal(result.activeTier?.tierNo, 2);
  assert.equal(result.grossAmount, 139.93);
  assert.equal(result.cashDiscount, 13.99);
  assert.equal(result.netAmount, 125.94);
});
