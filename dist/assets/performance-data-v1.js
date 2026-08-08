const STORAGE_BASE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
export const PERFORMANCE_CURRENT_PATH = "performance/current.min.json";
export const PERFORMANCE_HISTORY_INDEX = "performance/history-index.json";
export const PERFORMANCE_HISTORY_LIMIT = 6;
export const PERFORMANCE_HISTORY_CACHE = "aya-performance-history-v3";
const PERFORMANCE_ACTIVE_PATH = "performance/active.json";
const PERFORMANCE_BOARD_SESSION = "perf-v5";
const CD_KEYS = ["dc1", "dc2", "dc3", "cd123"];

const PUBLIC_KEY = String.fromCharCode(115,98,95,112,117,98,108,105,115,104,97,98,108,101,95,74,84,104,89,119,65,108,95,45,97,115,107,107,95,99,73,97,67,100,55,53,119,95,84,67,87,75,50,66,84,84);
let activeManifestPromise = null;

export function numberValue(value) {
  const number = Number(String(value ?? 0).replace(/,/g, "").replace(/%/g, "").trim());
  return Number.isFinite(number) ? number : 0;
}

const compact = (value) => String(value ?? "").replace(/[\s._\-–—/\\]+/g, "").toUpperCase();

function sellerReportNumber(source, exact = [], contains = []) {
  const keys = Object.keys(source || {});
  const exactKeys = exact.map(compact);
  const containsKeys = contains.map(compact);
  let key = keys.find((candidate) => exactKeys.includes(compact(candidate)));
  if (!key) key = keys.find((candidate) => containsKeys.some((fragment) => compact(candidate).includes(fragment)));
  return key ? numberValue(source[key]) : 0;
}

export function moqMetric(row) {
  const direct = row?.moq || {};
  const report = row?.sellerReport || {};
  const target = sellerReportNumber(report, ["เป้าหมายการกระจาย SBD"], ["เป้าหมายการกระจายSBD"]) || numberValue(direct.target);
  const actual = sellerReportNumber(report, ["การกระจาย SBD MOQ"], ["SBD MOQ", "การกระจายSBDMOQ"]) || numberValue(direct.actual);
  const storedIndex = sellerReportNumber(report, ["Index MOQ 75%"], ["Index MOQ", "MOQ 75"]) || numberValue(direct.index);
  return { target, actual, index: target > 0 ? (actual / target) * 100 : storedIndex };
}

export function combinedCd123Metric(row) {
  const direct = row?.cd123 || {};
  const directTarget = numberValue(direct.target);
  const directActual = numberValue(direct.actual);
  if (directTarget > 0) return { target: directTarget, actual: directActual, index: (directActual / directTarget) * 100, incomplete: false };
  const parts = ["dc1", "dc2", "dc3"].map((key) => row?.[key] || {});
  const complete = parts.every((metric) => numberValue(metric.target) > 0);
  const target = parts.reduce((sum, metric) => sum + numberValue(metric.target), 0);
  const actual = complete ? parts.reduce((sum, metric) => sum + numberValue(metric.actual), 0) : 0;
  return { target, actual, index: complete && target > 0 ? (actual / target) * 100 : 0, incomplete: !complete };
}

export function metricData(row, key) {
  if (key === "moq") return moqMetric(row);
  if (key === "cd123") return combinedCd123Metric(row);
  return row?.[key] || {};
}

export function metricActual(row, key) {
  return numberValue(metricData(row, key).actual);
}

export function metricPercent(row, key) {
  if (key === "overall") {
    const values = ["sales", "giv", "moq", "dc1", "dc2", "dc3"].map((metricKey) => metricPercent(row, metricKey));
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }
  const metric = metricData(row, key);
  const target = numberValue(metric.target);
  const actual = numberValue(metric.actual);
  return target > 0 ? (actual / target) * 100 : numberValue(metric.index);
}

export function personCode(row, mode = "ps") {
  return String(mode === "ads" ? (row?.ads || row?.adsCode || row?.code || "") : (row?.ps || row?.psCode || row?.code || "")).trim();
}

export function personName(row, mode = "ps") {
  const code = personCode(row, mode);
  const values = mode === "ads" ? [row?.name, row?.adsName] : [row?.name, row?.psName];
  for (const value of values) {
    const name = String(value || "").trim();
    if (name && name !== code) return name;
  }
  return code || "-";
}

