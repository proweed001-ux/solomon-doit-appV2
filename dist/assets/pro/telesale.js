import { $, $$, B, E, F, N, dlabel } from "./utils.js";

export const TELE_PAGE_SIZE = 20;

export function buildTelesaleBills(rows) {
  const bills = new Map();
  rows.forEach((row) => {
    const key = [row.inv, row.store, row.tele, row.date].join("|");
    let bill = bills.get(key);
    if (!bill) {
      bill = {
        inv: row.inv || "-",
        store: row.store,
        tele: row.tele,
        date: row.date,
        lines: [],
        qty: 0,
        amt: 0,
      };
      bills.set(key, bill);
    }
    bill.lines.push(row);
    bill.qty += row.qty;
    bill.amt += row.amt;
  });
  return [...bills.values()].sort(
    (left, right) =>
      left.date.localeCompare(right.date) ||
      left.store.localeCompare(right.store, "th"),
  );
}

function billHtml(bill) {
  let qty = 0;
  let raw = 0;
  let vat = 0;
  const lines = bill.lines
    .map((row) => {
      const lineVat = (N(row.netAmt) || N(row.rawAmt)) * 1.07;
      qty += N(F(row.qty));
      raw += N(B(row.rawAmt));
      vat += N(B(lineVat));
      return (
        "<tr><td>" +
        E(row.sku) +
        "</td><td>" +
        F(row.qty) +
        "</td><td>" +
        B(row.rawAmt) +
        "</td><td>" +
        B(lineVat) +
        "</td></tr>"
      );
    })
    .join("");
  const total =
    '<tr class="totalRow nativeTeleTotal"><td>รวมทั้งหมด</td><td>' +
    F(qty) +
    "</td><td>" +
    B(raw) +
    "</td><td>" +
    B(vat) +
    "</td></tr>";
  return (
    '<div class="teleBill"><div class="teleBillHead"><b>ร้าน: ' +
    E(bill.store) +
    "</b><br><small>บิล: " +
    E(bill.inv) +
    " · วันที่ " +
    E(dlabel(bill.date)) +
    " · Tele: " +
    E(bill.tele) +
    '</small></div><table class="teleTbl"><thead><tr><th>สินค้า</th><th>จำนวน</th><th>ยอดดิบ</th><th>สุทธิ+VAT</th></tr></thead><tbody>' +
    lines +
    total +
    "</tbody></table></div>"
  );
}

export function renderTelesaleDrawer({ bills, page, onPage }) {
  const button = $("#teleBtn");
  const body = $("#drawerBody");
  const drawer = $("#teleDrawer");
  if (button) button.textContent = "บิล Telesale (" + F(bills.length) + ")";
  if (!body) return page;
  if (!drawer?.classList.contains("on")) {
    body.innerHTML =
      '<div class="empty">เปิดบิล Telesale เพื่อแสดงรายการแบบแบ่งหน้า</div>';
    return page;
  }
  if (!bills.length) {
    body.innerHTML =
      '<div class="empty">ไม่พบ Telesale ตามตัวเลือกที่ติ๊ก</div>';
    return 1;
  }
  const pages = Math.max(1, Math.ceil(bills.length / TELE_PAGE_SIZE));
  const activePage = Math.min(Math.max(1, page), pages);
  const start = (activePage - 1) * TELE_PAGE_SIZE;
  const shown = bills.slice(start, start + TELE_PAGE_SIZE);
  const pager =
    '<div class="pagination telePager"><button class="page" data-tele-page="' +
    Math.max(1, activePage - 1) +
    '" ' +
    (activePage === 1 ? "disabled" : "") +
    '>‹</button><button class="page on">' +
    activePage +
    "/" +
    pages +
    '</button><button class="page" data-tele-page="' +
    Math.min(pages, activePage + 1) +
    '" ' +
    (activePage === pages ? "disabled" : "") +
    ">›</button></div>";
  body.innerHTML =
    '<div class="hint" style="padding:0 0 8px">แสดงบิล ' +
    F(start + 1) +
    "–" +
    F(start + shown.length) +
    " จาก " +
    F(bills.length) +
    " บิล</div>" +
    shown.map(billHtml).join("") +
    pager;
  $$("[data-tele-page]").forEach((pagerButton) => {
    pagerButton.onclick = () => onPage(N(pagerButton.dataset.telePage) || 1);
  });
  return activePage;
}
