import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const fp = (p) => path.join(root, p);
const exists = (p) => fs.existsSync(fp(p));
const read = (p) => fs.readFileSync(fp(p), "utf8");
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
};
const mustExist = (p) => check(exists(p), `Missing required file: ${p}`);
const mustContain = (p, s) =>
  check(exists(p) && read(p).includes(s), `${p} must contain: ${s}`);
const mustNotContain = (p, s) => {
  if (exists(p)) check(!read(p).includes(s), `${p} must not contain: ${s}`);
};

const required = [
  "package.json",
  "README.md",
  "dist/index.html",
  "dist/pro.html",
  "dist/admin.html",
  "dist/admin-login.html",
  "dist/performance.html",
  "dist/assets/pro/app.js",
  "dist/assets/pro/core.js",
  "dist/assets/pro/state.js",
  "dist/assets/pro/data-source.js",
  "dist/assets/pro/parser-adapter.js",
  "dist/assets/pro/filters.js",
  "dist/assets/pro/utils.js",
  "dist/assets/pro/fuel-secret.js",
  "dist/assets/pro/send-store.js",
  "dist/assets/pro/order.js",
  "dist/assets/pro/telesale.js",
  "dist/assets/pro/done.js",
  "dist/assets/pro/developer-qr.js",
  "dist/assets/pro/team.js",
  "dist/assets/pro/results-mode.js",
  "dist/assets/pro/print-model.js",
  "dist/assets/pro-print-store-bills.js",
  "dist/assets/pro-print-mode-fixes.js",
  "dist/assets/pro-print.css",
  "dist/assets/admin-upload-v001.js",
  "dist/assets/admin-json-v265.js",
  "dist/assets/admin-auth-v1.js",
  "dist/assets/admin-progress-popup-v1.js",
  "dist/assets/admin-storage-manager-v1.js",
  "dist/assets/admin-performance-active-v2.js",
  "api/admin-storage.js",
  "scripts/test-admin-storage-guards.mjs",
  "src/lib/parser.ts",
  "src/lib/pricing.ts",
  "scripts/qa-doit-file.mjs",
  ".github/workflows/web-ci.yml",
];
required.forEach(mustExist);

const pkg = JSON.parse(read("package.json"));
["build", "smoke", "verify", "verify:react"].forEach((name) =>
  check(Boolean(pkg.scripts?.[name]), `package.json missing script: ${name}`),
);
check(
  pkg.scripts.verify === "npm run smoke",
  "package.json verify must be smoke-only for Pro legacy",
);

// Pro stable guardrails.
mustContain("README.md", "Pro Stable 1028 Native");
mustContain("dist/index.html", "/pro.html?t=1028");
mustContain(
  "dist/pro.html",
  '<script type="module" src="/assets/pro/app.js"></script>',
);
mustNotContain("dist/pro.html", "/pro-shell-v1028.html");
mustNotContain("dist/pro.html", "document.open(");
mustNotContain("dist/pro.html", "document.write(");
mustNotContain("dist/pro.html", "document.close(");
mustNotContain("dist/pro.html", "html.replace(");
mustNotContain("dist/pro.html", "/assets/pro-core-v4.js");
mustContain("dist/assets/pro/app.js", 'import "./bootstrap.js";');
mustContain("dist/assets/pro/app.js", 'import "./core.js";');
mustNotContain("dist/assets/pro/app.js", 'import "../pro-native-core.js";');
mustNotContain("dist/assets/pro/app.js", "pro-native-core-overrides.js");
mustNotContain("dist/assets/pro/app.js", "pro-team-single.js");
mustNotContain("dist/assets/pro/app.js", "pro-results-mode.js");
mustContain("dist/assets/pro/core.js", 'currentStateSource: "state-module"');
mustNotContain("dist/assets/pro/core.js", "MutationObserver");
mustNotContain("dist/assets/pro/core.js", "setInterval");
mustContain("dist/assets/pro/state.js", '"doit-core-unified-v1:" + state.key');
mustContain("dist/assets/pro/print-model.js", "export const BILL_ROWS = 12");
mustContain("dist/assets/pro/print-model.js", "export const BILLS_PER_A4 = 2");
mustContain("dist/assets/pro-print-store-bills.js", "BILLS_PER_A4=2");
mustContain("dist/assets/pro-print-store-bills.js", "BILL_ROWS=12");
mustContain(
  "dist/assets/pro-print-store-bills.js",
  "window.DOIT_CORE_APP?.currentState?.()",
);
["dist/pro.html"].forEach((p) => {
  mustNotContain(p, "raw.githubusercontent.com");
  mustNotContain(p, "cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2");
});

// Admin separation guardrails.
mustContain("dist/admin.html", 'id="file"');
mustContain("dist/admin.html", 'id="perfFile"');
mustContain("dist/admin.html", 'id="uploadCloud"');
mustContain("dist/admin.html", 'id="perfUpload"');
mustContain("dist/admin.html", "/assets/admin-upload-v001.js");
mustContain("dist/admin.html", "/assets/admin-json-v265.js");
mustContain("dist/admin.html", "/assets/admin-auth-v1.js");
mustContain("dist/admin.html", 'id="adminLogout"');
mustContain("dist/admin-login.html", 'type="password"');
mustContain("dist/admin.html", "/assets/admin-storage-manager-v1.js");

