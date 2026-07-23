import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const check = (condition, message) => { if (!condition) failures.push(message); };
const walk = directory => fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
  const relative = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(relative) : [relative];
});

const required = [
  'dist/promo-admin-new.html', 'dist/promo-new.html', 'dist/assets/promo-new/admin.js', 'dist/assets/promo-new/frontend.js',
  'api/promo-new.js', 'api/promo-legacy-auth.js', 'api/_promo-new/supabase.js', 'api/_promo-new/grouping-snapshot-contract.js',
  'src/promo-new/shared/api.ts', 'src/promo-new/import/pdf-importer.ts', 'src/promo-new/import/card-header-ocr.ts',
  'src/promo-new/import/card-title-ocr.ts', 'src/promo-new/import/grid-detector.ts', 'src/promo-new/import/ocr-items.ts',
  'src/promo-new/import/workbook-parser.ts', 'src/promo-new/import/workbook-safety.ts',
  'src/promo-new/admin/grouping-client.ts', 'src/promo-new/admin/grouping-worker.ts', 'src/promo-new/admin/grouping-transport.ts',
  'src/promo-new/admin/test-cache.ts', 'src/promo-new/admin/cached-run.ts', 'src/promo-new/admin/manual-workbench.tsx',
  'src/promo-new/admin/grouping-snapshot-save.tsx', 'src/promo-new/domain/manual-snapshot.ts', 'src/promo-new/domain/auto-match.ts',
  'src/promo-new/domain/master-match-audit.ts', 'src/promo-new/domain/master-text-matcher.ts',
  'src/promo-new/domain/visual-product-signatures.ts', 'src/promo-new/domain/visual-product-clusters.ts',
  'vite.promo-new.config.ts', 'scripts/prepare-sheetjs-lock.mjs',
  'docs/PROMO_NEW_REVISION_STAGING_BLOCKERS.md', 'supabase/migrations/20260716083231_promo_system_rebuild.sql',
  'supabase/migrations/20260723104837_promo_grouping_snapshot_v2.sql',
  'supabase/rollback/20260716083231_promo_system_rebuild.sql',
];
required.forEach(file => check(fs.existsSync(path.join(root, file)), `missing:${file}`));

