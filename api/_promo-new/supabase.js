import {
  buildLegacyMasterData,
  buildLegacyPromoDataset,
  toLegacyMonthId,
} from './legacy-adapter.js';

const projectUrl = () => String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const publishableKey = () => String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '');
const secretKey = () => String(process.env.SUPABASE_SECRET_KEY || '');

export function backendConfigured() {
  return Boolean(projectUrl() && publishableKey() && secretKey());
}

async function request(path, { method = 'GET', body, key, token = key, headers = {} } = {}) {
  if (!projectUrl() || !key) throw new Error('promo_backend_not_configured');
  const response = await fetch(`${projectUrl()}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      ...(body == null ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body == null ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const message = typeof data === 'object' && data ? data.message || data.error_description || data.error : text;
    throw new Error(`supabase_${response.status}:${message || 'request_failed'}`);
  }
  return data;
}

function rest(table, query) {
  return request(`/rest/v1/${table}?${query}`, { key: secretKey() });
}

export function loginWithPassword(email, password) {
  return request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    key: publishableKey(),
    body: { email, password },
  });
}

export function logout(accessToken) {
  return request('/auth/v1/logout', {
    method: 'POST',
    key: publishableKey(),
    token: accessToken,
  });
}

export function getUser(accessToken) {
  return request('/auth/v1/user', {
    key: publishableKey(),
    token: accessToken,
  });
}

export async function requirePromoAdmin(accessToken) {
  if (!accessToken) throw new Error('authentication_required');
  const user = await getUser(accessToken);
  const rows = await rest(
    'promo_admin_users',
    `user_id=eq.${encodeURIComponent(user.id)}&select=user_id,role&limit=1`,
  );
  if (!Array.isArray(rows) || !rows.length) throw new Error('promo_admin_required');
  return { ...user, promoRole: rows[0].role || 'viewer' };
}

export function callAdminRpc() {
  throw new Error('promo_new_schema_not_installed_use_legacy_adapter');
}

async function loadLegacyMasters() {
  const [masters, masterPrices] = await Promise.all([
    rest(
      'promo_product_master',
      'select=master_product_id,canonical_name,normalized_key,unit_label,status,created_from_month,updated_at&order=canonical_name.asc',
    ),
    rest(
      'promo_product_master_prices',
      'select=master_product_id,base_unit_price,unit_label,source_month,updated_at',
    ),
  ]);
  return { masters, masterPrices };
}

export async function getPromoMasterData() {
  const { masters, masterPrices } = await loadLegacyMasters();
  return buildLegacyMasterData(masters, masterPrices);
}

export async function assertVersionPublishable() {
  throw new Error('legacy_revision_staging_not_installed');
}

async function resolvePublishedMonth(monthKey) {
  const legacyId = toLegacyMonthId(monthKey);
  if (monthKey && !legacyId) throw new Error('legacy_month_key_invalid');
  const query = legacyId
    ? `id=eq.${encodeURIComponent(legacyId)}&status=eq.published&select=id,label,year_month,status,source_pdf,source_price_file,created_at,updated_at,published_at&limit=1`
    : 'status=eq.published&select=id,label,year_month,status,source_pdf,source_price_file,created_at,updated_at,published_at&order=published_at.desc.nullslast,updated_at.desc&limit=1';
  const rows = await rest('promo_months', query);
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

function publicImageUrl(value) {
  const image = String(value || '');
  if (!image || image.startsWith('data:') || image.startsWith('http')) return image || null;
  const path = image.replace(/^\/+/, '').replace(/^promo-cards\//, '');
  return `${projectUrl()}/storage/v1/object/public/promo-cards/${path}`;
}

export async function getPublishedCatalog(monthKey) {
  const month = await resolvePublishedMonth(monthKey);
  if (!month) return null;
  const monthId = encodeURIComponent(month.id);
  const [{ masters, masterPrices }, cards, tiers, groups] = await Promise.all([
    loadLegacyMasters(),
    rest(
      'promo_cards_with_functions',
      `promo_month_id=eq.${monthId}&status=neq.inactive&select=card_id,promo_month_id,class_id,page_no,card_no,promo_title,raw_text,status,image_url,image_name,sort_order,base_unit_price,unit_label,group_id,product_group_name,product_group_status,product_group_match_score,function_label,function_type,function_payload,function_confidence,master_product_id,master_product_name,price_source,master_current_price,master_price_updated_at&order=sort_order.asc`,
    ),
    rest(
      'promo_tiers',
      `card_id=like.${monthId}-*&select=tier_id,card_id,tier_no,min_qty_text,min_qty,max_qty,unit,discount_percent,free_qty,note&order=card_id.asc,tier_no.asc`,
    ),
    rest(
      'promo_product_groups',
      `promo_month_id=eq.${monthId}&select=group_id,promo_month_id,anchor_card_id,canonical_name,status,master_product_id,created_at,updated_at&order=canonical_name.asc`,
    ),
  ]);

  const catalog = buildLegacyPromoDataset({
    month,
    cards,
    tiers,
    groups,
    masters,
    masterPrices,
  });
  if (catalog?.cards) {
    catalog.cards = catalog.cards.map(card => ({ ...card, imageUrl: publicImageUrl(card.imageUrl) }));
  }
  return catalog;
}

export async function uploadCardImage() {
  throw new Error('legacy_revision_staging_not_installed');
}
