# Project Pro Native Core

ชื่อระบบงานใหญ่: **Project Pro Native Core**

คำแปลแบบชาวบ้าน: ย้ายไส้ในหน้า Pro จากระบบพ่วง CDN/patch ให้เป็น core ตัวจริงของเราเองใน repo

## ผลลัพธ์สุดท้าย

```text
Status: COMPLETE
Production stable: Pro Stable 1028 Native
Production URL: /pro.html?t=1028
```

production ผ่านการทดสอบจากมือถือจริงแล้ว และ `pro-core-v4.js` ไม่ใช้ legacy jsdelivr/eval/patch wrapper path แล้ว

## โครงสร้างเก่าที่ถูกยกเลิก

ก่อน migration หน้า Pro ใช้โครงสร้างนี้:

```text
pro.html
  -> /assets/pro-core-v4.js
    -> fetch legacy core จาก jsdelivr ที่ pin commit เก่า
    -> patchLegacyCore/string replace
    -> eval(code)
    -> โหลด print modules เพิ่ม
```

## โครงสร้างใหม่

ตอนนี้หน้า Pro ใช้โครงสร้างนี้:

```text
pro.html
  -> /assets/pro-core-v4.js
    -> native stack bootstrap
      -> pro-print-store-bills.js
      -> pro-native-core.js
      -> pro-native-core-overrides.js
      -> pro-print-mode-fixes.js
      -> pro-print-column-widths.js
      -> pro-print-a4-pro-fix.js
```

## สิ่งที่ทำสำเร็จแล้ว

- เอา `CORE_URL` ที่ชี้ jsdelivr ออก
- เอา `fetch(CORE_URL)` ออก
- เอา `(0, eval)(code)` ออก
- เอา `patchLegacyCore()` ออก
- รวม fix ปัจจุบันเข้า production bootstrap path
- ให้หน้าเตรียมปริ้นอ่าน state สดผ่าน `window.DOIT_CORE_APP.currentState()`
- รักษา Pro behavior เดิมให้ใช้งานได้จริง
- ไม่เปลี่ยนหน้าตา UI production

## สิ่งที่ห้ามเปลี่ยนในงานต่อไป

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
Phase 4: DONE — native UI mirror tested by user and merged
Phase 5: DONE — production switch tested by user and merged
Stable lock: DONE — Pro Stable 1028 Native
```

## Phase 1 — Freeze baseline

ผลลัพธ์:

- `main` เป็น production baseline
- smoke check ผ่าน
- production ยังปลอดภัยก่อนเริ่ม migration

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

## Phase 4 — Native UI mirror

ผลลัพธ์:

- ทำหน้า `dist/pro-native-ui.html`
- ใช้หน้าตา `dist/pro.html` เดิมเป็น visual source
- แทนเฉพาะ core stack เป็น native core
- ผู้ใช้ตรวจแล้วแจ้งว่า “ผ่าน”
- checkpoint ถูก merge แล้ว

กติกาที่ได้จาก Phase 4:

```text
- ห้ามเอาหน้า phase4 shell ไปใช้จริง เพราะหน้าตาไม่เหมือน
- production switch ต้องยึด UI จาก pro.html เดิม
- เปลี่ยนเฉพาะ core stack เท่านั้น
```

## Phase 5 — Production switch

ผลลัพธ์:

- เปิด PR #44 สำหรับ production switch candidate
- เปลี่ยน `dist/assets/pro-core-v4.js` เป็น native stack bootstrap
- ไม่แก้ layout/css/html ของ `dist/pro.html`
- smoke ผ่าน
- Vercel production deploy ผ่าน
- ผู้ใช้ตรวจ production แล้วแจ้งว่า “ปกติ” และ “ผ่าน”

## Manual QA ที่ผ่านแล้ว

```text
1. เปิด Pro production บนมือถือ
2. โหลด Cloud
3. เลือกวันที่
4. เลือก PS
5. เลือกร้านส่ง
6. คีย์ช่องส่งร้านนี้ต่อเนื่อง
7. เตรียมปริ้น
8. ตรวจ 12 รายการต่อบิล
9. ตรวจ 2 บิลต่อ A4
10. ตรวจ Telesale
11. ตรวจ autosave
```

## Rollback

ถ้าพัง:

```text
1. ใช้ main commit ก่อน PR #44 เป็น rollback point
2. กลับไป Pro Stable 1026/1027 wrapper path จาก git history ได้
3. เปิด bugfix branch ใหม่
4. ห้ามแก้บน main ตรง ๆ
```

## งานต่อไปหลัง production stable

```text
1. ใช้งาน production จริงอย่างน้อย 1–2 รอบงาน
2. ยังไม่ลบ preview files ทันที
3. ค่อยย้าย logic จาก pro-native-core-overrides.js เข้า pro-native-core.js
4. ค่อยลด bridge ทีละจุด
5. ทำ cleanup PR แยก
```

## สถานะล่าสุด

```text
Issue: #41
Merged checkpoint: PR #42, PR #43, PR #44
Stable: Pro Stable 1028 Native
Production pro.html: switched and user-tested
```
