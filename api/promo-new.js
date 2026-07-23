import { bearerToken, methodNotAllowed, readBody, safeError, sendJson } from './_promo-new/http.js';
import {
  assertVersionPublishable,
  backendConfigured,
  getPromoMasterData,
  getPublishedCatalog,
  loginWithPassword,
  logout,
  requirePromoAdmin,
} from './_promo-new/supabase.js';

const MONTH_KEY = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CARD_ID = /^[A-Z0-9][A-Z0-9:_-]{2,95}$/i;
const WRITE_PENDING = 'legacy_revision_staging_not_installed';

function queryValue(req, name) {
  const value = req.query?.[name];
  return Array.isArray(value) ? value[0] : value;
}

const rows = value => Array.isArray(value) ? value : [];
const hasReasons = value => rows(value).length > 0;
const positiveMoney = value => Number(value?.amount) > 0 && value?.currency === 'THB';

function validateTier(tier) {
  if (!Number.isInteger(Number(tier?.tierNo)) || Number(tier.tierNo) < 1) return false;
  if (!(Number(tier?.minQuantity) > 0)) return false;
  if (tier.maxQuantity != null && Number(tier.maxQuantity) < Number(tier.minQuantity)) return false;
  if (tier.type === 'cash_discount') return Number(tier.discountPercent) > 0 && Number(tier.discountPercent) <= 100;
  if (tier.type === 'free_goods') return Number(tier.freeQuantity) > 0 && tier.effectivePercentUsage === 'display_only';
  if (tier.type === 'bundle_price') return positiveMoney(tier.bundlePrice);
  return false;
}

function missingPrice(skuId) {
  return {
    skuId,
    pdfSourcePrice: null,
    centralOverridePrice: null,
    effectivePrice: null,
    source: 'missing',
    sourceReference: null,
    updatedAt: null,
  };
}

export function quarantinePublishedPriceConflicts(dataset) {
  if (!dataset || !Array.isArray(dataset.warnings)) return dataset;
  const conflictGroups = new Set(dataset.warnings.flatMap(warning => {
    const match = String(warning).match(/^group:(.+):legacy_price_conflict$/u);
    return match ? [match[1]] : [];
  }));
  if (!conflictGroups.size) return dataset;
  const affectedSkuIds = new Set();
  const productGroups = rows(dataset.productGroups).map(group => {
    if (!conflictGroups.has(group.id)) return group;
    affectedSkuIds.add(group.skuId);
    return {
      ...group,
      price: missingPrice(group.skuId),
      status: 'blocked',
      failureReasons: [...new Set([...rows(group.failureReasons), 'legacy_price_conflict'])],
    };
  });
  const cards = rows(dataset.cards).map(card => {
    if (!conflictGroups.has(card.productGroupId)) return card;
    return {
      ...card,
      price: missingPrice(card.skuId),
      status: 'need_review',
      failureReasons: [...new Set([...rows(card.failureReasons), 'legacy_price_conflict'])],
    };
  });
  const prices = rows(dataset.prices).map(price => affectedSkuIds.has(price.skuId) ? missingPrice(price.skuId) : price);
  return {
    ...dataset,
    cards,
    productGroups,
    prices,
    warnings: [...new Set([...dataset.warnings, ...[...conflictGroups].map(groupId => `group:${groupId}:legacy_price_conflict_blocked`)])],
  };
}

