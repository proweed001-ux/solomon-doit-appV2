import { group, insertedGroups, sourceRows } from "./filters.js";
import {
  mapVal,
  parseKey,
  scope,
  scopeOk,
  state,
} from "./state.js";
import { N, SEP, T } from "./utils.js";

export const BILL_ROWS = 12;
export const BILLS_PER_A4 = 2;
export const PRINT_EDIT_KEY = "doit-pro-print-price-edits-v1";

export function editMap() {
  try {
    return JSON.parse(localStorage.getItem(PRINT_EDIT_KEY) || "{}");
  } catch {
    return {};
  }
}

export function lineKey(store, row) {
  return [scope(), store || "", row.code || "", row.name || ""].join(SEP);
}

export function lineVal(store, row) {
  const edit = editMap()[lineKey(store, row)] || null;
  const qty = edit ? N(edit.qty) : N(row.qty);
  const unit = edit ? N(edit.unit) : N(row.unit);
  return { qty, unit, total: qty * unit };
}

export function saveLineEdit(key, qty, unit) {
  if (!key) return;
  const edits = editMap();
  edits[key] = { qty: N(qty), unit: N(unit), ts: Date.now() };
  localStorage.setItem(PRINT_EDIT_KEY, JSON.stringify(edits));
}

function keyedStores() {
  const stores = new Set();
  Object.keys(state.send).forEach((key) => {
    const parsed = parseKey(key);
    if (scopeOk(parsed) && parsed.store) stores.add(parsed.store);
  });
  return [...stores];
}

function rowsForStore(store, pool) {
  return pool
    .map((grouped) => ({
      poolKey: grouped.poolKey,
      code: grouped.code || "",
      name: grouped.sku,
      qty: mapVal(state.send, grouped.poolKey, store),
      unit: N(grouped.netUnit) * 1.07,
    }))
    .filter((row) => T(row.name) && N(row.qty) > 0);
}

export function buildBills() {
  const pool = group(sourceRows()).concat(insertedGroups());
  const receivers = state.sel.receivers.filter(Boolean);
  const keyed = keyedStores();
  const stores = [
    ...receivers.filter((store) => keyed.includes(store)),
    ...keyed.filter((store) => !receivers.includes(store)),
  ];
  const bills = [];
  stores.forEach((store, storeSeq) => {
    const rows = rowsForStore(store, pool);
    if (!rows.length) return;
    const storeTotal = Math.floor(
      rows.reduce((sum, row) => sum + lineVal(store, row).total, 0),
    );
    const partCount = Math.ceil(rows.length / BILL_ROWS);
    for (let index = 0; index < rows.length; index += BILL_ROWS) {
      const partNo = Math.floor(index / BILL_ROWS) + 1;
      bills.push({
        store,
        rows: rows.slice(index, index + BILL_ROWS),
        storeTotal,
        startNo: index + 1,
        partNo,
        partCount,
        isLastStorePart: partNo === partCount,
        storeSeq,
      });
    }
  });
  return bills;
}

export function doneSummary() {
  const storeMap = new Map();
  const productMap = new Map();
  buildBills().forEach((bill) => {
    if (!storeMap.has(bill.storeSeq)) {
      storeMap.set(bill.storeSeq, { total: bill.storeTotal });
    }
    bill.rows.forEach((row) => {
      const value = lineVal(bill.store, row);
      let item = productMap.get(row.poolKey);
      if (!item) {
        item = { name: row.name, qty: 0, rawTotal: 0 };
        productMap.set(row.poolKey, item);
      }
      item.qty += value.qty;
      item.rawTotal += value.total;
    });
  });
  return {
    products: [...productMap.values()].sort((left, right) =>
      T(left.name).localeCompare(T(right.name), "th"),
    ),
    storeTotal: [...storeMap.values()].reduce(
      (sum, item) => sum + Math.floor(N(item.total)),
      0,
    ),
  };
}
