import assert from "node:assert/strict";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
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
  largeRealBillFixtureRows,
} from "./fixtures/pro-browser-fixture.mjs";
import {
  BILL_ROWS,
  BILLS_PER_A4,
  buildBills,
  doneSummary,
  lineVal,
} from "../dist/assets/pro/print-model.js";
import {
  billPagesHtml,
  realBillPagesHtml,
} from "../dist/assets/pro/print.js";
import {
  buildRealBills,
  createRealBillSelector,
  filterRealBills,
  realBillCandidateRows,
  realBillKey,
  realBillPageModel,
  realBillPickerOptions,
  realBillsHtml,
  realBillStoreOptions,
  selectRealBills,
  splitRealBillsForPrint,
} from "../dist/assets/pro/real-bills.js";
import {
  createSelection,
  loadState,
  mapVal,
  mergeSelection,
  rkey,
  restore,
  save,
  sk,
  snap,
  state,
  sumMap,
} from "../dist/assets/pro/state.js";

const fixture = JSON.parse(
  fs.readFileSync("scripts/fixtures/pro-regression-v1.json", "utf8"),
);
const appSource = fs.readFileSync("dist/assets/pro/app.js", "utf8");
const coreSource = fs.readFileSync("dist/assets/pro/core.js", "utf8");
const proHtmlSource = fs.readFileSync("dist/pro.html", "utf8");

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
assert.match(
  renderedOrderBody,
  /data-print-value="สินค้า Telesale 001"/,
  "Combined Order product cell must expose the product name for printing",
);
assert.match(
  renderedOrderBody,
  new RegExp(`data-print-value="${fixtureMeta.numericProductName}"`),
  "Combined Order print value must preserve numbers inside the product name",
);
assert.match(
  renderedOrderBody,
  new RegExp(`<small>${fixtureMeta.numericProductCode}</small>`),
  "Combined Order screen must keep the separate numeric product code visible",
);

