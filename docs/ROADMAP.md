# Roadmap

เอกสารนี้เป็นแผนพัฒนาต่อโดยไม่กระทบตัวหลักที่ใช้งานจริง

## Current stable

```text
main = เวอร์ชันใช้งานจริง
Pro Stable = 1028 Native
สถานะทดสอบจริง = ผ่าน production mobile QA
```

ห้ามใช้ `main` เป็นที่ทดลองฟีเจอร์หรือรีแฟกเตอร์ใหญ่

## Stable 1028 Native baseline

```text
ใช้เป็นจุด rollback หลัง Project Pro Native Core production switch ผ่านแล้ว
```

ผ่านการทดสอบหลักแล้ว:

- production `pro.html?t=1028` เปิดได้ปกติ
- native core bootstrap ทำงานแทน jsdelivr/eval wrapper
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
- [x] รอ preview deploy ก่อนเปิดใช้จริง
- [x] สรุป rollback plan ใน PR ทุกครั้ง

## Phase 2 — Native core cleanup

เป้าหมาย: ลด bridge ทีละจุดโดยไม่เปลี่ยน behavior

- [ ] ย้าย `currentState` bridge เข้า `pro-native-core.js` โดยตรง
- [ ] ย้าย send Next navigation เข้า `pro-native-core.js` โดยตรง
- [ ] ย้าย done/order/Telesale bridge เข้า core/source ที่ชัดเจน
- [ ] ลดบทบาท `pro-native-core-overrides.js`
- [ ] เก็บหน้า preview ที่ไม่จำเป็นหลังใช้งานจริงครบหลายรอบ

## Phase 3 — Split UI gradually

เป้าหมาย: ทำ source ให้เล็กลงโดยไม่เปลี่ยน behavior

- [ ] แยก `Header`
- [ ] แยก `FilterBar`
- [ ] แยก `SummaryCards`
- [ ] แยก `RankingTable`
- [ ] แยก pages: upload/dashboard/people/stores/skus/tod/bill/issues

## Phase 4 — Isolate business logic

เป้าหมาย: ย้าย logic ออกจาก UI เพื่อเพิ่มฟีเจอร์ง่ายขึ้น

- [ ] แยก filter helpers
- [ ] แยก billing helpers
- [ ] แยก export helpers
- [ ] แยก storage helpers
- [ ] เพิ่ม sample parse check ถ้ามีไฟล์ตัวอย่างที่ปลอดภัย

## Completed — Project Pro Native Core

```text
PR #42: native core preview checkpoint
PR #43: native UI mirror checkpoint
PR #44: production switch candidate
สถานะ: production ผ่านแล้ว
```

## Parking lot — Future features

เก็บฟีเจอร์ที่ยังไม่ทำจริงไว้ตรงนี้ก่อน เพื่อไม่ให้ปนกับงานแก้โครงสร้าง

- [ ] ตั้งค่าหน้าปริ้นแบบเลือกเอง
- [ ] บันทึก preset ราคา/ร้าน
- [ ] รายงานสรุปเพิ่มเติม
- [ ] นำเข้าข้อมูลหลายไฟล์
- [ ] ระบบ backup/restore localStorage
- [ ] ระบบ admin/settings
