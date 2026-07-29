import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoDataset, Sku } from './types';
import { assignCardsManually } from './manual-grouping';
import { ensureSkuInDataset } from './manual-product';

export interface PromoGroupingSnapshotGroup {
  skuId: string;
  cardIds: string[];
  confirmed: boolean;
}

export interface PromoGroupingSnapshot {
  promoMonthId: string;
  groups: PromoGroupingSnapshotGroup[];
  cardCount: number;
}

export function hydrateManualGroupingSnapshot(
  dataset: PromoDataset,
  quarantine: ImportedCardCandidate[],
  snapshot: PromoGroupingSnapshot,
  masterSkus: Sku[],
): { dataset: PromoDataset; quarantine: ImportedCardCandidate[] } {
  const expected = new Set([
    ...dataset.cards.map(card => card.id),
    ...quarantine.map(card => card.cardId),
  ]);
  const snapshotIds = snapshot.groups.flatMap(group => group.cardIds);
  if (snapshotIds.length !== snapshot.cardCount || new Set(snapshotIds).size !== snapshotIds.length) {
    throw new Error('grouping_snapshot_duplicate_or_incomplete');
  }
  if (snapshotIds.length !== expected.size || snapshotIds.some(id => !expected.has(id))) {
    throw new Error(`grouping_snapshot_card_mismatch:${snapshotIds.length}/${expected.size}`);
  }

  let working = dataset;
  let unresolved = quarantine;
  const skuById = new Map(masterSkus.map(sku => [sku.id, sku]));
  for (const savedGroup of snapshot.groups) {
    const sku = skuById.get(savedGroup.skuId) || working.skus.find(item => item.id === savedGroup.skuId);
    if (!sku || sku.status !== 'active') throw new Error(`grouping_snapshot_master_missing:${savedGroup.skuId}`);
    if (!working.skus.some(item => item.id === sku.id)) working = ensureSkuInDataset(working, sku);
    const result = assignCardsManually(working, unresolved, savedGroup.cardIds, { skuId: sku.id });
    working = result.dataset;
    unresolved = result.quarantine;
    working = {
      ...working,
      productGroups: working.productGroups.map(group => group.id === result.targetGroupId
        ? { ...group, manualConfirmed: savedGroup.confirmed }
        : group),
    };
  }
  if (unresolved.length) throw new Error(`grouping_snapshot_unassigned:${unresolved.length}`);
  return { dataset: working, quarantine: unresolved };
}
