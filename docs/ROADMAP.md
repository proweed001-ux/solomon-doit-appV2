# Roadmap

เอกสารนี้เป็นแผนพัฒนาต่อโดยไม่กระทบตัวหลักที่ใช้งานจริง

## Current stable

```text
main = เวอร์ชันใช้งานจริง
Pro Stable = 1026
สถานะทดสอบจริง = ผ่าน
```

ห้ามใช้ `main` เป็นที่ทดลองฟีเจอร์หรือรีแฟกเตอร์ใหญ่

## Stable 1026 baseline

```text
ใช้เป็นจุด rollback ถ้าพัฒนาเพิ่มแล้วพัง
```

ผ่านการทดสอบหลักแล้ว:

- ปริ้นยอดไม่ซ้ำ
- ระยะขอบปริ้น A4 ใช้งานได้
- หน้า 2 ไม่ชิดขอบ
- ช่อง “ส่งร้านนี้” กด Enter/Next ลงล่างได้
- หลังใส่ตัวเลขแล้วไม่ต้องแตะช่องใหม่เอง
- เตรียมปริ้นใช้เฉพาะช่อง “ส่งร้านนี้” ไม่ปน “ใส่เพิ่ม” / “ดึงออก”

## Phase 0 — Foundation guardrails

เป้าหมาย: ทำให้การแก้รอบต่อไปตรวจพังได้ก่อนถึงผู้ใช้จริง

- [x] เพิ่ม `.gitignore`
- [x] เพิ่ม Web CI
- [x] เพิ่ม architecture guide
- [x] แยก Pro print logic/CSS ออกจาก wrapper
- [x] เพิ่ม smoke check เข้า PR flow
- [x] ใช้ branch/PR สำหรับงานใหญ่ทุกครั้ง

## Phase 1 — Safer feature workflow

เป้าหมาย: เพิ่มฟีเจอร์โดยไม่ให้ตัวหลักโดนทับ

- [x] สร้าง feature branch ทุกงาน
- [x] เปิด draft PR ก่อน merge
- [x] ให้ `npm run verify` ผ่านก่อน
- [ ] รอ preview deploy ก่อนเปิดใช้จริง
- [ ] สรุป rollback plan ใน PR ทุกครั้ง

## Phase 2 — Split UI gradually

เป้าหมาย: ทำ `src/App.tsx` ให้เล็กลงโดยไม่เปลี่ยน behavior

- [ ] แยก `Header`
- [ ] แยก `FilterBar`
- [ ] แยก `SummaryCards`
- [ ] แยก `RankingTable`
- [ ] แยก pages: upload/dashboard/people/stores/skus/tod/bill/issues

## Phase 3 — Isolate business logic

เป้าหมาย: ย้าย logic ออกจาก UI เพื่อเพิ่มฟีเจอร์ง่ายขึ้น

- [ ] แยก filter helpers
- [ ] แยก billing helpers
- [ ] แยก export helpers
- [ ] แยก storage helpers
- [ ] เพิ่ม sample parse check ถ้ามีไฟล์ตัวอย่างที่ปลอดภัย

## Phase 4 — Legacy Pro migration

เป้าหมาย: ลดความเสี่ยงของ `dist/pro.html` โดยไม่รื้อครั้งเดียว

- [ ] แยกส่วนที่ยังอยู่ใน `dist/pro.html` เป็นโมดูลย่อย
- [ ] ทำ adapter ให้หน้าเก่าเรียก logic ใหม่
- [ ] ทดสอบมือถือ/ปริ้นจริงก่อนลบของเก่า
- [ ] ค่อยย้ายกลับเข้า source ถ้าพร้อมทดสอบเต็ม

## Parking lot — Future features

เก็บฟีเจอร์ที่ยังไม่ทำจริงไว้ตรงนี้ก่อน เพื่อไม่ให้ปนกับงานแก้โครงสร้าง

- [ ] ตั้งค่าหน้าปริ้นแบบเลือกเอง
- [ ] บันทึก preset ราคา/ร้าน
- [ ] รายงานสรุปเพิ่มเติม
- [ ] นำเข้าข้อมูลหลายไฟล์
- [ ] ระบบ backup/restore localStorage
- [ ] ระบบ admin/settings
