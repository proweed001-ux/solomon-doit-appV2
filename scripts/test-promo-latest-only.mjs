import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseFunctionLabel, promoTierRows } from '../supabase/functions/promo-latest-upload-preview/promo-function-sync.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const edge = read('supabase/functions/promo-latest-upload-preview/index.ts');
const uploader = read('dist/assets/promo-pdf-upload-v2-v3-5a.js');
const novelOcr = read('dist/assets/promo-pdf-upload-v2-v3-4d.js');
const uploadPage = read('dist/promo-pdf-upload-v2.html');
const livePage = read('dist/promo-live.html');

const newMonthlyFunction = parseFunctionLabel('7 ขวด ลด 13%; 2 ลัง ลด 22%');
assert.equal(newMonthlyFunction.functionType, 'tiered');
assert.deepEqual(
  newMonthlyFunction.payload.tiers.map(t => [t.min_qty, t.unit, t.discount_percent]),
  [[7, 'ขวด', 13], [2, 'ลัง', 22]],
);
assert.equal(promoTierRows('AUG26-HFSS-001', newMonthlyFunction).length, 2);

const freeGoods = parseFunctionLabel('ซื้อ 8 ขวด ฟรี 2 ขวด (20%)');
const freeRow = promoTierRows('AUG26-HFSS-002', freeGoods)[0];
assert.equal(freeRow.free_qty, 2);
assert.equal(freeRow.discount_percent, null);
assert.match(freeRow.note, /effective_percent=20/);

assert.match(edge, /confirm_latest_only/);
assert.match(edge, /finalize_validation_failed/);
assert.match(edge, /old_months_deleted/);
assert.match(edge, /storage\.from\(BUCKET\)\.remove/);
assert.match(edge, /promo_months"\)\.delete\(\)\.in\("id", oldIds\)/);
assert.match(edge, /promo_title: cardsById\.get\(item\.cardId\)\?\.promo_title \|\|/);
assert.doesNotMatch(edge, /card_not_found/);
assert.ok(edge.indexOf('finalize_validation_failed') < edge.indexOf('status: "published"'));
assert.ok(edge.indexOf('status: "published"') < edge.indexOf('old_months_deleted'));

assert.match(uploader, /action:'finalize_latest'/);
assert.match(uploader, /confirm_latest_only:true/);
assert.match(uploader, /completed\.size!==212/);
assert.match(uploader, /ระบบจะไม่ลบเดือนปัจจุบัน/);
assert.match(uploader, /latest-only-v1/);
new Function(uploader);

assert.match(novelOcr, /structuredFunctionCandidate/);
assert.match(novelOcr, /structured_new_month_function|structuredNew/);
assert.match(novelOcr, /label=`ลด \$\{pct\}%`/);
new Function(novelOcr);

assert.match(uploadPage, /เดือนล่าสุดเท่านั้น/);
assert.match(uploadPage, /promo-pdf-upload-v2-v3-4d\.js/);
assert.doesNotMatch(uploadPage, /id="month" value="JUL26"/);

assert.match(livePage, /promo_months\?status=eq\.published/);
assert.match(livePage, /activeMonth/);
assert.doesNotMatch(livePage, /promo_month_id=eq\.JUL26/);
const inline = livePage.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
new Function(inline);

console.log(JSON.stringify({
  ok: true,
  new_function_tiers: newMonthlyFunction.payload.tiers.length,
  free_goods_no_double_discount: true,
  staged_publish_guard: true,
  old_month_cleanup_guard: true,
  latest_month_live_query: true,
}, null, 2));
