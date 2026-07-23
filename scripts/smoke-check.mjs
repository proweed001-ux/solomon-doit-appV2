import fs from "node:fs";
import path from "node:path";
import { verifyWorkingTreeScope } from "./pro-change-scope.mjs";

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
  "dist/assets/pro/print.js",
  "dist/assets/pro/pro.css",
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
  "scripts/test-qa-doit.mjs",
  "scripts/test-pro-redirects.mjs",
  "scripts/pro-change-scope.mjs",
  "scripts/test-pro-change-scope.mjs",
  "scripts/test-pro-architecture.mjs",
  "scripts/test-pro-module-syntax.mjs",
  "scripts/fixtures/pro-browser-fixture.mjs",
  "tests/pro/pro-browser.spec.mjs",
  "playwright.pro.config.mjs",
  ".github/workflows/web-ci.yml",
  "vercel.json",
];
required.forEach(mustExist);

const pkg = JSON.parse(read("package.json"));
[
  "build",
  "smoke",
  "verify",
  "verify:react",
  "test:pro-scope",
  "test:pro-regression",
  "test:pro-lazy",
  "test:local-xlsx",
  "test:qa-doit",
  "test:pro-redirects",
  "test:pro-architecture",
  "test:pro-modules",
  "test:pro-browser",
].forEach((name) =>
  check(Boolean(pkg.scripts?.[name]), `package.json missing script: ${name}`),
);
check(
  [
    "npm run smoke",
    "npm run test:pro-scope",
    "npm run test:pro-regression",
    "npm run test:pro-lazy",
    "npm run test:local-xlsx",
    "npm run test:qa-doit",
    "npm run test:pro-redirects",
    "npm run test:pro-architecture",
    "npm run test:pro-modules",
    "npm run test:pro-browser",
  ].every((command) => pkg.scripts.verify.includes(command)),
  "package.json verify must run the complete active Pro verification suite",
);
[
  "fetch-depth: 0",
  "PRO_SMOKE_BASE_SHA",
  "npm ci",
  "npm run smoke",
  "npm run test:pro-regression",
  "npm run test:pro-lazy",
  "npm run test:local-xlsx",
  "npm run test:qa-doit",
  "npm run test:pro-redirects",
  "npm run test:pro-architecture",
  "npm run test:pro-modules",
  "npm run test:pro-browser",
].forEach((token) => mustContain(".github/workflows/web-ci.yml", token));

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
mustNotContain("dist/assets/pro/app.js", "pro-print-store-bills.js");
mustNotContain("dist/assets/pro/app.js", "pro-print-mode-fixes.js");
mustNotContain("dist/assets/pro/app.js", "pro-print-column-widths.js");
mustNotContain("dist/assets/pro/app.js", "pro-print-a4-pro-fix.js");
mustContain("dist/assets/pro/core.js", 'currentStateSource: "state-module"');
mustNotContain("dist/assets/pro/core.js", "MutationObserver");
mustNotContain("dist/assets/pro/core.js", "setInterval");
mustContain("dist/assets/pro/state.js", '"doit-core-unified-v1:" + state.key');
mustContain("dist/assets/pro/print-model.js", "export const BILL_ROWS = 12");
mustContain("dist/assets/pro/print-model.js", "export const BILLS_PER_A4 = 2");
mustContain("dist/assets/pro/print.js", "buildBills()");
mustContain("dist/assets/pro/print.js", "BILLS_PER_A4");
mustContain("dist/pro.html", 'href="/assets/pro/pro.css"');
mustNotContain("dist/pro.html", "pro-print.css");

const proHtmlScripts = read("dist/pro.html").match(/<script\b/gi) || [];
check(proHtmlScripts.length === 1, "dist/pro.html must have exactly one script entry");

const proModuleFiles = fs
  .readdirSync(fp("dist/assets/pro"))
  .filter((name) => name.endsWith(".js"));
const activeProSource = proModuleFiles
  .map((name) => read(path.join("dist/assets/pro", name)))
  .join("\n");
[
  "document.open(",
  "document.write(",
  "document.close(",
  "html.replace(",
  "MutationObserver",
  "setInterval(",
  'createElement("script")',
  "createElement('script')",
  "pro-shell-v1028.html",
  "pro-core-v4.js",
  "pro-native-core.js",
  "pro-native-core-overrides.js",
].forEach((token) =>
  check(!activeProSource.includes(token), `Active Pro modules must not contain: ${token}`),
);
check(
  !/window\.[A-Za-z_$][\w$]*\s*=\s*function\b/.test(activeProSource),
  "Active Pro modules must not monkey-patch window functions",
);
check(
  proModuleFiles.filter((name) => /(?:fix|patch|override|hotfix|bridge)/i.test(name)).length === 0,
  "Active Pro module filenames must not be fix, patch, override, hotfix, or bridge layers",
);
check(
  (activeProSource.match(/export const state\s*=/g) || []).length === 1,
  "Active Pro modules must have exactly one exported state owner",
);

try {
  const scope = verifyWorkingTreeScope({ cwd: root });
  if (!scope.skipped) {
    console.log(
      `Pro change-scope guard checked ${scope.changed.length} file(s) from ${scope.baseSha}.`,
    );
  }
} catch (error) {
  check(false, error.message);
}
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

// Removed Pro Legacy files are intentionally retained here as a negative guard.
const removedProLegacyFiles = [
  "dist/assets/pro-core-v4.js",
  "dist/assets/pro-native-core.js",
  "dist/assets/pro-native-core-overrides.js",
  "dist/assets/pro-print-store-bills.js",
  "dist/assets/pro-print-mode-fixes.js",
  "dist/assets/pro-print-column-widths.js",
  "dist/assets/pro-print-a4-pro-fix.js",
  "dist/assets/pro-print.css",
  "dist/assets/pro-team-single.js",
  "dist/assets/pro-results-mode.js",
  "dist/pro-native-test.html",
  "dist/pro-native-phase4.html",
  "dist/pro-native-ui.html",
  "dist/assets/pro-action-dump.txt",
];
removedProLegacyFiles.forEach((p) =>
  check(!exists(p), `Removed Pro Legacy file must not exist: ${p}`),
);

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
  "Smoke check passed: Pro scope, architecture, DOIT/Admin formulas, Performance metadata, and storage guardrails are intact.",
);
