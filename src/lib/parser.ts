import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import type { ParsedRow, PriceSource } from '../types';
import { roundMoney, safeNum, safeQty, unitPriceFromAmount } from './pricing';

type RawRow = Record<string, unknown>;
type RowSource = 'pivotCache' | 'worksheet';

type AmountPick = {
  amount: number;
  source: PriceSource;
};

type PivotData = {
  fields: string[];
  shared: string[][];
  rows: ParsedRow[];
  score: number;
  path: string;
};

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

const AMOUNT_ALIASES: Array<[PriceSource, string[]]> = [
  ['TotInvc', ['TotInvc', 'TotalInvoice', 'Total Invoice']],
  ['Correct Amount', ['Correct Amount', 'CorrectAmount', 'LineAmount', 'Line Amount', 'LineAmt']],
  ['LineAmtBeforeDisc', ['LineAmtBeforeDisc', 'Line Amount Before Disc']],
  ['detailAmt', ['detailAmt', 'DetailAmt']],
  ['row.amt', ['row.amt', 'row_amt']],
  ['Amt', ['Amt', 'amt']],
  ['Amount', ['NetAmount', 'Net Amount', 'Amount']],
  ['InvoiceAmt', ['InvoiceAmt', 'Invoice Amount', 'InvAmt']],
];

const DOIT_FIELD_GROUPS = [
  QUANTITY_ALIASES,
  AMOUNT_ALIASES.flatMap(([, aliases]) => aliases),
  ['SOTypeID', 'SO Type', 'Type', 'Document Type'],
  ['SalespersonID', 'SO_SalespersonID', 'Salesperson_Name', 'Salesperson Name'],
  ['Customer Name', 'CustomerName', 'ShipName', 'c_Name', 'StoreName'],
  ['SKU_Code', 'SKUCode', 'SKU Code', 'TAS_THName', 'SKU_Desc'],
];

function normalizeKey(value: string): string {
  return String(value || '').toLowerCase().replace(/[\s_\-./()]/g, '').trim();
}

function textValue(value: unknown): string {
  return String(value ?? '').trim();
}

function hasRawValue(value: unknown): boolean {
  if (value == null) return false;
  const s = textValue(value);
  return s !== '' && s !== '-' && s !== '—';
}

function cleanText(value: unknown, fallback = ''): string {
  return textValue(value) || fallback;
}

function storeName(value: unknown): string {
  return cleanText(value, 'ไม่ระบุร้าน');
}

function isCancelled(value: unknown): boolean {
  const s = textValue(value).toLowerCase();
  return Boolean(s && s !== '0' && s !== 'false' && s !== 'no');
}

function personLabel(name: string, id: string, telesaleName = '', telesaleId = ''): string {
  const personName = cleanText(name);
  const personId = cleanText(id);
  const teleName = cleanText(telesaleName);
  const teleId = cleanText(telesaleId);

  if (personName && personId) return `${personId} ${personName}`;
  if (personName) return personName;
  if (personId) return personId;
  if (teleName && teleId) return `${teleId} ${teleName}`;
  return teleName || teleId || 'ไม่ระบุบุคคล';
}

function findColumn(row: RawRow, aliases: string[]): string {
  const keys = Object.keys(row);
  const exactMap = new Map(keys.map(key => [normalizeKey(key), key]));

  for (const alias of aliases) {
    const key = exactMap.get(normalizeKey(alias));
    if (key) return key;
  }

  for (const key of keys) {
    const normalizedKey = normalizeKey(key);
    for (const alias of aliases) {
      const normalizedAlias = normalizeKey(alias);
      if (normalizedKey.includes(normalizedAlias) || normalizedAlias.includes(normalizedKey)) return key;
    }
  }

  return '';
}

function text(row: RawRow, aliases: string[], fallback = ''): string {
  const key = findColumn(row, aliases);
  return key ? cleanText(row[key], fallback) : fallback;
}

function number(row: RawRow, aliases: string[]): number {
  const key = findColumn(row, aliases);
  return key ? safeNum(row[key]) : 0;
}

