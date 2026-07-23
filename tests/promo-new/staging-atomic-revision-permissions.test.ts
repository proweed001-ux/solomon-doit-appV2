import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('staging atomic revision RPC is removed from authenticated application users', async () => {
  const sql = await readFile(
    'supabase/migrations/20260723234500_harden_staging_atomic_revision_permissions.sql',
    'utf8',
  );
  assert.match(sql, /staging_only_promo_test_admin_keys_missing/u);
  assert.match(
    sql,
    /revoke execute on function public\.save_promo_test_revision_v1\(jsonb,text,text\) from authenticated/u,
  );
  assert.match(
    sql,
    /grant execute on function public\.save_promo_test_revision_v1\(jsonb,text,text\) to anon/u,
  );
});
