import type { ProductGroup, PromoCard, PromoDataset, PromotionFamily, PromotionTier, Sku, SkuPrice } from './types';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const finitePositive = (value: unknown): value is number => Number.isFinite(Number(value)) && Number(value) > 0;
const unique = (values: string[]): string[] => [...new Set(values)];

function skuCanUseModelInsteadOfSize(sku: Sku): boolean {
  const identity = sku.identity;
  if (!identity.variant) return false;
  if (identity.productType === 'มีดโกน' || identity.productType === 'แปรงสีฟัน') return true;
  if (identity.productType === 'สกินแคร์' || identity.productType === 'ผลิตภัณฑ์ปรับอากาศ') return true;
  return identity.productType === 'ปรับผ้านุ่ม' && identity.salesUnit === 'ถุง';
}

function tierSignature(tier: PromotionTier): string {
  return [
    tier.tierNo,
    tier.type,
    tier.minQuantity,
    tier.maxQuantity ?? '',
    tier.purchaseUnit,
    tier.discountPercent ?? '',
    tier.freeQuantity,
    tier.rewardUnit ?? '',
    tier.bundlePrice?.amount ?? '',
    tier.effectivePercent ?? '',
    tier.effectivePercentUsage ?? '',
  ].join('|');
}

function sameTierSet(left: PromotionTier[], right: PromotionTier[]): boolean {
  const normalize = (tiers: PromotionTier[]) => tiers.map(tierSignature).sort();
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

export function validateSku(sku: Sku): string[] {
  const errors: string[] = [];
  const identity = sku.identity;
  const sizeOptional = skuCanUseModelInsteadOfSize(sku);
  if (!sku.id.trim()) errors.push('sku_id_missing');
  if (!sku.code.trim()) errors.push('sku_code_missing');
  if (!sku.canonicalName.trim()) errors.push('sku_canonical_name_missing');
  if (!identity.brand.trim()) errors.push('brand_missing');
  if (!identity.productType.trim()) errors.push('product_type_missing');
  if (!sizeOptional && !finitePositive(identity.sizeValue)) errors.push('size_missing');
  if (!sizeOptional && !identity.sizeUnit.trim()) errors.push('size_unit_missing');
  if (!identity.salesUnit.trim()) errors.push('sales_unit_missing');
  if (!Number.isInteger(identity.packQuantity) || identity.packQuantity < 1) errors.push('pack_quantity_invalid');
  if (!sku.identityKey.trim()) errors.push('sku_identity_key_missing');
  if (sku.status !== 'active') errors.push('sku_not_active');
  if (sku.failureReasons.length) errors.push('sku_has_failure_reasons');
  return unique(errors);
}

export function validatePrice(price: SkuPrice): string[] {
  const errors: string[] = [];
  const effective = price.effectivePrice?.amount;
  if (!price.skuId.trim()) errors.push('price_sku_missing');
  if (!finitePositive(effective)) errors.push('effective_price_missing');
  if (price.centralOverridePrice && price.source !== 'central_override') errors.push('price_source_mismatch');
  if (price.source === 'central_override' && !price.centralOverridePrice) errors.push('central_override_missing');
  return unique(errors);
}

export function validateTier(tier: PromotionTier): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(tier.tierNo) || tier.tierNo < 1) errors.push('tier_number_invalid');
  if (!finitePositive(tier.minQuantity)) errors.push('tier_min_quantity_invalid');
  if (tier.maxQuantity != null && (!finitePositive(tier.maxQuantity) || tier.maxQuantity < tier.minQuantity)) errors.push('tier_range_invalid');
  if (!tier.purchaseUnit.trim()) errors.push('tier_purchase_unit_missing');
  if (tier.type === 'cash_discount' && (!finitePositive(tier.discountPercent) || Number(tier.discountPercent) > 100)) errors.push('discount_percent_invalid');
  if (tier.type === 'free_goods' && !finitePositive(tier.freeQuantity)) errors.push('free_quantity_invalid');
  if (tier.type === 'free_goods' && !String(tier.rewardUnit || '').trim()) errors.push('free_goods_reward_unit_missing');
  if (tier.type === 'free_goods' && tier.effectivePercentUsage !== 'display_only') errors.push('free_goods_effective_percent_must_be_display_only');
  if (tier.type === 'bundle_price' && !finitePositive(tier.bundlePrice?.amount)) errors.push('bundle_price_invalid');
  return unique(errors);
}

