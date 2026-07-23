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

export async function loadPromoGroupingSnapshot(monthKey: string, adminKey: string): Promise<PromoGroupingSnapshot | null> {
  if (!adminKey) throw new Error('admin_session_required_for_grouping_load');
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'load-grouping-snapshot');
  url.searchParams.set('monthKey', monthKey);
  const response = await fetch(url, { headers: { 'x-promo-admin-key': adminKey } });
  const data = await parseResponse<{ ok: true; data: PromoGroupingSnapshot | null }>(response);
  return data.data || null;
}

export async function savePromoGroupingSnapshot(dataset: PromoDataset, adminKey: string): Promise<{ promoMonthId: string; groupCount: number; cardCount: number }> {
  if (!adminKey) throw new Error('admin_session_required_for_grouping_save');
  const groups = dataset.productGroups.map(group => ({
    skuId: group.skuId,
    cardIds: dataset.cards
      .filter(card => card.productGroupId === group.id)
      .map(card => card.id),
    confirmed: group.manualConfirmed === true,
  })).filter(group => group.cardIds.length > 0);
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', 'save-grouping-snapshot');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-promo-admin-key': adminKey,
    },
    body: JSON.stringify({ monthKey: dataset.version.monthKey, groups }),
  });
  const data = await parseResponse<{ ok: true; data: { promoMonthId: string; groupCount: number; cardCount: number } }>(response);
  if (!data.data || data.data.cardCount !== dataset.cards.length) throw new Error('grouping_snapshot_save_incomplete');
  return data.data;
}
