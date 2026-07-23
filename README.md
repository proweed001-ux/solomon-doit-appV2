# Solomon DOIT App V2.1 Complete

ตัวนี้เป็นเวอร์ชันครบกว่า V2 Core: อ่านไฟล์ DOIT จริง, ถอดบิล, และทำรายงานตั้งแต่ภาครวมจนถึงรายบุคคล

## Current production

```text
Production: Pro Stable 1028 Native
URL: https://solomon-doit-app-v2.vercel.app/pro.html?t=1028
Production commit: 24035247351ebc99ab30c38b3efc1da74e7ef23a
PR #64: merged
Architecture: single entry / single state / single render
```

หน้า Pro ตัวจริงเริ่มจาก `dist/pro.html` และโหลด `dist/assets/pro/app.js`
เพียงจุดเดียว จากนั้น import โมดูลตามหน้าที่โดยตรง ไม่โหลด shell, core หรือ override
รุ่นเก่ามาแปะทับภายหลัง

## ฟังก์ชันที่มี

- Upload `.xlsx`, `.xlsm`, `.xls`, `.csv`
- อ่าน `pivotCache` ของ DOIT โดยตรง ถ้าไฟล์เป็น DOIT template
- ใช้ `TotInvc` เป็นยอดเงินหลัก เพื่อกันยอดซ้ำจาก field invoice header
- สูตรราคา V2.1:
  - `unitPrice = Correct Amount / Qty PCS`
  - `lineTotal = qty × unitPrice`
- Dashboard ภาครวม
- Drill-down:
  - ภาครวม → รายบุคคล / PS
  - รายบุคคล → ร้าน
  - ร้าน → SKU
  - SKU → รายการ TOD
  - ร้าน → ถอดบิล
- Filter:
  - บุคคล / PS
  - ร้าน
  - SOTypeID
  - พื้นที่ / Area
  - ช่องทาง
  - หมวดสินค้า
  - แบรนด์
  - search free text
- Ranking:
  - Top คนขาย
  - Top ร้าน
  - Top SKU
  - Area
  - Type
  - Brand
- หน้า TOD รายละเอียด
- หน้าถอดบิลแยกร้าน
- Copy ข้อความส่งร้าน
- Print บิล
- ตรวจผิดปกติ:
  - ไม่มีบุคคล
  - ไม่มีร้าน
  - ไม่มี invoice
  - qty 0
  - amount 0
  - unit price 0
  - ราคา/ชิ้นสูงผิดปกติ
- Export CSV:
  - แถวที่กรอง
  - รายบุคคล
  - รายร้าน
  - summary อื่น ๆ จากหน้า dashboard

## เอกสารสำคัญ

```text
docs/HANDOFF_1028_NATIVE.md   สรุปส่งต่องานล่าสุดกัน context หลุด
docs/PROJECT_STRUCTURE.md     สารบัญโครงสร้างไฟล์และจุดเสี่ยง
docs/ARCHITECTURE.md          ภาพรวมสถาปัตยกรรม
docs/SOURCE_AUDIT.md          baseline source audit และแผนแยกไฟล์ในอนาคต
docs/FEATURE_RULES.md         กติกาก่อนเพิ่มฟีเจอร์หรือ refactor
docs/ROADMAP.md               แผนพัฒนาต่อ
docs/QA_CHECKLIST.md          checklist ก่อน merge
docs/REAL_FILE_QA.md          วิธีตรวจไฟล์ DOIT จริงโดยไม่ commit workbook
docs/CLEANUP_AUDIT.md         บันทึก cleanup และ workflow ที่ลบ
docs/PRO_LEGACY_MANIFEST.md   รายการไฟล์ Pro รุ่นเก่าที่ยังเก็บและเหตุผล
docs/PRO_SINGLE_SOURCE_REPORT.md รายงานการย้าย Pro เป็น source เดียว
```

## โครงสร้างไฟล์สำคัญ

