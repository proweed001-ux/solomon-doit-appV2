import assert from "node:assert/strict";
import fs from "node:fs";
import {
  combinedCd123Metric,
  hydratePerformancePack,
  reportPeriodDate,
  selectHistoryItems,
} from "../dist/assets/performance-data-v1.js";

const direct = combinedCd123Metric({ cd123: { target: 100, actual: 120, index: 1 } });
assert.deepEqual(direct, { target: 100, actual: 120, index: 120, incomplete: false });

const incomplete = combinedCd123Metric({
  dc1: { target: 100, actual: 80 },
  dc2: { target: 0, actual: 500 },
  dc3: { target: 100, actual: 90 },
});
assert.equal(incomplete.index, 0);
assert.equal(incomplete.actual, 0);
assert.equal(incomplete.incomplete, true);

const pack = hydratePerformancePack({
  meta: { reportDate: "2026-08-06" },
  ps: [
    { ps: "PS1", ads: "ADS1", moq: { target: 0, actual: 80, index: 60 }, cd123: { target: 100, actual: 100 }, gps: { target: 0, actual: 0, index: 0 } },
    { ps: "PS2", ads: "ADS1", moq: { target: 200, actual: 150 }, cd123: { target: 0, actual: 900 }, gps: { target: 0, actual: 90, index: 90 } },
  ],
  ads: [{ ads: "ADS1" }],
});
assert.equal(pack.ps[0].moq.target, 0, "Historical MOQ target must not be borrowed from another pack");
assert.equal(pack.ads[0].cd123.target, 100);
assert.equal(pack.ads[0].cd123.actual, 100, "CD123 actual without a target must be excluded from ADS total");
assert.equal(pack.ds.cd123.actual, 100, "CD123 actual without a target must be excluded from DS total");
assert.equal(pack.ads[0].gps.actual, 45, "GPS group actual must be the average percentage, not a sum");
assert.equal(pack.ads[0].gps.index, 45, "GPS group index must include a real 0 percent row");
assert.equal(pack.ds.gps.actual, 45, "DS GPS actual must remain the average percentage");

const index = Array.from({ length: 12 }, (_, offset) => ({
  reportKey: `202608-WD${String(offset + 1).padStart(2, "0")}`,
  path: `performance/compare/202608-WD${String(offset + 1).padStart(2, "0")}.json`,
}));
const selected = selectHistoryItems(index, { meta: { reportKey: "202608-WD13" } }, 6);
assert.equal(selected.length, 5);
assert.deepEqual(selected.map((item) => item.reportKey), [
  "202608-WD08",
  "202608-WD09",
  "202608-WD10",
  "202608-WD11",
  "202608-WD12",
]);

assert.equal(reportPeriodDate({ reportDate: "2568-12-01" }).getUTCFullYear(), 2025);
assert.equal(reportPeriodDate({ reportDate: "2025-12-01" }).getUTCMonth(), 11);

const adapter = fs.readFileSync("dist/assets/performance-cd-adapter-v1.js", "utf8");
assert.ok(!adapter.includes("window.fetch="), "Legacy adapter must not monkey-patch fetch");
assert.ok(!adapter.includes("sessionStorage.removeItem"), "Legacy adapter must not clear board cache");

const boardHtml = fs.readFileSync("dist/performance.html", "utf8");
const boardJs = fs.readFileSync("dist/assets/performance-board-v4.js", "utf8");
const revealHtml = fs.readFileSync("dist/performance-reveal-v2.html", "utf8");
const revealJs = fs.readFileSync("dist/assets/performance-reveal-v2.js", "utf8");
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
assert.ok(boardHtml.includes("performance-board-v4.js?v=11"), "Existing Board owner must remain active");
assert.ok(!/<script[^>]+performance-cd-adapter/i.test(boardHtml), "Active Board must not execute the legacy fetch adapter");
assert.ok(boardJs.includes("STORE='perf-v5'"), "Board cache must move away from stale adapter-era data");
assert.ok(boardJs.includes("if(k==='cd123'&&target<=0)return"), "Board totals must exclude CD123 actual without target");
assert.ok(boardJs.includes("a.cd123=aggregate(rows,'cd123')"), "Board ADS CD123 must be rebuilt from eligible PS rows");
assert.ok(boardJs.includes("eligibleRows(rows,k)"), "Board CD123 rankings must exclude target-zero rows");
assert.ok(boardJs.includes("function combineCd4OlIntoDc3(base,full)"), "Board must support current-month CD4 OL enrichment without a legacy adapter");
assert.ok(boardJs.includes("dc3:'CD3 + CD4 OL'"), "Board must label CD3 when CD4 OL is combined");
assert.ok(!revealHtml.includes("performance-cd-adapter"));
assert.ok(!revealHtml.includes("cdn.tailwindcss.com"));
assert.ok(!revealHtml.includes("fonts.googleapis.com"));
assert.ok(revealJs.includes("minimumFractionDigits: 2"), "Percentage display must remain at two decimals");
assert.ok(revealJs.includes("const RACE_DURATION_MS = TEST_MODE ? 160 : 10000"));
assert.equal(vercel.rewrites.find((item) => item.source === "/performance")?.destination, "/performance.html");
assert.equal(vercel.rewrites.find((item) => item.source === "/performance-reveal")?.destination, "/performance-reveal-v2.html");
assert.equal(fs.existsSync("dist/performance-v2.html"), false, "Reduced Board experiment must not remain active");
assert.equal(fs.existsSync("dist/assets/performance-board-v5.js"), false, "Reduced Board controller must be removed");
assert.equal(fs.existsSync("dist/assets/performance-v2.css"), false, "Reduced Board styles must be removed");

const admin = fs.readFileSync("dist/assets/admin-performance-active-v2.js", "utf8");
assert.ok(admin.includes("function monthYear(value,reportDate='')"));
assert.ok(admin.includes("if(key==='cd123'&&rowTarget<=0)return"));
assert.ok(admin.includes("reportYear:workbook.reportYear||0"));
assert.ok(admin.includes("function hasCd4OlMonth(rows)"), "Min generator must detect CD4 OL by monthly Seller Report fields");
assert.ok(admin.includes("dc3:cd3Metric(o,includeCd4Ol)"), "Min generator must combine CD4 OL only into CD3");
assert.ok(admin.includes("cd4OlCombinedIntoDc3:includeCd4Ol"), "Min metadata must record whether CD4 OL was combined");
assert.ok(admin.includes("labels:includeCd4Ol?{dc3:'CD3 + CD4 OL'}:{}"), "Min labels must expose the conditional CD3 + CD4 OL state");
assert.ok(admin.includes("function adsNameMap(data)"), "Min generator must preserve ADS names from the Tracking file");
assert.ok(admin.includes("adsName:T(adsName)||T(row.adsName)||row.adsCode"), "PS compact rows must carry the ADS display name");
assert.ok(admin.includes("adsName:name"), "ADS compact rows must carry the ADS display name");
assert.ok(admin.includes("actual:key==='gps'?average:actual"), "Min generator must keep GPS group actual as an average percentage");

console.log("Performance data ownership regression: PASS");
