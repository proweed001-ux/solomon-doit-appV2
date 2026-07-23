# Pro Legacy Manifest

ตรวจ reference จาก `main` ฐาน `8b982911f7b13e9c9231d8a12c78709f6a674324`
เมื่อ 23 กรกฎาคม 2026

## ข้อสรุป

ไฟล์ต่อไปนี้เป็น **LEGACY — ไม่ใช่ Active Pro source และห้ามแก้เพื่อแก้
ปัญหาหน้า Pro ปัจจุบัน**

Active `/pro.html` import graph เริ่มที่ `dist/assets/pro/app.js` และไม่อ้าง
ไฟล์ในตารางนี้

| Legacy file | Reference ที่ยังเหลือ | เหตุผลที่ยังไม่ลบ |
|---|---|---|
| `dist/assets/pro-core-v4.js` | `dist/pro-native-ui.html` และโหลด Legacy stack | หน้า preview รุ่นเก่ายังใช้ |
| `dist/assets/pro-native-core.js` | `pro-native-test.html`, `pro-native-phase4.html`, `pro-native-ui.html`, loader เก่า | หน้า checkpoint เก่ายังใช้ |
| `dist/assets/pro-native-core-overrides.js` | preview/checkpoint 3 หน้าและ loader เก่า | หน้า checkpoint เก่ายังใช้ |
| `dist/assets/pro-print-store-bills.js` | preview/checkpoint 3 หน้า, loader เก่า, `scripts/qa-doit-file.mjs` | QA script รุ่นเก่ายังอ่าน source นี้ |
| `dist/assets/pro-print-mode-fixes.js` | preview/checkpoint 3 หน้าและ loader เก่า | หน้า checkpoint เก่ายังใช้ |
| `dist/assets/pro-print-column-widths.js` | preview/checkpoint 3 หน้าและ loader เก่า | หน้า checkpoint เก่ายังใช้ |
| `dist/assets/pro-print-a4-pro-fix.js` | preview/checkpoint 3 หน้าและ loader เก่า | หน้า checkpoint เก่ายังใช้ |
| `dist/assets/pro-print.css` | loader/หน้า Legacy | Print style ของ checkpoint เก่า |
| `dist/assets/pro-team-single.js` | หน้า Legacy | Team behavior ของ checkpoint เก่า |
| `dist/assets/pro-results-mode.js` | หน้า/loader Legacy | Results behavior ของ checkpoint เก่า |
| `dist/pro-native-test.html` | `scripts/test-local-xlsx.mjs` | Native checkpoint รุ่นเก่า |
| `dist/pro-native-phase4.html` | `scripts/test-local-xlsx.mjs` | Phase 4 checkpoint รุ่นเก่า |
| `dist/pro-native-ui.html` | ไม่มี Active navigation; อ้าง Legacy stack เอง | UI mirror checkpoint รุ่นเก่า |
| `dist/assets/pro-action-dump.txt` | ไม่มี runtime reference; มีข้อความ source รุ่นเก่า | หลักฐาน migration เก่า |

`dist/pro-shell-v1028.html` ถูกลบแล้วใน PR #64 และไม่มี Active reference

## รายการเสนอให้ลบใน cleanup PR แยก

เสนอให้ลบ Legacy assets และ checkpoint pages ทั้งหมดในตาราง หลังทำครบ:

1. เปลี่ยน `scripts/test-local-xlsx.mjs` ให้ตรวจ Active Pro และหน้าที่ยังใช้จริงเท่านั้น
2. เปลี่ยน `scripts/qa-doit-file.mjs` ไม่ให้อ่าน print source รุ่นเก่า
3. ยืนยันว่าไม่มี bookmark/QA workflow ภายนอกใช้สามหน้า checkpoint
4. รัน `rg` ยืนยัน reference เป็นศูนย์
5. รัน `npm run verify` ผ่าน

ยังไม่ลบใน follow-up นี้ เพราะหลักฐานปัจจุบันแสดงว่ายังมี Test/QA reference
อยู่ การลบพร้อมแก้ CI/Browser tests จะรวมความเสี่ยงหลายก้อนเกินไป
