import fs from 'node:fs';

const PACKAGE_FILE = 'package.json';
const LOCK_FILE = 'package-lock.json';
const SHEETJS_URL = 'https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz';
const SHEETJS_INTEGRITY = 'sha512-oLDq3jw7AcLqKWH2AhCpVTZl8mf6X2YReP+Neh0SJUzV/BdZYjth94tG5toiMB1PPrYtxOCfaoUCkvtuH+3AJA==';

const packageJson = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
if (packageJson.dependencies?.xlsx !== SHEETJS_URL) throw new Error('sheetjs_package_url_mismatch');
if (lock.lockfileVersion !== 3 || !lock.packages?.['']) throw new Error('unsupported_package_lock');

lock.packages[''].dependencies ||= {};
lock.packages[''].dependencies.xlsx = SHEETJS_URL;
lock.packages['node_modules/xlsx'] = {
  version: '0.20.3',
  resolved: SHEETJS_URL,
  integrity: SHEETJS_INTEGRITY,
  license: 'Apache-2.0',
  bin: { xlsx: 'bin/xlsx.njs' },
  engines: { node: '>=0.8' },
};

function parentPackageKey(key) {
  if (!key) return null;
  const marker = key.lastIndexOf('/node_modules/');
  return marker >= 0 ? key.slice(0, marker) : '';
}

function resolvePackageKey(fromKey, dependencyName) {
  let base = fromKey;
  while (base != null) {
    const candidate = base ? `${base}/node_modules/${dependencyName}` : `node_modules/${dependencyName}`;
    if (lock.packages[candidate]) return candidate;
    base = parentPackageKey(base);
  }
  return null;
}

const visited = new Set(['']);
const queue = [''];
while (queue.length) {
  const key = queue.shift();
  const entry = lock.packages[key] || {};
  const dependencyMaps = [entry.dependencies, entry.optionalDependencies, entry.peerDependencies];
  if (key === '') dependencyMaps.push(entry.devDependencies);
  for (const dependencyMap of dependencyMaps) {
    for (const dependencyName of Object.keys(dependencyMap || {})) {
      const resolvedKey = resolvePackageKey(key, dependencyName);
      if (!resolvedKey || visited.has(resolvedKey)) continue;
      visited.add(resolvedKey);
      queue.push(resolvedKey);
    }
  }
}

for (const key of Object.keys(lock.packages)) {
  if (!visited.has(key)) delete lock.packages[key];
}

fs.writeFileSync(LOCK_FILE, `${JSON.stringify(lock, null, 2)}\n`);
console.log(`Prepared deterministic SheetJS lock: ${lock.packages['node_modules/xlsx'].version}; packages=${Object.keys(lock.packages).length}`);
