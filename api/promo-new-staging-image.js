import { createHash } from 'node:crypto';

const PRODUCTION_SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const WEBP_DATA_URL = /^data:image\/webp;base64,([A-Za-z0-9+/]+={0,2})$/u;
const MAX_IMAGE_BYTES = 1024 * 1024;

const clean = value => String(value || '').trim();
const sha256 = value => createHash('sha256').update(String(value), 'utf8').digest('hex');

function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(body);
}

function stagingBackend() {
  if (String(process.env.PROMO_TEST_DATABASE || '') !== '1') throw new Error('promo_test_backend_not_enabled');
  const url = clean(process.env.PROMO_TEST_SUPABASE_URL).replace(/\/$/u, '');
  const key = clean(process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY);
  if (!url || !key) throw new Error('promo_test_backend_not_configured');
  let hostname;
  try { hostname = new URL(url).hostname.toLowerCase(); }
  catch { throw new Error('promo_test_backend_url_invalid'); }
  if (hostname === new URL(PRODUCTION_SUPABASE_URL).hostname.toLowerCase()) throw new Error('production_backend_rejected');
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
    const detail = data && typeof data === 'object' ? data.message || data.error || data.error_description : raw;
    throw new Error(`test_supabase_${response.status}:${detail || 'request_failed'}`);
  }
  return data;
}

export function validateImageIdentity(versionIdInput, cardIdInput) {
  const versionId = clean(versionIdInput).toLowerCase();
  const cardId = clean(cardIdInput).toLowerCase();
  if (!UUID.test(versionId)) throw new Error('version_id_invalid');
  if (!UUID.test(cardId)) throw new Error('card_id_invalid');
  return { versionId, cardId };
}

export function parseWebpDataUrl(value) {
  const match = clean(value).match(WEBP_DATA_URL);
  if (!match) throw new Error('image_must_be_webp_data_url');
  const bytes = Buffer.from(match[1], 'base64');
  if (bytes.length < 32 || bytes.length > MAX_IMAGE_BYTES) throw new Error('image_size_invalid');
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error('image_signature_invalid');
  }
  return { bytes, base64: match[1] };
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const adminKey = clean(req.headers['x-promo-admin-key']);
      if (!adminKey || adminKey.length > 200) return json(res, 401, { ok: false, error: 'invalid_upload_key' });
      const { versionId, cardId } = validateImageIdentity(req.body?.versionId, req.body?.cardId);
      const { base64 } = parseWebpDataUrl(req.body?.dataUrl);
      await rpc('save_promo_test_card_image_v1', {
        p_version_id: versionId,
        p_card_external_id: cardId,
        p_mime_type: 'image/webp',
        p_image_base64: base64,
        p_auth_hash: sha256(adminKey),
      });
      return json(res, 200, {
        ok: true,
        data: { imageUrl: `/api/promo-new-staging-image?versionId=${encodeURIComponent(versionId)}&cardId=${encodeURIComponent(cardId)}` },
      });
    }

    if (req.method === 'GET') {
      const { versionId, cardId } = validateImageIdentity(req.query?.versionId, req.query?.cardId);
      const record = await rpc('get_promo_test_card_image_v1', {
        p_version_id: versionId,
        p_card_external_id: cardId,
      });
      if (!record?.image_base64 || record?.mime_type !== 'image/webp') {
        return json(res, 404, { ok: false, error: 'published_image_not_found' });
      }
      const bytes = Buffer.from(record.image_base64, 'base64');
      if (bytes.length < 32 || bytes.length > MAX_IMAGE_BYTES) throw new Error('stored_image_invalid');
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
      return res.status(200).send(bytes);
    }

    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');
    if (/invalid_admin_key|invalid_upload_key|test_supabase_(401|403)/u.test(message)) {
      return json(res, 401, { ok: false, error: 'invalid_upload_key' });
    }
    if (/version_id_invalid|card_id_invalid|image_/u.test(message)) {
      return json(res, 400, { ok: false, error: message.replace(/^test_supabase_\d+:/u, '') });
    }
    if (/promo_test_backend_|production_backend_rejected/u.test(message)) {
      return json(res, 503, { ok: false, error: message });
    }
    return json(res, 503, { ok: false, error: 'staging_image_unavailable' });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '1500kb' } },
};
