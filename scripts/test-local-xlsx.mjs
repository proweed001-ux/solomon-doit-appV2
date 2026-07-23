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
];
const localUrl = '/assets/vendor/xlsx-0.18.5.full.min.js';

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  assert.ok(html.includes(localUrl), page + ' must use the same-origin XLSX bundle');
  assert.doesNotMatch(html, /https?:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)\/[^\"']*xlsx[^\"']*/i);
}

const proHtml = fs.readFileSync('dist/pro.html', 'utf8');
const proEntry = fs.readFileSync('dist/assets/pro/app.js', 'utf8');
assert.match(
  proHtml,
  /<script type="module" src="\/assets\/pro\/app\.js"><\/script>/,
  'Pro must use its single module entry',
);
assert.ok(
  proEntry.includes('../vendor/xlsx-0.18.5.full.min.js'),
  'Pro module entry must import the same-origin XLSX bundle',
);
assert.doesNotMatch(
  proEntry,
  /https?:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)\/[^"']*xlsx[^"']*/i,
);

const deployed = fs.readFileSync('dist/assets/vendor/xlsx-0.18.5.full.min.js');
const installed = fs.readFileSync('node_modules/xlsx-legacy/dist/xlsx.full.min.js');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
assert.equal(digest(deployed), digest(installed), 'Vendored XLSX must match installed xlsx-legacy alias at 0.18.5');

const context = {};
vm.runInNewContext(deployed.toString('utf8'), context);
assert.equal(context.XLSX?.version, '0.18.5');
assert.equal(typeof context.XLSX?.utils?.book_new, 'function');

console.log('Same-origin XLSX bundle passed:', {
  pages: pages.length,
  proEntry: '/assets/pro/app.js',
  version: context.XLSX.version,
  sha256: digest(deployed),
});
