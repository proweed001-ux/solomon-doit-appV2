import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('rebuild Preview keeps legacy Draft and Publish writes disabled', () => {
  const api = read('src/promo-new/shared/api.ts');
  assert.match(api, /const LEGACY_WRITES_ENABLED = false/u);
  assert.match(api, /legacy_write_disabled_pending_atomic_revision_staging/u);
  const guard = api.indexOf('function assertWritableRuntime');
  const draft = api.indexOf('export async function saveDraft');
  const publish = api.indexOf('export async function publishVersion');
  assert.ok(guard >= 0 && draft > guard && publish > draft);
  assert.match(api, /export async function saveDraft[\s\S]*?assertWritableRuntime\(\)/u);
  assert.match(api, /export async function publishVersion[\s\S]*?assertWritableRuntime\(\)/u);
});
