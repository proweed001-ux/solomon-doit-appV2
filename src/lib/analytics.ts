import type { AggregateRow, BillLine, Filters, ParsedRow } from '../types';
import { roundMoney, unitPriceFromAmount } from './pricing';

export const emptyFilters: Filters = {
  person: '',
  store: '',
  type: '',
  area: '',
  channel: '',
  category: '',
  brand: '',
  search: '',
};

export function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

export function applyFilters(rows: ParsedRow[], filters: Filters): ParsedRow[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter(row => {
    if (filters.person && row.personKey !== filters.person) return false;
    if (filters.store && row.store !== filters.store) return false;
    if (filters.type && row.type !== filters.type) return false;
    if (filters.area && row.area !== filters.area) return false;
    if (filters.channel && row.channel !== filters.channel) return false;
    if (filters.category && row.category !== filters.category) return false;
    if (filters.brand && row.brand !== filters.brand) return false;
    if (q) {
      const hay = [
        row.store,
        row.customerId,
        row.sku,
        row.skuCode,
        row.product,
        row.personKey,
        row.salespersonId,
        row.salespersonName,
        row.area,
        row.territory,
        row.channel,
        row.category,
        row.brand,
        row.invoiceNo,
        row.shipperId,
        row.type,
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.map(v => v.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'th'));
}

export function aggregateBy(
  rows: ParsedRow[],
  keyOf: (row: ParsedRow) => string,
  labelOf?: (row: ParsedRow) => string
): AggregateRow[] {
  const map = new Map<string, {
    label: string;
    rows: number;
    qtyPcs: number;
    correctAmount: number;
    stores: Set<string>;
    skus: Set<string>;
    people: Set<string>;
    invoices: Set<string>;
    types: Set<string>;
  }>();

  for (const row of rows) {
    const key = keyOf(row) || 'ไม่ระบุ';
    const label = labelOf ? labelOf(row) || key : key;
    const item = map.get(key) ?? {
      label,
      rows: 0,
      qtyPcs: 0,
      correctAmount: 0,
      stores: new Set<string>(),
      skus: new Set<string>(),
      people: new Set<string>(),
      invoices: new Set<string>(),
      types: new Set<string>(),
    };
    item.rows += 1;
    item.qtyPcs += row.qtyPcs;
    item.correctAmount += row.correctAmount;
    item.stores.add(row.store);
    item.skus.add(row.skuCode || row.sku);
    item.people.add(row.personKey);
    if (row.invoiceNo) item.invoices.add(row.invoiceNo);
    if (row.type) item.types.add(row.type);
    map.set(key, item);
  }

  return [...map.entries()].map(([key, item]) => ({
    key,
    label: item.label,
    rows: item.rows,
    qtyPcs: item.qtyPcs,
    correctAmount: roundMoney(item.correctAmount),
    unitPrice: unitPriceFromAmount(item.correctAmount, item.qtyPcs),
    stores: item.stores.size,
    skus: item.skus.size,
    people: item.people.size,
    invoices: item.invoices.size,
    types: [...item.types].sort((a, b) => a.localeCompare(b, 'th')),
  })).sort((a, b) => b.correctAmount - a.correctAmount);
}

export function buildBillLines(rows: ParsedRow[]): BillLine[] {
  const map = new Map<string, BillLine>();

  for (const row of rows) {
    if (row.qtyPcs <= 0 && row.correctAmount <= 0) continue;
    const key = `${row.store}||${row.sku}`;
    const old = map.get(key);

    if (!old) {
      map.set(key, {
        store: row.store,
        customerId: row.customerId,
        sku: row.sku,
        skuCode: row.skuCode,
        product: row.product,
        qtyPcs: row.qtyPcs,
        correctAmount: roundMoney(row.correctAmount),
        unitPrice: unitPriceFromAmount(row.correctAmount, row.qtyPcs),
        priceSource: row.priceSource,
        personKey: row.personKey,
        salespersonId: row.salespersonId,
        salespersonName: row.salespersonName,
        area: row.area,
        territory: row.territory,
        channel: row.channel,
        category: row.category,
        brand: row.brand,
        types: row.type ? [row.type] : [],
        invoices: row.invoiceNo ? [row.invoiceNo] : [],
      });
    } else {
      old.qtyPcs += row.qtyPcs;
      old.correctAmount = roundMoney(old.correctAmount + row.correctAmount);
      old.unitPrice = unitPriceFromAmount(old.correctAmount, old.qtyPcs);
      if (row.type && !old.types.includes(row.type)) old.types.push(row.type);
      if (row.invoiceNo && !old.invoices.includes(row.invoiceNo)) old.invoices.push(row.invoiceNo);
      if (old.priceSource === 'missing' && row.priceSource !== 'missing') old.priceSource = row.priceSource;
    }
  }

  return [...map.values()].sort((a, b) => {
    const s = a.store.localeCompare(b.store, 'th');
    if (s !== 0) return s;
    return a.sku.localeCompare(b.sku, 'th');
  });
}

export function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = String(value ?? '');
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\n');
}

export function downloadCsv(fileName: string, csv: string): void {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function rowToExport(row: ParsedRow): Record<string, unknown> {
  return {
    rowNo: row.rowNo,
    date: row.date,
    type: row.type,
    salespersonId: row.salespersonId,
    salespersonName: row.salespersonName,
    person: row.personKey,
    area: row.area,
    territory: row.territory,
    channel: row.channel,
    store: row.store,
    customerId: row.customerId,
    skuCode: row.skuCode,
    product: row.product,
    brand: row.brand,
    category: row.category,
    qtyPcs: row.qtyPcs,
    correctAmount: row.correctAmount,
    unitPrice: row.unitPrice,
    priceSource: row.priceSource,
    invoiceNo: row.invoiceNo,
    shipperId: row.shipperId,
    lineRef: row.lineRef,
  };
}

export function aggregateToExport(row: AggregateRow): Record<string, unknown> {
  return {
    label: row.label,
    rows: row.rows,
    qtyPcs: row.qtyPcs,
    correctAmount: row.correctAmount,
    unitPrice: row.unitPrice,
    stores: row.stores,
    skus: row.skus,
    people: row.people,
    invoices: row.invoices,
    types: row.types.join('|'),
  };
}
