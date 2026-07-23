import type { ImportedCardCandidate } from '../import/pdf-importer';
import { applyPromotionFamilyToCard } from './grouping';
import { assignCardsManually, unassignCardsManually } from './manual-grouping';
import { ensureSkuInDataset } from './manual-product';
import type { PromoDataset, PromotionTier, Sku } from './types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const SHA256 = /^[0-9a-f]{64}$/iu;

export interface PromoGroupingSnapshotGroup {
  groupId: string;
  skuId: string;
  confirmed: boolean;
  locked: boolean;
}

export interface PromoGroupingCardAssignment {
  cardId: string;
  groupId: string;
  skuId: string;
  promotionFamilyId: string;
  promotionTierKeys: string[];
}

export interface PromoGroupingSnapshot {
  schema: 'promo-grouping-snapshot-v2';
  snapshotId: string;
  monthKey: string;
  datasetId: string;
  datasetFingerprint: string;
  datasetRevision: number;
  cardIdsHash: string;
  revision: number;
  savedAt: string;
  groups: PromoGroupingSnapshotGroup[];
  assignments: PromoGroupingCardAssignment[];
  cardCount: number;
}

function tierKey(familyId: string, classId: string, tier: PromotionTier): string {
  return `${familyId}:${classId}:${tier.id || tier.tierNo}`;
}

