import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const required = [
  'dist/promo-admin-new.html', 'dist/promo-new.html', 'dist/assets/promo-new/admin.js', 'dist/assets/promo-new/frontend.js',
  'api/promo-new.js', 'api/_promo-new/supabase.js',
  'supabase/migrations/20260716083231_promo_system_rebuild.sql',
  'supabase/rollback/20260716083231_promo_system_rebuild.sql',
];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const check = (condition, message) => { if (!condition) failures.push(message); };
required.forEach(file => check(fs.existsSync(path.join(root, file)), `missing:${file}`));

const walk = directory => fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
  const relative = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(relative) : [relative];
});
const clientFiles = [...walk('src/promo-new'), 'dist/promo-admin-new.html', 'dist/promo-new.html'];
const clientText = clientFiles.map(file => read(file)).join('\n');
check(!/sb_secret_[A-Za-z0-9_-]+/.test(clientText), 'secret_key_exposed_in_client');
check(!/service_role/i.test(clientText), 'service_role_reference_in_client');
check(!/SUPABASE_SECRET_KEY/.test(clientText), 'server_secret_env_reference_in_client');
check(!/\/rest\/v1\/.+method\s*:\s*['"](?:POST|PATCH|DELETE)/s.test(clientText), 'direct_supabase_write_in_client');
check(!/JUL26|SEP25/.test(clientText), 'hardcoded_month_in_new_client');

const api = read('api/promo-new.js');
check(api.includes('requirePromoAdmin'), 'backend_missing_admin_guard');
check(api.includes('validateDatasetPayload'), 'backend_missing_payload_validation');
check(api.includes('card_crosses_month'), 'backend_missing_month_guard');
check(!/sb_secret_[A-Za-z0-9_-]+/.test(read('api/_promo-new/supabase.js')), 'secret_value_hardcoded_in_backend');

const migration = read('supabase/migrations/20260716083231_promo_system_rebuild.sql');
for (const table of ['promo_new_admins','promo_new_months','promo_new_versions','promo_new_skus','promo_new_sku_prices','promo_new_promotion_families','promo_new_promotion_tiers','promo_new_product_groups','promo_new_cards','promo_new_audit_log']) {
  check(migration.includes(`alter table public.${table} enable row level security;`), `rls_missing:${table}`);
  check(migration.includes(`revoke all on table public.${table} from public, anon, authenticated;`), `public_write_revoke_missing:${table}`);
}
for (const fn of ['promo_new_save_draft','promo_new_publish_version','promo_new_rollback_version','promo_new_get_published_catalog']) {
  check(migration.includes(`function public.${fn}`), `rpc_missing:${fn}`);
}
check(migration.includes("status in ('imported','processing','need_review','draft','ready','published','archived')"), 'version_status_check_missing');
check(migration.includes('publish_class_tiers_missing'), 'publish_missing_class_guard');
check(migration.includes("status = 'published'"), 'published_gate_missing');
check(migration.includes('previous_version_id'), 'rollback_pointer_missing');
for (const action of ['sku_upserted', 'sku_price_changed', 'promotion_assigned']) {
  check(migration.includes(`'${action}'`), `audit_action_missing:${action}`);
}
check(migration.includes("v_version_id uuid := nullif(p_payload #>> '{version,id}', '')::uuid"), 'client_draft_uuid_not_persisted');

const adminSource = read('src/promo-new/admin/main.tsx');
check(adminSource.includes('uploadCardImage'), 'admin_card_upload_flow_missing');
check(adminSource.includes('publishVersion'), 'admin_manual_publish_flow_missing');
check(adminSource.includes('previewChecked'), 'admin_preview_gate_missing');

const rollback = read('supabase/rollback/20260716083231_promo_system_rebuild.sql');
check(rollback.includes('drop table if exists public.promo_new_cards;'), 'rollback_cards_missing');
check(rollback.includes("delete from storage.buckets where id = 'promo-new-cards';"), 'rollback_storage_missing');

const promoHtml = read('dist/promo.html');
check(!promoHtml.includes('promo-admin-new.html') && !promoHtml.includes('promo-new.html'), 'legacy_promo_html_was_rewired');
const adminHtml = read('dist/promo-admin-new.html');
const frontHtml = read('dist/promo-new.html');
check(adminHtml.includes('width=device-width'), 'admin_mobile_viewport_missing');
check(frontHtml.includes('width=device-width'), 'frontend_mobile_viewport_missing');
const css = read('dist/assets/promo-new/style.css');
check((css.match(/@media/g) || []).length >= 4, 'responsive_breakpoints_missing');

const vercel = JSON.parse(read('vercel.json'));
check(vercel.buildCommand === 'npm run build:promo-new', 'preview_must_build_promo_source');
check(vercel.installCommand === 'npm ci', 'preview_install_must_be_lockfile_deterministic');
check(vercel.outputDirectory === 'dist', 'preview_output_directory_changed');

for (const file of walk('dist/assets/promo-new').filter(file => file.endsWith('.js'))) {
  const size = fs.statSync(path.join(root, file)).size;
  check(size < 4_500_000, `bundle_too_large_for_mobile:${file}:${size}`);
  check(!read(file).includes('process.env.NODE_ENV'), `browser_node_env_reference:${file}`);
}

if (failures.length) {
  console.error('Promo new security/static checks failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Promo new security/static checks passed: auth/backend boundary, RLS/revokes, status gates, rollback, mobile assets, and legacy promo isolation.');
