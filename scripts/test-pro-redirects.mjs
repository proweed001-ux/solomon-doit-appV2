import assert from "node:assert/strict";
import fs from "node:fs";

const config = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const expected = new Map([
  ["/pro-native-test.html", "/pro.html?t=1028"],
  ["/pro-native-phase4.html", "/pro.html?t=1028"],
  ["/pro-native-ui.html", "/pro.html?t=1028"],
]);

for (const [source, destination] of expected) {
  const matches = (config.redirects || []).filter((item) => item.source === source);
  assert.equal(matches.length, 1, `${source} must have exactly one redirect`);
  assert.equal(matches[0].destination, destination);
  assert.equal(matches[0].permanent, false);
  assert.notEqual(matches[0].source, matches[0].destination, `${source} redirects to itself`);
}

assert.ok(
  !(config.redirects || []).some(
    (item) => item.source === "/pro.html" || item.source === "/pro.html?t=1028",
  ),
  "Active Pro must not redirect back to a legacy checkpoint",
);

console.log("Legacy checkpoint redirect config passed:", Object.fromEntries(expected));
