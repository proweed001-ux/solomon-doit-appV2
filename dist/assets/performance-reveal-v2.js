import {
  enrichPerformancePack,
  fetchPerformanceJson,
  formatPerformancePeriod,
  loadLatestPerformance,
  metricActual,
  metricPercent,
  numberValue,
  PERFORMANCE_HISTORY_INDEX,
  personCode,
  personName,
  snapshotLabel,
} from "./performance-data-v1.js?v=2";

const IMAGEKIT_PROFILE_URL = "https://ik.imagekit.io/AYAPS";
const AUDIO = Object.freeze({
  race: "/assets/audio/performance-race.mp3",
  applause: "/assets/audio/performance-applause.mp3",
  fireworks: "/assets/audio/performance-fireworks.mp3",
});
const TEST_MODE = new URLSearchParams(location.search).get("test") === "1";
const RACE_DURATION_MS = TEST_MODE ? 160 : 10000;
const COUNTDOWN_STEP_MS = TEST_MODE ? 20 : 850;
const COUNTDOWN_HIDE_MS = TEST_MODE ? 80 : 3650;
const RACE_HISTORY_MAX = 31;
const RACE_PALETTE = Object.freeze([
  Object.freeze({ key: "gold", accent: "#facc15", top: "#806110", mid: "#3d300d", bottom: "#0d0c07", glow: "#facc1555" }),
  Object.freeze({ key: "cyan", accent: "#22d3ee", top: "#0e7490", mid: "#164e63", bottom: "#06161c", glow: "#22d3ee55" }),
  Object.freeze({ key: "pink", accent: "#f472b6", top: "#9d174d", mid: "#4a102d", bottom: "#18070f", glow: "#f472b655" }),
  Object.freeze({ key: "green", accent: "#4ade80", top: "#15803d", mid: "#14532d", bottom: "#06140b", glow: "#4ade8055" }),
  Object.freeze({ key: "purple", accent: "#a78bfa", top: "#6d28d9", mid: "#3b176d", bottom: "#10071b", glow: "#a78bfa55" }),
]);
const categories = [
  { key: "sales", title: "TOP VOLUME", subtitle: "ยอดขายใน DOIT", unit: "บาท" },
  { key: "moq", title: "TOP DGP", subtitle: "จำนวนรายการ", unit: "รายการ" },
  { key: "dc1", title: "TOP CD1", subtitle: "การกระจาย CD1", unit: "ร้าน" },
  { key: "dc2", title: "TOP CD2", subtitle: "การกระจาย CD2", unit: "ร้าน" },
  { key: "dc3", title: "TOP CD3", subtitle: "การกระจาย CD3", unit: "ร้าน" },
  { key: "cd123", title: "TOP CD123", subtitle: "CD1 + CD2 + CD3", unit: "ร้าน" },
];

const modeState = { active: "ps", index: { ps: 0, ads: 0 } };
const raceTokens = new Map();
const countdownTokens = new Map();
const audioState = { tracks: new Map(), fireworksTimer: 0, context: null };
let latest = null;
let timeline = [];
let timelineReady = false;
let pseudoFullscreenHistoryPushed = false;

