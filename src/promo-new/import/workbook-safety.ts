import JSZip from 'jszip';
import * as XLSX from 'xlsx';

export const MAX_WORKBOOK_SHEETS = 40;
export const MAX_WORKBOOK_ROWS_PER_SHEET = 20_000;
export const MAX_WORKBOOK_COLUMNS_PER_SHEET = 256;
export const MAX_WORKBOOK_TOTAL_CELLS = 500_000;
export const MAX_WORKBOOK_ZIP_ENTRIES = 5_000;
export const MAX_WORKBOOK_UNCOMPRESSED_BYTES = 200 * 1024 * 1024;
export const MAX_WORKBOOK_COMPRESSION_RATIO = 300;

export interface WorkbookArchiveStats {
  entryCount: number;
  compressedBytes: number;
  uncompressedBytes: number;
  maximumEntryRatio: number;
}

export interface DecodedPromotionCsv {
  text: string;
  encoding: 'utf-8' | 'utf-16le' | 'utf-16be' | 'windows-874';
  warnings: string[];
}

function stripBom(value: string): string {
  return value.replace(/^\uFEFF/u, '');
}

function assertDecodedText(value: string): string {
  const text = stripBom(value);
  if (!text.trim()) throw new Error('promotion_csv_empty');
  if (text.includes('\u0000')) throw new Error('promotion_csv_binary_content');
  if (text.includes('\uFFFD')) throw new Error('promotion_csv_encoding_invalid');
  return text;
}

function decodeFatal(label: string, bytes: Uint8Array): string {
  return new TextDecoder(label, { fatal: true }).decode(bytes);
}

export function decodePromotionCsv(bytesInput: ArrayBuffer | Uint8Array): DecodedPromotionCsv {
  const bytes = bytesInput instanceof Uint8Array ? bytesInput : new Uint8Array(bytesInput);
  if (!bytes.byteLength) throw new Error('promotion_csv_empty');

  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return { text: assertDecodedText(decodeFatal('utf-16le', bytes.subarray(2))), encoding: 'utf-16le', warnings: [] };
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return { text: assertDecodedText(decodeFatal('utf-16be', bytes.subarray(2))), encoding: 'utf-16be', warnings: [] };
  }

  try {
    const offset = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? 3 : 0;
    return { text: assertDecodedText(decodeFatal('utf-8', bytes.subarray(offset))), encoding: 'utf-8', warnings: [] };
  } catch (utf8Error) {
    try {
      const text = assertDecodedText(decodeFatal('windows-874', bytes));
      return { text, encoding: 'windows-874', warnings: ['csv_decoded_windows_874'] };
    } catch {
      throw utf8Error instanceof Error ? new Error('promotion_csv_encoding_unsupported') : new Error('promotion_csv_encoding_unsupported');
    }
  }
}

export function assertWorkbookArchiveStats(stats: WorkbookArchiveStats): void {
  if (!Number.isInteger(stats.entryCount) || stats.entryCount < 1 || stats.entryCount > MAX_WORKBOOK_ZIP_ENTRIES) {
    throw new Error(`promotion_workbook_zip_entry_limit:${stats.entryCount}/${MAX_WORKBOOK_ZIP_ENTRIES}`);
  }
  if (!Number.isFinite(stats.uncompressedBytes) || stats.uncompressedBytes < 1 || stats.uncompressedBytes > MAX_WORKBOOK_UNCOMPRESSED_BYTES) {
    throw new Error(`promotion_workbook_uncompressed_limit:${stats.uncompressedBytes}/${MAX_WORKBOOK_UNCOMPRESSED_BYTES}`);
  }
  const aggregateRatio = stats.uncompressedBytes / Math.max(1, stats.compressedBytes);
  if (!Number.isFinite(stats.maximumEntryRatio)
    || stats.maximumEntryRatio > MAX_WORKBOOK_COMPRESSION_RATIO
    || aggregateRatio > MAX_WORKBOOK_COMPRESSION_RATIO) {
    throw new Error(`promotion_workbook_compression_ratio:${Math.max(stats.maximumEntryRatio, aggregateRatio).toFixed(1)}/${MAX_WORKBOOK_COMPRESSION_RATIO}`);
  }
}

