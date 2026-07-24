import { B, E, F, N, SEP, T, dlabel, uniq } from "./utils.js";

export const REAL_BILL_SOURCE_PS = "PS";
export const REAL_BILL_SOURCE_TS = "TS";

function selected(values, value) {
  return !values.length || values.includes(value);
}

export function realBillCandidateRows(rows, selection) {
  const sel = selection || {};
  return (rows || []).filter(
    (row) =>
      selected(sel.dates || [], row.date) &&
      selected(sel.ps || [], row.ps) &&
      !(sel.orderStores || []).includes(row.store),
  );
}

export function realBillKey(row) {
  const sourceType = row.isTele ? REAL_BILL_SOURCE_TS : REAL_BILL_SOURCE_PS;
  const tele = sourceType === REAL_BILL_SOURCE_TS ? T(row.tele) : "";
  return [
    sourceType,
    T(row.store),
    T(row.inv),
    T(row.date),
    tele,
  ].join(SEP);
}

function billLine(row, sourceIndex) {
  const qty = N(row.qty);
  const raw = N(B(row.rawAmt));
  const vat = N(B((N(row.netAmt) || N(row.rawAmt)) * 1.07));
  return {
    sourceIndex,
    code: T(row.code),
    sku: T(row.sku),
    brand: T(row.brand),
    type: T(row.type),
    qty,
    rawAmt: N(row.rawAmt),
    netAmt: N(row.netAmt),
    shownQty: N(F(qty)),
    shownRaw: raw,
    shownVat: vat,
  };
}

function compareBills(left, right) {
  return (
    left.date.localeCompare(right.date) ||
    (left.sourceType === right.sourceType
      ? 0
      : left.sourceType === REAL_BILL_SOURCE_PS
        ? -1
        : 1) ||
    left.store.localeCompare(right.store, "th") ||
    left.inv.localeCompare(right.inv, "th") ||
    left.tele.localeCompare(right.tele, "th")
  );
}

export function buildRealBills(rows) {
  const bills = new Map();
  (rows || []).forEach((row, sourceIndex) => {
    const key = realBillKey(row);
    let bill = bills.get(key);
    if (!bill) {
      const sourceType = row.isTele
        ? REAL_BILL_SOURCE_TS
        : REAL_BILL_SOURCE_PS;
      bill = {
        key,
        sourceType,
        sourceLabel:
          sourceType === REAL_BILL_SOURCE_TS ? "Telesale (TS)" : "PS",
        store: T(row.store),
        inv: T(row.inv),
        displayInv: T(row.inv) || "-",
        date: T(row.date),
        ps: T(row.ps),
        tele: sourceType === REAL_BILL_SOURCE_TS ? T(row.tele) : "",
        lines: [],
        qty: 0,
        raw: 0,
        vat: 0,
      };
      bills.set(key, bill);
    }
    const line = billLine(row, sourceIndex);
    bill.lines.push(line);
    bill.qty += line.shownQty;
    bill.raw += line.shownRaw;
    bill.vat += line.shownVat;
  });
  return [...bills.values()].sort(compareBills);
}

