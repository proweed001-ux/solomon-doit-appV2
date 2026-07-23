# Project Structure Index

## Active Pro files

```text
dist/pro.html                         Production HTML entry
dist/assets/pro/app.js                Single module entry
dist/assets/pro/core.js               Single main render flow
dist/assets/pro/state.js              Single mutable state owner
dist/assets/pro/data-source.js        Cloud read adapter
dist/assets/pro/parser-adapter.js     DOIT XLSX/XLSM adapter
dist/assets/pro/filters.js            Filter/group owner
dist/assets/pro/send-store.js         Send-store/Enter/Next owner
dist/assets/pro/order.js              Order owner
dist/assets/pro/telesale.js           Telesale owner
dist/assets/pro/done.js               Done owner
dist/assets/pro/print-model.js         Print model owner
dist/assets/pro/print.js               Print UI owner
dist/assets/pro/developer-qr.js        Developer QR owner
dist/assets/pro/team.js                Team modal owner
dist/assets/pro/fuel-secret.js         Fuel secret owner
dist/assets/pro/results-mode.js        Results owner
dist/assets/pro/utils.js               Shared stateless helpers
dist/assets/pro/pro.css                Active UI and Print CSS
dist/assets/vendor/xlsx-0.18.5.full.min.js Local XLSX browser bundle
```

## Pro tests and guards

```text
scripts/smoke-check.mjs
scripts/pro-change-scope.mjs
scripts/test-pro-change-scope.mjs
scripts/test-pro-regression.mjs
scripts/test-pro-telesale-pagination.mjs
scripts/test-local-xlsx.mjs
scripts/test-pro-architecture.mjs
scripts/test-pro-module-syntax.mjs
scripts/fixtures/pro-browser-fixture.mjs
tests/pro/pro-browser.spec.mjs
playwright.pro.config.mjs
```

## Active CI

`.github/workflows/web-ci.yml` resolve Base SHA, รัน `npm ci`, ติดตั้ง
Chromium แล้วรัน Smoke, scope, regression, lazy pagination, local XLSX,
architecture, module syntax/import และ Browser tests

## Legacy Pro files

Core/Override/Print Fix รุ่นเก่าที่อยู่นอก `dist/assets/pro/` ไม่อยู่ใน
Production import graph และห้ามใช้เป็น source แก้บั๊ก หน้า preview/test
เก่าที่ยังอ้างไฟล์เหล่านั้นและเหตุผลที่ยังเก็บอยู่ระบุใน
`docs/PRO_LEGACY_MANIFEST.md`

## Editing rule

ปัญหาแต่ละส่วนต้องแก้ใน owner module ด้านบน ห้ามสร้าง fix, patch, override,
hotfix, bridge, dynamic loader หรือ DOM observer เพื่อซ่อม Core
