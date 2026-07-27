import assert from 'node:assert/strict';
import test from 'node:test';
import { countLogicalReferenceAnchors, type Rect } from '../../src/promo-new/import/grid-detector';

const card: Rect = { x: 100, y: 100, width: 1000, height: 600 };

test('split yellow reference pieces inside one printed box count as one logical anchor', () => {
  const fragments: Rect[] = [
    { x: 160, y: 440, width: 82, height: 92 },
    { x: 248, y: 444, width: 70, height: 86 },
  ];
  assert.equal(countLogicalReferenceAnchors(fragments, card), 1);
});

test('vertically split reference pieces separated by dark text still count as one anchor', () => {
  const fragments: Rect[] = [
    { x: 165, y: 430, width: 120, height: 48 },
    { x: 168, y: 493, width: 116, height: 50 },
  ];
  assert.equal(countLogicalReferenceAnchors(fragments, card), 1);
});

test('two genuinely separate lower-left reference boxes remain invalid', () => {
  const separateBoxes: Rect[] = [
    { x: 150, y: 440, width: 80, height: 90 },
    { x: 330, y: 442, width: 80, height: 88 },
  ];
  assert.equal(countLogicalReferenceAnchors(separateBoxes, card), 2);
});

test('missing and single reference evidence retain fail-closed counts', () => {
  assert.equal(countLogicalReferenceAnchors([], card), 0);
  assert.equal(countLogicalReferenceAnchors([{ x: 160, y: 440, width: 120, height: 90 }], card), 1);
});
