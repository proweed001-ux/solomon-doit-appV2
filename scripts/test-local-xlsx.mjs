import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const pages = [
  'dist/admin.html',
  'dist/fuel.html',
  'dist/pick.html',
  'dist/pro-native-phase4.html',
  'dist/pro-native-test.html',
  'dist/pro-shell-v1028.html',
];
const localUrl = '/assets/vendor/xlsx-0.18.5.full.min.js';

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  assert.ok(html.includes(localUrl), page + ' must use the same-origin XLSX bundle');
  assert.doesNotMatch(html, /https?:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)\/[^\"']*xlsx[^\"']*/i);
}

const deployed = fs.readFileSync('dist/assets/vendor/xlsx-0.18.5.full.min.js');
const installed = fs.readFileSync('node_modules/xlsx/dist/xlsx.full.min.js');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
assert.equal(digest(deployed), digest(installed), 'Vendored XLSX must match installed xlsx@0.18.5');

const context = {};
vm.runInNewContext(deployed.toString('utf8'), context);
assert.equal(context.XLSX?.version, '0.18.5');
assert.equal(typeof context.XLSX?.utils?.book_new, 'function');

console.log('Same-origin XLSX bundle passed:', {
  pages: pages.length,
  version: context.XLSX.version,
  sha256: digest(deployed),
});
