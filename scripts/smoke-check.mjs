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
  "scripts/test-performance-cd123.mjs",
  "README.md",
  "dist/index.html",
  "dist/pro.html",
  "dist/admin.html",
  "dist/admin-login.html",
  "dist/performance.html",
  "dist/performance-reveal.html",
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
  'git diff --check "$PRO_SMOKE_BASE_SHA"...HEAD',
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
mustContain("dist/assets/admin-json-v265.js", "AbortController");
mustContain("dist/assets/admin-json-v265.js", "storage_path:dataPath");
mustContain("dist/assets/admin-json-v265.js", "source_file:{name:file.name,size:file.size,stored:false}");
mustNotContain("dist/assets/admin-json-v265.js", "อัปโหลด Excel ต้นฉบับ");
mustNotContain("dist/assets/admin-json-v265.js", "xPath");
mustContain("dist/admin.html", "/assets/admin-upload-v001.js?v=301");
mustContain("dist/admin.html", "/assets/admin-json-v265.js?v=336");
mustContain("dist/assets/admin-json-v265.js", "old.disabled=true");
mustContain(
  "dist/assets/admin-upload-v001.js",
  "ปุ่มนี้ถูกโอนให้ admin-json-v265.js จัดการแล้ว",
);
mustNotContain("dist/assets/admin-upload-v001.js", "FileReader");
mustNotContain("dist/assets/admin-upload-v001.js", "XLSX.read");
mustContain("dist/assets/admin-json-v265.js", "internalStream('string')");
mustContain("dist/assets/admin-json-v265.js", "CHUNK_ROWS=500");
mustNotContain("dist/assets/admin-progress-popup-v1.js", "btn.click()");
mustNotContain("dist/assets/admin-progress-popup-v1.js", "lastAutoActive");
mustNotContain("dist/assets/admin-progress-popup-v1.js", "file.addEventListener('change'");
mustContain("dist/assets/admin-progress-popup-v1.js", "adminPopClose");
mustContain("dist/assets/admin-json-v265.js", "xhr.upload.onprogress");
mustContain("dist/assets/admin-json-v265.js", "verifyUploadedObject");
mustContain("dist/assets/admin-storage-manager-v1.js", "ยังไม่สแกน Storage อัตโนมัติ");
mustNotContain("dist/assets/admin-performance-active-v2.js", "window.XLSX.read=function");

