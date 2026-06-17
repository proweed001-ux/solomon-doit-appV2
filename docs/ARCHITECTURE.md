# Project Architecture

เอกสารนี้ใช้เป็นแผนที่ของโปรเจกต์ เพื่อไม่ให้การแก้ไขรอบถัดไปกลับไปรกแบบเดิม

## Web app source

```text
src/main.tsx
  จุดเริ่ม React app

src/App.tsx
  UI หลัก: upload, dashboard, drill-down, TOD, bill, issues

src/lib/parser.ts
  อ่านไฟล์ Excel/CSV, อ่าน pivotCache, normalize row เป็น ParsedRow

src/lib/analytics.ts
  filter, aggregate, build bill lines, export CSV

src/lib/pricing.ts
  safe number, qty, round money, unit price, line total

src/types.ts
  type กลางของระบบ
```

## Pro print layer

หน้า Pro ปัจจุบันยังใช้ `dist/pro.html` และ legacy core เดิมอยู่ เพื่อไม่ให้ฟีเจอร์ที่ใช้งานจริงพังจากการย้ายโครงสร้างเร็วเกินไป

```text
dist/assets/pro-core-v4.js
  wrapper สั้น ๆ โหลด legacy core เดิม แล้วโหลดโมดูลปริ้นแยก

dist/assets/pro-print-store-bills.js
  logic เตรียมปริ้น Pro แยกตามร้าน
  - 12 รายการต่อบิล
  - 2 บิลต่อ A4
  - เลขรายการต่อเนื่องในร้านเดียวกัน
  - รวมยอดเฉพาะใบสุดท้ายของร้านเดียวกัน
  - จำราคา/จำนวนที่แก้ในหน้าเตรียมปริ้นด้วย localStorage

dist/assets/pro-print.css
  CSS สำหรับ A4 มือถือและเครื่องพิมพ์ที่ปรับสเกลไม่ได้
```

## QA and guardrail layer

```text
scripts/smoke-check.mjs
  lightweight guardrail check: required files, print constants, stale workflow blocks

scripts/qa-doit-file.mjs
  local real-workbook check สำหรับไฟล์ DOIT จริง โดยไม่ commit workbook เข้า GitHub

docs/PROJECT_STRUCTURE.md
  สารบัญไฟล์สำคัญและจุดที่ห้ามแก้มั่ว
```

## GitHub workflows

```text
.github/workflows/web-ci.yml
  lightweight smoke CI สำหรับ PR และ main

.github/workflows/build-android-apk.yml
  build debug APK เมื่อแก้ android-apk หรือสั่งเอง
```

## Workflows removed during cleanup

```text
.github/workflows/apply-icon-from-b64.yml
.github/workflows/rebuild-icons-from-drawable.yml
.github/workflows/fix-valid-icon-build.yml
```

เหตุผล: เป็น one-off icon repair workflow, มี `contents: write`, และสามารถ commit กลับเข้า repository ได้ จึงไม่ควรอยู่ใน active workflow set หลัง cleanup

## กฎการแก้ไขต่อจากนี้

1. แก้ business logic ใน `src/lib/*` ก่อน
2. แก้ UI หลักใน `src/App.tsx`
3. แก้ระบบปริ้น Pro ใน `dist/assets/pro-print-store-bills.js` และ `dist/assets/pro-print.css`
4. หลีกเลี่ยงการ patch ไฟล์ด้วย workflow ที่ commit กลับเข้า repo อัตโนมัติ
5. หลีกเลี่ยงการยัด CSS/JS ใหม่ลง `dist/pro.html`
6. ก่อนลบ workflow ให้ตรวจว่ามี workflow ตัวอื่นทำหน้าที่แทนแล้ว
7. ก่อน merge งานที่แตะ parser/print/pricing ให้ตรวจด้วยไฟล์ DOIT จริงผ่าน `scripts/qa-doit-file.mjs`

## สถานะความสะอาดหลังจัดรอบนี้

```text
src/                       ยังเป็นแหล่ง logic หลักของเว็บ
Pro print layer             แยก logic/CSS ออกจาก wrapper แล้ว
.github/workflows           เหลือเฉพาะ web smoke CI และ Android APK build
docs/                       มี architecture, feature rules, roadmap, QA, cleanup audit, project structure
scripts/                    มี smoke check และ real-file QA
```

## งานที่ยังไม่ควรรีบทำถ้าไม่มีเวลาทดสอบ

- ย้าย `dist/pro.html` ทั้งหมดกลับเข้า `src` ในครั้งเดียว
- เปลี่ยน storage key ของข้อมูลเก่า
- เปลี่ยนสูตรราคา หรือการอ่าน field DOIT
- เปลี่ยน behavior การปริ้น 12 แถว / 2 ใบต่อ A4