const byId = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatPercent(value) {
  const truncated = Math.trunc((numberValue(value) * 100) + 1e-9) / 100;
  return `${truncated.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

function formatActual(value, category) {
  const formatted = numberValue(value).toLocaleString("th-TH", { maximumFractionDigits: 0 });
  if (category.unit === "บาท") return `${formatted} ฿`;
  return `${formatted} ${category.unit}`;
}

function avatarDataUrl(seed) {
  const label = String(seed || "AYA").replace(/^(นาย|นางสาว|นาง)\s*/u, "").trim().slice(0, 2).toUpperCase() || "AYA";
  const safe = label.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" rx="128" fill="#17130a"/><circle cx="128" cy="128" r="116" fill="none" stroke="#eab308" stroke-width="5"/><text x="128" y="148" text-anchor="middle" font-family="Tahoma,Arial" font-size="72" font-weight="700" fill="#facc15">${safe}</text></svg>`)}`;
}

function personImageUrl(code) {
  const clean = String(code || "").trim();
  return /^[A-Z0-9_-]+$/i.test(clean) ? `${IMAGEKIT_PROFILE_URL}/${encodeURIComponent(clean)}.webp` : avatarDataUrl(clean);
}

function safeImage(image, seed) {
  image.onerror = null;
  image.src = avatarDataUrl(seed);
}

function randomIndex(length) {
  if (length <= 1) return 0;
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] % length;
  }
  return Math.floor(Math.random() * length);
}

function shuffledPalette() {
  const colors = [...RACE_PALETTE];
  for (let index = colors.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1);
    [colors[index], colors[swap]] = [colors[swap], colors[index]];
  }
  return colors;
}

function periodKey(value) {
  const meta = value?.meta || {};
  const direct = String(meta.period || value?.period || "").trim();
  if (/^20\d{4}$/.test(direct)) return direct;
  const sources = [
    meta.reportKey,
    value?.reportKey,
    meta.reportDate,
    value?.reportDate,
    value?.path,
    meta.comparePath,
  ];
  for (const source of sources) {
    const raw = String(source || "").trim();
    if (!raw) continue;
    const keyMatch = raw.match(/(?:^|[^0-9])(20\d{2})(0[1-9]|1[0-2])(?:[^0-9]|$)/);
    if (keyMatch) return `${keyMatch[1]}${keyMatch[2]}`;
    const dateMatch = raw.match(/(?:^|[^0-9])(20\d{2})[-/](0[1-9]|1[0-2])(?:[-/][0-3]?\d)?(?:[^0-9]|$)/);
    if (dateMatch) return `${dateMatch[1]}${dateMatch[2]}`;
  }
  return "";
}

function workdayNumber(value) {
  const meta = value?.meta || {};
  const direct = numberValue(meta.workdayNo || value?.workdayNo);
  if (direct > 0) return direct;
  const sources = [meta.reportKey, value?.reportKey, value?.path, meta.comparePath];
  for (const source of sources) {
    const match = String(source || "").match(/WD0*(\d+)/i);
    if (match) return Number(match[1]) || 0;
  }
  return 0;
}

function historyIdentity(value) {
  const meta = value?.meta || {};
  const reportKey = String(meta.reportKey || value?.reportKey || "").trim();
  if (reportKey) return reportKey;
  const period = periodKey(value);
  const workday = workdayNumber(value);
  if (period && workday) return `${period}-WD${String(workday).padStart(2, "0")}`;
  return String(meta.reportDate || value?.reportDate || value?.path || "").trim();
}

function historyOrder(value) {
  const workday = workdayNumber(value);
  if (workday > 0) return workday;
  const raw = String(value?.meta?.reportDate || value?.reportDate || "").trim();
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function indexedHistory(index) {
  if (Array.isArray(index)) return index;
  if (Array.isArray(index?.items)) return index.items;
  if (Array.isArray(index?.history)) return index.history;
  return [];
}

function selectRaceHistoryItems(index, current) {
  const currentPeriod = periodKey(current);
  const currentWorkday = workdayNumber(current);
  const currentIdentity = historyIdentity(current);
  const indexed = indexedHistory(index).filter((item) => item?.path);
  const compactHistory = indexed.filter((item) => String(item.path).startsWith("performance/compare/"));
  const candidates = compactHistory.length ? compactHistory : indexed;
  const unique = new Map();
  for (const item of candidates) {
    const itemPeriod = periodKey(item);
    if (currentPeriod && itemPeriod !== currentPeriod) continue;
    const itemWorkday = workdayNumber(item);
    if (currentWorkday && itemWorkday && itemWorkday > currentWorkday) continue;
    const identity = historyIdentity(item);
    if (!identity || identity === currentIdentity || unique.has(identity)) continue;
    unique.set(identity, item);
  }
  return [...unique.values()]
    .sort((a, b) => historyOrder(a) - historyOrder(b) || historyIdentity(a).localeCompare(historyIdentity(b), "en"))
    .slice(-Math.max(RACE_HISTORY_MAX - 1, 0));
}

async function loadRaceHistory(current, { onProgress } = {}) {
  const index = await fetchPerformanceJson(PERFORMANCE_HISTORY_INDEX, { timeoutMs: 8000 });
  const items = selectRaceHistoryItems(index, current);
  const stats = { remembered: 0, downloaded: 0 };
  const history = [];
  for (let cursor = 0; cursor < items.length; cursor += 2) {
    const batch = items.slice(cursor, cursor + 2);
    const results = await Promise.allSettled(batch.map(async (item) => {
      const snapshot = await enrichPerformancePack(await fetchPerformanceJson(item.path, { remember: true, stats }));
      if (!Array.isArray(snapshot?.ps) || !Array.isArray(snapshot?.ads)) return null;
      if (periodKey(current) && periodKey(snapshot) !== periodKey(current)) return null;
      return snapshot;
    }));
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) history.push(result.value);
    });
    onProgress?.({ loaded: Math.min(cursor + batch.length, items.length), total: items.length, stats });
  }
  const currentIdentity = historyIdentity(current);
  const unique = new Map();
  history.forEach((snapshot) => {
    const identity = historyIdentity(snapshot);
    if (!identity || identity === currentIdentity || unique.has(identity)) return;
    unique.set(identity, snapshot);
  });
  const ordered = [...unique.values()].sort((a, b) => historyOrder(a) - historyOrder(b) || historyIdentity(a).localeCompare(historyIdentity(b), "en"));
  return { timeline: [...ordered, current], stats };
}

function setTimelineReady(ready) {
  timelineReady = ready;
  document.querySelectorAll("[data-start-race]").forEach((cover) => {
    cover.disabled = !ready;
    const strong = cover.querySelector("strong");
    if (strong) strong.textContent = ready ? "START THE RACE" : "กำลังเตรียมช่วงการแข่งขัน...";
  });
}

function topRows(rows, key, mode, limit = 5) {
  return [...(rows || [])]
    .filter((row) => metricPercent(row, key) > 0)
    .sort((a, b) => metricPercent(b, key) - metricPercent(a, key)
      || metricActual(b, key) - metricActual(a, key)
      || personCode(a, mode).localeCompare(personCode(b, mode), "en"))
    .slice(0, limit);
}

function rowsFor(snapshot, mode) {
  return Array.isArray(snapshot?.[mode]) ? snapshot[mode] : [];
}

function cd3Basis(snapshot) {
  const flag = snapshot?.meta?.cd4OlCombinedIntoDc3;
  return flag === true ? "with-cd4" : flag === false ? "without-cd4" : "unknown";
}

function raceFrame(snapshot, mode, category) {
  return {
    label: snapshotLabel(snapshot),
    workday: workdayNumber(snapshot),
    rows: rowsFor(snapshot, mode).map((row) => ({
      id: personCode(row, mode) || personName(row, mode),
      code: personCode(row, mode),
      name: personName(row, mode),
      photoKey: personCode(row, mode),
      actual: metricActual(row, category.key),
      percent: metricPercent(row, category.key),
      value: metricPercent(row, category.key),
    })).filter((row) => row.id),
  };
}

function buildFrames(mode, category) {
  let source = timeline.length ? timeline : [latest];
  if (category.key === "dc3") {
    const basis = cd3Basis(latest);
    source = basis === "unknown" ? [latest] : source.filter((snapshot) => cd3Basis(snapshot) === basis);
    if (!source.includes(latest)) source.push(latest);
  }
  return source.map((snapshot) => raceFrame(snapshot, mode, category));
}

function rankFrameRows(rows, limit = 5) {
  return [...(rows || [])]
    .filter((row) => numberValue(row.value) > 0)
    .sort((a, b) => numberValue(b.value) - numberValue(a.value)
      || numberValue(b.actual) - numberValue(a.actual)
      || String(a.code || a.id).localeCompare(String(b.code || b.id), "en"))
    .slice(0, limit);
}

function buildRaceStages(frames) {
  let previousSlots = new Map();
  return frames.map((frame, frameIndex) => {
    const top = rankFrameRows(frame.rows);
    const slots = new Map();
    if (frameIndex === 0) {
      [...top]
        .sort((a, b) => String(a.name || a.code).localeCompare(String(b.name || b.code), "th"))
        .forEach((row, index) => slots.set(row.id, index));
    } else {
      const occupied = new Set();
      top.forEach((row) => {
        if (!previousSlots.has(row.id)) return;
        const slot = previousSlots.get(row.id);
        slots.set(row.id, slot);
        occupied.add(slot);
      });
      const openSlots = Array.from({ length: 5 }, (_, index) => index).filter((slot) => !occupied.has(slot));
      top
        .filter((row) => !slots.has(row.id))
        .sort((a, b) => String(a.code || a.id).localeCompare(String(b.code || b.id), "en"))
        .forEach((row, index) => slots.set(row.id, openSlots[index]));
    }
    previousSlots = slots;
    return {
      ...frame,
      top,
      slots,
      rowMap: new Map(frame.rows.map((row) => [row.id, row])),
    };
  });
}

function zeroRaceStage(firstStage) {
  const rows = firstStage.top.map((row) => ({ ...row, actual: 0, percent: 0, value: 0 }));
  return {
    label: "เริ่มต้น",
    workday: 0,
    rows,
    top: rows,
    slots: new Map(firstStage.slots),
    rowMap: new Map(rows.map((row) => [row.id, row])),
  };
}

function stageRows(stage) {
  return stage.top.map((row) => ({
    ...row,
    slot: stage.slots.get(row.id) ?? 0,
    presence: 1,
    state: "active",
  }));
}

function easeInOutCubic(value) {
  const progress = Math.max(0, Math.min(numberValue(value), 1));
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function interpolatePerson(from, to, progress) {
  const source = from || to || {};
  const target = to || from || {};
  return {
    id: target.id || source.id,
    code: target.code || source.code || target.id || source.id,
    name: target.name || source.name || target.code || source.code || target.id || source.id,
    photoKey: target.photoKey || source.photoKey || target.code || source.code || target.id || source.id,
    actual: numberValue(source.actual) + (numberValue(target.actual) - numberValue(source.actual)) * progress,
    percent: numberValue(source.percent) + (numberValue(target.percent) - numberValue(source.percent)) * progress,
    value: numberValue(source.value) + (numberValue(target.value) - numberValue(source.value)) * progress,
  };
}

function transitionRows(fromStage, toStage, progress) {
  const ids = new Set([...fromStage.slots.keys(), ...toStage.slots.keys()]);
  const rows = [];
  ids.forEach((id) => {
    const fromActive = fromStage.slots.has(id);
    const toActive = toStage.slots.has(id);
    const from = fromStage.rowMap.get(id) || (toStage.rowMap.get(id) ? { ...toStage.rowMap.get(id), actual: 0, percent: 0, value: 0 } : null);
    const to = toStage.rowMap.get(id) || (fromStage.rowMap.get(id) ? { ...fromStage.rowMap.get(id), actual: 0, percent: 0, value: 0 } : null);
    if (!from && !to) return;
    let presence = 1;
    let state = "active";
    if (fromActive && !toActive) {
      presence = 1 - Math.min(progress / 0.46, 1);
      state = "leaving";
    } else if (!fromActive && toActive) {
      presence = Math.max((progress - 0.54) / 0.46, 0);
      state = "entering";
    }
    rows.push({
      ...interpolatePerson(from, to, progress),
      slot: toActive ? (toStage.slots.get(id) ?? 0) : (fromStage.slots.get(id) ?? 0),
      presence,
      state,
    });
  });
  return rows;
}

function stageDistance(fromStage, toStage) {
  const ids = new Set([...fromStage.slots.keys(), ...toStage.slots.keys()]);
  if (!ids.size) return 1;
  let squared = 0;
  ids.forEach((id) => {
    const from = numberValue(fromStage.rowMap.get(id)?.value);
    const to = numberValue(toStage.rowMap.get(id)?.value);
    const delta = to - from;
    squared += delta * delta;
  });
  return Math.sqrt(squared / ids.size);
}

function raceSegmentWeights(sequence) {
  return sequence.slice(1).map((toStage, index) => {
    const fromStage = sequence[index];
    const distance = stageDistance(fromStage, toStage);
    const workdayGap = index === 0 ? 1 : Math.max(numberValue(toStage.workday) - numberValue(fromStage.workday), 1);
    let weight = 0.8 + Math.sqrt(Math.max(distance, 1) / 8);
    if (index === 0) weight *= 1.25;
    else weight *= Math.min(Math.sqrt(workdayGap), 1.5);
    return Math.max(1, Math.min(weight, 3.6));
  });
}

function segmentAt(progress, weights) {
  const total = weights.reduce((sum, value) => sum + value, 0) || 1;
  const position = Math.max(0, Math.min(progress, 1)) * total;
  let before = 0;
  for (let index = 0; index < weights.length; index += 1) {
    const after = before + weights[index];
    if (position <= after || index === weights.length - 1) {
      return { index, local: Math.max(0, Math.min((position - before) / Math.max(weights[index], 0.0001), 1)) };
    }
    before = after;
  }
  return { index: Math.max(weights.length - 1, 0), local: 1 };
}

function raceSwapCount(stages) {
  let swaps = 0;
  for (let index = 1; index < stages.length; index += 1) {
    const previous = new Set(stages[index - 1].top.map((row) => row.id));
    swaps += stages[index].top.filter((row) => !previous.has(row.id)).length;
  }
  return swaps;
}

function raceParticipants(stages) {
  const ids = new Set();
  stages.forEach((stage) => stage.top.forEach((row) => ids.add(row.id)));
  return [...ids];
}

function cardHtml(mode, category) {
  const raceId = `race-${mode}-${category.key}`;
  return `<article class="award-slide race-card" data-award-slide data-title="${escapeHtml(category.title)}" data-category="${category.key}" data-race="${raceId}">
    <button class="race-cover" type="button" data-start-race="${raceId}">
      <span class="race-badge">${escapeHtml(category.title)}</span>
      <strong>START THE RACE</strong>
    </button>
    <header class="race-header"><div><h2>${escapeHtml(category.title)}</h2><p>${escapeHtml(category.subtitle)} • แข่งขันด้วย % Index เทียบเป้า</p></div><span class="race-date" id="date-${raceId}">พร้อมเริ่ม</span></header>
    <div class="race-track" id="${raceId}"></div>
    <footer class="race-footer"><button class="race-button" type="button" data-replay="${raceId}">↻ แข่งใหม่</button></footer>
  </article>`;
}

function renderMode(mode) {
  const container = byId(`slides-${mode}`);
  container.innerHTML = categories.map((category) => cardHtml(mode, category)).join("");
  showAward(mode, modeState.index[mode]);
}

function slides(mode) {
  return [...document.querySelectorAll(`#stage-${mode} [data-award-slide]`)];
}