// Performance dashboard and active metadata guardrails.
mustContain("dist/performance.html", "/assets/performance-board-v4.js");
mustContain("dist/performance.html", "href='/performance-reveal'");
mustContain("dist/performance-reveal.html", "/performance?mode=ds");
mustContain("dist/performance-reveal.html", "performance/current.min.json");
mustContain("dist/performance-reveal.html", "loadPerformanceData()");
mustContain("dist/performance-reveal.html", "performance/history-index.json");
mustContain("dist/performance-reveal.html", "function loadPerformanceTimeline");
mustContain("dist/performance-reveal.html", "function metricPercent");
mustContain("dist/performance-reveal.html", "TOP VOLUME");
mustContain("dist/performance-reveal.html", "TOP DGP");
mustNotContain("dist/performance-reveal.html", "Top Best Volume");
mustNotContain("dist/performance-reveal.html", "Top MOQ");
mustNotContain("dist/performance-reveal.html", "ยังไม่มีช่วงย้อนหลังสำหรับการแซง");
mustNotContain("dist/performance-reveal.html", "ตำแหน่งคงที่ • แท่งแซงกัน • เปิดอันดับตอนจบ");
mustNotContain("dist/performance-reveal.html", "CHAMPIONS OF JUNE 2026");
mustContain("dist/performance-reveal.html", "LATEST PERFORMANCE CHAMPIONS");
mustContain("dist/performance-reveal.html", "function reportPeriodDate");
mustContain("dist/performance-reveal.html", "updatePerformancePeriod(latest.meta || {})");
mustContain("dist/performance-reveal.html", "CHAMPIONS OF ${monthYear.toUpperCase()}");
mustContain("dist/performance-reveal.html", "function combinedCd123Metric");
mustContain("dist/performance-reveal.html", 'title: "TOP CD123"');
mustContain("dist/performance-reveal.html", 'subtitle: "CD1 + CD2 + CD3"');
mustContain("dist/performance-reveal.html", 'const metrics = ["dc1", "dc2", "dc3"].map');
mustContain("dist/performance-reveal.html", 'if (key === "cd123") return combinedCd123Metric(row).actual');
mustContain("dist/performance-reveal.html", 'if (key === "cd123") return combinedCd123Metric(row).index');
mustNotContain("dist/performance-reveal.html", "combinedCd13Metric");
mustNotContain("dist/performance-reveal.html", "CD1 + CD3 (ไม่รวม CD2)");
mustContain("dist/performance-reveal.html", "function startRace");
mustContain("dist/performance-reveal.html", "performance/compare/");
mustContain("dist/performance-reveal.html", "compactHistory");
mustContain("dist/performance-reveal.html", "parts.bar.style.height");
mustContain("dist/performance-reveal.html", "translateX(${laneIndex * 100}%)");
mustContain("dist/performance-reveal.html", "RACE_DURATION_MS = 10000");
mustContain("dist/performance-reveal.html", "function latestRaceFinalists");
mustContain("dist/performance-reveal.html", "function animateRaceTimeline");
mustContain("dist/performance-reveal.html", "race-finished");
mustContain("dist/performance-reveal.html", "--race-lanes");
mustContain("dist/performance-reveal.html", "person.value > 0");
mustContain("dist/performance-reveal.html", "เปิดอันดับแล้ว");
mustNotContain("dist/performance-reveal.html", "translateX(${visible ? rank * 100 : 520}%)");
mustNotContain("dist/performance-reveal.html", "parts.bar.style.width");
mustContain("dist/performance-reveal.html", "function revealRace");
mustContain("dist/performance-reveal.html", "race-award-badge");
mustContain("dist/performance-reveal.html", "race-award-badge-label");
mustContain("dist/performance-reveal.html", '<span class="race-award-badge-label">${cat.title}</span>');
mustContain("dist/performance-reveal.html", "width: max-content");
mustContain("dist/performance-reveal.html", "aspect-ratio: 1");
mustNotContain("dist/performance-reveal.html", '<span class="text-4xl font-black text-black">TOP 5</span>');
mustNotContain("dist/performance-reveal.html", "function animateRaceTransition");
mustContain("dist/performance-reveal.html", "function raceActualValue");
mustContain("dist/performance-reveal.html", "function raceRankingValue");
mustContain("dist/performance-reveal.html", "function rankByPercent");
mustContain("dist/performance-reveal.html", 'const salesWinners = rankByPercent(rows, "sales", 3)');
mustContain("dist/performance-reveal.html", "top: rankByPercent(rows, category.key, 5)");
mustContain("dist/performance-reveal.html", "parts.percent.hidden = false");
mustContain("dist/performance-reveal.html", "percent.hidden = false");
mustContain("dist/performance-reveal.html", "Math.trunc((numberValue(value) * 100) + 1e-9) / 100");
mustContain("dist/performance-reveal.html", "minimumFractionDigits: 2");
mustContain("dist/performance-reveal.html", "maximumFractionDigits: 2");
mustContain("dist/performance-reveal.html", "if (target > 0) return (actual / target) * 100;");
mustContain("dist/performance-reveal.html", "if (directTarget > 0)");
mustContain("dist/performance-reveal.html", "const complete = metrics.every");
mustContain("dist/performance-reveal.html", "incomplete: !complete");
mustNotContain("dist/performance-reveal.html", "const directIndex = numberValue(direct.index);");
mustNotContain("dist/performance-reveal.html", "if (directIndex > 0) return directIndex;");
mustContain("dist/performance-reveal.html", "function moqMetric(row)");
mustContain("dist/assets/admin-performance-active-v2.js", "function moqMetric(o)");
mustContain("dist/assets/admin-performance-active-v2.js", "moq:moqMetric(o)");
mustNotContain("dist/assets/admin-performance-active-v2.js", "moq:{target:0");
mustNotContain("dist/assets/performance-board-v4.js", "target=actual/(index/100)");
mustNotContain("dist/assets/performance-cd-adapter-v1.js", "target=actual/(index/100)");
mustNotContain("dist/performance-reveal.html", "target = actual / (index / 100)");
mustContain("dist/performance-reveal.html", "เป้าหมายการกระจาย SBD");
mustContain("dist/performance-reveal.html", "function hydratePerformancePack(pack, fallbackPack = null)");
mustContain("dist/performance-reveal.html", ".map(result => hydratePerformancePack(result.value, latest))");
mustContain("dist/performance-reveal.html", "/assets/performance-cd-adapter-v1.js?v=5");
mustContain("dist/assets/performance-cd-adapter-v1.js", "function patchMoq(pack)");
mustContain("dist/assets/performance-cd-adapter-v1.js", "patchMoq(full)");
mustContain("dist/assets/performance-cd-adapter-v1.js", "function copyMoq(dst,src)");
mustContain("dist/assets/performance-cd-adapter-v1.js", "performance-cd-adapter-v5-cd123");
mustContain("dist/assets/performance-cd-adapter-v1.js", "let target=sellerTarget||N(direct.target)");
mustContain("dist/assets/performance-board-v4.js", "let target=sellerTarget||N(v.target)");
mustContain("dist/performance-reveal.html", "let target = sellerTarget || numberValue(direct.target);");
mustContain("dist/performance.html", "performance-cd-adapter-v1.js?v=5");
mustContain("dist/performance.html", "performance-board-v4.js?v=11");
mustContain("dist/performance-reveal.html", "const metric = performanceMetric(row, key);");
mustContain("dist/assets/admin-performance-active-v2.js", "function cd123Metric(o)");
mustContain("dist/assets/admin-performance-active-v2.js", "cd123:cd123Metric(o)");
mustContain("dist/assets/admin-performance-active-v2.js", "'Target CD1+2+3'");
mustContain("dist/assets/admin-performance-active-v2.js", "'การกระจาย CD1+2+3'");
mustContain("dist/assets/admin-performance-active-v2.js", "'Index CD1+2+3'");
mustContain("dist/assets/admin-performance-active-v2.js", "performance-min-v5");
mustContain("dist/assets/performance-cd-adapter-v1.js", "function isCd123Name(t)");
mustContain("dist/assets/performance-cd-adapter-v1.js", "const CD_KEYS=['dc1','dc2','dc3','cd13','cd123']");
mustContain("dist/assets/performance-board-v4.js", "cd123:'CD1+2+3'");
mustNotContain("dist/assets/performance-board-v4.js", "cd13:'CD1+CD3'");
mustContain("dist/admin.html", "admin-performance-active-v2.js?v=3");
mustContain("dist/performance-reveal.html", "function compareMetricRows");
mustContain("dist/performance-reveal.html", "function compareRaceRows");
mustNotContain("dist/performance-reveal.html", "{rank:1,name:");
mustContain(".github/workflows/web-ci.yml", "Performance CD123 regression");
mustContain(".github/workflows/web-ci.yml", "node scripts/test-performance-cd123.mjs");

