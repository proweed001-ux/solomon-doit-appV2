import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const entry = path.join(root, "dist/assets/pro/app.js");
const proRoot = path.join(root, "dist/assets/pro");
const read = (file) => fs.readFileSync(file, "utf8");
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");
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
removedProLegacyFiles.forEach((file) =>
  assert.ok(!fs.existsSync(path.join(root, file)), `Removed Pro Legacy file still exists: ${file}`),
);
const modulePattern =
  /(?:import\s+(?:[^;]*?\sfrom\s*)?|export\s+[^;]*?\sfrom\s*)["']([^"']+)["']/g;

function importsOf(file) {
  const imports = [];
  const source = read(file);
  for (const match of source.matchAll(modulePattern)) {
    if (!match[1].startsWith(".")) continue;
    const resolved = path.resolve(path.dirname(file), match[1]);
    imports.push(path.extname(resolved) ? resolved : resolved + ".js");
  }
  return imports;
}

function activeGraph(start) {
  const seen = new Set();
  const visit = (file) => {
    assert.ok(fs.existsSync(file), `Missing imported module: ${relative(file)}`);
    if (seen.has(file)) return;
    seen.add(file);
    importsOf(file).forEach(visit);
  };
  visit(start);
  return seen;
}

const html = read(path.join(root, "dist/pro.html"));
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
assert.equal(scripts.length, 1, "Pro HTML must have one JavaScript entry");
assert.equal(scripts[0][1], "/assets/pro/app.js");
assert.match(scripts[0][0], /type=["']module["']/i);

const graph = activeGraph(entry);
const activeProModules = [...graph]
  .filter((file) => path.dirname(file) === proRoot)
  .map(relative)
  .sort();
const allProModules = fs
  .readdirSync(proRoot)
  .filter((name) => name.endsWith(".js"))
  .map((name) => `dist/assets/pro/${name}`)
  .sort();
assert.deepEqual(
  activeProModules,
  allProModules,
  "Every JavaScript module in dist/assets/pro must be reachable from app.js",
);

[
  "dist/assets/pro/app.js",
  "dist/assets/pro/core.js",
  "dist/assets/pro/state.js",
  "dist/assets/pro/parser-adapter.js",
  "dist/assets/pro/filters.js",
  "dist/assets/pro/real-bills.js",
  "dist/assets/pro/print.js",
  "dist/assets/pro/print-model.js",
].forEach((file) => assert.ok(activeProModules.includes(file), `${file} is not active`));

const activeSource = activeProModules.map((file) => read(path.join(root, file))).join("\n");
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
  "pro-print-store-bills.js",
  "pro-print-mode-fixes.js",
  "pro-print-column-widths.js",
  "pro-print-a4-pro-fix.js",
  "pro-print.css",
  "pro-team-single.js",
  "pro-results-mode.js",
  "pro-native-test.html",
  "pro-native-phase4.html",
  "pro-native-ui.html",
  "pro-action-dump.txt",
].forEach((token) =>
  assert.ok(!activeSource.includes(token), `Active graph contains forbidden token: ${token}`),
);
assert.doesNotMatch(activeSource, /window\.[A-Za-z_$][\w$]*\s*=\s*function\b/);
assert.equal(
  (activeSource.match(/export const state\s*=/g) || []).length,
  1,
  "Active graph must have one state owner",
);
assert.ok(
  [...graph].some(
    (file) => relative(file) === "dist/assets/vendor/xlsx-0.18.5.full.min.js",
  ),
  "Active graph must use the local XLSX bundle",
);

console.log("Active Pro module graph passed:", activeProModules);