const clientFiles = [...walk('src/promo-new'), 'dist/promo-admin-new.html', 'dist/promo-new.html'];
const clientText = clientFiles.map(file => read(file)).join('\n');
check(!/sb_secret_[A-Za-z0-9_-]+/.test(clientText), 'secret_key_exposed_in_client');
check(!/service_role/i.test(clientText), 'service_role_reference_in_client');
check(!/SUPABASE_SECRET_KEY/.test(clientText), 'server_secret_env_reference_in_client');
check(!/\/rest\/v1\/.+method\s*:\s*['"](?:POST|PATCH|DELETE)/s.test(clientText), 'direct_supabase_write_in_client');
check(!/JUL26|SEP25/.test(clientText), 'hardcoded_month_in_new_client');

const api = read('api/promo-new.js');
for (const guard of ['requirePromoAdmin', 'validateDatasetPayload', 'card_crosses_month', 'assertVersionPublishable', 'quarantinePublishedPriceConflicts']) {
  check(api.includes(guard), `backend_guard_missing:${guard}`);
}
check(!/sb_secret_[A-Za-z0-9_-]+/.test(read('api/_promo-new/supabase.js')), 'secret_value_hardcoded_in_backend');
const legacyAuth = read('api/promo-legacy-auth.js');
check(legacyAuth.includes('MAX_LOGIN_BODY_BYTES = 4_096'), 'upload_key_body_limit_missing');
check(legacyAuth.includes('MAX_UPLOAD_KEY_LENGTH = 200'), 'upload_key_length_limit_missing');
check(!/detail:\s*message/.test(legacyAuth), 'auth_internal_detail_exposed');
check(legacyAuth.includes('validateGroupingSnapshotShape(input)'), 'group_snapshot_shape_guard_missing');
check(legacyAuth.includes("testSupabase('/rest/v1/rpc/save_promo_grouping_snapshot_v2'"), 'test_snapshot_rpc_missing');
check(legacyAuth.includes('testSupabase(`/rest/v1/promo_product_master?status=eq.active'), 'test_master_read_missing');
check(legacyAuth.includes("testSupabase('/rest/v1/rpc/create_promo_master_product'"), 'test_master_write_missing');
check(legacyAuth.includes("action === 'load-source-dataset'"), 'source_dataset_load_route_missing');
check(legacyAuth.includes("action === 'load-grouping-snapshot'"), 'group_snapshot_load_route_missing');
check(legacyAuth.includes("action === 'unlock-grouping-group'"), 'central_group_unlock_route_missing');
check(legacyAuth.includes('PROMO_TEST_DATABASE'), 'test_database_flag_missing');
check(legacyAuth.includes('hostname === productionHostname'), 'production_database_rejection_missing');
check(!legacyAuth.includes("supabase('/rest/v1/rpc/save_manual_promo_grouping_snapshot'"), 'legacy_production_snapshot_write_reintroduced');
check(legacyAuth.includes('sameIdentity'), 'structured_master_duplicate_guard_missing');

const sharedApi = read('src/promo-new/shared/api.ts');
check(sharedApi.includes('const LEGACY_WRITES_ENABLED = false'), 'legacy_writes_must_remain_disabled');
check(sharedApi.includes('legacy_write_disabled_pending_atomic_revision_staging'), 'legacy_write_block_reason_missing');

const pdfImporter = read('src/promo-new/import/pdf-importer.ts');
const titleOcr = read('src/promo-new/import/card-title-ocr.ts');
const gridDetector = read('src/promo-new/import/grid-detector.ts');
for (const guard of ['MAX_PROMO_PDF_BYTES = 50 * 1024 * 1024', 'MAX_PROMO_PDF_PAGES = 120', 'MAX_PROMO_PDF_CARDS = 2_000']) {
  check(pdfImporter.includes(guard), `pdf_guard_missing:${guard}`);
}
check(pdfImporter.includes("throw new Error('duplicate_card_id')"), 'pdf_duplicate_card_block_missing');
check(pdfImporter.includes("throw new Error('duplicate_card_position')"), 'pdf_duplicate_position_block_missing');
check(pdfImporter.includes('recognizeCardProductTitle'), 'per_card_title_ocr_not_wired');
check(pdfImporter.includes('OCR ชื่อมุมขวาบน'), 'single_pass_title_progress_missing');
check(!pdfImporter.includes('pageOcr('), 'whole_page_product_ocr_reintroduced');
check(titleOcr.includes('x: bounds.x + bounds.width * 0.32'), 'product_name_top_right_zone_missing');
check(titleOcr.includes('height: bounds.height * 0.46'), 'product_name_header_height_missing');
check(titleOcr.includes('adaptiveThreshold(output)'), 'adaptive_title_threshold_missing');
check(titleOcr.includes('PSM.SPARSE_TEXT'), 'sparse_title_ocr_mode_missing');
check(gridDetector.includes('detectCardRegionsFromWhiteMask'), 'structural_outer_panel_detector_missing');
check(gridDetector.includes('referenceAnchorCandidates'), 'reference_anchor_guard_missing');
check(gridDetector.includes('promotionAnchorCandidates'), 'promotion_anchor_guard_missing');
check(gridDetector.includes('grid_anchor_set_invalid'), 'three_anchor_failure_marker_missing');
check(gridDetector.includes('borderStripEvidence'), 'outer_border_evidence_guard_missing');
check(gridDetector.includes('anchorValidatedCards'), 'anchor_completeness_guard_missing');
check(gridDetector.includes('maximum > 185 && minimum > 150 && difference < 80'), 'white_panel_threshold_missing');
check(gridDetector.includes('promo_grid_fail:page:'), 'grid_fail_closed_missing');

const ocrItems = read('src/promo-new/import/ocr-items.ts');
check(ocrItems.includes('const lines = node.lines'), 'line_level_ocr_collection_missing');
check(ocrItems.includes('const paragraphs = node.paragraphs'), 'paragraph_to_line_ocr_traversal_missing');
check(ocrItems.includes('const words = node.words'), 'word_position_fallback_missing');
check(!/if \(text && bbox[\s\S]*return output/u.test(ocrItems), 'broad_block_ocr_short_circuit_reintroduced');

const workbookSafety = read('src/promo-new/import/workbook-safety.ts');
for (const guard of [
  'MAX_WORKBOOK_SHEETS = 40', 'MAX_WORKBOOK_ROWS_PER_SHEET = 20_000', 'MAX_WORKBOOK_COLUMNS_PER_SHEET = 256',
  'MAX_WORKBOOK_TOTAL_CELLS = 500_000', 'MAX_WORKBOOK_ZIP_ENTRIES = 5_000',
  'MAX_WORKBOOK_UNCOMPRESSED_BYTES = 200 * 1024 * 1024', 'MAX_WORKBOOK_COMPRESSION_RATIO = 300',
]) check(workbookSafety.includes(guard), `workbook_guard_missing:${guard}`);
check(workbookSafety.includes("decodeFatal('windows-874'"), 'thai_csv_windows_874_fallback_missing');
const workbookParser = read('src/promo-new/import/workbook-parser.ts');
check(workbookParser.includes('await assertWorkbookArchiveSafe(bytes)'), 'workbook_archive_guard_not_wired');
check(workbookParser.includes('assertWorkbookBounds(workbook)'), 'workbook_range_guard_not_wired');
check(workbookParser.includes('decodePromotionCsv(bytes)'), 'workbook_csv_decoder_not_wired');

const client = read('src/promo-new/admin/grouping-client.ts');
const worker = read('src/promo-new/admin/grouping-worker.ts');
const cache = read('src/promo-new/admin/test-cache.ts');
const cachedRun = read('src/promo-new/admin/cached-run.ts');
const signatures = read('src/promo-new/domain/visual-product-signatures.ts');
const clusters = read('src/promo-new/domain/visual-product-clusters.ts');
check(client.includes('buildVisualProductSignatures'), 'visual_signature_generation_not_wired');
check(client.includes('visualProductSignaturesComplete'), 'visual_signature_completeness_guard_missing');
check(client.includes('visual_signatures_incomplete'), 'incomplete_visual_signature_block_missing');
check(client.includes('product_master_required_before_grouping'), 'product_master_zero_block_missing');
check(client.includes('prepareGroupingWorkerCards(input.cards)'), 'image_strip_transport_missing');
check(client.includes('storedPrices: []'), 'stored_price_must_not_enter_worker');
check(client.includes('promotionFamilies: []'), 'promotion_family_must_not_enter_worker');
check(client.includes('visualSignatures,'), 'visual_signature_transport_missing');
check(client.includes('โดยไม่ส่งรูป ราคา หรือโปรโมชั่น'), 'visual_transport_boundary_message_missing');
check(cache.includes('PROMO_TEST_CACHE_SCHEMA_VERSION = 6'), 'structural_grid_cache_schema_v6_missing');
check(cache.includes("PROMO_TEST_PIPELINE_VERSION = 'density-grid-v1-card-title-single-pass-visual-first'"), 'structural_grid_cache_pipeline_missing');
check(cache.includes('record.schemaVersion === PROMO_TEST_CACHE_SCHEMA_VERSION'), 'cache_schema_rejection_missing');
check(cache.includes('record.pipelineVersion === PROMO_TEST_PIPELINE_VERSION'), 'cache_pipeline_rejection_missing');
check(cachedRun.includes('cache:visual_fingerprints_missing_rebuild_required'), 'cached_fingerprint_rebuild_marker_missing');
check(worker.includes("rawText: card.productText || ''"), 'full_card_text_guard_missing');
check(worker.includes('buildVisualProductClusters'), 'visual_cluster_not_wired');
check(worker.includes('grouping:mode:visual_first_anchored'), 'visual_first_mode_marker_missing');
check(worker.includes('grouping:price_manual_admin'), 'manual_price_marker_missing');
check(worker.includes('grouping:promotion_family_manual_admin'), 'manual_promotion_marker_missing');
check(worker.includes('grouping:scope_matching_disabled'), 'scope_disabled_marker_missing');
check(!/resolveTextFirstScopesSafely|resolveScopesSafely|applyClassMatrixRecovery|repairCardsWithMasterBackedScopes/u.test(worker), 'forbidden_scope_grouping_reintroduced');
check(/payload\.existingSkus,\s*\[\],\s*\[\],\s*\{\},\s*noScopes/u.test(worker), 'manual_price_promotion_empty_inputs_missing');
check(signatures.includes('TITLE_VIEW'), 'title_visual_view_missing');
check(signatures.includes('PRODUCT_VIEWS'), 'product_visual_views_missing');
check(signatures.includes('mask:'), 'price_promotion_visual_mask_missing');
check(clusters.includes('MIN_PRODUCT_SIMILARITY = 0.72'), 'minimum_product_similarity_guard_missing');
check(clusters.includes('new Set(classes).size !== classes.length'), 'one_card_per_class_guard_missing');
check(clusters.includes('variantConflict'), 'variant_conflict_guard_missing');
check(clusters.includes('left.master.id !== right.master.id'), 'master_conflict_guard_missing');
check(clusters.includes("'SUPERCLICK'"), 'gillette_super_click_guard_missing');
check(clusters.includes("'SUPERTHIN'"), 'gillette_super_thin_guard_missing');

const autoMatch = read('src/promo-new/domain/auto-match.ts');
check(autoMatch.includes('promotion_family_manual_selection_required'), 'manual_promotion_warning_missing');
check(/promotionFamilyId:\s*null,\s*promotionTiers:\s*\[\]/u.test(autoMatch), 'manual_promotion_card_reset_missing');
check(!autoMatch.includes('applyPromotionFamily('), 'group_level_promotion_auto_apply_reintroduced');

const masterAudit = read('src/promo-new/domain/master-match-audit.ts');
check(masterAudit.includes('AUDIT_CHUNK_SIZE = 12'), 'master_audit_chunk_size_missing');
check(masterAudit.includes('await new Promise<void>(resolve => setTimeout(resolve, 0))'), 'master_audit_event_loop_yield_missing');
const masterMatcher = read('src/promo-new/domain/master-text-matcher.ts');
check(masterMatcher.includes('byBrand: Map<string, PreparedMaster[]>'), 'product_master_brand_index_missing');
check(masterMatcher.includes('prepared.byBrand.get(brand)'), 'product_master_brand_index_not_used');

const adminSource = read('src/promo-new/admin/main.tsx');
check(adminSource.includes('<option value="">รอตรวจโปรโมชั่น</option>'), 'per_card_promotion_pending_option_missing');
check(adminSource.includes('ราคากลางต่อชิ้น'), 'manual_price_input_missing');
check(adminSource.includes('setCentralPrice(group.price, amount)'), 'manual_price_apply_missing');
check(adminSource.includes('assertReadyForPublish'), 'admin_preview_validation_missing');
check(adminSource.includes('applyPromotionFamilyToCard'), 'per_card_promotion_apply_missing');
check(adminSource.includes('<ManualGroupingWorkbench'), 'manual_workbench_not_directly_wired');
check(adminSource.includes('<GroupingSnapshotSave'), 'grouping_snapshot_save_not_directly_wired');
check(adminSource.includes('visualSignatures: undefined'), 'fresh_visual_signatures_not_directly_wired');
const manualWorkbench = read('src/promo-new/admin/manual-workbench.tsx');
check(!manualWorkbench.includes('localStorage'), 'group_locks_must_not_be_browser_only');
check(manualWorkbench.includes('loadPromoGroupingSnapshot'), 'saved_grouping_hydration_missing');
check(manualWorkbench.includes('manualConfirmed: true, manualLocked: true'), 'persisted_group_lock_missing');
check(manualWorkbench.includes('data-testid="bulk-confirm-dialog"'), 'manual_bulk_action_confirmation_missing');

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
check(!migration.includes('unique (product_group_id, class_id)'), 'same_class_multi_card_constraint_reintroduced');
const snapshotMigration = read('supabase/migrations/20260723104837_promo_grouping_snapshot_v2.sql');
for (const table of ['promo_source_datasets', 'promo_source_cards', 'promo_grouping_snapshots_v2', 'promo_grouping_snapshot_groups_v2', 'promo_grouping_card_assignments_v2']) {
  check(snapshotMigration.includes(`alter table public.${table} enable row level security;`), `snapshot_rls_missing:${table}`);
  check(snapshotMigration.includes(`revoke all on public.${table} from anon, authenticated;`), `snapshot_public_access_revoke_missing:${table}`);
}
check(snapshotMigration.includes('save_promo_grouping_snapshot_v2'), 'snapshot_transaction_rpc_missing');
check(snapshotMigration.includes('snapshot_card_set_mismatch'), 'snapshot_exact_card_set_guard_missing');
check(snapshotMigration.includes('group_not_confirmed_or_locked'), 'snapshot_server_lock_guard_missing');
check(snapshotMigration.includes('locked_group_changed'), 'locked_group_mutation_guard_missing');
check(snapshotMigration.includes('unlock_promo_grouping_group_v2'), 'central_group_unlock_rpc_missing');
check(snapshotMigration.includes('TEST/STAGING ONLY'), 'snapshot_migration_environment_warning_missing');
const stagingBlockers = read('docs/PROMO_NEW_REVISION_STAGING_BLOCKERS.md');
check(stagingBlockers.includes('must not be applied to Production'), 'migration_blocker_notice_missing');
check(stagingBlockers.includes('LEGACY_WRITES_ENABLED = false'), 'migration_write_guard_notice_missing');
const rollback = read('supabase/rollback/20260716083231_promo_system_rebuild.sql');
check(rollback.includes('drop table if exists public.promo_new_cards;'), 'rollback_cards_missing');

const promoVite = read('vite.promo-new.config.ts');
const buildFlavor = 'HARDENED-SNAPSHOT-V2-CARD-UUID-V9';
check(promoVite.includes(`PROMO_BUILD_FLAVOR = '${buildFlavor}'`), 'direct_manual_build_flavor_missing');
check(!promoVite.includes('manual-workbench.tsx'), 'build_time_workbench_rewrite_reintroduced');
check(!promoVite.includes('replaceRequired'), 'build_time_admin_source_rewrite_reintroduced');
check(!/\btransform\s*\(/u.test(promoVite), 'vite_business_logic_transform_reintroduced');
check(promoVite.includes('VERCEL_GIT_COMMIT_SHA'), 'deployment_build_id_sha_missing');
const vercel = JSON.parse(read('vercel.json'));
const packageJson = JSON.parse(read('package.json'));
const verifiedBuild = vercel.buildCommand === 'npm run verify:promo-new'
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run build:promo-new')
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run typecheck:promo-new')
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run test:promo-new')
  && String(packageJson.scripts?.['verify:promo-new'] || '').includes('npm run test:promo-new-security');
check(verifiedBuild, 'preview_must_build_verified_promo_source');
check(vercel.installCommand === 'node scripts/prepare-sheetjs-lock.mjs && npm ci --no-fund', 'preview_install_must_be_deterministic');
check(packageJson.dependencies?.xlsx === 'https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz', 'sheetjs_patched_source_missing');

const builtPromoJsFiles = walk('dist/assets/promo-new').filter(file => file.endsWith('.js'));
const builtPromoJs = builtPromoJsFiles.map(file => read(file)).join('\n');
const buildCommit = String(process.env.VERCEL_GIT_COMMIT_SHA || 'LOCAL').slice(0, 8).toUpperCase();
check(builtPromoJs.includes(`PROMO-${buildCommit}-${buildFlavor}`), 'deployed_build_id_does_not_match_direct_manual_commit');
check(!builtPromoJs.includes('FINAL-UPLOAD-AUDIT-20260719-0031'), 'stale_build_id_reached_deployed_bundle');
for (const file of builtPromoJsFiles) {
  const size = fs.statSync(path.join(root, file)).size;
  check(size < 4_500_000, `bundle_too_large_for_mobile:${file}:${size}`);
  check(!read(file).includes('process.env.NODE_ENV'), `browser_node_env_reference:${file}`);
}

if (failures.length) {
  console.error('Promo new security/static checks failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Promo new security/static checks passed: Structural Grid and single-pass title OCR guards remain active; manual grouping uses stable card IDs, persisted confirmations and reloadable snapshots; per-card Promotion Family and manual prices remain explicit; read-only deployment protections remain intact.');