function cancelModeRaces(mode) {
  slides(mode).forEach((card) => {
    const raceId = card.dataset.race;
    if (!raceId) return;
    raceTokens.set(raceId, Symbol(raceId));
    countdownTokens.set(raceId, Symbol(raceId));
  });
  stopTrack("race");
}

function showAward(mode, index) {
  stopAllAudio();
  cancelModeRaces(mode);
  const all = slides(mode);
  if (!all.length) return;
  const safe = Math.max(0, Math.min(index, all.length - 1));
  modeState.index[mode] = safe;
  all.forEach((slide, position) => slide.classList.toggle("active", position === safe));
  const active = all[safe];
  byId(`counter-${mode}`).textContent = `รางวัล ${safe + 1} / ${all.length}`;
  byId(`title-${mode}`).textContent = active.dataset.title;
  byId(`prev-${mode}`).disabled = safe === 0;
  byId(`next-${mode}`).disabled = safe === all.length - 1;
}

function switchMode(mode) {
  if (modeState.active !== mode) cancelModeRaces(modeState.active);
  modeState.active = mode;
  document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  document.querySelectorAll(".mode-panel").forEach((panel) => panel.hidden = panel.dataset.panel !== mode);
  showAward(mode, modeState.index[mode]);
}

function moveAward(mode, direction, wrap = false) {
  const all = slides(mode);
  if (!all.length) return;
  const current = modeState.index[mode];
  const next = wrap ? (current + direction + all.length) % all.length : current + direction;
  showAward(mode, next);
}

