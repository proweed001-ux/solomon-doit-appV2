import { bearerToken, methodNotAllowed, readBody, safeError, sendJson } from './_promo-new/http.js';
import {
  backendConfigured,
  callAdminRpc,
  getPublishedCatalog,
  loginWithPassword,
  logout,
  requirePromoAdmin,
  uploadCardImage,
} from './_promo-new/supabase.js';

const MONTH_KEY = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CARD_ID = /^[A-Z0-9][A-Z0-9:_-]{2,95}$/i;

function queryValue(req, name) {
  const value = req.query?.[name];
  return Array.isArray(value) ? value[0] : value;
}

function validateDatasetPayload(dataset) {
  if (!dataset || dataset.schema !== 'promo-system-rebuild-v1') throw new Error('dataset_schema_invalid');
  const monthKey = String(dataset.version?.monthKey || '').toUpperCase();
  if (!MONTH_KEY.test(monthKey)) throw new Error('month_key_invalid');
  if (!Array.isArray(dataset.cards) || !Array.isArray(dataset.productGroups) || !Array.isArray(dataset.promotionFamilies)) throw new Error('dataset_collections_missing');
  if (dataset.cards.some(card => String(card.monthKey || '').toUpperCase() !== monthKey)) throw new Error('card_crosses_month');
  const ids = dataset.cards.map(card => String(card.id || ''));
  if (ids.some(id => !CARD_ID.test(id)) || new Set(ids).size !== ids.length) throw new Error('card_id_invalid_or_duplicate');
  if (dataset.cards.some(card => !card.classId || !card.skuId || !card.productGroupId)) throw new Error('card_identity_incomplete');
  return monthKey;
}

async function handleGet(req, res, action) {
  if (action === 'health') return sendJson(res, 200, { ok: true, configured: backendConfigured(), mode: 'promo-system-rebuild-v1' });
  if (action === 'published') {
    const month = String(queryValue(req, 'month') || '').trim().toUpperCase();
    if (month && !MONTH_KEY.test(month)) return sendJson(res, 400, { ok: false, error: 'month_key_invalid' });
    const data = await getPublishedCatalog(month || null);
    return sendJson(res, 200, { ok: true, data });
  }
  if (action === 'session') {
    const user = await requirePromoAdmin(bearerToken(req));
    return sendJson(res, 200, { ok: true, user: { id: user.id, email: user.email || null } });
  }
  return sendJson(res, 404, { ok: false, error: 'action_not_found' });
}

async function handlePost(req, res, action) {
  const body = readBody(req);
  if (action === 'login') {
    const email = String(body.email || '').trim();
    const password = String(body.password || '');
    if (!email || password.length < 8) return sendJson(res, 400, { ok: false, error: 'credentials_invalid' });
    const session = await loginWithPassword(email, password);
    await requirePromoAdmin(session.access_token);
    return sendJson(res, 200, {
      ok: true,
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        user: { id: session.user?.id, email: session.user?.email || email },
      },
    });
  }

  const token = bearerToken(req);
  const actor = await requirePromoAdmin(token);
  if (action === 'logout') {
    await logout(token);
    return sendJson(res, 200, { ok: true });
  }
  if (action === 'draft') {
    const monthKey = validateDatasetPayload(body.dataset);
    const data = await callAdminRpc('promo_new_save_draft', {
      p_payload: body.dataset,
      p_actor_id: actor.id,
      p_expected_month_key: monthKey,
    });
    return sendJson(res, 200, { ok: true, data });
  }
  if (action === 'publish') {
    if (!UUID.test(String(body.versionId || ''))) throw new Error('version_id_invalid');
    const data = await callAdminRpc('promo_new_publish_version', { p_version_id: body.versionId, p_actor_id: actor.id });
    return sendJson(res, 200, { ok: true, data });
  }
  if (action === 'rollback') {
    if (!MONTH_KEY.test(String(body.monthKey || '').toUpperCase())) throw new Error('month_key_invalid');
    if (!UUID.test(String(body.targetVersionId || ''))) throw new Error('target_version_id_invalid');
    const data = await callAdminRpc('promo_new_rollback_version', {
      p_month_key: String(body.monthKey).toUpperCase(),
      p_target_version_id: body.targetVersionId,
      p_actor_id: actor.id,
    });
    return sendJson(res, 200, { ok: true, data });
  }
  if (action === 'card-image') {
    const versionId = String(body.versionId || '');
    const cardId = String(body.cardId || '');
    if (!UUID.test(versionId) || !CARD_ID.test(cardId)) throw new Error('image_identity_invalid');
    const match = String(body.dataUrl || '').match(/^data:(image\/(?:webp|png|jpeg));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) throw new Error('image_payload_invalid');
    const bytes = Buffer.from(match[2], 'base64');
    if (!bytes.length || bytes.length > 1_500_000) throw new Error('image_size_invalid');
    const path = await uploadCardImage({ versionId, cardId, bytes, contentType: match[1] });
    return sendJson(res, 200, { ok: true, path });
  }
  return sendJson(res, 404, { ok: false, error: 'action_not_found' });
}

export default async function handler(req, res) {
  const action = String(queryValue(req, 'action') || '').trim();
  try {
    if (req.method === 'GET') return await handleGet(req, res, action);
    if (req.method === 'POST') return await handlePost(req, res, action);
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    const message = safeError(error);
    const status = /authentication_required/.test(message) ? 401
      : /promo_admin_required/.test(message) ? 403
        : /not_configured/.test(message) ? 503
          : /invalid|missing|crosses|duplicate/.test(message) ? 400 : 500;
    return sendJson(res, status, { ok: false, error: message });
  }
}
