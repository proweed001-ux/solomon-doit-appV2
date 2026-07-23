import assert from 'node:assert/strict';
import test from 'node:test';
import { makeCardId } from '../../src/promo-new/import/card-id';

test('newly imported cards receive opaque stable UUIDs instead of Class/page/sequence IDs', () => {
  const first = makeCardId();
  const second = makeCardId();
  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu);
  assert.notEqual(first, second);
  assert.doesNotMatch(first, /HFSS|P001|C001/u);
});
