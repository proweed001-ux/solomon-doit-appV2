import { sourceRows } from "./filters.js";
import {
  BILL_ROWS,
  BILLS_PER_A4,
  buildBills,
  lineKey,
  lineVal,
  saveLineEdit,
} from "./print-model.js";
import { state } from "./state.js";
import { $, $$, B, D, E, F, N, T, parseIso, prevDay, thaiDate } from "./utils.js";

function saleDate() {
  let date = parseIso(state.sel.dates[0]);
  if (!date) {
    const dates = [...new Set(sourceRows().map((row) => row.date).filter(Boolean))].sort();
    date = parseIso(dates[0]);
  }
  return date ? thaiDate(prevDay(date)) : "-";
}

function printBar(label) {
  return (
    '<div class="printBar"><b>' +
    E(label) +
    '</b><span><button type="button" data-print-close>ปิด</button> <button type="button" data-print-now>ปริ้น</button></span></div>'
  );
}

function bindOverlay(overlay) {
  overlay.querySelector("[data-print-close]")?.addEventListener("click", () => overlay.remove());
  overlay.querySelector("[data-print-now]")?.addEventListener("click", () => window.print());
}

function blankRows(count) {
  return Array.from(
    { length: Math.max(0, BILL_ROWS - count) },
    () =>
      '<tr class="blankLine"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>',
  ).join("");
}

function receiptHtml(bill, index) {
  const heads = ["รหัส", "รายการสินค้า", "จำนวน", "ราคา/หน่วย", "รวมเงิน"];
  const ps = state.sel.ps.length ? state.sel.ps.join(", ") : "ทั้งหมด";
  const meta = [
    ["ชื่อร้าน", bill.store || "-"],
    ["วันที่ขาย", saleDate()],
    ["วันที่ส่ง", thaiDate(new Date())],
  ]
    .map(
      ([key, value]) =>
        '<div contenteditable="true"><b>' +
        E(key) +
        ':</b> <span>' +
        E(value) +
        "</span></div>",
    )
    .join("");
  const body = bill.rows
    .map((row, rowIndex) => {
      const key = lineKey(bill.store, row);
      const value = lineVal(bill.store, row);
      const cells = [row.code, row.name, F(value.qty), B(value.unit), B(value.total)];
      return (
        '<tr data-line data-edit-key="' +
        E(encodeURIComponent(key)) +
        '"><td class="c">' +
        ((bill.startNo || 1) + rowIndex) +
        "</td>" +
        cells
          .map(
            (cell, cellIndex) =>
              '<td class="' +
              (cellIndex >= 2 ? "r" : "") +
              " " +
              (cellIndex === 1 ? "itemName" : "") +
              " " +
              (cellIndex === 2 ? "rq" : "") +
              " " +
              (cellIndex === 3 ? "ru" : "") +
              " " +
              (cellIndex === 4 ? "rt" : "") +
              '" contenteditable="' +
              (cellIndex === 4 ? "false" : "true") +
              '">' +
              E(cell) +
              "</td>",
          )
          .join("") +
        "</tr>"
      );
    })
    .join("");
  const label = bill.isLastStorePart
    ? "รวมทั้งหมด"
    : "ต่อใบถัดไป (" + bill.partNo + "/" + bill.partCount + ")";
  const total = bill.isLastStorePart ? D(bill.storeTotal) : "";
  return (
    '<section class="receiptPage" data-store-seq="' +
    E(bill.storeSeq ?? index) +
    '" data-last-part="' +
    (bill.isLastStorePart ? "1" : "0") +
    '"><div class="receiptTop"><div class="titleWrap"><h1 class="receiptTitle" contenteditable="true">บิลสินค้า/ ใบเสร็จ</h1></div><div class="docBox"><div contenteditable="true"><b>เลขที่เอกสาร:</b> DOIT-' +
    Date.now().toString().slice(-8) +
    "-" +
    (index + 1) +
    '</div><div contenteditable="true"><b>รหัส PS:</b> ' +
    E(ps) +
    '</div></div></div><div class="metaGrid compactMeta">' +
    meta +
    '</div><table class="receiptTable"><thead><tr><th style="width:24px">#</th>' +
    heads.map((head) => "<th>" + E(head) + "</th>").join("") +
    "</tr></thead><tbody>" +
    body +
    blankRows(bill.rows.length) +
    '<tr class="totalRow"><td colspan="' +
    heads.length +
    '" class="r" contenteditable="true">' +
    E(label) +
    '</td><td class="r" data-page-total="' +
    (bill.isLastStorePart ? "1" : "0") +
    '">' +
    E(total) +
    '</td></tr></tbody></table><div class="noteBox" contenteditable="true">หมายเหตุ: </div><div class="signGrid"><div class="signBox" contenteditable="true">ผู้ส่งสินค้า / ผู้จัดทำ</div><div class="signBox" contenteditable="true">ผู้รับสินค้า</div></div></section>'
  );
}

