import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fp = p => path.join(root, p);
const exists = p => fs.existsSync(fp(p));
const read = p => fs.readFileSync(fp(p), 'utf8');
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const mustExist = p => check(exists(p), `Missing required file: ${p}`);
const mustContain = (p, s) => check(exists(p) && read(p).includes(s), `${p} must contain: ${s}`);
const mustNotContain = (p, s) => { if (exists(p)) check(!read(p).includes(s), `${p} must not contain: ${s}`); };

const required = [
  'package.json','README.md','dist/index.html','dist/pro.html','dist/admin.html','dist/performance.html',
  'dist/assets/pro-core-v4.js','dist/assets/pro-native-core.js','dist/assets/pro-native-core-overrides.js',
  'dist/assets/pro-print-store-bills.js','dist/assets/pro-print-mode-fixes.js','dist/assets/pro-print.css',
  'dist/assets/admin-upload-v001.js','dist/assets/admin-json-v265.js','dist/assets/admin-progress-popup-v1.js','dist/assets/admin-storage-manager-v1.js','dist/assets/admin-performance-active-v2.js',
  'src/lib/parser.ts','src/lib/pricing.ts','scripts/qa-doit-file.mjs','.github/workflows/web-ci.yml'
];
required.forEach(mustExist);

const pkg = JSON.parse(read('package.json'));
['build','smoke','verify','verify:react'].forEach(name => check(Boolean(pkg.scripts?.[name]), `package.json missing script: ${name}`));
check(pkg.scripts.verify === 'npm run smoke', 'package.json verify must be smoke-only for Pro legacy');

// Pro stable guardrails.
mustContain('README.md', 'Pro Stable 1028 Native');
mustContain('dist/index.html', '/pro.html?t=1028');
mustContain('dist/pro.html', 'pro-core-v4.js');
mustContain('dist/assets/pro-core-v4.js', "VERSION = '1028-native'");
mustContain('dist/assets/pro-core-v4.js', 'legacyWrapperRemoved: true');
mustNotContain('dist/assets/pro-core-v4.js', 'pro-default-invc-v1.js');
mustNotContain('dist/assets/pro-core-v4.js', 'defaultInvcGuard');
mustNotContain('dist/assets/pro-core-v4.js', 'cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2');
mustNotContain('dist/assets/pro-core-v4.js', 'fetch(CORE_URL');
mustContain('dist/assets/pro-native-core.js', 'currentStateSource');
mustContain('dist/assets/pro-print-store-bills.js', 'BILLS_PER_A4=2');
mustContain('dist/assets/pro-print-store-bills.js', 'BILL_ROWS=12');
mustContain('dist/assets/pro-print-store-bills.js', 'window.DOIT_CORE_APP?.currentState?.()');

// Admin separation guardrails.
mustContain('dist/admin.html', 'id="file"');
mustContain('dist/admin.html', 'id="perfFile"');
mustContain('dist/admin.html', 'id="uploadCloud"');
mustContain('dist/admin.html', 'id="perfUpload"');
mustContain('dist/admin.html', '/assets/admin-upload-v001.js');
mustContain('dist/admin.html', '/assets/admin-json-v265.js');
mustContain('dist/admin.html', '/assets/admin-storage-manager-v1.js');

// Unified DOIT amount formula: TotInvc must come before InvoiceAmt everywhere active.
const formula = 'TotInvc > Correct Amount/LineAmount > LineAmtBeforeDisc > detailAmt > row.amt > Amt > Amount > InvoiceAmt';
['dist/assets/admin-upload-v001.js','dist/assets/admin-json-v265.js','scripts/qa-doit-file.mjs'].forEach(p => mustContain(p, formula));
['src/lib/parser.ts','dist/assets/admin-json-v265.js','dist/assets/admin-upload-v001.js','scripts/qa-doit-file.mjs'].forEach(p => {
  const s = read(p);
  check(s.indexOf('TotInvc') >= 0, `${p} missing TotInvc`);
  check(s.indexOf('InvoiceAmt') >= 0, `${p} missing InvoiceAmt fallback`);
  check(s.indexOf('TotInvc') < s.indexOf('InvoiceAmt'), `${p} must prioritize TotInvc before InvoiceAmt`);
});
mustContain('src/lib/parser.ts', 'amount !== 0');
mustContain('src/lib/pricing.ts', 'if (qty === 0) return 0');
mustNotContain('src/lib/pricing.ts', 'if (n <= 0) return 0');
mustContain('scripts/qa-doit-file.mjs', 'scorePivot(fields, rows)');
mustContain('scripts/qa-doit-file.mjs', 'amount !== 0');
mustContain('scripts/qa-doit-file.mjs', 'return Math.round(safeNum(value))');

// One DOIT upload flow: no extra JSON button, no old active click automation.
mustNotContain('dist/assets/admin-json-v265.js', 'uploadJsonActive');
mustContain('dist/assets/admin-json-v265.js', "$('#uploadCloud')");
mustContain('dist/assets/admin-json-v265.js', 'setActiveRpc(c,id)');
mustContain('dist/assets/admin-json-v265.js', 'old.disabled=true');
mustContain('dist/assets/admin-upload-v001.js', 'ปุ่มนี้ถูกโอนให้ admin-json-v265.js จัดการแล้ว');
mustNotContain('dist/assets/admin-progress-popup-v1.js', 'btn.click()');
mustNotContain('dist/assets/admin-progress-popup-v1.js', 'lastAutoActive');

// Performance dashboard and active metadata guardrails.
mustContain('dist/performance.html', 'Smart Compare วันต่อวัน');
mustContain('dist/performance.html', 'sameDayRevisions');
mustContain('dist/performance.html', 'Month Trend Dashboard');
mustContain('dist/assets/admin-storage-manager-v1.js', 'admin-performance-active-v2.js');
mustContain('dist/assets/admin-performance-active-v2.js', 'performance-active-v2');
mustContain('dist/assets/admin-performance-active-v2.js', 'reportDate');
mustContain('dist/assets/admin-performance-active-v2.js', 'previousDataPath');
mustContain('dist/assets/admin-performance-active-v2.js', 'revision');
mustContain('dist/assets/admin-performance-active-v2.js', 'hash');
mustContain('dist/assets/admin-performance-active-v2.js', 'history');

// Storage safety guardrails: no embedded key, no direct browser storage delete.
mustNotContain('dist/assets/admin-storage-manager-v1.js', 'sb_publishable_');
mustNotContain('dist/assets/admin-storage-manager-v1.js', 'const DEFAULT_KEY');
mustContain('dist/assets/admin-storage-manager-v1.js', 'no_direct_browser_delete');
mustContain('dist/assets/admin-storage-manager-v1.js', 'direct_browser_delete_disabled');
mustNotContain('dist/assets/admin-storage-manager-v1.js', "method:'DELETE'");
mustNotContain('dist/assets/admin-storage-manager-v1.js', 'method:"DELETE"');
mustContain('dist/assets/admin-storage-manager-v1.js', 'mixed_delete_forbidden');

// Remove stale high-risk files.
['dist/assets/pro-default-invc-v1.js','dist/assets/pro-print-pro-fixes.js','dist/assets/pro-print-total-display-fix.js','.github/workflows/build-apk.yml'].forEach(p => check(!exists(p), `Stale or risky file should not exist: ${p}`));

if (failures.length) {
  console.error('\nSmoke check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Smoke check passed: no overlay Pro hotfix, no known DOIT/Admin formula overlap, stale active-click flow, missing Performance active metadata patch, or direct storage delete guard violations.');
