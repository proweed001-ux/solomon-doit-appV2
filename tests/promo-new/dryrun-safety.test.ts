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

test('dry-run hides write controls and API blocks write calls independently of the UI', () => {
  const html = read('dist/promo-admin-new.html');
  const api = read('src/promo-new/shared/api.ts');
  assert.match(html, /body\[data-promo-readonly="1"\] \.footer-actions \.btn\.primary/u);
  assert.match(html, /body\[data-promo-readonly="1"\] \.footer-actions \.btn\.dark/u);
  assert.match(html, /if \(demo \|\| dryRun\) document\.body\.dataset\.promoReadonly = '1'/u);
  assert.match(api, /function assertWritableRuntime\(\)/u);
  assert.match(api, /read_only_runtime_write_blocked/u);
  assert.match(api, /export async function saveDraft[\s\S]*?assertWritableRuntime\(\)/u);
  assert.match(api, /export async function publishVersion[\s\S]*?assertWritableRuntime\(\)/u);
});

test('grouping stops before fallback OCR when Product Master is unavailable', () => {
  const client = read('src/promo-new/admin/grouping-client.ts');
  assert.match(client, /input\.existingSkus\.length === 0/u);
  assert.match(client, /product_master_required_before_grouping/u);
});

test('cache accepts only the text-first schema and no longer requires visual signatures', () => {
  const cache = read('src/promo-new/admin/test-cache.ts');
  assert.match(cache, /CACHE_SCHEMA_VERSION = 2/u);
  assert.match(cache, /PIPELINE_VERSION = 'text-first-product-master-v1'/u);
  assert.match(cache, /visualSignatures: \{\}/u);
  assert.doesNotMatch(cache, /cache_visual_signatures_incomplete/u);
  assert.doesNotMatch(cache, /signaturesComplete/u);
});
