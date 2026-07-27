import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { parseWebpDataUrl, validateImageIdentity } from '../../api/promo-new-staging-image.js';
import { validateStagingPublishRequest } from '../../api/promo-new-staging-publish.js';

const root = process.cwd();
const read = (path: string) => fs.readFileSync(`${root}/${path}`, 'utf8');
const VERSION_ID = '11111111-1111-4111-8111-111111111111';
const CARD_ID = '22222222-2222-4222-8222-222222222222';

test('staging image identity accepts UUIDs and rejects invalid IDs', () => {
  assert.deepEqual(validateImageIdentity(VERSION_ID, CARD_ID), {
    versionId: VERSION_ID,
    cardId: CARD_ID,
  });
  assert.throws(() => validateImageIdentity('not-a-version', CARD_ID), /version_id_invalid/u);
  assert.throws(() => validateImageIdentity(VERSION_ID, 'not-a-card'), /card_id_invalid/u);
});

test('staging image input is bounded WebP data only', () => {
  const bytes = Buffer.alloc(32);
  bytes.write('RIFF', 0, 'ascii');
  bytes.write('WEBP', 8, 'ascii');
  const parsed = parseWebpDataUrl(`data:image/webp;base64,${bytes.toString('base64')}`);
  assert.equal(parsed.bytes.length, 32);
  assert.throws(() => parseWebpDataUrl('data:image/png;base64,AAAA'), /image_must_be_webp_data_url/u);
  const invalid = Buffer.alloc(32).toString('base64');
  assert.throws(() => parseWebpDataUrl(`data:image/webp;base64,${invalid}`), /image_signature_invalid/u);
});

test('staging publish accepts only a version UUID', () => {
  assert.deepEqual(validateStagingPublishRequest({ versionId: VERSION_ID }), { versionId: VERSION_ID });
  assert.throws(() => validateStagingPublishRequest({ versionId: 'bad' }), /version_id_invalid/u);
});

test('customer preview bridge stays staging-only and published-only', () => {
  const vite = read('vite.promo-new.config.ts');
  const api = read('src/promo-new/shared/api.ts');
  const admin = read('src/promo-new/admin/main.tsx');
  const migration = read('supabase/migrations/20260727001000_add_staging_customer_preview.sql');

  assert.match(vite, /VERCEL_ENV !== 'production'/u);
  assert.match(vite, /PROMO_TEST_DATABASE === '1'/u);
  assert.match(api, /\/api\/promo-new-staging-write/u);
  assert.match(api, /\/api\/promo-new-staging-publish/u);
  assert.match(api, /\/api\/promo-new-staging-image/u);
  assert.match(admin, /href=\{demo \? '\/promo-new\.html\?demo=1' : '\/promo-new\.html'\}/u);
  assert.match(admin, /Publish หน้าลูกค้าทดสอบ/u);

  assert.match(migration, /promo_test_admin_keys_missing/u);
  assert.match(migration, /enable row level security/u);
  assert.match(migration, /revoke all on table public\.promo_test_card_images from anon, authenticated/u);
  assert.match(migration, /v\.status = 'published'/u);
  assert.doesNotMatch(migration, /storage\.objects|create policy[\s\S]*insert[\s\S]*to anon/iu);
});
