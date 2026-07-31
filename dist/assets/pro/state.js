import { N, SEP, T } from "./utils.js";

export const HISTORY_MAX_ENTRIES = 80;
export const HISTORY_MAX_BYTES = 2 * 1024 * 1024;
export const PAGE_SIZE_DEFAULT = 80;
export const PAGE_SIZE_MIN = 1;
export const PAGE_SIZE_MAX = 200;

export function normalizePageSize(value, fallback = PAGE_SIZE_DEFAULT) {
  const number = Number(value);
  if (
    Number.isInteger(number) &&
    number >= PAGE_SIZE_MIN &&
    number <= PAGE_SIZE_MAX
  ) {
    return number;
  }
  const fallbackNumber = Number(fallback);
  return Number.isInteger(fallbackNumber) &&
    fallbackNumber >= PAGE_SIZE_MIN &&
    fallbackNumber <= PAGE_SIZE_MAX
    ? fallbackNumber
    : PAGE_SIZE_DEFAULT;
}

export const createSelection = () => ({
  dates: [],
  ps: [],
  orderStores: [],
  receivers: [],
  billStores: [],
  brands: [],
  types: [],
});

const FILTER_SELECTION_KEYS = [
  "dates",
  "ps",
  "orderStores",
  "brands",
  "types",
];

export const createFilterContext = () => ({
  dates: [],
  ps: [],
  orderStores: [],
  brands: [],
  types: [],
  q: "",
});

export const createFilterContexts = () => ({
  pro: null,
  ship: null,
});

function mergeFilterContext(saved) {
  if (!saved || typeof saved !== "object") return null;
  const merged = createFilterContext();
  FILTER_SELECTION_KEYS.forEach((key) => {
    merged[key] = Array.isArray(saved[key]) ? [...saved[key]] : [];
  });
  merged.q = T(saved.q);
  return merged;
}

function mergeFilterContexts(saved) {
  const source = saved && typeof saved === "object" ? saved : {};
  return {
    pro: mergeFilterContext(source.pro),
    ship: mergeFilterContext(source.ship),
  };
}

export function mergeSelection(saved) {
  const defaults = createSelection();
  const source = saved && typeof saved === "object" ? saved : {};
  return Object.fromEntries(
    Object.keys(defaults).map((key) => [
      key,
      Array.isArray(source[key]) ? [...source[key]] : defaults[key],
    ]),
  );
}

export const state = {
  rows: [],
  active: null,
  key: "active",
  q: "",
  page: 1,
  pageSize: PAGE_SIZE_DEFAULT,
  mode: "pick",
  showDetails: false,
  bound: false,
  pickKind: "",
  tmp: [],
  remainView: "all",
  telePage: 1,
  sel: createSelection(),
  filterContexts: createFilterContexts(),
  send: {},
  add: {},
  pull: {},
  ins: [],
  hist: [],
  redoStack: [],
};

export function filterContextKey(mode = state.mode) {
  return mode === "ship" ? "ship" : "pro";
}

export function captureFilterContext() {
  const context = createFilterContext();
  FILTER_SELECTION_KEYS.forEach((key) => {
    context[key] = [...(state.sel[key] || [])];
  });
  context.q = T(state.q);
  return context;
}

export function applyFilterContext(context) {
  const merged = mergeFilterContext(context);
  if (!merged) return false;
  FILTER_SELECTION_KEYS.forEach((key) => {
    state.sel[key] = [...merged[key]];
  });
  state.q = merged.q;
  return true;
}

export function syncCurrentFilterContext() {
  state.filterContexts = mergeFilterContexts(state.filterContexts);
  const key = filterContextKey();
  state.filterContexts[key] = captureFilterContext();
  return state.filterContexts[key];
}

export function switchFilterContext(nextMode) {
  const currentKey = filterContextKey();
  const nextKey = filterContextKey(nextMode);
  const current = syncCurrentFilterContext();
  if (currentKey === nextKey) return false;
  if (!state.filterContexts[nextKey]) {
    state.filterContexts[nextKey] = mergeFilterContext(current);
  }
  applyFilterContext(state.filterContexts[nextKey]);
  return true;
}

export function snap() {
  syncCurrentFilterContext();
  return JSON.stringify({
    sel: state.sel,
    filterContexts: state.filterContexts,
    q: state.q,
    send: state.send,
    add: state.add,
    pull: state.pull,
    ins: state.ins,
    page: state.page,
    pageSize: state.pageSize,
    mode: state.mode,
    showDetails: state.showDetails,
    remainView: state.remainView,
  });
}

export function snapshotBytes(snapshot) {
  return new TextEncoder().encode(String(snapshot || "")).byteLength;
}

export function historyStats() {
  const historyBytes = state.hist.reduce(
    (total, snapshot) => total + snapshotBytes(snapshot),
    0,
  );
  const redoBytes = state.redoStack.reduce(
    (total, snapshot) => total + snapshotBytes(snapshot),
    0,
  );
  return {
    historyEntries: state.hist.length,
    redoEntries: state.redoStack.length,
    historyBytes,
    redoBytes,
    totalBytes: historyBytes + redoBytes,
    maxEntries: HISTORY_MAX_ENTRIES,
    maxBytes: HISTORY_MAX_BYTES,
  };
}

