import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string): string => fs.readFileSync(path, 'utf8');

test('JUL26 targeted repair is wired before Scope resolution and grouping', () => {
  const worker = read('src/promo-new/admin/grouping-worker.ts');
  const repairCall = worker.indexOf('repairCardsWithMasterBackedScopes(');
  const scopeCall = worker.indexOf('resolveTextFirstScopesSafely(workingCards');
  const groupingCall = worker.indexOf('groupImportedCards(');
  assert.ok(repairCall >= 0);
  assert.ok(scopeCall > repairCall);
  assert.ok(groupingCall > repairCall);
  assert.match(worker, /const workingCards = repaired\.cards/u);
});

test('card header OCR requires repeated size evidence and reaches the actual size line', () => {
  const source = read('src/promo-new/import/card-header-ocr.ts');
  assert.match(source, /height: 0\.58/u);
  assert.match(source, /chooseTrustedCardHeaderText/u);
  assert.match(source, /support\.get\(size\).*>= 2/u);
  assert.doesNotMatch(source, /if \(bestScore >= 112\) return recognized\.join/u);
});

test('legacy Product Master repair reparses canonical name instead of trusting legacy identity fields', () => {
  const source = read('src/promo-new/domain/master-backed-card-repair.ts');
  assert.match(source, /\[master\.canonicalName, \.\.\.master\.evidence\]/u);
  assert.match(source, /parsed: createSkuCandidate\(evidence\)/u);
  assert.match(source, /master\.parsed\.identity/u);
  assert.doesNotMatch(source, /const identity = master\.original\.identity/u);
});