state.sel.dates = [fixtureMeta.date];
assert.equal(filteredOrderRows().length, fixtureMeta.totalRows);
state.sel.ps = [fixtureMeta.ps];
assert.equal(filteredOrderRows().length, fixtureMeta.totalRows);
state.sel.orderStores = [fixtureMeta.receiver];
assert.equal(filteredOrderRows().length, fixtureMeta.teleRows - 1);
assert.equal(
  filteredOrderRows().filter((row) => row.isTele).length,
  fixtureMeta.teleRows - 1,
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

const realRows = [
  {
    isTele: false,
    tele: "",
    store: "ร้านร่วม",
    inv: "INV-SAME",
    date: "2026-07-01",
    ps: "PS001",
    code: "DUP-001",
    sku: "สินค้าซ้ำต้นฉบับ",
    brand: "Brand Match",
    type: "TYPE-A",
    qty: 1,
    rawAmt: 10,
    netAmt: 9,
  },
  {
    isTele: false,
    tele: "",
    store: "ร้านร่วม",
    inv: "INV-SAME",
    date: "2026-07-01",
    ps: "PS001",
    code: "DUP-001",
    sku: "สินค้าซ้ำต้นฉบับ",
    brand: "Brand Other",
    type: "TYPE-B",
    qty: 2,
    rawAmt: 20,
    netAmt: 18,
  },
  {
    isTele: false,
    tele: "",
    store: "ร้านร่วม",
    inv: "INV-PS-SECOND",
    date: "2026-07-02",
    ps: "PS001",
    code: "PS-SECOND",
    sku: "บิล PS ใบที่สอง",
    brand: "Brand Match",
    type: "TYPE-A",
    qty: 3,
    rawAmt: 30,
    netAmt: 27,
  },
  {
    isTele: true,
    tele: "TELE-SAME",
    store: "ร้านร่วม",
    inv: "INV-SAME",
    date: "2026-07-01",
    ps: "PS001",
    code: "TS-SAME",
    sku: "บิล TS เลขเดียวกับ PS",
    brand: "Brand Tele",
    type: "TYPE-TS",
    qty: 4,
    rawAmt: 40,
    netAmt: 36,
  },
  {
    isTele: true,
    tele: "TELE-B",
    store: "ร้าน TS",
    inv: "INV-TS-ONE",
    date: "2026-07-03",
    ps: "PS001",
    code: "TS-SEARCH",
    sku: "สินค้าที่ใช้ค้นหา",
    brand: "Brand Search",
    type: "TYPE-SEARCH",
    qty: 5,
    rawAmt: 50,
    netAmt: 45,
  },
  {
    isTele: true,
    tele: "TELE-B",
    store: "ร้าน TS",
    inv: "INV-TS-ONE",
    date: "2026-07-03",
    ps: "PS001",
    code: "TS-FULL",
    sku: "รายการอื่นในบิลเดียวกัน",
    brand: "Brand Other",
    type: "TYPE-B",
    qty: 6,
    rawAmt: 60,
    netAmt: 54,
  },
  {
    isTele: true,
    tele: "TELE-B",
    store: "ร้าน TS",
    inv: "INV-TS-TWO",
    date: "2026-07-04",
    ps: "PS001",
    code: "TS-TWO",
    sku: "บิล TS ใบที่สอง",
    brand: "Brand Tele",
    type: "TYPE-TS",
    qty: 7,
    rawAmt: 70,
    netAmt: 63,
  },
  {
    isTele: false,
    tele: "",
    store: "ร้านไม่มีเลขบิล",
    inv: "",
    date: "2026-07-05",
    ps: "PS001",
    code: "NO-INV",
    sku: "สินค้าไม่มีเลขบิล",
    brand: "Brand Blank",
    type: "TYPE-BLANK",
    qty: 8,
    rawAmt: 80,
    netAmt: 72,
  },
];
const realSelection = createSelection();
const candidateRealRows = realBillCandidateRows(realRows, realSelection);
const realBills = buildRealBills(candidateRealRows);
assert.equal(realBills.length, 6, "Real bills must stay separated by bill key");
assert.equal(
  new Set(realBills.map((bill) => bill.key)).size,
  realBills.length,
);
const psSame = realBills.find(
  (bill) => bill.sourceType === "PS" && bill.inv === "INV-SAME",
);
const tsSame = realBills.find(
  (bill) => bill.sourceType === "TS" && bill.inv === "INV-SAME",
);
assert.ok(psSame && tsSame, "PS and TS with the same invoice must both exist");
assert.notEqual(psSame.key, tsSame.key);
assert.equal(psSame.lines.length, 2, "Duplicate source lines must not be grouped");
assert.deepEqual(
  psSame.lines.map((line) => line.sourceIndex),
  [0, 1],
  "Source line order must be preserved",
);
assert.equal(psSame.qty, 3);
assert.equal(psSame.raw, 30);
assert.equal(psSame.vat, 28.89);
assert.equal(
  realBillKey(realRows[0]).split("\u001f").length,
  5,
  "Bill key must contain source, store, invoice, date and tele",
);
const noInvoice = realBills.find((bill) => bill.store === "ร้านไม่มีเลขบิล");
assert.equal(noInvoice.displayInv, "-");
assert.equal(noInvoice.inv, "");

const storeOptions = realBillStoreOptions(realRows, realSelection);
assert.deepEqual(
  storeOptions.find((item) => item.value === "ร้านร่วม"),
  { value: "ร้านร่วม", label: "ร้านร่วม (PS+TS)" },
);
assert.deepEqual(
  storeOptions.find((item) => item.value === "ร้าน TS"),
  { value: "ร้าน TS", label: "ร้าน TS (TS)" },
);
assert.ok(
  storeOptions.every(
    (item) => !item.value.includes("(TS)") && !item.value.includes("(PS+TS)"),
  ),
);
assert.deepEqual(
  realBillPickerOptions("billStores", realRows, realSelection),
  storeOptions,
);

realSelection.billStores = ["ร้านร่วม"];
assert.equal(filterRealBills(realBills, realSelection, "").length, 3);
realSelection.billStores = ["ร้านร่วม", "ร้าน TS"];
assert.equal(filterRealBills(realBills, realSelection, "").length, 5);
realSelection.billStores = [];
const searchedRealBills = filterRealBills(realBills, realSelection, "TS-SEARCH");
assert.equal(searchedRealBills.length, 1);
assert.equal(
  searchedRealBills[0].lines.length,
  2,
  "Search must keep every source line in the matching bill",
);
realSelection.billStores = ["ร้านร่วม"];
realSelection.brands = ["Brand Match"];
const brandMatched = filterRealBills(realBills, realSelection, "");
assert.equal(brandMatched.length, 2);
assert.equal(
  brandMatched.find((bill) => bill.inv === "INV-SAME").lines.length,
  2,
  "Brand filter must retain the full bill",
);
realSelection.brands = [];
realSelection.types = ["TYPE-A"];
assert.equal(
  filterRealBills(realBills, realSelection, "").find(
    (bill) => bill.inv === "INV-SAME",
  ).lines.length,
  2,
  "Type filter must retain the full bill",
);
const emptyRealSelection = createSelection();
let earlyBuildCalls = 0;
assert.equal(
  selectRealBills(
    realRows,
    emptyRealSelection,
    "",
    (rows) => {
      earlyBuildCalls += 1;
      return buildRealBills(rows);
    },
  ).bills.length,
  0,
);
assert.equal(
  earlyBuildCalls,
  0,
  "Selection-required state must return before building bill models",
);
assert.equal(
  selectRealBills(realRows, emptyRealSelection, "").requiresSelection,
  true,
);
assert.doesNotMatch(
  realBillsHtml([], true),
  /class="realBill"/,
  "Selection-required state must not pre-render bill cards",
);
assert.equal(
  selectRealBills(realRows, emptyRealSelection, "ร้าน TS").bills.length,
  2,
);

const facetSelection = createSelection();
facetSelection.billStores = ["ร้านร่วม"];
facetSelection.brands = ["Brand Match"];
facetSelection.types = ["TYPE-B"];
const crossFacetBills = filterRealBills(
  realBills,
  facetSelection,
  "",
);
assert.equal(crossFacetBills.length, 1);
assert.equal(crossFacetBills[0].inv, "INV-SAME");
assert.equal(
  crossFacetBills[0].lines.length,
  2,
  "Brand and Type may match different source lines in the same full bill",
);
assert.equal(crossFacetBills[0].qty, 3);
assert.equal(crossFacetBills[0].raw, 30);
const brandOptions = realBillPickerOptions(
  "brands",
  realRows,
  {
    ...createSelection(),
    billStores: ["ร้านร่วม"],
    types: ["TYPE-B"],
  },
  realBills,
);
assert.ok(brandOptions.some((item) => item.value === "Brand Match"));
const typeOptions = realBillPickerOptions(
  "types",
  realRows,
  {
    ...createSelection(),
    billStores: ["ร้านร่วม"],
    brands: ["Brand Match"],
  },
  realBills,
);
assert.ok(typeOptions.some((item) => item.value === "TYPE-B"));

let selectorBuildCalls = 0;
const cachedSelector = createRealBillSelector((rows) => {
  selectorBuildCalls += 1;
  return buildRealBills(rows);
});
const cachedSelection = {
  ...createSelection(),
  billStores: ["ร้านร่วม"],
};
const cachedFirst = cachedSelector.select(realRows, cachedSelection, "");
const cachedSecond = cachedSelector.select(realRows, cachedSelection, "");
assert.equal(selectorBuildCalls, 1);
assert.equal(cachedFirst, cachedSecond, "Filtered result must be reusable");
cachedSelection.billStores = ["ร้าน TS"];
cachedSelector.select(realRows, cachedSelection, "");
cachedSelection.brands = ["Brand Search"];
cachedSelector.select(realRows, cachedSelection, "");
cachedSelection.types = ["TYPE-B"];
cachedSelector.select(realRows, cachedSelection, "");
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
assert.equal(
  selectorBuildCalls,
  1,
  "Store, Brand, Type and Search must reuse the candidate bill model",
);
cachedSelection.dates = ["2026-07-03"];
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
cachedSelection.ps = ["PS001"];
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
cachedSelection.orderStores = ["ร้านอื่น"];
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
assert.equal(
  selectorBuildCalls,
  4,
  "Dates, PS and orderStores must invalidate the candidate model",
);

const longBill = buildRealBills(
  Array.from({ length: 13 }, (_, index) => ({
    ...realRows[0],
    code: "LONG-" + (index + 1),
    sku: "รายการยาว " + (index + 1),
  })),
)[0];
const realParts = splitRealBillsForPrint([longBill, tsSame], BILL_ROWS);
assert.deepEqual(realParts.map((part) => part.lines.length), [12, 1, 1]);
assert.deepEqual(realParts.map((part) => part.partNo), [1, 2, 1]);
assert.equal(realParts[0].isLastPart, false);
assert.equal(realParts[1].isLastPart, true);
const realPrintHtml = realBillPagesHtml([longBill, tsSame]);
assert.equal((realPrintHtml.match(/class="a4Sheet"/g) || []).length, 2);
assert.equal(
  (realPrintHtml.match(/class="receiptPage realBillReceipt"/g) || []).length,
  3,
);
assert.match(realPrintHtml, /ต่อใบถัดไป \(1\/2\)/);
assert.match(realPrintHtml, /data-real-part="2\/2"/);
assert.doesNotMatch(realPrintHtml, /data-edit-key|PRINT_EDIT_KEY/);

const largeRealRows = largeRealBillFixtureRows().map(norm);
let largeBuildCalls = 0;
const largeSelector = createRealBillSelector((rows) => {
  largeBuildCalls += 1;
  return buildRealBills(rows);
});
const largeSelection = createSelection();
const noSelectionStart = performance.now();
const noSelectionLarge = largeSelector.select(
  largeRealRows,
  largeSelection,
  "",
);
const noSelectionElapsed = performance.now() - noSelectionStart;
assert.equal(noSelectionLarge.requiresSelection, true);
assert.equal(largeBuildCalls, 0);
assert.ok(
  noSelectionElapsed < 100,
  `Selection-required large fixture took ${noSelectionElapsed.toFixed(2)} ms`,
);
largeSelection.billStores = [
  ...new Set(largeRealRows.map((row) => row.store)),
];
const selectedLargeStart = performance.now();
const selectedLarge = largeSelector.select(
  largeRealRows,
  largeSelection,
  "",
);
const selectedLargeElapsed = performance.now() - selectedLargeStart;
assert.equal(selectedLarge.bills.length, fixtureMeta.largeBills);
assert.equal(largeBuildCalls, 1);
assert.ok(
  selectedLargeElapsed < 1500,
  `Large candidate model took ${selectedLargeElapsed.toFixed(2)} ms`,
);
assert.ok(
  realBillPickerOptions(
    "brands",
    largeRealRows,
    largeSelection,
    selectedLarge.allBills,
  ).some((item) => item.value === "PERF-BRAND-0"),
  "Brand options must remain available with every bill store selected",
);
const largePage = realBillPageModel(selectedLarge.bills, 1);
assert.equal(largePage.visibleBills.length, 12);
assert.equal(
  largePage.visibleRows,
  12 * fixtureMeta.largeLinesPerBill,
);
largeSelection.brands = ["PERF-BRAND-1"];
largeSelector.select(largeRealRows, largeSelection, "");
largeSelection.types = ["PERF-TYPE-2"];
largeSelector.select(largeRealRows, largeSelection, "");
largeSelector.select(largeRealRows, largeSelection, "PERF-SKU");
assert.equal(largeBuildCalls, 1);
const largePerformance = {
  rows: largeRealRows.length,
  bills: selectedLarge.bills.length,
  noSelectionMs: Number(noSelectionElapsed.toFixed(3)),
  candidateMs: Number(selectedLargeElapsed.toFixed(3)),
  renderedBills: largePage.visibleBills.length,
  renderedRows: largePage.visibleRows,
  builds: largeBuildCalls,
};

assert.deepEqual(mergeSelection({ receivers: ["ร้านเดิม"] }), {
  dates: [],
  ps: [],
  orderStores: [],
  receivers: ["ร้านเดิม"],
  billStores: [],
  brands: [],
  types: [],
});
const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
  clear: () => memory.clear(),
};
state.key = "legacy-state";
assert.equal(
  restore(
    JSON.stringify({
      sel: { receivers: ["ร้านเดิม"], dates: ["2026-07-01"] },
      mode: "pick",
    }),
  ),
  true,
);
assert.deepEqual(state.sel.billStores, []);
assert.deepEqual(state.sel.receivers, ["ร้านเดิม"]);
state.sel.billStores = ["ร้าน TS"];
const billStoreSnapshot = snap();
state.sel.billStores = [];
restore(billStoreSnapshot);
assert.deepEqual(state.sel.billStores, ["ร้าน TS"], "Undo/redo snapshots must retain billStores");
save();
state.sel = createSelection();
loadState();
assert.deepEqual(state.sel.billStores, ["ร้าน TS"], "Autosave/reload must retain billStores");
assert.equal(sk(), "doit-core-unified-v1:legacy-state");
delete globalThis.localStorage;

assert.match(proHtmlSource, /<button class="tab">บิลจริง<\/button/);
assert.doesNotMatch(proHtmlSource, /ใบส่งร้านจริง/);
assert.doesNotMatch(coreSource, /ใบส่งร้านจริง/);
assert.match(coreSource, /ship: "บิลจริง"/);
assert.match(coreSource, /state\.sel = createSelection\(\)/);
assert.doesNotMatch(coreSource, /state\.sel = \{\s*dates:/);
assert.match(
  coreSource,
  /state\.mode === "ship" \? currentRealBillResult\(\)\.bills : undefined/,
  "Real Bill print must receive every filtered bill, not the visible page",
);
assert.doesNotMatch(
  coreSource,
  /setTimeout\(/,
  "Real Bill performance must not be hidden behind setTimeout",
);

console.log("Pro regression modules passed:", {
  ...fixture.expected,
  realBillPerformance: largePerformance,
});
