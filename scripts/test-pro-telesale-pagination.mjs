import assert from "node:assert/strict";
import fs from "node:fs";
import {
  buildTelesaleBills,
  TELE_PAGE_SIZE,
} from "../dist/assets/pro/telesale.js";

const corePath = "dist/assets/pro/telesale.js";
const source = fs.readFileSync(corePath, "utf8");

assert.equal(TELE_PAGE_SIZE, 20, "Telesale page size must stay at 20 bills");
assert.match(
  source,
  /if \(!drawer\?\.classList\.contains\("on"\)\) \{[\s\S]*?return page;/,
  "Closed Telesale drawer must return before bill tables are built",
);
assert.match(
  source,
  /bills\.slice\(start, start \+ TELE_PAGE_SIZE\)/,
  "Open Telesale drawer must render only the active page",
);

const rows = Array.from({ length: 53 }, (_, billIndex) =>
  Array.from({ length: (billIndex % 4) + 1 }, (_, lineIndex) => {
    const qty = billIndex + lineIndex + 1;
    const rawAmt = qty * (12.5 + lineIndex);
    const netAmt = rawAmt - lineIndex * 0.75;
    return {
      inv: `INV-${billIndex}`,
      store: `Store-${billIndex}`,
      tele: `Tele-${billIndex % 3}`,
      date: "2026-07-20",
      qty,
      amt: rawAmt,
      rawAmt,
      netAmt,
    };
  }),
).flat();
const bills = buildTelesaleBills(rows);

const summarize = (list) =>
  list.reduce(
    (total, bill) =>
      bill.lines.reduce(
        (sum, line) => ({
          bills: total.bills,
          lines: sum.lines + 1,
          qty: sum.qty + line.qty,
          raw: sum.raw + line.rawAmt,
          vat: sum.vat + (line.netAmt || line.rawAmt) * 1.07,
        }),
        total,
      ),
    { bills: list.length, lines: 0, qty: 0, raw: 0, vat: 0 },
  );

const before = summarize(bills);
const pages = [];
for (let start = 0; start < bills.length; start += TELE_PAGE_SIZE) {
  pages.push(bills.slice(start, start + TELE_PAGE_SIZE));
}
const after = pages.reduce(
  (total, page) => {
    const part = summarize(page);
    return {
      bills: total.bills + part.bills,
      lines: total.lines + part.lines,
      qty: total.qty + part.qty,
      raw: total.raw + part.raw,
      vat: total.vat + part.vat,
    };
  },
  { bills: 0, lines: 0, qty: 0, raw: 0, vat: 0 },
);

assert.deepEqual(
  { ...after, vat: 0 },
  { ...before, vat: 0 },
  "Pagination must not change Telesale counts or raw totals",
);
assert.ok(
  Math.abs(after.vat - before.vat) < 1e-9,
  "Pagination must not change Telesale VAT total",
);
assert.deepEqual(
  pages.map((page) => page.length),
  [20, 20, 13],
);

console.log("Pro Telesale lazy pagination passed:", {
  pageSizes: pages.map((page) => page.length),
  totals: before,
});