function metricPresent(metric) {
  return Boolean(metric && typeof metric === "object" && ("target" in metric || "actual" in metric || "index" in metric));
}

function aggregateMetric(rows, key) {
  let target = 0;
  let actual = 0;
  let indexTotal = 0;
  let indexCount = 0;
  for (const row of rows || []) {
    const metric = metricData(row, key);
    const rowTarget = numberValue(metric.target);
    if (key === "cd123" && rowTarget <= 0) continue;
    target += rowTarget;
    actual += numberValue(metric.actual);
    if (metricPresent(metric)) {
      indexTotal += numberValue(metric.index);
      indexCount += 1;
    }
  }
  if (target > 0) return { target, actual, index: (actual / target) * 100 };
  const average = indexCount ? indexTotal / indexCount : 0;
  return { target, actual: key === "gps" ? average : actual, index: average };
}

function recomputeGroups(pack, keys) {
  const grouped = new Map();
  (pack?.ps || []).forEach((row) => {
    const code = String(row.ads || row.adsCode || "").trim();
    if (!code) return;
    if (!grouped.has(code)) grouped.set(code, []);
    grouped.get(code).push(row);
  });
  (pack?.ads || []).forEach((row) => {
    const code = String(row.ads || row.adsCode || row.code || "").trim();
    const rows = grouped.get(code) || [];
    keys.forEach((key) => { if (rows.length) row[key] = aggregateMetric(rows, key); });
  });
  pack.ds = pack.ds || { code: "DS", name: "DS" };
  keys.forEach((key) => { pack.ds[key] = aggregateMetric(pack.ps || [], key); });
  return pack;
}

export function hydratePerformancePack(pack) {
  if (!pack || !Array.isArray(pack.ps)) return pack;
  pack.ps.forEach((row) => {
    row.ps = row.ps || row.psCode || row.code;
    row.ads = row.ads || row.adsCode;
    row.name = row.name || row.psName;
    row.moq = moqMetric(row);
    row.cd123 = combinedCd123Metric(row);
  });
  (pack.ads || []).forEach((row) => {
    row.ads = row.ads || row.adsCode || row.code;
    if (!row.name || row.name === row.ads) row.name = row.adsName || row.name || row.ads;
  });
  recomputeGroups(pack, ["moq", "cd123", "gps"]);
  return pack;
}

export function performanceObjectUrl(path) {
  return /^https?:\/\//i.test(String(path || "")) ? String(path) : `${STORAGE_BASE}${String(path || "").replace(/^\/+/, "")}`;
}

function headers() {
  return { apikey: PUBLIC_KEY, authorization: `Bearer ${PUBLIC_KEY}` };
}

