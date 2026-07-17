import { buildCardVisualSignatures } from '../domain/visual-consensus';
import { enrichCardHeadersFromImages } from '../import/card-header-ocr';
import type { PdfImportResult } from '../import/pdf-importer';
import type { WorkbookParseResult } from '../import/workbook-parser';

const DB_NAME = 'solomon-promo-new-test-cache';
const DB_VERSION = 1;
const STORE_NAME = 'runs';
const LATEST_KEY = 'latest';
const SUMMARY_KEY = 'promo-new-test-cache-summary-v1';
const HEADER_OCR_VERSION = 2;
const PROGRESS_OVERLAY_ID = 'promo-cache-progress-overlay';

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

interface ProgressElements {
  overlay: HTMLDivElement;
  title: HTMLDivElement;
  detail: HTMLDivElement;
  bar: HTMLDivElement;
}

function progressElements(): ProgressElements | null {
  if (typeof document === 'undefined') return null;
  let overlay = document.getElementById(PROGRESS_OVERLAY_ID) as HTMLDivElement | null;
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = PROGRESS_OVERLAY_ID;
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(15, 23, 42, 0.58)',
      backdropFilter: 'blur(3px)',
    });
    const card = document.createElement('div');
    Object.assign(card.style, {
      width: 'min(440px, 100%)',
      borderRadius: '18px',
      padding: '22px',
      background: '#ffffff',
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.32)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    });
    const title = document.createElement('div');
    title.dataset.role = 'title';
    Object.assign(title.style, {
      color: '#0f172a',
      fontSize: '17px',
      fontWeight: '750',
      lineHeight: '1.45',
    });
    const detail = document.createElement('div');
    detail.dataset.role = 'detail';
    Object.assign(detail.style, {
      marginTop: '7px',
      color: '#475569',
      fontSize: '13px',
      lineHeight: '1.5',
    });
    const track = document.createElement('div');
    Object.assign(track.style, {
      height: '9px',
      marginTop: '16px',
      overflow: 'hidden',
      borderRadius: '999px',
      background: '#e2e8f0',
    });
    const bar = document.createElement('div');
    bar.dataset.role = 'bar';
    Object.assign(bar.style, {
      width: '2%',
      height: '100%',
      borderRadius: '999px',
      background: '#0f766e',
      transition: 'width 180ms ease',
    });
    track.appendChild(bar);
    card.append(title, detail, track);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }
  return {
    overlay,
    title: overlay.querySelector('[data-role="title"]') as HTMLDivElement,
    detail: overlay.querySelector('[data-role="detail"]') as HTMLDivElement,
    bar: overlay.querySelector('[data-role="bar"]') as HTMLDivElement,
  };
}

function showProgress(title: string, detail: string, completed = 0, total = 0): void {
  const elements = progressElements();
  if (!elements) return;
  elements.overlay.style.display = 'flex';
  elements.title.textContent = title;
  elements.detail.textContent = detail;
  const percent = total > 0 ? Math.max(2, Math.min(100, completed / total * 100)) : 8;
  elements.bar.style.width = `${percent}%`;
}

function hideProgress(delayMs = 450): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  window.setTimeout(() => {
    const overlay = document.getElementById(PROGRESS_OVERLAY_ID) as HTMLDivElement | null;
    if (overlay) overlay.style.display = 'none';
  }, delayMs);
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
  const started = performance.now();
  const enriched = await enrichCardHeadersFromImages(imported.cards, (completed, total) => {
    const seconds = Math.round((performance.now() - started) / 1000);
    showProgress(
      `กำลังอ่านชื่อสินค้าและขนาด ${completed}/${total}`,
      `OCR เฉพาะหัวขวาบนของการ์ดที่ข้อมูลไม่ครบ · ใช้เวลา ${seconds} วินาที`,
      completed,
      total,
    );
  });
  return {
    ...imported,
    cards: enriched.cards,
    warnings: [...new Set([...imported.warnings, ...enriched.warnings])],
  };
}

