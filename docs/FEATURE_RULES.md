# Feature Rules

กติกานี้มีไว้เพื่อเพิ่มฟีเจอร์ใหม่โดยไม่กระทบตัวหลักที่ใช้งานจริง

## Branch policy

```text
main
  เวอร์ชันใช้งานจริง ห้ามทดลองหรือ refactor ใหญ่ตรงนี้

feature/<short-name>
  ฟีเจอร์ใหม่แต่ละก้อน ต้องแยก branch
```

## กฎก่อนเริ่มฟีเจอร์ใหม่

1. ระบุเป้าหมายฟีเจอร์เป็นข้อ ๆ
2. ระบุไฟล์ที่จะกระทบก่อนแก้
3. ห้ามแก้หลายระบบใน commit เดียว เช่น parser + print + UI พร้อมกัน
4. ถ้าเป็นฟีเจอร์ทดลอง ให้ซ่อนไว้ก่อน ยังไม่เปิดใช้บน main
5. ห้ามเปลี่ยน storage key เดิมโดยไม่มี migration
6. ห้ามเปลี่ยนสูตรราคาโดยไม่มีตัวอย่างเทียบก่อน/หลัง

## กฎสำหรับงาน refactor

1. Refactor ต้องไม่เปลี่ยนพฤติกรรม
2. แยกไฟล์ก่อนได้ แต่ห้ามเขียน logic ใหม่พร้อมกัน
3. งาน Pro legacy ให้รัน `npm run smoke` หรือ `npm run verify`
4. งาน React migration เท่านั้นที่ใช้ `npm run verify:react`
5. ห้าม commit ผล `vite build` ที่ทับ `dist/pro.html` หรือ `dist/assets/pro-*` โดยไม่มี QA แยก
6. ถ้าแตะ `dist/pro.html` ต้องมีเหตุผลชัดเจน เพราะเป็น legacy ที่เสี่ยงสูง
7. ถ้าแตะระบบปริ้น Pro ต้องตรวจ smoke guardrails เสมอ

## กฎสำหรับระบบปริ้น Pro

ห้ามเปลี่ยนค่าต่อไปนี้ถ้าไม่ได้ตั้งใจเปลี่ยน behavior:

```text
BILL_ROWS = 12
BILLS_PER_A4 = 2
EDIT_KEY = doit-pro-print-price-edits-v1
```

ค่าพวกนี้ถูกใช้เพื่อรักษาพฤติกรรมเดิม:

- 12 รายการต่อบิล
- 2 บิลต่อ A4
- จำราคา/จำนวนที่แก้ในหน้าเตรียมปริ้น

## Definition of Done

ฟีเจอร์หรือ refactor ฝั่ง Pro legacy จะถือว่าเสร็จได้ต่อเมื่อ:

```text
npm run smoke ผ่าน
ไม่มี workflow patch เก่ากลับมา
ไม่มีการแก้ main ตรง ๆ
มีสรุปไฟล์ที่แก้
มีวิธี rollback ถ้าพัง
```

ฟีเจอร์ฝั่ง React migration ใช้:

```text
npm run verify:react
```

แต่ห้าม commit `dist` ที่ build ทับ Pro legacy โดยไม่ตรวจ diff ทุกไฟล์ก่อน

## Rollback rule

ถ้าฟีเจอร์ใหม่มีปัญหา:

1. ปิด feature flag ก่อนถ้ามี
2. revert PR หรือปิด PR
3. ห้ามแก้ทับแบบเดาสุ่มบน main
4. เก็บบั๊กไว้เป็น issue/รายการแก้เฉพาะจุด
