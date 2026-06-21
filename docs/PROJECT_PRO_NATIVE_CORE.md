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

## สถานะ checkpoint

```text
Phase 1: DONE — baseline confirmed
Phase 2: DONE — native core snapshot extracted
Phase 3: DONE — preview bridge tested by user and merged
Phase 4: STARTED — replace wrapper plan / no production switch yet
```

## Phase 1 — Freeze baseline

ผลลัพธ์:

- `main` ยังเป็น production baseline
- Pro Stable 1026/1027 ยังใช้งานจริงได้
- smoke check ผ่าน
- production `pro.html` ยังไม่ถูกรื้อ

## Phase 2 — Extract native core

ผลลัพธ์:

- ดึง legacy core จาก commit `a5ab43603f9e6893c7958a85906f224594aee21d`
- วางเป็นไฟล์ source จริงใน repo:

```text
dist/assets/pro-native-core.js
```

- เพิ่มหน้า preview:

```text
dist/pro-native-test.html
```

- ยังไม่ให้ production ใช้แทน `pro.html`

## Phase 3 — Preview behavior bridge

ผลลัพธ์:

- เพิ่ม currentState bridge ให้ preview
- เพิ่ม send Next navigation ให้ preview
- เพิ่ม done-mode bridge ไป `renderDoneFromCore`
- เพิ่ม order total row ให้ preview
- เพิ่ม Telesale total row ให้ preview
- ผู้ใช้ตรวจ preview แล้วแจ้งว่า “ปกติดี”
- PR preview checkpoint ถูก merge แล้ว

ไฟล์ที่เกี่ยวข้อง:

```text
dist/assets/pro-native-core-overrides.js
```

## Phase 4 — Replace wrapper

เป้าหมายของ phase นี้คือย้ายจาก “preview bridge” ไปเป็น “native core ตัวจริง” อย่างระวัง

สิ่งที่จะทำทีละขั้น:

```text
1. วิเคราะห์จุดที่ยังอยู่ใน pro-native-core-overrides.js
2. ย้าย currentState เข้า pro-native-core.js จริง
3. ย้าย send Next navigation เข้า pro-native-core.js จริง
4. ย้าย done/order/Telesale logic เข้า pro-native-core.js จริง
5. ลด dependency ของ preview bridge ลงทีละจุด
6. ทำหน้า preview อีกครั้ง
7. ยังไม่เปลี่ยน production pro.html จนกว่าผ่าน QA จริง
```

กฎ Phase 4:

```text
- ห้ามแก้ production pro.html ใน commit แรกของ Phase 4
- ห้ามลบ wrapper production จนกว่า native core preview ผ่านครบ
- ห้ามเปลี่ยนสูตรยอดเงิน
- ห้ามเปลี่ยนจำนวนต่อบิล
- ห้ามให้สินค้า 0 ชิ้นเข้าใบปริ้น
- ถ้า CI ตก ให้หยุดและแก้เฉพาะจุด
```

## Phase 5 — Final QA ก่อน production switch

ต้องผ่าน:

```text
npm run smoke
```

Manual QA:

```text
1. เปิด Pro preview บนมือถือ
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
1. ไม่ merge PR ที่เสี่ยง
2. ปิด branch migration
3. main ยังใช้ Pro Stable ปัจจุบัน
4. เปิดบั๊กย่อยใหม่
```

## สถานะล่าสุด

```text
Issue: #41
Merged checkpoint: PR #42
Active branch: native-core-phase4
Production pro.html: untouched by Phase 4 start
```
