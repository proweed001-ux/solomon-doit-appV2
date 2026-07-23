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
  rawAmount: 2951,
  netAmount: 2691,
  vatAmount: 2879.37,
  sentRows: 25,
  sentQty: 25,
  printStoreTotal: 275,
  printBills: 3,
  a4Sheets: 2,
};

export function browserFixtureRows() {
  const normal = Array.from({ length: fixtureMeta.normalRows }, (_, index) => {
    const number = index + 1;
    return {
      InvoiceDate: fixtureMeta.date,
      InvoiceNo: `INV-N-${String(number).padStart(3, "0")}`,
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
      InvoiceNo: `INV-T-${String(number).padStart(3, "0")}`,
      SOTypeID: "INVC",
      SO_SalespersonID: fixtureMeta.ps,
      TelesaleID: `TELE-${String(number).padStart(3, "0")}`,
      CustomerName: `ร้าน Tele ${String(number).padStart(3, "0")}`,
      SKUCode: `TSKU-${String(number).padStart(3, "0")}`,
      SKUDescription: `สินค้า Telesale ${String(number).padStart(3, "0")}`,
      GroupBrand: "Fixture Tele Brand",
      TAS_SizeGroup: "Fixture Tele Size",
      ShipQtyPCS: 1,
      LineAmtBeforeDisc: 20 + number,
      InvoiceAmt: 18 + number,
    };
  });
  return [...normal, ...telesale];
}

export function createBrowserFixtureFiles(outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const worksheet = XLSX.utils.json_to_sheet(browserFixtureRows());
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DOIT");
  const files = {
    xlsx: path.join(outputDir, "pro-browser-fixture.xlsx"),
    xlsm: path.join(outputDir, "pro-browser-fixture.xlsm"),
  };
  XLSX.writeFile(workbook, files.xlsx, { bookType: "xlsx" });
  XLSX.writeFile(workbook, files.xlsm, { bookType: "xlsm" });
  return files;
}