export async function fetchPerformanceJson(path, { timeoutMs = 12000, remember = false, stats = null } = {}) {
  const url = performanceObjectUrl(path);
  let cache = null;
  if (remember && "caches" in globalThis) {
    try { cache = await caches.open(PERFORMANCE_HISTORY_CACHE); } catch (error) { console.warn("[Performance cache open]", error); }
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: headers(), cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (remember && stats) stats.downloaded += 1;
    if (cache) {
      try { await cache.put(url, new Response(JSON.stringify(data), { headers: { "content-type": "application/json; charset=utf-8" } })); }
      catch (error) { console.warn("[Performance cache write]", error); }
    }
    return data;
  } catch (error) {
    if (cache) {
      try {
        const cached = await cache.match(url);
        if (cached) {
          if (stats) stats.remembered += 1;
          return await cached.json();
        }
      } catch (cacheError) { console.warn("[Performance cache read]", cacheError); }
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function metricEmpty(metric) {
  return numberValue(metric?.target) === 0 && numberValue(metric?.actual) === 0 && numberValue(metric?.index) === 0;
}

function cd123Name(text) {
  return text.includes("CD1+2+3") || text.includes("CD1+CD2+CD3") || /(^|[^0-9])CD123([^0-9]|$)/.test(text);
}

function cdColumn(name, key) {
  const text = compact(name);
  if (key === "cd123") return cd123Name(text);
  const number = key.replace("dc", "");
  if (text.includes("CD1+CD3") || cd123Name(text)) return false;
  return new RegExp(`(^|[^0-9])CD${number}([^0-9]|$)`).test(text) || new RegExp(`(^|[^0-9])DC${number}([^0-9]|$)`).test(text);
}

function cdField(source, key, kind) {
  const thai = kind === "target" ? "เป้าหมาย" : kind === "actual" ? "การกระจาย" : "INDEX";
  const english = kind === "target" ? "TARGET" : kind === "actual" ? "ACTUAL" : "INDEX";
  for (const name of Object.keys(source || {})) {
    const text = compact(name);
    if (!cdColumn(name, key)) continue;
    if (text.includes(compact(thai)) || text.includes(english)) return numberValue(source[name]);
  }
  return 0;
}

function cdMetricFromFull(row, key) {
  const direct = row?.[key] || {};
  const source = row?.sellerReport || row?.cd || {};
  let target = numberValue(direct.target) || cdField(source, key, "target");
  let actual = numberValue(direct.actual) || cdField(source, key, "actual");
  let index = numberValue(direct.index) || cdField(source, key, "index");
  if (key === "cd123" && !target) {
    const parts = ["dc1", "dc2", "dc3"].map((part) => cdMetricFromFull(row, part));
    if (parts.every((part) => numberValue(part.target) > 0)) {
      target = parts.reduce((sum, part) => sum + numberValue(part.target), 0);
      actual = parts.reduce((sum, part) => sum + numberValue(part.actual), 0);
    }
  }
  if (target > 0) index = (actual / target) * 100;
  else if (index > 0 && index <= 1.5) index *= 100;
  return { target, actual, index };
}

function cd4Keys(source) {
  const keys = Object.keys(source || {});
  const find = (kind) => keys.find((name) => {
    const text = compact(name);
    if (!text.includes("CD4OL")) return false;
    return kind === "target" ? (text.includes(compact("เป้าหมาย")) || text.includes("TARGET")) : (text.includes(compact("การกระจาย")) || text.includes("ACTUAL"));
  }) || "";
  const target = find("target");
  const actual = find("actual");
  return { target, actual, enabled: Boolean(target && actual), incomplete: Boolean(target) !== Boolean(actual) };
}

function cd4Month(full) {
  let target = false;
  let actual = false;
  (full?.ps || []).forEach((row) => {
    const keys = cd4Keys(row?.sellerReport || row?.cd || {});
    if (keys.target) target = true;
    if (keys.actual) actual = true;
  });
  return { target, actual, enabled: target && actual, incomplete: target !== actual };
}

function snapshotIdentity(value) {
  const meta = value?.meta || {};
  return {
    reportKey: String(meta.reportKey || meta.currentReportKey || value?.reportKey || value?.currentReportKey || "").trim(),
    reportDate: String(meta.reportDate || value?.reportDate || "").trim(),
  };
}

function snapshotVersion(value) {
  const meta = value?.meta || {};
  return String(meta.updatedAt || meta.generatedAt || meta.uploadedAt || value?.updatedAt || value?.generatedAt || value?.uploadedAt || "").trim();
}

function snapshotTime(value) {
  const parsed = Date.parse(snapshotVersion(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function sameSnapshot(left, right) {
  const a = snapshotIdentity(left);
  const b = snapshotIdentity(right);
  if (a.reportKey || b.reportKey) return Boolean(a.reportKey && b.reportKey && a.reportKey === b.reportKey);
  return Boolean(a.reportDate && b.reportDate && a.reportDate === b.reportDate);
}

function exactBoardSession(current) {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const cached = hydratePerformancePack(JSON.parse(sessionStorage.getItem(PERFORMANCE_BOARD_SESSION) || "null"));
    if (!cached || !sameSnapshot(current, cached)) return null;
    const currentVersion = snapshotVersion(current);
    const cachedVersion = snapshotVersion(cached);
    if (!currentVersion || !cachedVersion || currentVersion !== cachedVersion) return null;
    return cached;
  } catch {
    return null;
  }
}

function manifestMatches(pack, item) {
  const packId = snapshotIdentity(pack);
  const itemId = snapshotIdentity(item);
  const identityMatches = packId.reportKey
    ? Boolean(itemId.reportKey && itemId.reportKey === packId.reportKey)
    : Boolean(packId.reportDate && itemId.reportDate && itemId.reportDate === packId.reportDate);
  if (!identityMatches) return false;
  const packTime = snapshotTime(pack);
  const itemTime = snapshotTime(item);
  return !(packTime && itemTime && itemTime < packTime);
}

function fullMatchesPack(pack, full) {
  const packId = snapshotIdentity(pack);
  const fullId = snapshotIdentity(full);
  if (fullId.reportKey) return Boolean(packId.reportKey && fullId.reportKey === packId.reportKey);
  return Boolean(packId.reportDate && fullId.reportDate && fullId.reportDate === packId.reportDate);
}

function activePath(item) {
  return String(item?.dataPath || item?.currentDataPath || item?.latestPath || "").trim();
}

function matchingFullPath(active, pack) {
  const candidates = [active, ...(Array.isArray(active?.history) ? active.history : [])];
  return activePath(candidates.find((item) => manifestMatches(pack, item) && activePath(item)) || {});
}

function fullPsCode(row) {
  return String(row?.ps || row?.psCode || row?.code || "").trim();
}

function enrichNames(pack, full) {
  const names = new Map();
  (full?.ads || []).forEach((row) => {
    const code = String(row?.adsCode || row?.ads || row?.code || "").trim();
    const name = String(row?.adsName || row?.name || "").trim();
    if (code && name && name !== code) names.set(code, name);
  });
  (pack.ads || []).forEach((row) => {
    const code = String(row.ads || row.adsCode || row.code || "").trim();
    const name = names.get(code);
    if (name) { row.adsName = name; row.name = name; }
  });
  (pack.ps || []).forEach((row) => {
    const code = String(row.ads || row.adsCode || "").trim();
    const name = names.get(code);
    if (name) row.adsName = name;
  });
}

function enrichCd(pack, full) {
  const fullMap = new Map((full?.ps || []).map((row) => [fullPsCode(row), row]).filter(([code]) => code));
  (pack.ps || []).forEach((row) => {
    const sourceRow = fullMap.get(fullPsCode(row));
    if (!sourceRow) return;
    CD_KEYS.forEach((key) => {
      if (!metricEmpty(row?.[key])) return;
      const recovered = cdMetricFromFull(sourceRow, key);
      if (!metricEmpty(recovered)) row[key] = recovered;
    });
  });
  const month = cd4Month(full);
  pack.meta = pack.meta || {};
  if (month.incomplete) {
    pack.meta.cd4OlWarning = "พบหัวข้อ CD4 OL ไม่ครบทั้งเป้าหมายและการกระจาย จึงไม่รวมกับ CD3";
    if (pack.meta.cd4OlCombinedIntoDc3 !== true) pack.meta.cd4OlCombinedIntoDc3 = false;
  } else if (month.enabled && pack.meta.cd4OlCombinedIntoDc3 !== true) {
    (pack.ps || []).forEach((row) => {
      const sourceRow = fullMap.get(fullPsCode(row));
      if (!sourceRow) return;
      const source = sourceRow?.sellerReport || sourceRow?.cd || {};
      const keys = cd4Keys(source);
      const base = metricEmpty(row.dc3) ? cdMetricFromFull(sourceRow, "dc3") : row.dc3;
      const target = numberValue(base.target) + (keys.target ? numberValue(source[keys.target]) : 0);
      const actual = numberValue(base.actual) + (keys.actual ? numberValue(source[keys.actual]) : 0);
      row.dc3 = { target, actual, index: target ? (actual / target) * 100 : 0 };
    });
    pack.meta.cd4OlCombinedIntoDc3 = true;
    pack.labels = { ...(pack.labels || {}), dc3: "CD3 + CD4 OL" };
    delete pack.meta.cd4OlWarning;
  } else if (!month.enabled && pack.meta.cd4OlCombinedIntoDc3 !== true) {
    pack.meta.cd4OlCombinedIntoDc3 = false;
    delete pack.meta.cd4OlWarning;
  }
  recomputeGroups(pack, [...CD_KEYS, "gps"]);
  return pack;
}

async function getActiveManifest() {
  activeManifestPromise ||= fetchPerformanceJson(PERFORMANCE_ACTIVE_PATH, { timeoutMs: 5000 }).catch((error) => {
    activeManifestPromise = null;
    throw error;
  });
  return activeManifestPromise;
}

export async function enrichPerformancePack(pack) {
  pack = hydratePerformancePack(pack);
  if (!pack || !Array.isArray(pack.ps)) return pack;
  const needsCd = pack.ps.some((row) => CD_KEYS.some((key) => metricEmpty(row?.[key])));
  const needsCd4Check = typeof pack?.meta?.cd4OlCombinedIntoDc3 !== "boolean";
  const needsNames = (pack.ads || []).some((row) => personName(row, "ads") === personCode(row, "ads"))
    || (pack.ps || []).some((row) => String(row.ads || row.adsCode || "").trim() && !String(row.adsName || "").trim());
  if (!needsCd && !needsCd4Check && !needsNames) return pack;
  try {
    const active = await getActiveManifest();
    const path = matchingFullPath(active, pack);
    if (!path || path === PERFORMANCE_CURRENT_PATH) return pack;
    const full = await fetchPerformanceJson(path, { timeoutMs: 12000 });
    if (!fullMatchesPack(pack, full)) return pack;
    enrichNames(pack, full);
    if (needsCd || needsCd4Check) enrichCd(pack, full);
  } catch (error) {
    console.warn("[Performance enrichment]", error);
  }
  return hydratePerformancePack(pack);
}

export async function loadLatestPerformance() {
  const current = hydratePerformancePack(await fetchPerformanceJson(PERFORMANCE_CURRENT_PATH));
  const verifiedBoard = exactBoardSession(current);
  const latest = await enrichPerformancePack(verifiedBoard || current);
  if (!Array.isArray(latest?.ps) || !Array.isArray(latest?.ads)) throw new Error("รูปแบบข้อมูล Performance ไม่ครบ");
  try { sessionStorage.setItem(PERFORMANCE_BOARD_SESSION, JSON.stringify(latest)); } catch {}
  return latest;
}

export function snapshotLabel(snapshot) {
  return String(snapshot?.meta?.reportDate || snapshot?.meta?.reportKey || snapshot?.reportDate || snapshot?.reportKey || "-");
}

export function selectHistoryItems(index, latest, limit = PERFORMANCE_HISTORY_LIMIT) {
  const currentLabel = snapshotLabel(latest);
  const unique = new Map();
  const indexed = (Array.isArray(index) ? index : []).filter((item) => item?.path);
  const compactHistory = indexed.filter((item) => String(item.path).startsWith("performance/compare/"));
  const candidates = compactHistory.length ? compactHistory : indexed;
  for (const item of candidates) {
    const label = String(item.reportDate || item.reportKey || item.path);
    if (!label || label === currentLabel || unique.has(label)) continue;
    if (currentLabel && label >= currentLabel) continue;
    unique.set(label, item);
  }
  return [...unique.values()]
    .sort((a, b) => String(b.reportDate || b.reportKey || "").localeCompare(String(a.reportDate || a.reportKey || "")))
    .slice(0, Math.max(limit - 1, 0))
    .reverse();
}

export async function loadPerformanceHistory(latest, { limit = PERFORMANCE_HISTORY_LIMIT, onProgress } = {}) {
  const index = await fetchPerformanceJson(PERFORMANCE_HISTORY_INDEX, { timeoutMs: 8000 });
  const items = selectHistoryItems(index, latest, limit);
  const stats = { remembered: 0, downloaded: 0 };
  const history = [];
  for (let cursor = 0; cursor < items.length; cursor += 2) {
    const batch = items.slice(cursor, cursor + 2);
    const results = await Promise.allSettled(batch.map(async (item) => enrichPerformancePack(await fetchPerformanceJson(item.path, { remember: true, stats }))));
    results.forEach((result) => {
      if (result.status !== "fulfilled") return;
      const snapshot = result.value;
      if (Array.isArray(snapshot?.ps) && Array.isArray(snapshot?.ads)) history.push(snapshot);
    });
    onProgress?.({ loaded: Math.min(cursor + batch.length, items.length), total: items.length, stats });
  }
  history.sort((a, b) => snapshotLabel(a).localeCompare(snapshotLabel(b)));
  return { timeline: [...history, latest], stats };
}

export function reportPeriodDate(meta = {}) {
  const values = [meta.reportDate, meta.dataDate, meta.periodDate, meta.reportKey, meta.uploadedAt];
  for (const value of values) {
    const raw = String(value || "").trim();
    if (!raw) continue;
    const yearFirst = raw.match(/(?:^|\D)(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?(?:\D|$)/);
    if (yearFirst) {
      let year = Number(yearFirst[1]);
      if (year > 2400) year -= 543;
      return new Date(Date.UTC(year, Number(yearFirst[2]) - 1, Number(yearFirst[3] || 1)));
    }
    const parsed = Date.parse(raw);
    if (Number.isFinite(parsed)) return new Date(parsed);
  }
  return null;
}

export function formatPerformancePeriod(meta = {}) {
  const date = reportPeriodDate(meta);
  if (!date) return String(meta.reportDate || meta.reportKey || "LATEST PERFORMANCE CHAMPIONS");
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "Asia/Bangkok" }).format(date).toUpperCase();
}