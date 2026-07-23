import { doneSummary } from "./print-model.js";
import { $, B, D, E, F } from "./utils.js";

export function renderDoneMode() {
  const table = $("#table");
  const count = $("#tableCount");
  if (!table || !count) return;
  const summary = doneSummary();
  const products = summary.products;
  count.textContent =
    "จัดแล้ว " +
    F(products.length) +
    " รายการ · รวมจากบิลเตรียมปริ้น " +
    D(summary.storeTotal) +
    " บาท";
  table.innerHTML =
    "<thead><tr><th>#</th><th>สินค้า</th><th>จำนวนที่ส่งทั้งหมด</th><th>ราคารวมส่ง</th></tr></thead><tbody>" +
    (products.length
      ? products
          .map(
            (item, index) =>
              "<tr><td>" +
              (index + 1) +
              "</td><td>" +
              E(item.name) +
              "</td><td>" +
              F(item.qty) +
              "</td><td>" +
              B(item.rawTotal) +
              "</td></tr>",
          )
          .join("") +
        '<tr class="totalRow"><td colspan="3" class="r">รวมจากบิลเตรียมปริ้น</td><td class="r">' +
        D(summary.storeTotal) +
        "</td></tr>"
      : '<tr><td colspan="4" class="empty">ไม่มีข้อมูล</td></tr>') +
    "</tbody>";
  $("#pager").innerHTML = "";
}
