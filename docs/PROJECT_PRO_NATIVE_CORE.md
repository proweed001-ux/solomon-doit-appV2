# Project Pro Native Core — Historical Migration

เอกสารนี้สรุปการย้ายจาก Native stack รุ่นกลางไปสู่ Single Source ปัจจุบัน

## สถานะ

```text
Project Pro Native Core: historical migration complete
Project Pro Single Source: merged in PR #64
Current production baseline: 24035247351ebc99ab30c38b3efc1da74e7ef23a
Production entry: /pro.html?t=1028
```

## โครงสร้างที่ใช้งานจริงตอนนี้

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> dist/assets/pro/core.js
      -> dist/assets/pro/state.js
      -> owner modules
```

Source สำคัญ:

- `dist/assets/pro/app.js` — App entry เดียว
- `dist/assets/pro/core.js` — Main render flow
- `dist/assets/pro/state.js` — State owner เดียว
- `dist/assets/pro/parser-adapter.js` — Parser
- `dist/assets/pro/filters.js` — Filters/grouping
- `dist/assets/pro/print.js` และ `print-model.js` — Print owner

## โครงสร้าง Native รุ่นกลาง

ไฟล์ `pro-core-v4.js`, `pro-native-core.js`,
`pro-native-core-overrides.js` และกลุ่ม `pro-print-*.js` เคยใช้ในช่วง PR
#42–#46 แต่หลัง PR #64 ถูกตัดออกจาก `/pro.html` แล้ว

ไฟล์เหล่านี้เป็น **LEGACY — ไม่ใช่ Active Pro source และห้ามแก้เพื่อแก้
ปัญหาหน้า Pro ปัจจุบัน** บางไฟล์ยังถูกหน้า preview/test รุ่นเก่าอ้างอยู่จึง
ยังไม่ลบ ดู `docs/PRO_LEGACY_MANIFEST.md`

## ความสามารถที่ย้ายเข้า owner แล้ว

| จาก override รุ่นเก่า | Source ปัจจุบัน |
|---|---|
| Current State | `state.js` |
| Enter/Next | `send-store.js` |
| Done | `done.js` |
| Order | `order.js` |
| Telesale | `telesale.js` |
| Developer QR | `developer-qr.js`, `team.js` |
| Fuel secret | `fuel-secret.js` |
| Print | `print-model.js`, `print.js` |

## กฎสำหรับงานใหม่

แก้ที่ owner module เท่านั้น ห้ามสร้าง fix/patch/override/hotfix/bridge,
ห้ามรอ Core ด้วย setInterval, ห้ามใช้ MutationObserver ซ่อม Render และห้าม
สร้าง dynamic script loader

การตรวจที่ยอมรับ:

```bash
npm run verify
```

Rollback point ของสถาปัตยกรรมปัจจุบันคือ Production commit `8b982911…`


## Pro Legacy Cleanup follow-up — 23 กรกฎาคม 2026

Cleanup Base: `24035247351ebc99ab30c38b3efc1da74e7ef23a`

Legacy assets/checkpoint 14 รายการถูกลบหลังย้าย Test/QA ออกแล้ว ชื่อที่ยัง
ปรากฏในเอกสารและ Test เป็น Historical/Negative reference เท่านั้น
Active source ยังคง `dist/pro.html -> dist/assets/pro/app.js` และไม่มีการ
เปลี่ยนสูตร, State structure, LocalStorage key หรือ Print model
