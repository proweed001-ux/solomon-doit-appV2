const STORAGE_BASE = "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/doit-files/";
export const PERFORMANCE_CURRENT_PATH = "performance/current.min.json";
export const PERFORMANCE_HISTORY_INDEX = "performance/history-index.json";
export const PERFORMANCE_HISTORY_LIMIT = 6;
export const PERFORMANCE_HISTORY_CACHE = "aya-performance-history-v2";

const PUBLIC_KEY = String.fromCharCode(115,98,95,112,117,98,108,105,115,104,97,98,108,101,95,74,84,104,89,119,65,108,95,45,97,115,107,107,95,99,73,97,67,100,55,53,119,95,84,67,87,75,50,66,84,84);

export function numberValue(value) {
  const number = Number(String(value ?? 0).replace(/,/g, "").replace(/%/g, "").trim());
  return Number.isFinite(number) ? number : 0;
}

const compact = (value) => String(value ?? "").replace(/\s+/g, "").toUpperCase();

function sellerReportNumber(source, exact = [], contains = []) {
  const keys = Object.keys(source || {});
  const exactKeys = exact.map(compact);
  const containsKeys = contains.map(compact);
  let key = keys.find((candidate) => exactKeys.includes(compact(candidate)));
  if (!key) {
    key = keys.find((candidate) => containsKeys.some((fragment) => compact(candidate).includes(fragment)));
  }
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
  if (directTarget > 0) {
    return { target: directTarget, actual: directActual, index: (directActual / directTarget) * 100, incomplete: false };
  }
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
    const values = ["sales", "giv", "moq", "dc1", "dc2", "dc3"]
      .map((metricKey) => metricPercent(row, metricKey))
      .filter((value) => value > 0);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }
  const metric = metricData(row, key);
  const target = numberValue(metric.target);
  const actual = numberValue(metric.actual);
  return target > 0 ? (actual / target) * 100 : numberValue(metric.index);
}

export function personCode(row, mode = "ps") {
  return String(mode === "ads"
    ? (row?.ads || row?.adsCode || row?.code || "")
    : (row?.ps || row?.psCode || row?.code || "")).trim();
}

export function personName(row, mode = "ps") {
  const code = personCode(row, mode);
  const name = String(mode === "ads"
    ? (row?.name || row?.adsName || "")
    : (row?.name || row?.psName || "")).trim();
  return !name || name === code ? (code || name || "-") : name;
}

function aggregateMetric(rows, key) {
  let target = 0;
  let actual = 0;
  let indexTotal = 0;
  let indexCount = 0;
  for (const row of rows || []) {
    const metric = metricData(row, key);
    const rowTarget = numberValue(metric.target);
    const rowActual = numberValue(metric.actual);
    if (key === "cd123" && rowTarget <= 0) continue;
    target += rowTarget;
    actual += rowActual;
    const rowIndex = numberValue(metric.index);
    if (rowIndex > 0) {
      indexTotal += rowIndex;
      indexCount += 1;
    }
  }
  return { target, actual, index: target > 0 ? (actual / target) * 100 : (indexCount ? indexTotal / indexCount : 0) };
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
  const grouped = new Map();
  pack.ps.forEach((row) => {
    const code = String(row.ads || row.adsCode || "").trim();
    if (!code) return;
    if (!grouped.has(code)) grouped.set(code, []);
    grouped.get(code).push(row);
  });
  (pack.ads || []).forEach((row) => {
    row.ads = row.ads || row.adsCode || row.code;
    row.name = row.name || row.adsName;
    const rows = grouped.get(String(row.ads || "").trim()) || [];
    if (rows.length) {
      row.moq = aggregateMetric(rows, "moq");
      row.cd123 = aggregateMetric(rows, "cd123");
    } else {
      row.moq = moqMetric(row);
      row.cd123 = combinedCd123Metric(row);
    }
  });
  pack.ds = pack.ds || { code: "DS", name: "DS" };
  pack.ds.moq = aggregateMetric(pack.ps, "moq");
  pack.ds.cd123 = aggregateMetric(pack.ps, "cd123");
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
  if (remember && "caches" in globalThis) {
    try {
      const cache = await caches.open(PERFORMANCE_HISTORY_CACHE);
      const cached = await cache.match(url);
      if (cached) {
        if (stats) stats.remembered += 1;
        return await cached.json();
      }
    } catch (error) {
      console.warn("[Performance cache read]", error);
    }
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: headers(), cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (remember && stats) stats.downloaded += 1;
    if (remember && "caches" in globalThis) {
      try {
        const cache = await caches.open(PERFORMANCE_HISTORY_CACHE);
        await cache.put(url, new Response(JSON.stringify(data), { headers: { "content-type": "application/json; charset=utf-8" } }));
      } catch (error) {
        console.warn("[Performance cache write]", error);
      }
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function loadLatestPerformance() {
  const latest = hydratePerformancePack(await fetchPerformanceJson(PERFORMANCE_CURRENT_PATH));
  if (!Array.isArray(latest?.ps) || !Array.isArray(latest?.ads)) throw new Error("รูปแบบข้อมูล Performance ไม่ครบ");
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
    const results = await Promise.allSettled(batch.map((item) => fetchPerformanceJson(item.path, { remember: true, stats })));
    results.forEach((result) => {
      if (result.status !== "fulfilled") return;
      const snapshot = hydratePerformancePack(result.value);
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
