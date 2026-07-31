import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

export const fixtureMeta = {
  date: "2026-07-15",
  ps: "AYAPS999",
  receiver: "ร้านทดสอบ A",
  normalRows: 26,
  teleRows: 21,
  totalRows: 47,
  normalQty: 260,
  teleQty: 21,
  orderQty: 281,
  rawAmount: 2951,
  netAmount: 2691,
  vatAmount: 2879.37,
  orderRawAmount: 3602,
  orderNetAmount: 3300,
  orderVatAmount: 3531,
  orderGroups: 47,
  sentRows: 25,
  sentQty: 25,
  printStoreTotal: 275,
  printBills: 3,
  a4Sheets: 2,
  numericProductName: "DN ปรับผ้านุ่ม 3in1 100MLx60",
  numericProductCode: "80880592",
  realPsTsStore: "ร้านทดสอบ A",
  realTsStore: "ร้าน Telesale รวม",
  realBulkInvoice: "INV-N-BULK",
  realTsInvoice: "INV-T-GROUP",
  realTsSecondInvoice: "INV-T-SECOND",
  realTsTele: "TELE-GROUP",
  telesaleBills: 20,
  largeRows: 3000,
  largeTeleRows: 1500,
  largeBills: 600,
  largeStores: 60,
  largeLinesPerBill: 5,
  hugeRows: 6000,
  hugeTeleRows: 3000,
  hugeBills: 1200,
  hugeStores: 120,
};

export function browserFixtureRows() {
  const normal = Array.from({ length: fixtureMeta.normalRows }, (_, index) => {
    const number = index + 1;
    return {
      InvoiceDate: fixtureMeta.date,
      InvoiceNo:
        number <= 13
          ? fixtureMeta.realBulkInvoice
          : `INV-N-${String(number).padStart(3, "0")}`,
      SOTypeID: "INVC",
      SO_SalespersonID: fixtureMeta.ps,
      CustomerName: fixtureMeta.receiver,
      SKUCode: `SKU-${String(number).padStart(3, "0")}`,
      SKUDescription: `สินค้า Fixture ${String(number).padStart(3, "0")}`,
      GroupBrand: "Fixture Brand",
      TAS_SizeGroup: "Fixture Size",
      ShipQtyPCS: 10,
      LineAmtBeforeDisc: 100 + number,
      InvoiceAmt: 90 + number,
    };
  });
  const telesale = Array.from({ length: fixtureMeta.teleRows }, (_, index) => {
    const number = index + 1;
    return {
      InvoiceDate: fixtureMeta.date,
      InvoiceNo:
        number <= 2
          ? fixtureMeta.realTsInvoice
          : number === 3
            ? fixtureMeta.realTsSecondInvoice
            : number === 4
              ? fixtureMeta.realBulkInvoice
              : `INV-T-${String(number).padStart(3, "0")}`,
      SOTypeID: "INVC",
      SO_SalespersonID: fixtureMeta.ps,
      TelesaleID:
        number <= 3
          ? fixtureMeta.realTsTele
          : number === 4
            ? "TELE-PS-TS"
            : `TELE-${String(number).padStart(3, "0")}`,
      CustomerName:
        number <= 3
          ? fixtureMeta.realTsStore
          : number === 4
            ? fixtureMeta.realPsTsStore
            : `ร้าน Tele ${String(number).padStart(3, "0")}`,
      SKUCode:
        number === 2
          ? fixtureMeta.numericProductCode
          : `TSKU-${String(number).padStart(3, "0")}`,
      SKUDescription:
        number === 2
          ? fixtureMeta.numericProductName
          : `สินค้า Telesale ${String(number).padStart(3, "0")}`,
      GroupBrand: "Fixture Tele Brand",
      TAS_SizeGroup: "Fixture Tele Size",
      ShipQtyPCS: 1,
      LineAmtBeforeDisc: 20 + number,
      InvoiceAmt: 18 + number,
    };
  });
  return [...normal, ...telesale];
}

export function largeRealBillFixtureRows({
  rows = fixtureMeta.largeRows,
  stores = fixtureMeta.largeStores,
} = {}) {
  const storeDigits = Math.max(2, String(Math.max(0, stores - 1)).length);
  return Array.from({ length: rows }, (_, index) => {
    const bill = Math.floor(index / fixtureMeta.largeLinesPerBill);
    const isTele = bill % 2 === 1;
    return {
      InvoiceDate: `2026-07-${String((bill % 10) + 1).padStart(2, "0")}`,
      InvoiceNo: `PERF-INV-${String(bill).padStart(4, "0")}`,
      SOTypeID: `PERF-TYPE-${index % 15}`,
      SO_SalespersonID: `PERF-PS-${bill % 8}`,
      TelesaleID: isTele ? `PERF-TELE-${bill % 16}` : "",
      CustomerName: `ร้าน Performance ${String(bill % stores).padStart(storeDigits, "0")}`,
      SKUCode: `PERF-SKU-${String(index).padStart(5, "0")}`,
      SKUDescription: `สินค้า Performance ${String(index).padStart(5, "0")}`,
      GroupBrand: `PERF-BRAND-${index % 20}`,
      TAS_SizeGroup: "Fixture Performance Size",
      ShipQtyPCS: 1,
      LineAmtBeforeDisc: 10 + (index % 7),
      InvoiceAmt: 9 + (index % 5),
    };
  });
}

export function createBrowserFixtureFiles(outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const worksheet = XLSX.utils.json_to_sheet(browserFixtureRows());
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DOIT");
  const files = {
    xlsx: path.join(outputDir, "pro-browser-fixture.xlsx"),
    xlsm: path.join(outputDir, "pro-browser-fixture.xlsm"),
    largeXlsx: path.join(outputDir, "pro-browser-performance-fixture.xlsx"),
    hugeXlsx: path.join(
      outputDir,
      "pro-browser-performance-6000-fixture.xlsx",
    ),
  };
  XLSX.writeFile(workbook, files.xlsx, { bookType: "xlsx" });
  XLSX.writeFile(workbook, files.xlsm, { bookType: "xlsm" });
  const largeWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    largeWorkbook,
    XLSX.utils.json_to_sheet(largeRealBillFixtureRows()),
    "DOIT",
  );
  XLSX.writeFile(largeWorkbook, files.largeXlsx, { bookType: "xlsx" });
  const hugeWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    hugeWorkbook,
    XLSX.utils.json_to_sheet(
      largeRealBillFixtureRows({
        rows: fixtureMeta.hugeRows,
        stores: fixtureMeta.hugeStores,
      }),
    ),
    "DOIT",
  );
  XLSX.writeFile(hugeWorkbook, files.hugeXlsx, { bookType: "xlsx" });
  return files;
}
