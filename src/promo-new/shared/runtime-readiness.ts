const PRODUCT_MASTER_READY_KEY = 'promo-new-product-master-ready-v1';

interface ProductMasterReadyState {
  count: number;
  loadedAt: string;
}

export function markProductMasterReady(count: number): void {
  if (!Number.isInteger(count) || count < 1) throw new Error('product_master_empty');
  if (typeof sessionStorage === 'undefined') return;
  const state: ProductMasterReadyState = { count, loadedAt: new Date().toISOString() };
  sessionStorage.setItem(PRODUCT_MASTER_READY_KEY, JSON.stringify(state));
}

export function clearProductMasterReady(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(PRODUCT_MASTER_READY_KEY);
}

export function readProductMasterReady(): ProductMasterReadyState | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const state = JSON.parse(sessionStorage.getItem(PRODUCT_MASTER_READY_KEY) || 'null') as ProductMasterReadyState | null;
    return state && Number.isInteger(state.count) && state.count > 0 ? state : null;
  } catch {
    return null;
  }
}

export function assertProductMasterReady(): ProductMasterReadyState {
  const state = readProductMasterReady();
  if (!state) throw new Error('product_master_required_before_pdf');
  return state;
}
