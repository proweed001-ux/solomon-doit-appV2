import {
  formatPerformancePeriod,
  hydratePerformancePack,
  loadLatestPerformance,
  loadPerformanceHistory,
  metricActual,
  metricData,
  metricPercent,
  numberValue,
  personCode,
  personName,
  snapshotLabel,
} from "./performance-data-v1.js";

const app = document.getElementById("app");
const status = document.getElementById("performance-status");
const CACHE_KEY = "aya-performance-board-v5";
const categories = [
  ["sales", "Volume NIP"],
  ["giv", "Volume GIV"],
  ["moq", "DGP"],
  ["dc1", "CD1"],
  ["dc2", "CD2"],
  ["dc3", "CD3"],
  ["cd123", "CD123"],
  ["bills", "Productivity 50"],
  ["gps", "GPS"],
  ["dgp", "Golden Point"],
];

let latest = null;
let timeline = [];
let state = readState();

function readState() {
  const query = new URLSearchParams(location.search);
  return {
    mode: query.get("mode") || "ds",
    ads: query.get("ads") || "",
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatNumber(value, digits = 0) {
  return numberValue(value).toLocaleString("th-TH", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function setStatus(message, error = false) {
  status.textContent = message;
  status.className = error ? "status error" : "status";
}

function navigate(next) {
  state = { ...state, ...next };
  const query = new URLSearchParams();
  query.set("mode", state.mode);
  if (state.ads) query.set("ads", state.ads);
  history.pushState(state, "", `/performance?${query}`);
  render();
}

function nav() {
  const button = (label, mode) => `<button type="button" data-mode="${mode}" class="${state.mode === mode ? "on" : ""}">${label}</button>`;
  return `<div class="nav">${button("DS", "ds")}${button("ADS", "ads")}${button("PS", "ps")}${button("เทียบย้อนหลัง", "compare")}</div>`;
}

function aggregate(rows, key) {
  let target = 0;
  let actual = 0;
  let indexSum = 0;
  let indexCount = 0;
  for (const row of rows || []) {
    const metric = metricData(row, key);
    const rowTarget = numberValue(metric.target);
    if (key === "cd123" && rowTarget <= 0) continue;
    target += rowTarget;
    actual += numberValue(metric.actual);
    const index = metricPercent(row, key);
    if (index > 0) {
      indexSum += index;
      indexCount += 1;
    }
  }
  return { target, actual, index: target > 0 ? (actual / target) * 100 : (indexCount ? indexSum / indexCount : 0) };
}

function metricCards(row) {
  return `<div class="kpis">${categories.map(([key, label]) => {
    const metric = metricData(row || {}, key);
    const target = numberValue(metric.target);
    const actual = numberValue(metric.actual);
    const index = metricPercent(row || {}, key);
    return `<div class="kpi"><span>${label}</span><strong>${formatNumber(actual)}</strong><small>เป้า ${formatNumber(target)} · ${formatPercent(index)}</small><div class="meter"><i style="width:${Math.max(0, Math.min(index, 140))}%"></i></div></div>`;
  }).join("")}</div>`;
}

function rankRows(rows, key, mode) {
  const ranked = [...(rows || [])]
    .filter((row) => metricPercent(row, key) > 0)
    .sort((a, b) => metricPercent(b, key) - metricPercent(a, key) || metricActual(b, key) - metricActual(a, key) || personCode(a, mode).localeCompare(personCode(b, mode), "en"))
    .slice(0, 5);
  if (!ranked.length) return '<div class="empty">ไม่มีข้อมูล</div>';
  return `<div class="rank-list">${ranked.map((row, index) => `<div class="rank-row"><span class="rank-no">${index + 1}</span><div><div class="rank-name">${escapeHtml(personCode(row, mode))} · ${escapeHtml(personName(row, mode))}</div><small>${formatNumber(metricActual(row, key))}</small></div><div class="rank-value">${formatPercent(metricPercent(row, key))}</div></div>`).join("")}</div>`;
}

function categoryBoards(rows, mode) {
  return `<div class="boards">${categories.map(([key, label]) => `<section class="panel"><h3>${label}</h3>${rankRows(rows, key, mode)}</section>`).join("")}</div>`;
}

function dsScreen() {
  return `${nav()}<section class="panel hero"><div><h1>DS ภาพรวม</h1><div class="muted">${escapeHtml(formatPerformancePeriod(latest.meta || {}))}</div></div><div class="meta">${escapeHtml(snapshotLabel(latest))}<br>PS ${latest.ps.length.toLocaleString("th-TH")} คน</div></section><section class="panel">${metricCards(latest.ds || {})}</section>${categoryBoards(latest.ads || [], "ads")}`;
}

function adsScreen() {
  const rows = latest.ads || [];
  const aggregateRow = { code: "ADS", name: "ADS" };
  categories.forEach(([key]) => { aggregateRow[key] = aggregate(rows, key); });
  return `${nav()}<section class="panel hero"><div><h1>ADS ทั้งหมด</h1><div class="muted">เลือก ADS เพื่อดู PS ในทีม</div></div></section><section class="panel">${metricCards(aggregateRow)}</section>${categoryBoards(rows, "ads")}<section class="panel"><h3>เลือก ADS</h3><div class="nav">${rows.map((row) => `<button type="button" data-ads="${escapeHtml(personCode(row, "ads"))}">${escapeHtml(personCode(row, "ads"))}</button>`).join("")}</div></section>`;
}

function psScreen() {
  const ads = state.ads || personCode(latest.ads?.[0], "ads");
  const rows = (latest.ps || []).filter((row) => !ads || String(row.ads || row.adsCode || "") === ads);
  const aggregateRow = { code: ads || "PS", name: ads || "PS" };
  categories.forEach(([key]) => { aggregateRow[key] = aggregate(rows, key); });
  return `${nav()}<section class="panel hero"><div><h1>${escapeHtml(ads || "PS ทั้งหมด")}</h1><div class="muted">ผลงาน PS ในทีม</div></div></section><section class="panel">${metricCards(aggregateRow)}</section>${categoryBoards(rows, "ps")}`;
}

function compareScreen() {
  if (timeline.length < 2) return `${nav()}<section class="panel"><h1>เทียบย้อนหลัง</h1><div class="empty">กำลังโหลดข้อมูลย้อนหลัง หรือยังไม่มีข้อมูลก่อนหน้า</div></section>`;
  const previous = timeline.at(-2);
  const current = timeline.at(-1);
  const cards = categories.slice(0, 7).map(([key, label]) => {
    const before = metricPercent(previous.ds || {}, key);
    const after = metricPercent(current.ds || {}, key);
    const change = after - before;
    return `<div class="compare-card"><span>${label}</span><b>${formatPercent(after)}</b><small>ก่อนหน้า ${formatPercent(before)}</small><div class="${change >= 0 ? "positive" : "negative"}">${change >= 0 ? "+" : ""}${formatPercent(change)}</div></div>`;
  }).join("");
  return `${nav()}<section class="panel hero"><div><h1>เทียบย้อนหลัง</h1><div class="muted">${escapeHtml(snapshotLabel(previous))} → ${escapeHtml(snapshotLabel(current))}</div></div></section><section class="panel"><div class="compare-grid">${cards}</div></section>`;
}

function render() {
  if (!latest) return;
  if (state.mode === "ads") app.innerHTML = adsScreen();
  else if (state.mode === "ps") app.innerHTML = psScreen();
  else if (state.mode === "compare") app.innerHTML = compareScreen();
  else app.innerHTML = dsScreen();
}

app.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-mode]");
  if (modeButton) navigate({ mode: modeButton.dataset.mode, ads: state.ads });
  const adsButton = event.target.closest("[data-ads]");
  if (adsButton) navigate({ mode: "ps", ads: adsButton.dataset.ads });
});

window.addEventListener("popstate", () => {
  state = readState();
  render();
});

async function bootstrap() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      latest = hydratePerformancePack(JSON.parse(cached));
      setStatus(`ข้อมูลที่จำไว้ • ${snapshotLabel(latest)}`);
      render();
    }
  } catch {}

  try {
    latest = await loadLatestPerformance();
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(latest));
    setStatus(`ข้อมูลล่าสุด • ${snapshotLabel(latest)}`);
    render();
    loadPerformanceHistory(latest, {
      onProgress: ({ loaded, total }) => setStatus(`ข้อมูลล่าสุด • ${snapshotLabel(latest)} · กำลังโหลดประวัติ ${loaded}/${total}`),
    }).then((result) => {
      timeline = result.timeline;
      setStatus(`ข้อมูลล่าสุด • ${snapshotLabel(latest)} · ประวัติ ${Math.max(timeline.length - 1, 0)} ช่วง`);
      if (state.mode === "compare") render();
    }).catch((error) => {
      timeline = [latest];
      setStatus(`ข้อมูลล่าสุด • ${snapshotLabel(latest)} · ประวัติโหลดไม่สำเร็จ (${error.message})`);
    });
  } catch (error) {
    if (!latest) {
      setStatus(`โหลดข้อมูล Performance ไม่สำเร็จ (${error.name === "AbortError" ? "หมดเวลา" : error.message})`, true);
      app.innerHTML = '<section class="panel empty">ไม่สามารถแสดงข้อมูลได้</section>';
    }
  }
}

bootstrap();
