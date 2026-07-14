import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('dist/promo-pdf-upload-v2.html', 'utf8');

assert.match(html, /id="primaryAction"/, 'one primary action is required');
assert.match(html, />เลือกไฟล์ก่อน<|อัปโหลดและอัปเดตทั้งหมด|ตรวจอัตโนมัติทั้งหมด/, 'primary action labels are missing');
assert.match(html, /class="internal"/, 'technical controls must remain hidden');
assert.match(html, /ตั้งค่าขั้นสูง — ไม่จำเป็นต้องเปิด/, 'advanced controls must be collapsed');
assert.match(html, /location\.hostname===productionHost/, 'preview must not publish');
assert.match(html, /if\(!isProduction\)return/, 'preview one-button action must stop after dry-run');
assert.doesNotMatch(html, /กลับเวอร์ชันเดิม/, 'old-version navigation must not clutter the normal workflow');
assert.doesNotMatch(html, /1\) ตรวจอัตโนมัติทั้งหมด/, 'numbered two-step buttons must be removed');
assert.doesNotMatch(html, /2\) เผยแพร่เป็นเดือนล่าสุด/, 'numbered publish button must be removed');

console.log('promo simple UI regression: PASS');