export function trimHistory() {
  while (state.hist.length > HISTORY_MAX_ENTRIES) state.hist.shift();
  while (state.redoStack.length > HISTORY_MAX_ENTRIES) {
    state.redoStack.shift();
  }
  let stats = historyStats();
  while (stats.totalBytes > HISTORY_MAX_BYTES) {
    if (state.hist.length) state.hist.shift();
    else if (state.redoStack.length) state.redoStack.shift();
    else break;
    stats = historyStats();
  }
  return stats;
}

export function push() {
  const checkpoint = {
    hist: [...state.hist],
    redoStack: [...state.redoStack],
  };
  state.hist.push(snap());
  state.redoStack = [];
  trimHistory();
  return checkpoint;
}

export function restoreHistoryCheckpoint(checkpoint) {
  if (
    !checkpoint ||
    !Array.isArray(checkpoint.hist) ||
    !Array.isArray(checkpoint.redoStack)
  ) {
    return false;
  }
  state.hist = [...checkpoint.hist];
  state.redoStack = [...checkpoint.redoStack];
  trimHistory();
  return true;
}

export function restore(snapshot) {
  try {
    const saved = JSON.parse(snapshot);
    state.sel = mergeSelection(saved.sel);
    state.q = saved.q || "";
    state.send = saved.send || {};
    state.add = saved.add || {};
    state.pull = saved.pull || {};
    state.ins = saved.ins || [];
    state.page = saved.page || 1;
    state.pageSize = normalizePageSize(saved.pageSize);
    state.mode = saved.mode || "pick";
    state.filterContexts = mergeFilterContexts(saved.filterContexts);
    if (!applyFilterContext(state.filterContexts[filterContextKey()])) {
      syncCurrentFilterContext();
    }
    state.showDetails = Boolean(saved.showDetails);
    state.remainView = saved.remainView || state.remainView || "all";
    return true;
  } catch {
    return false;
  }
}

export function sk() {
  return "doit-core-unified-v1:" + state.key;
}

export function save() {
  syncCurrentFilterContext();
  try {
    localStorage.setItem(
      sk(),
      JSON.stringify({
        sel: state.sel,
        filterContexts: state.filterContexts,
        q: state.q,
        send: state.send,
        add: state.add,
        pull: state.pull,
        ins: state.ins,
        mode: state.mode,
        pageSize: normalizePageSize(state.pageSize),
        showDetails: state.showDetails,
        remainView: state.remainView,
      }),
    );
    return { ok: true, error: "" };
  } catch (error) {
    return {
      ok: false,
      error: T(error?.message) || "พื้นที่จัดเก็บในเครื่องไม่พร้อมใช้งาน",
    };
  }
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(sk()) || "{}");
    state.sel = mergeSelection(saved.sel);
    state.q = saved.q || "";
    state.send = saved.send || {};
    state.add = saved.add || {};
    state.pull = saved.pull || {};
    state.ins = saved.ins || [];
    state.mode = saved.mode || state.mode;
    state.filterContexts = mergeFilterContexts(saved.filterContexts);
    if (!applyFilterContext(state.filterContexts[filterContextKey()])) {
      syncCurrentFilterContext();
    }
    state.pageSize = normalizePageSize(saved.pageSize, state.pageSize);
    state.showDetails = Boolean(saved.showDetails);
    state.remainView = saved.remainView || state.remainView || "all";
  } catch {}
}

export function scope() {
  return JSON.stringify({
    d: state.sel.dates,
    p: state.sel.ps,
    c: state.sel.orderStores,
  });
}

export function rec() {
  return state.sel.receivers.length === 1 ? state.sel.receivers[0] : "";
}

export function rkey(poolKey, store = rec()) {
  return [scope(), store, poolKey].join(SEP);
}

export function parseKey(key) {
  const text = String(key);
  if (text.includes(SEP)) {
    const parts = text.split(SEP);
    return {
      scope: parts[0] || "",
      store: parts[1] || "",
      pk: parts.slice(2).join(SEP),
    };
  }
  const parts = text.split("|");
  if (parts.length >= 10) {
    return {
      legacy: true,
      scope: {
        d: parts[0] || "",
        p: parts[1] || "",
        c: parts[2] || "",
      },
      store: parts[4] || "",
      pk: parts.slice(5).join("|"),
    };
  }
  return { scope: "", store: "", pk: text };
}

export function scopeOk(parsed) {
  if (!parsed) return false;
  if (parsed.legacy) {
    return (
      parsed.scope.d === state.sel.dates.join(",") &&
      parsed.scope.p === state.sel.ps.join(",") &&
      parsed.scope.c === state.sel.orderStores.join(",")
    );
  }
  return parsed.scope === scope();
}

export function pkKey(key) {
  return parseKey(key).pk || "";
}

export function mapVal(map, poolKey, store = rec()) {
  const direct = map[rkey(poolKey, store)];
  if (T(direct)) return N(direct);
  let total = 0;
  Object.entries(map).forEach(([key, value]) => {
    const parsed = parseKey(key);
    if (scopeOk(parsed) && parsed.pk === poolKey && parsed.store === store) {
      total += N(value);
    }
  });
  return total;
}

export function sumMap(map, poolKey) {
  let total = 0;
  Object.entries(map).forEach(([key, value]) => {
    const parsed = parseKey(key);
    if (scopeOk(parsed) && parsed.pk === poolKey) total += N(value);
  });
  return total;
}

export function currentState() {
  return JSON.parse(snap());
}
