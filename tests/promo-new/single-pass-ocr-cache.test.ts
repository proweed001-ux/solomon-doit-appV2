import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareCachedRun } from '../../src/promo-new/admin/cached-run';
import type { PdfImportResult } from '../../src/promo-new/import/pdf-importer';

function cachedImport(warnings: string[]): PdfImportResult {
  return {
    cards: [{
      cardId: 'CARD-HFSS-1',
      monthKey: 'PROMO-2026-07',
      page: 1,
      sequence: 1,
      classId: 'HFSS',
      imageUrl: 'data:image/webp;base64,AA==',
      rawText: 'H&S แชมพู 65 มล.',
      productText: 'H&S แชมพู 65 มล.',
      pageClassText: 'HFSS',
      confidence: 0.9,
      evidenceMethod: 'page_ocr',
      bounds: { x: 0, y: 0, width: 100, height: 100 },
      failureReasons: [],
    }],
    pages: [],
    elapsedMs: 0,
    warnings,
  };
}

test('cache created by fallback OCR must be reprocessed in single-pass mode', () => {
  assert.throws(
    () => prepareCachedRun(cachedImport(['adaptive_header_ocr_attempted:1']), {}),
    /cache_reprocess_required_single_pass_ocr/u,
  );
});

test('single-pass cache without fallback OCR evidence remains usable', () => {
  const prepared = prepareCachedRun(cachedImport(['adaptive_header_ocr_disabled:single_pass_only']), {});
  assert.equal(prepared.imported.cards.length, 1);
  assert.ok(prepared.warnings.includes('cache:ocr_mode:single_pass_only'));
});
