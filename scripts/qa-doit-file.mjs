import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

const inputPath = process.argv[2];
const jsonArg = process.argv.find(arg => arg.startsWith('--json='));
const jsonPath = jsonArg ? jsonArg.slice('--json='.length) : '';

if (!inputPath) {
  console.error('Usage: node scripts/qa-doit-file.mjs <DOIT.xlsx|xlsm|xls|csv> [--json=qa-result.json]');
  process.exit(1);
}

const absoluteInput = path.resolve(inputPath);
const failures = [];

function fail(message) {
  failures.push(message);
}

function fileText(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

function normalizeKey(value) {
  return String(value || '').toLowerCase().replace(/[\s_\-./()]/g, '').trim();
}

function textValue(value) {
  return String(value ?? '').trim();
}

function cleanText(value, fallback = '') {
  return textValue(value) || fallback;
}

function safeNum(value) {
  if (value == null) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  const cleaned = String(value).replace(/,/g, '').replace(/[฿$]/g, '').trim();
  if (!cleaned || cleaned === '-' || cleaned === '—') return 0;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function safeQty(value) {
  const n = safeNum(value);
  return n > 0 ? Math.round(n) : 0;
}

function parseDate(value) {
  const s = textValue(value);
  if (!s) return '';

  const n = Number(s);
  if (Number.isFinite(n) && n > 25000 && n < 80000) {
    const d = new Date(Date.UTC(1899, 11, 30 + Math.floor(n)));
    return d.toISOString().slice(0, 10);
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
}

const QUANTITY_ALIASES = [
  'ShipQtyPCS',
  'ShipQtyPC',
  'QtyShipPCS',
  'Qty Ship PCS',
  'Qty PCS',
  'Qty_PCS',
  'PCS',
  'Qty',
  'Quantity',
  'จำนวน',
  'จำนวนชิ้น',
];

const AMOUNT_ALIASES = [
  ['InvoiceAmt', ['InvoiceAmt', 'Invoice Amount', 'InvAmt']],
  ['Amount', ['NetAmount', 'Net Amount', 'Amount']],
  ['Correct Amount', ['Correct Amount', 'CorrectAmount', 'LineAmount', 'Line Amount']],
  ['TotInvc', ['TotInvc', 'TotalInvoice', 'Total Invoice']],
  ['Amt', ['Amt', 'amt']],
  ['detailAmt', ['detailAmt', 'DetailAmt']],
  ['row.amt', ['row.amt', 'row_amt']],
  ['LineAmtBeforeDisc', ['LineAmtBeforeDisc', 'Line Amount Before Disc']],
];

const TEXT_FIELDS = {
  cancel: ['Cancelled', 'Cancel', 'IsCancelled', 'VoidFlag'],
  type: ['Type', 'SOTypeID', 'SO Type', 'SO_Type', 'Document Type', 'DocType'],
  store: ['Customer Name', 'CustomerName', 'ShipName', 'c_Name', 'Store', 'StoreName', 'Store Name', 'Customer', 'ShipTo', 'Ship To', 'ShipToName', 'Outlet', 'ร้าน', 'ชื่อร้าน'],
  customerId: ['cID', 'ShiptoID', 'ShipToID', 'CustomerID', 'Customer ID'],
  skuCode: ['SKU_Code', 'SKUCode', 'SKU Code', 'ItemCode', 'Item Code', 'ProductCode', 'Product Code', 'Material', 'Code'],
  product: ['SKU_Desc', 'SKU Desc', 'TAS_THName', 'SKU / Product', 'SKU/Product', 'Product', 'ProductName', 'Product Name', 'Description', 'Item', 'ItemName', 'สินค้า', 'รายการสินค้า', 'SKU'],
  salespersonId: ['SalespersonID', 'SO_SalespersonID', 'Salesperson ID'],
  salespersonName: ['Salesperson_Name', 'Salesperson Name', 'SalespersonName'],
  telesaleId: ['TelesaleId', 'TelesaleID'],
  telesaleName: ['TelesaleName', 'Telesale Name'],
  date: ['InvcDate', 'InvoiceDate', 'Invoice_Date', 'ShipDateAct', 'OrdDate', 'SO_Date'],
  invoiceNo: ['InvcNbr', 'InvoiceNo', 'Invoice No', 'Invoice_No', 'SO No', 'SONo', 'OrderNo'],
};

const normalizedAliases = new Map();
function aliasesFor(list) {
  const key = list.join('\u0000');
  if (!normalizedAliases.has(key)) normalizedAliases.set(key, list.map(alias => [alias, normalizeKey(alias)]));
  return normalizedAliases.get(key);
}

function createRowReader(row) {
  const keys = Object.keys(row);
  const exact = new Map(keys.map(key => [normalizeKey(key), key]));
  const normalizedKeys = keys.map(key => [key, normalizeKey(key)]);

  function findColumn(aliases) {
    for (const [, normalizedAlias] of aliasesFor(aliases)) {
      const key = exact.get(normalizedAlias);
      if (key) return key;
    }

    for (const [key, normalizedKey] of normalizedKeys) {
      for (const [, normalizedAlias] of aliasesFor(aliases)) {
        if (normalizedKey.includes(normalizedAlias) || normalizedAlias.includes(normalizedKey)) return key;
      }
    }

    return '';
  }

  function text(aliases, fallback = '') {
    const key = findColumn(aliases);
    return key ? cleanText(row[key], fallback) : fallback;
  }

  function number(aliases) {
    const key = findColumn(aliases);
    return key ? safeNum(row[key]) : 0;
  }

  return { text, number, findColumn };
}

function pickAmount(reader, row) {
  for (const [source, aliases] of AMOUNT_ALIASES) {
    const key = reader.findColumn(aliases);
    if (!key) continue;

    const amount = safeNum(row[key]);
    if (amount > 0) return { amount, source };
  }

  return { amount: 0, source: 'missing' };
}

function personLabel(salespersonName, salespersonId, telesaleName, telesaleId) {
  if (salespersonName && salespersonId) return `${salespersonId} ${salespersonName}`;
  if (salespersonName) return salespersonName;
  if (salespersonId) return salespersonId;
  if (telesaleName && telesaleId) return `${telesaleId} ${telesaleName}`;
  return telesaleName || telesaleId || 'ไม่ระบุบุคคล';
}

function isCancelled(value) {
  const s = textValue(value).toLowerCase();
  return Boolean(s && s !== '0' && s !== 'false' && s !== 'no');
}

function parseSummaryRow(raw, rowNo, source) {
  const reader = createRowReader(raw);
  if (isCancelled(reader.text(TEXT_FIELDS.cancel))) return { skipped: 'cancelled' };

  const qtyPcs = safeQty(reader.number(QUANTITY_ALIASES));
  const picked = pickAmount(reader, raw);
  const skuCode = reader.text(TEXT_FIELDS.skuCode);
  const product = cleanText(reader.text(TEXT_FIELDS.product, skuCode), skuCode || 'ไม่ระบุสินค้า');

  if (qtyPcs <= 0 && picked.amount <= 0 && !product) return { skipped: 'empty' };

  const salespersonId = reader.text(TEXT_FIELDS.salespersonId);
  const salespersonName = reader.text(TEXT_FIELDS.salespersonName);
  const telesaleId = reader.text(TEXT_FIELDS.telesaleId);
  const telesaleName = reader.text(TEXT_FIELDS.telesaleName);

  return {
    row: {
      rowNo,
      source,
      type: reader.text(TEXT_FIELDS.type, 'ไม่ระบุประเภท'),
      store: cleanText(reader.text(TEXT_FIELDS.store), 'ไม่ระบุร้าน'),
      customerId: reader.text(TEXT_FIELDS.customerId),
      skuCode,
      product,
      qtyPcs,
      amount: Math.round((picked.amount + Number.EPSILON) * 100) / 100,
      amountSource: picked.source,
      salespersonId,
      salespersonName,
      telesaleId,
      telesaleName,
      personKey: personLabel(salespersonName, salespersonId, telesaleName, telesaleId),
      date: parseDate(reader.text(TEXT_FIELDS.date)),
      invoiceNo: reader.text(TEXT_FIELDS.invoiceNo),
    },
  };
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function attr(xml, name) {
  const match = xml.match(new RegExp(`${name}="([^"]*)"`));
  return match ? decodeXml(match[1]) : '';
}

async function rowsFromPivotCache(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const definitionPath = Object.keys(zip.files).find(name => name.startsWith('xl/pivotCache/pivotCacheDefinition') && name.endsWith('.xml'));
  if (!definitionPath) return null;

  const recordsPath = definitionPath.replace('pivotCacheDefinition', 'pivotCacheRecords');
  const definitionFile = zip.file(definitionPath);
  const recordsFile = zip.file(recordsPath);
  if (!definitionFile || !recordsFile) return null;

  const definitionXml = await definitionFile.async('string');
  const fields = [];
  const shared = [];

  for (const fieldMatch of definitionXml.matchAll(/<cacheField\b([^>]*)>([\s\S]*?)<\/cacheField>/g)) {
    fields.push(attr(fieldMatch[1], 'name'));
    const values = [];
    const sharedMatch = fieldMatch[2].match(/<sharedItems\b[^>]*>([\s\S]*?)<\/sharedItems>/);
    if (sharedMatch) {
      for (const itemMatch of sharedMatch[1].matchAll(/<(s|n|d|b|e|m)\b([^>]*)\/>/g)) {
        values.push(itemMatch[1] === 'm' ? '' : attr(itemMatch[2], 'v'));
      }
    }
    shared.push(values);
  }

  const recordsXml = await recordsFile.async('string');
  const rows = [];
  let rowNo = 0;

  for (const rowMatch of recordsXml.matchAll(/<r>([\s\S]*?)<\/r>/g)) {
    rowNo += 1;
    const obj = {};
    let columnIndex = 0;

    for (const cellMatch of rowMatch[1].matchAll(/<(x|n|s|d|b|e|m)\b([^>]*)\/>/g)) {
      const key = fields[columnIndex];
      if (key) {
        const tag = cellMatch[1];
        const value = attr(cellMatch[2], 'v');
        obj[key] = tag === 'x' ? (shared[columnIndex]?.[Number(value)] ?? '') : (tag === 'm' ? '' : value);
      }
      columnIndex += 1;
    }

    rows.push({ raw: obj, rowNo, source: 'pivotCache' });
  }

  return rows;
}

function rowsFromWorksheet(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', raw: false, cellDates: false, sheetRows: 0 });
  const rows = [];
  for (const sheetName of workbook.SheetNames) {
    const sheetRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '', raw: false });
    for (let i = 0; i < sheetRows.length; i += 1) rows.push({ raw: sheetRows[i], rowNo: i + 2, source: 'worksheet' });
  }
  return rows;
}

function counterTop(map, limit = 12) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function checkPrintGuardrails() {
  const js = fileText('dist/assets/pro-print-store-bills.js');
  const css = fileText('dist/assets/pro-print.css');
  return {
    billRows12: js.includes('const BILL_ROWS = 12'),
    billsPerA4Two: js.includes('const BILLS_PER_A4 = 2'),
    editKeyStable: js.includes("const EDIT_KEY = 'doit-pro-print-price-edits-v1'"),
    a4Css: css.includes('@page') && css.includes('.printMobileSafeA4'),
  };
}

function summarize(rows, parseSource) {
  const parsed = [];
  const skipped = { cancelled: 0, empty: 0 };
  const stores = new Set();
  const invoices = new Set();
  const products = new Set();
  const dates = [];
  const byPs = new Map();
  const byType = new Map();
  const amountSources = new Map();
  let telesaleRows = 0;
  let totalQty = 0;
  let totalAmount = 0;

  for (const item of rows) {
    const result = parseSummaryRow(item.raw, item.rowNo, item.source);
    if (result.skipped) {
      skipped[result.skipped] = (skipped[result.skipped] || 0) + 1;
      continue;
    }

    const row = result.row;
    parsed.push(row);
    stores.add(row.store);
    if (row.invoiceNo) invoices.add(row.invoiceNo);
    if (row.skuCode || row.product) products.add(row.skuCode || row.product);
    if (row.date) dates.push(row.date);
    if (row.personKey) byPs.set(row.personKey, (byPs.get(row.personKey) || 0) + 1);
    if (row.type) byType.set(row.type, (byType.get(row.type) || 0) + 1);
    if (row.amountSource) amountSources.set(row.amountSource, (amountSources.get(row.amountSource) || 0) + 1);
    if (row.telesaleId || row.telesaleName) telesaleRows += 1;
    totalQty += row.qtyPcs;
    totalAmount += row.amount;
  }

  const printGuardrails = checkPrintGuardrails();
  for (const [key, ok] of Object.entries(printGuardrails)) {
    if (!ok) fail(`Print guardrail failed: ${key}`);
  }

  if (!parsed.length) fail('No parsed rows were produced from the DOIT file.');
  if (!stores.size) fail('No store names were detected.');
  if (!products.size) fail('No product/SKU values were detected.');
  if (!invoices.size) fail('No invoice/order numbers were detected.');

  return {
    file: {
      name: path.basename(absoluteInput),
      sizeBytes: fs.statSync(absoluteInput).size,
      parseSource,
    },
    rows: {
      raw: rows.length,
      parsed: parsed.length,
      skipped,
    },
    counts: {
      stores: stores.size,
      invoices: invoices.size,
      products: products.size,
      ps: byPs.size,
      telesaleRows,
    },
    totals: {
      qtyPcs: totalQty,
      amount: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
    },
    dates: dates.length ? { min: dates.sort()[0], max: dates[dates.length - 1] } : { min: '', max: '' },
    topPs: counterTop(byPs),
    types: counterTop(byType),
    amountSources: counterTop(amountSources),
    printGuardrails,
    failures,
  };
}

async function main() {
  if (!fs.existsSync(absoluteInput)) {
    console.error(`File not found: ${absoluteInput}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(absoluteInput);
  const lowerName = absoluteInput.toLowerCase();
  let rows = null;
  let parseSource = 'worksheet';

  if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xlsm')) {
    rows = await rowsFromPivotCache(buffer);
    if (rows) parseSource = 'pivotCache';
  }

  if (!rows) rows = rowsFromWorksheet(buffer);

  const result = summarize(rows, parseSource);
  const output = JSON.stringify(result, null, 2);

  if (jsonPath) fs.writeFileSync(path.resolve(jsonPath), `${output}\n`);
  console.log(output);

  if (failures.length) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
