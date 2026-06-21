# Handoff — Pro Stable 1028 Native

เอกสารนี้ใช้กัน context หลุด เวลาเปิดงานต่อในแชทใหม่หรือให้คนอื่นรับช่วง

## สถานะล่าสุด

```text
Production stable: Pro Stable 1028 Native
Production URL: https://solomon-doit-app-v2.vercel.app/pro.html?t=1028
Project Pro Native Core: COMPLETE
Issue: #41 closed as completed
Last stable lock PR: #45
```

## สิ่งที่เสร็จแล้วจริง

```text
PR #42: native core preview checkpoint
PR #43: native UI mirror checkpoint
PR #44: production switch candidate
PR #45: lock Pro Stable 1028 Native
PR #46: stable handoff / README / QA notes
```

ผลลัพธ์หลัก:

```text
- production เปิดผ่านมือถือจริงแล้ว
- หน้าตา Pro เดิมยังอยู่
- Cloud / Filter / ส่งร้านนี้ / Print / Telesale ผ่าน
- pro-core-v4.js ไม่ fetch legacy core จาก jsdelivr แล้ว
- ไม่มี eval(code) ใน production bootstrap path
- ไม่มี patchLegacyCore/string replace ใน production bootstrap path
- หน้าแรกและ redirect เก่าไป /pro.html?t=1028 แล้ว
```

## CurrentState status

```text
Current state API is now exported directly from inside pro-native-core.js closure.
It reads sel/q/send/add/pull/ins/mode/page/pageSize/showDetails/remainView from the live core state via snap().
```

เหตุผล:

```text
- ลดความเสี่ยงกรณี localStorage มีหลายไฟล์/หลายวันค้างอยู่
- currentState ไม่ควรเลือกไฟล์เก่าจาก sendCount สูงกว่า ถ้ามี active session ล่าสุดแล้ว
- ยังไม่ลบ fallback จนกว่าจะย้าย API เข้า pro-native-core.js โดยตรงครบและ QA แล้ว
```

## โครงสร้าง production ตอนนี้

```text
pro.html
  -> /assets/pro-core-v4.js?v=...
    -> native stack bootstrap
      -> pro-print-store-bills.js
      -> pro-native-core.js
      -> pro-native-core-overrides.js
      -> pro-print-mode-fixes.js
      -> pro-print-column-widths.js
      -> pro-print-a4-pro-fix.js
```

## ไฟล์สำคัญที่ห้ามแก้ตรง ๆ โดยไม่มี PR/QA

```text
dist/pro.html
dist/assets/pro-core-v4.js
dist/assets/pro-native-core.js
dist/assets/pro-native-core-overrides.js
dist/assets/pro-print-store-bills.js
dist/assets/pro-print.css
scripts/smoke-check.mjs
```

## Business rules ที่ห้ามพัง

```text
- สูตรยอดเงิน / VAT ห้ามเปลี่ยน
- เตรียมปริ้นใช้เฉพาะช่อง “ส่งร้านนี้”
- สินค้า 0 ชิ้นไม่เข้าใบปริ้น
- 12 รายการต่อบิล
- 2 บิลต่อ A4
- ช่อง “ส่งร้านนี้” กด Next/Enter ลงแถวถัดไป
- Telesale ต้องแยกเหมือนเดิม
- autosave/localStorage key เดิมยังต้องอ่านได้
- Cloud load ต้องเหมือนเดิม
```

## วิธีตรวจขั้นต่ำก่อน merge งานต่อไป

```bash
npm run smoke
```

Manual QA บนมือถือ:

```text
1. เปิด /pro.html?t=1028
2. โหลด Cloud
3. เลือกวันที่ / PS / ร้านส่ง
4. ใส่ช่องส่งร้านนี้ต่อเนื่อง
5. Enter/Next ต้องลงแถวถัดไป
6. เตรียมปริ้น
7. ตรวจ 12 รายการต่อบิล
8. ตรวจ 2 บิลต่อ A4
9. ตรวจจัดแล้ว / รวม order / Telesale
10. ปิดเปิดใหม่แล้ว state ยังสมเหตุสมผล
```

## สิ่งที่ยังไม่ควรทำทันที

```text
- ห้ามลบ preview files ทันที ถ้ายังไม่ได้ใช้ production จริงหลายรอบ
- ห้าม refactor pro-native-core.js ใหญ่ใน commit เดียว
- ห้ามลบ pro-native-core-overrides.js จนกว่าจะย้าย logic และ QA ทีละจุด
- ห้าม build React แล้ว commit dist ทับโดยไม่ดู diff
```

## งานต่อไปที่ปลอดภัยถ้าต้องทำ

ทำเป็น PR แยกทีละเรื่อง:

```text
1. ใช้งาน production จริง 1–2 รอบงาน
2. เปิด cleanup PR เพื่อตรวจ reference ของ preview files
3. currentState API ย้ายเข้า pro-native-core.js แล้ว; งานต่อไปคือย้าย send Next navigation เข้า core
4. ย้าย send Next navigation เข้า pro-native-core.js ทีละ commit
5. ย้าย done/order/Telesale bridge ทีละจุด
6. ลด pro-native-core-overrides.js หลังทุกอย่างผ่าน QA
```

## Rollback

ถ้า production มีปัญหา:

```text
1. ใช้ Vercel rollback ไป deployment ก่อน PR #44 หรือ PR #45
2. หรือ revert merge commit ล่าสุดใน GitHub
3. อย่า patch main ตรง ๆ
4. เปิด bugfix branch แล้วรัน smoke + mobile QA
```

Rollback checkpoint ที่ควรรู้:

```text
ก่อน production native switch: commit ก่อน PR #44
หลัง production native switch: PR #44 merge commit 79b26613c7f01c4c7c8f0e3555d889baa614928d
Stable lock: PR #45 merge commit 6a6ff9a83b395c54122290c71194e919b791b77c
Handoff: PR #46 merge commit 6e99bd69f2b78ca059089446becb6bec9aa1affc
```

## สรุปสั้น

```text
งานใหญ่เสร็จแล้ว
ตอนนี้ให้ใช้ Pro Stable 1028 Native เป็นตัวจริง
currentState เป็น closure-native แล้ว ไม่ใช้ localStorage scoring เป็นตัวหลัก
งานต่อไปคือ cleanup/refactor แบบค่อยเป็นค่อยไปเท่านั้น
```
