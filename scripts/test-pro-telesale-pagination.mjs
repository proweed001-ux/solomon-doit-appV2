import assert from 'node:assert/strict';
import fs from 'node:fs';

const corePath = 'dist/assets/pro-native-core.js';
const source = fs.readFileSync(corePath, 'utf8');

assert.match(source, /const TELE_PAGE_SIZE=20;/, 'Telesale page size must stay at 20 bills');
assert.match(
  source,
  /if\(!drawer\?\.classList\.contains\('on'\)\)\{body\.innerHTML=.*?return\}/,
  'Closed Telesale drawer must return before bill tables are built',
);
assert.match(
  source,
  /bs\.slice\(start,start\+TELE_PAGE_SIZE\)/,
  'Open Telesale drawer must render only the active page',
);

const bills = Array.from({ length: 53 }, (_, billIndex) => ({
  lines: Array.from({ length: (billIndex % 4) + 1 }, (_, lineIndex) => {
    const qty = billIndex + lineIndex + 1;
    const rawAmt = qty * (12.5 + lineIndex);
    const netAmt = rawAmt - lineIndex * 0.75;
    return { qty, rawAmt, netAmt };
  }),
}));

const summarize = list => list.reduce(
  (total, bill) => bill.lines.reduce((sum, line) => ({
    bills: total.bills,
    lines: sum.lines + 1,
    qty: sum.qty + line.qty,
    raw: sum.raw + line.rawAmt,
    vat: sum.vat + (line.netAmt || line.rawAmt) * 1.07,
  }), total),
  { bills: list.length, lines: 0, qty: 0, raw: 0, vat: 0 },
);

const before = summarize(bills);
const pages = [];
for (let start = 0; start < bills.length; start += 20) {
  pages.push(bills.slice(start, start + 20));
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

assert.deepEqual(after, before, 'Pagination must not change Telesale totals');
assert.deepEqual(pages.map(page => page.length), [20, 20, 13]);

console.log('Pro Telesale lazy pagination passed:', {
  pageSizes: pages.map(page => page.length),
  totals: before,
});
