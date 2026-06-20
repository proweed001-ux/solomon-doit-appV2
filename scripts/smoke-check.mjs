import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fp = p => path.join(root, p);
const read = p => fs.readFileSync(fp(p), 'utf8');
const exists = p => fs.existsSync(fp(p));
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const mustExist = p => check(exists(p), `Missing required file: ${p}`);
const mustContain = (p, s) => check(exists(p) && read(p).includes(s), `${p} must contain: ${s}`);
const mustNotContain = (p, s) => { if (exists(p)) check(!read(p).includes(s), `${p} must not contain: ${s}`); };

[
  'package.json',
  'dist/pro.html',
  'dist/assets/pro-core-v4.js',
  'dist/assets/pro-print-store-bills.js',
  'dist/assets/pro-print-mode-fixes.js',
  'dist/assets/pro-print.css',
  'scripts/qa-doit-file.mjs',
  '.github/workflows/web-ci.yml',
].forEach(mustExist);

const pkg = JSON.parse(read('package.json'));
['build', 'smoke', 'verify'].forEach(name => check(Boolean(pkg.scripts?.[name]), `package.json missing script: ${name}`));

mustContain('dist/pro.html', 'pro-core-v4.js');
mustContain('dist/assets/pro-core-v4.js', "VERSION = '1026'");
mustContain('dist/assets/pro-core-v4.js', 'installPickSendEnterNext');
mustContain('dist/assets/pro-core-v4.js', 'SEND_SELECTOR');
mustContain('dist/assets/pro-core-v4.js', '#table input.jdata[data-map="send"]');
mustContain('dist/assets/pro-core-v4.js', "event.key !== 'Enter'");
mustContain('dist/assets/pro-core-v4.js', "input.enterKeyHint = 'next'");
mustContain('dist/assets/pro-core-v4.js', 'input.tabIndex = 1000 + index');
mustContain('dist/assets/pro-core-v4.js', 'nextIndexFor');
mustContain('dist/assets/pro-core-v4.js', 'focusSendAt(nextIndexFor(input))');
mustNotContain('dist/assets/pro-core-v4.js', 'oldPickSendNav');
mustNotContain('dist/assets/pro-core-v4.js', 'newPickSendNav');
mustNotContain('dist/assets/pro-core-v4.js', 'focusSendDown');

mustContain('dist/assets/pro-core-v4.js', 'oldOrderBranch');
mustContain('dist/assets/pro-core-v4.js', 'newOrderBranch');
mustContain('dist/assets/pro-core-v4.js', 'oldTeleRender');
mustContain('dist/assets/pro-core-v4.js', 'newTeleRender');
mustContain('dist/assets/pro-core-v4.js', 'renderDoneFromCore');
mustContain('dist/assets/pro-core-v4.js', 'pro-print-store-bills.js');
mustNotContain('dist/assets/pro-core-v4.js', 'pro-print-pro-fixes.js');
mustNotContain('dist/assets/pro-core-v4.js', 'pro-print-total-display-fix.js');

mustContain('dist/assets/pro-print-mode-fixes.js', 'function isTotalLikeRow');
mustContain('dist/assets/pro-print-mode-fixes.js', 'orderPrintFix');
mustContain('dist/assets/pro-print-mode-fixes.js', 'pageStyle');
mustContain('dist/assets/pro-print-mode-fixes.js', '@page { size: A4 portrait; margin: 7mm 4mm 8mm 4mm; }');

mustContain('dist/assets/pro-print-store-bills.js', 'BILL_ROWS=12');
mustContain('dist/assets/pro-print-store-bills.js', 'BILLS_PER_A4=2');
mustContain('dist/assets/pro-print-store-bills.js', 'function buildBills()');
mustContain('dist/assets/pro-print-store-bills.js', 'function renderDoneFromCore()');
mustContain('dist/assets/pro-print-store-bills.js', 'const qty=mapVal(st.send,g.poolKey,store,st.sel)');
mustContain('dist/assets/pro-print-store-bills.js', 'Object.keys(st?.send||{})');
mustNotContain('dist/assets/pro-print-store-bills.js', 'mapVal(st.send,g.poolKey,store,st.sel)+mapVal(st.add');
mustNotContain('dist/assets/pro-print-store-bills.js', '[st?.send,st?.add,st?.pull]');

[
  'dist/assets/pro-print-pro-fixes.js',
  'dist/assets/pro-print-total-display-fix.js',
  '.github/workflows/build-apk.yml',
].forEach(p => check(!exists(p), `Stale or risky file should not exist: ${p}`));

if (failures.length) {
  console.error('\nSmoke check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Smoke check passed: Pro print uses send quantities only; add/pull do not enter print bills.');
