import assert from 'node:assert/strict';
import test from 'node:test';
import {
  InMemoryGroupingSnapshotStore,
  validateGroupingSnapshotAgainstManifest,
} from '../../api/_promo-new/grouping-snapshot-contract.js';

const DATASET_ID = '10000000-0000-4000-8000-000000000001';
const OTHER_DATASET_ID = '10000000-0000-4000-8000-000000000002';
const SNAPSHOT_ID = '20000000-0000-4000-8000-000000000001';
const SKU_ID = 'MASTER-30000000-0000-4000-8000-000000000001';
const CARD_ONE = '40000000-0000-4000-8000-000000000001';
const CARD_TWO = '40000000-0000-4000-8000-000000000002';
const UNKNOWN_CARD = '40000000-0000-4000-8000-000000000099';
const FINGERPRINT = 'a'.repeat(64);
const CARD_HASH = 'b'.repeat(64);

const manifest = {
  datasetId: DATASET_ID,
  monthKey: 'PROMO-2026-07',
  fingerprint: FINGERPRINT,
  revision: 4,
  cardIdsHash: CARD_HASH,
  // Source card_no may be 1 and 4. Persistence is keyed by UUID, never list[card_no - 1].
  cardIds: [CARD_ONE, CARD_TWO],
  cardNumbers: [1, 4],
};

function snapshot() {
  return {
    snapshot: {
      schema: 'promo-grouping-snapshot-v2',
      snapshotId: SNAPSHOT_ID,
      monthKey: manifest.monthKey,
      datasetId: DATASET_ID,
      datasetFingerprint: FINGERPRINT,
      datasetRevision: 4,
      cardIdsHash: CARD_HASH,
      revision: 0,
      savedAt: '2026-07-23T00:00:00.000Z',
      groups: [{
        groupId: 'group:one',
        skuId: SKU_ID,
        confirmed: true,
        locked: true,
      }],
      assignments: [CARD_ONE, CARD_TWO].map((cardId, index) => ({
        cardId,
        groupId: 'group:one',
        skuId: SKU_ID,
        promotionFamilyId: index === 0 ? 'family:one' : 'family:two',
        promotionTierKeys: [index === 0 ? 'family:one:HFSS:1' : 'family:two:HFSS:2'],
      })),
      cardCount: 2,
    },
  };
}

test('non-contiguous card_no saves by stable UUID and preserves per-card promotions', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const saved = store.save(snapshot(), manifest);
  assert.equal(saved.revision, 1);
  assert.deepEqual(saved.assignments.map(item => item.cardId), [CARD_ONE, CARD_TWO]);
  assert.deepEqual(saved.assignments.map(item => item.promotionFamilyId), ['family:one', 'family:two']);
  assert.equal(store.size(), 1);
});

test('snapshot dataset ID from another month/dataset is rejected atomically', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.datasetId = OTHER_DATASET_ID;
  assert.throws(() => store.save(invalid, manifest), /dataset_not_found/u);
  assert.equal(store.size(), 0);
});

test('card UUID belonging to another dataset is rejected atomically', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.assignments[1].cardId = UNKNOWN_CARD;
  assert.throws(() => store.save(invalid, manifest), /snapshot_card_set_mismatch/u);
  assert.equal(store.size(), 0);
});

test('duplicate stable Card ID is rejected atomically', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.assignments[1].cardId = CARD_ONE;
  assert.throws(() => store.save(invalid, manifest), /card_id_invalid_or_duplicate/u);
  assert.equal(store.size(), 0);
});

test('unknown stable Card ID is rejected atomically', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.assignments[0].cardId = UNKNOWN_CARD;
  assert.throws(() => validateGroupingSnapshotAgainstManifest(invalid, manifest), /snapshot_card_set_mismatch/u);
  assert.equal(store.size(), 0);
});

test('missing Card ID is rejected atomically', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.assignments = invalid.snapshot.assignments.slice(0, 1);
  invalid.snapshot.cardCount = 1;
  assert.throws(() => store.save(invalid, manifest), /snapshot_card_set_mismatch/u);
  assert.equal(store.size(), 0);
});

test('extra Card ID is rejected atomically', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.assignments.push({
    ...invalid.snapshot.assignments[0],
    cardId: UNKNOWN_CARD,
  });
  invalid.snapshot.cardCount = 3;
  assert.throws(() => store.save(invalid, manifest), /snapshot_card_set_mismatch/u);
  assert.equal(store.size(), 0);
});

test('unconfirmed or unlocked non-empty group is rejected before any write', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const invalid = snapshot();
  invalid.snapshot.groups[0].locked = false;
  assert.throws(() => store.save(invalid, manifest), /group_not_confirmed_or_locked/u);
  assert.equal(store.size(), 0);
});

test('optimistic revision conflict preserves the previously saved snapshot', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const first = store.save(snapshot(), manifest);
  const stale = snapshot();
  stale.snapshot.assignments[0].promotionFamilyId = 'family:changed';
  assert.throws(() => store.save(stale, manifest), /snapshot_revision_conflict/u);
  assert.deepEqual(store.load(DATASET_ID), first);
  assert.equal(store.size(), 1);
});

test('server rejects changing a persisted locked group until central unlock succeeds', () => {
  const store = new InMemoryGroupingSnapshotStore();
  const first = store.save(snapshot(), manifest);
  const changedWhileLocked = { snapshot: structuredClone(first) };
  changedWhileLocked.snapshot.assignments[0].promotionFamilyId = 'family:changed';
  assert.throws(
    () => store.save(changedWhileLocked, manifest),
    /locked_group_changed:group:one/u,
  );
  assert.deepEqual(store.load(DATASET_ID), first);

  const unlocked = store.unlock(DATASET_ID, 'group:one', first.revision);
  assert.equal(unlocked.groups[0].confirmed, false);
  assert.equal(unlocked.groups[0].locked, false);
  const relocked = {
    snapshot: {
      ...structuredClone(unlocked),
      groups: unlocked.groups.map(group => ({ ...group, confirmed: true, locked: true })),
      assignments: unlocked.assignments.map((assignment, index) => index === 0
        ? { ...assignment, promotionFamilyId: 'family:changed' }
        : assignment),
    },
  };
  const saved = store.save(relocked, manifest);
  assert.equal(saved.revision, 3);
  assert.equal(saved.assignments[0].promotionFamilyId, 'family:changed');
});
