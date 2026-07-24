import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('dry-run requires an upload-key session and validates stored sessions before loading', () => {
  const html = read('dist/promo-admin-new.html');
  assert.match(html, /const dryRun = params\.get\('dryrun'\) === '1'/u);
  assert.match(html, /if \(demo\) \{\s*loadApp\(\)/u);
  assert.doesNotMatch(html, /if \(demo \|\| dryRun\) \{\s*loadApp\(\)/u);
  assert.match(html, /promo-legacy-auth\?action=session/u);
  assert.match(html, /sessionStorage\.removeItem\(sessionKey\)/u);
});

test('all rebuild Preview modes hide write controls and API blocks write calls independently of the UI', () => {
  const html = read('dist/promo-admin-new.html');
  const api = read('src/promo-new/shared/api.ts');
  assert.match(html, /\.footer-actions \.btn\.primary/u);
  assert.match(html, /\.footer-actions \.btn\.dark/u);
  assert.match(api, /const LEGACY_WRITES_ENABLED = false/u);
  assert.match(api, /function assertWritableRuntime\(\)/u);
  assert.match(api, /legacy_write_disabled_pending_atomic_revision_staging/u);
  assert.match(api, /read_only_runtime_write_blocked/u);
  assert.match(api, /export async function saveDraft[\s\S]*?assertWritableRuntime\(\)/u);
  assert.match(api, /export async function publishVersion[\s\S]*?assertWritableRuntime\(\)/u);
});

test('grouping stops before visual work when Product Master is unavailable', () => {
  const client = read('src/promo-new/admin/grouping-client.ts');
  assert.match(client, /input\.existingSkus\.length === 0/u);
  assert.match(client, /product_master_required_before_grouping/u);
});

test('cache rejects prior automatic-grouping records and preserves the manual grid-only contract', () => {
  const cache = read('src/promo-new/admin/test-cache.ts');
  const client = read('src/promo-new/admin/grouping-client.ts');
  assert.match(cache, /PROMO_TEST_CACHE_SCHEMA_VERSION = 7/u);
  assert.match(cache, /PROMO_TEST_PIPELINE_VERSION = 'density-grid-v2-class-only-manual-grouping'/u);
  assert.match(cache, /record\.schemaVersion === PROMO_TEST_CACHE_SCHEMA_VERSION/u);
  assert.match(cache, /record\.pipelineVersion === PROMO_TEST_PIPELINE_VERSION/u);
  assert.match(client, /visualProductSignaturesComplete/u);
  assert.match(client, /buildVisualProductSignatures/u);
  assert.match(client, /visual_signatures_incomplete/u);
  assert.match(client, /product_master_required_before_grouping/u);
});
