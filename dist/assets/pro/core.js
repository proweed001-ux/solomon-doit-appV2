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
  parseIso,
  thaiDate,
  prevDay,
} from "./utils.js";
import {
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
  shipPool,
} from "./filters.js";
import { publicFetch, resolveCloudPayload } from "./data-source.js";
(() => {
  "use strict";

  const TELE_PAGE_SIZE = 20;
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
        ship: "ใบส่งร้านจริง",
        done: "จัดแล้ว",
        raw: "รายการดิบ",
        remain: "สรุปของเหลือ",
        order: "รวม order",
      }[state.mode] || "รายการ"
    );
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
      return lab(k) + ": " + (k === "receivers" ? "ยังไม่เลือก" : "ทั้งหมด");
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
    const s = $("#sendText");
    if (s) s.textContent = txt("receivers").replace("ส่งให้ร้าน: ", "");
  }
  function openPick(k) {
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
    const o = options(state.pickKind);
    $("#pickList").innerHTML = o.length
      ? o
          .map(
            (x) =>
              '<div class="pickItem ' +
              (state.tmp.includes(x) ? "on" : "") +
              '" data-v="' +
              E(x) +
              '"><span class="box">' +
              (state.tmp.includes(x) ? "✓" : "") +
              "</span><span>" +
              (state.pickKind === "dates" ? E(dlabel(x)) : E(x)) +
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
    state.tmp = options(state.pickKind);
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
  function renderMode(pool) {
    if (state.mode === "pick") {
      $("#table").innerHTML = pickTable(pool);
      $$(".jdata").forEach((i) => {
        i.oninput = (e) => recalcPickRow(e.target.closest("tr"));
        i.onchange = (e) => {
          push();
          ({
            send: state.send,
            add: state.add,
            pull: state.pull,
          })[e.target.dataset.map][e.target.dataset.k] = N(e.target.value);
          save();
          render();
        };
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
      const p = shipPool();
      simpleTable(
        "ใบส่งร้านจริง " +
          (rec() || "ยังไม่เลือก") +
          " · จากไฟล์ DOIT " +
          F(p.length) +
          " รายการ",
        ["#", "สินค้า", "จำนวน", "ยอดดิบ", "ยอดสุทธิ", "รวม VAT"],
        p
          .map(
            (g, i) =>
              "<tr><td>" +
              (i + 1) +
              "</td><td>" +
              E(g.sku) +
              "</td><td>" +
              F(g.qty) +
              "</td><td>" +
              B(g.rawAmt) +
              "</td><td>" +
              B(g.netAmt) +
              "</td><td>" +
              B((N(g.netAmt) || N(g.rawAmt)) * 1.07) +
              "</td></tr>",
          )
          .join(""),
      );
      return;
    }
    if (state.mode === "order") {
      const p = group(
        state.rows.filter(
          (r) =>
            okDate(r) &&
            okPs(r) &&
            okCut(r) &&
            okBrand(r) &&
            okType(r) &&
            okQ(r),
        ),
      );
      simpleTable(
        "รวม order PS + Telesale " + F(p.length) + " รายการ",
        ["#", "สินค้า", "จำนวนรวม", "ยอดดิบ", "ยอดสุทธิ", "รวม VAT"],
        p
          .map(
            (g, i) =>
              "<tr><td>" +
              (i + 1) +
              "</td><td>" +
              E(g.sku) +
              "</td><td>" +
              F(g.qty) +
              "</td><td>" +
              B(g.rawAmt) +
              "</td><td>" +
              B(g.netAmt) +
              "</td><td>" +
              B((N(g.netAmt) || N(g.rawAmt)) * 1.07) +
              "</td></tr>",
          )
          .join(""),
      );
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
      const out = [];
      pool.forEach((g) => {
        const qty = manualSent(g);
        if (qty > 0)
          out.push({
            name: g.sku,
            qty,
            rawAmt: qty * N(g.unit),
            netAmt: qty * N(g.netUnit),
          });
      });
      simpleTable(
        "จัดแล้ว " + F(out.length) + " รายการ",
        ["#", "สินค้า", "จำนวนที่คีย์", "ยอดดิบ", "ยอดสุทธิ", "รวม VAT"],
        out
          .map(
            (l, i) =>
              "<tr><td>" +
              (i + 1) +
              "</td><td>" +
              E(l.name) +
              "</td><td>" +
              F(l.qty) +
              "</td><td>" +
              B(l.rawAmt) +
              "</td><td>" +
              B(l.netAmt) +
              "</td><td>" +
              B((N(l.netAmt) || N(l.rawAmt)) * 1.07) +
              "</td></tr>",
          )
          .join(""),
      );
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
    const m = new Map();
    teleRows().forEach((r) => {
      const k = [r.inv, r.store, r.tele, r.date].join("|");
      let b = m.get(k);
      if (!b) {
        b = {
          inv: r.inv || "-",
          store: r.store,
          tele: r.tele,
          date: r.date,
          lines: [],
          qty: 0,
          amt: 0,
        };
        m.set(k, b);
      }
      b.lines.push(r);
      b.qty += r.qty;
      b.amt += r.amt;
    });
    return [...m.values()].sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.store.localeCompare(b.store, "th"),
    );
  }
  function renderTele() {
    const bs = teleBills(),
      btn = $("#teleBtn"),
      body = $("#drawerBody"),
      drawer = $("#teleDrawer");
    if (btn) btn.textContent = "บิล Telesale (" + F(bs.length) + ")";
    if (!body) return;
    if (!drawer?.classList.contains("on")) {
      body.innerHTML =
        '<div class="empty">เปิดบิล Telesale เพื่อแสดงรายการแบบแบ่งหน้า</div>';
      return;
    }
    if (!bs.length) {
      body.innerHTML =
        '<div class="empty">ไม่พบ Telesale ตามตัวเลือกที่ติ๊ก</div>';
      return;
    }
    const pages = Math.max(1, Math.ceil(bs.length / TELE_PAGE_SIZE));
    state.telePage = Math.min(Math.max(1, state.telePage), pages);
    const start = (state.telePage - 1) * TELE_PAGE_SIZE,
      shown = bs.slice(start, start + TELE_PAGE_SIZE),
      cards = shown
        .map(
          (b) =>
            '<div class="teleBill"><div class="teleBillHead"><b>ร้าน: ' +
            E(b.store) +
            "</b><br><small>บิล: " +
            E(b.inv) +
            " · วันที่ " +
            E(dlabel(b.date)) +
            " · Tele: " +
            E(b.tele) +
            '</small></div><table class="teleTbl"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>' +
            b.lines
              .map(
                (r) =>
                  "<tr><td>" +
                  E(r.sku) +
                  "</td><td>" +
                  F(r.qty) +
                  "</td><td>" +
                  B(r.rawAmt) +
                  "</td><td>" +
                  B((N(r.netAmt) || N(r.rawAmt)) * 1.07) +
                  "</td></tr>",
              )
              .join("") +
            "</tbody></table></div>",
        )
        .join(""),
      pager =
        '<div class="pagination telePager"><button class="page" data-tele-page="' +
        Math.max(1, state.telePage - 1) +
        '" ' +
        (state.telePage === 1 ? "disabled" : "") +
        '>‹</button><button class="page on">' +
        state.telePage +
        "/" +
        pages +
        '</button><button class="page" data-tele-page="' +
        Math.min(pages, state.telePage + 1) +
        '" ' +
        (state.telePage === pages ? "disabled" : "") +
        ">›</button></div>";
    body.innerHTML =
      '<div class="hint" style="padding:0 0 8px">แสดงบิล ' +
      F(start + 1) +
      "–" +
      F(start + shown.length) +
      " จาก " +
      F(bs.length) +
      " บิล</div>" +
      cards +
      pager;
    $$("[data-tele-page]").forEach(
      (b) =>
        (b.onclick = () => {
          state.telePage = N(b.dataset.telePage) || 1;
          renderTele();
        }),
    );
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
    window.__doitCoreRows = state.rows;
    state.key = m.id || p?.version_id || m.file_name || "active";
    state.send = {};
    state.add = {};
    state.pull = {};
    state.ins = [];
    state.sel = {
      dates: [],
      ps: [],
      orderStores: [],
      receivers: [],
      brands: [],
      types: [],
    };
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
  function printRowsForPick() {
    const poolMap = new Map(pickPool().map((g) => [g.poolKey, g])),
      currentStore = rec(),
      keys = [
        ...new Set([
          ...Object.keys(state.send),
          ...Object.keys(state.add),
          ...Object.keys(state.pull),
        ]),
      ],
      out = [];
    keys.forEach((k) => {
      const parsed = parseKey(k);
      if (!scopeOk(parsed) || parsed.store !== currentStore) return;
      const g = poolMap.get(parsed.pk);
      if (!g) return;
      const s = mapVal(state.send, parsed.pk, currentStore),
        a = mapVal(state.add, parsed.pk, currentStore),
        p = mapVal(state.pull, parsed.pk, currentStore),
        qty = s + a - p;
      if (!qty) return;
      out.push({
        code: g.code || "",
        name: g.sku,
        qty,
        unit: N(g.netUnit) * 1.07,
        inserted: g.inserted,
      });
    });
    return out.filter((x) => T(x.name) && N(x.qty) > 0);
  }
  function pickSaleDate() {
    let d = parseIso(state.sel.dates[0]);
    if (!d) {
      const sr = sourceRows(),
        ds = uniq(sr.map((r) => r.date)).sort();
      d = parseIso(ds[0]);
    }
    return d ? thaiDate(prevDay(d)) : "-";
  }
  function printMetaPick(total) {
    return [
      ["ชื่อร้าน", rec() || "-"],
      ["วันที่ขาย", pickSaleDate()],
      ["วันที่ส่ง", thaiDate(new Date())],
      ["รหัส PS", state.sel.ps.length ? state.sel.ps.join(", ") : "ทั้งหมด"],
      ["ราคารวม", total + " บาท"],
    ];
  }
  function tableRowsFromDom() {
    return $$("#table tbody tr")
      .map((tr) =>
        [...tr.children].map((td) => {
          const i = td.querySelector("input");
          return i ? T(i.value) : T(td.innerText);
        }),
      )
      .filter(
        (r) =>
          r.length &&
          r.join("").trim() &&
          !/ไม่มีข้อมูล|โหลดไฟล์|เลือก “ส่งให้ร้าน”/.test(r.join(" ")),
      );
  }
  function tableHeadsFromDom() {
    return $$("#table thead th")
      .map((th) => T(th.innerText))
      .filter(Boolean);
  }
  function defaultPrintMeta(title) {
    return [
      ["เอกสาร", title],
      ["วันที่พิมพ์", thaiDate(new Date())],
      [
        "วันที่",
        state.sel.dates.length
          ? state.sel.dates.map(dlabel).join(", ")
          : "ทั้งหมด",
      ],
      ["PS", state.sel.ps.length ? state.sel.ps.join(", ") : "ทั้งหมด"],
      ["ส่งให้ร้าน", rec() || "-"],
    ];
  }
  function openPrint(html) {
    const ov = document.createElement("div");
    ov.className = "printOverlay";
    ov.innerHTML = `<div class="printBar"><b>ตรวจ/แก้ไขก่อนปริ้น</b><span><button onclick="this.closest('.printOverlay').remove()">ปิด</button> <button onclick="window.print()">ปริ้น</button></span></div>${html}`;
    document.body.appendChild(ov);
    return ov;
  }
  function formalPrint(title, heads, rows, opt = {}) {
    if (!rows.length) return alert("ไม่มีข้อมูลสำหรับปริ้นในหน้า " + title);
    const doc = "DOIT-" + Date.now().toString().slice(-8),
      metaRows = opt.meta || defaultPrintMeta(title);
    const m = metaRows
      .map(
        ([k, v]) =>
          `<div contenteditable="true"><b>${E(k)}:</b> ${k === "ราคารวม" ? `<span id="ctxHeaderTotal">${E(v)}</span>` : E(v)}</div>`,
      )
      .join("");
    const h = heads.map((x) => `<th>${E(x)}</th>`).join("");
    const b = rows
      .map(
        (r, i) =>
          `<tr data-line><td class="c">${i + 1}</td>${r.map((x, j) => `<td class="${j >= 2 ? "r" : ""} ${opt.calc && j === 2 ? "rq" : ""} ${opt.calc && j === 3 ? "ru" : ""} ${opt.calc && j === 4 ? "rt" : ""}" contenteditable="${opt.calc && j === 4 ? "false" : "true"}">${E(x)}</td>`).join("")}</tr>`,
      )
      .join("");
    const foot = opt.total
      ? `<tr class="totalRow"><td colspan="${heads.length}" class="r" contenteditable="true">รวมทั้งหมด</td><td class="r" id="ctxTotal">${E(opt.total)}</td></tr>`
      : "";
    const ov = openPrint(
      `<section class="receiptPage"><div class="receiptTop"><div><h1 class="receiptTitle" contenteditable="true">${E(title)}</h1></div><div class="docBox"><div contenteditable="true"><b>เลขที่เอกสาร:</b> ${E(doc)}</div></div></div><div class="metaGrid">${m}</div><table class="receiptTable"><thead><tr><th style="width:36px">#</th>${h}</tr></thead><tbody>${b}${foot}</tbody></table><div class="noteBox" contenteditable="true">หมายเหตุ: </div><div class="signGrid"><div class="signBox" contenteditable="true">ผู้ส่งสินค้า / ผู้จัดทำ</div><div class="signBox" contenteditable="true">ผู้รับสินค้า</div></div></section>`,
    );
    if (opt.calc) {
      const recalc = () => {
        let total = 0;
        ov.querySelectorAll("tr[data-line]").forEach((tr) => {
          const q = N(tr.querySelector(".rq")?.textContent),
            u = N(tr.querySelector(".ru")?.textContent),
            t = q * u;
          total += t;
          const rt = tr.querySelector(".rt");
          if (rt) rt.textContent = B(t);
        });
        const tt = ov.querySelector("#ctxTotal"),
          hh = ov.querySelector("#ctxHeaderTotal");
        if (tt) tt.textContent = B(total);
        if (hh) hh.textContent = B(total) + " บาท";
      };
      ov.addEventListener("input", (e) => {
        if (e.target.closest(".receiptTable")) recalc();
      });
      ov.addEventListener(
        "blur",
        (e) => {
          if (e.target.closest(".receiptTable")) recalc();
        },
        true,
      );
      recalc();
    }
    return ov;
  }
  function printPick() {
    const data = printRowsForPick(),
      total = B(data.reduce((s, x) => s + x.qty * x.unit, 0)),
      trs = data.map((x) => [
        x.code,
        x.name,
        F(x.qty),
        B(x.unit),
        B(x.qty * x.unit),
      ]);
    formalPrint(
      "บิลสินค้า/ ใบเสร็จ",
      ["รหัส", "รายการสินค้า", "จำนวน", "ราคา/หน่วย", "รวมเงิน"],
      trs,
      {
        calc: true,
        total,
        meta: printMetaPick(total),
      },
    );
  }
  function printPrep() {
    if (state.mode === "pick") return printPick();
    const title =
      state.mode === "ship" ? "ใบส่งสินค้า / ใบเสร็จรับเงิน" : modeName();
    let heads = tableHeadsFromDom(),
      data = tableRowsFromDom();
    if (state.mode === "remain") {
      heads = heads.slice(1);
      data = data.map((r) => r.slice(1));
    }
    formalPrint(title, heads, data);
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
    let st = $("#ayaSeaWaveTitleCss");
    if (!st) {
      st = document.createElement("style");
      st.id = "ayaSeaWaveTitleCss";
      st.textContent =
        '@keyframes ayaLetterWave{0%,100%{transform:translateY(0)}25%{transform:translateY(-5px)}50%{transform:translateY(0)}75%{transform:translateY(4px)}}.ayaBrandTitle{display:inline-flex!important;align-items:center!important;justify-content:center!important;font-family:"Arial Black",Impact,system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif!important;font-size:21px!important;font-weight:1000!important;letter-spacing:.25px!important;line-height:1!important;color:#fff!important;-webkit-text-fill-color:#fff!important;background:none!important;text-shadow:0 2px 3px rgba(0,0,0,.55)!important;white-space:nowrap!important;overflow:visible!important}.ayaBrandTitle .ayaChar{display:inline-block!important;color:#fff!important;animation:ayaLetterWave 2.2s ease-in-out infinite!important;animation-delay:calc(var(--i) * .075s)!important}.topbar{overflow:hidden!important;background:linear-gradient(90deg,#075424,#087b34)!important}@media(max-width:720px){.ayaBrandTitle{font-size:16.2px!important;letter-spacing:.05px!important}.ayaBrandTitle .ayaChar{animation-duration:2.35s!important;animation-delay:calc(var(--i) * .065s)!important}}';
      document.head.appendChild(st);
    }
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
    if (!$("#coreMobileTableCss")) {
      const st = document.createElement("style");
      st.id = "coreMobileTableCss";
      st.textContent =
        '.blue{color:#2563eb!important;font-weight:900}.tbl{min-width:560px!important;font-size:12px!important}.tbl th,.tbl td{padding:6px 4px!important}.tbl input.pick{width:54px!important;height:32px!important}.tableWrap{overflow-x:auto!important}.insertDelBtn{margin-left:8px;border:1px solid #ef4444;background:#fef2f2;color:#dc2626;border-radius:7px;padding:2px 8px;font-size:11px;font-weight:950}.receiptPage{font-family:system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;color:#111;width:194mm;min-height:281mm;margin:8px auto;padding:10mm;background:#fff}.receiptTop{display:flex;justify-content:space-between;gap:16px;border-bottom:3px solid #111;padding-bottom:10px;margin-bottom:12px}.receiptTitle{font-size:24px;font-weight:950;margin:0}.docBox{text-align:right;font-size:12px;line-height:1.7}.metaGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;border:1px solid #111;padding:8px;margin-bottom:12px}.metaGrid div{font-size:13px}.metaGrid b{display:inline-block;min-width:78px}.receiptTable{width:100%;border-collapse:collapse;font-size:12px}.receiptTable th{background:#f3f4f6}.receiptTable th,.receiptTable td{border:1px solid #111;padding:5px;vertical-align:top}.r{text-align:right}.c{text-align:center}.totalRow td{font-weight:950;background:#f9fafb}.noteBox{border:1px solid #9ca3af;padding:8px;margin-top:12px;min-height:38px;font-size:12px}.signGrid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:32px}.signBox{text-align:center;border-top:1px solid #111;padding-top:8px;font-size:13px}[contenteditable="true"]{outline:1px dashed transparent;cursor:text}[contenteditable="true"]:focus{outline:1px dashed #2563eb;background:#eff6ff}@media(max-width:720px){.wrap{padding:8px!important}.tbl{min-width:540px!important}.p small{font-size:11px!important}}#diagBtn.settingsGear{width:40px;height:40px;border-radius:999px;padding:0!important;display:flex;align-items:center;justify-content:center;font-size:21px;line-height:1;background:#ffffff1a!important;color:#fff!important;border:1px solid #ffffff55!important}@media print{.printBar{display:none!important}.receiptPage{width:auto;min-height:auto;margin:0;padding:0}.receiptTable th{background:#eee!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
      document.head.appendChild(st);
    }
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
    function moveDisplayExport() {
      let st = $("#displayExportCss");
      if (!st) {
        st = document.createElement("style");
        st.id = "displayExportCss";
        st.textContent =
          ".displayActionButtons{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center}.displayActionButtons button{width:100%;height:40px;white-space:nowrap}@media(max-width:720px){.displayActionButtons{grid-column:1/-1;grid-template-columns:1fr 1fr}}";
        document.head.appendChild(st);
      }
    }
    function moveProActions() {
      let st = $("#sendActionMoveCss");
      if (!st) {
        st = document.createElement("style");
        st.id = "sendActionMoveCss";
        st.textContent =
          ".sendActionButtons{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:0}.sendActionButtons button{width:100%;height:38px;min-width:0;padding:0 3px;font-size:11px;line-height:1.05;white-space:normal}@media(max-width:720px){.sendActionButtons{grid-template-columns:repeat(4,minmax(0,1fr))}.sendActionButtons button{height:38px;font-size:10.8px;padding:0 2px}}";
        document.head.appendChild(st);
      }
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
    moveDisplayExport();
    const gear = $("#diagBtn");
    if (gear) {
      gear.textContent = "⚙";
      gear.title = "ตั้งค่า / ตรวจระบบ";
      gear.setAttribute("aria-label", "ตั้งค่า / ตรวจระบบ");
      gear.classList.add("settingsGear");
    }
    patchBrandTitle();
    patchTeamName();
  }
  function patchTeamName() {
    try {
      document.querySelectorAll(".devInfo b").forEach((b) => {
        if (T(b.textContent) === "ฐากูร อุปมัย")
          b.textContent = "นาย ฐากูร อุปมัย";
      });
      const img = $("#teamThakoonPro");
      if (img) img.alt = "นาย ฐากูร อุปมัย";
    } catch {}
  }
  function autoTeamPopup() {
    let tries = 0;
    const tick = () => {
      tries++;
      patchTeamName();
      try {
        if (typeof window.openDevTeamModal === "function") {
          window.openDevTeamModal();
          setTimeout(patchTeamName, 80);
          return;
        }
      } catch {}
      if (tries < 30) setTimeout(tick, 150);
    };
    setTimeout(tick, 350);
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
      state.sel = {
        dates: [],
        ps: [],
        orderStores: [],
        receivers: [],
        brands: [],
        types: [],
      };
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
    $("#prepPrint").onclick = printPrep;
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
    $("#diagBtn").onclick = () =>
      alert(JSON.stringify(window.DOIT_CORE_APP.health(), null, 2));
    autoTeamPopup();
  }
  window.DOIT_CORE_APP = {
    load: loadData,
    currentState,
    health: () => {
      const tr = teleRows();
      return {
        rows: state.rows.length,
        pickRows: sourceRows().length,
        shipRows: shipPool().length,
        distRows: sourceRows({
          ignoreDate: true,
        }).length,
        teleRows: state.rows.filter((r) => r.isTele).length,
        teleBills: teleBills().length,
        teleQty: tr.reduce((s, r) => s + N(r.qty), 0),
        teleRaw: tr.reduce((s, r) => s + N(r.rawAmt), 0),
        teleVat: tr.reduce(
          (s, r) => s + (N(r.netAmt) || N(r.rawAmt)) * 1.07,
          0,
        ),
        renderedTeleBills: $$(".teleBill").length,
        telePage: state.telePage,
        telePageSize: TELE_PAGE_SIZE,
        receivers: state.sel.receivers,
        manualKeys: Object.keys(state.send).length,
        inserted: state.ins.length,
        mode: state.mode,
        bound: state.bound,
        flow: "single-state-module-raw-net-v2",
        currentStateSource: "state-module",
      };
    },
  };
  window.DOIT_JSON_APP = window.DOIT_CORE_APP;
  bind();
  check();
})();
