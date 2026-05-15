import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import type { ParsedRow, PriceSource } from '../types';
import { roundMoney, safeNum, safeQty, unitPriceFromAmount } from './pricing';

function normKey(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[_\-./()]/g, '')
    .trim();
}

function toText(value: unknown): string {
  if (value == null) return '';
  return String(value).trim();
}

function decodeXmlAttr(value: string): string {
  return String(value || '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function getXmlAttr(attrs: string, name: string): string {
  const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return m ? decodeXmlAttr(m[1]) : '';
}

function clean(value: unknown, fallback = ''): string {
  const text = toText(value);
  return text || fallback;
}

function cleanStore(value: unknown): string {
  return clean(value, 'ไม่ระบุร้าน');
}

function cleanPerson(name: string, id: string, telesaleName = '', telesaleId = ''): string {
  const n = clean(name);
  const i = clean(id);
  const tn = clean(telesaleName);
  const ti = clean(telesaleId);
  if (n && i) return `${i} ${n}`;
  if (n) return n;
  if (i) return i;
  if (tn && ti) return `${ti} ${tn}`;
  if (tn) return tn;
  if (ti) return ti;
  return 'ไม่ระบุบุคคล';
}

function findColumn(row: Record<string, unknown>, aliases: string[]): string | null {
  const keys = Object.keys(row);
  const normalized = new Map(keys.map(k => [normKey(k), k]));

  for (const alias of aliases) {
    const direct = normalized.get(normKey(alias));
    if (direct) return direct;
  }

  for (const key of keys) {
    const nk = normKey(key);
    for (const alias of aliases) {
      const na = normKey(alias);
      if (nk.includes(na) || na.includes(nk)) return key;
    }
  }

  return null;
}

function pickText(row: Record<string, unknown>, aliases: string[], fallback = ''): string {
  const key = findColumn(row, aliases);
  return key ? clean(row[key], fallback) : fallback;
}

function pickNumber(row: Record<string, unknown>, aliases: string[]): number {
  const key = findColumn(row, aliases);
  return key ? safeNum(row[key]) : 0;
}

function pickAmount(row: Record<string, unknown>): { amount: number; source: PriceSource } {
  const ordered: Array<[PriceSource, string[]]> = [
    ['TotInvc', ['TotInvc', 'Total Invoice', 'TotalInvoice']],
    ['InvoiceAmt', ['InvoiceAmt', 'Invoice Amt', 'Invoice_Amt', 'Invoice Amount', 'InvAmt']],
    ['LineAmtBeforeDisc', ['LineAmtBeforeDisc', 'Line Amt Before Disc', 'Line Amount Before Disc']],
    ['Correct Amount', ['Correct Amount', 'CorrectAmount', 'Line Amount', 'LineAmount']],
    ['Amount', ['Amount', 'Total Amount', 'Net Amount', 'NetAmount']],
    ['Amt', ['Amt', 'amt']],
    ['detailAmt', ['detailAmt', 'DetailAmt', 'Detail Amount']],
    ['row.amt', ['row.amt', 'row_amt']],
  ];

  for (const [source, aliases] of ordered) {
    const key = findColumn(row, aliases);
    if (!key) continue;
    const amount = safeNum(row[key]);
    if (amount > 0) return { amount, source };
  }

  return { amount: 0, source: 'missing' };
}

function normalizeDate(value: unknown): string {
  const text = toText(value);
  if (!text) return '';
  const n = Number(text);
  if (Number.isFinite(n) && n > 25000 && n < 80000) {
    const d = new Date(Date.UTC(1899, 11, 30 + Math.floor(n)));
    return d.toISOString().slice(0, 10);
  }
  const d = new Date(text);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return text;
}

export async function parseDataFile(file: File): Promise<ParsedRow[]> {
  const buf = await file.arrayBuffer();
  const name = file.name.toLowerCase();

  if (name.endsWith('.xlsx') || name.endsWith('.xlsm')) {
    const pivotRows = await parsePivotCacheRows(buf);
    if (pivotRows.length > 0) return pivotRows;
  }

  return parseWorksheetRows(buf, name);
}

async function parsePivotCacheRows(buf: ArrayBuffer): Promise<ParsedRow[]> {
  const zip = await JSZip.loadAsync(buf);
  const defName = Object.keys(zip.files).find(name => name.startsWith('xl/pivotCache/pivotCacheDefinition') && name.endsWith('.xml'));
  if (!defName) return [];
  const recName = defName.replace('pivotCacheDefinition', 'pivotCacheRecords');
  const defFile = zip.file(defName);
  const recFile = zip.file(recName);
  if (!defFile || !recFile) return [];

  const defXml = await defFile.async('string');
  const fieldNames: string[] = [];
  const sharedItems: string[][] = [];

  const fieldRegex = /<cacheField\b([^>]*)>([\s\S]*?)<\/cacheField>/g;
  let fieldMatch: RegExpExecArray | null;
  while ((fieldMatch = fieldRegex.exec(defXml))) {
    const attrs = fieldMatch[1] || '';
    const body = fieldMatch[2] || '';
    fieldNames.push(getXmlAttr(attrs, 'name'));

    const values: string[] = [];
    const sharedMatch = body.match(/<sharedItems\b[^>]*>([\s\S]*?)<\/sharedItems>/);
    if (sharedMatch) {
      const itemRegex = /<(s|n|d|b|e|m)\b([^>]*)\/>/g;
      let itemMatch: RegExpExecArray | null;
      while ((itemMatch = itemRegex.exec(sharedMatch[1]))) {
        values.push(itemMatch[1] === 'm' ? '' : getXmlAttr(itemMatch[2], 'v'));
      }
    }
    sharedItems.push(values);
  }

  const indexOf = (aliases: string[]) => {
    const normalized = fieldNames.map(normKey);
    for (const alias of aliases) {
      const n = normKey(alias);
      const idx = normalized.findIndex(f => f === n);
      if (idx >= 0) return idx;
    }
    for (const alias of aliases) {
      const n = normKey(alias);
      const idx = normalized.findIndex(f => f.includes(n) || n.includes(f));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const idx = {
    store: indexOf(['ShipName', 'c_Name', 'Customer Name', 'CustomerName']),
    customerId: indexOf(['cID', 'ShiptoID', 'CustomerID']),
    skuCode: indexOf(['SKU_Code', 'SKU Code', 'SKUCode']),
    skuDesc: indexOf(['SKU_Desc', 'SKU Desc', 'SKU Description', 'ProductName']),
    qty: indexOf(['ShipQtyPCS', 'QtyShipPCS', 'Qty PCS']),
    amount: indexOf(['TotInvc', 'TotalInvoice']),
    fallbackAmount: indexOf(['LineAmtBeforeDisc', 'Line Amount Before Disc']),
    type: indexOf(['SOTypeID', 'SO Type ID']),
    cancelled: indexOf(['Cancelled']),
    salespersonName: indexOf(['Salesperson_Name', 'Salesperson Name']),
    salespersonId: indexOf(['SalespersonID', 'SO_SalespersonID', 'SO Salesperson ID']),
    telesaleId: indexOf(['TelesaleId', 'TelesaleID']),
    telesaleName: indexOf(['TelesaleName', 'Telesale Name']),
    territory: indexOf(['Territory']),
    territoryDesc: indexOf(['Territory_Desc', 'Territory Desc']),
    area: indexOf(['Area']),
    channel: indexOf(['ChannelDescr', 'Global_Channel', 'Channel']),
    subChannel: indexOf(['Global_Sub_Channel', 'Sub Channel']),
    category: indexOf(['Category', 'TAS_Category', 'GroupCategory']),
    brand: indexOf(['Brand', 'TAS_Brand', 'GroupBrand']),
    brandForm: indexOf(['BrandForm', 'TAS_BrandForm']),
    date: indexOf(['InvcDate', 'InvoiceDate', 'ShipDateAct', 'OrdDate']),
    invoiceNo: indexOf(['InvcNbr', 'InvoiceNo', 'Invoice No']),
    shipperId: indexOf(['ShipperID', 'Shipper ID']),
    lineRef: indexOf(['LineRef', 'Line Ref']),
  };

  if (idx.qty < 0 || idx.amount < 0 || idx.skuCode < 0) return [];

  const wanted = new Set(Object.values(idx).filter(i => i >= 0));
  const recordsXml = await recFile.async('string');
  const rows: ParsedRow[] = [];
  const recordRegex = /<r>([\s\S]*?)<\/r>/g;
  let recMatch: RegExpExecArray | null;
  let recordNo = 0;

  while ((recMatch = recordRegex.exec(recordsXml))) {
    recordNo += 1;
    const body = recMatch[1] || '';
    const values: Record<number, string> = {};
    const cellRegex = /<(x|n|s|d|b|e|m)\b([^>]*)\/>/g;
    let cellMatch: RegExpExecArray | null;
    let col = 0;

    while ((cellMatch = cellRegex.exec(body))) {
      if (wanted.has(col)) {
        const tag = cellMatch[1];
        const attrs = cellMatch[2] || '';
        const raw = getXmlAttr(attrs, 'v');
        if (tag === 'x') {
          const sharedIdx = Number(raw);
          values[col] = Number.isFinite(sharedIdx) ? (sharedItems[col]?.[sharedIdx] ?? '') : '';
        } else if (tag === 'm') {
          values[col] = '';
        } else {
          values[col] = raw;
        }
      }
      col += 1;
    }

    const cancelled = toText(values[idx.cancelled]);
    if (cancelled && cancelled !== '0' && cancelled.toLowerCase() !== 'false') continue;

    const qtyPcs = safeQty(values[idx.qty]);
    let amount = safeNum(values[idx.amount]);
    let source: PriceSource = 'TotInvc';
    if (amount <= 0 && idx.fallbackAmount >= 0) {
      amount = safeNum(values[idx.fallbackAmount]);
      source = 'LineAmtBeforeDisc';
    }

    if (qtyPcs <= 0 || amount <= 0) continue;

    const skuCode = clean(values[idx.skuCode]);
    const product = clean(values[idx.skuDesc], skuCode || 'ไม่ระบุสินค้า');
    const store = cleanStore(values[idx.store]);
    const salespersonId = clean(values[idx.salespersonId]);
    const salespersonName = clean(values[idx.salespersonName]);
    const telesaleId = clean(values[idx.telesaleId]);
    const telesaleName = clean(values[idx.telesaleName]);
    const personKey = cleanPerson(salespersonName, salespersonId, telesaleName, telesaleId);
    const sku = skuCode ? `${skuCode} ${product}`.trim() : product;

    rows.push({
      rowNo: recordNo,
      type: clean(values[idx.type], 'ไม่ระบุประเภท'),
      store,
      customerId: clean(values[idx.customerId]),
      sku,
      skuCode,
      product,
      qtyPcs,
      correctAmount: roundMoney(amount),
      unitPrice: unitPriceFromAmount(amount, qtyPcs),
      priceSource: source,
      salespersonId,
      salespersonName,
      personKey,
      telesaleId,
      telesaleName,
      territory: clean(values[idx.territory], 'ไม่ระบุเขต'),
      territoryDesc: clean(values[idx.territoryDesc]),
      area: clean(values[idx.area], 'ไม่ระบุพื้นที่'),
      channel: clean(values[idx.channel], 'ไม่ระบุช่องทาง'),
      subChannel: clean(values[idx.subChannel]),
      category: clean(values[idx.category], 'ไม่ระบุหมวด'),
      brand: clean(values[idx.brand], 'ไม่ระบุแบรนด์'),
      brandForm: clean(values[idx.brandForm]),
      date: normalizeDate(values[idx.date]),
      invoiceNo: clean(values[idx.invoiceNo]),
      shipperId: clean(values[idx.shipperId]),
      lineRef: clean(values[idx.lineRef]),
      source: 'pivotCache',
      raw: {
        source: 'pivotCache',
        store,
        salespersonId,
        salespersonName,
        area: clean(values[idx.area]),
        skuCode,
        product,
        qtyPcs,
        amount,
        type: clean(values[idx.type]),
        invoiceNo: clean(values[idx.invoiceNo]),
      },
    });
  }

  return rows;
}

function parseWorksheetRows(buf: ArrayBuffer, name: string): ParsedRow[] {
  const workbook = XLSX.read(buf, {
    type: 'array',
    raw: false,
    cellDates: false,
    sheetRows: name.endsWith('.csv') ? 0 : 10000,
  });

  const allRows: Record<string, unknown>[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
      raw: false,
    });

    for (const row of rows) allRows.push(row);
  }

  return normalizeRows(allRows);
}

export function normalizeRows(rows: Record<string, unknown>[]): ParsedRow[] {
  const parsed: ParsedRow[] = [];

  rows.forEach((row, index) => {
    const qtyPcs = safeQty(
      pickNumber(row, [
        'ShipQtyPCS', 'QtyShipPCS', 'Qty Ship PCS', 'Qty PCS', 'Qty_PCS', 'PCS', 'Qty', 'Quantity', 'จำนวน', 'จำนวนชิ้น',
      ])
    );
    const { amount, source } = pickAmount(row);

    const skuCode = pickText(row, ['SKU_Code', 'SKUCode', 'SKU Code', 'ItemCode', 'Item Code', 'ProductCode', 'Product Code', 'Material', 'Code']);
    const product = clean(pickText(row, ['SKU_Desc', 'SKU Desc', 'SKU / Product', 'SKU/Product', 'Product', 'ProductName', 'Product Name', 'Description', 'Item', 'ItemName', 'สินค้า', 'รายการสินค้า', 'SKU'], skuCode), skuCode || 'ไม่ระบุสินค้า');
    const sku = skuCode ? `${skuCode} ${product}`.trim() : product;
    const store = cleanStore(pickText(row, ['ShipName', 'c_Name', 'Store', 'StoreName', 'Store Name', 'Customer', 'CustomerName', 'Customer Name', 'ShipTo', 'Ship To', 'ShipToName', 'Outlet', 'ร้าน', 'ชื่อร้าน']));
    const salespersonId = pickText(row, ['SalespersonID', 'SO_SalespersonID', 'Salesperson ID']);
    const salespersonName = pickText(row, ['Salesperson_Name', 'Salesperson Name', 'SalespersonName']);
    const telesaleId = pickText(row, ['TelesaleId', 'TelesaleID']);
    const telesaleName = pickText(row, ['TelesaleName', 'Telesale Name']);
    const personKey = cleanPerson(salespersonName, salespersonId, telesaleName, telesaleId);
    const type = pickText(row, ['Type', 'SOTypeID', 'SO Type', 'SO_Type', 'Document Type', 'DocType'], 'ไม่ระบุประเภท');

    if (qtyPcs <= 0 && amount <= 0 && !product) return;

    parsed.push({
      rowNo: index + 2,
      type,
      store,
      customerId: pickText(row, ['cID', 'ShiptoID', 'CustomerID']),
      sku,
      skuCode,
      product,
      qtyPcs,
      correctAmount: roundMoney(amount),
      unitPrice: unitPriceFromAmount(amount, qtyPcs),
      priceSource: source,
      salespersonId,
      salespersonName,
      personKey,
      telesaleId,
      telesaleName,
      territory: pickText(row, ['Territory'], 'ไม่ระบุเขต'),
      territoryDesc: pickText(row, ['Territory_Desc', 'Territory Desc']),
      area: pickText(row, ['Area'], 'ไม่ระบุพื้นที่'),
      channel: pickText(row, ['ChannelDescr', 'Global_Channel', 'Channel'], 'ไม่ระบุช่องทาง'),
      subChannel: pickText(row, ['Global_Sub_Channel', 'Sub Channel']),
      category: pickText(row, ['Category', 'TAS_Category', 'GroupCategory'], 'ไม่ระบุหมวด'),
      brand: pickText(row, ['Brand', 'TAS_Brand', 'GroupBrand'], 'ไม่ระบุแบรนด์'),
      brandForm: pickText(row, ['BrandForm', 'TAS_BrandForm']),
      date: normalizeDate(pickText(row, ['InvcDate', 'InvoiceDate', 'ShipDateAct', 'OrdDate'])),
      invoiceNo: pickText(row, ['InvcNbr', 'InvoiceNo', 'Invoice No']),
      shipperId: pickText(row, ['ShipperID', 'Shipper ID']),
      lineRef: pickText(row, ['LineRef', 'Line Ref']),
      source: 'worksheet',
      raw: row,
    });
  });

  return parsed;
}