function billContains(bill, query) {
  if (!query) return true;
  return [
    bill.store,
    bill.inv,
    bill.tele,
    ...bill.lines.flatMap((line) => [line.code, line.sku]),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function billHasFacet(bill, values, field) {
  return (
    !values.length ||
    bill.lines.some((line) => values.includes(line[field]))
  );
}

export function filterRealBills(bills, selection, query) {
  const sel = selection || {};
  const stores = sel.billStores || [];
  const q = T(query).toLowerCase();
  if (!stores.length && !q) return [];
  return (bills || []).filter(
    (bill) =>
      (!stores.length || stores.includes(bill.store)) &&
      billHasFacet(bill, sel.brands || [], "brand") &&
      billHasFacet(bill, sel.types || [], "type") &&
      billContains(bill, q),
  );
}

export function selectRealBills(rows, selection, query) {
  const candidateRows = realBillCandidateRows(rows, selection);
  const allBills = buildRealBills(candidateRows);
  return {
    candidateRows,
    allBills,
    bills: filterRealBills(allBills, selection, query),
    requiresSelection:
      !(selection?.billStores || []).length && !T(query),
  };
}

function option(value, label = value) {
  return { value: T(value), label: T(label) };
}

function sortOptions(values) {
  return values.sort((left, right) =>
    left.label.localeCompare(right.label, "th"),
  );
}

export function realBillStoreOptions(rows, selection) {
  const sel = selection || {};
  const qualifyingRows = realBillCandidateRows(rows, sel).filter(
    (row) =>
      selected(sel.brands || [], row.brand) &&
      selected(sel.types || [], row.type),
  );
  const sources = new Map();
  qualifyingRows.forEach((row) => {
    const store = T(row.store);
    if (!store) return;
    if (!sources.has(store)) sources.set(store, new Set());
    sources
      .get(store)
      .add(row.isTele ? REAL_BILL_SOURCE_TS : REAL_BILL_SOURCE_PS);
  });
  return sortOptions(
    [...sources.entries()].map(([store, kinds]) => {
      const suffix =
        kinds.size > 1
          ? " (PS+TS)"
          : kinds.has(REAL_BILL_SOURCE_TS)
            ? " (TS)"
            : "";
      return option(store, store + suffix);
    }),
  );
}

function rowsForOption(rows, selection, kind) {
  const sel = selection || {};
  return (rows || []).filter((row) => {
    if (kind !== "dates" && !selected(sel.dates || [], row.date)) return false;
    if (kind !== "ps" && !selected(sel.ps || [], row.ps)) return false;
    if (
      kind !== "orderStores" &&
      (sel.orderStores || []).includes(row.store)
    ) {
      return false;
    }
    if (kind !== "brands" && !selected(sel.brands || [], row.brand)) {
      return false;
    }
    if (kind !== "types" && !selected(sel.types || [], row.type)) return false;
    return true;
  });
}

export function realBillPickerOptions(kind, rows, selection) {
  if (kind === "billStores") return realBillStoreOptions(rows, selection);
  const optionRows = rowsForOption(rows, selection, kind);
  if (kind === "dates") {
    return uniq(optionRows.map((row) => row.date))
      .sort()
      .map((value) => option(value, dlabel(value)));
  }
  if (kind === "ps") {
    return sortOptions(uniq(optionRows.map((row) => row.ps)).map(option));
  }
  if (kind === "orderStores") {
    return sortOptions(uniq(optionRows.map((row) => row.store)).map(option));
  }
  if (kind === "brands") {
    return sortOptions(uniq(optionRows.map((row) => row.brand)).map(option));
  }
  if (kind === "types") {
    return sortOptions(uniq(optionRows.map((row) => row.type)).map(option));
  }
  return [];
}

export function splitRealBillsForPrint(bills, rowsPerPart = 12) {
  return (bills || []).flatMap((bill, billIndex) => {
    const partCount = Math.max(1, Math.ceil(bill.lines.length / rowsPerPart));
    return Array.from({ length: partCount }, (_, partIndex) => ({
      ...bill,
      billIndex,
      lines: bill.lines.slice(
        partIndex * rowsPerPart,
        (partIndex + 1) * rowsPerPart,
      ),
      startNo: partIndex * rowsPerPart + 1,
      partNo: partIndex + 1,
      partCount,
      isLastPart: partIndex + 1 === partCount,
    }));
  });
}

function billLinesHtml(bill) {
  return bill.lines
    .map(
      (line) =>
        "<tr><td>" +
        E(line.sku) +
        "</td><td>" +
        F(line.qty) +
        "</td><td>" +
        B(line.shownRaw) +
        "</td><td>" +
        B(line.shownVat) +
        "</td></tr>",
    )
    .join("");
}

export function realBillsHtml(bills, requiresSelection = false) {
  if (requiresSelection) {
    return '<div class="empty realBillsEmpty">เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง</div>';
  }
  if (!bills.length) {
    return '<div class="empty realBillsEmpty">ไม่พบบิลจริงตามตัวเลือกหรือคำค้นหา</div>';
  }
  return bills
    .map(
      (bill) =>
        '<article class="realBill" data-real-key="' +
        E(bill.key) +
        '" data-real-source="' +
        E(bill.sourceType) +
        '" data-real-store="' +
        E(bill.store) +
        '" data-real-inv="' +
        E(bill.displayInv) +
        '"><div class="realBillHead"><b>ประเภท: ' +
        E(bill.sourceLabel) +
        "</b><span>ร้าน: " +
        E(bill.store || "-") +
        "</span><small>บิล: " +
        E(bill.displayInv) +
        " · วันที่ " +
        E(dlabel(bill.date)) +
        (bill.tele ? " · Tele: " + E(bill.tele) : "") +
        '</small></div><div class="realBillTableWrap"><table class="realBillTable"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>' +
        billLinesHtml(bill) +
        '<tr class="totalRow realBillTotal"><td>รวมทั้งหมด</td><td>' +
        F(bill.qty) +
        "</td><td>" +
        B(bill.raw) +
        "</td><td>" +
        B(bill.vat) +
        "</td></tr></tbody></table></div></article>",
    )
    .join("");
}

export function renderRealBills(container, result) {
  if (!container) return;
  container.innerHTML = realBillsHtml(
    result?.bills || [],
    Boolean(result?.requiresSelection),
  );
}