export function validateCard(card: PromoCard): string[] {
  const errors: string[] = [];
  if (!card.id.trim()) errors.push('card_id_missing');
  if (!card.monthKey.trim()) errors.push('month_missing');
  if (!Number.isInteger(card.page) || card.page < 1) errors.push('page_invalid');
  if (!Number.isInteger(card.sequence) || card.sequence < 1) errors.push('sequence_invalid');
  if (!card.classId) errors.push('class_missing');
  if (!card.imageUrl.trim()) errors.push('card_image_missing');
  if (!card.skuId) errors.push('sku_missing');
  if (!card.productGroupId) errors.push('product_group_missing');
  if (!card.promotionFamilyId) errors.push('promotion_family_missing');
  if (!card.promotionTiers.length) errors.push('promotion_tiers_missing');
  const tierNumbers = card.promotionTiers.map(tier => tier.tierNo);
  if (new Set(tierNumbers).size !== tierNumbers.length) errors.push('duplicate_tier_number');
  card.promotionTiers.forEach(tier => errors.push(...validateTier(tier)));
  errors.push(...validatePrice(card.price));
  if (card.price.skuId !== card.skuId) errors.push('card_price_sku_mismatch');
  if (card.failureReasons.length) errors.push('card_has_failure_reasons');
  return unique(errors);
}

export function validateGroup(group: ProductGroup, cards: PromoCard[]): string[] {
  const errors = [...validateSku(group.sku), ...validatePrice(group.price)];
  if (!group.id.trim()) errors.push('group_id_missing');
  if (group.sku.id !== group.skuId) errors.push('group_embedded_sku_mismatch');
  if (group.price.skuId !== group.skuId) errors.push('group_price_sku_mismatch');
  const listedIds = new Set(group.cardIds);
  if (listedIds.size !== group.cardIds.length) errors.push('group_duplicate_card_id');
  const members = cards.filter(card => listedIds.has(card.id));
  const reverseMembers = cards.filter(card => card.productGroupId === group.id);
  if (!members.length) errors.push('group_has_no_cards');
  if (members.length !== group.cardIds.length) errors.push('group_references_missing_card');
  if (reverseMembers.some(card => !listedIds.has(card.id))) errors.push('group_omits_assigned_card');
  if (members.some(card => card.productGroupId !== group.id)) errors.push('card_group_link_mismatch');
  if (members.some(card => card.skuId !== group.skuId)) errors.push('group_contains_different_sku');
  if (new Set(members.map(card => card.monthKey)).size !== 1 || members.some(card => card.monthKey !== group.monthKey)) errors.push('group_crosses_month');
  if (members.some(card => !card.classId)) errors.push('group_has_unknown_class');
  const memberClasses = members.map(card => card.classId as string);
  if (new Set(memberClasses).size !== members.length) errors.push('group_has_duplicate_class_card');
  if (JSON.stringify([...new Set(memberClasses)].sort()) !== JSON.stringify([...new Set(group.classIds)].sort())) errors.push('group_class_ids_mismatch');
  if (!group.promotionFamilyId) errors.push('promotion_family_missing');
  if (group.failureReasons.length) errors.push('group_has_failure_reasons');
  return unique(errors);
}

function validateFamily(family: PromotionFamily): string[] {
  const errors: string[] = [];
  if (!family.id.trim()) errors.push('family_id_missing');
  if (!family.familyKey.trim()) errors.push('family_key_missing');
  if (!family.name.trim()) errors.push('family_name_missing');
  if (!Object.keys(family.tiersByClass).length) errors.push('family_has_no_classes');
  if (family.failureReasons.length) errors.push('family_has_failure_reasons');
  Object.entries(family.tiersByClass).forEach(([classId, tiers]) => {
    if (!classId) errors.push('class_missing');
    if (!tiers.length) errors.push(`class:${classId}:tiers_missing`);
    tiers.forEach(tier => validateTier(tier).forEach(error => errors.push(`class:${classId}:${error}`)));
  });
  return unique(errors);
}

