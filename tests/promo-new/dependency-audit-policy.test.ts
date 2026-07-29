import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Preview build blocks high and critical runtime dependency vulnerabilities', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    scripts?: Record<string, string>;
  };
  assert.equal(packageJson.scripts?.['audit:promo-new'], 'npm audit --omit=dev --audit-level=high');
  assert.match(String(packageJson.scripts?.['verify:promo-new'] || ''), /npm run audit:promo-new/u);
});
