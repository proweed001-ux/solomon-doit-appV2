# Project Structure Index

เอกสารนี้เป็นสารบัญโครงสร้างโปรเจกต์สำหรับงานต่อยอดในอนาคต

## Runtime entry points

```text
src/main.tsx
  จุดเริ่มของ React app

src/App.tsx
  UI หลักของเว็บ: upload, filter, summary, table, drill-down, copy, export

dist/pro.html
  หน้า Pro ที่ใช้งานจริงใน production ตอนนี้
```

## Core business logic

```text
src/lib/parser.ts
  อ่าน Excel/CSV, pivot cache, normalize row เป็น ParsedRow

src/lib/analytics.ts
  รวมข้อมูล, filter, buildBillLines, export CSV

src/lib/pricing.ts
  safe number, qty, round money, unit price, line total

src/types.ts
  type กลางของระบบ
```

## Pro print layer

```text
dist/assets/pro-core-v4.js
  wrapper โหลด legacy Pro core และโหลด print module/css

dist/assets/pro-print-store-bills.js
  logic เตรียมปริ้นแยกร้าน
  guardrails: 12 rows per bill, 2 bills per A4, stable edit key

dist/assets/pro-print.css
  print CSS สำหรับ A4 และ mobile-safe print preview
```

## QA and guardrails

```text
scripts/smoke-check.mjs
  ตรวจว่าไฟล์สำคัญอยู่ครบ และ guardrail สำคัญยังอยู่

scripts/qa-doit-file.mjs
  ตรวจไฟล์ DOIT จริงแบบ local โดยไม่ commit workbook เข้า GitHub

docs/REAL_FILE_QA.md
  วิธีใช้ real-file QA และกติกาไม่เอา workbook จริงขึ้น repo
```

## Documentation

```text
docs/ARCHITECTURE.md
  ภาพรวมสถาปัตยกรรมและกฎการแก้ระบบ

docs/FEATURE_RULES.md
  กติกาก่อนเพิ่มฟีเจอร์หรือ refactor

docs/ROADMAP.md
  ลำดับพัฒนาต่อ

docs/QA_CHECKLIST.md
  checklist ก่อน merge งานที่กระทบการใช้งาน

docs/CLEANUP_AUDIT.md
  บันทึกงาน cleanup และเหตุผลที่ลบ workflow เก่า
```

## Active GitHub workflows

```text
.github/workflows/web-ci.yml
  lightweight smoke CI สำหรับ PR และ main

.github/workflows/build-android-apk.yml
  build debug APK เมื่อสั่งเองหรือเมื่อแก้ android-apk
```

## Files that should not be edited casually

```text
dist/pro.html
  หน้า production ปัจจุบัน ยาวและเสี่ยงสูง

dist/assets/pro-core-v4.js
  wrapper ที่ pin legacy core เดิม

dist/assets/pro-print-store-bills.js
  print behavior ที่ผู้ใช้ใช้งานจริง

src/lib/parser.ts
  logic อ่านไฟล์ DOIT จริง

src/lib/pricing.ts
  สูตรราคาและการปัดเศษ
```

## Cleanup rule

ทำ cleanup ทีละก้อนเล็กผ่าน branch/PR เท่านั้น ห้ามรื้อ `dist/pro.html`, parser, pricing, หรือ print behavior พร้อมกันใน PR เดียว
