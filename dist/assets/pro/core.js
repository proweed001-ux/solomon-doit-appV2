import {
  bindQuantityInputs,
  commitPendingQuantityEdit,
  pendingQuantityEdit,
} from "./send-store.js";
import { renderOrderMode } from "./order.js";
import { renderDoneMode } from "./done.js";
import {
  buildTelesaleBills,
  renderTelesaleDrawer,
  TELE_PAGE_SIZE,
} from "./telesale.js";
import {
  $,
  $$,
  T,
  N,
  F,
  B,
  E,
  TITLE,
  uniq,
  dlabel,
} from "./utils.js";
import {
  createSelection,
  state,
  snap,
  push,
  restore,
  rec,
  save,
  loadState,
  rkey,
  pkKey,
  mapVal,
  sumMap,
  currentState,
  historyStats,
  trimHistory,
  restoreHistoryCheckpoint,
} from "./state.js";
import { norm, arr, parseDoitFile } from "./parser-adapter.js";
import {
  okDate,
  okPs,
  okCut,
  okBrand,
  okType,
  okQ,
  sourceRows,
  teleRows,
  options,
  group,
  pickPool,
  distPool,
} from "./filters.js";
import {
  createRealBillSelector,
  REAL_BILL_PAGE_SIZE,
  renderRealBills,
} from "./real-bills.js";
import { publicFetch, resolveCloudPayload } from "./data-source.js";
import { preparePrint } from "./print.js";
(() => {
  "use strict";
  const realBillSelector = createRealBillSelector();
  let rowsVersion = 0;
  let realBillPage = 1;
  let realBillResultKey = "";
  let realBillRenderToken = 0;
  let realBillRenderStats = {
    totalBills: 0,
    renderedBills: 0,
    renderedRows: 0,
  };
  let realBillPickerSession = null;
  let realBillPickerToken = 0;
  const realBillUiMetrics = {
    pickerOptionsCalls: 0,
    pickerListRenders: 0,
    pickerDomMax: 0,
    pickerDelegatedBindings: 0,
    pickerToggleDomScans: 0,
  };
  const corePerformance = {
    fullRenderCalls: 0,
    pickPoolCalls: 0,
    groupCalls: 0,
    summaryBuilds: 0,
    manualSentCalls: 0,
    telesaleModelBuilds: 0,
    telesaleCountBuilds: 0,
    shipSummaryRowsScanned: 0,
    telesaleDrawerRenders: 0,
    telesaleButtonUpdates: 0,
    realBillPageRenders: 0,
    lastFullRenderMs: 0,
  };
  const summaryCache = {
    poolSignature: "",
    pool: [],
    totalsSignature: "",
    totals: null,
  };
  const telesaleCache = {
    signature: "",
    bills: [],
    countSignature: "",
    count: 0,
  };
  const REAL_BILL_PICKER_WINDOW = 120;
  let fullRenderSequence = 0;
  let activeFullRender = null;

  function msg(s) {
    const m = $("#msg");
    if (m) m.textContent = s;
  }
  function cloud(s) {
    const m = $("#cloudMsg");
    if (m) m.innerHTML = s;
  }
  function lab(k) {
    return (
      {
        dates: "วันที่",
        ps: "PS",
        orderStores: "ตัดร้านบิลจริง",
        receivers: "ส่งให้ร้าน",
        billStores: "เลือกร้านบิลจริง",
        brands: "แบรนด์",
        types: "ประเภทสินค้า",
      }[k] || k
    );
  }
  function modeName() {
    return (
      {
        pick: "ถอดของ Pro",
        dist: "กระจายสินค้า",
        ship: "บิลจริง",
        done: "จัดแล้ว",
        raw: "รายการดิบ",
        remain: "สรุปของเหลือ",
        order: "รวม order",
      }[state.mode] || "รายการ"
    );
  }
  function activePickerKind(requestedKind) {
    return requestedKind === "receivers" && state.mode === "ship"
      ? "billStores"
      : requestedKind;
  }
  function keepSelectedPickerOptions(kind, pickerItems) {
    const optionsByValue = new Map(
      pickerItems.map((item) => [
        T(item.value),
        { ...item, available: true },
      ]),
    );
    const selectedValues = uniq([
      ...(state.sel[kind] || []),
      ...(state.pickKind === kind ? state.tmp : []),
    ]);
    selectedValues.forEach((value) => {
      if (optionsByValue.has(value)) return;
      optionsByValue.set(value, {
        value,
        available: false,
        label:
          (kind === "dates" ? dlabel(value) : value) +
          " · เลือกอยู่ — ไม่มีในชุดปัจจุบัน",
      });
    });
    return [...optionsByValue.values()].sort(
      (left, right) =>
        Number(right.available === false) -
        Number(left.available === false),
    );
  }
  function pickerOptions(kind) {
    let pickerItems;
    if (
      state.mode === "ship" &&
      ["dates", "ps", "orderStores", "billStores", "brands", "types"].includes(
        kind,
      )
    ) {
      realBillUiMetrics.pickerOptionsCalls += 1;
      pickerItems = realBillSelector.pickerOptions(
        kind,
        state.rows,
        state.sel,
        state.q,
        rowsVersion,
      );
    } else {
      pickerItems = options(kind).map((value) => ({
        value,
        label: kind === "dates" ? dlabel(value) : value,
      }));
    }
    return keepSelectedPickerOptions(kind, pickerItems);
  }
  function undo() {
    commitPendingQuantityEdit({ render: false, reason: "undo" });
    if (!state.hist.length) return msg("ไม่มีรายการ Undo");
    closePick();
    state.redoStack.push(snap());
    restore(state.hist.pop());
    trimHistory();
    realBillSelector.refreshFilters();
    realBillPage = 1;
    render();
    msg("Undo แล้ว");
  }
  function redo() {
    commitPendingQuantityEdit({ render: false, reason: "redo" });
    if (!state.redoStack.length) return msg("ไม่มีรายการ Redo");
    closePick();
    state.hist.push(snap());
    restore(state.redoStack.pop());
    trimHistory();
    realBillSelector.refreshFilters();
    realBillPage = 1;
    render();
    msg("Redo แล้ว");
  }
  function txt(k) {
    const a = state.sel[k] || [];
    if (k === "orderStores") {
      if (!a.length) return "ตัดร้านบิลจริง: ไม่ตัดร้านใด";
      if (a.length === 1) return "ตัดร้านบิลจริง: ตัด " + a[0];
      return "ตัดร้านบิลจริง: ตัด " + F(a.length) + " ร้าน";
    }
    if (!a.length)
      return (
        lab(k) +
        ": " +
        (k === "receivers" || k === "billStores"
          ? "ยังไม่เลือก"
          : "ทั้งหมด")
      );
    if (a.length === 1)
      return lab(k) + ": " + (k === "dates" ? dlabel(a[0]) : a[0]);
    return lab(k) + ": เลือก " + F(a.length) + " รายการ";
  }
  function updText() {
    ["dates", "ps", "orderStores", "receivers", "brands", "types"].forEach(
      (k) => {
        const e = $("#" + k + "Text");
        if (e) e.textContent = txt(k);
      },
    );
    const activeStoreKind = activePickerKind("receivers");
    const storeLabel = lab(activeStoreKind);
    const label = $("#sendLabelText");
    if (label) label.textContent = storeLabel + ":";
    const s = $("#sendText");
    if (s) {
      s.textContent = txt(activeStoreKind).replace(storeLabel + ": ", "");
    }
    const heading = $("#modeHeading");
    if (heading) heading.textContent = modeName();
  }
  function openPick(requestedKind) {
    commitPendingQuantityEdit({ render: false, reason: "open-picker" });
    const k = activePickerKind(requestedKind);
    state.pickKind = k;
    state.tmp = [...(state.sel[k] || [])];
    $("#pickTitle").textContent =
      k === "orderStores" ? "ติ๊กเพื่อเอาร้านบิลจริงออก" : lab(k);
    $("#pickShade").classList.add("on");
    if (state.mode !== "ship") {
      realBillPickerSession = null;
      drawPick();
      return;
    }
    const token = ++realBillPickerToken;
    realBillPickerSession = { kind: k, options: null, token, page: 1 };
    $("#pickList").innerHTML =
      '<div class="empty realBillPickerLoading">กำลังเตรียมตัวเลือก…</div>';
    setPickerPending(true);
    requestAnimationFrame(() => {
      if (
        token !== realBillPickerToken ||
        !realBillPickerSession ||
        realBillPickerSession.kind !== k
      ) {
        return;
      }
      const options = pickerOptions(k);
      if (
        token !== realBillPickerToken ||
        !realBillPickerSession ||
        realBillPickerSession.kind !== k
      ) {
        return;
      }
      realBillPickerSession.options = options;
      renderPickerList(options, true);
      setPickerPending(false);
    });
  }
  function setPickerPending(pending) {
    const ok = $("#pickOk");
    const all = $("#pickAll");
    if (ok) ok.disabled = pending;
    if (all) all.disabled = pending;
  }
  function closePick() {
    realBillPickerToken += 1;
    realBillPickerSession = null;
    setPickerPending(false);
    $("#pickShade").classList.remove("on");
  }
  function renderPickerList(o, frozen = false) {
    if (frozen) realBillUiMetrics.pickerListRenders += 1;
    const list = $("#pickList");
    let shown = o;
    let pagerHtml = "";
    if (frozen) {
      const pages = Math.max(1, Math.ceil(o.length / REAL_BILL_PICKER_WINDOW));
      realBillPickerSession.page = Math.min(
        Math.max(1, realBillPickerSession.page || 1),
        pages,
      );
      const page = realBillPickerSession.page;
      shown = o.slice(
        (page - 1) * REAL_BILL_PICKER_WINDOW,
        page * REAL_BILL_PICKER_WINDOW,
      );
      pagerHtml =
        '<div class="realBillPickerPager"><button type="button" data-picker-page="' +
        Math.max(1, page - 1) +
        '" ' +
        (page === 1 ? "disabled" : "") +
        '>‹</button><span>หน้า ' +
        F(page) +
        "/" +
        F(pages) +
        " · " +
        F(o.length) +
        ' รายการ</span><button type="button" data-picker-page="' +
        Math.min(pages, page + 1) +
        '" ' +
        (page === pages ? "disabled" : "") +
        ">›</button></div>";
    }
    list.innerHTML = o.length
      ? shown
          .map(
            ({ value, label, available }) =>
              '<div class="pickItem ' +
              (state.tmp.includes(value) ? "on" : "") +
              (available === false ? " unavailable" : "") +
              '" data-v="' +
              E(value) +
              '" data-available="' +
              (available === false ? "0" : "1") +
              '"><span class="box">' +
              (state.tmp.includes(value) ? "✓" : "") +
              "</span><span>" +
              E(label) +
              "</span></div>",
          )
          .join("") + pagerHtml
      : '<div class="empty">ไม่มีรายการให้เลือก</div>';
    realBillUiMetrics.pickerDomMax = Math.max(
      realBillUiMetrics.pickerDomMax,
      list.querySelectorAll(".pickItem").length,
    );
    list.onclick = (event) => {
      const pageButton = event.target.closest("[data-picker-page]");
      if (pageButton && realBillPickerSession) {
        realBillPickerSession.page = N(pageButton.dataset.pickerPage) || 1;
        renderPickerList(realBillPickerSession.options, true);
        return;
      }
      const item = event.target.closest(".pickItem");
      if (!item || !list.contains(item)) return;
      const value = item.dataset.v;
      state.tmp = state.tmp.includes(value)
        ? state.tmp.filter((entry) => entry !== value)
        : state.tmp.concat(value);
      if (frozen) syncPickerItems(item);
      else drawPick();
    };
    realBillUiMetrics.pickerDelegatedBindings += 1;
  }
  function drawPick() {
    renderPickerList(pickerOptions(state.pickKind));
  }
  function syncPickerItems(target) {
    const items = target
      ? [target]
      : [...$("#pickList").querySelectorAll(".pickItem")];
    realBillUiMetrics.pickerToggleDomScans += items.length;
    items
      .forEach((item) => {
        const active = state.tmp.includes(item.dataset.v);
        item.classList.toggle("on", active);
        const box = item.querySelector(".box");
        if (box) box.textContent = active ? "✓" : "";
      });
  }
  function sameSelection(left, right) {
    const leftValues = new Set((left || []).map(T));
    const rightValues = new Set((right || []).map(T));
    return (
      leftValues.size === rightValues.size &&
      [...leftValues].every((value) => rightValues.has(value))
    );
  }
  function applyPick() {
    if (state.mode === "ship" && !realBillPickerSession?.options) {
      return msg("กำลังเตรียมตัวเลือก กรุณารอสักครู่");
    }
    const current = state.sel[state.pickKind] || [];
    const next = uniq(state.tmp);
    if (sameSelection(current, next)) {
      closePick();
      return msg("ตัวเลือกไม่เปลี่ยน");
    }
    push();
    state.sel[state.pickKind] = next;
    state.page = 1;
    realBillPage = 1;
    realBillSelector.refreshFilters();
    closePick();
    render();
    msg("ใช้ตัวเลือกแล้ว");
  }
  function clearPick() {
    state.tmp = [];
    if (realBillPickerSession) syncPickerItems();
    else drawPick();
  }
  function allPick() {
    const pickerItems = realBillPickerSession?.options;
    if (realBillPickerSession && !pickerItems) {
      return msg("กำลังเตรียมตัวเลือก กรุณารอสักครู่");
    }
    state.tmp = (pickerItems || pickerOptions(state.pickKind))
      .filter(({ available }) => available !== false)
      .map(({ value }) => value);
    if (realBillPickerSession) syncPickerItems();
    else drawPick();
  }
  function summaryPoolSignature() {
    return JSON.stringify([
      rowsVersion,
      state.sel.dates,
      state.sel.ps,
      state.sel.orderStores,
      state.sel.brands,
      state.sel.types,
      T(state.q).toLowerCase(),
      state.ins,
    ]);
  }
  function summaryTotalsSignature(poolSignature) {
    return JSON.stringify([
      poolSignature,
      state.send,
      state.add,
      state.pull,
    ]);
  }
  function invalidateSummary() {
    summaryCache.poolSignature = "";
    summaryCache.pool = [];
    summaryCache.totalsSignature = "";
    summaryCache.totals = null;
  }
  function currentSummary() {
    const poolSignature = summaryPoolSignature();
    if (summaryCache.poolSignature !== poolSignature) {
      corePerformance.pickPoolCalls += 1;
      corePerformance.groupCalls += 1;
      summaryCache.pool = pickPool();
      summaryCache.poolSignature = poolSignature;
      summaryCache.totalsSignature = "";
    }
    const totalsSignature = summaryTotalsSignature(poolSignature);
    if (
      summaryCache.totalsSignature !== totalsSignature ||
      !summaryCache.totals
    ) {
      const totals = { total: 0, sent: 0, remain: 0, raw: 0, net: 0 };
      summaryCache.pool.forEach((item) => {
        const sent = manualSent(item);
        totals.total += N(item.qty);
        totals.sent += sent;
        totals.remain +=
          N(item.qty) -
          sent +
          sumMap(state.add, item.poolKey) -
          sumMap(state.pull, item.poolKey);
        totals.raw += N(item.rawAmt);
        totals.net += N(item.netAmt);
      });
      summaryCache.totals = totals;
      summaryCache.totalsSignature = totalsSignature;
      corePerformance.summaryBuilds += 1;
    }
    return { pool: summaryCache.pool, ...summaryCache.totals };
  }
  function manualSent(g) {
    corePerformance.manualSentCalls += 1;
    return sumMap(state.send, g.poolKey);
  }
  function remain(g) {
    return (
      N(g.qty) -
      sumMap(state.send, g.poolKey) +
      sumMap(state.add, g.poolKey) -
      sumMap(state.pull, g.poolKey)
    );
  }
  function sourceDetail(g) {
    if (!state.showDetails) return "";
    const a = [...g.stores.entries()]
      .filter(([s]) => !state.sel.orderStores.includes(s))
      .sort((a, b) => b[1] - a[1])
      .map(([s, q]) => E(s) + " " + F(q))
      .join(" · ");
    return '<div class="detailBox">' + (a || "ไม่มีรายละเอียดร้าน") + "</div>";
  }
  function recalcPickRow(tr) {
    if (!tr) return;
    const pk = tr.dataset.poolKey,
      base = N(tr.dataset.baseQty),
      sendTotal = sumMap(state.send, pk),
      addTotal = sumMap(state.add, pk),
      pullTotal = sumMap(state.pull, pk),
      oldSend = mapVal(state.send, pk),
      oldAdd = mapVal(state.add, pk),
      oldPull = mapVal(state.pull, pk),
      sendV = N(tr.querySelector('[data-map="send"]')?.value),
      addV = N(tr.querySelector('[data-map="add"]')?.value),
      pullV = N(tr.querySelector('[data-map="pull"]')?.value),
      v =
        base -
        (sendTotal - oldSend + sendV) +
        (addTotal - oldAdd + addV) -
        (pullTotal - oldPull + pullV),
      cell = tr.querySelector(".remainCell");
    if (cell) {
      cell.textContent = F(v);
      cell.classList.toggle("bad", v < 0);
      cell.classList.toggle("blue", v >= 0);
    }
  }
  function removeInsert(id) {
    if (!id) return;
    commitPendingQuantityEdit({
      render: false,
      reason: "remove-insert",
    });
    push();
    state.ins = state.ins.filter((x) => T(x.id) !== T(id));
    [state.send, state.add, state.pull].forEach((o) =>
      Object.keys(o).forEach((k) => {
        if (pkKey(k) === id) delete o[k];
      }),
    );
    save();
    render();
    msg("ลบสินค้าแทรกแล้ว");
  }
  function pickTable(pool) {
    const r = rec(),
      shown = pool.slice(
        (state.page - 1) * state.pageSize,
        state.page * state.pageSize,
      );
    let h =
      "<thead><tr><th>#</th><th>สินค้า</th><th>คงเหลือ</th><th>ส่งร้านนี้</th><th>ใส่เพิ่ม</th><th>ดึงออก</th><th>ยอดดิบ</th><th>ยอดสุทธิ</th><th>รวม VAT</th></tr></thead><tbody>";
    if (!r)
      h +=
        '<tr><td colspan="9" class="empty">เลือก “ส่งให้ร้าน” 1 ร้านเท่านั้นก่อนใส่จำนวนส่ง</td></tr>';
    shown.forEach((g, i) => {
      const k = rkey(g.poolKey),
        dis = !r ? "disabled" : "",
        meta = [g.code || "", g.type || ""].filter(Boolean).join(" · "),
        rv = remain(g),
        del = g.inserted
          ? '<button type="button" class="insertDelBtn" data-insert-del="' +
            E(g.poolKey) +
            '">ลบ</button>'
          : "";
      h +=
        '<tr data-pool-key="' +
        E(g.poolKey) +
        '" data-base-qty="' +
        N(g.qty) +
        '"><td>' +
        ((state.page - 1) * state.pageSize + i + 1) +
        '</td><td class="p"><b>' +
        E(g.sku) +
        "</b>" +
        del +
        "<small>" +
        E(meta) +
        " · " +
        F(g.qty) +
        " ชิ้น · " +
        F(g.stores.size) +
        " ร้าน · " +
        F(g.bills.size) +
        " บิล</small>" +
        sourceDetail(g) +
        '</td><td class="remainCell ' +
        (rv < 0 ? "bad" : "blue") +
        '">' +
        F(rv) +
        "</td><td><input " +
        dis +
        ' class="pick jdata" data-map="send" data-k="' +
        E(k) +
        '" value="' +
        (mapVal(state.send, g.poolKey) || "") +
        '" type="number"></td><td><input ' +
        dis +
        ' class="pick jdata" data-map="add" data-k="' +
        E(k) +
        '" value="' +
        (mapVal(state.add, g.poolKey) || "") +
        '" type="number"></td><td><input ' +
        dis +
        ' class="pick jdata" data-map="pull" data-k="' +
        E(k) +
        '" value="' +
        (mapVal(state.pull, g.poolKey) || "") +
        '" type="number"></td><td>' +
        B(g.rawAmt) +
        "</td><td>" +
        B(g.netAmt) +
        "</td><td>" +
        B((N(g.netAmt) || N(g.rawAmt)) * 1.07) +
        "</td></tr>";
    });
    if (!shown.length)
      h += '<tr><td colspan="9" class="empty">ไม่พบข้อมูล</td></tr>';
    return h + "</tbody>";
  }
  function simpleTable(title, heads, body) {
    showRealBillSurface(false);
    $("#tableCount").textContent = title;
    $("#table").innerHTML =
      "<thead><tr>" +
      heads.map((h) => "<th>" + E(h) + "</th>").join("") +
      "</tr></thead><tbody>" +
      (body ||
        '<tr><td colspan="' +
          heads.length +
          '" class="empty">ไม่มีข้อมูล</td></tr>') +
      "</tbody>";
    $("#pager").innerHTML = "";
  }
  function showRealBillSurface(active) {
    const table = $("#table");
    const tableWrap = table?.closest(".tableWrap");
    const realBills = $("#realBills");
    const pageControls = $("#pager");
    if (table) table.hidden = active;
    if (tableWrap) tableWrap.hidden = active;
    if (realBills) realBills.hidden = !active;
    if (pageControls) pageControls.hidden = active;
  }
  function currentRealBillResult() {
    return realBillSelector.select(
      state.rows,
      state.sel,
      state.q,
      rowsVersion,
    );
  }
  function markFullRenderReady(renderId) {
    if (!renderId || activeFullRender?.id !== renderId) return;
    corePerformance.lastFullRenderMs =
      performance.now() - activeFullRender.startedAt;
    activeFullRender = null;
  }
  function renderRealBillResult(result, renderId = 0) {
    if (result.resultKey !== realBillResultKey) {
      realBillResultKey = result.resultKey;
      realBillPage = 1;
    }
    $("#tableCount").textContent = result.requiresSelection
      ? "บิลจริง · เลือกร้านหรือค้นหาเพื่อแสดงข้อมูล"
      : "บิลจริง " + F(result.bills.length) + " บิล";
    const pageResult = realBillSelector.pageResult(
      result,
      realBillPage,
      REAL_BILL_PAGE_SIZE,
    );
    const model = renderRealBills($("#realBills"), pageResult, {
      page: realBillPage,
      pageSize: REAL_BILL_PAGE_SIZE,
      onPage: (nextPage) => {
        realBillPage = nextPage;
        corePerformance.realBillPageRenders += 1;
        renderRealBillResult(result);
      },
    });
    realBillPage = model?.currentPage || 1;
    realBillRenderStats = {
      totalBills: model?.totalBills || 0,
      renderedBills: model?.visibleBills.length || 0,
      renderedRows: model?.visibleRows || 0,
    };
    markFullRenderReady(renderId);
  }
  function renderRealBillMode(renderId) {
    showRealBillSurface(true);
    const requiresSelection =
      !state.sel.billStores.length && !T(state.q);
    if (requiresSelection) {
      realBillRenderToken += 1;
      renderRealBillResult(currentRealBillResult());
      return false;
    }
    if (
      realBillSelector.hasCandidate(
        state.rows,
        state.sel,
        rowsVersion,
      )
    ) {
      realBillRenderToken += 1;
      renderRealBillResult(currentRealBillResult());
      return false;
    }
    const token = ++realBillRenderToken;
    $("#tableCount").textContent = "บิลจริง · กำลังเตรียมข้อมูล";
    $("#realBills").innerHTML =
      '<div class="empty realBillsEmpty realBillsLoading">กำลังเตรียมบิลจริง…</div>';
    requestAnimationFrame(() => {
      if (token !== realBillRenderToken || state.mode !== "ship") return;
      renderRealBillResult(currentRealBillResult(), renderId);
    });
    return true;
  }
  function quantityEditCheckpoint(input) {
    const mapName = input.dataset.map;
    const key = input.dataset.k;
    const map = state[mapName] || {};
    return {
      ...push(),
      quantity: {
        mapName,
        key,
        hadValue: Object.prototype.hasOwnProperty.call(map, key),
        value: map[key],
      },
    };
  }
  function revertQuantityEdit(input, checkpoint) {
    restoreHistoryCheckpoint(checkpoint);
    const original = checkpoint?.quantity;
    const map = state[original?.mapName || input.dataset.map];
    const key = original?.key || input.dataset.k;
    if (map && key) {
      if (original?.hadValue) map[key] = original.value;
      else delete map[key];
    }
    recalcPickRow(input.closest("tr"));
  }
  function renderMode(pool, renderId) {
    if (state.mode !== "ship") {
      realBillRenderToken += 1;
      showRealBillSurface(false);
    }
    if (state.mode === "pick") {
      $("#tableCount").textContent = state.rows.length
        ? "ถอดของ Pro " + F(pool.length) + " รายการ"
        : "โหลดไฟล์เพื่อแสดงข้อมูล";
      $("#table").innerHTML = pickTable(pool);
      bindQuantityInputs({
        inputs: $$(".jdata"),
        onEditStart: quantityEditCheckpoint,
        onRevert: revertQuantityEdit,
        onInput: (input) => {
          state[input.dataset.map][input.dataset.k] = N(input.value);
          recalcPickRow(input.closest("tr"));
        },
        onCommit: (input, { render: shouldRender = true } = {}) => {
          state[input.dataset.map][input.dataset.k] = N(input.value);
          save();
          if (!shouldRender) return;
          render();
        },
      });
      $$("[data-insert-del]").forEach(
        (b) =>
          (b.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeInsert(b.dataset.insertDel);
          }),
      );
      pager(pool.length);
      return;
    }
    if (state.mode === "ship") {
      return renderRealBillMode(renderId);
    }
    if (state.mode === "order") {
      corePerformance.groupCalls += 1;
      const grouped = group(
        state.rows.filter(
          (row) =>
            okDate(row) &&
            okPs(row) &&
            okCut(row) &&
            okBrand(row) &&
            okType(row) &&
            okQ(row),
        ),
      );
      renderOrderMode(grouped, simpleTable);
      return;
    }
    if (state.mode === "dist") {
      corePerformance.groupCalls += 1;
      const p = distPool();
      simpleTable(
        "กระจายสินค้า จากไฟล์ DOIT รวมทุกวัน · " + F(p.length) + " รายการ",
        ["รายการ", "จำนวนชิ้น", "จำนวนร้านที่คีย์"],
        p
          .map(
            (g) =>
              '<tr><td class="p"><b>' +
              E(g.sku) +
              "</b>" +
              sourceDetail(g) +
              "</td><td>" +
              F(g.qty) +
              "</td><td>" +
              F(g.stores.size) +
              "</td></tr>",
          )
          .join(""),
      );
      return;
    }
    if (state.mode === "remain") {
      const p = pool.filter((g) =>
          state.remainView === "positive"
            ? remain(g) > 0
            : state.remainView === "negative"
              ? remain(g) < 0
              : true,
        ),
        label =
          state.remainView === "positive"
            ? "เฉพาะของเหลือ"
            : state.remainView === "negative"
              ? "เฉพาะของขาด"
              : "ทั้งหมด";
      simpleTable(
        "สรุปของเหลือ " +
          label +
          " " +
          F(p.length) +
          "/" +
          F(pool.length) +
          " รายการ",
        ["#", "สินค้า", "คงเหลือ"],
        p
          .map(
            (g, i) =>
              "<tr><td>" +
              (i + 1) +
              "</td><td>" +
              E(g.sku) +
              '</td><td class="' +
              (remain(g) < 0 ? "bad" : "blue") +
              '">' +
              F(remain(g)) +
              "</td></tr>",
          )
          .join(""),
      );
      $("#tableCount").innerHTML =
        "สรุปของเหลือ " +
        E(label) +
        " " +
        F(p.length) +
        "/" +
        F(pool.length) +
        ' รายการ <span style="display:inline-flex;gap:4px;flex-wrap:wrap;margin-left:6px;vertical-align:middle"><button class="page ' +
        (state.remainView === "all" ? "on" : "") +
        '" style="height:28px;padding:0 8px;font-size:11px" data-remain-view="all">ทั้งหมด</button><button class="page ' +
        (state.remainView === "positive" ? "on" : "") +
        '" style="height:28px;padding:0 8px;font-size:11px" data-remain-view="positive">เหลือ</button><button class="page ' +
        (state.remainView === "negative" ? "on" : "") +
        '" style="height:28px;padding:0 8px;font-size:11px" data-remain-view="negative">ขาด</button></span>';
      $$("[data-remain-view]").forEach(
        (b) =>
          (b.onclick = () => {
            push();
            state.remainView = b.dataset.remainView || "all";
            render();
          }),
      );
      return;
    }
    if (state.mode === "done") {
      renderDoneMode();
      return;
    }
    const r = sourceRows().slice(0, 500);
    simpleTable(
      "รายการดิบ " + F(sourceRows().length) + " แถว",
      ["#", "วันที่", "PS", "ร้าน", "สินค้า", "จำนวน"],
      r
        .map(
          (x, i) =>
            "<tr><td>" +
            (i + 1) +
            "</td><td>" +
            E(dlabel(x.date)) +
            "</td><td>" +
            E(x.ps) +
            "</td><td>" +
            E(x.store) +
            "</td><td>" +
            E(x.sku) +
            "</td><td>" +
            F(x.qty) +
            "</td></tr>",
        )
        .join(""),
    );
  }
  function pager(n) {
    const p = Math.max(1, Math.ceil(n / state.pageSize));
    if (state.page > p) state.page = p;
    $("#pager").innerHTML =
      '<button class="page" data-p="' +
      Math.max(1, state.page - 1) +
      '">‹</button><button class="page on">' +
      state.page +
      "/" +
      p +
      '</button><button class="page" data-p="' +
      Math.min(p, state.page + 1) +
      '">›</button>';
    $$("[data-p]").forEach(
      (b) =>
        (b.onclick = () => {
          commitPendingQuantityEdit({
            render: false,
            reason: "pagination",
          });
          state.page = N(b.dataset.p) || 1;
          render();
        }),
    );
  }
  function telesaleSignature() {
    return JSON.stringify([
      rowsVersion,
      state.sel.dates,
      state.sel.ps,
    ]);
  }
  function invalidateTelesale() {
    telesaleCache.signature = "";
    telesaleCache.bills = [];
    telesaleCache.countSignature = "";
    telesaleCache.count = 0;
  }
  function teleBillCount() {
    const signature = telesaleSignature();
    if (telesaleCache.countSignature !== signature) {
      const keys = new Set();
      state.rows.forEach((row) => {
        if (!row.isTele || !okDate(row) || !okPs(row)) return;
        keys.add([row.inv, row.store, row.tele, row.date].join("|"));
      });
      telesaleCache.count = keys.size;
      telesaleCache.countSignature = signature;
      corePerformance.telesaleCountBuilds += 1;
    }
    return telesaleCache.count;
  }
  function teleBills() {
    const signature = telesaleSignature();
    if (telesaleCache.signature !== signature) {
      telesaleCache.bills = buildTelesaleBills(teleRows());
      telesaleCache.signature = signature;
      corePerformance.telesaleModelBuilds += 1;
    }
    return telesaleCache.bills;
  }
  function updateTelesaleButton() {
    const button = $("#teleBtn");
    if (button) {
      button.textContent =
        "บิล Telesale (" + F(teleBillCount()) + ")";
    }
    corePerformance.telesaleButtonUpdates += 1;
  }
  function renderTele() {
    corePerformance.telesaleDrawerRenders += 1;
    state.telePage = renderTelesaleDrawer({
      bills: teleBills(),
      page: state.telePage,
      onPage: (nextPage) => {
        state.telePage = nextPage;
        renderTele();
      },
    });
  }
  function render(startedAt = performance.now()) {
    const renderId = ++fullRenderSequence;
    corePerformance.fullRenderCalls += 1;
    activeFullRender = { id: renderId, startedAt };
    fixUi();
    updText();
    const shipMode = state.mode === "ship";
    const summaryHead = document.querySelector(".summaryHead");
    const summaryCards = document.querySelector(".summary");
    if (summaryHead) summaryHead.hidden = shipMode;
    if (summaryCards) summaryCards.hidden = shipMode;
    let pool = [];
    if (!shipMode) {
      const summary = currentSummary(),
        tot = summary.total,
        sent = summary.sent,
        rem = summary.remain,
        raw = summary.raw,
        net = summary.net;
      pool = summary.pool;
      $("#amount").textContent =
        "฿ " +
        (raw ? B(raw) : "—") +
        (net
          ? " / สุทธิ ฿ " + B(net) + " / รวม VAT ฿ " + B(net * 1.07)
          : "—");
      $("#doneAmount").textContent = F(sent);
      $("#remainAmount").textContent = F(rem);
      $("#remainAmount").className = rem < 0 ? "bad" : "blue";
      $("#donePct").textContent =
        (tot ? Math.round((sent * 1000) / tot) / 10 : 0) + "%";
      $("#doneBar").style.width =
        Math.min(100, tot ? (sent * 100) / tot : 0) + "%";
    }
    $$(".tab").forEach((t, i) =>
      t.classList.toggle(
        "on",
        ["pick", "dist", "ship", "done", "raw", "order"][i] === state.mode,
      ),
    );
    const renderPending = Boolean(renderMode(pool, renderId));
    updateTelesaleButton();
    if ($("#teleDrawer")?.classList.contains("on")) renderTele();
    save();
    if (!renderPending) markFullRenderReady(renderId);
  }
  function loadData(p, m = {}) {
    const normalizedRows = arr(p).map(norm);
    const expectedRows = Number(m.row_count);
    if (
      Number.isInteger(expectedRows) &&
      expectedRows >= 0 &&
      normalizedRows.length !== expectedRows
    ) {
      throw new Error(
        "จำนวนแถวไม่ครบ: ได้ " +
          normalizedRows.length +
          " จาก " +
          expectedRows,
      );
    }
    closePick();
    state.rows = normalizedRows;
    rowsVersion += 1;
    realBillSelector.invalidate();
    invalidateSummary();
    invalidateTelesale();
    realBillPage = 1;
    realBillResultKey = "";
    state.key = m.id || p?.version_id || m.file_name || "active";
    state.send = {};
    state.add = {};
    state.pull = {};
    state.ins = [];
    state.sel = createSelection();
    state.q = "";
    state.page = 1;
    state.mode = "pick";
    state.hist = [];
    state.redoStack = [];
    loadState();
    $("#fileLabel").textContent = m.file_name || "JSON Cloud";
    msg(
      "โหลดสำเร็จ " +
        F(state.rows.length) +
        " แถว · Tele " +
        F(state.rows.filter((r) => r.isTele).length) +
        " แถว",
    );
    render();
  }
  async function check() {
    try {
      $("#cloudState").textContent = "กำลังตรวจ";
      const p = await publicFetch("meta");
      state.active = p.active;
      cloud(
        "ไฟล์: <b>" +
          E(state.active.file_name) +
          "</b><br>แถว: " +
          F(state.active.row_count) +
          " · ร้าน: " +
          F(state.active.store_count) +
          " · PS: " +
          F(state.active.ps_count) +
          " · Telesale bills: " +
          F(state.active.telesale_bill_count),
      );
      $("#cloudState").textContent = "พร้อม";
    } catch (e) {
      cloud("ตรวจ Cloud ไม่สำเร็จ: " + E(e.message));
      $("#cloudState").textContent = "ผิดพลาด";
    }
  }
  async function loadCloud() {
    const button = $("#cloudLoadBtn");
    try {
      button.disabled = true;
      button.textContent = "กำลังโหลด...";
      if (!state.active) await check();
      const p = await publicFetch("data");
      const data = await resolveCloudPayload(p, {
        onProgress(progress) {
          button.textContent =
            "กำลังโหลด " + progress.partIndex + "/" + progress.partCount;
          cloud(
            "กำลังโหลดส่วน " +
              progress.partIndex +
              "/" +
              progress.partCount +
              " · " +
              F(progress.rowsLoaded) +
              "/" +
              F(progress.rowCount) +
              " แถว",
          );
        },
      });
      loadData(data, p.active || state.active);
      cloud("โหลด Cloud สำเร็จ " + F(state.rows.length) + " แถว");
    } catch (e) {
      cloud("โหลด Cloud ไม่สำเร็จ: " + E(e.message));
    } finally {
      button.disabled = false;
      button.textContent = "โหลดไฟล์ล่าสุดจาก Cloud";
    }
  }
  async function loadFile(file) {
    const json = await parseDoitFile(file);
    loadData(json, {
      file_name: file.name,
      id: file.name,
    });
  }
  function addInsert() {
    commitPendingQuantityEdit({ render: false, reason: "add-insert" });
    push();
    const name = T(prompt("ชื่อสินค้าที่ต้องการแทรก"));
    if (!name) return;
    const qty = N(prompt("จำนวนออเดอร์รวม", "0")),
      unit = N(prompt("ราคา/หน่วย ถ้าไม่รู้ใส่ 0", "0")),
      code = T(prompt("รหัสสินค้า ถ้ามี ไม่บังคับ", "")),
      id = "INSERT:" + Date.now();
    state.ins.push({
      id,
      name,
      qty,
      unit,
      code,
    });
    save();
    msg("แทรกสินค้าแล้ว: " + name);
    render();
  }
  function exportCsv() {
    const csv =
      "\ufeff" +
      [
        [
          "date",
          "ps",
          "excludedBillStores",
          "receiver",
          "sku",
          "qty",
          "rawAmount",
          "netAmount",
        ],
        ...sourceRows().map((r) => [
          r.date,
          r.ps,
          state.sel.orderStores.join("|"),
          rec(),
          r.sku,
          r.qty,
          r.rawAmt,
          r.netAmt,
        ]),
      ]
        .map((a) =>
          a
            .map((x) => '"' + String(x ?? "").replace(/"/g, '""') + '"')
            .join(","),
        )
        .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      }),
    );
    a.download = "doit-pro-export.csv";
    a.click();
  }
  function copySummary() {
    navigator.clipboard?.writeText(
      "DOIT Pro\n" +
        txt("dates") +
        "\n" +
        txt("ps") +
        "\n" +
        txt("orderStores") +
        "\n" +
        txt("receivers") +
        "\nTele bills " +
        teleBillCount(),
    );
    msg("Copy สรุปแล้ว");
  }
  function resetDone() {
    if (!confirm("รีเซ็ตจำนวนที่คีย์เองทั้งหมด?")) return;
    commitPendingQuantityEdit({ render: false, reason: "reset" });
    push();
    state.send = {};
    state.add = {};
    state.pull = {};
    save();
    render();
    msg("รีเซ็ตแล้ว");
  }
  function autosave() {
    commitPendingQuantityEdit({ render: false, reason: "autosave" });
    save();
    msg("บันทึกแล้ว " + new Date().toLocaleTimeString("th-TH"));
  }
  function patchBrandTitle() {
    document.title = TITLE;
    const t = document.querySelector(".topbar .title");
    if (!t) return;
    t.classList.add("ayaBrandTitle");
    t.setAttribute("aria-label", TITLE);
    t.innerHTML = [...TITLE]
      .map(
        (ch, i) =>
          `<span class="ayaChar" style="--i:${i}">${ch === " " ? "&nbsp;" : E(ch)}</span>`,
      )
      .join("");
  }
  function fixUi() {
    const os = document.querySelector('[data-pick="orderStores"]'),
      labEl = os?.closest(".field")?.querySelector("label");
    if (labEl) labEl.textContent = "ตัดร้านบิลจริง";
    {
      const b = $("#remainBtn");
      if (b && !b.dataset.bound) {
        b.dataset.bound = "1";
        b.onclick = () => {
          commitPendingQuantityEdit({
            render: false,
            reason: "remain-mode",
          });
          push();
          state.mode = "remain";
          state.page = 1;
          render();
          msg("สรุปของเหลือ");
        };
      }
    }
    function moveProActions() {
      const bar = document.querySelector(".sendBar");
      const detail = $("#showDetailBtn");
      if (!bar || !detail) return;
      let box = $("#sendActionButtons");
      if (!box) {
        box = document.createElement("div");
        box.id = "sendActionButtons";
        box.className = "sendActionButtons";
        detail.insertAdjacentElement("afterend", box);
      }
      ["teleBtn", "insertBtn", "prepPrint", "remainBtn"].forEach((id) => {
        const el = $("#" + id);
        if (el && el.parentElement !== box) box.appendChild(el);
      });
    }
    moveProActions();
    const gear = $("#diagBtn");
    if (gear) {
      gear.textContent = "⚙";
      gear.title = "ตั้งค่า / ตรวจระบบ";
      gear.setAttribute("aria-label", "ตั้งค่า / ตรวจระบบ");
      gear.classList.add("settingsGear");
    }
    patchBrandTitle();
  }
  function bind() {
    if (state.bound) return;
    state.bound = true;
    fixUi();
    $("#choose").onclick = () => $("#file").click();
    $("#file").onchange = (e) =>
      e.target.files[0] && loadFile(e.target.files[0]);
    $("#cloudCheckBtn").onclick = check;
    $("#cloudLoadBtn").onclick = loadCloud;
    $("#searchBtn").onclick = () => {
      commitPendingQuantityEdit({ render: false, reason: "search" });
      closePick();
      push();
      state.q = $("#q").value;
      state.page = 1;
      realBillPage = 1;
      realBillSelector.refreshFilters();
      render();
    };
    $("#clearFilter").onclick = () => {
      commitPendingQuantityEdit({
        render: false,
        reason: "clear-filter",
      });
      closePick();
      push();
      state.sel = createSelection();
      state.q = "";
      state.page = 1;
      realBillPage = 1;
      realBillSelector.refreshFilters();
      render();
      msg("ล้างตัวกรองแล้ว");
    };
    $$("[data-pick]").forEach(
      (b) => (b.onclick = () => openPick(b.dataset.pick)),
    );
    $("#pickClose").onclick = closePick;
    $("#pickOk").onclick = applyPick;
    $("#pickClear").onclick = clearPick;
    $("#pickAll").onclick = allPick;
    $("#teleBtn").onclick = () => {
      commitPendingQuantityEdit({
        render: false,
        reason: "telesale-drawer",
      });
      $("#drawerShade").classList.add("on");
      $("#teleDrawer").classList.add("on");
      renderTele();
    };
    $("#closeDrawer").onclick = $("#drawerShade").onclick = () => {
      $("#drawerShade").classList.remove("on");
      $("#teleDrawer").classList.remove("on");
    };
    $("#insertBtn").onclick = addInsert;
    $("#prepPrint").onclick = () => {
      commitPendingQuantityEdit({ render: false, reason: "print" });
      const realBillResult =
        state.mode === "ship" ? currentRealBillResult() : null;
      preparePrint({
        mode: state.mode,
        title: modeName(),
        realBillPrint:
          state.mode === "ship"
            ? realBillSelector.printPayload(realBillResult)
            : undefined,
      });
    };
    $("#exportCsv").onclick = exportCsv;
    const cs = $("#copySummary");
    if (cs) cs.onclick = copySummary;
    const sd = $("#showDetailBtn");
    if (sd)
      sd.onclick = () => {
        commitPendingQuantityEdit({
          render: false,
          reason: "show-details",
        });
        push();
        state.showDetails = !state.showDetails;
        render();
        msg(state.showDetails ? "แสดงรายละเอียดแล้ว" : "ซ่อนรายละเอียดแล้ว");
      };
    $("#displayBtn").onclick = () => {
      commitPendingQuantityEdit({
        render: false,
        reason: "page-size",
      });
      push();
      state.pageSize =
        Number(prompt("จำนวนแถวต่อหน้า", state.pageSize)) || state.pageSize;
      render();
    };
    $("#undo").onclick = undo;
    $("#redo").onclick = redo;
    $("#resetDone").onclick = resetDone;
    $("#autosaveBtn").onclick = autosave;
    $$(".tab").forEach(
      (t, i) =>
        (t.onclick = () => {
          const startedAt = performance.now();
          commitPendingQuantityEdit({
            render: false,
            reason: "mode",
          });
          closePick();
          push();
          state.mode =
            ["pick", "dist", "ship", "done", "raw", "order"][i] || "pick";
          state.page = 1;
          if (state.mode === "ship") realBillPage = 1;
          render(startedAt);
          msg("เปลี่ยนโหมด: " + T(t.textContent));
        }),
    );
    $("#diagBtn").onclick = () => alert(JSON.stringify(health(), null, 2));
  }
  function health() {
    const telesale = teleRows();
    return {
      rows: state.rows.length,
      pickRows: summaryCache.pool.reduce(
        (sum, item) => sum + (item.rows?.length || 0),
        0,
      ),
      realBills: realBillRenderStats.totalBills,
      distRows: sourceRows({ ignoreDate: true }).length,
      teleRows: telesale.length,
      teleBills: teleBillCount(),
      teleQty: telesale.reduce((sum, row) => sum + N(row.qty), 0),
      teleRaw: telesale.reduce((sum, row) => sum + N(row.rawAmt), 0),
      teleVat: telesale.reduce(
        (sum, row) => sum + (N(row.netAmt) || N(row.rawAmt)) * 1.07,
        0,
      ),
      renderedTeleBills: $$(".teleBill").length,
      telePage: state.telePage,
      telePageSize: TELE_PAGE_SIZE,
      receivers: state.sel.receivers,
      billStores: state.sel.billStores,
      realBillPerformance: {
        ...realBillSelector.stats(),
        ...realBillUiMetrics,
        ...realBillRenderStats,
        ...corePerformance,
        rowsVersion,
        page: realBillPage,
        pageSize: REAL_BILL_PAGE_SIZE,
      },
      history: historyStats(),
      pendingQuantityEdit: pendingQuantityEdit(),
      manualKeys: Object.keys(state.send).length,
      inserted: state.ins.length,
      mode: state.mode,
      bound: state.bound,
      flow: "single-entry-single-state-single-render",
      currentStateSource: "state-module",
    };
  }
  window.DOIT_CORE_APP = {
    load: loadData,
    currentState,
    health,
  };
  bind();
  check();
})();
