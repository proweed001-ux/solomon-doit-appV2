import type { ImportedCardCandidate } from '../import/pdf-importer';
import type { PromoDataset, Sku } from '../domain/types';
import type { ManualProductInput } from '../domain/manual-product';
import type { PromoGroupingSnapshot } from '../domain/manual-snapshot';

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({ ok: false, error: `http_${response.status}` }));
  if (!response.ok || data?.ok === false) throw new Error(data?.error || `http_${response.status}`);
  return data as T;
}

export async function fetchActivePromoMasterSkus(adminKey: string): Promise<Sku[]> {
  if (!adminKey) return [];
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'master-data');
  const response = await fetch(url, {
    headers: { 'x-promo-admin-key': adminKey },
  });
  const data = await parseResponse<{ ok: true; data: { skus: Sku[] } }>(response);
  return Array.isArray(data.data?.skus) ? data.data.skus.filter(sku => sku.status === 'active') : [];
}

export async function createPromoMasterProduct(input: ManualProductInput, adminKey: string): Promise<{ sku: Sku; created: boolean }> {
  if (!adminKey) throw new Error('admin_session_required_for_product_master');
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'create-master');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-promo-admin-key': adminKey,
    },
    body: JSON.stringify({ product: input }),
  });
  const data = await parseResponse<{ ok: true; data: { sku: Sku; created: boolean } }>(response);
  if (!data.data?.sku) throw new Error('product_master_create_payload_invalid');
  return data.data;
}

export async function loadPromoSourceDataset(datasetId: string, adminKey: string): Promise<{
  dataset: PromoDataset;
  quarantine: ImportedCardCandidate[];
}> {
  if (!adminKey) throw new Error('admin_session_required_for_source_dataset');
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'load-source-dataset');
  url.searchParams.set('datasetId', datasetId);
  const response = await fetch(url, { headers: { 'x-promo-admin-key': adminKey } });
  const data = await parseResponse<{ ok: true; data: { dataset: PromoDataset; quarantine?: ImportedCardCandidate[] } }>(response);
  if (!data.data?.dataset) throw new Error('source_dataset_payload_invalid');
  const dataset = data.data.dataset;
  const quarantine = Array.isArray(data.data.quarantine) ? data.data.quarantine : [];
  const identity = dataset.sourceDataset;
  const cardIds = [...dataset.cards.map(card => card.id), ...quarantine.map(card => card.cardId)];
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
  if (!identity?.persisted
    || identity.datasetId !== datasetId
    || !identity.fingerprint
    || !identity.cardIdsHash
    || !Number.isInteger(identity.revision)
    || identity.revision < 1
    || !cardIds.length
    || cardIds.some(cardId => !uuid.test(cardId))
    || new Set(cardIds).size !== cardIds.length) {
    throw new Error('source_dataset_payload_invalid');
  }
  return { dataset, quarantine };
}

export async function loadPromoGroupingSnapshot(
  dataset: PromoDataset,
  adminKey: string,
): Promise<PromoGroupingSnapshot | null> {
  if (!adminKey) throw new Error('admin_session_required_for_grouping_load');
  const identity = dataset.sourceDataset;
  if (!identity?.persisted) return null;
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'load-grouping-snapshot');
  url.searchParams.set('monthKey', dataset.version.monthKey);
  url.searchParams.set('datasetId', identity.datasetId);
  url.searchParams.set('datasetFingerprint', identity.fingerprint);
  url.searchParams.set('datasetRevision', String(identity.revision));
  const response = await fetch(url, { headers: { 'x-promo-admin-key': adminKey } });
  const data = await parseResponse<{ ok: true; data: PromoGroupingSnapshot | null }>(response);
  return data.data || null;
}

export async function savePromoGroupingSnapshot(
  snapshot: PromoGroupingSnapshot,
  adminKey: string,
): Promise<PromoGroupingSnapshot> {
  if (!adminKey) throw new Error('admin_session_required_for_grouping_save');
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'save-grouping-snapshot');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-promo-admin-key': adminKey,
    },
    body: JSON.stringify({ snapshot }),
  });
  const data = await parseResponse<{ ok: true; data: PromoGroupingSnapshot }>(response);
  if (!data.data || data.data.cardCount !== snapshot.cardCount || data.data.revision <= snapshot.revision) {
    throw new Error('grouping_snapshot_save_incomplete');
  }
  return data.data;
}

export async function unlockPromoGroupingGroup(
  dataset: PromoDataset,
  groupId: string,
  adminKey: string,
): Promise<PromoGroupingSnapshot> {
  const identity = dataset.sourceDataset;
  if (!adminKey) throw new Error('admin_session_required_for_grouping_unlock');
  if (!identity?.persisted || !identity.snapshotId || !Number.isInteger(identity.snapshotRevision)) {
    throw new Error('persisted_snapshot_required_for_grouping_unlock');
  }
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'unlock-grouping-group');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-promo-admin-key': adminKey,
    },
    body: JSON.stringify({
      datasetId: identity.datasetId,
      snapshotId: identity.snapshotId,
      groupId,
      expectedRevision: identity.snapshotRevision,
    }),
  });
  const data = await parseResponse<{ ok: true; data: PromoGroupingSnapshot }>(response);
  if (!data.data || data.data.revision <= Number(identity.snapshotRevision)) {
    throw new Error('grouping_snapshot_unlock_incomplete');
  }
  return data.data;
}
