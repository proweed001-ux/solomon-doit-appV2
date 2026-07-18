import { createHash } from 'node:crypto';

const MONTH_CODES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const LEGACY_TO_NEW_CLASS = {
  HFSS: 'HFSS',
  HFSM: 'HFSM',
  HFSL: 'HFSL',
  HFSXL: 'HFSXL',
  HFSWSS: 'HFSWS-S',
  HFSWSL: 'HFSWS-L',
};

const NEW_TO_LEGACY_CLASS = Object.fromEntries(
  Object.entries(LEGACY_TO_NEW_CLASS).map(([legacy, modern]) => [modern, legacy]),
);

const asArray = value => Array.isArray(value) ? value : [];
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const positive = value => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;

function normalizedKey(value) {
  return clean(value).toLowerCase().normalize('NFKC').replace(/[^a-z0-9ก-๙]+/gu, '');
}

function stableUuid(value) {
  const hex = createHash('sha256').update(String(value)).digest('hex').slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ((Number.parseInt(hex[16], 16) & 3) | 8).toString(16);
  const joined = hex.join('');
  return `${joined.slice(0, 8)}-${joined.slice(8, 12)}-${joined.slice(12, 16)}-${joined.slice(16, 20)}-${joined.slice(20)}`;
}

export function toLegacyClassId(value) {
  const upper = clean(value).toUpperCase();
  return NEW_TO_LEGACY_CLASS[upper] || (Object.hasOwn(LEGACY_TO_NEW_CLASS, upper) ? upper : null);
}

export function toModernClassId(value) {
  return LEGACY_TO_NEW_CLASS[clean(value).toUpperCase()] || null;
}

export function toLegacyMonthId(value) {
  const source = clean(value).toUpperCase();
  if (/^[A-Z]{3}\d{2}$/u.test(source)) return source;
  const match = source.match(/^(?:PROMO-)?(\d{4})-(\d{2})$/u);
  if (!match) return null;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return `${MONTH_CODES[month - 1]}${match[1].slice(-2)}`;
}

export function toModernMonthKey(month) {
  const yearMonth = clean(month?.year_month);
  if (/^\d{4}-\d{2}$/u.test(yearMonth)) return `PROMO-${yearMonth}`;
  const id = clean(month?.id).toUpperCase();
  const match = id.match(/^([A-Z]{3})(\d{2})$/u);
  if (!match) return id ? `PROMO-${id}` : 'PROMO-UNKNOWN';
  const monthNumber = MONTH_CODES.indexOf(match[1]) + 1;
  if (!monthNumber) return `PROMO-${id}`;
  return `PROMO-20${match[2]}-${String(monthNumber).padStart(2, '0')}`;
}

function extractIdentity(name, unitLabel) {
  const text = clean(name);
  const sizeMatch = text.match(/(\d+(?:\.\d+)?)\s*(ML|มล\.?|G|กรัม|KG|กก\.?|ชิ้น|ขวด|ซอง|แพ็ค)/iu);
  const brand = text.split(/\s+/u)[0] || '';
  return {
    brand,
    productType: text,
    variant: null,
    sizeValue: sizeMatch ? Number(sizeMatch[1]) : 0,
    sizeUnit: sizeMatch ? sizeMatch[2].toUpperCase().replace('มล.', 'ML').replace('มล', 'ML').replace('กรัม', 'G') : '',
    salesUnit: clean(unitLabel) || 'ชิ้น',
    packQuantity: 1,
  };
}

function skuFromMaster(master, fallbackName, fallbackUnit) {
  const masterId = clean(master?.master_product_id);
  const canonicalName = clean(master?.canonical_name) || clean(fallbackName) || 'ไม่ทราบสินค้า';
  const identityKey = clean(master?.normalized_key) || normalizedKey(canonicalName) || stableUuid(canonicalName);
  const id = masterId ? `MASTER-${masterId}` : `LEGACY-SKU-${stableUuid(identityKey)}`;
  return {
    id,
    code: masterId ? `PM-${masterId.replace(/-/g, '').slice(0, 10).toUpperCase()}` : `LEGACY-${stableUuid(identityKey).slice(0, 8).toUpperCase()}`,
    canonicalName,
    identityKey,
    identity: extractIdentity(canonicalName, master?.unit_label || fallbackUnit),
    status: masterId && master?.status !== 'inactive' ? 'active' : 'candidate',
    evidence: masterId ? ['legacy:promo_product_master'] : ['legacy:synthetic_from_group'],
    failureReasons: masterId ? [] : ['legacy_master_product_missing'],
  };
}

function priceForSku(skuId, amount, sourceReference, updatedAt) {
  const money = positive(amount) == null ? null : { amount: Number(amount), currency: 'THB' };
  return {
    skuId,
    pdfSourcePrice: null,
    centralOverridePrice: money,
    effectivePrice: money,
    source: money ? 'central_override' : 'missing',
    sourceReference: sourceReference || null,
    updatedAt: updatedAt || null,
  };
}

