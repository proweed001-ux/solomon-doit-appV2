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
  MAX_REAL_BILL_PRINT_PAGES,
  MAX_REAL_BILL_PRINT_PARTS,
  realBillPagesHtml,
  realBillPrintStats,
} from "../dist/assets/pro/print.js";
import {
  buildRealBills,
  buildRealBillFacetIndex,
  createRealBillSelector,
  diagnoseRealBillKeys,
  filterRealBills,
  realBillCandidateRows,
  realBillKey,
  realBillPageModel,
  realBillPickerOptions,
  realBillsHtml,
  realBillStoreOptions,
  roundDisplayedNumber,
  selectRealBills,
  splitRealBillsForPrint,
} from "../dist/assets/pro/real-bills.js";
import {
  createSelection,
  HISTORY_MAX_BYTES,
  historyStats,
  loadState,
  mapVal,
  mergeSelection,
  push,
  rkey,
  restore,
  save,
  sk,
  snap,
  state,
  sumMap,
  trimHistory,
} from "../dist/assets/pro/state.js";

const fixture = JSON.parse(
  fs.readFileSync("scripts/fixtures/pro-regression-v1.json", "utf8"),
);
const appSource = fs.readFileSync("dist/assets/pro/app.js", "utf8");
const coreSource = fs.readFileSync("dist/assets/pro/core.js", "utf8");
const sendStoreSource = fs.readFileSync(
  "dist/assets/pro/send-store.js",
  "utf8",
);
const realBillSource = fs.readFileSync(
  "dist/assets/pro/real-bills.js",
  "utf8",
);
const printSource = fs.readFileSync("dist/assets/pro/print.js", "utf8");
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
for (const [kind, expected] of [
  ["ps", "PS001"],
  ["orderStores", "ร้าน TS"],
  ["brands", "Brand Match"],
  ["types", "TYPE-A"],
]) {
  const options = realBillPickerOptions(
    kind,
    realRows,
    createSelection(),
  );
  const found = options.find((item) => item.value === expected);
  assert.deepEqual(
    found,
    { value: expected, label: expected },
    `${kind} must preserve both the source value and visible label`,
  );
  assert.ok(
    options.every(
      (item, index) =>
        item.label !== String(index) || item.value === String(index),
    ),
    `${kind} labels must never become Array.map indexes`,
  );
}
const invoiceSearchSelection = createSelection();
const invoiceSearchBills = buildRealBills(realRows);
assert.deepEqual(
  realBillPickerOptions(
    "billStores",
    realRows,
    invoiceSearchSelection,
    invoiceSearchBills,
    " INV-TS-ONE ",
  ).map((item) => item.value),
  ["ร้าน TS"],
  "Store options must follow trimmed invoice search",
);
assert.deepEqual(
  realBillPickerOptions(
    "dates",
    realRows,
    invoiceSearchSelection,
    invoiceSearchBills,
    "INV-TS-ONE",
  ).map((item) => item.value),
  ["2026-07-03"],
);
assert.deepEqual(
  realBillPickerOptions(
    "ps",
    realRows,
    invoiceSearchSelection,
    invoiceSearchBills,
    "INV-TS-ONE",
  ).map((item) => item.value),
  ["PS001"],
);
assert.deepEqual(
  realBillPickerOptions(
    "orderStores",
    realRows,
    invoiceSearchSelection,
    invoiceSearchBills,
    "INV-TS-ONE",
  ).map((item) => item.value),
  ["ร้าน TS"],
);
assert.deepEqual(
  new Set(
    realBillPickerOptions(
      "brands",
      realRows,
      invoiceSearchSelection,
      invoiceSearchBills,
      "inv-ts-one",
    ).map((item) => item.value),
  ),
  new Set(["Brand Search", "Brand Other"]),
  "Brand options must follow case-insensitive invoice search",
);
assert.deepEqual(
  new Set(
    realBillPickerOptions(
      "types",
      realRows,
      invoiceSearchSelection,
      invoiceSearchBills,
      "ร้าน TS",
    ).map((item) => item.value),
  ),
  new Set(["TYPE-SEARCH", "TYPE-B", "TYPE-TS"]),
  "Type options must follow Thai store search",
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
assert.equal(selectorBuildCalls, 0);
assert.equal(cachedFirst, cachedSecond, "Filtered result must be reusable");
const cachedFirstPage = cachedSelector.pageResult(cachedFirst, 1);
assert.equal(selectorBuildCalls, 1);
assert.ok(cachedFirstPage.bills.length > 0);
assert.ok(cachedFirstPage.bills.length <= 12);
assert.equal(cachedSelector.pageResult(cachedFirst, 1), cachedFirstPage);
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
  "Filtering must not build full bill rows until a page is requested",
);
assert.equal(
  cachedSelector.stats().candidateBuilds,
  1,
  "Store, Brand, Type and Search must reuse the lightweight candidate",
);
cachedSelection.dates = ["2026-07-03"];
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
cachedSelection.ps = ["PS001"];
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
cachedSelection.orderStores = ["ร้านอื่น"];
cachedSelector.select(realRows, cachedSelection, "TS-SEARCH");
assert.equal(
  selectorBuildCalls,
  1,
  "Candidate invalidation must remain lightweight until rendering",
);
assert.equal(cachedSelector.stats().candidateBuilds, 4);

