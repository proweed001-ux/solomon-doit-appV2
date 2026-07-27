import { createHash } from 'node:crypto';

const PRODUCTION_SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const MONTH_KEY = /^[A-Z0-9][A-Z0-9_-]{2,31}$/u;

const text = value => String(value || '').trim();
const sha256 = value => createHash('sha256').update(String(value), 'utf8').digest('hex');

function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(body);
}

export function stagingBackend() {
  if (String(process.env.PROMO_TEST_DATABASE || '') !== '1') throw new Error('promo_test_backend_not_enabled');
  const url = text(process.env.PROMO_TEST_SUPABASE_URL).replace(/\/$/u, '');
  const key = text(process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY);
  if (!url || !key) throw new Error('promo_test_backend_not_configured');

  let hostname;
  try { hostname = new URL(url).hostname.toLowerCase(); }
  catch { throw new Error('promo_test_backend_url_invalid'); }

  if (hostname === new URL(PRODUCTION_SUPABASE_URL).hostname.toLowerCase()) {
    throw new Error('production_backend_rejected');
  }
  if (!hostname.endsWith('.supabase.co')) throw new Error('promo_test_backend_host_invalid');
  return { url, key };
}

async function rpc(name, body) {
  const backend = stagingBackend();
  const response = await fetch(`${backend.url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: backend.key,
      Authorization: `Bearer ${backend.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    const detail = data && typeof data === 'object'
      ? data.message || data.error || data.error_description
      : raw;
    throw new Error(`test_supabase_${response.status}:${detail || 'request_failed'}`);
  }
  return data;
}

export function validateStagingPublishRequest(body) {
  const versionId = text(body?.versionId).toLowerCase();
  if (!UUID.test(versionId)) throw new Error('version_id_invalid');
  return { versionId };
}

export default async function handler(req, res) {
  try {
    const action = text(req.query?.action || req.body?.action).toLowerCase();
    if (req.method === 'GET' && action === 'published') {
      const month = text(req.query?.month).toUpperCase();
      if (month && !MONTH_KEY.test(month)) return json(res, 400, { ok: false, error: 'month_key_invalid' });
      const data = await rpc('get_promo_test_published_catalog_v1', { p_month_key: month || null });
      return json(res, 200, { ok: true, data });
    }

    if (req.method === 'POST' && action === 'publish') {
      const adminKey = text(req.headers['x-promo-admin-key']);
      if (!adminKey || adminKey.length > 200) return json(res, 401, { ok: false, error: 'invalid_upload_key' });
      const { versionId } = validateStagingPublishRequest(req.body);
      const data = await rpc('publish_promo_test_version_v1', {
        p_version_id: versionId,
        p_auth_hash: sha256(adminKey),
      });
      return json(res, 200, { ok: true, data });
    }

    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');
    if (/invalid_admin_key|invalid_upload_key|test_supabase_(401|403)/u.test(message)) {
      return json(res, 401, { ok: false, error: 'invalid_upload_key' });
    }
    if (/month_key_invalid|version_id_invalid|publish_/u.test(message)) {
      return json(res, 400, { ok: false, error: message.replace(/^test_supabase_\d+:/u, '') });
    }
    if (/promo_test_backend_|production_backend_rejected/u.test(message)) {
      return json(res, 503, { ok: false, error: message });
    }
    return json(res, 503, { ok: false, error: 'staging_publish_unavailable' });
  }
}
