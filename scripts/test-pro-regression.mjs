import assert from "node:assert/strict";
import fs from "node:fs";
import {
  group,
  okBrand,
  okCut,
  okDate,
  okPs,
  okQ,
  okType,
  sourceRows,
  teleRows,
} from "../dist/assets/pro/filters.js";
import { norm } from "../dist/assets/pro/parser-adapter.js";
import { renderOrderMode } from "../dist/assets/pro/order.js";
import {
  browserFixtureRows,
  fixtureMeta,
} from "./fixtures/pro-browser-fixture.mjs";
import {
  BILL_ROWS,
  BILLS_PER_A4,
  buildBills,
  doneSummary,
  lineVal,
} from "../dist/assets/pro/print-model.js";
import { billPagesHtml } from "../dist/assets/pro/print.js";
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
const moduleBills = buildBills();
const modulePrintRows = moduleBills.flatMap((bill) =>
  bill.rows.map((row) => lineVal(bill.store, row)),
);
const done = doneSummary();
const twoSheetHtml = billPagesHtml([
  ...moduleBills,
  ...moduleBills.map((bill) => ({ ...bill, storeSeq: 1 })),
  ...moduleBills.map((bill) => ({ ...bill, storeSeq: 2 })),
]);
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
assert.equal(BILL_ROWS, 12, "Print rows per bill changed");
assert.equal(BILLS_PER_A4, 2, "Bills per A4 changed");
assert.equal(moduleBills.length, fixture.expected.printBills);
assert.equal(modulePrintRows.length, fixture.expected.printRows);
assert.equal(
  modulePrintRows.reduce((sum, row) => sum + row.qty, 0),
  fixture.expected.printQty,
  "Print model must use send quantities only",
);
assert.equal(done.storeTotal, fixture.expected.printStoreTotal);
assert.equal(
  (twoSheetHtml.match(/class="a4Sheet"/g) || []).length,
  2,
  "Print must keep two bills per A4 sheet",
);
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
assert.doesNotMatch(appSource, /pro-native-core-overrides\.js/);
assert.doesNotMatch(appSource, /pro-print-(?:store-bills|mode-fixes|column-widths|a4-pro-fix)\.js/);

const orderRows = browserFixtureRows().map(norm);
const filteredOrderRows = () =>
  state.rows.filter(
    (row) =>
      okDate(row) &&
      okPs(row) &&
      okCut(row) &&
      okBrand(row) &&
      okType(row) &&
      okQ(row),
  );
state.rows = orderRows;
state.sel = createSelection();
state.q = "";
const orderGroups = group(filteredOrderRows());
assert.equal(state.rows.length, fixtureMeta.totalRows);
assert.equal(
  state.rows.filter((row) => !row.isTele).length,
  fixtureMeta.normalRows,
);
assert.equal(
  state.rows.filter((row) => row.isTele).length,
  fixtureMeta.teleRows,
);
assert.equal(orderGroups.length, fixtureMeta.orderGroups);
assert.equal(
  orderGroups.reduce((sum, item) => sum + item.qty, 0),
  fixtureMeta.orderQty,
);
assert.equal(
  orderGroups.reduce((sum, item) => sum + item.rawAmt, 0),
  fixtureMeta.orderRawAmount,
);
assert.equal(
  orderGroups.reduce((sum, item) => sum + item.netAmt, 0),
  fixtureMeta.orderNetAmount,
);
assert.ok(
  Math.abs(
    orderGroups.reduce(
      (sum, item) => sum + (item.netAmt || item.rawAmt) * 1.07,
      0,
    ) - fixtureMeta.orderVatAmount,
  ) < 1e-9,
);
assert.ok(
  orderGroups.some((item) => item.code === "TSKU-001"),
  "Combined Order must include Telesale SKU TSKU-001",
);
let renderedOrderBody = "";
renderOrderMode(orderGroups, (_title, _heads, body) => {
  renderedOrderBody = body;
});
assert.match(
  renderedOrderBody,
  /TSKU-001/,
  "Combined Order must visibly render Telesale SKU code TSKU-001",
);

state.sel.dates = [fixtureMeta.date];
assert.equal(filteredOrderRows().length, fixtureMeta.totalRows);
state.sel.ps = [fixtureMeta.ps];
assert.equal(filteredOrderRows().length, fixtureMeta.totalRows);
state.sel.orderStores = [fixtureMeta.receiver];
assert.equal(filteredOrderRows().length, fixtureMeta.teleRows);
assert.equal(
  filteredOrderRows().filter((row) => row.isTele).length,
  fixtureMeta.teleRows,
);
state.sel.orderStores = [];
state.sel.brands = ["Fixture Tele Brand"];
assert.equal(filteredOrderRows().length, fixtureMeta.teleRows);
state.sel.brands = [];
state.sel.types = ["INVC"];
assert.equal(filteredOrderRows().length, fixtureMeta.totalRows);
state.q = "TSKU-001";
assert.equal(filteredOrderRows().length, 1);
assert.equal(filteredOrderRows()[0].isTele, true);

const sharedKeyRows = [
  norm({
    InvoiceDate: "2026-07-16",
    InvoiceNo: "INV-PS-SHARED",
    SOTypeID: "INVC",
    SO_SalespersonID: "AYAPS999",
    CustomerName: "ร้าน PS",
    SKUCode: "SHARED-001",
    SKUDescription: "สินค้า Group Key ร่วม",
    GroupBrand: "Shared Brand",
    TAS_SizeGroup: "Shared Size",
    ShipQtyPCS: 10,
    LineAmtBeforeDisc: 100,
    InvoiceAmt: 90,
  }),
  norm({
    InvoiceDate: "2026-07-16",
    InvoiceNo: "INV-TELE-SHARED",
    SOTypeID: "INVC",
    SO_SalespersonID: "AYAPS999",
    TelesaleID: "TELE-SHARED",
    CustomerName: "ร้าน Telesale",
    SKUCode: "SHARED-001",
    SKUDescription: "สินค้า Group Key ร่วม",
    GroupBrand: "Shared Brand",
    TAS_SizeGroup: "Shared Size",
    ShipQtyPCS: 5,
    LineAmtBeforeDisc: 60,
    InvoiceAmt: 50,
  }),
];
assert.equal(sharedKeyRows[0].isTele, false);
assert.equal(sharedKeyRows[1].isTele, true);
const sharedKeyGroups = group(sharedKeyRows);
assert.equal(sharedKeyGroups.length, 1);
assert.equal(sharedKeyGroups[0].qty, 15);
assert.equal(sharedKeyGroups[0].rawAmt, 160);
assert.equal(sharedKeyGroups[0].netAmt, 140);
assert.ok(
  Math.abs(
    (sharedKeyGroups[0].netAmt || sharedKeyGroups[0].rawAmt) * 1.07 - 149.8,
  ) < 1e-9,
);

console.log("Pro regression modules passed:", fixture.expected);
