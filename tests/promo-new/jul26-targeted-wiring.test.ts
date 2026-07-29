import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string): string => fs.readFileSync(path, 'utf8');

test('runtime visual-first grouping does not wire workbook Scope repair', () => {
  const worker = read('src/promo-new/admin/grouping-worker.ts');
  assert.doesNotMatch(worker, /repairCardsWithMasterBackedScopes/u);
  assert.doesNotMatch(worker, /resolveTextFirstScopesSafely|resolveScopesSafely/u);
  assert.match(worker, /rawText: card\.productText \|\| ''/u);
  assert.match(worker, /buildVisualProductClusters/u);
  assert.match(worker, /grouping:mode:visual_first_anchored/u);
});

test('card header OCR requires repeated size evidence and reaches the actual size line', () => {
  const source = read('src/promo-new/import/card-header-ocr.ts');
  assert.match(source, /height: 0\.58/u);
  assert.match(source, /chooseTrustedCardHeaderText/u);
  assert.match(source, /support\.get\(size\).*>= 2/u);
  assert.doesNotMatch(source, /if \(bestScore >= 112\) return recognized\.join/u);
});

test('legacy Product Master repair remains isolated and reparses canonical names safely', () => {
  const source = read('src/promo-new/domain/master-backed-card-repair.ts');
  const worker = read('src/promo-new/admin/grouping-worker.ts');
  assert.match(source, /\[master\.canonicalName, \.\.\.master\.evidence\]/u);
  assert.match(source, /parsed: createSkuCandidate\(evidence\)/u);
  assert.match(source, /master\.parsed\.identity/u);
  assert.doesNotMatch(source, /const identity = master\.original\.identity/u);
  assert.doesNotMatch(worker, /master-backed-card-repair/u);
});