// Unified DOIT amount formula: TotInvc must come before InvoiceAmt everywhere active.
const formula =
  "TotInvc > Correct Amount/LineAmount > LineAmtBeforeDisc > detailAmt > row.amt > Amt > Amount > InvoiceAmt";
[
  "dist/assets/admin-upload-v001.js",
  "dist/assets/admin-json-v265.js",
  "scripts/qa-doit-file.mjs",
].forEach((p) => mustContain(p, formula));
[
  "src/lib/parser.ts",
  "dist/assets/admin-json-v265.js",
  "dist/assets/admin-upload-v001.js",
  "scripts/qa-doit-file.mjs",
].forEach((p) => {
  const s = read(p);
  check(s.indexOf("TotInvc") >= 0, `${p} missing TotInvc`);
  check(s.indexOf("InvoiceAmt") >= 0, `${p} missing InvoiceAmt fallback`);
  check(
    s.indexOf("TotInvc") < s.indexOf("InvoiceAmt"),
    `${p} must prioritize TotInvc before InvoiceAmt`,
  );
});
mustContain("src/lib/parser.ts", "if (!hasRawValue(row[key])) continue;");
mustContain("src/lib/pricing.ts", "if (qty === 0) return 0");
mustNotContain("src/lib/pricing.ts", "if (n <= 0) return 0");
mustContain("scripts/qa-doit-file.mjs", "scorePivot(fields, rows)");
mustContain("scripts/qa-doit-file.mjs", "amount !== 0");
mustContain("scripts/qa-doit-file.mjs", "return Math.round(safeNum(value))");

// One DOIT upload flow: no extra JSON button, no old active click automation.
mustNotContain("dist/assets/admin-json-v265.js", "uploadJsonActive");
mustContain("dist/assets/admin-json-v265.js", "$('#uploadCloud')");
mustContain("dist/assets/admin-json-v265.js", "setActiveRpc(c,id)");
mustContain("dist/assets/admin-json-v265.js", "old.disabled=true");
mustContain(
  "dist/assets/admin-upload-v001.js",
  "ปุ่มนี้ถูกโอนให้ admin-json-v265.js จัดการแล้ว",
);
mustNotContain("dist/assets/admin-progress-popup-v1.js", "btn.click()");
mustNotContain("dist/assets/admin-progress-popup-v1.js", "lastAutoActive");

// Performance dashboard and active metadata guardrails.
mustContain("dist/performance.html", "/assets/performance-board-v4.js");
mustContain("dist/assets/performance-board-v4.js", "Smart Compare วันต่อวัน");
mustContain("dist/assets/performance-board-v4.js", "sameDayRevisions");
mustContain("dist/assets/performance-board-v4.js", "Month Trend Dashboard");
mustContain("dist/admin.html", "/assets/admin-performance-active-v2.js");
mustContain(
  "dist/assets/admin-performance-active-v2.js",
  "schema:'performance-active-v5'",
);
mustContain("dist/assets/admin-performance-active-v2.js", "reportDate");
mustContain("dist/assets/admin-performance-active-v2.js", "previousDataPath");
mustContain("dist/assets/admin-performance-active-v2.js", "revision");
mustContain("dist/assets/admin-performance-active-v2.js", "hash");
mustContain("dist/assets/admin-performance-active-v2.js", "history");

// Storage safety guardrails: authenticated server route owns guarded DELETE; browser never calls Storage DELETE directly.
mustNotContain("dist/assets/admin-storage-manager-v1.js", "sb_publishable_");
mustNotContain("dist/assets/admin-storage-manager-v1.js", "const DEFAULT_KEY");
mustNotContain("dist/assets/admin-storage-manager-v1.js", "method:'DELETE'");
mustNotContain("dist/assets/admin-storage-manager-v1.js", 'method:"DELETE"');
[
  "async function refresh",
  "async function download",
  "async function previewOld",
  "async function deleteSelected",
].forEach((s) => {
  mustContain("dist/assets/admin-storage-manager-v1.js", s);
});
mustContain("dist/assets/admin-storage-manager-v1.js", "api('delete'");
mustContain("api/admin-storage.js", "const MAX_DELETE = 20");
mustContain("api/admin-storage.js", "active_guard_unavailable");
mustContain("api/admin-storage.js", "path_traversal");
mustContain("api/admin-storage.js", "method: 'DELETE'");
mustNotContain("api/admin-storage.js", "SUPABASE_SERVICE_ROLE_KEY");
mustNotContain("api/admin-storage.js", "service_role key");

// Remove stale high-risk files.
[
  "dist/assets/pro-print-pro-fixes.js",
  "dist/assets/pro-print-total-display-fix.js",
  ".github/workflows/build-apk.yml",
].forEach((p) =>
  check(!exists(p), `Stale or risky file should not exist: ${p}`),
);

if (failures.length) {
  console.error("\nSmoke check failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(
  "Smoke check passed: no known DOIT/Admin formula overlap, stale active-click flow, missing Performance active metadata patch, or direct storage delete guard violations.",
);
