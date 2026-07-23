# Handoff — Pro 1028 Single Source

เอกสารนี้เป็นข้อมูลส่งต่อของหน้า Pro ปัจจุบัน หลัง PR #64 ถูก Merge แล้ว

## สถานะจริง

```text
Production URL: /pro.html?t=1028
Production commit: 8b982911f7b13e9c9231d8a12c78709f6a674324
PR #64: merged
Runtime: single entry / single state / single render
```

## Active architecture

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> dist/assets/pro/core.js
      -> owner modules under dist/assets/pro/
```

- Entry HTML: `dist/pro.html`
- App entry: `dist/assets/pro/app.js`
- Main render: `dist/assets/pro/core.js`
- State owner: `dist/assets/pro/state.js`
- Parser: `dist/assets/pro/parser-adapter.js`
- Filters: `dist/assets/pro/filters.js`
- Print: `dist/assets/pro/print.js` และ `dist/assets/pro/print-model.js`

`dist/pro.html` มี `<script type="module" src="/assets/pro/app.js"></script>`
เพียงจุดเดียว ไม่มีการ fetch HTML เก่า, string replacement, dynamic loader,
MutationObserver ซ่อม Core หรือ override หลัง Render

## เจ้าของความสามารถ

| ความสามารถ | Source owner |
|---|---|
| State, Undo/Redo, Autosave, LocalStorage | `state.js` |
| Cloud | `data-source.js` |
| XLSX/XLSM และ normalize | `parser-adapter.js` |
| Filter และ grouping | `filters.js` |
| ส่งร้านนี้, Enter/Next | `send-store.js` |
| รวม Order | `order.js` |
| Telesale | `telesale.js` |
| จัดแล้ว | `done.js` |
| Print model/overlay | `print-model.js`, `print.js` |
| Developer QR/ทีมพัฒนา | `developer-qr.js`, `team.js` |
| Fuel secret | `fuel-secret.js` |
| UI/Print CSS | `pro.css` |

## กฎที่ห้ามเปลี่ยน

- ลำดับฟิลด์ยอดเงินและสูตรราคา/VAT
- LocalStorage prefix `doit-core-unified-v1:`
- Print edit key `doit-pro-print-price-edits-v1`
- ใช้เฉพาะจำนวน “ส่งร้านนี้” ในบิล
- จำนวน 0 ไม่เข้าปริ้น
- 12 รายการต่อบิล
- 2 บิลต่อ A4
- Telesale 20 บิลต่อหน้า
- Supabase project/endpoint และโครงสร้าง Cloud

## ไฟล์ Legacy

ไฟล์ Core/Override/Print Fix รุ่นเก่าเป็น **LEGACY — ไม่ใช่ Active Pro
source และห้ามแก้เพื่อแก้ปัญหาหน้า Pro ปัจจุบัน** รายละเอียดผู้ใช้งานที่ยัง
เหลือและรายการเสนอให้ลบอยู่ใน `docs/PRO_LEGACY_MANIFEST.md`

## การตรวจขั้นต่ำก่อน PR

```bash
npm ci
npx playwright install chromium
npm run verify
```

`verify` ต้องผ่าน Smoke scope guard, regression, Telesale, local XLSX,
architecture/import และ Browser regression ที่ 390×844 กับ 1365×768

## Rollback

Rollback point ของ Production single-source คือ
`8b982911f7b13e9c9231d8a12c78709f6a674324` ห้าม patch `main` หรือ Deploy
Production เพื่อแก้ฉุกเฉิน ให้ revert ผ่าน branch/PR และรันทดสอบครบ