mustNotContain("dist/performance-reveal.html", "จัดอันดับตามยอดขายสูงสุด");
mustNotContain("dist/performance-reveal.html", 'container._raceMetricKey === "sales"');
mustContain("dist/performance-reveal.html", "/assets/audio/performance-race.mp3");
mustContain("dist/performance-reveal.html", "/assets/audio/performance-applause.mp3");
mustContain("dist/performance-reveal.html", "/assets/audio/performance-fireworks.mp3");
mustContain("dist/performance-reveal.html", "function performanceAudioTrack");
mustContain("dist/performance-reveal.html", "function stopAllPerformanceAudio");
mustContain("dist/performance-reveal.html", "function playRaceAudio");
mustContain("dist/performance-reveal.html", "function playCountdownTone");
mustContain("dist/performance-reveal.html", "context.createOscillator()");
check(
  (read("dist/performance-reveal.html").match(/playCountdownTone\(false\);/g) || []).length === 3,
  "Performance countdown must play exactly three short beeps",
);
check(
  (read("dist/performance-reveal.html").match(/playCountdownTone\(true\);/g) || []).length === 1,
  "Performance GO must play exactly one synthesized long tone",
);
mustNotContain("dist/performance-reveal.html", "playPerformanceTrack(\"go\")");
check(!exists("dist/assets/performance-go-media-v1.js"), "Performance GO media asset must be removed");
mustNotContain("dist/performance-reveal.html", "performance-go-media-v1.js");
mustNotContain("dist/performance-reveal.html", "suspense-go-image");
mustContain("dist/performance-reveal.html", 'number.textContent = "GO!"');
mustContain("dist/performance-reveal.html", "function playWinnerAudio");
mustContain("dist/performance-reveal.html", "playPerformanceTrack(\"applause\")");
mustContain("dist/performance-reveal.html", "playPerformanceTrack(\"fireworks\")");
mustContain("dist/performance-reveal.html", "}, 5000)");
mustContain("dist/performance-reveal.html", "stopPerformanceTrack(\"race\")");
mustNotContain("dist/performance-reveal.html", "function unlockPerformanceAudio");
mustNotContain("dist/performance-reveal.html", "function playRaceSuspense");
mustNotContain("dist/performance-reveal.html", "playRaceSuspense(");
mustNotContain("dist/performance-reveal.html", "soundCueIndex");
mustNotContain("dist/performance-reveal.html", "soundCues");
mustNotContain("dist/performance-reveal.html", "function playNoiseBurst");
mustNotContain("dist/performance-reveal.html", "function playFireworkBurst");
mustNotContain("dist/performance-reveal.html", "function playApplauseAndFireworks");
[
  "dist/assets/audio/performance-race.mp3",
  "dist/assets/audio/performance-applause.mp3",
  "dist/assets/audio/performance-fireworks.mp3",
].forEach((p) => check(exists(p), `Performance audio file must exist: ${p}`));
mustContain("dist/performance-reveal.html", "function showWinnerReveal");
mustContain("dist/performance-reveal.html", "function handleRaceCardClick");
mustContain("dist/performance-reveal.html", "winner-photo");
mustContain("dist/performance-reveal.html", "winner-photo-bg");
mustContain("dist/performance-reveal.html", "object-fit: cover");
mustContain("dist/performance-reveal.html", "winner-photo-frame");
mustContain("dist/performance-reveal.html", "width: min(76vmin, 720px)");
mustContain("dist/performance-reveal.html", "border-radius: 50%");
mustContain("dist/performance-reveal.html", "object-fit: cover");
mustContain("dist/performance-reveal.html", "blur(30px)");
mustContain("dist/performance-reveal.html", "--winner-caption-height");
mustContain("dist/performance-reveal.html", "border: clamp(5px, 0.8vmin, 10px) solid #d6ad24");
mustContain("dist/performance-reveal.html", "top: calc((100% - var(--winner-caption-height)) / 2)");
mustContain("dist/performance-reveal.html", "transform: translate(-50%, -50%) scale(1)");
mustNotContain("dist/performance-reveal.html", "height: auto;\n            object-fit: contain");
mustContain("dist/performance-reveal.html", "background: transparent");
mustContain("dist/performance-reveal.html", "position: absolute;\n            left: 0;\n            right: 0;\n            bottom: 0;");
mustNotContain("dist/performance-reveal.html", "flex: 0 0 var(--winner-caption-height)");
mustContain("dist/performance-reveal.html", 'aria-label="กลับไปดูอันดับ"');
mustContain("dist/performance-reveal.html", "winner-fireworks");
mustContain("dist/performance-reveal.html", "@keyframes winnerFirework");
mustContain("dist/performance-reveal.html", "for (let index = 0; index < 48; index += 1)");
mustContain("dist/performance-reveal.html", "body.presentation-mode main");
mustContain("dist/performance-reveal.html", "grid-template-rows: minmax(0, 1fr) auto");
mustNotContain("dist/performance-reveal.html", "winner-crown");
mustNotContain("dist/performance-reveal.html", "border: 1px solid rgba(250,204,21,0.5)");
mustContain("dist/performance-reveal.html", "container._raceFinished = Boolean(winner)");
mustContain("dist/performance-reveal.html", "แตะกรอบเพื่อเปิดผู้ชนะ");
mustContain("dist/performance-reveal.html", ".race-row .race-rank,");
mustContain("dist/performance-reveal.html", "color: #ffffff");
mustContain("dist/performance-reveal.html", 'id="fullscreen-toggle"');
mustContain("dist/performance-reveal.html", "function toggleFullscreenMode");
mustContain("dist/performance-reveal.html", "requestFullscreen");
mustContain("dist/performance-reveal.html", "webkitRequestFullscreen");
mustContain("dist/performance-reveal.html", "fullscreenchange");
mustContain("dist/performance-reveal.html", "pseudo-fullscreen");
mustContain("dist/performance-reveal.html", "100dvh");
mustContain("dist/performance-reveal.html", "safe-area-inset-top");
mustContain("dist/performance-reveal.html", "function movePresentationAward");
mustContain("dist/performance-reveal.html", "presentation-arrow previous");
mustContain("dist/performance-reveal.html", "body.presentation-mode .race-header");
mustContain("dist/performance-reveal.html", "body.presentation-mode .nav-actions");
mustContain("dist/performance-reveal.html", "grid-template-rows: minmax(0, 1fr)");
mustContain("dist/performance-reveal.html", "pseudoFullscreenHistoryPushed");
mustContain("dist/performance-reveal.html", 'window.addEventListener("popstate"');
mustContain("dist/performance-reveal.html", 'event.key === "ArrowLeft"');
mustContain("dist/performance-reveal.html", "winner-overlay-open");
mustNotContain("dist/performance-reveal.html", 'data-award-key="overall"');
mustNotContain("dist/performance-reveal.html", '{ key: "giv", suffix: "giv"');
mustContain("dist/performance-reveal.html", "function formatRaceActual");
mustContain("dist/performance-reveal.html", "race-actual");
mustContain("dist/performance-reveal.html", "container._raceMetricKey");
mustContain("dist/performance-reveal.html", "actual: startActual");
mustContain("dist/performance-reveal.html", "max-width: 1280px");
mustContain("dist/performance-reveal.html", "grid-template-rows: auto minmax(0, 1fr) auto");
mustContain("dist/performance-reveal.html", ".award-slide.category-card.race-card {");
mustContain("dist/performance-reveal.html", "display: none;");
mustContain("dist/performance-reveal.html", ".overall-award > .race-card");
mustContain("dist/performance-reveal.html", ".award-stage > [id^=\"categories-area-\"]");
mustContain("dist/performance-reveal.html", "function revealRaceRanks");
mustNotContain("dist/performance-reveal.html", "renderRaceRows(container, frames.at(-1).rows, true)");
mustContain("dist/performance-reveal.html", "data-final-rank=\"1\"");
mustContain("dist/performance-reveal.html", "data-final-rank=\"2\"");
mustContain("dist/performance-reveal.html", "data-final-rank=\"3\"");
mustContain("dist/performance-reveal.html", "container._raceFinalRankById");
mustContain("dist/performance-reveal.html", "row.dataset.finalRank");
mustContain("dist/performance-reveal.html", "white-space: normal");
mustNotContain("dist/performance-reveal.html", "RACE_DURATION_MS = 5000");
mustNotContain("dist/performance-reveal.html", "race-finished[data-rank=\"2\"] .race-bar");
mustContain("dist/performance-reveal.html", "race-avatar");
mustContain("dist/performance-reveal.html", "race-bar-copy");
mustContain("dist/performance-reveal.html", "race-name");
mustContain("dist/performance-reveal.html", "race-code");
mustContain("dist/performance-reveal.html", "winner-code");
mustContain("dist/performance-reveal.html", 'const IMAGEKIT_PROFILE_URL = "https://ik.imagekit.io/AYAPS";');
mustContain("dist/performance-reveal.html", "`${IMAGEKIT_PROFILE_URL}/${encodeURIComponent(code)}.webp`");
mustContain("dist/performance-reveal.html", "code: profileKey(row, mode) || rowIdentity(row, mode)");
mustContain("dist/performance-reveal.html", "winnerCode.textContent = code");
mustNotContain("dist/performance-reveal.html", 'if (mode === "ads") return code || name || "-";');
mustContain("dist/performance-reveal.html", "race-started");
mustNotContain("dist/performance-reveal.html", "race-person");
mustContain("dist/performance-reveal.html", "แข่งขันด้วย % Index เทียบเป้า");
mustNotContain("dist/performance-reveal.html", ".slice(-6)");
mustContain("dist/performance-reveal.html", "PERFORMANCE_HISTORY_CACHE");
mustContain("dist/performance-reveal.html", "caches.open(PERFORMANCE_HISTORY_CACHE)");
mustContain("dist/performance-reveal.html", "rememberHistory: true");
mustContain("dist/performance-reveal.html", "performanceCacheStats");
mustContain("dist/performance-reveal.html", "โหลดใหม่");
mustNotContain("dist/performance-reveal.html", "function revealPodium");
mustNotContain("dist/performance-reveal.html", "function revealCategory");
mustContain("dist/performance-reveal.html", "data-award-slide");
mustContain("dist/performance-reveal.html", "function showAward");
mustContain("dist/performance-reveal.html", "function moveAward");
mustContain("dist/performance-reveal.html", "award-slide category-card");
mustContain("dist/performance-reveal.html", "รางวัลถัดไป");
mustNotContain("dist/performance-reveal.html", "2xl:grid-cols-7");
mustNotContain("dist/performance-reveal.html", "scontent.");
mustNotContain("dist/performance-reveal.html", "raw.githubusercontent.com");
mustContain("vercel.json", "\"source\": \"/performance-reveal\"");
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
