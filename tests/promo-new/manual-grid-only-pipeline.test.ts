import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

test('admin starts every imported Promo card unassigned and never invokes automatic grouping', () => {
  const source = read('src/promo-new/admin/main.tsx');
  assert.match(source, /extractProductText:\s*false/u);
  assert.match(source, /cards:\s*\[\],\s*productGroups:\s*\[\]/u);
  assert.match(source, /setQuarantine\(unassigned\)/u);
  assert.match(source, /automatic_product_grouping_disabled/u);
  assert.doesNotMatch(source, /runGroupingInWorker/u);
  assert.doesNotMatch(source, /autoAssignPromotionFamilies/u);
});

test('grid-only import keeps page Class detection but suppresses product text and title OCR', () => {
  const source = read('src/promo-new/import/pdf-importer.ts');
  assert.match(source, /extractProductText\?: boolean/u);
  assert.match(source, /const extractProductText = options\.extractProductText !== false/u);
  assert.match(source, /if \(extractProductText && !hasPdfText && options\.enableOcr\)/u);
  assert.match(source, /extractProductText && !productText/u);
});

test('manual-grid cache rejects results from the previous automatic pipeline', () => {
  const source = read('src/promo-new/admin/test-cache.ts');
  assert.match(source, /PROMO_TEST_CACHE_SCHEMA_VERSION = 7/u);
  assert.match(source, /density-grid-v2-class-only-manual-grouping/u);
});