function applyRaceColor(container, element, slotIndex) {
  const tone = container._slotColors?.[slotIndex] || RACE_PALETTE[slotIndex % RACE_PALETTE.length];
  element.dataset.raceColor = tone.key;
  element.dataset.raceSlot = String(slotIndex);
  const bar = element.querySelector(".race-bar");
  const avatar = element.querySelector(".race-avatar");
  const percent = element.querySelector(".race-percent");
  bar.style.borderTopColor = tone.accent;
  bar.style.background = `linear-gradient(${tone.top},${tone.mid} 52%,${tone.bottom})`;
  bar.style.boxShadow = `0 -8px 24px ${tone.glow}`;
  avatar.style.borderColor = tone.accent;
  avatar.style.boxShadow = `0 0 0 4px #050505,0 0 22px ${tone.glow}`;
  percent.style.color = tone.accent;
}

function renderRace(container, rows, category, finished = false) {
  const visible = rows.filter((row) => numberValue(row.presence) > 0.05);
  const ranked = [...visible].sort((a, b) => b.value - a.value || b.actual - a.actual || String(a.code).localeCompare(String(b.code), "en"));
  const rankMap = new Map(ranked.map((row, index) => [row.id, index + 1]));
  const maximum = Math.max(container._maximum || 1, 1);
  const renderedIds = new Set();
  rows.forEach((person) => {
    renderedIds.add(person.id);
    const slotIndex = Number.isFinite(Number(person.slot)) ? Number(person.slot) : 0;
    let element = container.querySelector(`[data-person="${CSS.escape(person.id)}"]`);
    if (!element) {
      element = document.createElement("div");
      element.className = "race-row";
      element.dataset.person = person.id;
      element.innerHTML = `<div class="race-lane"><div class="race-bar"><div class="race-avatar"><img alt=""></div><div class="race-copy"><span class="race-rank"></span><span class="race-name"></span><span class="race-code"></span><strong class="race-actual"></strong><strong class="race-percent"></strong></div></div></div>`;
      container.appendChild(element);
    }
    const presence = Math.max(0, Math.min(numberValue(person.presence), 1));
    const rank = rankMap.get(person.id) || ranked.length || 1;
    element.classList.toggle("race-finished", finished && presence > 0.99);
    element.dataset.raceState = person.state || "active";
    element.style.opacity = String(presence);
    element.style.visibility = presence <= 0.001 ? "hidden" : "visible";
    element.style.pointerEvents = presence > 0.5 ? "auto" : "none";
    element.style.transform = `translateX(${slotIndex * 100}%)`;
    if (finished && container._finalRanks.has(person.id)) element.dataset.finalRank = String(container._finalRanks.get(person.id));
    else delete element.dataset.finalRank;
    const bar = element.querySelector(".race-bar");
    bar.style.height = person.value > 0 ? `${Math.max((person.value / maximum) * 100, 1.5)}%` : "0%";
    element.querySelector(".race-rank").textContent = String(rank);
    element.querySelector(".race-name").textContent = person.name;
    element.querySelector(".race-code").textContent = person.code;
    element.querySelector(".race-actual").textContent = formatActual(person.actual, category);
    element.querySelector(".race-percent").textContent = formatPercent(person.percent);
    applyRaceColor(container, element, slotIndex);
    const image = element.querySelector("img");
    if (image.dataset.key !== person.photoKey) {
      image.dataset.key = person.photoKey;
      image.src = personImageUrl(person.photoKey);
      image.onerror = () => safeImage(image, person.name);
    }
  });
  container.querySelectorAll(".race-row").forEach((element) => {
    if (renderedIds.has(element.dataset.person)) return;
    element.style.opacity = "0";
    element.style.visibility = "hidden";
    element.style.pointerEvents = "none";
  });
}

