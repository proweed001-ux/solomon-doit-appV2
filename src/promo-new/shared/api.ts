import type { PromoDataset, Sku } from '../domain/types';
import type { StoredPrice } from '../domain/pricing';
import { buildLegacyUploadPlan, chunkLegacyCards } from './legacy-system';

const SESSION_KEY = 'promo-new-admin-session-v1';
const LAST_DRAFT_KEY = 'promo-new-legacy-draft-v1';
const SUPABASE_URL = 'https://saodmeoilixfdqentofp.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_JThYwAl_-askk_cIaCd75w_TCWK2BTT';
const UPLOAD_FUNCTION = 'promo-image-upload-v2-preview';

interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string | null };
}

interface SavedLegacyDraft {
  promoMonthId: string;
  cardIds: string[];
  savedAt: string;
}

export interface PromoMasterData {
  skus: Sku[];
  prices: StoredPrice[];
}

async function request<T>(action: string, options: RequestInit = {}): Promise<T> {
  const url = new URL('/api/promo-legacy-auth', window.location.origin);
  url.searchParams.set('action', action);
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

async function edgeRequest<T>(body: unknown, adminKey: string): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${UPLOAD_FUNCTION}`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
      'x-promo-admin-key': adminKey,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { ok: false, error: text || `http_${response.status}` }; }
  if (!response.ok || data?.ok === false) {
    const detail = data?.detail || data?.error || text || `http_${response.status}`;
    throw new Error(String(detail));
  }
  return data as T;
}

function yearMonth(monthKey: string): string {
  const match = String(monthKey || '').toUpperCase().match(/^(?:PROMO-)?(\d{4})-(\d{2})$/u);
  if (!match) return '';
  return `${match[1]}-${match[2]}`;
}

export function loadSession(): AdminSession | null {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') as AdminSession | null; } catch { return null; }
}

export function saveSession(session: AdminSession | null) {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

export async function login(email: string, password: string): Promise<AdminSession> {
  const adminKey = String(password || email || '').trim();
  const response = await request<{ ok: true; session: AdminSession }>('login', {
    method: 'POST',
    body: JSON.stringify({ adminKey }),
  });
  saveSession(response.session);
  return response.session;
}

export async function validateSession(session: AdminSession): Promise<AdminSession> {
  await request('session', { headers: { 'x-promo-admin-key': session.accessToken } });
  return session;
}

export async function logout(_session: AdminSession | null): Promise<void> {
  try { await request('logout', { method: 'POST' }); }
  finally {
    saveSession(null);
    sessionStorage.removeItem(LAST_DRAFT_KEY);
    window.location.reload();
  }
}

export async function fetchPromoMasterData(session: AdminSession): Promise<PromoMasterData> {
  const response = await request<{ ok: true; data: PromoMasterData }>('master-data', {
    headers: { 'x-promo-admin-key': session.accessToken },
  });
  return response.data;
}

export async function saveDraft(dataset: PromoDataset, session: AdminSession) {
  const plan = await buildLegacyUploadPlan(dataset);
  const batches = chunkLegacyCards(plan.cards, 20);
  const uploadedIds: string[] = [];
  for (let index = 0; index < batches.length; index += 1) {
    const result = await edgeRequest<{ card_ids?: string[] }>({
      action: 'batch_upload',
      promo_month_id: plan.promoMonthId,
      source_file: plan.sourceFile,
      source_workbook: plan.workbookFile,
      year_month: yearMonth(dataset.version.monthKey),
      month_label: `โปรโมชัน ${plan.promoMonthId}`,
      skip_existing_images: true,
      cards: batches[index],
    }, session.accessToken);
    uploadedIds.push(...(Array.isArray(result.card_ids) ? result.card_ids : []));
  }
  if (uploadedIds.length !== plan.cardIds.length || new Set(uploadedIds).size !== plan.cardIds.length) {
    throw new Error(`legacy_upload_incomplete:${uploadedIds.length}/${plan.cardIds.length}`);
  }
  const saved: SavedLegacyDraft = { promoMonthId: plan.promoMonthId, cardIds: plan.cardIds, savedAt: new Date().toISOString() };
  sessionStorage.setItem(LAST_DRAFT_KEY, JSON.stringify(saved));
  return {
    ok: true,
    data: {
      version_id: plan.promoMonthId,
      revision: 1,
      status: 'draft',
      uploaded_cards: plan.cardIds.length,
      batches: batches.length,
    },
  };
}

export async function uploadCardImage(_versionId: string, _cardId: string, dataUrl: string, _session: AdminSession): Promise<string> {
  return dataUrl;
}

export async function publishVersion(versionId: string, session: AdminSession) {
  let saved: SavedLegacyDraft | null = null;
  try { saved = JSON.parse(sessionStorage.getItem(LAST_DRAFT_KEY) || 'null') as SavedLegacyDraft | null; } catch { saved = null; }
  if (!saved || saved.promoMonthId !== versionId || !saved.cardIds.length) throw new Error('legacy_saved_draft_not_found');
  const confirmed = window.confirm(`Publish ${saved.promoMonthId} เป็นเดือนล่าสุดหรือไม่? ระบบเดิมจะลบข้อมูลและรูปของเดือนเก่าออกหลังตรวจครบทุกการ์ด`);
  if (!confirmed) throw new Error('publish_cancelled');
  const result = await edgeRequest({
    action: 'finalize_latest',
    promo_month_id: saved.promoMonthId,
    expected_cards: saved.cardIds.length,
    card_ids: saved.cardIds,
    confirm_latest_only: true,
  }, session.accessToken);
  sessionStorage.removeItem(LAST_DRAFT_KEY);
  return result;
}

export async function fetchPublished(monthKey = ''): Promise<PromoDataset | null> {
  const url = new URL('/api/promo-new', window.location.origin);
  url.searchParams.set('action', 'published');
  if (monthKey) url.searchParams.set('month', monthKey);
  const response = await fetch(url);
  const data = await response.json().catch(() => ({ ok: false, error: `http_${response.status}` }));
  if (!response.ok || data?.ok === false) throw new Error(data?.error || `http_${response.status}`);
  return data.data as PromoDataset | null;
}
