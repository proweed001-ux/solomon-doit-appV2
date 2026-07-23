import type { PromoDataset, PromoVersion } from './types';

export function publishedOnly(datasets: PromoDataset[], monthKey?: string): PromoDataset[] {
  return datasets
    .filter(dataset => dataset.version.status === 'published')
    .filter(dataset => !monthKey || dataset.version.monthKey === monthKey)
    .sort((a, b) => b.version.revision - a.version.revision);
}

export function activePublishedVersion(datasets: PromoDataset[], monthKey: string): PromoDataset | null {
  return publishedOnly(datasets, monthKey)[0] ?? null;
}

export function rollbackTarget(versions: PromoVersion[], currentVersionId: string): PromoVersion | null {
  const current = versions.find(version => version.id === currentVersionId);
  if (!current?.previousVersionId) return null;
  const target = versions.find(version => version.id === current.previousVersionId);
  return target?.status === 'published' || target?.status === 'archived' ? target : null;
}

export function nextDraftVersion(monthKey: string, versions: PromoVersion[], actorId: string | null): PromoVersion {
  const monthVersions = versions.filter(version => version.monthKey === monthKey);
  const active = monthVersions.filter(version => version.status === 'published').sort((a, b) => b.revision - a.revision)[0];
  const revision = Math.max(0, ...monthVersions.map(version => version.revision)) + 1;
  return {
    id: crypto.randomUUID(),
    monthKey,
    revision,
    status: 'imported',
    previousVersionId: active?.id ?? null,
    createdAt: new Date().toISOString(),
    createdBy: actorId,
    publishedAt: null,
    source: { pdfName: null, workbookName: null, pdfHash: null, workbookHash: null },
  };
}