let mutableBuildCalls = 0;
const mutableSelector = createRealBillSelector((rows) => {
  mutableBuildCalls += 1;
  return buildRealBills(rows);
});
const mutableRows = [realRows[0]];
const mutableSelection = {
  ...createSelection(),
  billStores: ["ร้านร่วม"],
};
mutableSelector.select(mutableRows, mutableSelection, "");
mutableRows.push({
  ...realRows[4],
  store: "ร้านเพิ่มแบบ in-place",
  inv: "INV-IN-PLACE",
});
mutableSelection.billStores.push("ร้านเพิ่มแบบ in-place");
assert.equal(
  mutableSelector.select(mutableRows, mutableSelection, "").bills.length,
  2,
  "In-place rows and selection-array changes must not return stale bills",
);
assert.equal(mutableBuildCalls, 0);
const replacementRows = mutableRows.map((row) => ({ ...row }));
mutableSelector.select(replacementRows, mutableSelection, "");
assert.equal(
  mutableBuildCalls,
  0,
  "Replacing rows must not eagerly build full bills",
);
replacementRows[0] = { ...replacementRows[0], inv: "INV-VERSION-CHANGED" };
mutableSelector.select(replacementRows, mutableSelection, "", 2);
assert.equal(
  mutableBuildCalls,
  0,
  "A new rows version must invalidate without eagerly building full bills",
);

let optionBuildCalls = 0;
const optionSelector = createRealBillSelector((rows) => {
  optionBuildCalls += 1;
  return buildRealBills(rows);
});
const optionSelection = createSelection();
assert.deepEqual(
  optionSelector
    .pickerOptions(
      "brands",
      realRows,
      optionSelection,
      "INV-TS-ONE",
      1,
    )
    .map((item) => item.value)
    .sort(),
  ["Brand Other", "Brand Search"].sort(),
);
const optionStats = optionSelector.stats();
assert.equal(
  optionBuildCalls,
  0,
  "Picker options must use the lightweight facet index, not full bills",
);
optionSelector.pickerOptions(
  "brands",
  realRows,
  optionSelection,
  "INV-TS-ONE",
  1,
);
assert.equal(optionSelector.stats().pickerOptionsBuilds, optionStats.pickerOptionsBuilds);
assert.equal(optionSelector.stats().pickerOptionsCacheHits, 1);
optionSelector.pickerOptions(
  "brands",
  realRows,
  optionSelection,
  "INV-SAME",
  1,
);
assert.equal(
  optionSelector.stats().pickerOptionsBuilds,
  optionStats.pickerOptionsBuilds + 1,
  "Search changes must invalidate filtered picker options",
);
assert.equal(optionSelector.stats().moneyFormatCalls, 0);