function cleanupRaceRows(container, activeIds) {
  const keep = new Set(activeIds);
  container.querySelectorAll(".race-row").forEach((element) => {
    if (!keep.has(element.dataset.person)) element.remove();
  });
}

function animateRace(container, stages, category, token) {
  const zero = zeroRaceStage(stages[0]);
  const sequence = [zero, ...stages];
  const weights = raceSegmentWeights(sequence);
  container._segmentWeights = weights;
  container.dataset.raceMotion = "weighted-cubic";
  return new Promise((resolve) => {
    let started = 0;
    const step = (timestamp) => {
      if (raceTokens.get(container.id) !== token) return resolve(false);
      if (!started) started = timestamp;
      const progress = Math.min((timestamp - started) / RACE_DURATION_MS, 1);
      const position = segmentAt(progress, weights);
      const fromStage = sequence[position.index];
      const toStage = sequence[position.index + 1];
      const eased = easeInOutCubic(position.local);
      const rows = transitionRows(fromStage, toStage, eased);
      renderRace(container, rows, category, false);
      byId(`date-${container.id}`).textContent = toStage.label;
      if (progress < 1) requestAnimationFrame(step);
      else resolve(true);
    };
    requestAnimationFrame(step);
  });
}

async function startRace(raceId) {
  const container = byId(raceId);
  if (!container || !timelineReady) return;
  const card = container.closest(".race-card");
  if (!card?.classList.contains("active") || card.closest(".mode-panel")?.hidden) return;
  const mode = raceId.split("-")[1];
  const key = raceId.split("-").slice(2).join("-");
  const category = categories.find((item) => item.key === key);
  if (!category) return;
  const stages = buildRaceStages(buildFrames(mode, category));
  const finalStage = stages.at(-1);
  card.classList.remove("winner-ready");
  container._winner = null;
  container._category = null;
  if (!finalStage?.top?.length) {
    container.innerHTML = '<div class="race-empty">ไม่มีข้อมูลสำหรับการแข่งขันรางวัลนี้</div>';
    byId(`date-${raceId}`).textContent = "ไม่มีข้อมูลสำหรับการแข่งขัน";
    stopTrack("race");
    return;
  }
  const laneCount = Math.max(...stages.map((stage) => stage.top.length), 1);
  container.innerHTML = "";
  container.style.setProperty("--race-lanes", String(laneCount));
  container._slotColors = shuffledPalette();
  container._maximum = Math.max(...stages.flatMap((stage) => stage.top.map((row) => row.value)), 1) * 1.05;
  container._finalRanks = new Map(finalStage.top.map((row, index) => [row.id, index + 1]));
  container.dataset.raceSwaps = String(raceSwapCount(stages));
  container.dataset.raceParticipants = raceParticipants(stages).join(",");
  const token = Symbol(raceId);
  raceTokens.set(raceId, token);
  closeWinner(card);
  playRaceAudio();
  const zero = zeroRaceStage(stages[0]);
  renderRace(container, stageRows(zero), category, false);
  const completed = await animateRace(container, stages, category, token);
  stopTrack("race");
  if (!completed || raceTokens.get(raceId) !== token) return;
  const finalRows = stageRows(finalStage);
  renderRace(container, finalRows, category, true);
  cleanupRaceRows(container, finalStage.top.map((row) => row.id));
  const winner = finalStage.top[0];
  if (!winner || winner.value <= 0) return;
  container._winner = winner;
  container._category = category;
  card.classList.add("winner-ready");
  byId(`date-${raceId}`).textContent = "เปิดอันดับแล้ว • แตะกรอบเพื่อเปิดผู้ชนะ";
}

