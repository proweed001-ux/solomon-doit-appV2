# QA Checklist

Checklist นี้ใช้ก่อน merge ฟีเจอร์หรือ refactor เข้า `main`

## Automated checks

ต้องผ่านทั้งหมด:

```bash
npm run build
npm run smoke
```

หรือรันรวม:

```bash
npm run verify
```

## Manual quick check

ตรวจเฉพาะ preview ไม่ใช่เว็บหลัก:

```text
1. เปิดหน้าเว็บได้
2. เปิดหน้า Pro ได้
3. ปุ่มเตรียมปริ้นยังอยู่
4. หน้าเตรียมปริ้นเปิดได้
5. บิลยังเป็น 12 รายการต่อบิล
6. ยังเป็น 2 บิลต่อ A4
7. แก้ราคาแล้วปิด/เปิดใหม่ ราคายังอยู่
8. ไม่มี error แดงบนหน้าเว็บ
```

## High-risk areas

ห้าม merge ถ้ายังไม่ได้ตรวจเมื่อแตะไฟล์เหล่านี้:

```text
dist/pro.html
dist/assets/pro-core-v4.js
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