for (const value of [
  0,
  1,
  -1,
  1.005,
  -1.005,
  2.675,
  -2.675,
  10.0049,
  10.005,
  10.0051,
  1234.56789,
  -1234.56789,
]) {
  assert.equal(
    roundDisplayedNumber(value, 2),
    Number(
      Number(value).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).replaceAll(",", ""),
    ),
    `Numeric rounding changed at ${value}`,
  );
}

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
const twentyFiveLineBill = buildRealBills(
  Array.from({ length: 25 }, (_, index) => ({
    ...realRows[0],
    code: "LONG-25-" + (index + 1),
    sku: "รายการ 25 แถว " + (index + 1),
  })),
)[0];
assert.deepEqual(
  splitRealBillsForPrint([twentyFiveLineBill], BILL_ROWS).map(
    (part) => part.lines.length,
  ),
  [12, 12, 1],
);
const realPrintHtml = realBillPagesHtml([longBill, tsSame]);
assert.equal((realPrintHtml.match(/class="a4Sheet"/g) || []).length, 2);
assert.equal(
  (realPrintHtml.match(/class="receiptPage realBillReceipt"/g) || []).length,
  3,
);
assert.match(realPrintHtml, /ต่อใบถัดไป \(1\/2\)/);
assert.match(realPrintHtml, /data-real-part="2\/2"/);
assert.doesNotMatch(realPrintHtml, /data-edit-key|PRINT_EDIT_KEY/);

const printable200 = Array.from({ length: 200 }, (_, index) => ({
  ...tsSame,
  key: "PRINT-" + index,
  lines: [tsSame.lines[0]],
}));
assert.deepEqual(realBillPrintStats([longBill, tsSame]), {
  bills: 2,
  parts: 3,
  pages: 2,
  lines: 14,
  allowed: true,
});
assert.equal(realBillPrintStats(printable200).parts, MAX_REAL_BILL_PRINT_PARTS);
assert.equal(realBillPrintStats(printable200).pages, MAX_REAL_BILL_PRINT_PAGES);
assert.equal(realBillPrintStats(printable200).allowed, true);
assert.equal(
  (realBillPagesHtml(printable200).match(/class="a4Sheet"/g) || [])
    .length,
  100,
  "The exact Real Bill print boundary must still render",
);
const blocked201 = realBillPrintStats([
  ...printable200,
  { ...tsSame, key: "PRINT-201", lines: [tsSame.lines[0]] },
]);
assert.equal(blocked201.parts, 201);
assert.equal(blocked201.pages, 101);
assert.equal(blocked201.allowed, false);
assert.equal(
  realBillPrintStats(
    Array.from({ length: 200 }, () => ({ lineCount: 12 })),
  ).allowed,
  true,
);
assert.equal(
  realBillPrintStats(
    Array.from({ length: 201 }, () => ({ lineCount: 12 })),
  ).allowed,
  false,
);
const lazyPrintSelector = createRealBillSelector();
const lazyPrintResult = lazyPrintSelector.select(
  realRows,
  { ...createSelection(), billStores: ["ร้านร่วม"] },
  "",
  1,
);
const lazyPrintPayload = lazyPrintSelector.printPayload(lazyPrintResult);
assert.equal(realBillPrintStats(lazyPrintPayload.bills).allowed, true);
assert.equal(lazyPrintSelector.stats().fullBillPrintBuilds, 0);
assert.ok(lazyPrintPayload.build().length > 0);
assert.equal(lazyPrintSelector.stats().fullBillPrintBuilds, 1);

const blankDateBill = buildRealBills([
  { ...realRows[7], date: "" },
])[0];
assert.match(
  realBillsHtml([blankDateBill]),
  /วันที่ -/,
  "A blank Real Bill date must not be presented as 'ทั้งหมด'",
);
const specialBill = buildRealBills([
  {
    ...realRows[0],
    store: "ร้าน <A&B>",
    inv: 'INV/"พิเศษ"',
    code: "MiXeD-001",
    sku: "สินค้า & พิเศษ",
  },
])[0];
assert.equal(
  filterRealBills([specialBill], createSelection(), " mixed-001 ").length,
  1,
);
assert.match(realBillsHtml([specialBill]), /ร้าน &lt;A&amp;B&gt;/);
const sameInvoiceDifferentPs = buildRealBills([
  { ...realRows[0], ps: "PS-A" },
  { ...realRows[0], ps: "PS-B", code: "PS-B-LINE" },
]);
assert.equal(
  sameInvoiceDifferentPs.length,
  1,
  "Current Bill Key intentionally does not split the same PS bill by PS",
);
assert.equal(sameInvoiceDifferentPs[0].lines.length, 2);
assert.deepEqual(
  [...sameInvoiceDifferentPs[0].psValues].sort(),
  ["PS-A", "PS-B"],
  "Full bills must retain every PS represented by the current Bill Key",
);
assert.equal(
  buildRealBills([
    { ...realRows[3], tele: "TELE-A" },
    { ...realRows[3], tele: "TELE-B" },
  ]).length,
  2,
  "Different Tele IDs must remain separate bills",
);

