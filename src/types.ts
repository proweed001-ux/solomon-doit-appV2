export type PriceSource =
  | 'TotInvc'
  | 'InvoiceAmt'
  | 'LineAmtBeforeDisc'
  | 'Correct Amount'
  | 'Amount'
  | 'Amt'
  | 'detailAmt'
  | 'row.amt'
  | 'missing';

export type ParsedRow = {
  rowNo: number;
  type: string;
  store: string;
  customerId: string;
  sku: string;
  skuCode: string;
  product: string;
  qtyPcs: number;
  correctAmount: number;
  unitPrice: number;
  priceSource: PriceSource;
  salespersonId: string;
  salespersonName: string;
  personKey: string;
  telesaleId: string;
  telesaleName: string;
  territory: string;
  territoryDesc: string;
  area: string;
  channel: string;
  subChannel: string;
  category: string;
  brand: string;
  brandForm: string;
  date: string;
  invoiceNo: string;
  shipperId: string;
  lineRef: string;
  source: 'pivotCache' | 'worksheet';
  raw: Record<string, unknown>;
};

export type BillLine = {
  receiverKey: string;
  receiverLabel: string;
  store: string;
  customerId: string;
  sku: string;
  skuCode: string;
  product: string;
  qtyPcs: number;
  correctAmount: number;
  unitPrice: number;
  priceSource: PriceSource;
  personKey: string;
  salespersonId: string;
  salespersonName: string;
  area: string;
  territory: string;
  channel: string;
  category: string;
  brand: string;
  types: string[];
  invoices: string[];
};

export type Filters = {
  person: string;
  store: string;
  type: string;
  area: string;
  channel: string;
  category: string;
  brand: string;
  search: string;
};

export type AggregateRow = {
  key: string;
  label: string;
  rows: number;
  qtyPcs: number;
  correctAmount: number;
  unitPrice: number;
  stores: number;
  skus: number;
  people: number;
  invoices: number;
  types: string[];
};

export type AppMode = 'upload' | 'dashboard' | 'people' | 'stores' | 'skus' | 'tod' | 'bill' | 'issues';
