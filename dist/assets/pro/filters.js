import { state } from "./state.js";
import { N, T, uniq } from "./utils.js";

export function nt(row) {
  return !row.isTele;
}

export function okDate(row, ignore = false) {
  return (
    ignore || !state.sel.dates.length || state.sel.dates.includes(row.date)
  );
}

export function okPs(row) {
  return !state.sel.ps.length || state.sel.ps.includes(row.ps);
}

export function okCut(row) {
  return !state.sel.orderStores.includes(row.store);
}

export function okBrand(row) {
  return !state.sel.brands.length || state.sel.brands.includes(row.brand);
}

export function okType(row) {
  return !state.sel.types.length || state.sel.types.includes(row.type);
}

export function okQ(row) {
  const query = T(state.q).toLowerCase();
  return (
    !query ||
    [
      row.date,
      row.inv,
      row.code,
      row.sku,
      row.store,
      row.ps,
      row.brand,
      row.type,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );
}

export function sourceRows(options = {}) {
  return state.rows.filter(
    (row) =>
      nt(row) &&
      okDate(row, Boolean(options.ignoreDate)) &&
      okPs(row) &&
      okCut(row) &&
      okBrand(row) &&
      okType(row) &&
      okQ(row),
  );
}

export function teleRows() {
  return state.rows.filter((row) => row.isTele && okDate(row) && okPs(row));
}

export function optionRows() {
  return state.rows.filter((row) => nt(row) && okDate(row) && okPs(row));
}

export function options(kind) {
  const normalRows = state.rows.filter(nt);
  if (kind === "dates") return uniq(normalRows.map((row) => row.date)).sort();
  if (kind === "ps") {
    return uniq(
      normalRows.filter((row) => okDate(row)).map((row) => row.ps),
    ).sort((left, right) => left.localeCompare(right, "th"));
  }
  if (kind === "orderStores" || kind === "receivers") {
    return uniq(optionRows().map((row) => row.store)).sort((left, right) =>
      left.localeCompare(right, "th"),
    );
  }
  if (kind === "brands") {
    return uniq(
      optionRows()
        .filter(okCut)
        .map((row) => row.brand),
    ).sort((left, right) => left.localeCompare(right, "th"));
  }
  if (kind === "types") {
    return uniq(
      optionRows()
        .filter(okCut)
        .map((row) => row.type),
    ).sort();
  }
  return [];
}

export function pkey(row) {
  return [row.brand, row.size, row.code || row.sku, row.sku, row.type].join(
    "|",
  );
}

export function group(rows) {
  const groups = new Map();
  rows.forEach((row) => {
    const key = pkey(row);
    let group = groups.get(key);
    if (!group) {
      group = {
        poolKey: key,
        brand: row.brand,
        size: row.size,
        code: row.code,
        sku: row.sku,
        type: row.type,
        qty: 0,
        amt: 0,
        rawAmt: 0,
        netAmt: 0,
        unit: 0,
        netUnit: 0,
        bills: new Set(),
        stores: new Map(),
        rows: [],
        inserted: false,
      };
      groups.set(key, group);
    }
    group.qty += row.qty;
    group.amt += row.rawAmt;
    group.rawAmt += row.rawAmt;
    group.netAmt += row.netAmt;
    group.unit =
      group.qty && group.rawAmt ? group.rawAmt / group.qty : group.unit;
    group.netUnit =
      group.qty && group.netAmt ? group.netAmt / group.qty : group.netUnit;
    group.bills.add(row.inv);
    group.stores.set(row.store, (group.stores.get(row.store) || 0) + row.qty);
    group.rows.push(row);
  });
  return [...groups.values()].sort(
    (left, right) =>
      left.brand.localeCompare(right.brand, "th") ||
      left.size.localeCompare(right.size, "th") ||
      left.sku.localeCompare(right.sku, "th"),
  );
}

export function insertedGroups() {
  return (state.ins || []).map((item) => ({
    poolKey: T(item.id),
    brand: "แทรกสินค้า",
    size: "เพิ่มเอง",
    code: T(item.code) || "INSERT",
    sku: T(item.name) || "สินค้าแทรก",
    type: "INSERT",
    qty: N(item.qty),
    amt: N(item.qty) * N(item.unit),
    rawAmt: N(item.qty) * N(item.unit),
    netAmt: N(item.qty) * N(item.unit),
    unit: N(item.unit),
    netUnit: N(item.unit),
    bills: new Set(["เพิ่มเอง"]),
    stores: new Map(),
    rows: [],
    inserted: true,
  }));
}

export function pickPool() {
  return group(sourceRows()).concat(insertedGroups());
}

export function distPool() {
  return group(sourceRows({ ignoreDate: true }));
}

export function shipPool() {
  const receiver =
    state.sel.receivers.length === 1 ? state.sel.receivers[0] : "";
  return receiver
    ? group(sourceRows().filter((row) => row.store === receiver))
    : [];
}
