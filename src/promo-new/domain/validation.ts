import type { ProductGroup, PromoCard, PromoDataset, PromotionTier, Sku, SkuPrice } from './types';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const finitePositive = (value: unknown): value is number => Number.isFinite(Number(value)) && Number(value) > 0;

export function validateSku(sku: Sku): string[] {
  const errors: string[] = [];
  const identity = sku.identity;
  if (!sku.code.trim()) errors.push('sku_code_missing');
  if (!identity.brand.trim()) errors.push('brand_missing');
  if (!identity.productType.trim()) errors.push('product_type_missing');
  if (!finitePositive(identity.sizeValue)) errors.push('size_missing');
  if (!identity.sizeUnit.trim()) errors.push('size_unit_missing');
  if (!identity.salesUnit.trim()) errors.push('sales_unit_missing');
  if (!Number.isInteger(identity.packQuantity) || identity.packQuantity < 1) errors.push('pack_quantity_invalid');
  if (!sku.identityKey.trim()) errors.push('sku_identity_key_missing');
  return errors;
}

export function validatePrice(price: SkuPrice): string[] {
  const effective = price.effectivePrice?.amount;
  if (!finitePositive(effective)) return ['effective_price_missing'];
  if (price.centralOverridePrice && price.source !== 'central_override') return ['price_source_mismatch'];
  return [];
}

export function validateTier(tier: PromotionTier): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(tier.tierNo) || tier.tierNo < 1) errors.push('tier_number_invalid');
  if (!finitePositive(tier.minQuantity)) errors.push('tier_min_quantity_invalid');
  if (tier.maxQuantity != null && tier.maxQuantity < tier.minQuantity) errors.push('tier_range_invalid');
  if (tier.type === 'cash_discount' && (!finitePositive(tier.discountPercent) || Number(tier.discountPercent) > 100)) errors.push('discount_percent_invalid');
  if (tier.type === 'free_goods' && !finitePositive(tier.freeQuantity)) errors.push('free_quantity_invalid');
  if (tier.type === 'free_goods' && tier.effectivePercentUsage !== 'display_only') errors.push('free_goods_effective_percent_must_be_display_only');
  return errors;
}

export function validateCard(card: PromoCard): string[] {
  const errors: string[] = [];
  if (!card.id.trim()) errors.push('card_id_missing');
  if (!card.monthKey.trim()) errors.push('month_missing');
  if (!Number.isInteger(card.page) || card.page < 1) errors.push('page_invalid');
  if (!Number.isInteger(card.sequence) || card.sequence < 1) errors.push('sequence_invalid');
  if (!card.classId) errors.push('class_missing');
  if (!card.skuId) errors.push('sku_missing');
  if (!card.productGroupId) errors.push('product_group_missing');
  if (!card.promotionFamilyId) errors.push('promotion_family_missing');
  if (!card.promotionTiers.length) errors.push('promotion_tiers_missing');
  card.promotionTiers.forEach(tier => errors.push(...validateTier(tier)));
  errors.push(...validatePrice(card.price));
  return [...new Set(errors)];
}

export function validateGroup(group: ProductGroup, cards: PromoCard[]): string[] {
  const errors = [...validateSku(group.sku), ...validatePrice(group.price)];
  const members = cards.filter(card => group.cardIds.includes(card.id));
  if (!members.length) errors.push('group_has_no_cards');
  if (members.some(card => card.skuId !== group.skuId)) errors.push('group_contains_different_sku');
  if (new Set(members.map(card => card.monthKey)).size !== 1 || members.some(card => card.monthKey !== group.monthKey)) errors.push('group_crosses_month');
  if (members.some(card => !card.classId)) errors.push('group_has_unknown_class');
  if (new Set(members.map(card => card.classId)).size !== members.length) errors.push('group_has_duplicate_class_card');
  if (!group.promotionFamilyId) errors.push('promotion_family_missing');
  return [...new Set(errors)];
}

export function validateDataset(dataset: PromoDataset): ValidationResult {
  const errors: string[] = [];
  const warnings = [...dataset.warnings];
  const cardIds = dataset.cards.map(card => card.id);
  if (new Set(cardIds).size !== cardIds.length) errors.push('duplicate_card_id');
  const coordinates = dataset.cards.map(card => `${card.monthKey}|${card.page}|${card.sequence}`);
  if (new Set(coordinates).size !== coordinates.length) errors.push('duplicate_card_coordinate');
  const skuIds = new Set(dataset.skus.map(sku => sku.id));
  dataset.cards.forEach(card => {
    const cardErrors = validateCard(card);
    if (card.skuId && !skuIds.has(card.skuId)) cardErrors.push('card_sku_not_found');
    cardErrors.forEach(error => errors.push(`card:${card.id}:${error}`));
  });
  dataset.productGroups.forEach(group => validateGroup(group, dataset.cards).forEach(error => errors.push(`group:${group.id}:${error}`)));
  dataset.promotionFamilies.forEach(family => {
    Object.entries(family.tiersByClass).forEach(([classId, tiers]) => {
      if (!classId) errors.push(`family:${family.id}:class_missing`);
      tiers.forEach(tier => validateTier(tier).forEach(error => errors.push(`family:${family.id}:${classId}:${error}`)));
    });
  });
  if (dataset.version.status === 'published' && errors.length) errors.push('published_dataset_contains_blockers');
  return { ok: errors.length === 0, errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

export function assertReadyForPublish(dataset: PromoDataset): ValidationResult {
  const result = validateDataset(dataset);
  if (dataset.productGroups.some(group => group.status !== 'ready')) result.errors.push('not_all_product_groups_ready');
  if (dataset.cards.some(card => card.status !== 'ready')) result.errors.push('not_all_cards_ready');
  result.errors = [...new Set(result.errors)];
  result.ok = result.errors.length === 0;
  return result;
}
