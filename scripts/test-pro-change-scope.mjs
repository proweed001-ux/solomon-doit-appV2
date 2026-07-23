import assert from "node:assert/strict";
import {
  assertProOnlyChanges,
  forbiddenProScopeFiles,
  proScopeFiles,
  resolveComparisonBase,
} from "./pro-change-scope.mjs";

const proOnlyFiles = [
  "dist/pro.html",
  "dist/assets/pro/core.js",
  "scripts/test-pro-regression.mjs",
  "docs/PRO_SINGLE_SOURCE_REPORT.md",
];
const forbiddenFiles = [
  ...proOnlyFiles,
  "dist/promo.html",
  "api/promotion-upload.js",
  "docs/Promo-v2.md",
];

assert.deepEqual(proScopeFiles(proOnlyFiles), ["dist/pro.html", "dist/assets/pro/core.js"]);
assert.deepEqual(proScopeFiles(["src/promo-new/admin/main.tsx", "package.json"]), []);
assert.deepEqual(forbiddenProScopeFiles(proOnlyFiles), []);
assert.doesNotThrow(() => assertProOnlyChanges(proOnlyFiles));
assert.deepEqual(forbiddenProScopeFiles(forbiddenFiles), [
  "dist/promo.html",
  "api/promotion-upload.js",
  "docs/Promo-v2.md",
]);
assert.throws(
  () => assertProOnlyChanges(forbiddenFiles),
  /rejected forbidden paths/,
);
assert.throws(
  () =>
    resolveComparisonBase({
      cwd: process.cwd(),
      env: { CI: "true" },
    }),
  /required in CI/,
);

console.log("Pro change-scope guard passed simulated forbidden and allowed path tests.");