function effectivePercentFromNote(note) {
  const match = clean(note).match(/effective_percent\s*=\s*(\d+(?:\.\d+)?)/iu);
  return match ? Number(match[1]) : null;
}

function tierFromLegacy(row) {
  const freeQuantity = Number(row.free_qty || 0);
  const minQuantity = positive(row.min_qty) || 1;
  const discountPercent = freeQuantity > 0 ? null : positive(row.discount_percent);
  return {
    tierNo: Number(row.tier_no || 1),
    type: freeQuantity > 0 ? 'free_goods' : 'cash_discount',
    minQuantity,
    maxQuantity: row.max_qty == null ? null : Number(row.max_qty),
    purchaseUnit: clean(row.unit) || 'ชิ้น',
    discountPercent,
    freeQuantity,
    rewardUnit: freeQuantity > 0 ? (clean(row.unit) || 'ชิ้น') : null,
    bundlePrice: null,
    effectivePercent: freeQuantity > 0 ? effectivePercentFromNote(row.note) : discountPercent,
    effectivePercentUsage: freeQuantity > 0 ? 'display_only' : null,
    sourceText: clean(row.min_qty_text) || (freeQuantity > 0
      ? `ซื้อ ${minQuantity} ${clean(row.unit) || 'ชิ้น'} ฟรี ${freeQuantity} ${clean(row.unit) || 'ชิ้น'}`
      : `ซื้อ ${minQuantity} ${clean(row.unit) || 'ชิ้น'} ลด ${discountPercent || 0}%`),
  };
}

function groupStatus(groupCards, price, family, sku) {
  const classIds = groupCards.map(card => toModernClassId(card.class_id)).filter(Boolean);
  const duplicateClass = new Set(classIds).size !== classIds.length;
  if (duplicateClass || !price.effectivePrice || family.failureReasons.length || sku.status !== 'active') return 'blocked';
  return groupCards.every(card => card.status === 'ready') ? 'ready' : 'need_review';
}

