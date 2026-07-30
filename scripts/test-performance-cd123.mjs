import fs from "node:fs";
import assert from "node:assert/strict";

const read = path => fs.readFileSync(path, "utf8");

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `Missing function ${name}`);
  const brace = source.indexOf("{", start);
  assert.notEqual(brace, -1, `Missing body for ${name}`);
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = brace; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  assert.fail(`Unclosed function ${name}`);
}

function almostEqual(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} !== ${expected}`);
}

const revealSource = read("dist/performance-reveal.html");
const adapterSource = read("dist/assets/performance-cd-adapter-v1.js");
const builderSource = read("dist/assets/admin-performance-active-v2.js");
const boardSource = read("dist/assets/performance-board-v4.js");
const performanceHtml = read("dist/performance.html");
const adminHtml = read("dist/admin.html");

const combinedCd123Metric = new Function(`
  ${extractFunction(revealSource, "numberValue")}
  ${extractFunction(revealSource, "combinedCd123Metric")}
  return combinedCd123Metric;
`)();

const direct = combinedCd123Metric({
  cd123: { target: 1136, actual: 1198, index: 105.5 },
  dc1: { target: 1, actual: 1 },
  dc2: { target: 1, actual: 1 },
  dc3: { target: 1, actual: 1 }
});
assert.equal(direct.target, 1136);
assert.equal(direct.actual, 1198);
almostEqual(direct.index, 1198 / 1136 * 100, "Direct CD123 percent");
assert.equal(direct.incomplete, false);

const fallback = combinedCd123Metric({
  dc1: { target: 100, actual: 80 },
  dc2: { target: 200, actual: 150 },
  dc3: { target: 300, actual: 270 }
});
assert.deepEqual(fallback, {
  target: 600,
  actual: 500,
  index: 500 / 600 * 100,
  incomplete: false
});

const missingTarget = combinedCd123Metric({
  dc1: { target: 100, actual: 80 },
  dc2: { target: 0, actual: 150 },
  dc3: { target: 300, actual: 270 }
});
assert.equal(missingTarget.index, 0);
assert.equal(missingTarget.incomplete, true);

const indexOnlyDirect = combinedCd123Metric({
  cd123: { target: 0, actual: 0, index: 80 },
  dc1: { target: 100, actual: 80 },
  dc2: { target: 200, actual: 150 },
  dc3: { target: 300, actual: 270 }
});
assert.equal(indexOnlyDirect.target, 600);
assert.equal(indexOnlyDirect.actual, 500);
almostEqual(indexOnlyDirect.index, 500 / 600 * 100, "Index-only direct must use complete fallback");

const compact = value => String(value ?? "").trim().replace(/\s+/g, "").toUpperCase();
const N = value => typeof value === "number"
  ? (Number.isFinite(value) ? value : 0)
  : (Number(String(value ?? "").trim().replace(/,/g, "").replace(/%/g, "").replace(/[^0-9.\-]/g, "")) || 0);
const adapterFns = new Function("compact", "N", `
  ${extractFunction(adapterSource, "isCd123Name")}
  ${extractFunction(adapterSource, "hasCdName")}
  ${extractFunction(adapterSource, "findVal")}
  ${extractFunction(adapterSource, "cdMetric")}
  return { isCd123Name, hasCdName, cdMetric };
`)(compact, N);

for (const header of ["Target CD1+2+3", "Target CD1+CD2+CD3", "Target CD123"]) {
  assert.equal(adapterFns.hasCdName(header, "cd123"), true, `${header} must map to cd123`);
  assert.equal(adapterFns.hasCdName(header, "dc1"), false, `${header} must not map to dc1`);
  assert.equal(adapterFns.hasCdName(header, "dc2"), false, `${header} must not map to dc2`);
  assert.equal(adapterFns.hasCdName(header, "dc3"), false, `${header} must not map to dc3`);
}
assert.equal(adapterFns.hasCdName("Target CD1+CD3", "cd123"), false);
assert.equal(adapterFns.hasCdName("Target CD1 RJ SH RH JJ 70ML", "dc1"), true);

const screenshotRow = {
  sellerReport: {
    "Target CD1+2+3": "1,136",
    "การกระจาย CD1+2+3": "1,198",
    "Index CD1+2+3": "105.5%"
  }
};
const parsed = adapterFns.cdMetric(screenshotRow, "cd123");
assert.equal(parsed.target, 1136);
assert.equal(parsed.actual, 1198);
almostEqual(parsed.index, 1198 / 1136 * 100, "Adapter CD123 percent");
const falseCd1 = adapterFns.cdMetric(screenshotRow, "dc1");
assert.deepEqual(falseCd1, { target: 0, actual: 0, index: 0 });

assert.match(builderSource, /'Target CD1\+2\+3'/);
assert.match(builderSource, /'การกระจาย CD1\+2\+3'/);
assert.match(builderSource, /'Index CD1\+2\+3'/);
assert.ok(builderSource.includes("cd123:cd123Metric(o)"));
assert.ok(builderSource.includes("schema:'performance-min-v5'"));
assert.ok(adapterSource.includes("performance-cd-adapter-v5-cd123"));
assert.ok(boardSource.includes("cd123:'CD1+2+3'"));
assert.ok(!boardSource.includes("cd13:'CD1+CD3'"));
assert.ok(revealSource.includes("function compareMetricRows"));
assert.ok(revealSource.includes("function compareRaceRows"));
assert.ok(!revealSource.includes("{rank:1,name:"), "Reveal must not contain hard-coded winner data");
assert.ok(revealSource.includes("performance-cd-adapter-v1.js?v=5"));
assert.ok(performanceHtml.includes("performance-cd-adapter-v1.js?v=5"));
assert.ok(performanceHtml.includes("performance-board-v4.js?v=11"));
assert.ok(adminHtml.includes("admin-performance-active-v2.js?v=3"));
assert.ok(!fs.existsSync("dist/assets/performance-go-media-v1.js"));
assert.ok(!revealSource.includes("performance-go-media-v1.js"));
assert.ok(!revealSource.includes('class="suspense-go-image"'));
assert.ok(!revealSource.includes("show-go-image"));
assert.ok(revealSource.includes('number.textContent = "GO!"'));
assert.ok(revealSource.includes("playCountdownTone(true);"));
assert.ok(!revealSource.includes('playPerformanceTrack("go")'));
assert.ok(revealSource.includes("}, 3650);"));

console.log("Performance CD123 regression: PASS");