```text
src/App.tsx                       หน้าหลัก React และ UI รายงาน
src/lib/parser.ts                 อ่าน Excel / pivotCache / normalize DOIT rows
src/lib/analytics.ts              filter, aggregate, bill lines, CSV export
src/lib/pricing.ts                สูตรราคาและปัดเศษ
src/types.ts                      type กลางของระบบ
dist/pro.html                     หน้า Pro production ปัจจุบัน
dist/assets/pro/app.js            JavaScript entry เพียงจุดเดียว
dist/assets/pro/core.js           render flow และ event binding หลัก
dist/assets/pro/state.js          State/Undo/Redo/LocalStorage owner เพียงชุดเดียว
dist/assets/pro/parser-adapter.js อ่าน XLSX/XLSM และ normalize แถว
dist/assets/pro/filters.js        filter และ aggregate ของหน้า Pro
dist/assets/pro/print.js          print overlay และ A4 rendering
dist/assets/pro/print-model.js    bill model: 12 รายการ/บิล, 2 บิล/A4
dist/assets/pro/pro.css           CSS ของหน้า Pro และ print
scripts/smoke-check.mjs           guardrail check
scripts/test-pro-regression.mjs   regression สูตร/State/print model
tests/pro/pro-browser.spec.mjs    browser test มือถือ/Desktop/XLSX/XLSM/print
```

## แนวทางแก้ไขต่อจากนี้

- ห้ามแก้ `main` ตรง ๆ ให้ใช้ branch/PR เสมอ
- งานหน้า Pro ต้องแก้ในโมดูลเจ้าของภายใต้ `dist/assets/pro/`
- งาน State แก้ `state.js`; งาน filter แก้ `filters.js`; งาน print แก้ `print.js`/`print-model.js`
- ไฟล์ Core/Override/Print Fix รุ่นเก่าถูกลบแล้ว; ชื่อที่ยังอยู่ในเอกสาร/Test เป็น Historical/Negative guard
- หลีกเลี่ยงการใส่ CSS/JS ใหม่ยาว ๆ ลงใน `dist/pro.html` โดยตรง
- หลีกเลี่ยง workflow แบบ patch ไฟล์อัตโนมัติ เพราะเสี่ยงเขียนทับงานใหม่
- งานที่แตะ parser / pricing / print ต้องตรวจด้วยไฟล์ DOIT จริงก่อน merge
- งาน cleanup หลัง Stable 1028 Native ให้ดู `docs/HANDOFF_1028_NATIVE.md` ก่อน

## วิธีรัน

```bash
npm install
npm run dev
```

เปิด:

```text
http://localhost:3000
```

## วิธี build

```bash
npm run build
```

## วิธีตรวจ guardrail

```bash
npm run verify
```

`verify` รัน Smoke, scope guard, module regression, Telesale pagination,
local XLSX, architecture/import checks และ Playwright browser regression จริง
โดยไม่สั่ง build ที่เขียนทับ `dist`

## วิธีเทสกับไฟล์ DOIT ตัวจริง

```bash
node scripts/qa-doit-file.mjs "path/to/DOIT.xlsx" --json=qa-result.json
```

ไฟล์ DOIT จริงห้าม commit เข้า GitHub

## Field หลักจาก DOIT ที่ใช้

- Qty: `ShipQtyPCS`
- Amount: `TotInvc`
- Person: `SalespersonID`, `Salesperson_Name`, `SO_SalespersonID`, `TelesaleName`
- Store: `ShipName`, `c_Name`
- SKU: `SKU_Code`, `SKU_Desc`
- Region/Area: `Area`, `Territory`, `Territory_Desc`
- Channel: `ChannelDescr`, `Global_Channel`, `Global_Sub_Channel`
- Category/Brand: `Category`, `Brand`, `BrandForm`
- Document: `SOTypeID`, `InvcNbr`, `ShipperID`, `LineRef`

## หมายเหตุ

ถ้า CSV ภาษาไทยกลายเป็น `?` ตั้งแต่ต้นทาง แอปจะอ่านตัวเลขได้ แต่ข้อความไทยที่เสีย encoding ไปแล้วกู้คืนไม่ได้


## Pro Legacy Cleanup

Cleanup Base: `24035247351ebc99ab30c38b3efc1da74e7ef23a`

URL checkpoint เก่าสามรายการ Redirect ไป `/pro.html?t=1028`; Active Pro,
สูตร, State และ LocalStorage keys ไม่เปลี่ยน
