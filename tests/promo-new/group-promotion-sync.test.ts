import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPromotionFamily } from '../../src/promo-new/domain/grouping';
import { calculatePromotion } from '../../src/promo-new/domain/calculator';
import { createDemoDataset } from '../../src/promo-new/shared/demo-data';

test('one CSV Promotion Family syncs every card in a Product Group by its existing Class', () => {
  const dataset = createDemoDataset('draft');
  const sourceGroup = dataset.productGroups[3];
  assert.ok(sourceGroup);
  const family = dataset.promotionFamilies.find(item => item.id === sourceGroup.promotionFamilyId);
  assert.ok(family);

  const group = {
    ...sourceGroup,
    promotionFamilyId: null,
    manualConfirmed: false,
    manualLocked: false,
  };
  const resetCards = dataset.cards.map(card => group.cardIds.includes(card.id) ? {
    ...card,
    promotionFamilyId: null,
    promotionTiers: [],
    status: 'need_review' as const,
  } : card);

  const result = applyPromotionFamily(group, resetCards, family);
  const members = result.cards.filter(card => group.cardIds.includes(card.id));

  assert.equal(result.group.promotionFamilyId, family.id);
  assert.equal(result.blockedClasses.length, 0);
  assert.equal(members.length, group.cardIds.length);
  members.forEach(card => {
    assert.equal(card.promotionFamilyId, family.id);
    assert.deepEqual(card.promotionTiers, family.tiersByClass[card.classId!]);
    assert.equal(card.price.effectivePrice?.amount, group.price.effectivePrice?.amount);
  });
});

test('synced cards calculate from the selected Family tier for their own Class', () => {
  const dataset = createDemoDataset('draft');
  const sourceGroup = dataset.productGroups[3];
  assert.ok(sourceGroup);
  const family = dataset.promotionFamilies.find(item => item.id === sourceGroup.promotionFamilyId);
  assert.ok(family);
  const result = applyPromotionFamily({ ...sourceGroup, manualConfirmed: false, manualLocked: false }, dataset.cards, family);
  const hfss = result.cards.find(card => groupMember(sourceGroup.cardIds, card.id) && card.classId === 'HFSS');
  const hfsm = result.cards.find(card => groupMember(sourceGroup.cardIds, card.id) && card.classId === 'HFSM');
  assert.ok(hfss?.price.effectivePrice);
  assert.ok(hfsm?.price.effectivePrice);

  const smallShop = calculatePromotion(hfss.price.effectivePrice.amount, 6, hfss.promotionTiers);
  const mediumShop = calculatePromotion(hfsm.price.effectivePrice.amount, 6, hfsm.promotionTiers);

  assert.equal(smallShop.activeTier?.type, 'cash_discount');
  assert.equal(smallShop.grossAmount, 204);
  assert.equal(smallShop.cashDiscount, 20.4);
  assert.equal(smallShop.netAmount, 183.6);
  assert.equal(mediumShop.activeTier?.type, 'free_goods');
  assert.equal(mediumShop.grossAmount, 204);
  assert.equal(mediumShop.cashDiscount, 0);
  assert.equal(mediumShop.giftQuantity, 2);
  assert.equal(mediumShop.netAmount, 204);
});

function groupMember(cardIds: string[], cardId: string): boolean {
  return cardIds.includes(cardId);
}