let fuzzSeed = 0x70;
const fuzzRandom = (limit) => {
  fuzzSeed = (Math.imul(fuzzSeed, 1664525) + 1013904223) >>> 0;
  return fuzzSeed % limit;
};
for (let caseNo = 0; caseNo < 500; caseNo += 1) {
  const caseRows = [];
  const sharedLines = 2 + fuzzRandom(5);
  for (let lineNo = 0; lineNo < sharedLines; lineNo += 1) {
    caseRows.push({
      isTele: false,
      tele: "",
      store: "FUZZ-STORE-" + (caseNo % 11),
      inv: "FUZZ-INV-" + caseNo,
      date: "2026-07-" + String((caseNo % 28) + 1).padStart(2, "0"),
      ps: "FUZZ-PS-" + fuzzRandom(4),
      code: "FUZZ-CODE-" + caseNo + "-" + lineNo,
      sku: "สินค้า Fuzz " + caseNo + " " + lineNo,
      brand: "FUZZ-BRAND-" + fuzzRandom(4),
      type: "FUZZ-TYPE-" + fuzzRandom(4),
      qty: 1,
      rawAmt: 10,
      netAmt: 9,
    });
  }
  caseRows.push({
    ...caseRows[0],
    isTele: true,
    tele: "FUZZ-TELE-" + caseNo,
    code: "FUZZ-TS-" + caseNo,
  });
  const lightBills = buildRealBillFacetIndex(caseRows);
  const fullBills = buildRealBills(caseRows);
  const fuzzSelection = {
    ...createSelection(),
    billStores: [caseRows[0].store],
    brands: [caseRows[fuzzRandom(sharedLines)].brand],
    types: [caseRows[fuzzRandom(sharedLines)].type],
  };
  for (const kind of [
    "dates",
    "ps",
    "orderStores",
    "billStores",
    "brands",
    "types",
  ]) {
    assert.deepEqual(
      realBillPickerOptions(
        kind,
        caseRows,
        fuzzSelection,
        lightBills,
        "",
      ),
      realBillPickerOptions(
        kind,
        caseRows,
        fuzzSelection,
        fullBills,
        "",
      ),
      `Lightweight/full ${kind} options diverged in fuzz case ${caseNo}`,
    );
  }
  for (const query of [
    caseRows[0].store,
    caseRows[0].inv,
    caseRows[0].code,
    caseRows[0].sku,
    "fuzz-tele-" + caseNo,
  ]) {
    assert.deepEqual(
      filterRealBills(lightBills, fuzzSelection, query).map(
        (bill) => bill.key,
      ),
      filterRealBills(fullBills, fuzzSelection, query).map(
        (bill) => bill.key,
      ),
      `Lightweight/full search diverged in fuzz case ${caseNo}`,
    );
  }
}

