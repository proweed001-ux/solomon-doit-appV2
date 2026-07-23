import assert from "node:assert/strict";
import fs from "node:fs";
import { group, sourceRows, teleRows } from "../dist/assets/pro/filters.js";
import { norm } from "../dist/assets/pro/parser-adapter.js";
import {
  createSelection,
  mapVal,
  rkey,
  sk,
  state,
  sumMap,
} from "../dist/assets/pro/state.js";

const fixture = JSON.parse(
  fs.readFileSync("scripts/fixtures/pro-regression-v1.json", "utf8"),
);
const appSource = fs.readFileSync("dist/assets/pro/app.js", "utf8");
const coreSource = fs.readFileSync("dist/assets/pro/core.js", "utf8");
const printSource = fs.readFileSync(
  "dist/assets/pro-print-store-bills.js",
  "utf8",
);

state.rows = fixture.rows.map((row) => ({ ...row }));
state.key = "fixture-active";
state.sel = { ...createSelection(), ...fixture.selection };
state.q = fixture.search;
state.send = {};
state.add = {};
state.pull = {};
state.ins = [];

for (const kind of ["send", "add", "pull"]) {
  for (const item of fixture.manual[kind]) {
    state[kind][rkey(item.poolKey, item.store)] = item.qty;
  }
}

const rows = sourceRows();
const groups = group(rows);
const sentQty = groups.reduce(
  (sum, item) => sum + sumMap(state.send, item.poolKey),
  0,
);
const remainingQty = groups.reduce(
  (sum, item) =>
    sum +
    item.qty -
    sumMap(state.send, item.poolKey) +
    sumMap(state.add, item.poolKey) -
    sumMap(state.pull, item.poolKey),
  0,
);
const receiver = state.sel.receivers[0];
const printLines = groups
  .map((item) => {
    const qty = mapVal(state.send, item.poolKey, receiver);
    const unit = item.qty ? (item.netAmt / item.qty) * 1.07 : 0;
    return { qty, unit, total: qty * unit };
  })
  .filter((line) => line.qty > 0);
const printRawTotal = printLines.reduce((sum, line) => sum + line.total, 0);
const telesaleRows = teleRows();
const telesaleBills = new Set(
  telesaleRows.map((row) => [row.inv, row.store, row.tele, row.date].join("|")),
);

assert.equal(rows.length, fixture.expected.filteredRows);
assert.equal(groups.length, fixture.expected.pickGroups);
assert.equal(
  groups.reduce((sum, item) => sum + item.qty, 0),
  fixture.expected.sourceQty,
);
assert.equal(
  groups.reduce((sum, item) => sum + item.rawAmt, 0),
  fixture.expected.rawAmount,
);
assert.equal(
  groups.reduce((sum, item) => sum + item.netAmt, 0),
  fixture.expected.netAmount,
);
assert.ok(
  Math.abs(
    groups.reduce((sum, item) => sum + item.netAmt, 0) * 1.07 -
      fixture.expected.vatAmount,
  ) < 1e-9,
);
assert.equal(sentQty, fixture.expected.sentQty);
assert.equal(remainingQty, fixture.expected.remainingQty);
assert.equal(printLines.length, fixture.expected.printRows);
assert.equal(
  printLines.reduce((sum, line) => sum + line.qty, 0),
  fixture.expected.printQty,
);
assert.ok(Math.abs(printRawTotal - fixture.expected.printRawTotal) < 1e-9);
assert.equal(Math.floor(printRawTotal), fixture.expected.printStoreTotal);
assert.equal(Math.ceil(printLines.length / 12), fixture.expected.printBills);
assert.equal(telesaleRows.length, fixture.expected.teleRows);
assert.equal(telesaleBills.size, fixture.expected.teleBills);
assert.equal(
  telesaleRows.reduce((sum, row) => sum + row.qty, 0),
  fixture.expected.teleQty,
);
assert.equal(
  telesaleRows.reduce((sum, row) => sum + row.rawAmt, 0),
  fixture.expected.teleRaw,
);
assert.ok(
  Math.abs(
    telesaleRows.reduce(
      (sum, row) => sum + (row.netAmt || row.rawAmt) * 1.07,
      0,
    ) - fixture.expected.teleVat,
  ) < 1e-9,
);

const priority = norm({
  ShipQtyPCS: 2,
  raw: { LineAmtBeforeDisc: 100, InvoiceAmt: 80 },
});
assert.equal(priority.rawAmt, 100, "Raw amount field priority changed");
assert.equal(priority.netAmt, 80, "Net amount field priority changed");
assert.equal(priority.unit, 50, "Raw unit formula changed");
assert.equal(priority.netUnit, 40, "Net unit formula changed");
assert.equal(sk(), "doit-core-unified-v1:fixture-active");
assert.match(appSource, /import "\.\/core\.js";/);
assert.doesNotMatch(appSource, /pro-native-core\.js/);
assert.match(coreSource, /currentStateSource: "state-module"/);
assert.match(printSource, /BILL_ROWS=12/, "Print rows per bill changed");
assert.match(printSource, /BILLS_PER_A4=2/, "Bills per A4 changed");
assert.match(
  printSource,
  /const qty=mapVal\(st\.send,g\.poolKey,store,st\.sel\)/,
  "Print must use send only",
);
assert.match(
  printSource,
  /return rows\.filter\(r=>T\(r\.name\)&&N\(r\.qty\)>0\)/,
  "Zero-quantity print filter changed",
);

console.log("Pro regression modules passed:", fixture.expected);
