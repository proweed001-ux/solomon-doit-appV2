import assert from 'node:assert/strict';
import test from 'node:test';
import JSZip from 'jszip';
import type * as XLSX from 'xlsx';
import { parsePromotionMatrix } from '../../src/promo-new/import/workbook-parser';
import {
  MAX_WORKBOOK_COMPRESSION_RATIO,
  MAX_WORKBOOK_ROWS_PER_SHEET,
  MAX_WORKBOOK_TOTAL_CELLS,
  MAX_WORKBOOK_ZIP_ENTRIES,
  assertWorkbookArchiveSafe,
  assertWorkbookArchiveStats,
  assertWorkbookBounds,
  decodePromotionCsv,
} from '../../src/promo-new/import/workbook-safety';

test('CSV decoder preserves UTF-8 Thai and falls back to Windows-874', () => {
  const utf8 = decodePromotionCsv(new TextEncoder().encode('สินค้า,คลาส\nแชมพู,HFSS'));
  assert.equal(utf8.encoding, 'utf-8');
  assert.match(utf8.text, /สินค้า/u);

  const windows874 = decodePromotionCsv(Uint8Array.from([
    0xca, 0xd4, 0xb9, 0xa4, 0xe9, 0xd2, // สินค้า
    0x2c,
    0xa4, 0xc5, 0xd2, 0xca, // คลาส
    0x0a,
    0x48, 0x46, 0x53, 0x53,
  ]));
  assert.equal(windows874.encoding, 'windows-874');
  assert.match(windows874.text, /สินค้า/u);
  assert.deepEqual(windows874.warnings, ['csv_decoded_windows_874']);
});

test('workbook archive preflight reads normal ZIP metadata and rejects bomb-like statistics', async () => {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<Types/>');
  zip.file('xl/workbook.xml', '<workbook/>');
  const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  const stats = await assertWorkbookArchiveSafe(bytes);
  assert.equal(stats.entryCount, 2);
  assert.ok(stats.uncompressedBytes > 0);

  assert.throws(() => assertWorkbookArchiveStats({
    entryCount: MAX_WORKBOOK_ZIP_ENTRIES + 1,
    compressedBytes: 1,
    uncompressedBytes: 1,
    maximumEntryRatio: 1,
  }), /promotion_workbook_zip_entry_limit/u);
  assert.throws(() => assertWorkbookArchiveStats({
    entryCount: 1,
    compressedBytes: 1,
    uncompressedBytes: MAX_WORKBOOK_COMPRESSION_RATIO + 1,
    maximumEntryRatio: MAX_WORKBOOK_COMPRESSION_RATIO + 1,
  }), /promotion_workbook_compression_ratio/u);
});

test('workbook bounds use full worksheet range and cap rows and total cells', () => {
  const safe = {
    SheetNames: ['Safe'],
    Sheets: { Safe: { '!ref': 'A1:J100' } },
  } as unknown as XLSX.WorkBook;
  assert.doesNotThrow(() => assertWorkbookBounds(safe));

  const tooManyRows = {
    SheetNames: ['Rows'],
    Sheets: { Rows: { '!ref': 'A1:A10', '!fullref': `A1:A${MAX_WORKBOOK_ROWS_PER_SHEET + 1}` } },
  } as unknown as XLSX.WorkBook;
  assert.throws(() => assertWorkbookBounds(tooManyRows), /promotion_workbook_row_limit/u);

  const rows = Math.floor(MAX_WORKBOOK_TOTAL_CELLS / 256) + 1;
  const tooManyCells = {
    SheetNames: ['Cells'],
    Sheets: { Cells: { '!ref': `A1:IV${rows}` } },
  } as unknown as XLSX.WorkBook;
  assert.throws(() => assertWorkbookBounds(tooManyCells), /promotion_workbook_cell_limit/u);
});

test('blank row resets carried Family and prevents unrelated Class from being inherited', () => {
  const parsed = parsePromotionMatrix([
    ['สินค้า', 'คลาส', 'โปรโมชั่น'],
    ['H&S แชมพู 140 มล.', 'HFSS', 'ซื้อ 1 ขวด ลด 8%'],
    [],
    ['', 'HFSM', 'ซื้อ 1 ขวด ลด 10%'],
  ], 'Promo');

  assert.equal(parsed.families.length, 1);
  assert.deepEqual(Object.keys(parsed.families[0].tiersByClass), ['HFSS']);
  assert.ok(parsed.warnings.some(item => item.includes('family_scope_missing')));
});
