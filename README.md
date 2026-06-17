# Solomon DOIT App V2.1 Complete

ตัวนี้เป็นเวอร์ชันครบกว่า V2 Core: อ่านไฟล์ DOIT จริง, ถอดบิล, และทำรายงานตั้งแต่ภาครวมจนถึงรายบุคคล

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

## โครงสร้างไฟล์สำคัญ

```text
src/App.tsx                       หน้าหลัก React และ UI รายงาน
src/lib/parser.ts                 อ่าน Excel / pivotCache / normalize DOIT rows
src/lib/analytics.ts              filter, aggregate, bill lines, CSV export
src/lib/pricing.ts                สูตรราคาและปัดเศษ
src/types.ts                      type กลางของระบบ
dist/assets/pro-core-v4.js        wrapper โหลด core เดิม + โหลดโมดูลปริ้น
dist/assets/pro-print-store-bills.js  logic เตรียมปริ้น Pro แยกตามร้าน
dist/assets/pro-print.css         CSS ปริ้น A4 มือถือ 2 บิลต่อหน้า
```

## แนวทางแก้ไขต่อจากนี้

- งานหลักควรแก้ใน `src/` ก่อน แล้วค่อย build
- งานปริ้น Pro เฉพาะหน้าปัจจุบันถูกแยกไว้ที่ `dist/assets/pro-print-store-bills.js` และ `dist/assets/pro-print.css`
- หลีกเลี่ยงการใส่ CSS/JS ใหม่ยาว ๆ ลงใน `dist/pro.html` โดยตรง
- หลีกเลี่ยง workflow แบบ patch ไฟล์อัตโนมัติ เพราะเสี่ยงเขียนทับงานใหม่

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

## วิธีเทสกับไฟล์ DOIT ตัวจริง

```bash
npm run check:doit
```

หรือระบุ path เอง:

```bash
node scripts/check-doit.mjs "path/to/DOIT.xlsx"
```

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