export function validateDataset(dataset: PromoDataset): ValidationResult {
  const errors: string[] = [];
  const warnings = [...dataset.warnings];
  const cardIds = dataset.cards.map(card => card.id);
  if (new Set(cardIds).size !== cardIds.length) errors.push('duplicate_card_id');
  const coordinates = dataset.cards.map(card => `${card.monthKey}|${card.page}|${card.sequence}`);
  if (new Set(coordinates).size !== coordinates.length) errors.push('duplicate_card_coordinate');

  const skuIds = dataset.skus.map(sku => sku.id);
  if (new Set(skuIds).size !== skuIds.length) errors.push('duplicate_sku_id');
  const activeIdentityKeys = dataset.skus.filter(sku => sku.status === 'active').map(sku => sku.identityKey);
  if (new Set(activeIdentityKeys).size !== activeIdentityKeys.length) errors.push('duplicate_active_sku_identity');
  const skuById = new Map(dataset.skus.map(sku => [sku.id, sku]));
  dataset.skus.forEach(sku => validateSku(sku).forEach(error => errors.push(`sku:${sku.id}:${error}`)));

  const pricesBySku = new Map<string, SkuPrice>();
  for (const price of dataset.prices) {
    if (pricesBySku.has(price.skuId)) errors.push(`price:${price.skuId}:duplicate_price`);
    pricesBySku.set(price.skuId, price);
    validatePrice(price).forEach(error => errors.push(`price:${price.skuId}:${error}`));
    if (!skuById.has(price.skuId)) errors.push(`price:${price.skuId}:sku_not_found`);
  }

  const groupIds = dataset.productGroups.map(group => group.id);
  if (new Set(groupIds).size !== groupIds.length) errors.push('duplicate_product_group_id');
  const groupSkuIds = dataset.productGroups.map(group => group.skuId);
  if (new Set(groupSkuIds).size !== groupSkuIds.length) errors.push('duplicate_product_group_for_sku');
  const groupById = new Map(dataset.productGroups.map(group => [group.id, group]));

  const familyIds = dataset.promotionFamilies.map(family => family.id);
  if (new Set(familyIds).size !== familyIds.length) errors.push('duplicate_promotion_family_id');
  const familyById = new Map(dataset.promotionFamilies.map(family => [family.id, family]));
  dataset.promotionFamilies.forEach(family => validateFamily(family).forEach(error => errors.push(`family:${family.id}:${error}`)));

  dataset.cards.forEach(card => {
    const cardErrors = validateCard(card);
    if (card.skuId && !skuById.has(card.skuId)) cardErrors.push('card_sku_not_found');
    const group = groupById.get(card.productGroupId || '');
    if (!group) cardErrors.push('card_group_not_found');
    else {
      if (!group.cardIds.includes(card.id)) cardErrors.push('card_not_listed_in_group');
      if (group.skuId !== card.skuId) cardErrors.push('card_group_sku_mismatch');
      if (group.promotionFamilyId !== card.promotionFamilyId) cardErrors.push('card_group_family_mismatch');
    }
    const family = familyById.get(card.promotionFamilyId || '');
    if (!family) cardErrors.push('card_family_not_found');
    else if (card.classId) {
      const expectedTiers = family.tiersByClass[card.classId] || [];
      if (!expectedTiers.length) cardErrors.push('card_family_class_missing');
      else if (!sameTierSet(card.promotionTiers, expectedTiers)) cardErrors.push('card_tiers_do_not_match_family');
    }
    cardErrors.forEach(error => errors.push(`card:${card.id}:${error}`));
  });

  dataset.productGroups.forEach(group => {
    validateGroup(group, dataset.cards).forEach(error => errors.push(`group:${group.id}:${error}`));
    if (!skuById.has(group.skuId)) errors.push(`group:${group.id}:sku_not_found`);
    const family = familyById.get(group.promotionFamilyId || '');
    if (!family) errors.push(`group:${group.id}:family_not_found`);
    else if (group.classIds.some(classId => !family.tiersByClass[classId]?.length)) errors.push(`group:${group.id}:family_class_coverage_incomplete`);
  });

  if (dataset.version.status === 'published' && errors.length) errors.push('published_dataset_contains_blockers');
  return { ok: errors.length === 0, errors: unique(errors), warnings: unique(warnings) };
}

export function assertReadyForPublish(dataset: PromoDataset): ValidationResult {
  const result = validateDataset(dataset);
  if (dataset.productGroups.some(group => group.status !== 'ready')) result.errors.push('not_all_product_groups_ready');
  if (dataset.cards.some(card => card.status !== 'ready')) result.errors.push('not_all_cards_ready');
  result.errors = unique(result.errors);
  result.ok = result.errors.length === 0;
  return result;
}
