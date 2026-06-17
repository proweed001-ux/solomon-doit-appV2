import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function filePath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), 'utf8');
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function mustExist(relativePath) {
  check(exists(relativePath), `Missing required file: ${relativePath}`);
}

function mustNotExist(relativePath) {
  check(!exists(relativePath), `Stale or risky file should not exist: ${relativePath}`);
}

function mustContain(relativePath, needle) {
  if (!exists(relativePath)) {
    failures.push(`Cannot inspect missing file: ${relativePath}`);
    return;
  }
  check(read(relativePath).includes(needle), `${relativePath} must contain: ${needle}`);
}

function mustHavePackageScript(scriptName) {
  const pkg = JSON.parse(read('package.json'));
  check(Boolean(pkg.scripts?.[scriptName]), `package.json missing script: ${scriptName}`);
}

const requiredFiles = [
  'package.json',
  'src/App.tsx',
  'src/main.tsx',
  'src/lib/parser.ts',
  'src/lib/analytics.ts',
  'src/lib/pricing.ts',
  'src/types.ts',
  'dist/pro.html',
  'dist/assets/pro-core-v4.js',
  'dist/assets/pro-print-store-bills.js',
  'dist/assets/pro-print.css',
  'docs/ARCHITECTURE.md',
  'docs/FEATURE_RULES.md',
  'docs/ROADMAP.md',
  '.github/workflows/web-ci.yml',
  '.github/workflows/build-android-apk.yml',
];

for (const file of requiredFiles) mustExist(file);

mustHavePackageScript('build');
mustHavePackageScript('smoke');
mustHavePackageScript('verify');

mustContain('dist/pro.html', 'pro-core-v4.js');
mustContain('dist/assets/pro-core-v4.js', 'CORE_URL');
mustContain('dist/assets/pro-core-v4.js', 'pro-print.css');
mustContain('dist/assets/pro-core-v4.js', 'pro-print-store-bills.js');
mustContain('dist/assets/pro-print-store-bills.js', 'const BILL_ROWS = 12');
mustContain('dist/assets/pro-print-store-bills.js', 'const BILLS_PER_A4 = 2');
mustContain('dist/assets/pro-print-store-bills.js', "const EDIT_KEY = 'doit-pro-print-price-edits-v1'");
mustContain('dist/assets/pro-print.css', '@page');
mustContain('dist/assets/pro-print.css', '.printMobileSafeA4');
mustContain('src/lib/parser.ts', 'parseDataFile');
mustContain('src/lib/parser.ts', 'normalizeRows');
mustContain('src/lib/pricing.ts', 'unitPriceFromAmount');
mustContain('src/lib/analytics.ts', 'buildBillLines');

mustNotExist('.github/workflows/patch-pro-print-max12.yml');
mustNotExist('.github/workflows/pro-send-actions-4cols.yml');
mustNotExist('.github/workflows/patch-admin-upload-progress.yml');
mustNotExist('.github/workflows/build-apk.yml');

if (failures.length) {
  console.error('\nSmoke check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Smoke check passed: required files, Pro print guardrails, workflows, and package scripts are intact.');
