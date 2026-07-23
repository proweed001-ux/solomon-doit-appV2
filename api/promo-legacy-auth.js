import { createHash } from 'node:crypto';
import { buildLegacyMasterData } from './_promo-new/legacy-adapter.js';
import { validateGroupingSnapshotShape } from './_promo-new/grouping-snapshot-contract.js';

const SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
const MAX_LOGIN_BODY_BYTES = 4_096;
const MAX_MASTER_BODY_BYTES = 32_768;
const MAX_GROUPING_BODY_BYTES = 512_000;
const MAX_UPLOAD_KEY_LENGTH = 200;
const ALLOWED_UNITS = new Set(['ชิ้น', 'ขวด', 'แพ็ค', 'กล่อง', 'ลัง', 'ซอง', 'ด้าม', 'ถุง', 'ชุด']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}

function text(value) {
  return String(value || '').replace(/\s+/gu, ' ').trim();
}

function requestBodySize(req) {
  const declared = Number(req.headers['content-length']);
  if (Number.isFinite(declared) && declared >= 0) return declared;
  try { return Buffer.byteLength(JSON.stringify(req.body || {}), 'utf8'); } catch { return MAX_GROUPING_BODY_BYTES + 1; }
}

function normalizedKey(value) {
  return text(value).toLowerCase().normalize('NFKC').replace(/[^a-z0-9ก-๙]+/gu, '');
}

function sha256(value) {
  return createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function testDatabaseEnabled() {
  return String(process.env.PROMO_TEST_DATABASE || '') === '1';
}

async function supabase(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    const message = data && typeof data === 'object' ? data.message || data.error || data.error_description : raw;
    throw new Error(`supabase_${response.status}:${message || 'request_failed'}`);
  }
  return data;
}

function testBackend() {
  const enabled = testDatabaseEnabled();
  const configuredUrl = String(process.env.PROMO_TEST_SUPABASE_URL || '').replace(/\/$/u, '');
  const key = String(process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY || '');
  let url = '';
  let hostname = '';
  try {
    const parsed = new URL(configuredUrl);
    url = parsed.origin;
    hostname = parsed.hostname.toLowerCase();
  } catch {
    throw new Error('promo_test_backend_not_configured');
  }
  const productionHostname = new URL(SUPABASE_URL).hostname.toLowerCase();
  if (!enabled || !url || !key || hostname === productionHostname) throw new Error('promo_test_backend_not_configured');
  return { url, key };
}

