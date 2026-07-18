export function validateGroupingWorkerAsset(status: number, contentType: string, source: string): void {
  if (status < 200 || status >= 300) throw new Error(`grouping_worker_asset_http_${status}`);
  const normalizedType = String(contentType || '').toLowerCase();
  const prefix = String(source || '').slice(0, 300).toLowerCase();
  if (!source.trim()) throw new Error('grouping_worker_asset_empty');
  if (normalizedType.includes('text/html') || prefix.includes('<!doctype html') || prefix.includes('<html')) {
    throw new Error('grouping_worker_asset_html');
  }
}
