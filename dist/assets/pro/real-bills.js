import { B, E, F, N, SEP, T, dlabel, uniq } from "./utils.js";

export const REAL_BILL_SOURCE_PS = "PS";
export const REAL_BILL_SOURCE_TS = "TS";
export const REAL_BILL_PAGE_SIZE = 12;
const OPTION_CACHE_MAX_ENTRIES = 8;
const OPTION_CACHE_MAX_VALUES = 20_000;
const FACET_CACHE_MAX_ENTRIES = 4;
const FACET_CACHE_MAX_VALUES = 20_000;

function valueSet(values) {
  return values instanceof Set ? values : new Set(values || []);
}

function selected(values, value) {
  return !values.size || values.has(value);
}

export function realBillCandidateRows(rows, selection) {
  const sel = selection || {};
  const dates = valueSet(sel.dates);
  const ps = valueSet(sel.ps);
  const orderStores = valueSet(sel.orderStores);
  if (!dates.size && !ps.size && !orderStores.size) return rows || [];
  return (rows || []).filter(
    (row) =>
      selected(dates, row.date) &&
      selected(ps, row.ps) &&
      !orderStores.has(row.store),
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
  const raw = roundDisplayedNumber(row.rawAmt, 2);
  const vat = roundDisplayedNumber(
    (N(row.netAmt) || N(row.rawAmt)) * 1.07,
    2,
  );
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
    shownQty: roundDisplayedNumber(qty, 3),
    shownRaw: raw,
    shownVat: vat,
  };
}

export function roundDisplayedNumber(value, digits = 2) {
  const number = N(value);
  const places = Math.max(0, Math.min(6, N(digits)));
  const factor = 10 ** places;
  const magnitude = Math.abs(number);
  const rounded = Math.round(
    (magnitude + Number.EPSILON * Math.max(1, magnitude)) * factor,
  );
  return (number < 0 ? -rounded : rounded) / factor;
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
        psValues: new Set(),
        tele: sourceType === REAL_BILL_SOURCE_TS ? T(row.tele) : "",
        lines: [],
        qty: 0,
        raw: 0,
        vat: 0,
        searchParts: new Set([
          T(row.store),
          T(row.inv),
          sourceType === REAL_BILL_SOURCE_TS ? T(row.tele) : "",
        ]),
      };
      bills.set(key, bill);
    }
    const line = billLine(row, sourceIndex);
    bill.psValues.add(line.ps);
    bill.lines.push(line);
    bill.qty += line.shownQty;
    bill.raw += line.shownRaw;
    bill.vat += line.shownVat;
    bill.searchParts.add(line.code);
    bill.searchParts.add(line.sku);
  });
  return [...bills.values()]
    .map((bill) => {
      bill.searchText = [...bill.searchParts].join(" ").toLowerCase();
      delete bill.searchParts;
      return bill;
    })
    .sort(compareBills);
}

function billContains(bill, query) {
  if (!query) return true;
  if (bill.searchText) return bill.searchText.includes(query);
  return [
    bill.store,
    bill.inv,
    bill.tele,
    ...(bill.lines || []).flatMap((line) => [line.code, line.sku]),
  ].join(" ").toLowerCase().includes(query);
}

function billHasFacet(bill, values, field) {
  return (
    !values.size ||
    billFacetValues(bill, field).some((value) => values.has(value))
  );
}

function billFacetValues(bill, field) {
  const indexed = bill[field + "Values"];
  if (indexed) return indexed instanceof Set ? [...indexed] : indexed;
  if (field === "ps" && bill.ps) return [bill.ps];
  return uniq((bill.lines || []).map((line) => line[field]));
}

function addFacetValue(values, value) {
  const text = T(value);
  if (!values.includes(text)) values.push(text);
}

