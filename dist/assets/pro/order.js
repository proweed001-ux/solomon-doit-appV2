import { B, E, F, N } from "./utils.js";

function orderTotals(groups) {
  let qty = 0;
  let raw = 0;
  let net = 0;
  let vat = 0;
  groups.forEach((group) => {
    const lineVat = (N(group.netAmt) || N(group.rawAmt)) * 1.07;
    qty += N(F(group.qty));
    raw += N(B(group.rawAmt));
    net += N(B(group.netAmt));
    vat += N(B(lineVat));
  });
  return { qty, raw, net, vat };
}

export function buildOrderPrintPayload(groups) {
  const totals = orderTotals(groups);
  return {
    heads: ["สินค้า", "จำนวนรวม", "สุทธิ+7%"],
    rows: groups.map((group) => [
      group.sku,
      F(group.qty),
      B((N(group.netAmt) || N(group.rawAmt)) * 1.07),
    ]),
    total: totals.vat,
  };
}

export function renderOrderMode(groups, simpleTable, options = {}) {
  const requestedSize = Math.floor(N(options.pageSize));
  const pageSize = requestedSize > 0 ? requestedSize : Math.max(1, groups.length);
  const pageCount = Math.max(1, Math.ceil(groups.length / pageSize));
  const currentPage = Math.min(
    pageCount,
    Math.max(1, Math.floor(N(options.page)) || 1),
  );
  const offset = (currentPage - 1) * pageSize;
  const visibleGroups = groups.slice(offset, offset + pageSize);
  const totals = orderTotals(groups);
  const body = visibleGroups
    .map((group, index) => {
      const lineVat = (N(group.netAmt) || N(group.rawAmt)) * 1.07;
      const code =
        group.code && group.code !== group.sku
          ? "<small>" + E(group.code) + "</small>"
          : "";
      return (
        "<tr><td>" +
        (offset + index + 1) +
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
    F(totals.qty) +
    "</td><td>" +
    B(totals.raw) +
    "</td><td>" +
    B(totals.net) +
    "</td><td>" +
    B(totals.vat) +
    "</td></tr>";
  simpleTable(
    "รวม order PS + Telesale " + F(groups.length) + " รายการ",
    ["#", "สินค้า", "จำนวนรวม", "ยอดดิบ", "ยอดสุทธิ", "รวม VAT"],
    body + total,
  );
  return {
    currentPage,
    pageCount,
    pageSize,
    totalGroups: groups.length,
    visibleGroups: visibleGroups.length,
  };
}
