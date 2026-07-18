import type { PdfImportResult } from '../import/pdf-importer';
import type { WorkbookParseResult } from '../import/workbook-parser';

const DB_NAME = 'solomon-promo-new-test-cache';
const DB_VERSION = 1;
const STORE_NAME = 'runs';
const LATEST_KEY = 'latest';
const SUMMARY_KEY = 'promo-new-test-cache-summary-v2';
const CACHE_SCHEMA_VERSION = 2 as const;
const PIPELINE_VERSION = 'text-first-product-master-v1' as const;

interface StoredFile {
  name: string;
  type: string;
  lastModified: number;
  blob: Blob;
}

export type PromoTestCacheMode = 'full' | 'source_only';

interface StoredPromoTestCache {
  key: typeof LATEST_KEY;
  schemaVersion: typeof CACHE_SCHEMA_VERSION;
  pipelineVersion: typeof PIPELINE_VERSION;
  savedAt: string;
  monthKey: string;
  ocrEnabled: boolean;
  mode: PromoTestCacheMode;
  pdf: StoredFile;
  workbook: StoredFile;
  imported: PdfImportResult | null;
  parsedWorkbook: WorkbookParseResult | null;
  visualSignatures: Record<string, string> | null;
}

export interface PromoTestCacheSummary {
  savedAt: string;
  monthKey: string;
  mode: PromoTestCacheMode;
  pdfName: string;
  workbookName: string;
  cardCount: number;
  estimatedBytes: number;
}

export interface LoadedPromoTestCache {
  summary: PromoTestCacheSummary;
  monthKey: string;
  ocrEnabled: boolean;
  pdf: File;
  workbook: File;
  imported: PdfImportResult | null;
  parsedWorkbook: WorkbookParseResult | null;
  visualSignatures: Record<string, string> | null;
  warnings: string[];
}

export interface SavePromoTestCacheInput {
  monthKey: string;
  ocrEnabled: boolean;
  pdf: File;
  workbook: File;
  imported: PdfImportResult;
  parsedWorkbook: WorkbookParseResult;
  visualSignatures?: Record<string, string>;
}

function ensureIndexedDb(): IDBFactory {
  if (typeof indexedDB === 'undefined') throw new Error('indexeddb_unavailable');
  return indexedDB;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = ensureIndexedDb().open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('indexeddb_open_failed'));
    request.onblocked = () => reject(new Error('indexeddb_upgrade_blocked'));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('indexeddb_request_failed'));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('indexeddb_transaction_failed'));
    transaction.onabort = () => reject(transaction.error || new Error('indexeddb_transaction_aborted'));
  });
}

async function putRecord(record: StoredPromoTestCache): Promise<void> {
  const db = await openDb();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(record);
    await transactionDone(transaction);
  } finally {
    db.close();
  }
}

async function getRecord(): Promise<unknown> {
  const db = await openDb();
  try {
    return await requestResult(db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(LATEST_KEY)) || null;
  } finally {
    db.close();
  }
}

async function deleteRecord(): Promise<void> {
  const db = await openDb();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(LATEST_KEY);
    await transactionDone(transaction);
  } finally {
    db.close();
  }
}

function isCurrentRecord(value: unknown): value is StoredPromoTestCache {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<StoredPromoTestCache>;
  return record.schemaVersion === CACHE_SCHEMA_VERSION
    && record.pipelineVersion === PIPELINE_VERSION
    && record.key === LATEST_KEY;
}

function storedFile(file: File): StoredFile {
  return {
    name: file.name,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified || Date.now(),
    blob: file.slice(0, file.size, file.type || 'application/octet-stream'),
  };
}

function restoredFile(file: StoredFile): File {
  return new File([file.blob], file.name, { type: file.type, lastModified: file.lastModified });
}

function dataUrlBytes(value: string): number {
  if (!value.startsWith('data:')) return value.length * 2;
  const comma = value.indexOf(',');
  return comma < 0 ? value.length * 2 : Math.ceil((value.length - comma - 1) * 0.75);
}

function estimatedBytes(record: StoredPromoTestCache): number {
  const images = record.imported?.cards.reduce((sum, card) => sum + dataUrlBytes(card.imageUrl), 0) || 0;
  return record.pdf.blob.size + record.workbook.blob.size + images;
}

function summaryOf(record: StoredPromoTestCache): PromoTestCacheSummary {
  return {
    savedAt: record.savedAt,
    monthKey: record.monthKey,
    mode: record.mode,
    pdfName: record.pdf.name,
    workbookName: record.workbook.name,
    cardCount: record.imported?.cards.length || 0,
    estimatedBytes: estimatedBytes(record),
  };
}

function saveSummary(summary: PromoTestCacheSummary | null): void {
  try {
    if (summary) localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
    else localStorage.removeItem(SUMMARY_KEY);
  } catch {
    // IndexedDB remains the source of truth.
  }
}

function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error.name);
}

async function requestPersistentStorage(): Promise<void> {
  try { await navigator.storage?.persist?.(); } catch { /* best effort */ }
}

export async function savePromoTestCache(input: SavePromoTestCacheInput): Promise<PromoTestCacheSummary> {
  await requestPersistentStorage();
  const base = {
    key: LATEST_KEY as typeof LATEST_KEY,
    schemaVersion: CACHE_SCHEMA_VERSION,
    pipelineVersion: PIPELINE_VERSION,
    savedAt: new Date().toISOString(),
    monthKey: input.monthKey,
    ocrEnabled: input.ocrEnabled,
    pdf: storedFile(input.pdf),
    workbook: storedFile(input.workbook),
  };
  const full: StoredPromoTestCache = {
    ...base,
    mode: 'full',
    imported: input.imported,
    parsedWorkbook: input.parsedWorkbook,
    visualSignatures: {},
  };
  try {
    await putRecord(full);
    const summary = summaryOf(full);
    saveSummary(summary);
    return summary;
  } catch (error) {
    if (!isQuotaError(error)) throw error;
    const sourceOnly: StoredPromoTestCache = {
      ...base,
      mode: 'source_only',
      imported: null,
      parsedWorkbook: null,
      visualSignatures: null,
    };
    await putRecord(sourceOnly);
    const summary = summaryOf(sourceOnly);
    saveSummary(summary);
    return summary;
  }
}

export async function loadPromoTestCache(): Promise<LoadedPromoTestCache | null> {
  const raw = await getRecord();
  if (!isCurrentRecord(raw)) {
    if (raw) await deleteRecord();
    saveSummary(null);
    return null;
  }

  const summary = summaryOf(raw);
  saveSummary(summary);
  return {
    summary,
    monthKey: raw.monthKey,
    ocrEnabled: raw.ocrEnabled,
    pdf: restoredFile(raw.pdf),
    workbook: restoredFile(raw.workbook),
    imported: raw.imported,
    parsedWorkbook: raw.parsedWorkbook,
    visualSignatures: {},
    warnings: [`cache_pipeline:${PIPELINE_VERSION}`],
  };
}

export function readPromoTestCacheSummary(): PromoTestCacheSummary | null {
  try {
    const value = localStorage.getItem(SUMMARY_KEY);
    return value ? JSON.parse(value) as PromoTestCacheSummary : null;
  } catch {
    return null;
  }
}

export async function refreshPromoTestCacheSummary(): Promise<PromoTestCacheSummary | null> {
  return readPromoTestCacheSummary();
}

export async function clearPromoTestCache(): Promise<void> {
  await deleteRecord();
  saveSummary(null);
}

export function formatCacheSize(bytes: number): string {
  if (!(bytes > 0)) return '0 MB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
