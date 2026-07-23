import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { stagingBackend, validateAtomicRevisionRequest } from '../../api/promo-new-staging-write.js';

function dataset(overrides: Record<string, unknown> = {}) {
  return {
    schema: 'promo-system-rebuild-v1',
    version: {
      id: '77777777-7777-4777-8777-777777777777',
      monthKey: 'PROMO-2026-07',
    },
    skus: [{ id: 'SKU-1' }],
    prices: [{ skuId: 'SKU-1' }],
    promotionFamilies: [{ id: 'FAMILY-1' }],
    productGroups: [{ id: 'GROUP-1', monthKey: 'PROMO-2026-07' }],
    cards: [{ id: 'CARD-1', monthKey: 'PROMO-2026-07' }],
    ...overrides,
  };
}

test('atomic revision request accepts one complete same-month payload', () => {
  const result = validateAtomicRevisionRequest({ action: 'save-draft', dataset: dataset() });
  assert.equal(result.monthKey, 'PROMO-2026-07');
  assert.equal(result.versionId, '77777777-7777-4777-8777-777777777777');
  assert.equal(result.cardCount, 1);
  assert.equal(result.groupCount, 1);
  assert.equal(result.familyCount, 1);
});

test('atomic revision request rejects incomplete and cross-month payloads', () => {
  assert.throws(
    () => validateAtomicRevisionRequest({ action: 'save-draft', dataset: dataset({ cards: [] }) }),
    /card_count_invalid/u,
  );
  assert.throws(
    () => validateAtomicRevisionRequest({
      action: 'save-draft',
      dataset: dataset({ cards: [{ id: 'CARD-1', monthKey: 'PROMO-2026-08' }] }),
    }),
    /card_crosses_month/u,
  );
  assert.throws(
    () => validateAtomicRevisionRequest({ action: 'batch-upload', dataset: dataset() }),
    /action_invalid/u,
  );
});

test('staging backend cannot point at Production', { concurrency: false }, () => {
  const previous = {
    enabled: process.env.PROMO_TEST_DATABASE,
    url: process.env.PROMO_TEST_SUPABASE_URL,
    key: process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY,
  };
  try {
    process.env.PROMO_TEST_DATABASE = '1';
    process.env.PROMO_TEST_SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
    process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY = 'test-key';
    assert.throws(() => stagingBackend(), /production_backend_rejected/u);
  } finally {
    if (previous.enabled == null) delete process.env.PROMO_TEST_DATABASE;
    else process.env.PROMO_TEST_DATABASE = previous.enabled;
    if (previous.url == null) delete process.env.PROMO_TEST_SUPABASE_URL;
    else process.env.PROMO_TEST_SUPABASE_URL = previous.url;
    if (previous.key == null) delete process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY;
    else process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY = previous.key;
  }
});

test('staging migration enforces transaction serialization and idempotent retries', async () => {
  const sql = await readFile('supabase/migrations/20260723233000_add_staging_atomic_revision_network.sql', 'utf8');
  assert.match(sql, /staging_only_promo_test_admin_keys_missing/u);
  assert.match(sql, /security definer/u);
  assert.match(sql, /pg_advisory_xact_lock/u);
  assert.match(sql, /payload_fingerprint/u);
  assert.match(sql, /'idempotent', true/u);
  assert.match(sql, /existing_revision_incomplete/u);
  assert.match(sql, /grant execute on function public\.save_promo_test_revision_v1\(jsonb,text,text\) to anon, authenticated/u);
});

test('network endpoint remains test-only and never enables legacy publish', async () => {
  const source = await readFile('api/promo-new-staging-write.js', 'utf8');
  assert.match(source, /PROMO_TEST_DATABASE/u);
  assert.match(source, /production_backend_rejected/u);
  assert.match(source, /save_promo_test_revision_v1/u);
  assert.doesNotMatch(source, /finalize_latest/u);
  assert.doesNotMatch(source, /promo_new_publish_version/u);
});
