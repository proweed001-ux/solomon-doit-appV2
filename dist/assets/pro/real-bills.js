import { B, E, F, N, SEP, T, dlabel, uniq } from "./utils.js";

export const REAL_BILL_SOURCE_PS = "PS";
export const REAL_BILL_SOURCE_TS = "TS";
export const REAL_BILL_PAGE_SIZE = 12;

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
    ps: T(row.ps),
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

function requiresRealBillSelection(selection, query) {
  return !(selection?.billStores || []).length && !T(query);
}

function candidateSignature(selection) {
  const sel = selection || {};
  return JSON.stringify([
    sel.dates || [],
    sel.ps || [],
    sel.orderStores || [],
  ]);
}

function filterSignature(selection, query) {
  const sel = selection || {};
  return JSON.stringify([
    sel.billStores || [],
    sel.brands || [],
    sel.types || [],
    T(query).toLowerCase(),
  ]);
}

function rowsContentSignature(rows) {
  let hash = 2166136261;
  (rows || []).forEach((row) => {
    [
      row.isTele ? "1" : "0",
      row.tele,
      row.store,
      row.inv,
      row.date,
      row.ps,
      row.code,
      row.sku,
      row.brand,
      row.type,
      row.qty,
      row.rawAmt,
      row.netAmt,
    ].forEach((value) => {
      const text = T(value);
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      hash ^= 31;
      hash = Math.imul(hash, 16777619);
    });
  });
  return (rows || []).length + ":" + (hash >>> 0).toString(36);
}

function rowsDataSignature(rows, rowsVersion) {
  return rowsVersion === undefined
    ? rowsContentSignature(rows)
    : T(rowsVersion) + ":" + (rows || []).length;
}

function selectionIgnoring(selection, kind) {
  const sel = selection || {};
  return {
    ...sel,
    dates: [...(sel.dates || [])],
    ps: [...(sel.ps || [])],
    orderStores: [...(sel.orderStores || [])],
    billStores: [...(sel.billStores || [])],
    brands: [...(sel.brands || [])],
    types: [...(sel.types || [])],
    [kind]: [],
  };
}

function optionSignature(kind, selection, query, dataSignature) {
  const sel = selectionIgnoring(selection, kind);
  return JSON.stringify([
    dataSignature,
    kind,
    sel.dates,
    sel.ps,
    sel.orderStores,
    sel.billStores,
    sel.brands,
    sel.types,
    T(query).toLowerCase(),
  ]);
}

export function selectRealBills(
  rows,
  selection,
  query,
  buildBills = buildRealBills,
) {
  if (requiresRealBillSelection(selection, query)) {
    return {
      candidateRows: [],
      allBills: [],
      bills: [],
      requiresSelection: true,
      resultKey: "selection-required",
    };
  }
  const candidateRows = realBillCandidateRows(rows, selection);
  const allBills = buildBills(candidateRows);
  return {
    candidateRows,
    allBills,
    bills: filterRealBills(allBills, selection, query),
    requiresSelection: false,
    resultKey:
      candidateSignature(selection) + "|" + filterSignature(selection, query),
  };
}

