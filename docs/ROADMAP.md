# Roadmap

เอกสารนี้เป็นแผนพัฒนาต่อโดยไม่กระทบตัวหลักที่ใช้งานจริง

## Current stable

```text
main = เวอร์ชันใช้งานจริง
Pro Stable = 1028 Native
Production commit = 8b982911f7b13e9c9231d8a12c78709f6a674324
PR #64 = merged
Active architecture = single entry / single state / single render
```

ห้ามใช้ `main` เป็นที่ทดลองฟีเจอร์หรือรีแฟกเตอร์ใหญ่

## Stable 1028 Single Source baseline

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> dist/assets/pro/core.js
      -> dist/assets/pro/state.js และ owner modules
```

ผ่านการทดสอบหลักแล้ว:

- production `pro.html?t=1028` เปิดได้ปกติ
- App entry เป็น static ES module จุดเดียว
- ไม่มี shell/string replace/dynamic core loader/override หลัง render
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

## Phase 2 — Single-source cleanup

เป้าหมาย: ย้าย bridge เข้า source owner โดยไม่เปลี่ยน behavior

- [x] State/Current State อยู่ใน `dist/assets/pro/state.js`
- [x] Send Next อยู่ใน `dist/assets/pro/send-store.js`
- [x] Done/Order/Telesale อยู่ใน owner module
- [x] Print อยู่ใน `print.js` และ `print-model.js`
- [x] ตัด Core/Override รุ่นเก่าออกจาก Active Pro path
- [x] Merge PR #64 และใช้ Production commit `8b982911…`
- [ ] ลบหน้า preview/test รุ่นเก่าหลังอนุมัติ cleanup แยก
- [ ] ลบ Legacy assets หลังไม่มี reference เหลือ

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

## Completed — Project Pro Single Source

```text
PR #42–#46: historical Native Core checkpoints
PR #64: Single Source refactor merged
Production: 8b982911f7b13e9c9231d8a12c78709f6a674324
```

ไฟล์ Core/Override/Print Fix รุ่นเก่าเป็น LEGACY ไม่ใช่ Active Pro source
และห้ามแก้เพื่อแก้ปัญหาปัจจุบัน ดู `docs/PRO_LEGACY_MANIFEST.md`

## Parking lot — Future features

เก็บฟีเจอร์ที่ยังไม่ทำจริงไว้ตรงนี้ก่อน เพื่อไม่ให้ปนกับงานแก้โครงสร้าง

- [ ] ตั้งค่าหน้าปริ้นแบบเลือกเอง
- [ ] บันทึก preset ราคา/ร้าน
- [ ] รายงานสรุปเพิ่มเติม
- [ ] นำเข้าข้อมูลหลายไฟล์
- [ ] ระบบ backup/restore localStorage
- [ ] ระบบ admin/settings
