import { B, E, F, N } from "./utils.js";

export function renderOrderMode(groups, simpleTable) {
  let qty = 0;
  let raw = 0;
  let net = 0;
  let vat = 0;
  const body = groups
    .map((group, index) => {
      const lineVat = (N(group.netAmt) || N(group.rawAmt)) * 1.07;
      const code =
        group.code && group.code !== group.sku
          ? "<small>" + E(group.code) + "</small>"
          : "";
      qty += N(F(group.qty));
      raw += N(B(group.rawAmt));
      net += N(B(group.netAmt));
      vat += N(B(lineVat));
      return (
        "<tr><td>" +
        (index + 1) +
        '</td><td class="p" data-print-value="' +
        E(group.sku) +
        '"><b>' +
        E(group.sku) +
        "</b>" +
        code +
        "</td><td>" +
        F(group.qty) +
        "</td><td>" +
        B(group.rawAmt) +
        "</td><td>" +
        B(group.netAmt) +
        "</td><td>" +
        B(lineVat) +
        "</td></tr>"
      );
    })
    .join("");
  const total =
    '<tr class="totalRow nativeOrderTotal"><td colspan="2" class="r">รวมทั้งหมด</td><td>' +
    F(qty) +
    "</td><td>" +
    B(raw) +
    "</td><td>" +
    B(net) +
    "</td><td>" +
    B(vat) +
    "</td></tr>";
  simpleTable(
    "รวม order PS + Telesale " + F(groups.length) + " รายการ",
    ["#", "สินค้า", "จำนวนรวม", "ยอดดิบ", "ยอดสุทธิ", "รวม VAT"],
    body + total,
  );
}
