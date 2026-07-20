import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { performance } from 'node:perf_hooks';
import { resolveTextFirstScopesSafely, type TextFirstScopeProgress } from '../../src/promo-new/domain/text-first-scope';
import type { PromotionFamily, PromotionTier } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { makeCardId } from '../../src/promo-new/import/card-id';

const MONTH = 'PROMO-2026-07';
const CLASSES = ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L'];
const BRANDS = ['H&S', 'PANTENE', 'REJOICE', 'OLAY', 'ORAL-B', 'GILLETTE', 'DOWNY', 'SAFEGUARD', 'VICKS', 'AMBI PUR'];

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
  const brand = BRANDS[index % BRANDS.length];
  const size = 60 + (index % 60);
  return {
    id: `family:${index}`,
    familyKey: `PF-${brand}-${size}-${index}`,
    name: `${brand} แชมพู ${size} มล.`,
    scopeText: `${brand} แชมพู ${size} มล. ทุกสูตร`,
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

test('indexed text-first resolver remains bounded for legacy/manual tools', async () => {
  const cards = Array.from({ length: 212 }, (_, index) => card(index));
  const families = Array.from({ length: 600 }, (_, index) => family(index));
  const updates: TextFirstScopeProgress[] = [];
  const started = performance.now();
  const result = await resolveTextFirstScopesSafely(cards, families, update => updates.push(update));
  const elapsed = performance.now() - started;
  const last = updates.at(-1);

  assert.equal(result.size, 212);
  assert.equal([...result.values()].some(item => item.method === 'visual_consensus'), false);
  assert.ok(updates.length >= 18, `expected_chunk_progress:${updates.length}`);
  assert.equal(last?.processed, 212);
  assert.equal(last?.total, 212);
  assert.ok((last?.candidateComparisons || 0) < cards.length * families.length / 4, `scope_index_not_effective:${last?.candidateComparisons}`);
  assert.ok(elapsed < 5_000, `indexed_text_first_scope_too_slow:${elapsed.toFixed(1)}ms`);
});

test('runtime Worker uses anchored visual fingerprints while retaining timeout and manual-control guards', () => {
  const worker = readFileSync('src/promo-new/admin/grouping-worker.ts', 'utf8');
  const client = readFileSync('src/promo-new/admin/grouping-client.ts', 'utf8');

  assert.doesNotMatch(worker, /resolveTextFirstScopesSafely|resolveScopesSafely|applyClassMatrixRecovery|repairCardsWithMasterBackedScopes/u);
  assert.match(worker, /rawText: card\.productText \|\| ''/u);
  assert.match(worker, /buildVisualProductClusters/u);
  assert.match(worker, /groupImportedCards\([\s\S]*?payload\.existingSkus,[\s\n]*\[\],[\s\n]*\[\],[\s\n]*\{\},[\s\n]*noScopes/u);
  assert.match(worker, /โดยไม่ใช้ราคา โปรโมชั่น หรือ Scope/u);
  assert.match(worker, /grouping:mode:visual_first_anchored/u);
  assert.match(worker, /ตรวจชื่อกับ Product Master เสร็จ/u);
  assert.match(client, /buildVisualProductSignatures/u);
  assert.match(client, /GROUPING_STALL_TIMEOUT_MS/u);
  assert.match(client, /GROUPING_HARD_TIMEOUT_MS/u);
  assert.doesNotMatch(client, /new Error\('grouping_worker_timeout'\)/u);
});