const keyDiagnostics = diagnoseRealBillKeys([
  { ...realRows[0], inv: "", ps: "PS-A" },
  { ...realRows[0], inv: "", ps: "PS-B" },
  { ...realRows[0], inv: 12345 },
  { ...realRows[0], store: "ร้าน|พิเศษ", inv: "INV|SPECIAL" },
  { ...realRows[0], inv: "SHARED-SOURCE" },
  {
    ...realRows[0],
    isTele: true,
    tele: "TELE-DIAG",
    inv: "SHARED-SOURCE",
  },
]);
assert.equal(keyDiagnostics.blankInvoiceRows, 2);
assert.equal(keyDiagnostics.blankInvoiceKeys, 1);
assert.equal(keyDiagnostics.multiPsKeys, 1);
assert.equal(keyDiagnostics.psTsInvoiceCollisions, 1);
assert.equal(keyDiagnostics.numericInvoiceRows, 1);
assert.equal(keyDiagnostics.specialDelimiterRows, 1);
assert.ok(
  Object.values(keyDiagnostics.examples)
    .flat()
    .every((value) => /^key-[a-z0-9]+$/.test(value)),
  "Bill Key diagnostics must expose masked examples only",
);

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
  1,
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
  1,
);
const selectedLargeElapsed = performance.now() - selectedLargeStart;
assert.equal(selectedLarge.bills.length, fixtureMeta.largeBills);
assert.equal(largeBuildCalls, 0);
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
const selectedLargePage = largeSelector.pageResult(selectedLarge, 1);
const largePage = selectedLargePage.pageModel;
assert.equal(largeBuildCalls, 1);
assert.equal(largePage.visibleBills.length, 12);
assert.equal(
  largePage.visibleRows,
  12 * fixtureMeta.largeLinesPerBill,
);
const clampedPage = realBillPageModel(selectedLarge.bills.slice(0, 13), 99);
assert.equal(clampedPage.currentPage, 2);
assert.equal(clampedPage.visibleBills.length, 1);
largeSelection.brands = ["PERF-BRAND-1"];
largeSelector.select(largeRealRows, largeSelection, "", 1);
largeSelection.types = ["PERF-TYPE-2"];
largeSelector.select(largeRealRows, largeSelection, "", 1);
largeSelector.select(largeRealRows, largeSelection, "PERF-SKU", 1);
assert.equal(largeBuildCalls, 1);
assert.equal(largeSelector.stats().candidateBuilds, 1);
const hugeRealRows = largeRealBillFixtureRows({
  rows: fixtureMeta.hugeRows,
  stores: fixtureMeta.hugeStores,
}).map(norm);
let hugeBuildCalls = 0;
const hugeSelector = createRealBillSelector((rows) => {
  hugeBuildCalls += 1;
  return buildRealBills(rows);
});
const hugeSelection = createSelection();
const hugePromptStart = performance.now();
hugeSelector.select(hugeRealRows, hugeSelection, "", 1);
const hugePromptMs = performance.now() - hugePromptStart;
hugeSelection.billStores = [
  ...new Set(hugeRealRows.map((row) => row.store)),
];
const hugeCandidateStart = performance.now();
const hugeResult = hugeSelector.select(
  hugeRealRows,
  hugeSelection,
  "",
  1,
);
const hugeCandidateMs = performance.now() - hugeCandidateStart;
assert.equal(hugeResult.bills.length, fixtureMeta.hugeBills);
assert.equal(hugeBuildCalls, 0);
assert.equal(realBillPageModel(hugeResult.bills, 999).visibleBills.length, 12);
assert.ok(hugePromptMs < 100);
assert.ok(
  hugeCandidateMs < 2000,
  `6,000-row candidate model took ${hugeCandidateMs.toFixed(2)} ms`,
);
const largePerformance = {
  rows: largeRealRows.length,
  bills: selectedLarge.bills.length,
  noSelectionMs: Number(noSelectionElapsed.toFixed(3)),
  candidateMs: Number(selectedLargeElapsed.toFixed(3)),
  renderedBills: largePage.visibleBills.length,
  renderedRows: largePage.visibleRows,
  builds: largeBuildCalls,
  hugeRows: hugeRealRows.length,
  hugeBills: hugeResult.bills.length,
  hugePromptMs: Number(hugePromptMs.toFixed(3)),
  hugeCandidateMs: Number(hugeCandidateMs.toFixed(3)),
  hugeBuilds: hugeBuildCalls,
};

function productionScaleRealRows() {
  const rowCount = 93_328;
  const storeCount = 7_106;
  const teleBills = 1_397;
  return Array.from({ length: rowCount }, (_, index) => {
    const isTele = index < teleBills;
    const storeNo = index % storeCount;
    const billNo = isTele ? index : Math.floor(index / 7);
    return {
      isTele,
      tele: isTele ? `TELE-${String(index).padStart(4, "0")}` : "",
      store: `ร้าน Scale ${String(storeNo).padStart(4, "0")}`,
      inv: `${isTele ? "TS" : "PS"}-INV-${String(billNo).padStart(6, "0")}`,
      date: `2026-07-${String((index % 28) + 1).padStart(2, "0")}`,
      ps: `PS-${String(index % 28).padStart(2, "0")}`,
      code: `SCALE-${index}`,
      sku: `สินค้า Scale ${index}`,
      brand: `BRAND-${index % 16}`,
      type: `TYPE-${index % 9}`,
      qty: (index % 5) + 1,
      rawAmt: 10.005 + (index % 23),
      netAmt: 9.005 + (index % 19),
    };
  });
}

const productionRows = productionScaleRealRows();
let productionFullBuilds = 0;
const productionSelector = createRealBillSelector((rows) => {
  productionFullBuilds += 1;
  return buildRealBills(rows);
});
const productionSelection = createSelection();
const productionNoSelectionStart = performance.now();
const productionPrompt = productionSelector.select(
  productionRows,
  productionSelection,
  "",
  1,
);
const productionNoSelectionMs =
  performance.now() - productionNoSelectionStart;
