import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const required = [
  'dist/promo-admin-new.html', 'dist/promo-new.html', 'dist/assets/promo-new/admin.js', 'dist/assets/promo-new/frontend.js',
  'api/promo-new.js', 'api/promo-legacy-auth.js', 'api/_promo-new/supabase.js',
  'src/promo-new/shared/api.ts', 'src/promo-new/import/pdf-importer.ts',
  'src/promo-new/import/workbook-parser.ts', 'src/promo-new/import/workbook-safety.ts',
  'scripts/prepare-sheetjs-lock.mjs',
  'docs/PROMO_NEW_REVISION_STAGING_BLOCKERS.md',
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
check(api.includes('assertVersionPublishable'), 'backend_missing_publish_revalidation');
check(api.includes('quarantinePublishedPriceConflicts'), 'published_price_conflict_guard_missing');
check(api.includes('legacy_price_conflict_blocked'), 'published_price_conflict_block_status_missing');
check(!/sb_secret_[A-Za-z0-9_-]+/.test(read('api/_promo-new/supabase.js')), 'secret_value_hardcoded_in_backend');

const legacyAuth = read('api/promo-legacy-auth.js');
check(legacyAuth.includes('MAX_LOGIN_BODY_BYTES = 4_096'), 'upload_key_body_limit_missing');
check(legacyAuth.includes('MAX_UPLOAD_KEY_LENGTH = 200'), 'upload_key_length_limit_missing');
check(legacyAuth.includes('promo_auth_unavailable'), 'generic_auth_service_error_missing');
check(!/detail:\s*message/.test(legacyAuth), 'auth_internal_detail_exposed');

const sharedApi = read('src/promo-new/shared/api.ts');
check(sharedApi.includes('const LEGACY_WRITES_ENABLED = false'), 'legacy_writes_must_remain_disabled');
check(sharedApi.includes('legacy_write_disabled_pending_atomic_revision_staging'), 'legacy_write_block_reason_missing');
check(/function assertWritableRuntime\(\)[\s\S]*LEGACY_WRITES_ENABLED/.test(sharedApi), 'network_write_guard_missing');

const pdfImporter = read('src/promo-new/import/pdf-importer.ts');
check(pdfImporter.includes('MAX_PROMO_PDF_BYTES = 50 * 1024 * 1024'), 'pdf_byte_limit_missing');
check(pdfImporter.includes('MAX_PROMO_PDF_PAGES = 120'), 'pdf_page_limit_missing');
check(pdfImporter.includes('MAX_PROMO_PDF_CARDS = 2_000'), 'pdf_card_limit_missing');
check(pdfImporter.includes("throw new Error('duplicate_card_id')"), 'pdf_duplicate_card_block_missing');
check(pdfImporter.includes("throw new Error('duplicate_card_position')"), 'pdf_duplicate_position_block_missing');

const workbookSafety = read('src/promo-new/import/workbook-safety.ts');
for (const guard of [
  'MAX_WORKBOOK_SHEETS = 40',
  'MAX_WORKBOOK_ROWS_PER_SHEET = 20_000',
  'MAX_WORKBOOK_COLUMNS_PER_SHEET = 256',
  'MAX_WORKBOOK_TOTAL_CELLS = 500_000',
  'MAX_WORKBOOK_ZIP_ENTRIES = 5_000',
  'MAX_WORKBOOK_UNCOMPRESSED_BYTES = 200 * 1024 * 1024',
  'MAX_WORKBOOK_COMPRESSION_RATIO = 300',
]) check(workbookSafety.includes(guard), `workbook_guard_missing:${guard}`);
check(workbookSafety.includes("decodeFatal('windows-874'"), 'thai_csv_windows_874_fallback_missing');
check(workbookSafety.includes('assertWorkbookArchiveSafe'), 'workbook_zip_preflight_missing');
check(workbookSafety.includes("sheetRows: MAX_WORKBOOK_ROWS_PER_SHEET + 1"), 'workbook_parse_row_cap_missing');
const workbookParser = read('src/promo-new/import/workbook-parser.ts');
check(workbookParser.includes('await assertWorkbookArchiveSafe(bytes)'), 'workbook_archive_guard_not_wired');
check(workbookParser.includes('assertWorkbookBounds(workbook)'), 'workbook_range_guard_not_wired');
check(workbookParser.includes('decodePromotionCsv(bytes)'), 'workbook_csv_decoder_not_wired');
check(!workbookParser.includes('candidate.includes(value)'), 'workbook_reverse_partial_header_match_reintroduced');
check(workbookParser.includes("carriedFamilyId = '';\n      carriedName = '';\n      carriedScope = '';"), 'workbook_blank_row_carry_reset_missing');

const frontend = read('src/promo-new/frontend/main.tsx');
check(frontend.includes("card.status === 'ready'"), 'frontend_ready_only_filter_missing');
check(frontend.includes('card.failureReasons.length === 0'), 'frontend_failure_reason_filter_missing');
check(frontend.includes('Number(card.price.effectivePrice?.amount) > 0'), 'frontend_price_filter_missing');
check(frontend.includes('card.promotionTiers.length > 0'), 'frontend_tier_filter_missing');

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
const stagingBlockers = read('docs/PROMO_NEW_REVISION_STAGING_BLOCKERS.md');
check(stagingBlockers.includes('must not be applied to Production'), 'migration_blocker_notice_missing');
check(stagingBlockers.includes('LEGACY_WRITES_ENABLED = false'), 'migration_write_guard_notice_missing');

const adminSource = read('src/promo-new/admin/main.tsx');
check(adminSource.includes('uploadCardImage'), 'admin_card_upload_flow_missing');
check(adminSource.includes('publishVersion'), 'admin_manual_publish_flow_missing');
check(adminSource.includes('previewChecked'), 'admin_preview_gate_missing');
check(adminSource.includes('assertReadyForPublish'), 'admin_preview_validation_missing');
check(adminSource.includes('fetchPromoMasterData'), 'admin_master_data_load_missing');

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
const packageJson = JSON.parse(read('package.json'));
const directBuild = vercel.buildCommand === 'npm run build:promo-new';
const verifiedBuild = vercel.buildCommand === 'npm run verify:promo-new'
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run build:promo-new')
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run typecheck:promo-new')
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run test:promo-new')
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run test:promo-new-security');
check(directBuild || verifiedBuild, 'preview_must_build_verified_promo_source');
check(vercel.installCommand === 'node scripts/prepare-sheetjs-lock.mjs && npm ci --no-fund', 'preview_install_must_patch_and_use_deterministic_lock');
check(packageJson.dependencies?.xlsx === 'https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz', 'sheetjs_patched_source_missing');
const sheetLock = read('scripts/prepare-sheetjs-lock.mjs');
check(sheetLock.includes("version: '0.20.3'"), 'sheetjs_lock_version_missing');
check(sheetLock.includes('sha512-oLDq3jw7AcLqKWH2AhCpVTZl8mf6X2YReP+Neh0SJUzV/BdZYjth94tG5toiMB1PPrYtxOCfaoUCkvtuH+3AJA=='), 'sheetjs_lock_integrity_missing');
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
console.log('Promo new security/static checks passed: patched SheetJS lock, workbook ZIP/range/encoding bounds, auth limits, read-only writes, price conflict quarantine, PDF bounds, ready-only frontend, RLS/revokes, rollback, mobile assets, verified build pipeline, and legacy isolation.');