export function buildLegacyPromoDataset({
  month,
  cards,
  tiers,
  groups,
  masters,
  masterPrices,
}) {
  if (!month?.id) return null;
  const monthKey = toModernMonthKey(month);
  const cardRows = asArray(cards).filter(row => row && row.status !== 'inactive');
  const tierRows = asArray(tiers);
  const groupRows = asArray(groups);
  const masterRows = asArray(masters);
  const masterPriceRows = asArray(masterPrices);

  const tiersByCard = new Map();
  for (const row of tierRows) {
    const list = tiersByCard.get(row.card_id) || [];
    list.push(tierFromLegacy(row));
    tiersByCard.set(row.card_id, list);
  }
  for (const list of tiersByCard.values()) list.sort((left, right) => left.tierNo - right.tierNo);

  const masterById = new Map(masterRows.map(row => [row.master_product_id, row]));
  const masterPriceById = new Map(masterPriceRows.map(row => [row.master_product_id, row]));
  const groupById = new Map(groupRows.map(row => [row.group_id, row]));

  const buckets = new Map();
  for (const card of cardRows) {
    const groupId = clean(card.group_id) || `UNLINKED-${card.card_id}`;
    const bucket = buckets.get(groupId) || [];
    bucket.push(card);
    buckets.set(groupId, bucket);
  }

  const skus = [];
  const prices = [];
  const productGroups = [];
  const promotionFamilies = [];
  const promoCards = [];
  const warnings = ['compat:legacy_promo_schema', 'compat:legacy_month_is_single_revision'];
  const seenSku = new Set();

  for (const [groupId, memberCards] of buckets.entries()) {
    const group = groupById.get(groupId) || null;
    const masterId = clean(group?.master_product_id || memberCards[0]?.master_product_id);
    const master = masterById.get(masterId) || null;
    const fallbackName = group?.canonical_name || memberCards[0]?.master_product_name || memberCards[0]?.product_group_name || memberCards[0]?.promo_title;
    const fallbackUnit = memberCards[0]?.unit_label;
    const sku = skuFromMaster(master, fallbackName, fallbackUnit);
    if (!seenSku.has(sku.id)) {
      skus.push(sku);
      seenSku.add(sku.id);
    }

    const groupAmounts = memberCards.map(row => positive(row.base_unit_price)).filter(value => value != null);
    const masterPrice = masterPriceById.get(masterId);
    const amount = positive(groupAmounts[0]) || positive(masterPrice?.base_unit_price);
    const price = priceForSku(sku.id, amount, masterPrice ? 'promo_product_master_prices' : 'promo_cards_with_functions', masterPrice?.updated_at || group?.updated_at || month.updated_at);
    if (!prices.some(item => item.skuId === price.skuId)) prices.push(price);
    if (new Set(groupAmounts.map(value => Number(value).toFixed(2))).size > 1) warnings.push(`group:${groupId}:legacy_price_conflict`);

    const tiersByClass = {};
    const familyFailures = [];
    for (const card of memberCards) {
      const classId = toModernClassId(card.class_id);
      if (!classId) {
        familyFailures.push(`unknown_class:${card.class_id}`);
        continue;
      }
      if (tiersByClass[classId]) familyFailures.push(`duplicate_class:${classId}`);
      tiersByClass[classId] = tiersByCard.get(card.card_id) || [];
      if (!tiersByClass[classId].length) familyFailures.push(`tier_missing:${classId}`);
    }
    const familyId = `LEGACY-FAMILY-${stableUuid(`${month.id}|${groupId}`)}`;
    const family = {
      id: familyId,
      familyKey: `legacy:${month.id}:${groupId}`,
      name: clean(group?.canonical_name || fallbackName) || groupId,
      scopeText: clean(group?.canonical_name || fallbackName) || groupId,
      sourceRows: [],
      tiersByClass,
      failureReasons: [...new Set(familyFailures)],
    };
    promotionFamilies.push(family);

    const groupCards = [];
    for (const card of memberCards) {
      const classId = toModernClassId(card.class_id);
      const cardTiers = tiersByCard.get(card.card_id) || [];
      const failures = [];
      if (!classId) failures.push(`unknown_class:${card.class_id}`);
      if (!cardTiers.length) failures.push('promotion_tiers_missing');
      if (!price.effectivePrice) failures.push('effective_price_missing');
      if (!group) failures.push('product_group_missing');
      if (sku.status !== 'active') failures.push('product_master_missing');
      const ready = card.status === 'ready' && !failures.length;
      const mapped = {
        id: card.card_id,
        monthKey,
        page: Number(card.page_no || 0),
        sequence: Number(card.card_no || card.sort_order || 0),
        classId,
        imageUrl: card.image_url || null,
        skuId: sku.id,
        productGroupId: groupId,
        promotionFamilyId: familyId,
        promotionTiers: cardTiers,
        price,
        status: ready ? 'ready' : 'need_review',
        evidence: {
          rawText: clean(card.raw_text),
          productText: clean(card.promo_title || fallbackName),
          pageClassText: clean(card.class_id),
          confidence: Number(card.function_confidence || card.product_group_match_score || 0),
          method: card.status === 'ready' ? 'manual' : 'none',
          cropBounds: null,
        },
        failureReasons: failures,
      };
      promoCards.push(mapped);
      groupCards.push(mapped);
    }

    const status = groupStatus(memberCards, price, family, sku);
    productGroups.push({
      id: groupId,
      monthKey,
      skuId: sku.id,
      sku,
      cardIds: groupCards.map(card => card.id),
      classIds: groupCards.map(card => card.classId).filter(Boolean),
      promotionFamilyId: familyId,
      price,
      status,
      failureReasons: [
        ...(group ? [] : ['legacy_product_group_row_missing']),
        ...family.failureReasons,
        ...(price.effectivePrice ? [] : ['effective_price_missing']),
        ...(sku.status === 'active' ? [] : ['product_master_missing']),
      ],
    });
  }

  const publishedAt = month.published_at || month.updated_at || month.created_at || new Date(0).toISOString();
  return {
    schema: 'promo-system-rebuild-v1',
    version: {
      id: stableUuid(`legacy-published|${month.id}|${publishedAt}`),
      monthKey,
      revision: 1,
      status: month.status === 'published' ? 'published' : 'draft',
      previousVersionId: null,
      createdAt: month.created_at || publishedAt,
      createdBy: null,
      publishedAt: month.status === 'published' ? publishedAt : null,
      source: {
        pdfName: month.source_pdf || null,
        workbookName: month.source_price_file || null,
        pdfHash: null,
        workbookHash: null,
      },
    },
    skus,
    prices,
    cards: promoCards.sort((left, right) => left.page - right.page || left.sequence - right.sequence),
    productGroups,
    promotionFamilies,
    warnings: [...new Set(warnings)],
  };
}

export function buildLegacyMasterData(masters, masterPrices) {
  const priceByMaster = new Map(asArray(masterPrices).map(row => [row.master_product_id, row]));
  const skus = [];
  const prices = [];
  for (const master of asArray(masters)) {
    if (master.status === 'inactive') continue;
    const sku = skuFromMaster(master, master.canonical_name, master.unit_label);
    skus.push(sku);
    const row = priceByMaster.get(master.master_product_id);
    const amount = positive(row?.base_unit_price);
    if (amount != null) {
      prices.push({
        skuIdentityKey: sku.identityKey,
        skuId: sku.id,
        amount,
        currency: 'THB',
        sourceReference: row.source_month || 'promo_product_master_prices',
        updatedAt: row.updated_at || null,
      });
    }
  }
  return { skus, prices };
}
