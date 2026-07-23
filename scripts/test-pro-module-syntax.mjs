import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const proRoot = path.join(root, "dist/assets/pro");
const modules = fs
  .readdirSync(proRoot)
  .filter((name) => name.endsWith(".js"))
  .map((name) => path.join(proRoot, name))
  .sort();

for (const file of modules) {
  execFileSync(process.execPath, ["--check", file], {
    cwd: root,
    stdio: "pipe",
  });
}

const app = fs.readFileSync(path.join(proRoot, "app.js"), "utf8");
assert.match(app, /import "\.\/core\.js";/);
assert.match(app, /import "\.\.\/vendor\/xlsx-0\.18\.5\.full\.min\.js";/);

console.log(`Pro module syntax passed for ${modules.length} active modules.`);