function validateDatasetPayload(dataset) {
  if (!dataset || dataset.schema !== 'promo-system-rebuild-v1') throw new Error('dataset_schema_invalid');
  if (!UUID.test(String(dataset.version?.id || ''))) throw new Error('version_id_invalid');
  const monthKey = String(dataset.version?.monthKey || '').toUpperCase();
  if (!MONTH_KEY.test(monthKey)) throw new Error('month_key_invalid');
  for (const key of ['skus', 'prices', 'cards', 'productGroups', 'promotionFamilies']) {
    if (!Array.isArray(dataset[key])) throw new Error(`dataset_${key}_missing`);
  }
  if (dataset.cards.some(card => String(card.monthKey || '').toUpperCase() !== monthKey)) throw new Error('card_crosses_month');
  if (dataset.productGroups.some(group => String(group.monthKey || '').toUpperCase() !== monthKey)) throw new Error('group_crosses_month');

  const cardIds = dataset.cards.map(card => String(card.id || ''));
  const skuIds = dataset.skus.map(sku => String(sku.id || ''));
  const groupIds = dataset.productGroups.map(group => String(group.id || ''));
  const familyIds = dataset.promotionFamilies.map(family => String(family.id || ''));
  if (cardIds.some(id => !CARD_ID.test(id)) || new Set(cardIds).size !== cardIds.length) throw new Error('card_id_invalid_or_duplicate');
  if (skuIds.some(id => !id) || new Set(skuIds).size !== skuIds.length) throw new Error('sku_id_invalid_or_duplicate');
  if (groupIds.some(id => !id) || new Set(groupIds).size !== groupIds.length) throw new Error('group_id_invalid_or_duplicate');
  if (familyIds.some(id => !id) || new Set(familyIds).size !== familyIds.length) throw new Error('family_id_invalid_or_duplicate');

  const skuById = new Map(dataset.skus.map(sku => [sku.id, sku]));
  const groupById = new Map(dataset.productGroups.map(group => [group.id, group]));
  const familyById = new Map(dataset.promotionFamilies.map(family => [family.id, family]));
  const priceBySku = new Map(dataset.prices.map(price => [price.skuId, price]));

  for (const family of dataset.promotionFamilies) {
    for (const [classId, tiers] of Object.entries(family.tiersByClass || {})) {
      if (!classId || !Array.isArray(tiers) || tiers.some(tier => !validateTier(tier))) throw new Error(`family_tier_invalid:${family.id}:${classId || 'missing'}`);
    }
  }

  for (const group of dataset.productGroups) {
    const sku = skuById.get(group.skuId);
    if (!sku) throw new Error(`group_sku_missing:${group.id}`);
    if (group.sku?.identityKey !== sku.identityKey) throw new Error(`group_sku_identity_mismatch:${group.id}`);
    const memberCards = dataset.cards.filter(card => card.productGroupId === group.id);
    if (!memberCards.length) throw new Error(`group_cards_missing:${group.id}`);
    if (memberCards.some(card => card.skuId !== group.skuId)) throw new Error(`group_contains_different_sku:${group.id}`);
    const classes = memberCards.map(card => card.classId);
    if (classes.some(classId => !classId) || new Set(classes).size !== classes.length) throw new Error(`group_class_invalid_or_duplicate:${group.id}`);
    if (group.status === 'ready') {
      const family = familyById.get(group.promotionFamilyId);
      const price = priceBySku.get(group.skuId) || group.price;
      if (sku.status !== 'active' || hasReasons(sku.failureReasons)) throw new Error(`ready_group_sku_not_active:${group.id}`);
      if (!family || hasReasons(family.failureReasons)) throw new Error(`ready_group_family_invalid:${group.id}`);
      if (hasReasons(group.failureReasons)) throw new Error(`ready_group_has_failure_reasons:${group.id}`);
      if (!positiveMoney(price?.effectivePrice)) throw new Error(`ready_group_price_missing:${group.id}`);
      if (classes.some(classId => !family.tiersByClass?.[classId]?.length)) throw new Error(`ready_group_class_tier_missing:${group.id}`);
    }
  }

  for (const card of dataset.cards) {
    if (!card.classId || !card.skuId || !card.productGroupId) throw new Error('card_identity_incomplete');
    const group = groupById.get(card.productGroupId);
    const sku = skuById.get(card.skuId);
    if (!group || !sku || group.skuId !== card.skuId) throw new Error(`card_reference_invalid:${card.id}`);
    if (card.status === 'ready') {
      const family = familyById.get(card.promotionFamilyId);
      if (sku.status !== 'active' || hasReasons(sku.failureReasons)) throw new Error(`ready_card_sku_not_active:${card.id}`);
      if (!family || hasReasons(family.failureReasons)) throw new Error(`ready_card_family_invalid:${card.id}`);
      if (hasReasons(card.failureReasons)) throw new Error(`ready_card_has_failure_reasons:${card.id}`);
      if (!positiveMoney(card.price?.effectivePrice)) throw new Error(`ready_card_price_missing:${card.id}`);
      if (!Array.isArray(card.promotionTiers) || !card.promotionTiers.length || card.promotionTiers.some(tier => !validateTier(tier))) throw new Error(`ready_card_tiers_invalid:${card.id}`);
      if (!family.tiersByClass?.[card.classId]?.length) throw new Error(`ready_card_class_tier_missing:${card.id}`);
    }
  }
  return monthKey;
}

async function handleGet(req, res, action) {
  if (action === 'health') {
    return sendJson(res, 200, {
      ok: true,
      configured: backendConfigured(),
      mode: 'legacy-promo-adapter-v1',
      readSchema: 'promo_*',
      storageBucket: 'promo-cards',
      writeMode: 'blocked_until_revision_staging',
    });
  }
  if (action === 'published') {
    const month = String(queryValue(req, 'month') || '').trim().toUpperCase();
    if (month && !MONTH_KEY.test(month)) return sendJson(res, 400, { ok: false, error: 'month_key_invalid' });
    const data = quarantinePublishedPriceConflicts(await getPublishedCatalog(month || null));
    return sendJson(res, 200, { ok: true, data });
  }
  if (action === 'session') {
    const user = await requirePromoAdmin(bearerToken(req));
    return sendJson(res, 200, { ok: true, user: { id: user.id, email: user.email || null, role: user.promoRole || 'viewer' } });
  }
  if (action === 'master-data') {
    await requirePromoAdmin(bearerToken(req));
    return sendJson(res, 200, { ok: true, data: await getPromoMasterData() });
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
    const actor = await requirePromoAdmin(session.access_token);
    return sendJson(res, 200, {
      ok: true,
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        user: { id: session.user?.id, email: session.user?.email || email, role: actor.promoRole || 'viewer' },
      },
    });
  }

  const token = bearerToken(req);
  await requirePromoAdmin(token);
  if (action === 'logout') {
    await logout(token);
    return sendJson(res, 200, { ok: true });
  }
  if (action === 'draft') {
    validateDatasetPayload(body.dataset);
    return sendJson(res, 409, { ok: false, error: WRITE_PENDING, next: 'install_revision_staging_adapter' });
  }
  if (action === 'publish') {
    if (!UUID.test(String(body.versionId || ''))) throw new Error('version_id_invalid');
    await assertVersionPublishable(body.versionId);
    return sendJson(res, 409, { ok: false, error: WRITE_PENDING, next: 'install_revision_staging_adapter' });
  }
  if (action === 'rollback' || action === 'card-image') {
    return sendJson(res, 409, { ok: false, error: WRITE_PENDING, next: 'install_revision_staging_adapter' });
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
          : /revision_staging_not_installed|schema_not_installed/.test(message) ? 409
            : /invalid|missing|crosses|duplicate|mismatch|not_active|failure_reasons|validation_failed|tier/.test(message) ? 400 : 500;
    return sendJson(res, status, { ok: false, error: message });
  }
}
