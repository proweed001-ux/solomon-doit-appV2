import test from 'node:test';
import assert from 'node:assert/strict';
import { validateGroupingWorkerAsset } from '../../src/promo-new/admin/grouping-worker-asset';

test('Worker asset ยอมรับ JavaScript ที่ตอบ HTTP 200', () => {
  assert.doesNotThrow(() => validateGroupingWorkerAsset(200, 'text/javascript; charset=utf-8', 'self.postMessage({type:"ready"});'));
});

test('Worker asset ปฏิเสธหน้า Vercel SSO HTML แทน JavaScript', () => {
  assert.throws(
    () => validateGroupingWorkerAsset(200, 'text/html; charset=utf-8', '<!doctype html><html><body>Sign in</body></html>'),
    /grouping_worker_asset_html/,
  );
});

test('Worker asset แสดง HTTP status จริงแทน grouping_worker_failed', () => {
  assert.throws(
    () => validateGroupingWorkerAsset(302, 'text/plain', 'Redirecting...'),
    /grouping_worker_asset_http_302/,
  );
});

test('Worker asset ว่างต้องถูกปฏิเสธก่อนสร้าง Worker', () => {
  assert.throws(
    () => validateGroupingWorkerAsset(200, 'application/javascript', '   '),
    /grouping_worker_asset_empty/,
  );
});
