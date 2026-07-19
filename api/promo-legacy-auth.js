import { buildLegacyMasterData } from './_promo-new/legacy-adapter.js';

const SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
const MAX_LOGIN_BODY_BYTES = 4_096;
const MAX_UPLOAD_KEY_LENGTH = 200;

function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}

function text(value) {
  return String(value || '').trim();
}

function requestBodySize(req) {
  const declared = Number(req.headers['content-length']);
  if (Number.isFinite(declared) && declared >= 0) return declared;
  try { return Buffer.byteLength(JSON.stringify(req.body || {}), 'utf8'); } catch { return MAX_LOGIN_BODY_BYTES + 1; }
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

async function masterData() {
  const [masters, prices, aliases] = await Promise.all([
    supabase('/rest/v1/promo_product_master?select=master_product_id,canonical_name,normalized_key,unit_label,status,created_from_month,updated_at&order=canonical_name.asc'),
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
  data.skus = data.skus.map(sku => {
    const masterId = String(sku.id || '').startsWith('MASTER-') ? String(sku.id).slice(7) : '';
    const masterAliases = aliasesByMaster.get(masterId) || [];
    return { ...sku, evidence: [...new Set([...(sku.evidence || []), ...masterAliases])] };
  });
  return data;
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

    if (req.method === 'POST' && action === 'logout') return json(res, 200, { ok: true });
    return json(res, 404, { ok: false, error: 'action_not_found' });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');
    const authFailure = /invalid_upload_key|missing_admin_key|invalid_admin_key|supabase_401|supabase_403/.test(message);
    return json(res, authFailure ? 401 : 503, { ok: false, error: authFailure ? 'invalid_upload_key' : 'promo_auth_unavailable' });
  }
}
