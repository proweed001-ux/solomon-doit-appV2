import assert from 'node:assert/strict';
import fs from 'node:fs';
import { _test } from '../api/admin-storage.js';

const basic = (id, password) => `Basic ${Buffer.from(`${id}:${password}`).toString('base64')}`;
assert.equal(_test.authenticate({ headers: { authorization: basic('AYAADS01', 'admin') } }), 'AYAADS01');
assert.equal(_test.authenticate({ headers: { authorization: basic('AYAPS062', 'admin') } }), 'AYAPS062');
assert.equal(_test.authenticate({ headers: { authorization: basic('AYAPS062', 'wrong') } }), null);
assert.equal(_test.authenticate({ headers: { authorization: basic('UNKNOWN', 'admin') } }), null);

for (const path of ['../outside.txt', 'doit/../performance/active.json', '/performance/old.json', 'parsed/%2e%2e/active.json', 'team\\old.png']) {
  assert.equal(_test.inspectPath(path).ok, false, `path must be rejected: ${path}`);
}
assert.equal(_test.inspectPath('parsed/2026-04-01/old.json').deleteFolderAllowed, true);
assert.equal(_test.inspectPath('team/old.png').deleteFolderAllowed, true);
assert.equal(_test.inspectPath('future-folder/old.json').deleteFolderAllowed, true);
assert.equal(_test.inspectPath('root-file.json').deleteFolderAllowed, true);
assert.equal(_test.validFolderPath('doit'), true);
assert.equal(_test.validFolderPath('performance/compare'), true);
assert.equal(_test.validFolderPath('../outside'), false);

const active = {
  dataPath: 'performance/2026-05-01/current.json',
  latestPath: 'parsed/2026-07-12/latest.json',
  previous: { dataPath: 'parsed/2026-07-11/previous.json' },
  history: [{ path: 'performance/2026-04-01/history.json' }],
};
const make = (path, updated_at, size = 100) => ({ path, updated_at, created_at: updated_at, size });
const fixtures = [
  make('performance/active.json', '2025-01-01T00:00:00Z'),
  make('performance/index.json', '2025-01-01T00:00:00Z'),
  make('performance/current.min.json', '2025-01-01T00:00:00Z'),
  make('performance/history-index.json', '2025-01-01T00:00:00Z'),
  make('parsed/2025-01-01/previous.json', '2025-01-01T00:00:00Z'),
  make('performance/2026-05-01/current.json', '2026-05-01T00:00:00Z'),
  make('performance/2026-07-01/month.json', '2026-07-01T00:00:00Z'),
  make('performance/2026-04-01/history.json', '2026-04-01T00:00:00Z'),
  make('performance/2026-04-01/ordinary.json', '2026-04-01T00:00:00Z'),
  make('parsed/2026-07-12/latest.json', '2026-07-12T00:00:00Z'),
  make('parsed/2026-07-11/previous.json', '2026-07-11T00:00:00Z'),
  make('parsed/2026-05-01/ordinary.json', '2026-05-01T00:00:00Z'),
  make('team/2026-01-01/old.png', '2026-01-01T00:00:00Z'),
  make('parsed/2026-07-12/active-manifest.json', '2026-07-12T00:00:00Z'),
  make('parsed/2026-07-12/active-bundle/part-0001.json', '2026-07-12T00:00:00Z'),
];
const activeDoitPaths = new Set([
  'parsed/2026-07-12/active-manifest.json',
  'parsed/2026-07-12/active-bundle/part-0001.json',
]);
const rows = _test.classifyFiles(fixtures, active, 30, new Date('2026-07-12T12:00:00Z'), activeDoitPaths);
const byPath = new Map(rows.map(row => [row.path, row]));

for (const path of [
  'performance/active.json',
  'performance/index.json',
  'performance/current.min.json',
  'performance/history-index.json',
  'parsed/2025-01-01/previous.json',
  'performance/2026-05-01/current.json',
  'performance/2026-04-01/history.json',
  'parsed/2026-07-12/latest.json',
  'parsed/2026-07-11/previous.json',
  'parsed/2026-07-12/active-manifest.json',
  'parsed/2026-07-12/active-bundle/part-0001.json',
]) {
  assert.equal(byPath.get(path)?.deletable, false, `protected file entered delete flow: ${path}`);
}

const ordinary = 'parsed/2026-05-01/ordinary.json';
assert.equal(byPath.get(ordinary)?.deletable, true, 'ordinary file must enter delete flow after login');
assert.equal(byPath.get('performance/2026-07-01/month.json')?.deletable, true, 'inactive current-month performance file must be deletable');
assert.equal(byPath.get('team/2026-01-01/old.png')?.deletable, true, 'team file must be deletable');
assert.equal(_test.validateDeleteSelection(rows, [ordinary], { activeLoaded: true, truncated: false }).ok, true);
assert.equal(_test.validateDeleteSelection(rows, ['performance/active.json'], { activeLoaded: true, truncated: false }).error, 'protected_file');
assert.equal(_test.validateDeleteSelection(rows, [ordinary], { activeLoaded: false, truncated: false }).error, 'active_guard_unavailable');
assert.equal(_test.validateDeleteSelection(rows, [ordinary], { activeLoaded: true, truncated: true }).error, 'inventory_truncated');
assert.equal(_test.MAX_DELETE, 20);

const fakeJwt = payload => `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.${'x'.repeat(80)}`;
assert.equal(_test.validAnonKey(fakeJwt({ iss: 'supabase', role: 'anon', ref: 'saodmeoilixfdqentofp' })), true);
assert.equal(_test.validAnonKey(fakeJwt({ iss: 'supabase', role: 'service_role', ref: 'saodmeoilixfdqentofp' })), false);
assert.equal(_test.validAnonKey('sb_publishable_abcdefghijklmnopqrstuvwxyz1234567890'), true);
assert.equal(_test.validAnonKey('sb_secret_abcdefghijklmnopqrstuvwxyz1234567890'), false);


const storageUi = fs.readFileSync(new URL('../dist/assets/admin-storage-manager-v1.js', import.meta.url), 'utf8');
const adminHtml = fs.readFileSync(new URL('../dist/admin.html', import.meta.url), 'utf8');
assert.match(storageUi, /const collapsedFolders=new Set\(\)/, 'folder collapse state must exist');
assert.match(storageUi, /class="storageFolderToggle"/, 'folder header must be a toggle button');
assert.match(storageUi, /aria-expanded=/, 'folder toggle must expose expanded state');
assert.match(storageUi, /collapsedFolders\.has\(folder\)/, 'folder rows must support collapse and expand');
assert.match(adminHtml, /admin-storage-manager-v1\.js\?v=7/, 'admin must load the current storage UI asset');
assert.match(adminHtml, /แตะชื่อโฟลเดอร์เพื่อพับ\/ขยาย/, 'admin must explain folder collapse control');

console.log('admin storage guard regression: PASS');
