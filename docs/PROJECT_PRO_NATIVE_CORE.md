# Project Pro Native Core

ชื่อระบบงานใหญ่: **Project Pro Native Core**

คำแปลแบบชาวบ้าน: ย้ายไส้ในหน้า Pro จากระบบพ่วง CDN/patch ให้เป็น core ตัวจริงของเราเองใน repo

## ทำไมต้องมีงานนี้

ตอนนี้หน้า Pro ใช้งานได้จริงแล้ว แต่โครงสร้างข้างในยังมีชั้นเสี่ยง:

```text
pro.html
  -> /assets/pro-core-v4.js
    -> fetch legacy core จาก jsdelivr ที่ pin commit เก่า
    -> patchLegacyCore/string replace
    -> eval(code)
    -> โหลด print modules เพิ่ม
```

งานนี้จะเปลี่ยนเป็น:

```text
pro.html
  -> /assets/pro-core-v4.js ของ repo เราเอง
    -> ทำงานตรง
    -> ไม่มี fetch legacy core จาก jsdelivr
    -> ไม่มี eval
    -> ไม่มี string replace patch
```

## เป้าหมาย

- เอา `CORE_URL` ที่ชี้ jsdelivr ออก
- เอา `fetch(CORE_URL)` ออก
- เอา `(0, eval)(code)` ออก
- เอา `patchLegacyCore()` ออก
- รวม fix ปัจจุบันเข้า core จริง
- ให้ `window.DOIT_CORE_APP.currentState()` เป็น API จริง ไม่ใช่ patch string
- ให้หน้าเตรียมปริ้นยังอ่าน state สดจาก core
- รักษา Pro Stable 1026/1027 behavior ให้เหมือนเดิม

## สิ่งที่ห้ามเปลี่ยน

- สูตรยอดเงิน
- ราคา VAT
- 12 รายการต่อบิล
- 2 บิลต่อ A4
- สินค้า 0 ชิ้นไม่เข้าใบปริ้น
- เตรียมปริ้นใช้เฉพาะช่อง “ส่งร้านนี้”
- ช่อง “ส่งร้านนี้” กด Next ลงล่าง
- Telesale แยกตามเดิม
- autosave/localStorage key เดิม
- หน้า Cloud load เดิม

## แผนงาน

### Phase 1 — Freeze baseline

- ยืนยัน `main` ปัจจุบันคือ baseline
- ยืนยัน `pro-core-v4.js` version 1027 ยังทำงาน
- ยืนยัน smoke check ผ่าน
- ยืนยันหน้า Pro ใช้งานจริงก่อนเริ่มรื้อ

### Phase 2 — Extract native core

- ดึง legacy core จาก commit `a5ab43603f9e6893c7958a85906f224594aee21d`
- วางเป็นไฟล์ source จริงใน repo
- ยังไม่ให้ production ใช้ทันที
- เปรียบเทียบ behavior กับ wrapper ปัจจุบัน

### Phase 3 — Merge current fixes into native core

รวม fix เหล่านี้เข้า core จริง:

- done-mode ใช้ `renderDoneFromCore`
- order-mode รวม total row
- Telesale total row
- send Next navigation
- `DOIT_CORE_APP.currentState()`
- print uses send-only quantities

### Phase 4 — Replace wrapper

- ให้ `dist/assets/pro-core-v4.js` เป็น native core จริง
- ลบ `CORE_URL`
- ลบ `fetch(CORE_URL)`
- ลบ `eval`
- ลบ `patchLegacyCore`
- คง module print CSS/JS ที่ยังจำเป็นไว้ก่อน

### Phase 5 — QA

ต้องผ่าน:

```text
npm run smoke
```

Manual QA:

```text
1. เปิด Pro บนมือถือ
2. โหลด Cloud
3. เลือกวันที่
4. เลือก PS
5. เลือกร้านส่ง
6. คีย์ช่องส่งร้านนี้ต่อเนื่อง
7. เตรียมปริ้น
8. ตรวจ 12 รายการต่อบิล
9. ตรวจ 2 บิลต่อ A4
10. ปริ้นจริง
11. ตรวจ Telesale
12. ตรวจ autosave
```

## Rollback

ถ้าพัง:

```text
1. ไม่ merge PR
2. ปิด branch migration
3. main ยังใช้ Pro Stable ปัจจุบัน
4. เปิดบั๊กย่อยใหม่
```

## สถานะ

```text
Started
Issue: #41
Branch: project-pro-native-core
Production untouched by this document-only start
```
