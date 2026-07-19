import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { performance } from 'node:perf_hooks';
import { resolveScopesSafely } from '../../src/promo-new/domain/scope-safety';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';
const CLASSES = ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'];

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

function family(index: number): PromotionFamily {
  const size = 60 + index;
  return {
    id: `family:${index}`,
    familyKey: `PF-HS-${size}`,
    name: `H&S แชมพู ${size} มล.`,
    scopeText: `H&S แชมพู ${size} มล. ทุกสูตร`,
    sourceRows: [index + 1],
    tiersByClass: Object.fromEntries(CLASSES.map(classId => [classId, [tier]])),
    failureReasons: [],
  };
}

function card(index: number): ImportedCardCandidate {
  const classId = CLASSES[index % CLASSES.length];
  const size = 60 + (index % 60);
  const page = Math.floor(index / 12) + 1;
  const sequence = index % 12 + 1;
  const productText = `H&S แชมพู ${size} มล.`;
  return {
    cardId: makeCardId(MONTH, classId, page, sequence),
    monthKey: MONTH,
    page,
    sequence,
    classId,
    imageUrl: `data:image/webp;base64,CARD${index}`,
    rawText: `${productText} ราคาแนะนำขายปลีก 49 บาท/ขวด`,
    productText,
    pageClassText: classId,
    confidence: 0.95,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('text-first scope resolution handles 212 cards without entering visual recovery', () => {
  const cards = Array.from({ length: 212 }, (_, index) => card(index));
  const families = Array.from({ length: 60 }, (_, index) => family(index));
  const started = performance.now();
  const result = resolveScopesSafely(cards, families, {});
  const elapsed = performance.now() - started;

  assert.equal(result.size, 212);
  assert.equal([...result.values()].some(item => item.method === 'visual_consensus'), false);
  assert.ok(elapsed < 5_000, `text_first_scope_resolution_too_slow:${elapsed.toFixed(1)}ms`);
});

test('worker reuses scope resolutions and client no longer has a fixed 120-second total timeout', () => {
  const worker = readFileSync('src/promo-new/admin/grouping-worker.ts', 'utf8');
  const client = readFileSync('src/promo-new/admin/grouping-client.ts', 'utf8');
  const scope = readFileSync('src/promo-new/domain/scope-safety.ts', 'utf8');

  assert.match(worker, /matrix\.resolutions,\s*\n\s*\);/u);
  assert.match(worker, /ตรวจหลักฐาน Product Master เสร็จ/u);
  assert.match(client, /GROUPING_STALL_TIMEOUT_MS/u);
  assert.match(client, /GROUPING_HARD_TIMEOUT_MS/u);
  assert.doesNotMatch(client, /new Error\('grouping_worker_timeout'\)/u);
  assert.match(scope, /if \(!hasVisualEvidence\(cards, visualSignatures\)\) return resolutions;/u);
});
