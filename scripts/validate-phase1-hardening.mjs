import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseline = '1c45ad8f0e34f7efd8a6200a19dcb8807bc7d6bf';
const migrationPath = 'supabase/migrations/20260711102421_phase_1_safe_security_hardening.sql';
const rollbackPath = 'supabase/rollback/20260711102421_phase_1_safe_security_hardening.sql';
const testPath = 'supabase/tests/phase_1_safe_security_hardening.sql';

const migration = readFileSync(migrationPath, 'utf8');
const rollback = readFileSync(rollbackPath, 'utf8');
const tests = readFileSync(testPath, 'utf8');
const failures = [];

function requireText(source, text, label) {
  if (!source.includes(text)) failures.push(`${label}: missing ${text}`);
}

function forbid(source, expression, label) {
  if (expression.test(source)) failures.push(`${label}: forbidden ${expression}`);
}

for (const [source, label] of [[migration, 'migration'], [rollback, 'rollback']]) {
  requireText(source.toLowerCase(), 'begin;', label);
  requireText(source.toLowerCase(), 'commit;', label);
}

requireText(migration, 'alter table public.promo_upload_keys enable row level security;', 'migration');
requireText(migration, 'revoke all on table public.promo_upload_keys from public, anon, authenticated;', 'migration');
requireText(migration, 'revoke execute on function public.doit_versions_single_active_guard() from public, anon, authenticated;', 'migration');
requireText(migration, 'revoke execute on function public.set_doit_active_version(uuid) from public, anon, authenticated;', 'migration');
requireText(migration, 'grant select on table', 'migration');

forbid(migration, /\bdrop\s+(table|schema|function|view)\b/i, 'migration');
forbid(migration, /\btruncate\b/i, 'migration');
forbid(migration, /\b(delete|update|insert)\s+from\b/i, 'migration');
forbid(migration, /\balter\s+table\s+public\.doit_versions\b/i, 'migration');
forbid(migration, /\b(create|replace|alter)\s+view\b/i, 'migration');

requireText(rollback, 'alter table public.promo_upload_keys disable row level security;', 'rollback');
requireText(rollback, 'grant execute on function public.doit_versions_single_active_guard()', 'rollback');
requireText(rollback, 'grant execute on function public.set_doit_active_version(uuid)', 'rollback');

requireText(tests, "not has_table_privilege('anon', 'public.promo_upload_keys', 'select')", 'tests');
requireText(tests, "not has_function_privilege('anon', 'public.set_doit_active_version(uuid)', 'execute')", 'tests');
requireText(tests, "has_table_privilege('anon', 'public.promo_cards_with_functions', 'select')", 'tests');

const changed = execFileSync('git', ['diff', '--name-only', baseline, '--'], { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);
const allowed = [
  'docs/phase-1-safe-hardening.md',
  migrationPath,
  rollbackPath,
  testPath,
  'scripts/validate-phase1-hardening.mjs',
];
for (const path of new Set([...changed, ...untracked])) {
  if (!allowed.includes(path)) failures.push(`scope: unexpected changed file ${path}`);
}

if (failures.length) {
  console.error('Phase 1 free validation failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Phase 1 free validation passed.');
console.log(`Checked ${changed.length + untracked.length} scoped files against production baseline ${baseline.slice(0, 8)}.`);
console.log('No production HTML, JavaScript, Vercel config, or application source file is changed.');