export function buildRealBillFacetIndex(rows, sortBills = true) {
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
        store: T(row.store),
        inv: T(row.inv),
        date: T(row.date),
        tele: sourceType === REAL_BILL_SOURCE_TS ? T(row.tele) : "",
        psValues: [],
        brandValues: [],
        typeValues: [],
        rowIndexes: [],
        lineCount: 0,
        searchText: [
          T(row.store),
          T(row.inv),
          sourceType === REAL_BILL_SOURCE_TS ? T(row.tele) : "",
        ].join(" ").toLowerCase(),
      };
      bills.set(key, bill);
    }
    addFacetValue(bill.psValues, row.ps);
    addFacetValue(bill.brandValues, row.brand);
    addFacetValue(bill.typeValues, row.type);
    bill.rowIndexes.push(sourceIndex);
    bill.lineCount += 1;
    bill.searchText +=
      " " + T(row.code).toLowerCase() + " " + T(row.sku).toLowerCase();
  });
  const result = [...bills.values()];
  return sortBills ? result.sort(compareBills) : result;
}

export function filterRealBills(bills, selection, query) {
  const sel = selection || {};
  const stores = valueSet(sel.billStores);
  const brands = valueSet(sel.brands);
  const types = valueSet(sel.types);
  const q = T(query).toLowerCase();
  if (!stores.size && !q) return [];
  return (bills || []).filter(
    (bill) =>
      (!stores.size || stores.has(bill.store)) &&
      billHasFacet(bill, brands, "brand") &&
      billHasFacet(bill, types, "type") &&
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
  const allBills = buildRealBillFacetIndex(candidateRows);
  const matchedBills = filterRealBills(allBills, selection, query);
  const matchedKeys = new Set(matchedBills.map((bill) => bill.key));
  const matchedRows = candidateRows.filter((row) =>
    matchedKeys.has(realBillKey(row)),
  );
  return {
    candidateRows,
    allBills,
    bills: buildBills(matchedRows),
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
  let cachedCandidateFacets = [];
  let candidateVersion = 0;
  let cachedFilterSignature = "";
  let cachedResult = null;
  let cachedPageKey = "";
  let cachedPageResult = null;
  const optionCache = new Map();
  const facetIndexCache = new Map();
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
    facetIndexBuilds: 0,
    facetIndexCacheHits: 0,
    facetRowsScanned: 0,
    candidateRowsScanned: 0,
    resultRowsScanned: 0,
    matchedRowsBuilt: 0,
    matchedLightBills: 0,
    fullBillBuilds: 0,
    fullBillRowsBuilt: 0,
    fullBillPageBuilds: 0,
    fullBillPrintBuilds: 0,
    moneyFormatCalls: 0,
  };

  function hasCandidate(rows, selection, rowsVersion) {
    return (
      rowsReference === rows &&
      cachedRowsDataSignature === rowsDataSignature(rows, rowsVersion) &&
      cachedCandidateSignature === candidateSignature(selection)
    );
  }

  function cacheValueCount(value) {
    if (!Array.isArray(value)) return 0;
    return value.reduce((total, item) => {
      if (!item || typeof item !== "object") return total + 1;
      return (
        total +
        1 +
        ["psValues", "brandValues", "typeValues"].reduce(
          (sum, field) =>
            sum + (item[field]?.size ?? item[field]?.length ?? 0),
          0,
        )
      );
    }, 0);
  }

  function cacheValues(cache) {
    let total = 0;
    cache.forEach((value) => {
      total += cacheValueCount(value);
    });
    return total;
  }

  function cacheGet(cache, key) {
    if (!cache.has(key)) return null;
    const value = cache.get(key);
    cache.delete(key);
    cache.set(key, value);
    return value;
  }

  function cacheSet(cache, key, value, maxEntries, maxValues) {
    const entryValues = cacheValueCount(value);
    if (cache.has(key)) cache.delete(key);
    if (entryValues > maxValues) {
      return false;
    }
    while (
      cache.size &&
      (cache.size >= maxEntries ||
        cacheValues(cache) + entryValues > maxValues)
    ) {
      cache.delete(cache.keys().next().value);
    }
    cache.set(key, value);
    return true;
  }

  function rowsForLightBills(candidateRows, lightBills) {
    const rows = [];
    (lightBills || []).forEach((bill) => {
      (bill.rowIndexes || []).forEach((index) => {
        const row = candidateRows[index];
        if (row) rows.push(row);
      });
    });
    return rows;
  }

  function buildLightBills(candidateRows, lightBills, buildKind) {
    const rows = rowsForLightBills(candidateRows, lightBills);
    counters.fullBillBuilds += 1;
    counters.fullBillRowsBuilt += rows.length;
    if (buildKind === "page") counters.fullBillPageBuilds += 1;
    if (buildKind === "print") counters.fullBillPrintBuilds += 1;
    return buildBills(rows);
  }

  function ensureCandidateRows(rows, selection, rowsVersion) {
    counters.optionModelRequests += 1;
    const nextRowsDataSignature = rowsDataSignature(rows, rowsVersion);
    if (hasCandidate(rows, selection, rowsVersion)) {
      counters.candidateCacheHits += 1;
      return cachedCandidateRows;
    }
    rowsReference = rows;
    cachedRowsDataSignature = nextRowsDataSignature;
    cachedCandidateSignature = candidateSignature(selection);
    cachedCandidateRows = realBillCandidateRows(rows, selection);
    counters.candidateRowsScanned += (rows || []).length;
    cachedCandidateFacets = buildRealBillFacetIndex(
      cachedCandidateRows,
      false,
    );
    candidateVersion += 1;
    counters.candidateBuilds += 1;
    cachedFilterSignature = "";
    cachedResult = null;
    cachedPageKey = "";
    cachedPageResult = null;
    return cachedCandidateRows;
  }

  function ensureFacetIndex(rows, selection, rowsVersion) {
    const dataSignature = rowsDataSignature(rows, rowsVersion);
    const key = dataSignature + "|" + candidateSignature(selection);
    const cached = cacheGet(facetIndexCache, key);
    if (cached) {
      counters.facetIndexCacheHits += 1;
      return cached;
    }
    if (hasCandidate(rows, selection, rowsVersion)) {
      counters.facetIndexCacheHits += 1;
      return cachedCandidateFacets;
    }
    const candidateRows = realBillCandidateRows(rows, selection);
    counters.facetRowsScanned += (rows || []).length;
    const facets = buildRealBillFacetIndex(candidateRows, false);
    counters.facetIndexBuilds += 1;
    cacheSet(
      facetIndexCache,
      key,
      facets,
      FACET_CACHE_MAX_ENTRIES,
      FACET_CACHE_MAX_VALUES,
    );
    return facets;
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
    const candidateRows = ensureCandidateRows(rows, selection, rowsVersion);
    const nextFilterSignature = filterSignature(selection, query);
    if (
      cachedResult &&
      cachedFilterSignature === nextFilterSignature
    ) {
      counters.filteredCacheHits += 1;
      return cachedResult;
    }
    const matchedFacets = filterRealBills(
      cachedCandidateFacets,
      selection,
      query,
    ).sort(compareBills);
    counters.matchedLightBills += matchedFacets.length;
    counters.filteredBuilds += 1;
    cachedFilterSignature = nextFilterSignature;
    cachedPageKey = "";
    cachedPageResult = null;
    cachedResult = {
      candidateRows,
      allBills: matchedFacets,
      bills: matchedFacets,
      requiresSelection: false,
      resultKey: candidateVersion + "|" + nextFilterSignature,
    };
    return cachedResult;
  }

  function pickerOptions(kind, rows, selection, query, rowsVersion) {
    const dataSignature = rowsDataSignature(rows, rowsVersion);
    const key = optionSignature(kind, selection, query, dataSignature);
    const cached = cacheGet(optionCache, key);
    if (cached) {
      counters.pickerOptionsCacheHits += 1;
      return cached;
    }
    const optionSelection = selectionIgnoring(selection, kind);
    counters.optionCandidateBuilds += 1;
    const optionBills = ensureFacetIndex(
      rows,
      optionSelection,
      rowsVersion,
    );
    counters.pickerOptionsBuilds += 1;
    const result = realBillPickerOptions(
      kind,
      rows,
      selection,
      optionBills,
      query,
    );
    cacheSet(
      optionCache,
      key,
      result,
      OPTION_CACHE_MAX_ENTRIES,
      OPTION_CACHE_MAX_VALUES,
    );
    return result;
  }

  function refreshFilters() {
    cachedFilterSignature = "";
    cachedResult = null;
    cachedPageKey = "";
    cachedPageResult = null;
  }

  function invalidate() {
    rowsReference = null;
    cachedRowsDataSignature = "";
    cachedCandidateSignature = "";
    cachedCandidateRows = [];
    cachedCandidateFacets = [];
    cachedFilterSignature = "";
    cachedResult = null;
    cachedPageKey = "";
    cachedPageResult = null;
    optionCache.clear();
    facetIndexCache.clear();
    candidateVersion += 1;
  }

  function stats() {
    return {
      ...counters,
      optionCacheEntries: optionCache.size,
      optionCacheValues: cacheValues(optionCache),
      facetIndexCacheEntries: facetIndexCache.size,
      facetIndexCacheValues: cacheValues(facetIndexCache),
    };
  }

  return {
    candidateBills(rows, selection, rowsVersion) {
      ensureCandidateRows(rows, selection, rowsVersion);
      return cachedCandidateFacets;
    },
    hasCandidate,
    invalidate,
    pickerOptions,
    pageResult(result, page = 1, pageSize = REAL_BILL_PAGE_SIZE) {
      const lightModel = realBillPageModel(
        result?.bills || [],
        page,
        pageSize,
      );
      const pageKey =
        (result?.resultKey || "") +
        "|" +
        lightModel.currentPage +
        "|" +
        lightModel.pageSize;
      if (cachedPageResult && cachedPageKey === pageKey) {
        return cachedPageResult;
      }
      const fullBills = result?.requiresSelection
        ? []
        : buildLightBills(
            result?.candidateRows || [],
            lightModel.visibleBills,
            "page",
          );
      counters.matchedRowsBuilt += fullBills.reduce(
        (total, bill) => total + bill.lines.length,
        0,
      );
      cachedPageKey = pageKey;
      cachedPageResult = {
        ...result,
        bills: fullBills,
        pageModel: {
          ...lightModel,
          visibleBills: fullBills,
          visibleRows: fullBills.reduce(
            (total, bill) => total + bill.lines.length,
            0,
          ),
        },
      };
      return cachedPageResult;
    },
    printPayload(result) {
      const lightBills = result?.bills || [];
      return {
        bills: lightBills,
        build: () =>
          buildLightBills(
            result?.candidateRows || [],
            lightBills,
            "print",
          ),
      };
    },
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
  const stores = valueSet(sel.billStores);
  const brands = valueSet(sel.brands);
  const types = valueSet(sel.types);
  return (bills || []).filter(
    (bill) =>
      (kind === "billStores" ||
        !stores.size ||
        stores.has(bill.store)) &&
      (kind === "brands" ||
        !brands.size ||
        billHasFacet(bill, brands, "brand")) &&
      (kind === "types" ||
        !types.size ||
        billHasFacet(bill, types, "type")) &&
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
          billFacetValues(bill, "ps"),
        ),
      ).map((value) => option(value)),
    );
  }
  if (kind === "orderStores") {
    return sortOptions(
      uniq(matchedBills.map((bill) => bill.store)).map((value) =>
        option(value),
      ),
    );
  }
  if (kind === "billStores") {
    return realBillStoreOptionsFromBills(matchedBills);
  }
  if (kind === "brands") {
    return sortOptions(
      uniq(
        matchedBills.flatMap((bill) =>
          billFacetValues(bill, "brand"),
        ),
      ).map((value) => option(value)),
    );
  }
  if (kind === "types") {
    return sortOptions(
      uniq(
        matchedBills.flatMap((bill) =>
          billFacetValues(bill, "type"),
        ),
      ).map((value) => option(value)),
    );
  }
  return [];
}

