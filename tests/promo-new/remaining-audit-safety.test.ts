import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { visualSignaturesComplete } from '../../src/promo-new/admin/cached-run';
import { calculatePromotion } from '../../src/promo-new/domain/calculator';
import type { PromotionTier } from '../../src/promo-new/domain/types';
import { classifyClassText } from '../../src/promo-new/import/class-id';
import type { PdfImportResult } from '../../src/promo-new/import/pdf-importer';

const baseTier = {
  tierNo: 1,
  minQuantity: 2,
  maxQuantity: null,
  purchaseUnit: 'ชิ้น',
  discountPercent: null,
  freeQuantity: 0,
  rewardUnit: null,
  bundlePrice: null,
  effectivePercent: null,
  effectivePercentUsage: null,
  sourceText: '',
} satisfies Omit<PromotionTier, 'type'>;

function imported(): PdfImportResult {
  return {
    cards: [{
      cardId: 'CARD-A',
      monthKey: 'PROMO-2026-07',
      page: 1,
      sequence: 1,
      classId: 'HFSS',
      imageUrl: 'data:image/webp;base64,AA==',
      rawText: '',
      productText: '',
      pageClassText: 'HFSS',
      confidence: 0.9,
      evidenceMethod: 'page_ocr',
      bounds: { x: 0, y: 0, width: 100, height: 100 },
      failureReasons: [],
    }],
    pages: [],
    elapsedMs: 0,
    warnings: [],
  };
}

const signature = (title: string, product: string, quality = 0.5) => ({ title, product, quality });

test('HFS-WH remains recoverable as HFSM but cannot become a strong Class anchor', () => {
  const weak = classifyClassText('HFS-WH');
  assert.equal(weak.classId, 'HFSM');
  assert.ok(weak.confidence < 0.78, String(weak.confidence));
  const exact = classifyClassText('HFS-M');
  assert.equal(exact.classId, 'HFSM');
  assert.ok(exact.confidence >= 0.9, String(exact.confidence));
});

test('bundle promotion never charges more than regular price', () => {
  const tier: PromotionTier = {
    ...baseTier,
    type: 'bundle_price',
    bundlePrice: { amount: 250, currency: 'THB' },
  };
  const result = calculatePromotion(100, 2, [tier]);
  assert.equal(result.grossAmount, 200);
  assert.equal(result.netAmount, 200);
  assert.equal(result.cashDiscount, 0);
});

test('cash discount cannot exceed the gross amount', () => {
  const tier: PromotionTier = {
    ...baseTier,
    type: 'cash_discount',
    discountPercent: 150,
  };
  const result = calculatePromotion(100, 2, [tier]);
  assert.equal(result.grossAmount, 200);
  assert.equal(result.netAmount, 0);
  assert.equal(result.cashDiscount, 200);
});

test('cached visual signatures reject empty, short, malformed and zero-quality values', () => {
  const data = imported();
  assert.equal(visualSignaturesComplete(data, { 'CARD-A': signature('', '', 0) }), false);
  assert.equal(visualSignaturesComplete(data, { 'CARD-A': signature('aabb', 'aabb') }), false);
  assert.equal(visualSignaturesComplete(data, { 'CARD-A': signature('z'.repeat(64), 'ab'.repeat(32)) }), false);
  assert.equal(visualSignaturesComplete(data, { 'CARD-A': signature('ab'.repeat(32), 'cd'.repeat(32), 0) }), false);
  assert.equal(visualSignaturesComplete(data, { 'CARD-A': signature('ab'.repeat(32), 'cd'.repeat(32)) }), true);
});

test('PDF importer enforces byte, page, card and duplicate limits before accepting output', () => {
  const source = readFileSync('src/promo-new/import/pdf-importer.ts', 'utf8');
  assert.match(source, /MAX_PROMO_PDF_BYTES = 50 \* 1024 \* 1024/u);
  assert.match(source, /MAX_PROMO_PDF_PAGES = 120/u);
  assert.match(source, /MAX_PROMO_PDF_CARDS = 2_000/u);
  assert.match(source, /promo_pdf_too_large/u);
  assert.match(source, /promo_pdf_page_limit/u);
  assert.match(source, /promo_pdf_card_limit/u);
  assert.match(source, /throw new Error\('duplicate_card_id'\)/u);
  assert.match(source, /throw new Error\('duplicate_card_position'\)/u);
  assert.doesNotMatch(source, /card\.confidence = Number\(Math\.min\(1, card\.confidence \+ 0\.2\)/u);
});