function track(name) {
  if (!audioState.tracks.has(name)) {
    const audio = new Audio(AUDIO[name]);
    audio.preload = name === "fireworks" ? "metadata" : "auto";
    audio.playsInline = true;
    audioState.tracks.set(name, audio);
  }
  return audioState.tracks.get(name);
}

function playTrack(name) {
  const audio = track(name);
  audio.pause();
  try { audio.currentTime = 0; } catch {}
  audio.play()?.catch(() => {});
}

function stopTrack(name) {
  const audio = audioState.tracks.get(name);
  if (!audio) return;
  audio.pause();
  try { audio.currentTime = 0; } catch {}
}

function stopAllAudio() {
  if (audioState.fireworksTimer) clearTimeout(audioState.fireworksTimer);
  audioState.fireworksTimer = 0;
  ["race", "applause", "fireworks"].forEach(stopTrack);
}

function playRaceAudio() {
  stopAllAudio();
  playTrack("race");
}

function playWinnerAudio() {
  stopAllAudio();
  playTrack("applause");
  audioState.fireworksTimer = setTimeout(() => playTrack("fireworks"), TEST_MODE ? 40 : 5000);
}

function playCountdownTone(isGo) {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;
  audioState.context ||= new AudioContextConstructor();
  const context = audioState.context;
  const play = () => {
    const start = context.currentTime + .015;
    const duration = isGo ? .72 : .14;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = isGo ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(isGo ? 880 : 660, start);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(isGo ? .24 : .18, start + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .02);
  };
  if (context.state === "suspended") context.resume().then(play).catch(() => {});
  else play();
}