function pickAmount(row: RawRow): AmountPick {
  for (const [source, aliases] of AMOUNT_ALIASES) {
    const key = findColumn(row, aliases);
    if (!key) continue;
    if (!hasRawValue(row[key])) continue;

    return { amount: safeNum(row[key]), source };
  }

  return { amount: 0, source: 'missing' };
}

function parseDate(value: unknown): string {
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

function parseRow(raw: RawRow, index: number, source: RowSource): ParsedRow | null {
  if (isCancelled(text(raw, ['Cancelled', 'Cancel', 'IsCancelled', 'VoidFlag']))) return null;

  const qtyPcs = safeQty(number(raw, QUANTITY_ALIASES));
  const picked = pickAmount(raw);
  const skuCode = text(raw, ['SKU_Code', 'SKUCode', 'SKU Code', 'ItemCode', 'Item Code', 'ProductCode', 'Product Code', 'Material', 'Code']);
  const productRaw = text(raw, ['SKU_Desc', 'SKU Desc', 'TAS_THName', 'SKU / Product', 'SKU/Product', 'Product', 'ProductName', 'Product Name', 'Description', 'Item', 'ItemName', 'สินค้า', 'รายการสินค้า', 'SKU'], skuCode);
  const product = cleanText(productRaw, skuCode || 'ไม่ระบุสินค้า');

  if (qtyPcs === 0 && picked.amount === 0 && !productRaw && !skuCode) return null;

  const salespersonId = text(raw, ['SalespersonID', 'SO_SalespersonID', 'Salesperson ID']);
  const salespersonName = text(raw, ['Salesperson_Name', 'Salesperson Name', 'SalespersonName']);
  const telesaleId = text(raw, ['TelesaleId', 'TelesaleID']);
  const telesaleName = text(raw, ['TelesaleName', 'Telesale Name']);

  return {
    rowNo: index,
    type: text(raw, ['Type', 'SOTypeID', 'SO Type', 'SO_Type', 'Document Type', 'DocType'], 'ไม่ระบุประเภท'),
    store: storeName(text(raw, ['Customer Name', 'CustomerName', 'ShipName', 'c_Name', 'Store', 'StoreName', 'Store Name', 'Customer', 'ShipTo', 'Ship To', 'ShipToName', 'Outlet', 'ร้าน', 'ชื่อร้าน'])),
    customerId: text(raw, ['cID', 'ShiptoID', 'ShipToID', 'CustomerID', 'Customer ID']),
    sku: skuCode ? `${skuCode} ${product}`.trim() : product,
    skuCode,
    product,
    qtyPcs,
    correctAmount: roundMoney(picked.amount),
    unitPrice: unitPriceFromAmount(picked.amount, qtyPcs),
    priceSource: picked.source,
    salespersonId,
    salespersonName,
    personKey: personLabel(salespersonName, salespersonId, telesaleName, telesaleId),
    telesaleId,
    telesaleName,
    territory: text(raw, ['Territory'], 'ไม่ระบุเขต'),
    territoryDesc: text(raw, ['Territory_Desc', 'Territory Desc']),
    area: text(raw, ['Area'], 'ไม่ระบุพื้นที่'),
    channel: text(raw, ['ChannelDescr', 'Global_Channel', 'Channel'], 'ไม่ระบุช่องทาง'),
    subChannel: text(raw, ['Global_Sub_Channel', 'Sub Channel']),
    category: text(raw, ['Category', 'TAS_Category', 'GroupCategory'], 'ไม่ระบุหมวด'),
    brand: text(raw, ['Brand', 'TAS_Brand', 'GroupBrand'], 'ไม่ระบุแบรนด์'),
    brandForm: text(raw, ['BrandForm', 'TAS_BrandForm']),
    date: parseDate(text(raw, ['InvcDate', 'InvoiceDate', 'Invoice_Date', 'ShipDateAct', 'OrdDate', 'SO_Date'])),
    invoiceNo: text(raw, ['InvcNbr', 'InvoiceNo', 'Invoice No', 'Invoice_No', 'SO No', 'SONo', 'OrderNo']),
    shipperId: text(raw, ['ShipperID', 'Shipper ID']),
    lineRef: text(raw, ['LineRef', 'Line Ref']),
    source,
    raw,
  };
}

function decodeXml(value: string): string {
  return String(value || '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function attr(xml: string, name: string): string {
  const match = xml.match(new RegExp(`${name}="([^"]*)"`));
  return match ? decodeXml(match[1]) : '';
}

function hasField(fields: string[], aliases: string[]): boolean {
  const normalized = fields.map(normalizeKey);
  return aliases.some(alias => normalized.includes(normalizeKey(alias)));
}

function scorePivot(fields: string[], rows: ParsedRow[]): number {
  const fieldScore = DOIT_FIELD_GROUPS.reduce((score, aliases) => score + (hasField(fields, aliases) ? 10 : 0), 0);
  const amountScore = hasField(fields, ['TotInvc']) ? 15 : hasField(fields, ['Correct Amount', 'LineAmount', 'LineAmtBeforeDisc']) ? 10 : 0;
  const rowScore = Math.min(rows.length, 2000) / 100;
  return fieldScore + amountScore + rowScore;
}

export async function parseDataFile(file: File): Promise<ParsedRow[]> {
  const buffer = await file.arrayBuffer();
  const name = file.name.toLowerCase();

  if (name.endsWith('.xlsx') || name.endsWith('.xlsm')) {
    const pivotRows = await pivot(buffer);
    if (pivotRows.length) return pivotRows;
  }

  return sheet(buffer);
}

async function pivot(buffer: ArrayBuffer): Promise<ParsedRow[]> {
  const zip = await JSZip.loadAsync(buffer);
  const definitionPaths = Object.keys(zip.files).filter(name => name.startsWith('xl/pivotCache/pivotCacheDefinition') && name.endsWith('.xml'));
  const candidates: PivotData[] = [];

  for (const definitionPath of definitionPaths) {
    const recordsPath = definitionPath.replace('pivotCacheDefinition', 'pivotCacheRecords');
    const definitionFile = zip.file(definitionPath);
    const recordsFile = zip.file(recordsPath);
    if (!definitionFile || !recordsFile) continue;

    const definitionXml = await definitionFile.async('string');
    const fields: string[] = [];
    const shared: string[][] = [];

    for (const fieldMatch of definitionXml.matchAll(/<cacheField\b([^>]*)>([\s\S]*?)<\/cacheField>/g)) {
      fields.push(attr(fieldMatch[1], 'name'));
      const values: string[] = [];
      const sharedMatch = fieldMatch[2].match(/<sharedItems\b[^>]*>([\s\S]*?)<\/sharedItems>/);

      if (sharedMatch) {
        for (const itemMatch of sharedMatch[1].matchAll(/<(s|n|d|b|e|m)\b([^>]*)\/>/g)) {
          values.push(itemMatch[1] === 'm' ? '' : attr(itemMatch[2], 'v'));
        }
      }
      shared.push(values);
    }

    const recordsXml = await recordsFile.async('string');
    const rows: ParsedRow[] = [];
    let rowNumber = 0;

    for (const rowMatch of recordsXml.matchAll(/<r>([\s\S]*?)<\/r>/g)) {
      rowNumber += 1;
      const obj: RawRow = {};
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

      const parsed = parseRow(obj, rowNumber, 'pivotCache');
      if (parsed) rows.push(parsed);
    }

    candidates.push({ fields, shared, rows, score: scorePivot(fields, rows), path: definitionPath });
  }

  return candidates.sort((a, b) => b.score - a.score)[0]?.rows ?? [];
}

function sheet(buffer: ArrayBuffer): ParsedRow[] {
  const workbook = XLSX.read(buffer, { type: 'array', raw: false, cellDates: false, sheetRows: 0 });
  const allRows: RawRow[] = [];

  for (const sheetName of workbook.SheetNames) {
    allRows.push(...XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName], { defval: '', raw: false }));
  }

  return normalizeRows(allRows);
}

export function normalizeRows(rows: RawRow[]): ParsedRow[] {
  return rows
    .map((row, index) => parseRow(row, index + 2, 'worksheet'))
    .filter((row): row is ParsedRow => Boolean(row));
}
