import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../dist/fuel.html', import.meta.url), 'utf8');

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const bodyStart = html.indexOf('{', start);
  let depth = 0;
  for (let i = bodyStart; i < html.length; i += 1) {
    if (html[i] === '{') depth += 1;
    if (html[i] === '}') depth -= 1;
    if (depth === 0) return html.slice(start, i + 1);
  }
  throw new Error(`unterminated function ${name}`);
}

const rows = [
  { route: 'R01', km: '99' },
  { route: 'หยุด', km: '99' },
  { route: 'ประชุม canvass', km: '99' },
  { route: 'อื่นๆ', km: '99' },
  { route: '', km: '99' },
  { route: 'R02', km: '99' },
];
const randomValues = [0, 0.5, 0.9999];
let randomIndex = 0;

const context = {
  rows,
  days: () => rows.length,
  row: (index) => rows[index],
  deterministicRandom: () => randomValues[randomIndex++],
};
vm.createContext(context);
vm.runInContext(
  [
    extractFunction('isRandomKmExcluded'),
    extractFunction('randomKmInteger'),
    extractFunction('fillRandomKm'),
    extractFunction('clearExcludedKm'),
  ].join('\n'),
  context,
);

const result = vm.runInContext(
  'fillRandomKm(10, 20, deterministicRandom)',
  context,
);
assert.deepEqual(
  JSON.parse(JSON.stringify(result)),
  { applied: 3, skipped: 3 },
);
assert.deepEqual(rows.map((item) => item.km), ['10', '', '', '', '15', '20']);

rows[0].route = 'อื่นๆ';
rows[0].km = '18';
vm.runInContext('clearExcludedKm(0)', context);
assert.equal(rows[0].km, '');

assert.match(html, /สุ่มจำนวน กม\. ทั้งเดือน/);
assert.match(html, /\^rows\\\.\\d\+\\\.km\$/);
assert.match(html, /editing\?\.type==='km-range'\?applyKmRandomRange\(\)/);
assert.match(html, /state\.kmMin=String\(min\);state\.kmMax=String\(max\)/);

console.log('Fuel random KM tests passed');
