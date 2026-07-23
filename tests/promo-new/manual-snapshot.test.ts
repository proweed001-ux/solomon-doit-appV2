import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertSnapshotMatchesDataset,
  createManualGroupingSnapshot,
  hydrateManualGroupingSnapshot,
} from '../../src/promo-new/domain/manual-snapshot';
import type { PromoDataset } from '../../src/promo-new/domain/types';
import { createDemoDataset } from '../../src/promo-new/shared/demo-data';

const MONTH = 'PROMO-2026-07';
const DATASET_ID = '10000000-0000-4000-8000-000000000001';
const SNAPSHOT_ID = '20000000-0000-4000-8000-000000000001';
const SKU_ID = 'MASTER-30000000-0000-4000-8000-000000000001';
const CARD_ONE = '40000000-0000-4000-8000-000000000001';
const CARD_TWO = '40000000-0000-4000-8000-000000000002';
const FINGERPRINT = 'a'.repeat(64);
const CARD_HASH = 'b'.repeat(64);

function fixture(): PromoDataset {
  const demo = createDemoDataset('draft');
  const sku = { ...demo.skus[0], id: SKU_ID, code: 'MASTER-TEST', status: 'active' as const };
  const price = { ...demo.prices[0], skuId: SKU_ID };
  const familyOne = { ...demo.promotionFamilies[0], id: 'family:one', name: 'โปรใบแรก' };
  const familyTwo = { ...demo.promotionFamilies[1], id: 'family:two', name: 'โปรใบที่สอง' };
  const sourceCards = [demo.cards[0], demo.cards[2]];
  const cards = sourceCards.map((card, index) => {
    const family = index === 0 ? familyOne : familyTwo;
    return {
      ...card,
      id: index === 0 ? CARD_ONE : CARD_TWO,
      monthKey: MONTH,
      page: 1,
      sequence: index === 0 ? 1 : 4,
      classId: 'HFSS',
      skuId: SKU_ID,
      productGroupId: 'group:test',
      promotionFamilyId: family.id,
      promotionTiers: family.tiersByClass.HFSS,
      price,
      failureReasons: [],
      status: 'ready' as const,
    };
  });
  return {
    ...demo,
    version: { ...demo.version, monthKey: MONTH },
    sourceDataset: {
      datasetId: DATASET_ID,
      fingerprint: FINGERPRINT,
      revision: 3,
      cardIdsHash: CARD_HASH,
      persisted: true,
      savedAt: '2026-07-23T00:00:00.000Z',
    },
    skus: [sku],
    prices: [price],
    cards,
    productGroups: [{
      ...demo.productGroups[0],
      id: 'group:test',
      monthKey: MONTH,
      skuId: SKU_ID,
      sku,
      price,
      cardIds: [CARD_ONE, CARD_TWO],
      classIds: ['HFSS'],
      promotionFamilyId: null,
      manualConfirmed: true,
      manualLocked: true,
      failureReasons: [],
      status: 'ready',
    }],
    promotionFamilies: [familyOne, familyTwo],
  };
}

test('same Product Group supports two HFSS cards with independent promotions', () => {
  const dataset = fixture();
  assert.equal(dataset.cards[0].classId, 'HFSS');
  assert.equal(dataset.cards[1].classId, 'HFSS');
  assert.notEqual(dataset.cards[0].promotionFamilyId, dataset.cards[1].promotionFamilyId);
});

test('save, clear memory, and load restores every card promotion plus confirmed/locked state', () => {
  const original = fixture();
  const created = createManualGroupingSnapshot(
    original,
    { snapshotId: SNAPSHOT_ID, revision: 0 },
    '2026-07-23T01:00:00.000Z',
  );
  const saved = { ...created, revision: 1, savedAt: '2026-07-23T01:00:01.000Z' };

  const cleared: PromoDataset = {
    ...original,
    cards: original.cards.map(card => ({
      ...card,
      promotionFamilyId: null,
      promotionTiers: [],
      failureReasons: ['promotion_pending_review'],
      status: 'need_review',
    })),
    productGroups: original.productGroups.map(group => ({
      ...group,
      promotionFamilyId: null,
      manualConfirmed: false,
      manualLocked: false,
    })),
  };
  const restored = hydrateManualGroupingSnapshot(cleared, [], saved, original.skus);

  assertSnapshotMatchesDataset(restored.dataset, saved);
  assert.equal(restored.quarantine.length, 0);
  assert.deepEqual(
    restored.dataset.cards.map(card => ({
      id: card.id,
      groupId: card.productGroupId,
      family: card.promotionFamilyId,
      tiers: card.promotionTiers.map(tier => tier.sourceText),
    })),
    original.cards.map(card => ({
      id: card.id,
      groupId: card.productGroupId,
      family: card.promotionFamilyId,
      tiers: card.promotionTiers.map(tier => tier.sourceText),
    })),
  );
  assert.ok(restored.dataset.productGroups.every(group => group.manualConfirmed && group.manualLocked));
});

test('restore rejects a stale dataset fingerprint and never returns partial state', () => {
  const dataset = fixture();
  const snapshot = {
    ...createManualGroupingSnapshot(dataset, { snapshotId: SNAPSHOT_ID, revision: 0 }),
    revision: 1,
    datasetFingerprint: 'c'.repeat(64),
  };

  assert.throws(
    () => hydrateManualGroupingSnapshot(dataset, [], snapshot, dataset.skus),
    /grouping_snapshot_fingerprint_mismatch/u,
  );
  assert.ok(dataset.productGroups.every(group => group.manualConfirmed && group.manualLocked));
});

test('restore rejects a missing Card ID as a whole snapshot', () => {
  const dataset = fixture();
  const snapshot = {
    ...createManualGroupingSnapshot(dataset, { snapshotId: SNAPSHOT_ID, revision: 0 }),
    revision: 1,
    assignments: createManualGroupingSnapshot(dataset).assignments.slice(0, 1),
    cardCount: 1,
  };

  assert.throws(
    () => hydrateManualGroupingSnapshot(dataset, [], snapshot, dataset.skus),
    /grouping_snapshot_card_mismatch/u,
  );
});
