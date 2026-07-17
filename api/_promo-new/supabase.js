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

const asArray = value => Array.isArray(value) ? value : [];
const hasReasons = value => asArray(value).length > 0;

export async function getPromoMasterData() {
  const [skuRows, priceRows] = await Promise.all([
    request('/rest/v1/promo_new_skus?status=eq.active&select=id,external_id,sku_code,canonical_name,identity_key,brand,product_type,variant,size_value,size_unit,sales_unit,pack_quantity,status,evidence,failure_reasons&order=canonical_name.asc', { key: secretKey() }),
    request('/rest/v1/promo_new_sku_prices?effective_price=not.is.null&select=sku_id,effective_price,source_reference,updated_at', { key: secretKey() }),
  ]);
  const byDatabaseId = new Map(asArray(skuRows).map(row => [row.id, row]));
  const skus = asArray(skuRows).map(row => ({
    id: row.external_id,
    code: row.sku_code,
    canonicalName: row.canonical_name,
    identityKey: row.identity_key,
    identity: {
      brand: row.brand,
      productType: row.product_type,
      variant: row.variant || null,
      sizeValue: Number(row.size_value),
      sizeUnit: row.size_unit,
      salesUnit: row.sales_unit,
      packQuantity: Number(row.pack_quantity),
    },
    status: row.status,
    evidence: asArray(row.evidence),
    failureReasons: asArray(row.failure_reasons),
  }));
  const prices = asArray(priceRows).flatMap(row => {
    const sku = byDatabaseId.get(row.sku_id);
    const amount = Number(row.effective_price);
    if (!sku || !Number.isFinite(amount) || amount <= 0) return [];
    return [{
      skuIdentityKey: sku.identity_key,
      skuId: sku.external_id,
      amount,
      currency: 'THB',
      sourceReference: row.source_reference || 'previous_month',
      updatedAt: row.updated_at || null,
    }];
  });
  return { skus, prices };
}

export async function assertVersionPublishable(versionId) {
  const [cards, groups, families, skus] = await Promise.all([
    request(`/rest/v1/promo_new_cards?version_id=eq.${encodeURIComponent(versionId)}&select=card_id,status,effective_price,failure_reasons,promotion_family_id,class_id,sku_id`, { key: secretKey() }),
    request(`/rest/v1/promo_new_product_groups?version_id=eq.${encodeURIComponent(versionId)}&select=external_id,status,failure_reasons,promotion_family_id,sku_id`, { key: secretKey() }),
    request(`/rest/v1/promo_new_promotion_families?version_id=eq.${encodeURIComponent(versionId)}&select=id,external_id,failure_reasons`, { key: secretKey() }),
    request('/rest/v1/promo_new_skus?select=id,status,failure_reasons', { key: secretKey() }),
  ]);
  const blockers = [];
  const skuById = new Map(asArray(skus).map(row => [row.id, row]));
  const familyById = new Map(asArray(families).map(row => [row.id, row]));
  for (const card of asArray(cards)) {
    if (card.status !== 'ready') blockers.push(`card:${card.card_id}:status`);
    if (!(Number(card.effective_price) > 0)) blockers.push(`card:${card.card_id}:price`);
    if (!card.promotion_family_id) blockers.push(`card:${card.card_id}:family`);
    if (hasReasons(card.failure_reasons)) blockers.push(`card:${card.card_id}:failure_reasons`);
    const sku = skuById.get(card.sku_id);
    if (!sku || sku.status !== 'active' || hasReasons(sku.failure_reasons)) blockers.push(`card:${card.card_id}:sku_not_active`);
    const family = familyById.get(card.promotion_family_id);
    if (!family || hasReasons(family.failure_reasons)) blockers.push(`card:${card.card_id}:family_not_clean`);
  }
  for (const group of asArray(groups)) {
    if (group.status !== 'ready') blockers.push(`group:${group.external_id}:status`);
    if (!group.promotion_family_id) blockers.push(`group:${group.external_id}:family`);
    if (hasReasons(group.failure_reasons)) blockers.push(`group:${group.external_id}:failure_reasons`);
    const sku = skuById.get(group.sku_id);
    if (!sku || sku.status !== 'active' || hasReasons(sku.failure_reasons)) blockers.push(`group:${group.external_id}:sku_not_active`);
  }
  if (!asArray(cards).length || !asArray(groups).length) blockers.push('published_version_empty');
  if (blockers.length) throw new Error(`publish_server_validation_failed:${[...new Set(blockers)].slice(0, 20).join(',')}`);
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