function countdown(cover, raceId) {
  if (!latest || !timelineReady) return;
  const mode = raceId.split("-")[1];
  const key = raceId.split("-").slice(2).join("-");
  if (!topRows(rowsFor(latest, mode), key, mode, 1).length) {
    cover.disabled = true;
    cover.innerHTML = '<span class="race-badge">ไม่มีข้อมูล</span><strong>รางวัลนี้ยังไม่มีผลการแข่งขัน</strong>';
    byId(`date-${raceId}`).textContent = "ไม่มีข้อมูลสำหรับการแข่งขัน";
    return;
  }
  const token = Symbol(raceId);
  countdownTokens.set(raceId, token);
  cover.disabled = true;
  cover.innerHTML = '<span class="countdown">3</span>';
  const number = cover.querySelector(".countdown");
  const valid = () => countdownTokens.get(raceId) === token && cover.isConnected && cover.closest(".race-card")?.classList.contains("active");
  playCountdownTone(false);
  setTimeout(() => { if (valid()) { number.textContent = "2"; playCountdownTone(false); } }, COUNTDOWN_STEP_MS);
  setTimeout(() => { if (valid()) { number.textContent = "1"; playCountdownTone(false); } }, COUNTDOWN_STEP_MS * 2);
  setTimeout(() => { if (valid()) { number.textContent = "GO!"; playCountdownTone(true); } }, COUNTDOWN_STEP_MS * 3);
  setTimeout(() => {
    if (!valid()) return;
    cover.classList.add("hidden");
    setTimeout(() => cover.remove(), TEST_MODE ? 10 : 450);
    startRace(raceId);
  }, COUNTDOWN_HIDE_MS);
}

function winnerOverlay(card) {
  let overlay = card.querySelector(".winner-reveal");
  if (overlay) return overlay;
  overlay = document.createElement("section");
  overlay.className = "winner-reveal";
  overlay.innerHTML = `<img class="winner-photo-bg" alt=""><div class="fireworks"></div><div class="winner-photo-frame"><img class="winner-photo" alt=""></div><div class="confetti"></div><button class="winner-back" type="button" aria-label="กลับไปดูอันดับ">←</button><div class="winner-content"><h2 class="winner-title"></h2><span class="winner-code"></span><strong class="winner-value"></strong><strong class="winner-percent"></strong></div>`;
  const colors = ["#facc15", "#fff4a3", "#fff", "#fb923c", "#fb7185"];
  const confetti = overlay.querySelector(".confetti");
  for (let index = 0; index < 48; index += 1) {
    const piece = document.createElement("i");
    piece.style.setProperty("--left", `${(index * 37) % 100}%`);
    piece.style.setProperty("--delay", `${(index % 12) * .1}s`);
    piece.style.setProperty("--duration", `${2.4 + (index % 5) * .28}s`);
    piece.style.setProperty("--drift", `${((index % 9) - 4) * 24}px`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    confetti.appendChild(piece);
  }
  const fireworks = overlay.querySelector(".fireworks");
  [[18,24,.05],[82,20,.38],[32,42,.82],[70,40,1.18],[12,58,1.55],[88,56,1.92]].forEach(([x,y,delay], index) => {
    const burst = document.createElement("i");
    burst.style.setProperty("--x", `${x}%`);
    burst.style.setProperty("--y", `${y}%`);
    burst.style.setProperty("--delay", `${delay}s`);
    burst.style.setProperty("--color", colors[index % colors.length]);
    fireworks.appendChild(burst);
  });
  overlay.querySelector(".winner-back").addEventListener("click", (event) => {
    event.stopPropagation();
    closeWinner(card);
  });
  card.appendChild(overlay);
  return overlay;
}

function showWinner(card) {
  const container = byId(card.dataset.race);
  const winner = container?._winner;
  const category = container?._category;
  if (!winner || !category || winner.value <= 0) return;
  const overlay = winnerOverlay(card);
  const url = personImageUrl(winner.photoKey);
  const background = overlay.querySelector(".winner-photo-bg");
  const image = overlay.querySelector(".winner-photo");
  background.src = url;
  image.src = url;
  background.onerror = () => safeImage(background, winner.name);
  image.onerror = () => safeImage(image, winner.name);
  image.alt = `ผู้ชนะอันดับ 1 ${winner.name}`;
  overlay.querySelector(".winner-title").textContent = winner.name;
  overlay.querySelector(".winner-code").textContent = winner.code;
  overlay.querySelector(".winner-value").textContent = formatActual(winner.actual, category);
  overlay.querySelector(".winner-percent").textContent = formatPercent(winner.percent);
  document.body.classList.add("winner-overlay-open");
  overlay.classList.add("visible");
  playWinnerAudio();
}

function closeWinner(card) {
  stopAllAudio();
  card?.querySelector(".winner-reveal")?.classList.remove("visible");
  document.body.classList.remove("winner-overlay-open");
}

function activeFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function syncFullscreen() {
  document.body.classList.toggle("presentation-mode", Boolean(activeFullscreenElement()) || document.body.classList.contains("pseudo-fullscreen"));
}

async function toggleFullscreen() {
  if (document.body.classList.contains("pseudo-fullscreen")) {
    if (pseudoFullscreenHistoryPushed) {
      history.back();
      return;
    }
    document.body.classList.remove("pseudo-fullscreen");
    syncFullscreen();
    return;
  }
  if (activeFullscreenElement()) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    await exit?.call(document);
    syncFullscreen();
    return;
  }
  const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (request) {
    try {
      await request.call(document.documentElement);
      syncFullscreen();
      return;
    } catch {}
  }
  history.pushState({ performanceFullscreen: true }, "", location.href);
  pseudoFullscreenHistoryPushed = true;
  document.body.classList.add("pseudo-fullscreen");
  syncFullscreen();
}

