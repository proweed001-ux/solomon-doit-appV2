# Project Architecture

## Active Pro runtime

หน้า Pro มีเส้นทางใช้งานจริงเพียงเส้นทางเดียว:

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> dist/assets/pro/core.js
      -> static ES module imports
```

`dist/pro.html` เป็น HTML จริง ไม่โหลด shell เก่า และมี JavaScript entry
เพียง `<script type="module" src="/assets/pro/app.js"></script>`

## Pro module ownership

```text
dist/assets/pro/app.js             App entry
dist/assets/pro/core.js            Main render/event flow
dist/assets/pro/state.js           State, history, persistence owner
dist/assets/pro/data-source.js     Cloud read
dist/assets/pro/parser-adapter.js  XLSX/XLSM adapter and normalization
dist/assets/pro/filters.js         Filters and grouping
dist/assets/pro/send-store.js      Send-store inputs and Enter/Next
dist/assets/pro/order.js           Order view
dist/assets/pro/telesale.js        Telesale bills and pagination
dist/assets/pro/done.js            Done view
dist/assets/pro/print-model.js     Bill data model
dist/assets/pro/print.js           Print overlay/render
dist/assets/pro/developer-qr.js    Developer QR
dist/assets/pro/team.js            Team modal
dist/assets/pro/fuel-secret.js     Hidden Fuel unlock
dist/assets/pro/results-mode.js    Results mode
dist/assets/pro/pro.css            Page and print CSS
```

State ที่เปลี่ยนระหว่างใช้งาน export จาก `state.js` เพียงชุดเดียว ทุก view
ถูกเรียกจาก Render flow ปกติ ไม่มี DOM repair หลัง Core

## Stable business rules

- Raw amount priority และ net amount priority ต้องไม่เปลี่ยน
- VAT ใช้ flow เดิม
- LocalStorage prefix `doit-core-unified-v1:`
- Print ใช้เฉพาะจำนวน “ส่งร้านนี้”
- จำนวน 0 ไม่เข้า Print model
- 12 รายการต่อบิล, 2 บิลต่อ A4
- Telesale แบ่ง 20 บิลต่อหน้า

## Legacy boundary

ไฟล์ชื่อ Core/Override/Print Fix รุ่นเก่านอก `dist/assets/pro/` เป็น
**LEGACY — ไม่ใช่ Active Pro source และห้ามแก้เพื่อแก้ปัญหาหน้า Pro
ปัจจุบัน** ดู reference ที่ยังเหลือใน `docs/PRO_LEGACY_MANIFEST.md`

## QA architecture

```text
scripts/smoke-check.mjs               Foundation and change-scope guard
scripts/pro-change-scope.mjs          Fail-closed comparison against Base SHA
scripts/test-pro-change-scope.mjs     Simulated forbidden/allowed path tests
scripts/test-pro-regression.mjs       Formula/state/print model regression
scripts/test-pro-architecture.mjs     Active import graph
scripts/test-pro-module-syntax.mjs    Syntax/import presence
tests/pro/pro-browser.spec.mjs        Mobile/Desktop/XLSX/XLSM/print
```

CI checkout ใช้ full history และส่ง `PRO_SMOKE_BASE_SHA` ชัดเจน ถ้าอยู่ใน
CI แล้วหา Base ไม่ได้ Smoke ต้อง Fail

## Other app source

React source ใต้ `src/` เป็นคนละ runtime กับหน้า Pro static ปัจจุบัน ห้ามใช้
React build เขียนทับ `dist` ในงาน Pro โดยไม่ตรวจ diff ทุกไฟล์
