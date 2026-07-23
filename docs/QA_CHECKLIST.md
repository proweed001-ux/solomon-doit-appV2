# QA Checklist — Active Pro

## Stable baseline

```text
URL: /pro.html?t=1028
Production commit: 8b982911f7b13e9c9231d8a12c78709f6a674324
Entry: dist/assets/pro/app.js
State: dist/assets/pro/state.js
```

## Automated checks

หลัง `npm ci` และติดตั้ง Chromium ให้รัน:

```bash
npm run verify
```

`verify` ต้องรันและผ่าน:

```text
npm run smoke
npm run test:pro-scope
npm run test:pro-regression
npm run test:pro-lazy
npm run test:local-xlsx
npm run test:pro-architecture
npm run test:pro-modules
npm run test:pro-browser
```

ห้ามใช้ build ที่เขียนทับ `dist` สำหรับงาน Pro ถ้าจำเป็นต้อง build ต้องตรวจ
Git diff ทุกไฟล์ก่อน commit

## Browser coverage

- Mobile 390×844
- Desktop 1365×768
- single `/assets/pro/app.js` entry
- ไม่มี request ไป shell/core/override/print-fix รุ่นเก่า
- ไม่มี JavaScript error
- XLSX และ XLSM อัปโหลดผ่าน `<input type="file">` จริง
- Date/PS/filter/search
- Enter/Next, Undo/Redo, reload state
- Developer QR, Fuel secret, Telesale 20+1 pagination
- Print 12/12/1 = 3 บิล, 2 A4, zero item excluded

Browser fixture เป็นข้อมูลทดสอบที่สร้างใน `test-results/` เท่านั้น และ mock
เฉพาะ GET ภายนอก จึงไม่เขียนข้อมูลจริง

## Manual checks before Merge

1. เปิด Preview บนมือถือจริง
2. โหลด Cloud แบบอ่านอย่างเดียว
3. เปิดไฟล์ DOIT ที่อนุญาตสำหรับ QA
4. ตรวจหน้าตา/การเลื่อนด้วยนิ้วและ keyboard มือถือจริง
5. เปิด OS Print Preview จริงบนอุปกรณ์/เครื่องพิมพ์เป้าหมาย
6. ตรวจขอบ A4, scaling และ 2 บิลต่อกระดาษ
7. ยืนยัน Production URL/commit ยังไม่เปลี่ยนก่อนอนุมัติ Merge

Automated print overlay ผ่านไม่ได้แปลว่า OS Print Preview ผ่าน

## High-risk owner files

```text
dist/pro.html
dist/assets/pro/core.js
dist/assets/pro/state.js
dist/assets/pro/parser-adapter.js
dist/assets/pro/filters.js
dist/assets/pro/send-store.js
dist/assets/pro/print.js
dist/assets/pro/print-model.js
dist/assets/pro/pro.css
```

ไฟล์ Core/Override/Print Fix รุ่นเก่าเป็น LEGACY และห้ามแก้แทน owner files
ด้านบน
