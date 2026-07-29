import assert from 'node:assert/strict';
import test from 'node:test';
import * as XLSX from 'xlsx';

const REQUIRED_XLSX_VERSION = '0.20.3';

test('SheetJS runtime uses patched official release', () => {
  assert.equal(XLSX.version, REQUIRED_XLSX_VERSION);
});
