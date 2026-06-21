# QA Checklist

Checklist นี้ใช้ก่อน merge ฟีเจอร์หรือ refactor เข้า `main`

## Current stable

```text
Pro Stable = 1028 Native
Production URL = /pro.html?t=1028
```

ก่อนเริ่มงานต่อ ให้อ่าน:

```text
docs/HANDOFF_1028_NATIVE.md
```

## Automated checks

สำหรับงาน Pro ต้องผ่าน:

```bash
npm run smoke
```

หรือรันรวม:

```bash
npm run verify
```

ตอนนี้ `verify` เป็น smoke-only เพื่อไม่ให้ `vite build` ทับ `dist` ที่ใช้จริงโดยไม่ตั้งใจ

สำหรับงานย้าย React app เท่านั้น:

```bash
npm run verify:react
```

หลัง `verify:react` ห้าม commit ผล build ใน `dist` จนกว่าจะตรวจ diff ทุกไฟล์แล้วว่าไม่ทับ Pro Stable 1028 Native

## Manual quick check

ตรวจ preview ก่อนเสมอ และถ้าแตะ Pro production path ให้ตรวจมือถือจริง:

```text
1. เปิดหน้าเว็บได้
2. เปิด /pro.html?t=1028 ได้
3. โหลด Cloud ได้
4. เลือกวันที่ / PS / ร้านส่ง ได้
5. ช่อง “ส่งร้านนี้” กด Enter/Next ลงแถวถัดไป
6. ปุ่มเตรียมปริ้นยังอยู่
7. หน้าเตรียมปริ้นเปิดได้
8. บิลยังเป็น 12 รายการต่อบิล
9. ยังเป็น 2 บิลต่อ A4
10. สินค้า 0 ชิ้นไม่เข้าใบปริ้น
11. รวม order / จัดแล้ว / Telesale ยังถูก
12. ไม่มี error แดงบนหน้าเว็บ
```

## High-risk areas

ห้าม merge ถ้ายังไม่ได้ตรวจเมื่อแตะไฟล์เหล่านี้:

```text
dist/pro.html
dist/assets/pro-core-v4.js
dist/assets/pro-native-core.js
dist/assets/pro-native-core-overrides.js
dist/assets/pro-print-store-bills.js
dist/assets/pro-print.css
src/lib/parser.ts
src/lib/pricing.ts
```

## Rollback plan

ถ้า preview พัง:

```text
1. ไม่ merge PR
2. ปิด PR หรือ revert commit ใน branch
3. main ยังไม่กระทบ
4. เปิด issue/รายการบั๊กแยก
```

ถ้า production พังหลัง merge:

```text
1. ใช้ Vercel rollback ไป deployment ก่อนหน้า
2. หรือ revert merge commit ล่าสุด
3. เปิด bugfix branch ใหม่
4. รัน smoke + mobile QA ก่อน merge อีกครั้ง
```