async function testSupabase(path, options = {}) {
  const backend = testBackend();
  const response = await fetch(`${backend.url}${path}`, {
    ...options,
    headers: {
      apikey: backend.key,
      Authorization: `Bearer ${backend.key}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    const message = data && typeof data === 'object' ? data.message || data.error || data.error_description : raw;
    throw new Error(`test_supabase_${response.status}:${message || 'request_failed'}`);
  }
  return data;
}

async function latestPublishedMonth() {
  const rows = await supabase('/rest/v1/promo_months?status=eq.published&select=id&order=published_at.desc.nullslast,updated_at.desc&limit=1');
  return Array.isArray(rows) && rows[0]?.id ? rows[0].id : 'KEYCHECK';
}

async function validateUploadKey(adminKey) {
  const key = text(adminKey);
  if (!key || key.length > MAX_UPLOAD_KEY_LENGTH) throw new Error('invalid_upload_key');
  if (testDatabaseEnabled()) {
    const valid = await testSupabase('/rest/v1/rpc/validate_promo_test_admin_key_v2', {
      method: 'POST',
      body: JSON.stringify({ p_auth_hash: sha256(key) }),
    });
    if (valid !== true) throw new Error('invalid_upload_key');
    return key;
  }
  const promoMonthId = await latestPublishedMonth();
  await supabase('/functions/v1/promo-function-review', {
    method: 'POST',
    headers: { 'x-promo-admin-key': key },
    body: JSON.stringify({ action: 'summary', promo_month_id: promoMonthId }),
  });
  return key;
}

function applyStructuredIdentity(sku, master) {
  if (!sku || !master) return sku;
  const sizeValue = Number(master.size_value || 0);
  return {
    ...sku,
    identity: {
      ...sku.identity,
      brand: text(master.brand) || sku.identity.brand,
      productType: text(master.product_type) || sku.identity.productType,
      variant: text(master.variant) || null,
      sizeValue: Number.isFinite(sizeValue) ? sizeValue : sku.identity.sizeValue,
      sizeUnit: text(master.size_unit) || sku.identity.sizeUnit,
      salesUnit: text(master.sales_unit) || text(master.unit_label) || sku.identity.salesUnit,
      packQuantity: Number.isInteger(Number(master.pack_quantity)) && Number(master.pack_quantity) > 0 ? Number(master.pack_quantity) : sku.identity.packQuantity,
    },
  };
}

async function masterData(adminKey) {
  if (testDatabaseEnabled()) {
    const data = await testSupabase('/rest/v1/rpc/load_promo_test_master_data_v2', {
      method: 'POST',
      body: JSON.stringify({ p_auth_hash: sha256(adminKey) }),
    });
    if (!data || !Array.isArray(data.skus) || !Array.isArray(data.prices)) {
      throw new Error('product_master_payload_invalid');
    }
    return data;
  }
  const select = 'master_product_id,canonical_name,normalized_key,unit_label,status,created_from_month,updated_at,brand,product_type,variant,size_value,size_unit,sales_unit,pack_quantity';
  const [masters, prices, aliases] = await Promise.all([
    supabase(`/rest/v1/promo_product_master?status=eq.active&select=${select}&order=canonical_name.asc`),
    supabase('/rest/v1/promo_product_master_prices?select=master_product_id,base_unit_price,unit_label,source_month,updated_at'),
    supabase('/rest/v1/promo_product_master_aliases?select=master_product_id,alias_text,normalized_alias&order=created_at.asc'),
  ]);
  const data = buildLegacyMasterData(masters, prices);
  const aliasesByMaster = new Map();
  for (const row of Array.isArray(aliases) ? aliases : []) {
    const masterId = text(row?.master_product_id);
    const alias = text(row?.alias_text);
    if (!masterId || !alias) continue;
    const list = aliasesByMaster.get(masterId) || [];
    list.push(alias);
    aliasesByMaster.set(masterId, list);
  }
  const masterById = new Map((Array.isArray(masters) ? masters : []).map(master => [text(master.master_product_id), master]));
  data.skus = data.skus.map(sku => {
    const masterId = String(sku.id || '').startsWith('MASTER-') ? String(sku.id).slice(7) : '';
    const masterAliases = aliasesByMaster.get(masterId) || [];
    const structured = applyStructuredIdentity(sku, masterById.get(masterId));
    return { ...structured, evidence: [...new Set([...(structured.evidence || []), ...masterAliases])] };
  });
  return data;
}

function validateMasterProduct(input) {
  const canonicalName = text(input?.canonicalName);
  const brand = text(input?.brand);
  const productType = text(input?.productType);
  const variant = text(input?.variant);
  const sizeValue = Number(input?.sizeValue || 0);
  const sizeUnit = text(input?.sizeUnit);
  const salesUnit = text(input?.salesUnit);
  const packQuantity = Number(input?.packQuantity || 1);
  const aliases = Array.isArray(input?.aliases) ? input.aliases.map(text).filter(Boolean).slice(0, 40) : [];
  if (canonicalName.length < 3 || canonicalName.length > 240) throw new Error('invalid_canonical_name');
  if (!brand || brand.length > 120) throw new Error('invalid_brand');
  if (!productType || productType.length > 160) throw new Error('invalid_product_type');
  if (!ALLOWED_UNITS.has(salesUnit)) throw new Error('invalid_sales_unit');
  if (!Number.isFinite(sizeValue) || sizeValue < 0 || sizeValue > 1_000_000) throw new Error('invalid_size_value');
  if (!Number.isInteger(packQuantity) || packQuantity < 1 || packQuantity > 999) throw new Error('invalid_pack_quantity');
  return { canonicalName, brand, productType, variant, sizeValue, sizeUnit, salesUnit, packQuantity, aliases };
}

async function createMasterProduct(input, adminKey) {
  const product = validateMasterProduct(input);
  const identityFields = 'master_product_id,canonical_name,normalized_key,unit_label,status,created_from_month,updated_at,brand,product_type,variant,size_value,size_unit,sales_unit,pack_quantity';
  const activeMasters = await testSupabase(`/rest/v1/promo_product_master?status=eq.active&select=${identityFields}&limit=500`);
  const sameIdentity = (Array.isArray(activeMasters) ? activeMasters : []).find(row => (
    normalizedKey(row.brand) === normalizedKey(product.brand)
    && normalizedKey(row.product_type) === normalizedKey(product.productType)
    && normalizedKey(row.variant) === normalizedKey(product.variant)
    && Number(row.size_value || 0) === Number(product.sizeValue || 0)
    && normalizedKey(row.size_unit) === normalizedKey(product.sizeUnit)
    && normalizedKey(row.sales_unit || row.unit_label) === normalizedKey(product.salesUnit)
    && Number(row.pack_quantity || 1) === product.packQuantity
  ));
  if (sameIdentity) {
    const built = buildLegacyMasterData([sameIdentity], []);
    let sku = applyStructuredIdentity(built.skus[0], sameIdentity);
    sku = { ...sku, evidence: [...new Set([...(sku.evidence || []), product.canonicalName, ...product.aliases])] };
    return { sku, created: false };
  }
  const rows = await testSupabase('/rest/v1/rpc/create_promo_master_product', {
    method: 'POST',
    body: JSON.stringify({
      p_canonical_name: product.canonicalName,
      p_normalized_key: normalizedKey(product.canonicalName),
      p_unit_label: product.salesUnit,
      p_brand: product.brand,
      p_product_type: product.productType,
      p_variant: product.variant || null,
      p_size_value: product.sizeValue || null,
      p_size_unit: product.sizeUnit || null,
      p_sales_unit: product.salesUnit,
      p_pack_quantity: product.packQuantity,
      p_aliases: product.aliases,
      p_auth_hash: sha256(adminKey),
    }),
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row?.master_product_id) throw new Error('product_master_create_failed');
  const built = buildLegacyMasterData([row], []);
  let sku = applyStructuredIdentity(built.skus[0], row);
  sku = { ...sku, evidence: [...new Set([...(sku.evidence || []), product.canonicalName, ...product.aliases])] };
  return { sku, created: Boolean(row.created) };
}

async function saveGroupingSnapshot(input, adminKey) {
  const snapshot = validateGroupingSnapshotShape(input);
  const rows = await testSupabase('/rest/v1/rpc/save_promo_grouping_snapshot_v2', {
    method: 'POST',
    body: JSON.stringify({
      p_snapshot: snapshot,
      p_auth_hash: sha256(adminKey),
    }),
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  const saved = row?.snapshot || row;
  if (!saved || Number(saved.cardCount) !== snapshot.cardCount || Number(saved.revision) <= snapshot.revision) {
    throw new Error('grouping_snapshot_save_incomplete');
  }
  return validateGroupingSnapshotShape({ snapshot: saved });
}

function validateDatasetQuery(query) {
  const monthKey = text(query?.monthKey);
  const datasetId = text(query?.datasetId);
  const datasetFingerprint = text(query?.datasetFingerprint);
  const datasetRevision = Number(query?.datasetRevision);
  if (!monthKey || monthKey.length > 40) throw new Error('invalid_promo_month');
  if (!UUID.test(datasetId)) throw new Error('grouping_snapshot_dataset_id_invalid');
  if (!/^[0-9a-f]{64}$/iu.test(datasetFingerprint)) throw new Error('grouping_snapshot_fingerprint_invalid');
  if (!Number.isInteger(datasetRevision) || datasetRevision < 1) throw new Error('grouping_snapshot_dataset_revision_invalid');
  return { monthKey, datasetId, datasetFingerprint, datasetRevision };
}

async function loadGroupingSnapshot(query, adminKey) {
  const validated = validateDatasetQuery(query);
  const rows = await testSupabase('/rest/v1/rpc/load_promo_grouping_snapshot_v2', {
    method: 'POST',
    body: JSON.stringify({
      p_month_key: validated.monthKey,
      p_dataset_id: validated.datasetId,
      p_dataset_fingerprint: validated.datasetFingerprint,
      p_dataset_revision: validated.datasetRevision,
      p_auth_hash: sha256(adminKey),
    }),
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  const snapshot = row?.snapshot ?? row;
  return snapshot ? validateGroupingSnapshotShape({ snapshot }, { requireAllLocked: false }) : null;
}

async function loadSourceDataset(datasetId, adminKey) {
  const id = text(datasetId);
  if (!UUID.test(id)) throw new Error('grouping_snapshot_dataset_id_invalid');
  const rows = await testSupabase('/rest/v1/rpc/load_promo_source_dataset_v2', {
    method: 'POST',
    body: JSON.stringify({
      p_dataset_id: id,
      p_auth_hash: sha256(adminKey),
    }),
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  const payload = row?.payload ?? row;
  if (!payload?.dataset?.sourceDataset?.persisted || payload.dataset.sourceDataset.datasetId !== id) {
    throw new Error('source_dataset_payload_invalid');
  }
  return payload;
}

async function unlockGroupingGroup(input, adminKey) {
  const datasetId = text(input?.datasetId);
  const snapshotId = text(input?.snapshotId);
  const groupId = text(input?.groupId);
  const expectedRevision = Number(input?.expectedRevision);
  if (!UUID.test(datasetId) || !UUID.test(snapshotId) || !groupId || groupId.length > 160) {
    throw new Error('grouping_snapshot_unlock_input_invalid');
  }
  if (!Number.isInteger(expectedRevision) || expectedRevision < 1) throw new Error('grouping_snapshot_revision_invalid');
  const rows = await testSupabase('/rest/v1/rpc/unlock_promo_grouping_group_v2', {
    method: 'POST',
    body: JSON.stringify({
      p_dataset_id: datasetId,
      p_snapshot_id: snapshotId,
      p_group_id: groupId,
      p_expected_revision: expectedRevision,
      p_auth_hash: sha256(adminKey),
    }),
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  const snapshot = row?.snapshot ?? row;
  return validateGroupingSnapshotShape({ snapshot }, { requireAllLocked: false });
}

export default async function handler(req, res) {
  try {
    const action = text(req.query?.action || req.body?.action).toLowerCase();
    const headerKey = text(req.headers['x-promo-admin-key']);

    if (req.method === 'POST' && action === 'login') {
      if (requestBodySize(req) > MAX_LOGIN_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });
      const adminKey = await validateUploadKey(req.body?.adminKey);
      return json(res, 200, {
        ok: true,
        session: {
          accessToken: adminKey,
          refreshToken: '',
          expiresIn: 0,
          user: { id: 'PROMO-UPLOAD-KEY', email: null },
        },
      });
    }

    if (req.method === 'GET' && action === 'session') {
      await validateUploadKey(headerKey);
      return json(res, 200, { ok: true, user: { id: 'PROMO-UPLOAD-KEY', email: null, role: 'admin' } });
    }

    if (req.method === 'GET' && action === 'master-data') {
      await validateUploadKey(headerKey);
      return json(res, 200, { ok: true, data: await masterData(headerKey) });
    }

    if (req.method === 'GET' && action === 'load-grouping-snapshot') {
      return json(res, 200, { ok: true, data: await loadGroupingSnapshot(req.query, headerKey) });
    }

    if (req.method === 'GET' && action === 'load-source-dataset') {
      return json(res, 200, { ok: true, data: await loadSourceDataset(req.query?.datasetId, headerKey) });
    }

    if (req.method === 'POST' && action === 'create-master') {
      if (requestBodySize(req) > MAX_MASTER_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });
      const adminKey = await validateUploadKey(headerKey);
      return json(res, 200, { ok: true, data: await createMasterProduct(req.body?.product, adminKey) });
    }

    if (req.method === 'POST' && action === 'save-grouping-snapshot') {
      if (requestBodySize(req) > MAX_GROUPING_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });
      return json(res, 200, { ok: true, data: await saveGroupingSnapshot(req.body, headerKey) });
    }

    if (req.method === 'POST' && action === 'unlock-grouping-group') {
      if (requestBodySize(req) > MAX_LOGIN_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });
      return json(res, 200, { ok: true, data: await unlockGroupingGroup(req.body, headerKey) });
    }

    if (req.method === 'POST' && action === 'logout') return json(res, 200, { ok: true });
    return json(res, 404, { ok: false, error: 'action_not_found' });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');
    const authFailure = /invalid_upload_key|missing_admin_key|invalid_admin_key|supabase_401|supabase_403|test_supabase_401|test_supabase_403/.test(message);
    const badRequest = /invalid_canonical_name|invalid_brand|invalid_product_type|invalid_sales_unit|invalid_size_value|invalid_pack_quantity|invalid_unit|invalid_normalized_key|invalid_promo_month|invalid_group_count|invalid_card_count|grouping_snapshot_|group_id_invalid_or_duplicate|card_id_invalid_or_duplicate|card_group_reference_invalid|card_promotion_pending|card_tier_assignment_invalid|dataset_not_found|snapshot_|source_dataset_payload_invalid|group_master_product_required|group_not_confirmed_or_locked|active_master_product_not_found|card_not_found_for_month/.test(message);
    if (authFailure) return json(res, 401, { ok: false, error: 'invalid_upload_key' });
    if (badRequest) return json(res, 400, { ok: false, error: message.replace(/^(?:test_)?supabase_\d+:/u, '') });
    if (message === 'promo_test_backend_not_configured') return json(res, 503, { ok: false, error: message });
    return json(res, 503, { ok: false, error: 'promo_auth_unavailable' });
  }
}
