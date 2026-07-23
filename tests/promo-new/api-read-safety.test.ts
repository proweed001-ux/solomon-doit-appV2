import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('published API quarantines legacy price conflicts before returning the catalog', () => {
  const source = read('api/promo-new.js');
  assert.match(source, /export function quarantinePublishedPriceConflicts/u);
  assert.match(source, /legacy_price_conflict_blocked/u);
  assert.match(source, /status: 'blocked'/u);
  assert.match(source, /status: 'need_review'/u);
  assert.match(source, /quarantinePublishedPriceConflicts\(await getPublishedCatalog/u);
});

test('upload-key auth limits request size and returns generic errors', () => {
  const source = read('api/promo-legacy-auth.js');
  assert.match(source, /MAX_LOGIN_BODY_BYTES = 4_096/u);
  assert.match(source, /MAX_UPLOAD_KEY_LENGTH = 200/u);
  assert.match(source, /request_body_too_large/u);
  assert.match(source, /invalid_upload_key/u);
  assert.match(source, /promo_auth_unavailable/u);
  assert.match(source, /promo_test_backend_not_configured/u);
  assert.match(source, /hostname === productionHostname/u);
  assert.match(source, /testDatabaseEnabled\(\)/u);
  assert.match(source, /HARDENING_PREVIEW_HOST_PREFIX/u);
  assert.match(source, /String\(process\.env\.VERCEL_ENV \|\| ''\) === 'preview'/u);
  assert.match(source, /vercelUrl\.startsWith\(HARDENING_PREVIEW_HOST_PREFIX\)/u);
  assert.match(source, /HARDENING_TEST_SUPABASE_URL/u);
  assert.match(source, /function rpcBoolean\(value\)/u);
  assert.match(source, /action === 'runtime-status'/u);
  assert.match(source, /testBackendConfigured/u);
  assert.match(source, /testSupabase\('\/rest\/v1\/rpc\/validate_promo_test_admin_key_v2'/u);
  assert.match(source, /testSupabase\('\/rest\/v1\/rpc\/load_promo_test_master_data_v2'/u);
  assert.match(source, /testSupabase\('\/rest\/v1\/rpc\/save_promo_grouping_snapshot_v2'/u);
  assert.match(source, /testSupabase\(`\/rest\/v1\/promo_product_master\?status=eq\.active/u);
  assert.match(source, /testSupabase\('\/rest\/v1\/rpc\/create_promo_master_product'/u);
  assert.doesNotMatch(source, /supabase\('\/rest\/v1\/rpc\/save_manual_promo_grouping_snapshot'/u);
  assert.doesNotMatch(source, /detail:\s*message/u);
});

test('all legacy Draft and Publish network calls remain disabled in the rebuild Preview', () => {
  const source = read('src/promo-new/shared/api.ts');
  assert.match(source, /const LEGACY_WRITES_ENABLED = false/u);
  assert.match(source, /legacy_write_disabled_pending_atomic_revision_staging/u);
  assert.match(source, /export async function saveDraft[\s\S]*?assertWritableRuntime\(\)/u);
  assert.match(source, /export async function publishVersion[\s\S]*?assertWritableRuntime\(\)/u);
});
