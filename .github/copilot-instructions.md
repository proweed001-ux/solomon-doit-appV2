# Solomon DOIT Pro coding instructions

โปรเจกต์นี้ให้ยึดหน้า Production จริงเป็นหลักก่อนทุกอย่าง

## Source of Truth

ตัวจริงที่ผู้ใช้ใช้งานอยู่คือ:

```text
https://solomon-doit-app-v2.vercel.app/pro.html?v=257
```

โครงสร้างตัวจริงใน repo คือ:

```text
dist/pro.html
dist/assets/*.js ที่ dist/pro.html เรียกใช้
```

ห้ามถือว่า `src/App.tsx` หรือ React/Vite เป็นตัวหลัก เว้นแต่ผู้ใช้สั่งให้ย้ายระบบใหม่อย่างชัดเจน

## ห้ามทำโดยไม่ได้รับอนุญาต

- ห้ามลบ `dist/pro.html`
- ห้ามลบไฟล์ใน `dist/assets/` ที่ `dist/pro.html` เรียกใช้
- ห้ามเปลี่ยนหน้าตา production โดยไม่สั่ง
- ห้ามเปลี่ยนสูตรยอดขายโดยไม่อธิบายผลกระทบ
- ห้ามสร้าง test, spec, mock, fixture หรือ testing framework เพิ่มเอง
- ห้าม refactor ใหญ่ถ้าแก้เฉพาะจุดได้
- ห้ามย้ายระบบจาก static `dist/pro.html` ไป React/Vite เอง
- ห้ามแก้ `main` โดยตรงถ้าเป็นงานเสี่ยง

## ทางเข้าแอปหลัก

ให้ถือว่าเส้นทางหลักคือ:

```text
/ -> /pro.html?v=257
/pro.html?v=257 -> dist/pro.html
```

ลิงก์ทดลองทุกลิงก์ต้องเปิดแล้วหน้าตาเหมือน production จริงก่อน จึงถือว่าผ่าน

## วิธีแก้ที่ถูกต้อง

ถ้าต้องแก้ UI หรือ logic:

1. แก้ในสำเนาทดลองก่อน
2. รักษาหน้าตาเดิมของ `pro.html`
3. รักษาไฟล์ asset ที่ถูกเรียกใช้
4. ตรวจว่า `/pro.html?v=257` ยังเปิดได้
5. ตรวจ upload, filter, totals, bill extraction, export CSV
6. ห้าม merge เข้า main จนกว่าผู้ใช้ยืนยัน

## Validation

ตรวจแบบใช้งานจริงมากกว่า unit test:

- เปิด `/pro.html?v=257`
- Upload ไฟล์ DOIT จริง
- เช็กยอดรวม
- เช็กจำนวนชิ้น
- เช็ก filter PS / ร้าน / แบรนด์ / ประเภทสินค้า
- เช็กถอดของ Pro
- เช็กใบส่งร้านจริง
- เช็ก Export CSV
- เช็กบนมือถือ

## Response style

- ตอบภาษาไทยเป็นหลัก
- บอกไฟล์ที่แก้ชัดเจน
- ใช้ภาษาง่าย
- คำสั่งหรือโค้ดที่ต้อง copy ต้องอยู่ใน code block
- ถ้าพบว่าคำขอจะทำให้ production พัง ให้แย้งทันที