assert.equal(productionPrompt.requiresSelection, true);
assert.equal(productionFullBuilds, 0);
const productionPsStart = performance.now();
const productionPsOptions = productionSelector.pickerOptions(
  "ps",
  productionRows,
  productionSelection,
  "",
  1,
);
const productionPsMs = performance.now() - productionPsStart;
const productionStoreStart = performance.now();
const productionStoreOptions = productionSelector.pickerOptions(
  "billStores",
  productionRows,
  productionSelection,
  "",
  1,
);
const productionStoreMs = performance.now() - productionStoreStart;
assert.equal(productionPsOptions.length, 28);
assert.equal(productionStoreOptions.length, 7_106);
assert.equal(
  productionFullBuilds,
  0,
  "Production-scale facets must not build full bill lines",
);
assert.equal(
  productionSelector.stats().facetIndexBuilds,
  2,
  "Oversized facet indexes are recomputed instead of retained",
);
assert.equal(productionSelector.stats().moneyFormatCalls, 0);
assert.ok(productionSelector.stats().optionCacheEntries <= 8);
assert.ok(productionSelector.stats().optionCacheValues <= 20_000);
assert.ok(productionSelector.stats().facetIndexCacheEntries <= 4);
assert.ok(
  productionSelector.stats().facetIndexCacheValues <= 20_000,
  "Oversized production facet indexes must not be retained in cache",
);

let productionAllBuilds = 0;
const productionAllSelector = createRealBillSelector((rows) => {
  productionAllBuilds += 1;
  return buildRealBills(rows);
});
const productionAllSelection = {
  ...createSelection(),
  billStores: productionStoreOptions.map((item) => item.value),
};
const productionAllStart = performance.now();
const productionAllResult = productionAllSelector.select(
  productionRows,
  productionAllSelection,
  "",
  1,
);
const productionAllApplyMs = performance.now() - productionAllStart;
assert.equal(productionAllSelection.billStores.length, 7_106);
assert.equal(productionAllResult.bills.length, productionRows.length);
assert.equal(productionAllBuilds, 0);
assert.equal(productionAllSelector.stats().candidateBuilds, 1);
const productionAllPage = productionAllSelector.pageResult(
  productionAllResult,
  1,
);
assert.equal(productionAllBuilds, 1);
assert.equal(productionAllPage.bills.length, 12);
assert.equal(
  productionAllSelector.stats().matchedLightBills,
  productionRows.length,
);
assert.equal(productionAllSelector.stats().fullBillPageBuilds, 1);
assert.equal(productionAllSelector.stats().fullBillPrintBuilds, 0);
const productionPrintPayload =
  productionAllSelector.printPayload(productionAllResult);
const productionPrintPreflight = realBillPrintStats(
  productionPrintPayload.bills,
);
assert.equal(productionPrintPreflight.allowed, false);
assert.equal(
  productionAllSelector.stats().fullBillPrintBuilds,
  0,
  "Print preflight must not build full bills when over the limit",
);
assert.equal(
  productionAllSelector.stats().fullBillRowsBuilt,
  12,
  "Select-all must build full rows only for the visible page",
);
assert.ok(
  productionAllApplyMs < 1_500 &&
    productionAllApplyMs < 5_380.166 * 0.7,
  `Select-all production apply took ${productionAllApplyMs.toFixed(2)} ms`,
);

productionSelection.billStores = [productionStoreOptions[0].value];
const productionApplyStart = performance.now();
const productionResult = productionSelector.select(
  productionRows,
  productionSelection,
  "",
  1,
);
const productionApplyMs = performance.now() - productionApplyStart;
assert.ok(productionResult.bills.length > 0);
assert.equal(productionFullBuilds, 0);
productionSelection.brands = ["BRAND-1"];
productionSelector.select(productionRows, productionSelection, "", 1);
productionSelection.types = ["TYPE-2"];
productionSelector.select(productionRows, productionSelection, "", 1);
productionSelector.select(productionRows, productionSelection, "สินค้า scale", 1);
assert.equal(
  productionFullBuilds,
  0,
  "Distinct filters must stay lightweight until a page is rendered",
);
assert.equal(
  productionSelector.stats().candidateBuilds,
  1,
  "Bill store, Brand, Type and Search must reuse the lightweight candidate",
);

