import type { PromoDataset, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';

const SESSION_KEY = 'promo-new-admin-session-v1';

interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string | null };
}

export interface PromoMasterData {
  skus: Sku[];
  prices: StoredPrice[];
}

async function request<T>(action: string, options: RequestInit = {}, query: Record<string, string> = {}): Promise<T> {
  const url = new URL('/api/promo-new', window.location.origin);
  url.searchParams.set('action', action);
  Object.entries(query).forEach(([key, value]) => { if (value) url.searchParams.set(key, value); });
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({ ok: false, error: `http_${response.status}` }));
  if (!response.ok || data?.ok === false) throw new Error(data?.error || `http_${response.status}`);
  return data as T;
}

export function loadSession(): AdminSession | null {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') as AdminSession | null; } catch { return null; }
}

export function saveSession(session: AdminSession | null) {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

export async function login(email: string, password: string): Promise<AdminSession> {
  const response = await request<{ ok: true; session: AdminSession }>('login', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(response.session);
  return response.session;
}

export async function validateSession(session: AdminSession): Promise<AdminSession> {
  await request('session', { headers: { Authorization: `Bearer ${session.accessToken}` } });
  return session;
}

export async function logout(session: AdminSession | null): Promise<void> {
  try {
    if (session) await request('logout', { method: 'POST', headers: { Authorization: `Bearer ${session.accessToken}` } });
  } finally { saveSession(null); }
}

export async function fetchPromoMasterData(session: AdminSession): Promise<PromoMasterData> {
  const response = await request<{ ok: true; data: PromoMasterData }>('master-data', {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return response.data;
}

export async function saveDraft(dataset: PromoDataset, session: AdminSession) {
  return request<{ ok: true; data: { version_id: string; revision: number; status: string } }>('draft', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: JSON.stringify({ dataset }),
  });
}

export async function uploadCardImage(versionId: string, cardId: string, dataUrl: string, session: AdminSession): Promise<string> {
  const response = await request<{ ok: true; path: string }>('card-image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: JSON.stringify({ versionId, cardId, dataUrl }),
  });
  return response.path;
}

export async function publishVersion(versionId: string, session: AdminSession) {
  return request('publish', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: JSON.stringify({ versionId }),
  });
}

export async function fetchPublished(monthKey = ''): Promise<PromoDataset | null> {
  const response = await request<{ ok: true; data: PromoDataset | null }>('published', {}, { month: monthKey });
  return response.data;
}
