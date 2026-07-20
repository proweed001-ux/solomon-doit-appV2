import type { PdfImportResult } from '../import/pdf-importer';
import type { WorkbookParseResult } from '../import/workbook-parser';

const DB_NAME = 'solomon-promo-new-test-cache';
const DB_VERSION = 1;
const STORE_NAME = 'runs';
const LATEST_KEY = 'latest';
const SUMMARY_KEY = 'promo-new-test-cache-summary-v4';
export const PROMO_TEST_CACHE_SCHEMA_VERSION = 4 as const;
export const PROMO_TEST_PIPELINE_VERSION = 'text-first-product-master-v3-line-position-single-pass' as const;

interface StoredFile {
  name: string;
  type: string;
  lastModified: number;
  blob: Blob;
}

export type PromoTestCacheMode = 'full' | 'source_only';

interface StoredPromoTestCache {
  key: typeof LATEST_KEY;
  schemaVersion: typeof PROMO_TEST_CACHE_SCHEMA_VERSION;
  pipelineVersion: typeof PROMO_TEST_PIPELINE_VERSION;
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
  return record.schemaVersion === PROMO_TEST_CACHE_SCHEMA_VERSION
    && record.pipelineVersion === PROMO_TEST_PIPELINE_VERSION
    && record.key === LATEST_KEY;
}

function storedFile(file: File): StoredFile {
  return {
    name: file.name,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified || Date.now(),
    blob: file,
  };
}

function restoredFile(file: StoredFile): File {
  return new File([file.blob], file.name, { type: file.type, lastModified: file.lastModified });
}

function estimatedBytes(input: SavePromoTestCacheInput): number {
  const images = input.imported.cards.reduce((total, card) => total + card.imageUrl.length * 0.75, 0);
  return Math.round(input.pdf.size + input.workbook.size + images);
}

function summaryFrom(record: StoredPromoTestCache): PromoTestCacheSummary {
  return {
    savedAt: record.savedAt,
    monthKey: record.monthKey,
    mode: record.mode,
    pdfName: record.pdf.name,
    workbookName: record.workbook.name,
    cardCount: record.imported?.cards.length || 0,
    estimatedBytes: record.pdf.blob.size + record.workbook.blob.size + (record.imported?.cards.reduce((total, card) => total + card.imageUrl.length * 0.75, 0) || 0),
  };
}

function writeSummary(summary: PromoTestCacheSummary | null): void {
  try {
    if (!summary) localStorage.removeItem(SUMMARY_KEY);
    else localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
  } catch {
    // IndexedDB remains the source of truth when localStorage is unavailable.
  }
}

export function readPromoTestCacheSummary(): PromoTestCacheSummary | null {
  try {
    const value = JSON.parse(localStorage.getItem(SUMMARY_KEY) || 'null') as PromoTestCacheSummary | null;
    return value?.savedAt && value?.pdfName && value?.workbookName ? value : null;
  } catch {
    return null;
  }
}

export async function savePromoTestCache(input: SavePromoTestCacheInput): Promise<PromoTestCacheSummary> {
  const savedAt = new Date().toISOString();
  const full: StoredPromoTestCache = {
    key: LATEST_KEY,
    schemaVersion: PROMO_TEST_CACHE_SCHEMA_VERSION,
    pipelineVersion: PROMO_TEST_PIPELINE_VERSION,
    savedAt,
    monthKey: input.monthKey,
    ocrEnabled: input.ocrEnabled,
    mode: 'full',
    pdf: storedFile(input.pdf),
    workbook: storedFile(input.workbook),
    imported: input.imported,
    parsedWorkbook: input.parsedWorkbook,
    visualSignatures: input.visualSignatures || {},
  };
  try {
    await putRecord(full);
    const summary = summaryFrom(full);
    writeSummary(summary);
    return summary;
  } catch (error) {
    const name = String((error as DOMException)?.name || '');
    const message = String((error as Error)?.message || '');
    if (!/quota|space|storage/i.test(`${name} ${message}`)) throw error;
    const sourceOnly: StoredPromoTestCache = {
      ...full,
      mode: 'source_only',
      imported: null,
      parsedWorkbook: null,
      visualSignatures: null,
    };
    await putRecord(sourceOnly);
    const summary = summaryFrom(sourceOnly);
    writeSummary(summary);
    return summary;
  }
}

export async function loadPromoTestCache(): Promise<LoadedPromoTestCache | null> {
  const value = await getRecord();
  if (!isCurrentRecord(value)) {
    if (value) await deleteRecord();
    writeSummary(null);
    return null;
  }
  const summary = summaryFrom(value);
  writeSummary(summary);
  return {
    summary,
    monthKey: value.monthKey,
    ocrEnabled: value.ocrEnabled,
    pdf: restoredFile(value.pdf),
    workbook: restoredFile(value.workbook),
    imported: value.imported,
    parsedWorkbook: value.parsedWorkbook,
    visualSignatures: value.visualSignatures,
    warnings: [
      `cache:pipeline:${value.pipelineVersion}`,
      `cache:mode:${value.mode}`,
      'cache:read_once_from_indexeddb',
      ...(value.mode === 'source_only' ? ['cache:source_only_reprocess_required'] : []),
    ],
  };
}

export async function clearPromoTestCache(): Promise<void> {
  await deleteRecord();
  writeSummary(null);
}

export function formatCacheSize(bytes: number): string {
  if (!(bytes > 0)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index ? 1 : 0)} ${units[index]}`;
}

export const estimatePromoTestCacheBytes = estimatedBytes;
