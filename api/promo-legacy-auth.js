import { createHash } from 'node:crypto';
import { buildLegacyMasterData, toLegacyClassId, toLegacyMonthId } from './_promo-new/legacy-adapter.js';

const SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
const MAX_LOGIN_BODY_BYTES = 4_096;
const MAX_MASTER_BODY_BYTES = 32_768;
const MAX_GROUPING_BODY_BYTES = 512_000;
const MAX_UPLOAD_KEY_LENGTH = 200;
const ALLOWED_UNITS = new Set(['ชิ้น', 'ขวด', 'แพ็ค', 'กล่อง', 'ลัง', 'ซอง', 'ด้าม', 'ถุง', 'ชุด']);
const MASTER_SKU_ID = /^MASTER-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu;

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

async function latestPublishedMonth() {
  const rows = await supabase('/rest/v1/promo_months?status=eq.published&select=id&order=published_at.desc.nullslast,updated_at.desc&limit=1');
  return Array.isArray(rows) && rows[0]?.id ? rows[0].id : 'KEYCHECK';
}

async function validateUploadKey(adminKey) {
  const key = text(adminKey);
  if (!key || key.length > MAX_UPLOAD_KEY_LENGTH) throw new Error('invalid_upload_key');
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

async function masterData() {
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
  const rows = await supabase('/rest/v1/rpc/create_promo_master_product', {
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

function validateGroupingInput(input) {
  const monthId = toLegacyMonthId(text(input?.monthKey || input?.promoMonthId));
  const groups = Array.isArray(input?.groups) ? input.groups : [];
  if (!monthId) throw new Error('invalid_promo_month');
  if (!groups.length || groups.length > 300) throw new Error('invalid_group_count');
  let cardCount = 0;
  const locators = new Set();
  const validated = groups.map(group => {
    const skuId = text(group?.skuId);
    const masterMatch = skuId.match(MASTER_SKU_ID);
    if (!masterMatch) throw new Error('group_master_product_required');
    const cards = Array.isArray(group?.cards) ? group.cards : [];
    if (!cards.length) throw new Error('group_has_no_cards');
    const normalizedCards = cards.map(card => {
      const classId = toLegacyClassId(text(card?.classId));
      const page = Number(card?.page);
      const sequence = Number(card?.sequence);
      if (!classId || !Number.isInteger(page) || page < 1 || !Number.isInteger(sequence) || sequence < 1) {
        throw new Error('invalid_card_locator');
      }
      const key = `${classId}|${page}|${sequence}`;
      if (locators.has(key)) throw new Error('duplicate_card_in_snapshot');
      locators.add(key);
      cardCount += 1;
      return { classId, page, sequence };
    });
    return { masterProductId: masterMatch[1].toLowerCase(), cards: normalizedCards };
  });
  if (cardCount < 1 || cardCount > 2000) throw new Error('invalid_card_count');
  return { monthId, groups: validated, cardCount };
}

async function resolveGroupingCardIds(monthId, groups, expectedCardCount) {
  const rows = await supabase(`/rest/v1/promo_cards?promo_month_id=eq.${encodeURIComponent(monthId)}&status=neq.inactive&select=card_id,class_id,page_no,card_no&order=class_id.asc,page_no.asc,card_no.asc&limit=2000`);
  const cards = Array.isArray(rows) ? rows : [];
  if (cards.length !== expectedCardCount) throw new Error(`grouping_snapshot_incomplete:${expectedCardCount}/${cards.length}`);
  const byPage = new Map();
  for (const card of cards) {
    const key = `${text(card.class_id).toUpperCase()}|${Number(card.page_no)}`;
    const list = byPage.get(key) || [];
    list.push(card);
    byPage.set(key, list);
  }
  for (const list of byPage.values()) list.sort((left, right) => Number(left.card_no) - Number(right.card_no));
  return groups.map(group => ({
    master_product_id: group.masterProductId,
    card_ids: group.cards.map(locator => {
      const list = byPage.get(`${locator.classId}|${locator.page}`) || [];
      const row = list[locator.sequence - 1];
      if (!row?.card_id) throw new Error(`card_locator_not_found:${locator.classId}:${locator.page}:${locator.sequence}`);
      return text(row.card_id);
    }),
  }));
}

async function saveGroupingSnapshot(input, adminKey) {
  const validated = validateGroupingInput(input);
  const groups = await resolveGroupingCardIds(validated.monthId, validated.groups, validated.cardCount);
  const rows = await supabase('/rest/v1/rpc/save_manual_promo_grouping_snapshot', {
    method: 'POST',
    body: JSON.stringify({
      p_promo_month_id: validated.monthId,
      p_groups: groups,
      p_auth_hash: sha256(adminKey),
    }),
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row || Number(row.card_count) !== validated.cardCount) throw new Error('grouping_snapshot_save_incomplete');
  return { promoMonthId: validated.monthId, groupCount: Number(row.group_count), cardCount: Number(row.card_count) };
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
      return json(res, 200, { ok: true, data: await masterData() });
    }

    if (req.method === 'POST' && action === 'create-master') {
      if (requestBodySize(req) > MAX_MASTER_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });
      const adminKey = await validateUploadKey(headerKey);
      return json(res, 200, { ok: true, data: await createMasterProduct(req.body?.product, adminKey) });
    }

    if (req.method === 'POST' && action === 'save-grouping-snapshot') {
      if (requestBodySize(req) > MAX_GROUPING_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });
      const adminKey = await validateUploadKey(headerKey);
      return json(res, 200, { ok: true, data: await saveGroupingSnapshot(req.body, adminKey) });
    }

    if (req.method === 'POST' && action === 'logout') return json(res, 200, { ok: true });
    return json(res, 404, { ok: false, error: 'action_not_found' });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');
    const authFailure = /invalid_upload_key|missing_admin_key|invalid_admin_key|supabase_401|supabase_403/.test(message);
    const badRequest = /invalid_canonical_name|invalid_brand|invalid_product_type|invalid_sales_unit|invalid_size_value|invalid_pack_quantity|invalid_unit|invalid_normalized_key|invalid_promo_month|invalid_group_count|invalid_card_count|invalid_card_locator|duplicate_card_in_snapshot|group_master_product_required|group_has_no_cards|grouping_snapshot_incomplete|card_locator_not_found|active_master_product_not_found|card_not_found_for_month/.test(message);
    if (authFailure) return json(res, 401, { ok: false, error: 'invalid_upload_key' });
    if (badRequest) return json(res, 400, { ok: false, error: message.replace(/^supabase_\d+:/u, '') });
    return json(res, 503, { ok: false, error: 'promo_auth_unavailable' });
  }
}
