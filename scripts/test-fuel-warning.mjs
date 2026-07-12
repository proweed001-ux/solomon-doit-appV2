import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('dist/fuel.html', 'utf8');
const match = html.match(/function showFuelWarning\(js,used\)\{[\s\S]*?\}\n(?=async function fetchRealFuelPrices)/);
assert.ok(match, 'Fuel warning function must exist in deployed fuel.html');

function run(js, used) {
  const classes = new Set();
  const box = {
    className: '',
    textContent: '',
    classList: { add: (...names) => names.forEach(name => classes.add(name)) },
  };
  const context = {
    q: id => id === 'fuelWarning' ? box : null,
    n: value => Number(value || 0) || 0,
  };
  vm.runInNewContext(`${match[0]};showFuelWarning(input,used)`, {
    ...context,
    input: js,
    used,
  });
  return { box, classes };
}

const fallback = run({
  source: 'ราคาน้ำมันย้อนหลัง.com fallback snapshot',
  liveRecords: 0,
  daily: [{ price: 38.85, sourceIso: '2026-06-19' }],
}, 1);
assert.ok(fallback.classes.has('on'));
assert.ok(!fallback.classes.has('danger'));
assert.match(fallback.box.textContent, /ข้อมูลสดเป็น 0 รายการ/);
assert.match(fallback.box.textContent, /2026-06-19/);

const zero = run({ source: 'live', liveRecords: 0, daily: [] }, 0);
assert.ok(zero.classes.has('on'));
assert.ok(zero.classes.has('danger'));
assert.match(zero.box.textContent, /ไม่มีราคาที่ใช้ได้/);

const live = run({
  source: 'ราคาน้ำมันย้อนหลัง.com',
  liveRecords: 10,
  daily: [{ price: 40.25, sourceIso: '2026-07-12' }],
}, 1);
assert.equal(live.classes.size, 0);
assert.equal(live.box.textContent, '');

console.log('Fuel fallback/zero warning states passed');