export function billPagesHtml(bills) {
  const pages = [];
  for (let index = 0; index < bills.length; index += BILLS_PER_A4) {
    pages.push(bills.slice(index, index + BILLS_PER_A4));
  }
  return pages
    .map(
      (page, pageIndex) =>
        '<div class="a4Sheet">' +
        page
          .map((bill, billIndex) => receiptHtml(bill, pageIndex * BILLS_PER_A4 + billIndex))
          .join("") +
        Array.from(
          { length: BILLS_PER_A4 - page.length },
          () => '<section class="receiptPage emptyBill"></section>',
        ).join("") +
        "</div>",
    )
    .join("");
}

function decodeKey(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
}

function recalculateReceipt(page, persist = false) {
  page.querySelectorAll("tr[data-line]").forEach((row) => {
    const qty = N(row.querySelector(".rq")?.textContent);
    const unit = N(row.querySelector(".ru")?.textContent);
    if (persist) saveLineEdit(decodeKey(row.dataset.editKey), qty, unit);
    const total = row.querySelector(".rt");
    if (total) total.textContent = B(qty * unit);
  });
  const totalElement = page.querySelector("[data-page-total]");
  if (!totalElement) return;
  if (totalElement.dataset.pageTotal === "0") {
    totalElement.textContent = "";
    return;
  }
  const overlay = page.closest(".printOverlay") || document;
  const storeSequence = page.dataset.storeSeq;
  let raw = 0;
  overlay
    .querySelectorAll('.receiptPage[data-store-seq="' + storeSequence + '"] tr[data-line]')
    .forEach((row) => {
      raw += N(row.querySelector(".rq")?.textContent) * N(row.querySelector(".ru")?.textContent);
    });
  totalElement.textContent = D(raw);
}

function openStoreBills(bills) {
  const overlay = document.createElement("div");
  overlay.className = "printOverlay printMobileSafeA4";
  overlay.innerHTML =
    printBar("ตรวจ/แก้ไขก่อนปริ้น — A4 มือถือ กันเครื่องปริ้นกินขอบ") + billPagesHtml(bills);
  document.body.appendChild(overlay);
  bindOverlay(overlay);
  const recalculate = (persist) =>
    overlay.querySelectorAll(".receiptPage").forEach((page) => recalculateReceipt(page, persist));
  recalculate(false);
  overlay.addEventListener("input", (event) => {
    if (event.target.closest(".receiptTable")) recalculate(true);
  });
  overlay.addEventListener(
    "blur",
    (event) => {
      if (event.target.closest(".receiptTable")) recalculate(true);
    },
    true,
  );
}

function tableHeadsFromDom() {
  const heads = $$("#table thead th")
    .map((head) => T(head.innerText || head.textContent))
    .filter(Boolean);
  return heads[0] === "#" ? heads.slice(1) : heads;
}

function isTotalRow(rowElement, row) {
  if (rowElement.classList.contains("totalRow")) return true;
  const text = row.join(" ");
  return /^รวมทั้งหมด\b/.test(text) || /^รวมสุทธิ\+?7%\b/.test(text);
}

function tableRowsFromDom() {
  return $$("#table tbody tr")
    .map((rowElement) => ({
      rowElement,
      row: [...rowElement.children].map((cell) => {
        const input = cell.querySelector("input");
        if (input) return T(input.value);
        if (cell.hasAttribute("data-print-value")) {
          return T(cell.getAttribute("data-print-value"));
        }
        return T(cell.innerText || cell.textContent);
      }),
    }))
    .filter(
      ({ row }) =>
        row.length &&
        row.join("").trim() &&
        !/ไม่มีข้อมูล|โหลดไฟล์|เลือก “ส่งให้ร้าน”/.test(row.join(" ")),
    )
    .filter(({ rowElement, row }) => !isTotalRow(rowElement, row))
    .map(({ row }) => (row[0] === "#" || /^\d+$/.test(row[0]) ? row.slice(1) : row));
}

