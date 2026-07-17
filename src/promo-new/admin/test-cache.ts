import { buildCardVisualSignatures } from '../domain/visual-consensus';
import { enrichCardHeadersFromImages } from '../import/card-header-ocr';
import type { PdfImportResult } from '../import/pdf-importer';
import type { WorkbookParseResult } from '../import/workbook-parser';

const DB_NAME = 'solomon-promo-new-test-cache';
const DB_VERSION = 1;
const STORE_NAME = 'runs';
const LATEST_KEY = 'latest';
const SUMMARY_KEY = 'promo-new-test-cache-summary-v1';
const HEADER_OCR_VERSION = 1;

interface StoredFile {
  name: string;
  type: string;
  lastModified: number;
  blob: Blob;
}

export type PromoTestCacheMode = 'full' | 'source_only';

interface StoredPromoTestCache {
  key: typeof LATEST_KEY;
  schemaVersion: 1;
  headerOcrVersion?: number;
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
}

export interface SavePromoTestCacheInput {
  monthKey: string;
  ocrEnabled: boolean;
  pdf: File;
  workbook: File;
  imported: PdfImportResult;
  parsedWorkbook: WorkbookParseResult;
  visualSignatures: Record<string, string>;
}

function ensureIndexedDb(): IDBFactory {
  if (typeof indexedDB === 'undefined') throw new Error('indexeddb_unavailable');
  return indexedDB;
}

function openDb(): Promise<IDBDatabase> {
  const factory = ensureIndexedDb();
  return new Promise((resolve, reject) => {
    const request = factory.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' });
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

async function putRecord(record: StoredPromoTestCache): Promise<void> {
  const db = await openDb();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await requestResult(store.put(record));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('indexeddb_write_failed'));
      transaction.onabort = () => reject(transaction.error || new Error('indexeddb_write_aborted'));
    });
  } finally {
    db.close();
  }
}

async function getRecord(): Promise<StoredPromoTestCache | null> {
  const db = await openDb();
  try {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    return await requestResult(transaction.objectStore(STORE_NAME).get(LATEST_KEY)) || null;
  } finally {
    db.close();
  }
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
  if (comma < 0) return value.length * 2;
  return Math.ceil((value.length - comma - 1) * 0.75);
}

function estimatedBytes(record: StoredPromoTestCache): number {
  const cardImages = record.imported?.cards.reduce((sum, card) => sum + dataUrlBytes(card.imageUrl), 0) || 0;
  const signatures = record.visualSignatures
    ? Object.values(record.visualSignatures).reduce((sum, signature) => sum + signature.length / 2, 0)
    : 0;
  return record.pdf.blob.size + record.workbook.blob.size + cardImages + signatures;
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
    // IndexedDB remains the source of truth when localStorage is unavailable.
  }
}

function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error.name);
}

async function requestPersistentStorage(): Promise<void> {
  try {
    await navigator.storage?.persist?.();
  } catch {
    // Persistence is best effort. The cache still works without it.
  }
}

async function enrichImportedHeaders(imported: PdfImportResult, enabled: boolean): Promise<PdfImportResult> {
  if (!enabled) return imported;
  const enriched = await enrichCardHeadersFromImages(imported.cards);
  return {
    ...imported,
    cards: enriched.cards,
    warnings: [...new Set([...imported.warnings, ...enriched.warnings])],
  };
}

export async function savePromoTestCache(input: SavePromoTestCacheInput): Promise<PromoTestCacheSummary> {
  await requestPersistentStorage();
  const imported = await enrichImportedHeaders(input.imported, input.ocrEnabled);
  input.imported.cards = imported.cards;
  input.imported.warnings = imported.warnings;
  const base = {
    key: LATEST_KEY as typeof LATEST_KEY,
    schemaVersion: 1 as const,
    headerOcrVersion: HEADER_OCR_VERSION,
    savedAt: new Date().toISOString(),
    monthKey: input.monthKey,
    ocrEnabled: input.ocrEnabled,
    pdf: storedFile(input.pdf),
    workbook: storedFile(input.workbook),
  };
  const full: StoredPromoTestCache = {
    ...base,
    mode: 'full',
    imported,
    parsedWorkbook: input.parsedWorkbook,
    visualSignatures: input.visualSignatures,
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
  const record = await getRecord();
  if (!record || record.schemaVersion !== 1) return null;
  let imported = record.imported;
  let visualSignatures = record.visualSignatures;
  if (imported && record.ocrEnabled && record.headerOcrVersion !== HEADER_OCR_VERSION) {
    imported = await enrichImportedHeaders(imported, true);
    visualSignatures = await buildCardVisualSignatures(imported.cards);
    record.imported = imported;
    record.visualSignatures = visualSignatures;
    record.headerOcrVersion = HEADER_OCR_VERSION;
    record.savedAt = new Date().toISOString();
    try {
      await putRecord(record);
    } catch {
      // The upgraded artifacts are still returned for this run even if persistence fails.
    }
  } else if (imported) {
    visualSignatures = await buildCardVisualSignatures(imported.cards);
  }
  const summary = summaryOf(record);
  saveSummary(summary);
  return {
    summary,
    monthKey: record.monthKey,
    ocrEnabled: record.ocrEnabled,
    pdf: restoredFile(record.pdf),
    workbook: restoredFile(record.workbook),
    imported,
    parsedWorkbook: record.parsedWorkbook,
    visualSignatures,
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
  const record = await getRecord();
  const summary = record ? summaryOf(record) : null;
  saveSummary(summary);
  return summary;
}

export async function clearPromoTestCache(): Promise<void> {
  const db = await openDb();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    await requestResult(transaction.objectStore(STORE_NAME).delete(LATEST_KEY));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('indexeddb_delete_failed'));
      transaction.onabort = () => reject(transaction.error || new Error('indexeddb_delete_aborted'));
    });
  } finally {
    db.close();
  }
  saveSummary(null);
}

export function formatCacheSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
