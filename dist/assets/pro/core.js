import { bindQuantityInputs } from "./send-store.js";
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
  insertedGroups,
  pickPool,
  distPool,
} from "./filters.js";
import {
  realBillPickerOptions,
  renderRealBills,
  selectRealBills,
} from "./real-bills.js";
import { publicFetch, resolveCloudPayload } from "./data-source.js";
import { preparePrint } from "./print.js";
(() => {
  "use strict";

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
  function pickerOptions(kind) {
    if (
      state.mode === "ship" &&
      ["dates", "ps", "orderStores", "billStores", "brands", "types"].includes(
        kind,
      )
    ) {
      return realBillPickerOptions(kind, state.rows, state.sel);
    }
    return options(kind).map((value) => ({
      value,
      label: kind === "dates" ? dlabel(value) : value,
    }));
  }
  function undo() {
    if (!state.hist.length) return msg("ไม่มีรายการ Undo");
    state.redoStack.push(snap());
    restore(state.hist.pop());
    render();
    msg("Undo แล้ว");
  }
  function redo() {
    if (!state.redoStack.length) return msg("ไม่มีรายการ Redo");
    state.hist.push(snap());
    restore(state.redoStack.pop());
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
    const k = activePickerKind(requestedKind);
    state.pickKind = k;
    state.tmp = [...(state.sel[k] || [])];
    $("#pickTitle").textContent =
      k === "orderStores" ? "ติ๊กเพื่อเอาร้านบิลจริงออก" : lab(k);
    drawPick();
    $("#pickShade").classList.add("on");
  }
  function closePick() {
    $("#pickShade").classList.remove("on");
  }
  function drawPick() {
    const o = pickerOptions(state.pickKind);
    $("#pickList").innerHTML = o.length
      ? o
          .map(
            ({ value, label }) =>
              '<div class="pickItem ' +
              (state.tmp.includes(value) ? "on" : "") +
              '" data-v="' +
              E(value) +
              '"><span class="box">' +
              (state.tmp.includes(value) ? "✓" : "") +
              "</span><span>" +
              E(label) +
              "</span></div>",
          )
          .join("")
      : '<div class="empty">ไม่มีรายการให้เลือก</div>';
    $$(".pickItem").forEach(
      (i) =>
        (i.onclick = () => {
          const v = i.dataset.v;
          state.tmp = state.tmp.includes(v)
            ? state.tmp.filter((x) => x !== v)
            : state.tmp.concat(v);
          drawPick();
        }),
    );
  }
  function applyPick() {
    push();
    state.sel[state.pickKind] = [...state.tmp];
    state.page = 1;
    closePick();
    render();
    msg("ใช้ตัวเลือกแล้ว");
  }
  function clearPick() {
    state.tmp = [];
    drawPick();
  }
  function allPick() {
    state.tmp = pickerOptions(state.pickKind).map(({ value }) => value);
    drawPick();
  }
  function manualSent(g) {
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
    return selectRealBills(state.rows, state.sel, state.q);
  }
  function renderMode(pool) {
    if (state.mode !== "ship") showRealBillSurface(false);
    if (state.mode === "pick") {
      $("#table").innerHTML = pickTable(pool);
      bindQuantityInputs({
        inputs: $$(".jdata"),
        onInput: (input) => recalcPickRow(input.closest("tr")),
        onCommit: (input) => {
          push();
          state[input.dataset.map][input.dataset.k] = N(input.value);
          save();
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
      const result = currentRealBillResult();
      showRealBillSurface(true);
      $("#tableCount").textContent = result.requiresSelection
        ? "บิลจริง · เลือกร้านหรือค้นหาเพื่อแสดงข้อมูล"
        : "บิลจริง " + F(result.bills.length) + " บิล";
      renderRealBills($("#realBills"), result);
      return;
    }
    if (state.mode === "order") {
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
          state.page = N(b.dataset.p) || 1;
          render();
        }),
    );
  }
  function teleBills() {
    return buildTelesaleBills(teleRows());
  }
  function renderTele() {
    state.telePage = renderTelesaleDrawer({
      bills: teleBills(),
      page: state.telePage,
      onPage: (nextPage) => {
        state.telePage = nextPage;
        renderTele();
      },
    });
  }
  function render() {
    fixUi();
    updText();
    const pool = pickPool(),
      tot = pool.reduce((s, g) => s + g.qty, 0),
      sent = pool.reduce((s, g) => s + manualSent(g), 0),
      rem = pool.reduce((s, g) => s + remain(g), 0),
      raw = pool.reduce((s, g) => s + N(g.rawAmt), 0),
      net = pool.reduce((s, g) => s + N(g.netAmt), 0);
    $("#amount").textContent =
      "฿ " +
      (raw ? B(raw) : "—") +
      (net ? " / สุทธิ ฿ " + B(net) + " / รวม VAT ฿ " + B(net * 1.07) : "—");
    $("#doneAmount").textContent = F(sent);
    $("#remainAmount").textContent = F(rem);
    $("#remainAmount").className = rem < 0 ? "bad" : "blue";
    $("#donePct").textContent =
      (tot ? Math.round((sent * 1000) / tot) / 10 : 0) + "%";
    $("#doneBar").style.width =
      Math.min(100, tot ? (sent * 100) / tot : 0) + "%";
    $$(".tab").forEach((t, i) =>
      t.classList.toggle(
        "on",
        ["pick", "dist", "ship", "done", "raw", "order"][i] === state.mode,
      ),
    );
    renderMode(pool);
    renderTele();
    save();
  }
  function loadData(p, m = {}) {
    state.rows = arr(p).map(norm);
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
    try {
      $("#cloudLoadBtn").textContent = "กำลังโหลด...";
      if (!state.active) await check();
      const p = await publicFetch("data");
      const data = await resolveCloudPayload(p);
      loadData(data, p.active || state.active);
      cloud("โหลด JSON/index สำเร็จ");
    } catch (e) {
      cloud("โหลด Cloud ไม่สำเร็จ: " + E(e.message));
    } finally {
      $("#cloudLoadBtn").textContent = "โหลดไฟล์ล่าสุดจาก Cloud";
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
        teleBills().length,
    );
    msg("Copy สรุปแล้ว");
  }
  function resetDone() {
    if (!confirm("รีเซ็ตจำนวนที่คีย์เองทั้งหมด?")) return;
    push();
    state.send = {};
    state.add = {};
    state.pull = {};
    save();
    render();
    msg("รีเซ็ตแล้ว");
  }
  function autosave() {
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
      push();
      state.q = $("#q").value;
      state.page = 1;
      render();
    };
    $("#clearFilter").onclick = () => {
      push();
      state.sel = createSelection();
      state.q = "";
      state.page = 1;
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
      $("#drawerShade").classList.add("on");
      $("#teleDrawer").classList.add("on");
      renderTele();
    };
    $("#closeDrawer").onclick = $("#drawerShade").onclick = () => {
      $("#drawerShade").classList.remove("on");
      $("#teleDrawer").classList.remove("on");
    };
    $("#insertBtn").onclick = addInsert;
    $("#prepPrint").onclick = () =>
      preparePrint({
        mode: state.mode,
        title: modeName(),
        realBills:
          state.mode === "ship" ? currentRealBillResult().bills : undefined,
      });
    $("#exportCsv").onclick = exportCsv;
    const cs = $("#copySummary");
    if (cs) cs.onclick = copySummary;
    const sd = $("#showDetailBtn");
    if (sd)
      sd.onclick = () => {
        push();
        state.showDetails = !state.showDetails;
        render();
        msg(state.showDetails ? "แสดงรายละเอียดแล้ว" : "ซ่อนรายละเอียดแล้ว");
      };
    $("#displayBtn").onclick = () => {
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
          push();
          state.mode =
            ["pick", "dist", "ship", "done", "raw", "order"][i] || "pick";
          state.page = 1;
          render();
          msg("เปลี่ยนโหมด: " + T(t.textContent));
        }),
    );
    $("#diagBtn").onclick = () => alert(JSON.stringify(health(), null, 2));
  }
  function health() {
    const telesale = teleRows();
    return {
      rows: state.rows.length,
      pickRows: sourceRows().length,
      realBills: currentRealBillResult().bills.length,
      distRows: sourceRows({ ignoreDate: true }).length,
      teleRows: state.rows.filter((row) => row.isTele).length,
      teleBills: teleBills().length,
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
