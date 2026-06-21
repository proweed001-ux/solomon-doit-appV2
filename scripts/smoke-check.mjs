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
  'dist/index.html',
  'dist/pro.html',
  'dist/pro-native-test.html',
  'dist/pro-native-phase4.html',
  'dist/pro-v310.html',
  'dist/pro-v310-test.html',
  'dist/assets/pro-core-v4.js',
  'dist/assets/pro-native-core.js',
  'dist/assets/pro-native-core-overrides.js',
  'dist/assets/pro-native-phase4-readiness.js',
  'dist/assets/pro-print-store-bills.js',
  'dist/assets/pro-print-mode-fixes.js',
  'dist/assets/pro-print.css',
  'scripts/qa-doit-file.mjs',
  '.github/workflows/web-ci.yml',
].forEach(mustExist);

const pkg = JSON.parse(read('package.json'));
['build', 'smoke', 'verify', 'verify:react'].forEach(name => check(Boolean(pkg.scripts?.[name]), `package.json missing script: ${name}`));
check(pkg.scripts.verify === 'npm run smoke', 'package.json verify must be smoke-only for Pro legacy');

mustContain('dist/index.html', 'Pro Stable 1026');
mustContain('dist/index.html', '/pro.html?t=1026');
mustContain('dist/pro-v310.html', "location.replace('/pro.html?t=1026')");
mustContain('dist/pro-v310-test.html', "location.replace('/pro.html?t=1026')");

mustContain('.github/workflows/web-ci.yml', 'dist/*.html');
mustContain('.github/workflows/web-ci.yml', 'dist/assets/**');
mustContain('.github/workflows/web-ci.yml', 'docs/**');

mustContain('dist/pro.html', 'pro-core-v4.js');
mustContain('dist/assets/pro-core-v4.js', "VERSION = '1027'");
mustContain('dist/assets/pro-core-v4.js', 'currentState:()=>JSON.parse');
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

mustContain('dist/pro-native-test.html', 'Project Pro Native Core Preview');
mustContain('dist/pro-native-test.html', '/assets/pro-native-core.js?v=phase2');
mustContain('dist/pro-native-test.html', '/assets/pro-native-core-overrides.js?v=phase2');
mustNotContain('dist/pro-native-test.html', 'cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2');

mustContain('dist/pro-native-phase4.html', 'Project Pro Native Core Phase 4');
mustContain('dist/pro-native-phase4.html', 'Phase 4 preview: native core stack only');
mustContain('dist/pro-native-phase4.html', '/assets/pro-native-core.js?v=phase4');
mustContain('dist/pro-native-phase4.html', '/assets/pro-native-core-overrides.js?v=phase4');
mustContain('dist/pro-native-phase4.html', '/assets/pro-native-phase4-readiness.js?v=phase4');
mustNotContain('dist/pro-native-phase4.html', 'cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2');

mustContain('dist/assets/pro-native-core.js', "const END='https://saodmeoilixfdqentofp.supabase.co/functions/v1/doit-active'");
mustContain('dist/assets/pro-native-core-overrides.js', 'DOIT_NATIVE_CORE_PREVIEW');
mustContain('dist/assets/pro-native-core-overrides.js', "version: 'phase3'");
mustContain('dist/assets/pro-native-core-overrides.js', 'installCurrentStateApi');
mustContain('dist/assets/pro-native-core-overrides.js', 'renderDoneFromPrintModule');
mustContain('dist/assets/pro-native-core-overrides.js', 'enhanceOrderTable');
mustContain('dist/assets/pro-native-core-overrides.js', 'enhanceTeleBills');
mustContain('dist/assets/pro-native-core-overrides.js', '#table input.jdata[data-map="send"]');

mustContain('dist/assets/pro-native-phase4-readiness.js', 'DOIT_NATIVE_PHASE4_READINESS');
mustContain('dist/assets/pro-native-phase4-readiness.js', 'currentState API available');
mustContain('dist/assets/pro-native-phase4-readiness.js', 'production untouched');

mustContain('dist/assets/pro-print-mode-fixes.js', 'function isTotalLikeRow');
mustContain('dist/assets/pro-print-mode-fixes.js', 'orderPrintFix');
mustContain('dist/assets/pro-print-mode-fixes.js', 'pageStyle');
mustContain('dist/assets/pro-print-mode-fixes.js', '@page { size: A4 portrait; margin: 7mm 4mm 8mm 4mm; }');

mustContain('dist/assets/pro-print-store-bills.js', 'BILL_ROWS=12');
mustContain('dist/assets/pro-print-store-bills.js', 'BILLS_PER_A4=2');
mustContain('dist/assets/pro-print-store-bills.js', 'function buildBills()');
mustContain('dist/assets/pro-print-store-bills.js', 'function renderDoneFromCore()');
mustContain('dist/assets/pro-print-store-bills.js', 'function liveState()');
mustContain('dist/assets/pro-print-store-bills.js', 'window.DOIT_CORE_APP?.currentState?.()');
mustContain('dist/assets/pro-print-store-bills.js', 'const live=liveState();if(live)return live');
mustContain('dist/assets/pro-print-store-bills.js', 'const qty=mapVal(st.send,g.poolKey,store,st.sel)');
mustContain('dist/assets/pro-print-store-bills.js', 'Object.keys(st?.send||{})');
mustNotContain('dist/assets/pro-print-store-bills.js', 'mapVal(st.send,g.poolKey,store,st.sel)+mapVal(st.add');
mustNotContain('dist/assets/pro-print-store-bills.js', '[st?.send,st?.add,st?.pull]');

mustContain('docs/ROADMAP.md', 'Pro Stable = 1026');
mustContain('docs/CLEANUP_AUDIT.md', 'Old public V310 pages redirect');
mustContain('docs/QA_CHECKLIST.md', 'verify:react');
mustContain('docs/FEATURE_RULES.md', 'verify:react');

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

console.log('Smoke check passed: Pro Stable guardrails and Project Pro Native Core phase 4 preview are intact.');
