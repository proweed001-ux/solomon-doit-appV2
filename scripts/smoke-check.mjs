import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fp = p => path.join(root, p);
const exists = p => fs.existsSync(fp(p));
const read = p => fs.readFileSync(fp(p), 'utf8');
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const mustExist = p => check(exists(p), `Missing required file: ${p}`);
const mustNotExist = p => check(!exists(p), `Stale or risky file should not exist: ${p}`);
const mustContain = (p, s) => check(exists(p) && read(p).includes(s), `${p} must contain: ${s}`);
const mustNotContain = (p, s) => { if (exists(p)) check(!read(p).includes(s), `${p} must not contain: ${s}`); };

[
  'package.json',
  'src/App.tsx',
  'src/main.tsx',
  'src/components/AppHeader.tsx',
  'src/lib/parser.ts',
  'src/lib/analytics.ts',
  'src/lib/pricing.ts',
  'src/types.ts',
  'dist/pro.html',
  'dist/assets/pro-core-v4.js',
  'dist/assets/pro-print-store-bills.js',
  'dist/assets/pro-print.css',
  'scripts/qa-doit-file.mjs',
  'docs/ARCHITECTURE.md',
  'docs/PROJECT_STRUCTURE.md',
  'docs/SOURCE_AUDIT.md',
  'docs/FEATURE_RULES.md',
  'docs/ROADMAP.md',
  'docs/REAL_FILE_QA.md',
  'docs/CLEANUP_AUDIT.md',
  '.github/workflows/web-ci.yml',
  '.github/workflows/build-android-apk.yml',
].forEach(mustExist);

const pkg = JSON.parse(read('package.json'));
['build', 'smoke', 'verify'].forEach(name => check(Boolean(pkg.scripts?.[name]), `package.json missing script: ${name}`));

mustContain('dist/pro.html', 'pro-core-v4.js');
mustContain('dist/assets/pro-core-v4.js', 'CORE_URL');
mustContain('dist/assets/pro-core-v4.js', 'patchLegacyCore');
mustContain('dist/assets/pro-core-v4.js', 'renderDoneFromCore');
mustContain('dist/assets/pro-core-v4.js', 'pro-print-store-bills.js');
mustNotContain('dist/assets/pro-core-v4.js', 'pro-print-pro-fixes.js');
mustNotContain('dist/assets/pro-core-v4.js', 'pro-print-total-display-fix.js');

mustContain('dist/assets/pro-print-store-bills.js', 'const BILL_ROWS = 12');
mustContain('dist/assets/pro-print-store-bills.js', 'const BILLS_PER_A4 = 2');
mustContain('dist/assets/pro-print-store-bills.js', "const EDIT_KEY = 'doit-pro-print-price-edits-v1'");
mustContain('dist/assets/pro-print-store-bills.js', 'function buildBills()');
mustContain('dist/assets/pro-print-store-bills.js', 'function renderDoneFromCore()');
mustContain('dist/assets/pro-print-store-bills.js', 'รวมจากบิลเตรียมปริ้น');
mustNotContain('dist/assets/pro-print-store-bills.js', 'function renderDoneFromBills()');
mustNotContain('dist/assets/pro-print-store-bills.js', 'scheduleDoneRender');
mustNotContain('dist/assets/pro-print-store-bills.js', 'proPrintDoneSignature');

mustContain('dist/assets/pro-print.css', '@page');
mustContain('dist/assets/pro-print.css', '.printMobileSafeA4');
mustContain('src/lib/parser.ts', 'parseDataFile');
mustContain('src/lib/parser.ts', 'normalizeRows');
mustContain('src/lib/pricing.ts', 'unitPriceFromAmount');
mustContain('src/lib/analytics.ts', 'buildBillLines');
mustContain('src/components/AppHeader.tsx', 'export function AppHeader');
mustContain('scripts/qa-doit-file.mjs', 'rowsFromPivotCache');
mustContain('scripts/qa-doit-file.mjs', 'checkPrintGuardrails');

[
  'dist/assets/pro-print-pro-fixes.js',
  'dist/assets/pro-print-total-display-fix.js',
  '.github/workflows/patch-pro-print-max12.yml',
  '.github/workflows/pro-send-actions-4cols.yml',
  '.github/workflows/patch-admin-upload-progress.yml',
  '.github/workflows/build-apk.yml',
  '.github/workflows/apply-icon-from-b64.yml',
  '.github/workflows/rebuild-icons-from-drawable.yml',
  '.github/workflows/fix-valid-icon-build.yml',
].forEach(mustNotExist);

if (failures.length) {
  console.error('\nSmoke check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Smoke check passed: patched done mode core path and single Pro print source are intact.');