function maskedKeyExample(key) {
  let hash = 2166136261;
  const text = T(key);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return "key-" + (hash >>> 0).toString(36);
}

export function diagnoseRealBillKeys(rows) {
  const keys = new Map();
  const invoiceSources = new Map();
  let blankInvoiceRows = 0;
  let numericInvoiceRows = 0;
  let specialDelimiterRows = 0;

  (rows || []).forEach((row) => {
    const key = realBillKey(row);
    let entry = keys.get(key);
    if (!entry) {
      entry = { ps: new Set(), blankInvoice: !T(row.inv) };
      keys.set(key, entry);
    }
    entry.ps.add(T(row.ps));
    if (!T(row.inv)) blankInvoiceRows += 1;
    if (typeof row.inv === "number") numericInvoiceRows += 1;
    if (
      [row.store, row.inv, row.tele].some((value) =>
        T(value).includes(SEP) || T(value).includes("|"),
      )
    ) {
      specialDelimiterRows += 1;
    }
    const invoiceKey = [T(row.store), T(row.inv), T(row.date)].join(SEP);
    if (!invoiceSources.has(invoiceKey)) {
      invoiceSources.set(invoiceKey, new Set());
    }
    invoiceSources
      .get(invoiceKey)
      .add(row.isTele ? REAL_BILL_SOURCE_TS : REAL_BILL_SOURCE_PS);
  });

  const blankInvoiceKeys = [...keys.entries()].filter(
    ([, entry]) => entry.blankInvoice,
  );
  const multiPsKeys = [...keys.entries()].filter(
    ([, entry]) => entry.ps.size > 1,
  );
  const psTsInvoiceCollisions = [...invoiceSources.entries()].filter(
    ([, sources]) =>
      sources.has(REAL_BILL_SOURCE_PS) &&
      sources.has(REAL_BILL_SOURCE_TS),
  );
  return {
    rows: (rows || []).length,
    billKeys: keys.size,
    blankInvoiceRows,
    blankInvoiceKeys: blankInvoiceKeys.length,
    multiPsKeys: multiPsKeys.length,
    psTsInvoiceCollisions: psTsInvoiceCollisions.length,
    numericInvoiceRows,
    specialDelimiterRows,
    examples: {
      blankInvoiceKeys: blankInvoiceKeys
        .slice(0, 3)
        .map(([key]) => maskedKeyExample(key)),
      multiPsKeys: multiPsKeys
        .slice(0, 3)
        .map(([key]) => maskedKeyExample(key)),
      psTsInvoiceCollisions: psTsInvoiceCollisions
        .slice(0, 3)
        .map(([key]) => maskedKeyExample(key)),
    },
  };
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
      (sum, bill) =>
        sum + (bill.lineCount ?? (bill.lines || []).length),
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
  return (
    '<div class="mobileTableScrollHint realBillScrollHint" aria-hidden="true">← เลื่อนตารางเพื่อดูยอดด้านขวา →</div>' +
    bills
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
    .join("")
  );
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
  const model =
    result?.pageModel || realBillPageModel(bills, page, pageSize);
  if (result?.requiresSelection) {
    container.innerHTML =
      '<div class="empty realBillsEmpty">เลือกร้านหรือพิมพ์ชื่อร้าน เพื่อดูบิลจริง</div>';
  } else if (!model.totalBills) {
    container.innerHTML =
      '<div class="empty realBillsEmpty">ไม่พบบิลจริงตามตัวเลือกหรือคำค้นหา</div>';
  } else {
    container.innerHTML =
      realBillCardsHtml(model.visibleBills) + realBillPagerHtml(model);
  }
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