function orderPrintShape(heads, rows) {
  const find = (patterns) =>
    heads.findIndex((head) => patterns.some((pattern) => head.includes(pattern)));
  const itemIndex = find(["สินค้า", "รายการ"]);
  const qtyIndex = find(["จำนวนรวม", "จำนวน", "ชิ้น"]);
  const vatIndex = find(["รวม VAT", "สุทธิ+7%", "สุทธิ +7%", "VAT"]);
  const safeItem = itemIndex >= 0 ? itemIndex : 0;
  const safeQty = qtyIndex >= 0 ? qtyIndex : 1;
  const safeVat = vatIndex >= 0 ? vatIndex : heads.length - 1;
  return {
    heads: ["สินค้า", "จำนวนรวม", "สุทธิ+7%"],
    rows: rows.map((row) => [row[safeItem] || "", row[safeQty] || "", row[safeVat] || ""]),
    total: rows.reduce((sum, row) => sum + N(row[safeVat]), 0),
  };
}

function genericMeta(title) {
  return [
    ["เอกสาร", title],
    ["วันที่พิมพ์", thaiDate(new Date())],
    ["วันที่", state.sel.dates.length ? state.sel.dates.join(", ") : "ทั้งหมด"],
    ["PS", state.sel.ps.length ? state.sel.ps.join(", ") : "ทั้งหมด"],
  ];
}

function openGenericPrint(title, heads, rows, options = {}) {
  const documentNumber = "DOIT-" + Date.now().toString().slice(-8);
  const meta = genericMeta(title)
    .map(([key, value]) => '<div contenteditable="true"><b>' + E(key) + ":</b> " + E(value) + "</div>")
    .join("");
  const body = rows
    .map(
      (row, index) =>
        "<tr><td>" +
        (index + 1) +
        "</td>" +
        row
          .map(
            (value, columnIndex) =>
              '<td contenteditable="true" class="' +
              (columnIndex >= 1 ? "r" : "") +
              '">' +
              E(value) +
              "</td>",
          )
          .join("") +
        "</tr>",
    )
    .join("");
  const total =
    options.total == null
      ? ""
      : '<tr class="totalRow"><td colspan="' +
        heads.length +
        '" class="r">รวมสุทธิ+7%</td><td class="r">' +
        E(B(options.total)) +
        "</td></tr>";
  const overlay = document.createElement("div");
  overlay.className = "printOverlay proPrintGeneric " + (options.printClass || "");
  overlay.innerHTML =
    printBar("ตรวจ/แก้ไขก่อนปริ้น — " + title) +
    '<section class="receiptPage"><div class="receiptTop"><h1 class="receiptTitle" contenteditable="true">' +
    E(title) +
    '</h1><div class="docBox"><div contenteditable="true"><b>เลขที่เอกสาร:</b> ' +
    E(documentNumber) +
    '</div></div></div><div class="metaGrid">' +
    meta +
    '</div><table class="receiptTable"><thead><tr><th>#</th>' +
    heads.map((head) => "<th>" + E(head) + "</th>").join("") +
    "</tr></thead><tbody>" +
    body +
    total +
    '</tbody></table><div class="noteBox" contenteditable="true">หมายเหตุ: </div><div class="signGrid"><div class="signBox" contenteditable="true">ผู้ส่งสินค้า / ผู้จัดทำ</div><div class="signBox" contenteditable="true">ผู้รับสินค้า</div></div></section>';
  document.body.appendChild(overlay);
  bindOverlay(overlay);
}

export function preparePrint({ mode, title }) {
  if (mode === "pick") {
    const bills = buildBills();
    if (!bills.length) {
      alert("ยังไม่ได้กรอกจำนวนส่งให้ร้าน จึงไม่สามารถเตรียมปริ้นได้");
      return;
    }
    openStoreBills(bills);
    return;
  }
  let heads = tableHeadsFromDom();
  let rows = tableRowsFromDom();
  if (!rows.length) {
    alert("ไม่มีข้อมูลสำหรับปริ้นในหน้า " + title);
    return;
  }
  let total = null;
  let finalTitle = mode === "ship" ? "ใบส่งสินค้า / ใบเสร็จรับเงิน" : title;
  let printClass = "";
  if (mode === "order") {
    const order = orderPrintShape(heads, rows);
    heads = order.heads;
    rows = order.rows;
    total = order.total;
    finalTitle = "รวมออเดอร์";
    printClass = "orderPrint";
  }
  openGenericPrint(finalTitle, heads, rows, { total, printClass });
}
