const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const SHA256 = /^[0-9a-f]{64}$/iu;
const MASTER_SKU_ID = /^MASTER-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

const rows = value => Array.isArray(value) ? value : [];
const text = value => String(value || '').trim();
const sorted = values => [...values].sort((left, right) => left.localeCompare(right));

export function validateGroupingSnapshotShape(input, options = {}) {
  const requireAllLocked = options.requireAllLocked !== false;
  const snapshot = input?.snapshot;
  if (!snapshot || snapshot.schema !== 'promo-grouping-snapshot-v2') throw new Error('grouping_snapshot_schema_invalid');
  if (!UUID.test(text(snapshot.snapshotId))) throw new Error('grouping_snapshot_id_invalid');
  if (!UUID.test(text(snapshot.datasetId))) throw new Error('grouping_snapshot_dataset_id_invalid');
  if (!SHA256.test(text(snapshot.datasetFingerprint)) || !SHA256.test(text(snapshot.cardIdsHash))) {
    throw new Error('grouping_snapshot_fingerprint_invalid');
  }
  if (!Number.isInteger(Number(snapshot.datasetRevision)) || Number(snapshot.datasetRevision) < 1) {
    throw new Error('grouping_snapshot_dataset_revision_invalid');
  }
  if (!Number.isInteger(Number(snapshot.revision)) || Number(snapshot.revision) < 0) {
    throw new Error('grouping_snapshot_revision_invalid');
  }
  const groups = rows(snapshot.groups);
  const assignments = rows(snapshot.assignments);
  if (!groups.length || groups.length > 300) throw new Error('invalid_group_count');
  if (!assignments.length || assignments.length > 2_000 || Number(snapshot.cardCount) !== assignments.length) {
    throw new Error('invalid_card_count');
  }
  const groupIds = groups.map(group => text(group.groupId));
  if (groupIds.some(id => !id || id.length > 160) || new Set(groupIds).size !== groupIds.length) {
    throw new Error('group_id_invalid_or_duplicate');
  }
  for (const group of groups) {
    if (!MASTER_SKU_ID.test(text(group.skuId))) throw new Error('group_master_product_required');
    if (typeof group.confirmed !== 'boolean' || typeof group.locked !== 'boolean') throw new Error('group_lock_state_invalid');
    if (requireAllLocked && (group.confirmed !== true || group.locked !== true)) throw new Error('group_not_confirmed_or_locked');
  }
  const cardIds = assignments.map(item => text(item.cardId));
  if (cardIds.some(id => !UUID.test(id)) || new Set(cardIds).size !== cardIds.length) {
    throw new Error('card_id_invalid_or_duplicate');
  }
  for (const assignment of assignments) {
    const group = groups.find(item => item.groupId === assignment.groupId);
    if (!group || group.skuId !== assignment.skuId) throw new Error(`card_group_reference_invalid:${assignment.cardId}`);
    if (!text(assignment.promotionFamilyId)) throw new Error(`card_promotion_pending:${assignment.cardId}`);
    const tierKeys = rows(assignment.promotionTierKeys).map(text);
    if (!tierKeys.length || tierKeys.some(key => !key) || new Set(tierKeys).size !== tierKeys.length) {
      throw new Error(`card_tier_assignment_invalid:${assignment.cardId}`);
    }
  }
  return structuredClone(snapshot);
}

export function validateGroupingSnapshotAgainstManifest(input, manifest) {
  const snapshot = validateGroupingSnapshotShape(input);
  if (!manifest || snapshot.datasetId !== manifest.datasetId) throw new Error('dataset_not_found');
  if (snapshot.monthKey !== manifest.monthKey) throw new Error('snapshot_month_mismatch');
  if (snapshot.datasetFingerprint !== manifest.fingerprint) throw new Error('snapshot_fingerprint_mismatch');
  if (snapshot.datasetRevision !== manifest.revision) throw new Error('snapshot_dataset_revision_mismatch');
  if (snapshot.cardIdsHash !== manifest.cardIdsHash) throw new Error('snapshot_card_hash_mismatch');
  const expected = sorted(rows(manifest.cardIds).map(text));
  const actual = sorted(snapshot.assignments.map(item => text(item.cardId)));
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) {
    throw new Error(`snapshot_card_set_mismatch:${actual.length}/${expected.length}`);
  }
  return snapshot;
}

export class InMemoryGroupingSnapshotStore {
  #snapshots = new Map();

  save(input, manifest, now = new Date().toISOString()) {
    const validated = validateGroupingSnapshotAgainstManifest(input, manifest);
    const current = this.#snapshots.get(validated.datasetId) || null;
    if (current && current.revision !== validated.revision) throw new Error('snapshot_revision_conflict');
    if (!current && validated.revision !== 0) throw new Error('snapshot_revision_conflict');
    if (current) {
      for (const currentGroup of current.groups.filter(group => group.locked)) {
        const nextGroup = validated.groups.find(group => group.groupId === currentGroup.groupId);
        const currentAssignments = current.assignments
          .filter(item => item.groupId === currentGroup.groupId)
          .sort((left, right) => left.cardId.localeCompare(right.cardId));
        const nextAssignments = validated.assignments
          .filter(item => item.groupId === currentGroup.groupId)
          .sort((left, right) => left.cardId.localeCompare(right.cardId));
        if (!nextGroup
          || nextGroup.skuId !== currentGroup.skuId
          || JSON.stringify(currentAssignments) !== JSON.stringify(nextAssignments)) {
          throw new Error(`locked_group_changed:${currentGroup.groupId}`);
        }
      }
    }
    const saved = {
      ...validated,
      revision: (current?.revision || 0) + 1,
      savedAt: now,
    };
    this.#snapshots.set(saved.datasetId, structuredClone(saved));
    return structuredClone(saved);
  }

  load(datasetId) {
    const saved = this.#snapshots.get(datasetId);
    return saved ? structuredClone(saved) : null;
  }

  unlock(datasetId, groupId, expectedRevision, now = new Date().toISOString()) {
    const current = this.#snapshots.get(datasetId);
    if (!current || current.revision !== expectedRevision) throw new Error('snapshot_revision_conflict');
    const group = current.groups.find(item => item.groupId === groupId);
    if (!group) throw new Error('snapshot_group_not_found');
    const unlocked = {
      ...current,
      revision: current.revision + 1,
      savedAt: now,
      groups: current.groups.map(item => item.groupId === groupId
        ? { ...item, confirmed: false, locked: false }
        : item),
    };
    this.#snapshots.set(datasetId, structuredClone(unlocked));
    return structuredClone(unlocked);
  }

  size() {
    return this.#snapshots.size;
  }
}
