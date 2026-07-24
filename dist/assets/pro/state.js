import { N, SEP, T } from "./utils.js";

export const createSelection = () => ({
  dates: [],
  ps: [],
  orderStores: [],
  receivers: [],
  billStores: [],
  brands: [],
  types: [],
});

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
  pageSize: 80,
  mode: "pick",
  showDetails: false,
  bound: false,
  pickKind: "",
  tmp: [],
  remainView: "all",
  telePage: 1,
  sel: createSelection(),
  send: {},
  add: {},
  pull: {},
  ins: [],
  hist: [],
  redoStack: [],
};

export function snap() {
  return JSON.stringify({
    sel: state.sel,
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

export function push() {
  state.hist.push(snap());
  if (state.hist.length > 80) state.hist.shift();
  state.redoStack = [];
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
    state.pageSize = saved.pageSize || 80;
    state.mode = saved.mode || "pick";
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
  localStorage.setItem(
    sk(),
    JSON.stringify({
      sel: state.sel,
      q: state.q,
      send: state.send,
      add: state.add,
      pull: state.pull,
      ins: state.ins,
      mode: state.mode,
      pageSize: state.pageSize,
      showDetails: state.showDetails,
      remainView: state.remainView,
    }),
  );
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
    state.pageSize = saved.pageSize || state.pageSize;
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