export async function savePromoTestCache(input: SavePromoTestCacheInput): Promise<PromoTestCacheSummary> {
  await requestPersistentStorage();
  showProgress('กำลังตรวจหัวขวาบนก่อนบันทึกแคช', 'ระบบกำลังตรวจเฉพาะการ์ดที่ Brand ชนิด หรือขนาดยังไม่ครบ');
  try {
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
      showProgress('กำลังบันทึกผลลงแคช', 'เก็บไฟล์ ผล OCR และภาพการ์ดไว้ในเบราว์เซอร์เครื่องนี้', 1, 2);
      await putRecord(full);
      const summary = summaryOf(full);
      saveSummary(summary);
      showProgress('บันทึกแคชสำเร็จ', `เก็บ ${summary.cardCount} การ์ดแล้ว`, 2, 2);
      hideProgress();
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
      showProgress('พื้นที่แคชไม่พอ', 'เก็บเฉพาะ PDF และไฟล์ตารางแล้ว ต้อง OCR ใหม่ในรอบถัดไป', 2, 2);
      hideProgress(1200);
      return summary;
    }
  } catch (error) {
    showProgress('บันทึกแคชไม่สำเร็จ', String((error as Error).message || error), 1, 1);
    hideProgress(2500);
    throw error;
  }
}

export async function loadPromoTestCache(): Promise<LoadedPromoTestCache | null> {
  showProgress('กำลังเปิดไฟล์ทดสอบจากแคช', 'โปรดรอ ระบบยังทำงานอยู่', 0, 1);
  try {
    const record = await getRecord();
    if (!record || record.schemaVersion !== 1) {
      hideProgress();
      return null;
    }
    let imported = record.imported;
    let visualSignatures = record.visualSignatures;
    if (imported && record.ocrEnabled && record.headerOcrVersion !== HEADER_OCR_VERSION) {
      showProgress('กำลังเตรียม OCR หัวขวาบน', `พบ ${imported.cards.length} การ์ด ระบบจะอ่านเฉพาะใบที่ข้อมูลไม่ครบ`, 0, imported.cards.length);
      imported = await enrichImportedHeaders(imported, true);
      showProgress('กำลังสร้างลายนิ้วมือภาพใหม่', 'ใช้ภาพการ์ดที่อยู่ในแคช ไม่ได้ OCR PDF ทั้งหน้าใหม่', 0, imported.cards.length);
      visualSignatures = await buildCardVisualSignatures(imported.cards, (completed, total) => {
        showProgress('กำลังสร้างลายนิ้วมือภาพใหม่', `${completed}/${total} การ์ด`, completed, total);
      });
      record.imported = imported;
      record.visualSignatures = visualSignatures;
      record.headerOcrVersion = HEADER_OCR_VERSION;
      record.savedAt = new Date().toISOString();
      try {
        showProgress('กำลังบันทึกผล OCR ที่ปรับปรุงแล้ว', 'รอบถัดไปจะไม่อ่านซ้ำ', 1, 2);
        await putRecord(record);
      } catch {
        // The upgraded artifacts are still returned for this run even if persistence fails.
      }
    } else if (imported) {
      showProgress('กำลังจัดเตรียมหลักฐานภาพจากแคช', `ตรวจภาพ ${imported.cards.length} การ์ด`, 0, imported.cards.length);
      visualSignatures = await buildCardVisualSignatures(imported.cards, (completed, total) => {
        showProgress('กำลังจัดเตรียมหลักฐานภาพจากแคช', `${completed}/${total} การ์ด`, completed, total);
      });
    }
    const summary = summaryOf(record);
    saveSummary(summary);
    showProgress('โหลดแคชเสร็จแล้ว', imported ? `พร้อมจัดกลุ่ม ${imported.cards.length} การ์ด` : 'พบเฉพาะไฟล์ต้นฉบับ', 1, 1);
    hideProgress();
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
  } catch (error) {
    showProgress('เปิดแคชไม่สำเร็จ', String((error as Error).message || error), 1, 1);
    hideProgress(3000);
    throw error;
  }
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