export function createRealBillSelector(buildBills = buildRealBills) {
  let rowsReference = null;
  let cachedRowsDataSignature = "";
  let cachedCandidateSignature = "";
  let cachedCandidateRows = [];
  let cachedCandidateBills = [];
  let candidateVersion = 0;
  let cachedFilterSignature = "";
  let cachedResult = null;
  const optionCache = new Map();
  const counters = {
    selectCalls: 0,
    candidateBuilds: 0,
    candidateCacheHits: 0,
    filteredBuilds: 0,
    filteredCacheHits: 0,
    optionModelRequests: 0,
    optionCandidateBuilds: 0,
    pickerOptionsBuilds: 0,
    pickerOptionsCacheHits: 0,
  };

  function hasCandidate(rows, selection, rowsVersion) {
    return (
      rowsReference === rows &&
      cachedRowsDataSignature === rowsDataSignature(rows, rowsVersion) &&
      cachedCandidateSignature === candidateSignature(selection)
    );
  }

  function ensureCandidate(rows, selection, rowsVersion) {
    counters.optionModelRequests += 1;
    const nextRowsDataSignature = rowsDataSignature(rows, rowsVersion);
    if (hasCandidate(rows, selection, rowsVersion)) {
      counters.candidateCacheHits += 1;
      return cachedCandidateBills;
    }
    rowsReference = rows;
    cachedRowsDataSignature = nextRowsDataSignature;
    cachedCandidateSignature = candidateSignature(selection);
    cachedCandidateRows = realBillCandidateRows(rows, selection);
    cachedCandidateBills = buildBills(cachedCandidateRows);
    candidateVersion += 1;
    counters.candidateBuilds += 1;
    cachedFilterSignature = "";
    cachedResult = null;
    optionCache.clear();
    return cachedCandidateBills;
  }

  function select(rows, selection, query, rowsVersion) {
    counters.selectCalls += 1;
    if (requiresRealBillSelection(selection, query)) {
      return {
        candidateRows: [],
        allBills: [],
        bills: [],
        requiresSelection: true,
        resultKey:
          "selection-required|" +
          rowsDataSignature(rows, rowsVersion) +
          "|" +
          candidateSignature(selection),
      };
    }
    const allBills = ensureCandidate(rows, selection, rowsVersion);
    const nextFilterSignature = filterSignature(selection, query);
    if (
      cachedResult &&
      cachedFilterSignature === nextFilterSignature
    ) {
      counters.filteredCacheHits += 1;
      return cachedResult;
    }
    counters.filteredBuilds += 1;
    cachedFilterSignature = nextFilterSignature;
    cachedResult = {
      candidateRows: cachedCandidateRows,
      allBills,
      bills: filterRealBills(allBills, selection, query),
      requiresSelection: false,
      resultKey: candidateVersion + "|" + nextFilterSignature,
    };
    return cachedResult;
  }

  function pickerOptions(kind, rows, selection, query, rowsVersion) {
    const dataSignature = rowsDataSignature(rows, rowsVersion);
    const key = optionSignature(kind, selection, query, dataSignature);
    if (optionCache.has(key)) {
      counters.pickerOptionsCacheHits += 1;
      return optionCache.get(key);
    }
    const optionSelection = selectionIgnoring(selection, kind);
    let optionBills;
    if (["dates", "ps", "orderStores"].includes(kind)) {
      counters.optionCandidateBuilds += 1;
      optionBills = buildBills(
        realBillCandidateRows(rows, optionSelection),
      );
    } else {
      optionBills = ensureCandidate(rows, optionSelection, rowsVersion);
    }
    counters.pickerOptionsBuilds += 1;
    const result = realBillPickerOptions(
      kind,
      rows,
      selection,
      optionBills,
      query,
    );
    if (optionCache.size >= 24) optionCache.clear();
    optionCache.set(key, result);
    return result;
  }

  function refreshFilters() {
    cachedFilterSignature = "";
    cachedResult = null;
    optionCache.clear();
  }

  function invalidate() {
    rowsReference = null;
    cachedRowsDataSignature = "";
    cachedCandidateSignature = "";
    cachedCandidateRows = [];
    cachedCandidateBills = [];
    cachedFilterSignature = "";
    cachedResult = null;
    optionCache.clear();
    candidateVersion += 1;
  }

  function stats() {
    return { ...counters };
  }

  return {
    candidateBills: ensureCandidate,
    hasCandidate,
    invalidate,
    pickerOptions,
    refreshFilters,
    select,
    stats,
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

function realBillStoreOptionsFromBills(bills) {
  const sources = new Map();
  (bills || []).forEach((bill) => {
    const store = T(bill.store);
    if (!store) return;
    if (!sources.has(store)) sources.set(store, new Set());
    sources.get(store).add(bill.sourceType);
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

export function realBillStoreOptions(rows, selection) {
  return realBillStoreOptionsFromBills(
    buildRealBills(realBillCandidateRows(rows, selection)),
  );
}

function billsForFacetOptions(bills, selection, kind, query) {
  const sel = selection || {};
  return (bills || []).filter(
    (bill) =>
      (kind === "billStores" ||
        !(sel.billStores || []).length ||
        sel.billStores.includes(bill.store)) &&
      (kind === "brands" ||
        !(sel.brands || []).length ||
        billHasFacet(bill, sel.brands || [], "brand")) &&
      (kind === "types" ||
        !(sel.types || []).length ||
        billHasFacet(bill, sel.types || [], "type")) &&
      billContains(bill, T(query).toLowerCase()),
  );
}

export function realBillPickerOptions(
  kind,
  rows,
  selection,
  candidateBills,
  query = "",
) {
  const optionSelection = selectionIgnoring(selection, kind);
  const bills = Array.isArray(candidateBills)
    ? candidateBills
    : buildRealBills(realBillCandidateRows(rows, optionSelection));
  const matchedBills = billsForFacetOptions(
    bills,
    selection,
    kind,
    query,
  );
  if (kind === "dates") {
    return uniq(matchedBills.map((bill) => bill.date))
      .sort()
      .map((value) => option(value, dlabel(value)));
  }
  if (kind === "ps") {
    return sortOptions(
      uniq(
        matchedBills.flatMap((bill) =>
          bill.lines.map((line) => line.ps),
        ),
      ).map(option),
    );
  }
  if (kind === "orderStores") {
    return sortOptions(
      uniq(matchedBills.map((bill) => bill.store)).map(option),
    );
  }
  if (kind === "billStores") {
    return realBillStoreOptionsFromBills(matchedBills);
  }
  if (kind === "brands") {
    return sortOptions(
      uniq(
        matchedBills.flatMap((bill) =>
          bill.lines.map((line) => line.brand),
        ),
      ).map(option),
    );
  }
  if (kind === "types") {
    return sortOptions(
      uniq(
        matchedBills.flatMap((bill) =>
          bill.lines.map((line) => line.type),
        ),
      ).map(option),
    );
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

export function realBillPageModel(
  bills,
  page = 1,
  pageSize = REAL_BILL_PAGE_SIZE,
) {
  const size = Math.max(1, N(pageSize) || REAL_BILL_PAGE_SIZE);
  const totalBills = (bills || []).length;
  const totalPages = Math.max(1, Math.ceil(totalBills / size));
  const currentPage = Math.min(Math.max(1, N(page) || 1), totalPages);
  const visibleBills = (bills || []).slice(
    (currentPage - 1) * size,
    currentPage * size,
  );
  return {
    currentPage,
    pageSize: size,
    totalBills,
    totalPages,
    visibleBills,
    visibleRows: visibleBills.reduce(
      (sum, bill) => sum + bill.lines.length,
      0,
    ),
  };
}

function realBillPagerHtml(model) {
  if (model.totalPages <= 1) return "";
  return (
    '<nav class="realBillPager" aria-label="หน้าบิลจริง"><button type="button" data-real-page="' +
    (model.currentPage - 1) +
    '"' +
    (model.currentPage <= 1 ? " disabled" : "") +
    ">ก่อนหน้า</button><span>หน้า " +
    F(model.currentPage) +
    "/" +
    F(model.totalPages) +
    " · " +
    F(model.totalBills) +
    ' บิล</span><button type="button" data-real-page="' +
    (model.currentPage + 1) +
    '"' +
    (model.currentPage >= model.totalPages ? " disabled" : "") +
    ">ถัดไป</button></nav>"
  );
}

function realBillCardsHtml(bills) {
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
        E(bill.date ? dlabel(bill.date) : "-") +
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

export function realBillsHtml(
  bills,
  requiresSelection = false,
  page = 1,
  pageSize = REAL_BILL_PAGE_SIZE,
) {
  if (requiresSelection) {
    return '<div class="empty realBillsEmpty">เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง</div>';
  }
  if (!bills.length) {
    return '<div class="empty realBillsEmpty">ไม่พบบิลจริงตามตัวเลือกหรือคำค้นหา</div>';
  }
  const model = realBillPageModel(bills, page, pageSize);
  return (
    realBillCardsHtml(model.visibleBills) +
    realBillPagerHtml(model)
  );
}

export function renderRealBills(
  container,
  result,
  {
    page = 1,
    pageSize = REAL_BILL_PAGE_SIZE,
    onPage = null,
  } = {},
) {
  if (!container) return null;
  const bills = result?.bills || [];
  const model = realBillPageModel(bills, page, pageSize);
  container.innerHTML = realBillsHtml(
    bills,
    Boolean(result?.requiresSelection),
    model.currentPage,
    model.pageSize,
  );
  container.dataset.totalBills = String(model.totalBills);
  container.dataset.renderedBills = String(model.visibleBills.length);
  container.dataset.renderedRows = String(model.visibleRows);
  container.querySelectorAll("[data-real-page]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled || !onPage) return;
      onPage(N(button.dataset.realPage) || 1);
    });
  });
  return model;
}