function sorted(values: string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function sourceIdentity(dataset: PromoDataset) {
  const identity = dataset.sourceDataset;
  if (!identity?.persisted || !UUID.test(identity.datasetId)) throw new Error('source_dataset_not_persisted');
  if (!SHA256.test(identity.fingerprint) || !SHA256.test(identity.cardIdsHash)) throw new Error('source_dataset_fingerprint_invalid');
  if (!Number.isInteger(identity.revision) || identity.revision < 1) throw new Error('source_dataset_revision_invalid');
  return identity;
}

export function createManualGroupingSnapshot(
  dataset: PromoDataset,
  previous: Pick<PromoGroupingSnapshot, 'snapshotId' | 'revision'> | null = null,
  now = new Date().toISOString(),
): PromoGroupingSnapshot {
  const identity = sourceIdentity(dataset);
  const nonEmptyGroups = dataset.productGroups.filter(group => group.cardIds.length > 0);
  const unconfirmed = nonEmptyGroups.find(group => group.manualConfirmed !== true || group.manualLocked !== true);
  if (unconfirmed) throw new Error(`group_not_confirmed_or_locked:${unconfirmed.id}`);
  const notMaster = nonEmptyGroups.find(group => !/^MASTER-[0-9a-f-]{36}$/iu.test(group.skuId));
  if (notMaster) throw new Error(`group_master_product_required:${notMaster.id}`);
  const pendingPromotion = dataset.cards.find(card => !card.promotionFamilyId || !card.promotionTiers.length);
  if (pendingPromotion) throw new Error(`card_promotion_pending:${pendingPromotion.id}`);
  const duplicateCard = dataset.cards.find((card, index) => dataset.cards.findIndex(item => item.id === card.id) !== index);
  if (duplicateCard) throw new Error(`duplicate_card_id:${duplicateCard.id}`);
  const nonUuidCard = dataset.cards.find(card => !UUID.test(card.id));
  if (nonUuidCard) throw new Error(`database_card_uuid_required:${nonUuidCard.id}`);

  const groups = nonEmptyGroups.map(group => ({
    groupId: group.id,
    skuId: group.skuId,
    confirmed: true,
    locked: true,
  }));
  const assignments = dataset.cards.map(card => ({
    cardId: card.id,
    groupId: String(card.productGroupId || ''),
    skuId: String(card.skuId || ''),
    promotionFamilyId: String(card.promotionFamilyId || ''),
    promotionTierKeys: sorted(card.promotionTiers.map(tier => tierKey(card.promotionFamilyId!, card.classId!, tier))),
  }));
  if (assignments.some(item => !groups.some(group => group.groupId === item.groupId && group.skuId === item.skuId))) {
    throw new Error('snapshot_card_group_reference_invalid');
  }

  return {
    schema: 'promo-grouping-snapshot-v2',
    snapshotId: previous?.snapshotId || crypto.randomUUID(),
    monthKey: dataset.version.monthKey,
    datasetId: identity.datasetId,
    datasetFingerprint: identity.fingerprint,
    datasetRevision: identity.revision,
    cardIdsHash: identity.cardIdsHash,
    revision: previous?.revision || 0,
    savedAt: now,
    groups,
    assignments,
    cardCount: assignments.length,
  };
}

export function assertSnapshotMatchesDataset(dataset: PromoDataset, snapshot: PromoGroupingSnapshot): void {
  const identity = sourceIdentity(dataset);
  if (snapshot.schema !== 'promo-grouping-snapshot-v2') throw new Error('grouping_snapshot_schema_mismatch');
  if (snapshot.monthKey !== dataset.version.monthKey) throw new Error('grouping_snapshot_month_mismatch');
  if (snapshot.datasetId !== identity.datasetId) throw new Error('grouping_snapshot_dataset_mismatch');
  if (snapshot.datasetFingerprint !== identity.fingerprint) throw new Error('grouping_snapshot_fingerprint_mismatch');
  if (snapshot.datasetRevision !== identity.revision) throw new Error('grouping_snapshot_dataset_revision_mismatch');
  if (snapshot.cardIdsHash !== identity.cardIdsHash) throw new Error('grouping_snapshot_card_hash_mismatch');
  if (!UUID.test(snapshot.snapshotId) || !Number.isInteger(snapshot.revision) || snapshot.revision < 1) {
    throw new Error('grouping_snapshot_revision_invalid');
  }
  const expectedIds = sorted([
    ...dataset.cards.map(card => card.id),
    ...[],
  ]);
  const assignmentIds = sorted(snapshot.assignments.map(item => item.cardId));
  if (snapshot.cardCount !== snapshot.assignments.length || new Set(assignmentIds).size !== assignmentIds.length) {
    throw new Error('grouping_snapshot_duplicate_or_incomplete');
  }
  if (expectedIds.length !== assignmentIds.length || expectedIds.some((id, index) => id !== assignmentIds[index])) {
    throw new Error(`grouping_snapshot_card_mismatch:${assignmentIds.length}/${expectedIds.length}`);
  }
  const groupIds = snapshot.groups.map(group => group.groupId);
  if (new Set(groupIds).size !== groupIds.length) throw new Error('grouping_snapshot_duplicate_group');
  if (snapshot.groups.some(group => typeof group.confirmed !== 'boolean' || typeof group.locked !== 'boolean')) {
    throw new Error('grouping_snapshot_lock_state_invalid');
  }
  if (snapshot.assignments.some(item => !snapshot.groups.some(group => group.groupId === item.groupId && group.skuId === item.skuId))) {
    throw new Error('grouping_snapshot_card_group_reference_invalid');
  }
}

export function hydrateManualGroupingSnapshot(
  dataset: PromoDataset,
  quarantine: ImportedCardCandidate[],
  snapshot: PromoGroupingSnapshot,
  masterSkus: Sku[],
): { dataset: PromoDataset; quarantine: ImportedCardCandidate[] } {
  const completeDataset = dataset.cards.length === snapshot.cardCount
    ? dataset
    : { ...dataset, cards: [...dataset.cards] };
  const expectedIds = new Set([
    ...completeDataset.cards.map(card => card.id),
    ...quarantine.map(card => card.cardId),
  ]);
  if (expectedIds.size !== snapshot.cardCount) {
    throw new Error(`grouping_snapshot_card_mismatch:${snapshot.cardCount}/${expectedIds.size}`);
  }
  const validationDataset = completeDataset.cards.length === expectedIds.size
    ? completeDataset
    : {
      ...completeDataset,
      cards: [
        ...completeDataset.cards,
        ...quarantine.map(card => ({
          id: card.cardId,
          monthKey: card.monthKey,
        })),
      ],
    } as PromoDataset;
  assertSnapshotMatchesDataset(validationDataset, snapshot);

  const unlocked: PromoDataset = {
    ...dataset,
    productGroups: dataset.productGroups.map(group => ({ ...group, manualConfirmed: false, manualLocked: false })),
  };
  let working: PromoDataset = unlocked;
  let unresolved = quarantine;
  if (working.cards.length) {
    const reset = unassignCardsManually(working, unresolved, working.cards.map(card => card.id));
    working = reset.dataset;
    unresolved = reset.quarantine;
  }

  const skuById = new Map([...masterSkus, ...working.skus].map(sku => [sku.id, sku]));
  for (const savedGroup of snapshot.groups) {
    const sku = skuById.get(savedGroup.skuId);
    if (!sku || sku.status !== 'active') throw new Error(`grouping_snapshot_master_missing:${savedGroup.skuId}`);
    if (!working.skus.some(item => item.id === sku.id)) working = ensureSkuInDataset(working, sku);
    const cardIds = snapshot.assignments.filter(item => item.groupId === savedGroup.groupId).map(item => item.cardId);
    const result = assignCardsManually(working, unresolved, cardIds, { skuId: sku.id });
    const generatedGroupId = result.targetGroupId;
    working = {
      ...result.dataset,
      cards: result.dataset.cards.map(card => card.productGroupId === generatedGroupId
        ? { ...card, productGroupId: savedGroup.groupId }
        : card),
      productGroups: result.dataset.productGroups.map(group => group.id === generatedGroupId
        ? { ...group, id: savedGroup.groupId, manualConfirmed: false, manualLocked: false }
        : group),
    };
    unresolved = result.quarantine;
  }
  if (unresolved.length) throw new Error(`grouping_snapshot_unassigned:${unresolved.length}`);

  for (const assignment of snapshot.assignments) {
    const group = working.productGroups.find(item => item.id === assignment.groupId);
    const family = working.promotionFamilies.find(item => item.id === assignment.promotionFamilyId);
    const card = working.cards.find(item => item.id === assignment.cardId);
    if (!group || !family || !card?.classId) throw new Error(`grouping_snapshot_promotion_reference_missing:${assignment.cardId}`);
    const expectedTierKeys = sorted((family.tiersByClass[card.classId] || []).map(tier => tierKey(family.id, card.classId!, tier)));
    if (JSON.stringify(expectedTierKeys) !== JSON.stringify(sorted(assignment.promotionTierKeys))) {
      throw new Error(`grouping_snapshot_tier_mismatch:${assignment.cardId}`);
    }
    const promoted = applyPromotionFamilyToCard(group, working.cards, card.id, family);
    working = {
      ...working,
      cards: promoted.cards,
      productGroups: working.productGroups.map(item => item.id === group.id ? promoted.group : item),
    };
  }

  working = {
    ...working,
    sourceDataset: working.sourceDataset ? {
      ...working.sourceDataset,
      snapshotId: snapshot.snapshotId,
      snapshotRevision: snapshot.revision,
      snapshotSavedAt: snapshot.savedAt,
    } : working.sourceDataset,
    productGroups: working.productGroups.map(group => {
      const saved = snapshot.groups.find(item => item.groupId === group.id);
      return saved ? { ...group, manualConfirmed: saved.confirmed, manualLocked: saved.locked } : group;
    }),
  };
  return { dataset: working, quarantine: unresolved };
}
