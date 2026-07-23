import { createHash } from 'node:crypto';

const PRODUCTION_SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const MAX_BODY_BYTES = 2_000_000;
const MONTH_KEY = /^[A-Z0-9][A-Z0-9_-]{2,31}$/u;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}

function text(value) {
  return String(value || '').trim();
}

function sha256(value) {
  return createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function requestBodySize(req) {
  const declared = Number(req.headers['content-length']);
  if (Number.isFinite(declared) && declared >= 0) return declared;
  try { return Buffer.byteLength(JSON.stringify(req.body || {}), 'utf8'); }
  catch { return MAX_BODY_BYTES + 1; }
}

export function validateAtomicRevisionRequest(body) {
  if (text(body?.action).toLowerCase() !== 'save-draft') throw new Error('action_invalid');
  const dataset = body?.dataset;
  if (!dataset || dataset.schema !== 'promo-system-rebuild-v1') throw new Error('dataset_schema_invalid');

  const monthKey = text(dataset.version?.monthKey).toUpperCase();
  const versionId = text(dataset.version?.id);
  if (!MONTH_KEY.test(monthKey)) throw new Error('month_key_invalid');
  if (!UUID.test(versionId)) throw new Error('version_id_invalid');

  for (const key of ['skus', 'prices', 'cards', 'productGroups', 'promotionFamilies']) {
    if (!Array.isArray(dataset[key])) throw new Error(`dataset_${key}_missing`);
  }

  const cardCount = dataset.cards.length;
  const groupCount = dataset.productGroups.length;
  const familyCount = dataset.promotionFamilies.length;
  if (cardCount < 1 || cardCount > 1000) throw new Error('card_count_invalid');
  if (groupCount < 1 || groupCount > cardCount) throw new Error('group_count_invalid');
  if (familyCount < 1 || familyCount > 1000) throw new Error('family_count_invalid');
  if (dataset.cards.some(card => text(card?.monthKey).toUpperCase() !== monthKey)) throw new Error('card_crosses_month');
  if (dataset.productGroups.some(group => text(group?.monthKey).toUpperCase() !== monthKey)) throw new Error('group_crosses_month');

  return { dataset, monthKey, versionId, cardCount, groupCount, familyCount };
}

export function stagingBackend() {
  if (String(process.env.PROMO_TEST_DATABASE || '') !== '1') throw new Error('promo_test_backend_not_enabled');

  const configuredUrl = text(process.env.PROMO_TEST_SUPABASE_URL).replace(/\/$/u, '');
  const key = text(process.env.PROMO_TEST_SUPABASE_PUBLISHABLE_KEY);
  if (!configuredUrl || !key) throw new Error('promo_test_backend_not_configured');

  let url;
  let hostname;
  try {
    const parsed = new URL(configuredUrl);
    url = parsed.origin;
    hostname = parsed.hostname.toLowerCase();
  } catch {
    throw new Error('promo_test_backend_not_configured');
  }

  const productionHostname = new URL(PRODUCTION_SUPABASE_URL).hostname.toLowerCase();
  if (hostname === productionHostname) throw new Error('production_backend_rejected');
  if (!hostname.endsWith('.supabase.co')) throw new Error('promo_test_backend_host_invalid');
  return { url, key };
}

async function saveAtomicRevision(dataset, monthKey, adminKey) {
  const backend = stagingBackend();
  const response = await fetch(`${backend.url}/rest/v1/rpc/save_promo_test_revision_v1`, {
    method: 'POST',
    headers: {
      apikey: backend.key,
      Authorization: `Bearer ${backend.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_payload: dataset,
      p_expected_month_key: monthKey,
      p_auth_hash: sha256(adminKey),
    }),
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

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return json(res, 405, { ok: false, error: 'method_not_allowed' });
    }
    if (requestBodySize(req) > MAX_BODY_BYTES) return json(res, 413, { ok: false, error: 'request_body_too_large' });

    const adminKey = text(req.headers['x-promo-admin-key']);
    if (!adminKey || adminKey.length > 200) return json(res, 401, { ok: false, error: 'invalid_upload_key' });

    const validated = validateAtomicRevisionRequest(req.body);
    const startedAt = Date.now();
    const data = await saveAtomicRevision(validated.dataset, validated.monthKey, adminKey);
    return json(res, 200, {
      ok: true,
      data,
      networkElapsedMs: Date.now() - startedAt,
      requestCounts: {
        cards: validated.cardCount,
        groups: validated.groupCount,
        families: validated.familyCount,
      },
    });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');
    const authFailure = /invalid_admin_key|invalid_upload_key|test_supabase_(401|403)/u.test(message);
    const badRequest = /action_invalid|dataset_|month_key_invalid|version_id_invalid|card_count_invalid|group_count_invalid|family_count_invalid|card_crosses_month|group_crosses_month|version_id_month_conflict|version_id_payload_conflict|existing_revision_incomplete/u.test(message);
    if (authFailure) return json(res, 401, { ok: false, error: 'invalid_upload_key' });
    if (badRequest) return json(res, 400, { ok: false, error: message.replace(/^test_supabase_\d+:/u, '') });
    if (/promo_test_backend_|production_backend_rejected/u.test(message)) return json(res, 503, { ok: false, error: message });
    return json(res, 503, { ok: false, error: 'atomic_revision_unavailable' });
  }
}
