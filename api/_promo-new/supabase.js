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
  const rows = await request(`/rest/v1/promo_new_admins?user_id=eq.${encodeURIComponent(user.id)}&active=is.true&select=user_id&limit=1`, {
    key: secretKey(),
  });
  if (!Array.isArray(rows) || !rows.length) throw new Error('promo_admin_required');
  return user;
}

export function callAdminRpc(name, body) {
  return request(`/rest/v1/rpc/${name}`, { method: 'POST', key: secretKey(), body });
}

export async function getPublishedCatalog(monthKey) {
  const catalog = await callAdminRpc('promo_new_get_published_catalog', { p_month_key: monthKey || null });
  if (catalog?.cards && Array.isArray(catalog.cards)) {
    catalog.cards = catalog.cards.map(card => ({
      ...card,
      imageUrl: card.imageUrl && !String(card.imageUrl).startsWith('data:') && !String(card.imageUrl).startsWith('http')
        ? `${projectUrl()}/storage/v1/object/public/${String(card.imageUrl).replace(/^\/+/, '')}`
        : card.imageUrl,
    }));
  }
  return catalog;
}

export async function uploadCardImage({ versionId, cardId, bytes, contentType }) {
  if (!projectUrl() || !secretKey()) throw new Error('promo_backend_not_configured');
  const path = `${encodeURIComponent(versionId)}/${encodeURIComponent(cardId)}.webp`;
  const response = await fetch(`${projectUrl()}/storage/v1/object/promo-new-cards/${path}`, {
    method: 'POST',
    headers: {
      apikey: secretKey(),
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: bytes,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`storage_${response.status}:${text.slice(0, 300)}`);
  return `promo-new-cards/${versionId}/${cardId}.webp`;
}