function periodDisplayMeta(snapshot) {
  return { ...(snapshot || {}), ...(snapshot?.meta || {}) };
}

function renderLatest() {
  byId("period").textContent = `CHAMPIONS OF ${formatPerformancePeriod(periodDisplayMeta(latest))}`;
  renderMode("ps");
  renderMode("ads");
  switchMode(modeState.active);
}

async function bootstrap() {
  const status = byId("status");
  try {
    latest = await loadLatestPerformance();
    timeline = [latest];
    timelineReady = false;
    renderLatest();
    setTimelineReady(false);
    status.textContent = `ข้อมูลล่าสุด • ${snapshotLabel(latest)} · กำลังเตรียมช่วงการแข่งขัน`;
    loadRaceHistory(latest, {
      onProgress: ({ loaded, total }) => status.textContent = `ข้อมูลล่าสุด • ${snapshotLabel(latest)} · กำลังโหลดช่วงการแข่งขัน ${loaded}/${total}`,
    }).then((result) => {
      timeline = result.timeline;
      setTimelineReady(true);
      status.textContent = `ข้อมูลล่าสุด • ${snapshotLabel(latest)} · ใช้การแข่งขัน ${timeline.length} ช่วง`;
    }).catch((error) => {
      timeline = [latest];
      setTimelineReady(true);
      status.textContent = `ข้อมูลล่าสุด • ${snapshotLabel(latest)} · ใช้การแข่งขัน 1 ช่วง · ประวัติโหลดไม่สำเร็จ (${error.message})`;
    });
  } catch (error) {
    status.textContent = `โหลดข้อมูลล่าสุดไม่สำเร็จ (${error.name === "AbortError" ? "หมดเวลา" : error.message})`;
    status.classList.add("error");
  }
}

document.addEventListener("click", (event) => {
  const mode = event.target.closest("[data-mode]");
  if (mode) switchMode(mode.dataset.mode);
  const previous = event.target.closest("[data-previous]");
  if (previous) moveAward(previous.dataset.previous, -1);
  const next = event.target.closest("[data-next]");
  if (next) moveAward(next.dataset.next, 1);
  const cover = event.target.closest("[data-start-race]");
  if (cover) countdown(cover, cover.dataset.startRace);
  const replay = event.target.closest("[data-replay]");
  if (replay) startRace(replay.dataset.replay);
  const card = event.target.closest(".race-card.winner-ready");
  if (card && !event.target.closest("button,a") && !card.querySelector(".winner-reveal.visible")) showWinner(card);
});

byId("fullscreen-toggle").addEventListener("click", toggleFullscreen);
byId("presentation-prev").addEventListener("click", () => moveAward(modeState.active, -1, true));
byId("presentation-next").addEventListener("click", () => moveAward(modeState.active, 1, true));
document.addEventListener("fullscreenchange", syncFullscreen);
document.addEventListener("webkitfullscreenchange", syncFullscreen);
document.addEventListener("visibilitychange", () => { if (document.hidden) { stopAllAudio(); cancelModeRaces(modeState.active); } });
window.addEventListener("popstate", () => {
  if (document.body.classList.contains("pseudo-fullscreen")) {
    document.body.classList.remove("pseudo-fullscreen");
    pseudoFullscreenHistoryPushed = false;
    syncFullscreen();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const visible = document.querySelector(".winner-reveal.visible");
    if (visible) {
      closeWinner(visible.closest(".race-card"));
      return;
    }
    if (document.body.classList.contains("presentation-mode")) {
      event.preventDefault();
      toggleFullscreen();
      return;
    }
  }
  if (!document.body.classList.contains("presentation-mode")) return;
  if (event.key === "ArrowLeft") moveAward(modeState.active, -1, true);
  if (event.key === "ArrowRight") moveAward(modeState.active, 1, true);
});

bootstrap();
