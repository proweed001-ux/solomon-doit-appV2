import assert from 'node:assert/strict';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('scripts/fixtures/pro-regression-v1.json', 'utf8'));
const core = fs.readFileSync('dist/assets/pro-native-core.js', 'utf8');
const print = fs.readFileSync('dist/assets/pro-print-store-bills.js', 'utf8');

const n = value => Number(value) || 0;
const poolKey = row => [row.brand, row.size, row.code || row.sku, row.sku, row.type].join('|');
const selected = row => !row.isTele
  && fixture.selection.dates.includes(row.date)
  && fixture.selection.ps.includes(row.ps)
  && !fixture.selection.orderStores.includes(row.store)
  && (!fixture.selection.brands.length || fixture.selection.brands.includes(row.brand))
  && (!fixture.selection.types.length || fixture.selection.types.includes(row.type));

const rows = fixture.rows.filter(selected);
const groups = new Map();
for (const row of rows) {
  const key = poolKey(row);
  const group = groups.get(key) || { poolKey: key, qty: 0, rawAmount: 0, netAmount: 0 };
  group.qty += n(row.qty);
  group.rawAmount += n(row.rawAmt);
  group.netAmount += n(row.netAmt);
  groups.set(key, group);
}

const manualTotal = (kind, key) => fixture.manual[kind]
  .filter(item => item.poolKey === key)
  .reduce((sum, item) => sum + n(item.qty), 0);
const groupList = [...groups.values()];
const sentQty = groupList.reduce((sum, group) => sum + manualTotal('send', group.poolKey), 0);
const remainingQty = groupList.reduce((sum, group) => sum
  + group.qty
  - manualTotal('send', group.poolKey)
  + manualTotal('add', group.poolKey)
  - manualTotal('pull', group.poolKey), 0);
const printLines = groupList
  .map(group => {
    const qty = manualTotal('send', group.poolKey);
    const unit = group.qty ? (group.netAmount / group.qty) * 1.07 : 0;
    return { qty, unit, total: qty * unit };
  })
  .filter(line => line.qty > 0);
const printRawTotal = printLines.reduce((sum, line) => sum + line.total, 0);
const teleRows = fixture.rows.filter(row => row.isTele
  && fixture.selection.dates.includes(row.date)
  && fixture.selection.ps.includes(row.ps));
const teleBills = new Set(teleRows.map(row => [row.inv, row.store, row.tele, row.date].join('|')));

assert.equal(rows.length, fixture.expected.filteredRows);
assert.equal(groupList.length, fixture.expected.pickGroups);
assert.equal(groupList.reduce((sum, group) => sum + group.qty, 0), fixture.expected.sourceQty);
assert.equal(groupList.reduce((sum, group) => sum + group.rawAmount, 0), fixture.expected.rawAmount);
assert.equal(groupList.reduce((sum, group) => sum + group.netAmount, 0), fixture.expected.netAmount);
assert.ok(Math.abs(groupList.reduce((sum, group) => sum + group.netAmount, 0) * 1.07 - fixture.expected.vatAmount) < 1e-9);
assert.equal(sentQty, fixture.expected.sentQty);
assert.equal(remainingQty, fixture.expected.remainingQty);
assert.equal(printLines.length, fixture.expected.printRows);
assert.equal(printLines.reduce((sum, line) => sum + line.qty, 0), fixture.expected.printQty);
assert.ok(Math.abs(printRawTotal - fixture.expected.printRawTotal) < 1e-9);
assert.equal(Math.floor(printRawTotal), fixture.expected.printStoreTotal);
assert.equal(Math.ceil(printLines.length / 12), fixture.expected.printBills);
assert.equal(teleRows.length, fixture.expected.teleRows);
assert.equal(teleBills.size, fixture.expected.teleBills);
assert.equal(teleRows.reduce((sum, row) => sum + row.qty, 0), fixture.expected.teleQty);
assert.equal(teleRows.reduce((sum, row) => sum + row.rawAmt, 0), fixture.expected.teleRaw);
assert.ok(Math.abs(teleRows.reduce((sum, row) => sum + (row.netAmt || row.rawAmt) * 1.07, 0) - fixture.expected.teleVat) < 1e-9);

// Legacy baseline contracts. These are replaced by direct module assertions after the migration.
assert.match(core, /return'doit-core-unified-v1:'\+key/, 'LocalStorage key prefix changed');
assert.match(core, /netUnit:qty\?net\/qty:0/, 'Net unit formula changed');
assert.match(core, /\(N\(g\.netAmt\)\|\|N\(g\.rawAmt\)\)\*1\.07/, 'VAT formula changed');
assert.match(core, /currentState:\(\)=>JSON\.parse\(snap\(\)\)/, 'Current state is no longer closure-native');
assert.match(print, /BILL_ROWS=12/, 'Print rows per bill changed');
assert.match(print, /BILLS_PER_A4=2/, 'Bills per A4 changed');
assert.match(print, /const qty=mapVal\(st\.send,g\.poolKey,store,st\.sel\)/, 'Print must use send only');
assert.match(print, /return rows\.filter\(r=>T\(r\.name\)&&N\(r\.qty\)>0\)/, 'Zero-quantity print filter changed');

console.log('Pro regression baseline passed:', fixture.expected);
