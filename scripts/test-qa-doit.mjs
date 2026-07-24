import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const root = process.cwd();
const fixtureDir = path.join(root, "test-results", "qa-doit-fixture");
const fixturePath = path.join(fixtureDir, "qa-doit-fixture.xlsx");
const resultPath = path.join(fixtureDir, "qa-result.json");

fs.mkdirSync(fixtureDir, { recursive: true });

try {
  const rows = [
    {
      SOTypeID: "INVC",
      ShipQtyPCS: 3,
      TotInvc: 30,
      InvoiceAmt: 28,
      "Customer Name": "QA Fixture Store",
      cID: "QA-001",
      SKU_Code: "QA-SKU-001",
      SKU_Desc: "QA Fixture Product",
      SalespersonID: "AYAPS062",
      Salesperson_Name: "QA Fixture Person",
      InvcDate: "2026-07-23",
      InvcNbr: "QA-INVC-001",
    },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "DOIT");
  XLSX.writeFile(workbook, fixturePath);

  execFileSync(
    process.execPath,
    ["scripts/qa-doit-file.mjs", fixturePath, `--json=${resultPath}`],
    { cwd: root, encoding: "utf8", stdio: "pipe" },
  );

  const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
  assert.equal(result.file.parseSource, "worksheet");
  assert.equal(result.rows.parsed, 1);
  assert.equal(result.totals.qtyPcs, 3);
  assert.equal(result.totals.amount, 30);
  assert.deepEqual(result.failures, []);
  assert.ok(
    Object.values(result.printGuardrails).every(Boolean),
    `Active print guardrails failed: ${JSON.stringify(result.printGuardrails)}`,
  );

  console.log("QA DOIT fixture passed:", {
    rows: result.rows.parsed,
    qty: result.totals.qtyPcs,
    amount: result.totals.amount,
    printGuardrails: result.printGuardrails,
  });
} finally {
  fs.rmSync(fixtureDir, { recursive: true, force: true });
}
