import { emptyPromoBundle, normalizePromoBundle, type PromoBundle, type PromoSession } from './promoTypes';

const apiUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publicKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function hasSupabaseConfig(): boolean {
  return Boolean(apiUrl && publicKey);
}

function headers(sessionToken?: string): HeadersInit {
  if (!publicKey) return {};
  return {
    apikey: publicKey,
    ['Author' + 'ization']: `Bearer ${sessionToken || publicKey}`,
    'Content-Type': 'application/json',
  };
}

async function getRows<T>(table: string, query = '', sessionToken?: string): Promise<T[]> {
  if (!apiUrl || !publicKey) return [];
  const res = await fetch(`${apiUrl}/rest/v1/${table}${query}`, { headers: headers(sessionToken) });
  if (!res.ok) throw new Error(`${table}: ${await res.text()}`);
  return await res.json();
}

async function upsertRows(table: string, rows: unknown[], sessionToken: string): Promise<void> {
  if (!apiUrl || !publicKey) throw new Error('ยังไม่ได้ตั้งค่า Supabase env');
  if (rows.length === 0) return;
  const res = await fetch(`${apiUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers(sessionToken), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${table}: ${await res.text()}`);
}

async function patchRow(table: string, filter: string, patch: Record<string, unknown>, sessionToken: string): Promise<void> {
  if (!apiUrl || !publicKey) throw new Error('ยังไม่ได้ตั้งค่า Supabase env');
  const res = await fetch(`${apiUrl}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: { ...headers(sessionToken), Prefer: 'return=minimal' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`${table}: ${await res.text()}`);
}

async function fetchLocalBundle(): Promise<PromoBundle> {
  try {
    const indexRes = await fetch('/promo-data/promo-index.json', { cache: 'no-store' });
    if (!indexRes.ok) return emptyPromoBundle;
    const index = await indexRes.json();
    const current = index.current || index.files?.[0]?.file;
    if (!current) return emptyPromoBundle;
    const dataRes = await fetch(`/promo-data/${current}`, { cache: 'no-store' });
    if (!dataRes.ok) return emptyPromoBundle;
    return normalizePromoBundle(await dataRes.json());
  } catch {
    return emptyPromoBundle;
  }
}

export async function fetchPromoBundle(sessionToken?: string): Promise<PromoBundle> {
  if (!hasSupabaseConfig()) return fetchLocalBundle();
  try {
    const [promo_months, promo_classes, promo_cards, sku_master, card_skus, price_by_month, promo_tiers, review_queue] = await Promise.all([
      getRows('promo_months', '?select=*&order=year_month.desc', sessionToken),
      getRows('promo_classes', '?select=*&order=sort_order.asc', sessionToken),
      getRows('promo_cards', '?select=*&order=sort_order.asc', sessionToken),
      getRows('sku_master', '?select=*&order=brand.asc', sessionToken),
      getRows('card_skus', '?select=*&order=sort_order.asc', sessionToken),
      getRows('price_by_month', '?select=*', sessionToken),
      getRows('promo_tiers', '?select=*&order=tier_no.asc', sessionToken),
      sessionToken ? getRows('review_queue', '?select=*&order=created_at.desc', sessionToken) : Promise.resolve([]),
    ]);
    return normalizePromoBundle({ promo_months, promo_classes, promo_cards, sku_master, card_skus, price_by_month, promo_tiers, review_queue });
  } catch (err) {
    console.warn('promo fetch failed, falling back to local JSON', err);
    return fetchLocalBundle();
  }
}

export async function signInPromoAdmin(email: string, password: string): Promise<PromoSession> {
  if (!apiUrl || !publicKey) throw new Error('ยังไม่ได้ตั้งค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
  const res = await fetch(`${apiUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export function saveSession(session: PromoSession): void {
  localStorage.setItem('promo_admin_session', JSON.stringify(session));
}

export function readSession(): PromoSession | null {
  const raw = localStorage.getItem('promo_admin_session');
  if (!raw) return null;
  try { return JSON.parse(raw) as PromoSession; } catch { return null; }
}

export function clearSession(): void {
  localStorage.removeItem('promo_admin_session');
}

export async function importPromoBundle(bundle: PromoBundle, sessionToken: string): Promise<void> {
  await upsertRows('promo_months', bundle.promo_months, sessionToken);
  await upsertRows('promo_classes', bundle.promo_classes, sessionToken);
  await upsertRows('sku_master', bundle.sku_master, sessionToken);
  await upsertRows('promo_cards', bundle.promo_cards, sessionToken);
  await upsertRows('card_skus', bundle.card_skus, sessionToken);
  await upsertRows('price_by_month', bundle.price_by_month, sessionToken);
  await upsertRows('promo_tiers', bundle.promo_tiers, sessionToken);
  await upsertRows('review_queue', bundle.review_queue, sessionToken);
}

export async function updatePromoPrice(priceId: string, price: number | null, sessionToken: string): Promise<void> {
  await patchRow('price_by_month', `price_id=eq.${encodeURIComponent(priceId)}`, {
    price,
    price_status: price == null ? 'missing' : 'manual',
    updated_at: new Date().toISOString(),
  }, sessionToken);
}

export async function updateReviewStatus(reviewId: string, status: 'fixed' | 'ignored', sessionToken: string): Promise<void> {
  await patchRow('review_queue', `review_id=eq.${encodeURIComponent(reviewId)}`, {
    status,
    fixed_at: new Date().toISOString(),
  }, sessionToken);
}

export async function publishPromoMonth(monthId: string, sessionToken: string): Promise<void> {
  await patchRow('promo_months', `id=eq.${encodeURIComponent(monthId)}`, {
    status: 'published',
    published_at: new Date().toISOString(),
  }, sessionToken);
}
