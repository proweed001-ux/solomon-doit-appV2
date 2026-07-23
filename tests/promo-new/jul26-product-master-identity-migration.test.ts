import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const sql = readFileSync(
  new URL('../../supabase/migrations/20260724174500_backfill_jul26_product_master_identity.sql', import.meta.url),
  'utf8',
);

test('JUL26 Product Master identity migration contains exactly 42 stable normalized keys', () => {
  const rows = [...sql.matchAll(/^\s*\('([^']+)',\s*'[^']+',\s*'[^']+',/gmu)];
  const keys = rows.map(match => match[1]);
  assert.equal(keys.length, 42);
  assert.equal(new Set(keys).size, 42);
  assert.ok(keys.includes('hsแชมพู65ml'));
  assert.ok(keys.includes('downyปรับผ้านุ่ม480ml'));
  assert.ok(keys.includes('downyปรับผ้านุ่มsunrisefresh480ml'));
  assert.ok(keys.includes('ยิลเลตต์ด้ามมีดsuperclick'));
});

test('migration is guarded and cannot silently update a partial Product Master set', () => {
  assert.match(sql, /to_regclass\('public\.promo_product_master'\)/u);
  assert.match(sql, /if v_updated <> 42 then/u);
  assert.match(sql, /jul26_product_master_identity_count_mismatch/u);
  assert.match(sql, /Do not apply to Production without explicit approval/u);
});

test('same-size Downy groups and size-less products receive explicit variants', () => {
  assert.match(sql, /downyปรับผ้านุ่ม480ml'[\s\S]*'ทุกสูตร\/กลุ่มสูตรน้ำหอม'/u);
  assert.match(sql, /downyปรับผ้านุ่มsunrisefresh480ml'[\s\S]*'ซันไรซ์เฟรช'/u);
  assert.match(sql, /ยิลเลตต์ด้ามมีดsuperclick'[\s\S]*'Super Click'/u);
  assert.match(sql, /panteneแพ็คแชมพูแชมพู370370ml'[\s\S]*null::numeric/u);
});