const cacheSelector = createRealBillSelector();
for (let index = 0; index < 100; index += 1) {
  cacheSelector.pickerOptions(
    "brands",
    realRows,
    createSelection(),
    "CACHE-" + index,
    1,
  );
}
assert.ok(cacheSelector.stats().optionCacheEntries <= 8);
assert.ok(cacheSelector.stats().optionCacheValues <= 20_000);
for (let index = 0; index < 10; index += 1) {
  cacheSelector.pickerOptions(
    "billStores",
    realRows,
    {
      ...createSelection(),
      dates: [
        "2026-07-" + String(index + 1).padStart(2, "0"),
      ],
    },
    "",
    1,
  );
}
assert.ok(cacheSelector.stats().facetIndexCacheEntries <= 4);
assert.ok(cacheSelector.stats().facetIndexCacheValues <= 20_000);
cacheSelector.invalidate();
assert.equal(cacheSelector.stats().optionCacheEntries, 0);
assert.equal(cacheSelector.stats().optionCacheValues, 0);
assert.equal(cacheSelector.stats().facetIndexCacheEntries, 0);
assert.equal(cacheSelector.stats().facetIndexCacheValues, 0);

assert.ok(
  buildRealBillFacetIndex(productionRows).every(
    (bill) => !("lines" in bill) && !("shownRaw" in bill),
  ),
  "Lightweight facets must not allocate full lines or formatted totals",
);
const productionPerformance = {
  rows: productionRows.length,
  stores: productionStoreOptions.length,
  ps: productionPsOptions.length,
  noSelectionMs: Number(productionNoSelectionMs.toFixed(3)),
  psPopupMs: Number(productionPsMs.toFixed(3)),
  storePopupMs: Number(productionStoreMs.toFixed(3)),
  applyMs: Number(productionApplyMs.toFixed(3)),
  selectAllApplyMs: Number(productionAllApplyMs.toFixed(3)),
  selectAllBills: productionAllResult.bills.length,
  selectAllBuilds: productionAllBuilds,
  selectAllFullRowsBuilt:
    productionAllSelector.stats().fullBillRowsBuilt,
  selectAllPageBuilds:
    productionAllSelector.stats().fullBillPageBuilds,
  selectAllPrintBuilds:
    productionAllSelector.stats().fullBillPrintBuilds,
  selectAllPrintParts: productionPrintPreflight.parts,
  fullBuilds: productionFullBuilds,
  ...productionSelector.stats(),
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

state.hist = [];
state.redoStack = [];
state.sel.billStores = productionStoreOptions.map((item) => item.value);
for (let index = 0; index < 100; index += 1) {
  state.q = "history-" + index;
  push();
}
const boundedHistory = historyStats();
assert.ok(boundedHistory.historyEntries <= 80);
assert.ok(boundedHistory.totalBytes <= HISTORY_MAX_BYTES);
assert.ok(boundedHistory.historyEntries >= 1);
const latestHistorySnapshot = state.hist.at(-1);
state.sel.billStores = [];
assert.equal(restore(latestHistorySnapshot), true);
assert.equal(state.sel.billStores.length, 7_106);
state.redoStack.push(snap());
trimHistory();
assert.ok(historyStats().totalBytes <= HISTORY_MAX_BYTES);
state.hist = ["x".repeat(HISTORY_MAX_BYTES + 1)];
state.redoStack = [];
trimHistory();
assert.ok(
  historyStats().totalBytes <= HISTORY_MAX_BYTES,
  "A single oversized snapshot must not bypass the history hard limit",
);
assert.equal(state.hist.length, 0);

delete globalThis.localStorage;

assert.match(proHtmlSource, /<button class="tab">บิลจริง<\/button/);
assert.doesNotMatch(proHtmlSource, /ใบส่งร้านจริง/);
assert.doesNotMatch(coreSource, /ใบส่งร้านจริง/);
assert.match(coreSource, /ship: "บิลจริง"/);
assert.match(coreSource, /state\.sel = createSelection\(\)/);
assert.doesNotMatch(coreSource, /state\.sel = \{\s*dates:/);
assert.match(
  coreSource,
  /realBillSelector\.printPayload\(realBillResult\)/,
  "Real Bill print must receive a lazy payload for every filtered bill",
);
assert.ok(
  printSource.indexOf("realBillPrintStats(sourceBills)") <
    printSource.indexOf("realBillPrint.build()"),
  "Real Bill print limits must be checked before building or appending print HTML",
);
assert.ok(
  printSource.includes(
    'if (document.querySelector(".printOverlay.realBillPrint")) return false',
  ),
  "Repeated Real Bill print actions must not append duplicate overlays",
);
assert.doesNotMatch(
  coreSource,
  /setTimeout\(/,
  "Real Bill performance must not be hidden behind setTimeout",
);
assert.doesNotMatch(
  sendStoreSource,
  /setTimeout\(/,
  "Quantity commit and navigation must not depend on setTimeout",
);
assert.match(
  sendStoreSource,
  /export function commitPendingQuantityEdit/,
  "State-changing commands must be able to flush the active quantity edit",
);
assert.match(
  sendStoreSource,
  /input\.onblur\s*=/,
  "Blur must explicitly finish the quantity edit session",
);
assert.match(
  sendStoreSource,
  /input\.onkeydown[\s\S]*event\.preventDefault\(\)[\s\S]*finishEdit\(input,[\s\S]*focusTarget\(moveTarget\)/,
  "Handled Enter and Tab keys must move focus once even when the value is unchanged",
);
assert.doesNotMatch(
  sendStoreSource,
  /committed\s*\|\|\s*input\.matches\(SEND_SELECTOR\)/,
  "Quantity navigation must not depend on whether the edit committed",
);
assert.match(
  sendStoreSource,
  /const changed = input\.value !== session\.beforeValue;[\s\S]*session\.changed = changed;/,
  "Quantity edit sessions must return to unchanged when the final value equals the original value",
);
assert.match(
  sendStoreSource,
  /session\.callbacks\.onRevert\?\./,
  "No-op quantity edits must restore their history checkpoint",
);
assert.match(
  stateSource,
  /export function restoreHistoryCheckpoint\(checkpoint\)/,
  "State owner must restore History and Redo after a no-op edit",
);
assert.match(
  sendStoreSource,
  /pointerdown[\s\S]*restorePointerTarget[\s\S]*queueMicrotask/,
  "Direct pointer navigation must restore the tapped quantity after render",
);
assert.match(
  coreSource,
  /onEditStart:\s*\(\)\s*=>\s*push\(\)/,
  "A quantity edit must snapshot history before its first state mutation",
);
assert.match(
  coreSource,
  /onInput:[\s\S]*state\[input\.dataset\.map\]\[input\.dataset\.k\]\s*=\s*N\(input\.value\)/,
  "Input must update the authoritative quantity state",
);
const billLineSource =
  realBillSource.match(/function billLine[\s\S]*?\n\}/)?.[0] || "";
assert.doesNotMatch(
  billLineSource,
  /\b(?:B|F)\(|toLocaleString\(/,
  "Real Bill model must not format money or quantity per source row",
);
assert.doesNotMatch(
  filterRealBills.toString(),
  /\.includes\(/,
  "Bill facet membership must use prebuilt Sets, not array membership per bill",
);
assert.doesNotMatch(
  realBillCandidateRows.toString(),
  /\.includes\(/,
  "Candidate row membership must use prebuilt Sets",
);
const coreRenderSource = coreSource.match(
  /function render\(startedAt[\s\S]*?\n  \}\n  function loadData/,
)?.[0] || "";
assert.doesNotMatch(
  coreRenderSource,
  /pickPool\(\)/,
  "Full render must use the summary cache instead of rebuilding pickPool",
);
assert.match(
  coreRenderSource,
  /if \(\$\("#teleDrawer"\)\?\.classList\.contains\("on"\)\) renderTele\(\)/,
  "Closed Telesale drawer must not be rendered during every full render",
);
assert.match(
  coreRenderSource,
  /summaryHead\.hidden = shipMode/,
  "Ship mode must hide the legacy summary heading",
);
assert.match(
  coreRenderSource,
  /summaryCards\.hidden = shipMode/,
  "Ship mode must hide legacy amount/done/remain cards",
);
assert.equal(
  (coreRenderSource.match(/\.reduce\(/g) || []).length,
  0,
  "Full render must not repeat summary reductions",
);

console.log("Pro regression modules passed:", {
  ...fixture.expected,
  realBillPerformance: largePerformance,
  productionScalePerformance: productionPerformance,
});
