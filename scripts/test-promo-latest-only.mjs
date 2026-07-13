import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseFunctionLabel, promoTierRows } from '../supabase/functions/promo-latest-upload-preview/promo-function-sync.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const edge = read('supabase/functions/promo-latest-upload-preview/index.ts');
const core = read('supabase/functions/promo-latest-upload-preview/promo-latest-core.ts');
const handler = read('supabase/functions/promo-latest-upload-preview/promo-latest-upload.ts');
const uploader = read('dist/assets/promo-pdf-upload-v2-v3-6d.js') + '\n' + read('dist/assets/promo-pdf-upload-v2-v3-6f.js');
const finalizeClient = read('dist/assets/promo-pdf-upload-v2-v3-5a.js');
const novelOcr = read('dist/assets/promo-pdf-upload-v2-v3-4d.js');
const uploadPage = read('dist/promo-pdf-upload-v2.html');
const livePage = read('dist/promo-live.html');

const newMonthlyFunction = parseFunctionLabel('7 ขวด ลด 13%; 2 ลัง ลด 22%');
assert.equal(newMonthlyFunction.functionType, 'tiered');
assert.deepEqual(newMonthlyFunction.payload.tiers.map(t => [t.min_qty, t.unit, t.discount_percent]), [[7, 'ขวด', 13], [2, 'ลัง', 22]]);
assert.equal(promoTierRows('AUG26-HFSS-001', newMonthlyFunction).length, 2);

const freeGoods = parseFunctionLabel('ซื้อ 8 ขวด ฟรี 2 ขวด (20%)');
const freeRow = promoTierRows('AUG26-HFSS-002', freeGoods)[0];
assert.equal(freeRow.free_qty, 2);
assert.equal(freeRow.discount_percent, null);
assert.match(freeRow.note, /effective_percent=20/);

assert.match(edge, /promo-latest-upload\.ts/);
assert.match(core, /confirm_latest_only/);
assert.match(core, /finalize_validation_failed/);
assert.match(core, /old_months_deleted/);
assert.match(core, /storage\.from\(BUCKET\)\.remove/);
assert.match(core, /promo_months"\)\.delete\(\)\.in\("id", oldIds\)/);
assert.match(core, /published_month_locked/);
assert.match(core, /finalize_month_not_draft/);
assert.match(core, /promo_card_product_groups/);
assert.match(core, /promo_group_prices/);
assert.match(core, /promo_product_groups/);
assert.match(handler, /promoTitle: cleanText\(master\.canonical_name/);
assert.match(handler, /master_status/);
assert.match(handler, /resolveProductMasters/);
assert.doesNotMatch(handler, /card_not_found/);
assert.ok(core.indexOf('finalize_validation_failed') < core.indexOf('status: "published"'));
assert.ok(core.indexOf('status: "published"') < core.indexOf('old_months_deleted'));

assert.match(finalizeClient, /action:'finalize_latest'/);
assert.match(finalizeClient, /confirm_latest_only:true/);
assert.match(uploader, /expected=items\.length/);
assert.doesNotMatch(uploader, /items\.length!==212|completed\.size!==212/);
assert.match(uploader, /ระบบจะไม่ลบเดือนปัจจุบัน/);
assert.match(uploader, /master_product_id/);
new Function(read('dist/assets/promo-pdf-upload-v2-v3-6f.js'));

assert.match(novelOcr, /structuredFunctionCandidate/);
assert.match(novelOcr, /structured_new_month_function|structuredNew/);
assert.match(novelOcr, /label=`ลด \$\{pct\}%`/);
new Function(novelOcr);

assert.match(uploadPage, /เดือนล่าสุดเท่านั้น/);
assert.match(uploadPage, /promo-product-master-snapshot-v1\.js/);
assert.match(uploadPage, /promo-pdf-upload-v2-v3-6f\.js/);
assert.doesNotMatch(uploadPage, /id="month" value="JUL26"/);

assert.match(livePage, /promo_months\?status=eq\.published/);
assert.match(livePage, /activeMonth/);
assert.doesNotMatch(livePage, /promo_month_id=eq\.JUL26/);
assert.doesNotMatch(livePage, /if\(!rows\.length\)rows=await api\('promo_months\?select=/);
const inline = livePage.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
new Function(inline);

console.log(JSON.stringify({
  ok: true,
  new_function_tiers: newMonthlyFunction.payload.tiers.length,
  free_goods_no_double_discount: true,
  staged_publish_guard: true,
  product_master_guard: true,
  old_month_cleanup_guard: true,
  published_only_live_query: true,
}, null, 2));
