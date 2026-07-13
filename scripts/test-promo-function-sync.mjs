import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  parseFunctionLabel,
  promoTierRows,
  templateIdentity,
} from '../supabase/functions/promo-image-upload-v2/promo-function-sync.js';

const cases = [
  ['ลด 10%', 'discount', 1],
  ['1 ขวด ลด 8%; 6 ขวด ฟรี 1 ขวด (14%)', 'tiered', 2],
  ['36 ขวด ลด 16%; 2 ลัง ลด 20%; 6 ลัง ลด 25%', 'tiered', 3],
  ['1-2 ชิ้น ลด 24%', 'discount', 1],
  ['ซื้อ 6 ชิ้น ฟรี 1 ชิ้น (14%)', 'free_goods', 1],
  ['12 ขวด ลด 12%; 1 ลัง ลด 17%', 'tiered', 2],
];

for (const [label, functionType, tierCount] of cases) {
  const parsed = parseFunctionLabel(label);
  assert.equal(parsed.functionType, functionType);
  assert.equal(parsed.payload.tiers.length, tierCount);
  assert.equal(promoTierRows('JUL26-TEST-001', parsed).length, tierCount);
}

const target = parseFunctionLabel('36 ขวด ลด 16%; 2 ลัง ลด 20%; 6 ลัง ลด 25%');
assert.deepEqual(
  target.payload.tiers.map(tier => [tier.min_qty, tier.unit, tier.discount_percent]),
  [[36, 'ขวด', 16], [2, 'ลัง', 20], [6, 'ลัง', 25]],
);

const identity1 = await templateIdentity('JUL26', target.label);
const identity2 = await templateIdentity('JUL26', target.label);
assert.deepEqual(identity1, identity2);
assert.match(identity1.templateId, /^JUL26-V3-[A-F0-9]{10}$/);
assert.ok(Number.isInteger(identity1.clusterId));
assert.throws(() => parseFunctionLabel('ข้อความอ่านไม่ออก'));

const edge = fs.readFileSync(new URL('../supabase/functions/promo-image-upload-v2/index.ts', import.meta.url), 'utf8');
assert.match(edge, /promo_function_templates/);
assert.match(edge, /function_payload: item\.parsedFunction\.payload/);
assert.match(edge, /promo_tiers/);
assert.match(edge, /skipExistingImages/);
assert.match(edge, /ocr_structured_v3_sync/);

const uploader = fs.readFileSync(new URL('../dist/assets/promo-pdf-upload-v2-v3-5a.js', import.meta.url), 'utf8');
assert.match(uploader, /function-sync-v4/);
assert.match(uploader, /skip_existing_images:true/);
assert.match(uploader, /functions_synced/);

console.log(JSON.stringify({
  ok: true,
  parser_cases: cases.length,
  target_tiers: target.payload.tiers.length,
  deterministic_template: identity1,
  backend_sync_guards: true,
}, null, 2));
