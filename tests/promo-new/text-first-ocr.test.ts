import assert from 'node:assert/strict';
import test from 'node:test';
import { enrichAdaptiveCardHeaders, selectAdaptiveHeaderOcrTargets } from '../../src/promo-new/admin/adaptive-header-ocr';
import type { GroupingResult } from '../../src/promo-new/domain/grouping';
import { matchProductMasterByText, repairCommonProductOcr } from '../../src/promo-new/domain/master-text-matcher';
import { createSkuCandidate } from '../../src/promo-new/domain/sku-identity';
import type { Sku } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

function master(id: string, canonicalName: string, aliases: string[] = []): Sku {
  return {
    id: `MASTER-${id}`,
    code: `PM-${id}`,
    canonicalName,
    identityKey: `legacy-${id}`,
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
    evidence: aliases,
    failureReasons: [],
  };
}

function card(cardId: string, productText: string, failureReasons: string[] = []): ImportedCardCandidate {
  return {
    cardId,
    monthKey: 'PROMO-2026-07',
    page: 1,
    sequence: 1,
    classId: 'HFSS',
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: productText,
    productText,
    pageClassText: 'HFSS',
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons,
  };
}

function emptyGrouping(overrides: Partial<GroupingResult> = {}): GroupingResult {
  return {
    skus: [],
    prices: [],
    cards: [],
    groups: [],
    quarantineCards: [],
    warnings: [],
    diagnostics: { masterText: 0, structuredScope: 0, visualConsensus: 0, exactIdentity: 0, unresolved: 0 },
    ...overrides,
  };
}

test('repairs common OCR brand, type, digit and unit errors before matching', () => {
  assert.equal(repairCommonProductOcr('เฮดแอนโชเดอ แซมพู 14O บล.'), 'H&S แชมพู 140 มล.');
});

test('matches noisy H&S shampoo text to the correct 140 ml Product Master', () => {
  const source = 'เฮดแอนโชเดอ แซมพู 14O บล.';
  const observed = createSkuCandidate(source);
  const result = matchProductMasterByText(observed, source, [
    master('hs-65', 'H&S แชมพู ทุกสูตร ขนาด 65 มล.'),
    master('hs-140', 'H&S แชมพู ขนาด 140 มล.'),
  ]);
  assert.equal(result.status, 'matched');
  assert.equal(result.sku?.id, 'MASTER-hs-140');
});

test('rejects a Product Master when product type conflicts', () => {
  const source = 'H&S ครีมนวด 140 มล.';
  const result = matchProductMasterByText(createSkuCandidate(source), source, [
    master('shampoo', 'H&S แชมพู ขนาด 140 มล.'),
  ]);
  assert.equal(result.status, 'unmatched');
  assert.equal(result.sku, null);
});

test('does not match a specific variant when OCR has no variant evidence', () => {
  const source = 'H&S แชมพู 140 มล.';
  const result = matchProductMasterByText(createSkuCandidate(source), source, [
    master('cool-menthol', 'H&S แชมพู คูลเมนทอล 140 มล.'),
  ]);
  assert.equal(result.status, 'unmatched');
  assert.equal(result.sku, null);
});

test('does not auto-match placeholder Product Masters', () => {
  const source = 'H&S แชมพู 140 มล.';
  const result = matchProductMasterByText(createSkuCandidate(source), source, [
    master('placeholder', 'รอตรวจข้อความจาก PDF - HFS-L ใบที่ 003'),
  ]);
  assert.equal(result.status, 'unmatched');
});

test('keeps equal Product Master candidates ambiguous instead of guessing', () => {
  const source = 'H&S แชมพู 140 มล.';
  const result = matchProductMasterByText(createSkuCandidate(source), source, [
    master('one', 'H&S แชมพู ขนาด 140 มล.'),
    master('two', 'H&S แชมพู ขนาด 140 มล.'),
  ]);
  assert.equal(result.status, 'ambiguous');
  assert.equal(result.sku, null);
});

test('single-pass OCR never schedules unresolved cards for a second read', () => {
  const unresolved = card('CARD-1', 'H&S แชมพู', ['size_missing', 'size_unit_missing']);
  const grouping = emptyGrouping({
    quarantineCards: [unresolved],
    diagnostics: { masterText: 0, structuredScope: 0, visualConsensus: 0, exactIdentity: 0, unresolved: 1 },
  });
  const selection = selectAdaptiveHeaderOcrTargets([unresolved], grouping);
  assert.equal(selection.targetIds.size, 0);
  assert.equal(selection.unresolvedTargets, 0);
  assert.equal(selection.candidateTargets, 0);
  assert.equal(selection.skippedByExistingKnowledge, 1);
  assert.equal(selection.unresolvedWithoutOcrBenefit, 1);
});

test('single-pass OCR guard rejects any attempted fallback OCR call', async () => {
  const unresolved = card('CARD-1', 'H&S แชมพู', ['size_missing', 'size_unit_missing']);
  await assert.rejects(
    enrichAdaptiveCardHeaders([unresolved], new Set(['CARD-1'])),
    /second_pass_ocr_disabled_single_pass_mode/u,
  );
});