export async function assertWorkbookArchiveSafe(bytesInput: ArrayBuffer | Uint8Array): Promise<WorkbookArchiveStats> {
  const bytes = bytesInput instanceof Uint8Array ? bytesInput : new Uint8Array(bytesInput);
  const archive = await JSZip.loadAsync(bytes, { createFolders: false, checkCRC32: false });
  let entryCount = 0;
  let compressedBytes = 0;
  let uncompressedBytes = 0;
  let maximumEntryRatio = 0;

  for (const entry of Object.values(archive.files)) {
    if (entry.dir) continue;
    const data = (entry as unknown as { _data?: { compressedSize?: number; uncompressedSize?: number } })._data;
    const compressedSize = Number(data?.compressedSize);
    const uncompressedSize = Number(data?.uncompressedSize);
    if (!Number.isFinite(compressedSize) || compressedSize < 0 || !Number.isFinite(uncompressedSize) || uncompressedSize < 0) {
      throw new Error('promotion_workbook_zip_metadata_invalid');
    }
    entryCount += 1;
    compressedBytes += compressedSize;
    uncompressedBytes += uncompressedSize;
    maximumEntryRatio = Math.max(maximumEntryRatio, uncompressedSize / Math.max(1, compressedSize));
  }

  const stats = { entryCount, compressedBytes, uncompressedBytes, maximumEntryRatio };
  assertWorkbookArchiveStats(stats);
  return stats;
}

function worksheetReference(sheet: XLSX.WorkSheet): string | null {
  const fullReference = (sheet as XLSX.WorkSheet & { '!fullref'?: string })['!fullref'];
  return fullReference || sheet['!ref'] || null;
}

export function assertWorkbookBounds(workbook: XLSX.WorkBook): void {
  if (!Array.isArray(workbook.SheetNames) || !workbook.SheetNames.length) throw new Error('promotion_workbook_no_worksheets');
  if (workbook.SheetNames.length > MAX_WORKBOOK_SHEETS) {
    throw new Error(`promotion_workbook_sheet_limit:${workbook.SheetNames.length}/${MAX_WORKBOOK_SHEETS}`);
  }

  let totalCells = 0;
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    if (!sheet) throw new Error(`promotion_workbook_sheet_missing:${name}`);
    const reference = worksheetReference(sheet);
    if (!reference) continue;
    let range: XLSX.Range;
    try {
      range = XLSX.utils.decode_range(reference);
    } catch {
      throw new Error(`promotion_workbook_range_invalid:${name}`);
    }
    const rows = range.e.r - range.s.r + 1;
    const columns = range.e.c - range.s.c + 1;
    if (rows > MAX_WORKBOOK_ROWS_PER_SHEET) {
      throw new Error(`promotion_workbook_row_limit:${name}:${rows}/${MAX_WORKBOOK_ROWS_PER_SHEET}`);
    }
    if (columns > MAX_WORKBOOK_COLUMNS_PER_SHEET) {
      throw new Error(`promotion_workbook_column_limit:${name}:${columns}/${MAX_WORKBOOK_COLUMNS_PER_SHEET}`);
    }
    totalCells += rows * columns;
    if (totalCells > MAX_WORKBOOK_TOTAL_CELLS) {
      throw new Error(`promotion_workbook_cell_limit:${totalCells}/${MAX_WORKBOOK_TOTAL_CELLS}`);
    }
  }
}

export const SAFE_WORKBOOK_READ_OPTIONS: XLSX.ParsingOptions = {
  cellDates: true,
  dense: true,
  cellFormula: false,
  cellHTML: false,
  cellStyles: false,
  bookVBA: false,
  bookDeps: false,
  sheetRows: MAX_WORKBOOK_ROWS_PER_SHEET + 1,
};
