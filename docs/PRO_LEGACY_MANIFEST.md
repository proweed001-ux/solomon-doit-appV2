# Pro Legacy Manifest

วันที่ตรวจ Baseline: 23 กรกฎาคม 2026

Cleanup Base / Rollback point: `24035247351ebc99ab30c38b3efc1da74e7ef23a`

Branch: `codex/pro-legacy-cleanup`

## Active source ปัจจุบัน

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> static owner modules under dist/assets/pro/
```

State owner คือ `dist/assets/pro/state.js` เพียงชุดเดียว และ Print owner คือ
`dist/assets/pro/print-model.js`, `dist/assets/pro/print.js` และ
`dist/assets/pro/pro.css`

## Reference audit ก่อนลบ

Git blob SHA ด้านล่างบันทึกจาก Cleanup Base ก่อนลบไฟล์

| Legacy file | Git blob SHA | Active runtime | Test/QA | เอกสาร/Negative guard | วิธีจัดการ |
|---|---|---:|---:|---:|---|
| `dist/assets/pro-core-v4.js` | `b614a2b449aab5690c06b5fee98c63daa6bd1da6` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-native-core.js` | `2f27ce533dd098317e324b38976fde4e3faf0b92` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-native-core-overrides.js` | `6c05483b5ea6de70e6ebba2b1be942b35be4f0fa` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-print-store-bills.js` | `fc6c0f68887e9250c0c4d7dd5668254c6015d73e` | ไม่ | ใช่ — qa-doit เดิม | ประวัติ/Negative guard | ย้าย QA ไป Active Print แล้วลบ |
| `dist/assets/pro-print-mode-fixes.js` | `8b3ba8c561c5e6902c528655d45e5328b96f8b85` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-print-column-widths.js` | `a5d029c7ad195f21c613931e740054d12a209ec2` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-print-a4-pro-fix.js` | `c1a0470967b588100a1b3e6015cd96b0b3c3bd96` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-print.css` | `46c36d234afaacae788d9f24d482386f565d3e8f` | ไม่ | ใช่ — qa-doit เดิม | ประวัติ/Negative guard | ย้าย QA ไป pro.css แล้วลบ |
| `dist/assets/pro-team-single.js` | `117c8c8b3b4fd7982256479693562b7f11681be6` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/assets/pro-results-mode.js` | `e2a84f6d0bedb5d5272d652e0fd7df08d3688d70` | ไม่ | ไม่ | ประวัติ/Negative guard | ลบ |
| `dist/pro-native-test.html` | `a24e5b35a5d52c6c233f0e50ba6064307590e779` | ไม่ | ใช่ — local XLSX เดิม | ประวัติ/URL checkpoint | ย้าย Test, เพิ่ม Redirect แล้วลบ |
| `dist/pro-native-phase4.html` | `85062e7d450c3b8d2df32fd277381bae97709ed7` | ไม่ | ใช่ — local XLSX เดิม | ประวัติ/URL checkpoint | ย้าย Test, เพิ่ม Redirect แล้วลบ |
| `dist/pro-native-ui.html` | `bd589a6d817d5286f40e0a2e39beaa91466c7e14` | ไม่ | ไม่ | ประวัติ/URL checkpoint | เพิ่ม Redirect แล้วลบ |
| `dist/assets/pro-action-dump.txt` | `932647020b38d32fe5b607e30d1528e73064c709` | ไม่ | ไม่ | หลักฐาน migration | ลบ; เก็บประวัติในเอกสาร |

ผล Audit: ไม่มีไฟล์เป้าหมายอยู่ใน Active module graph หรือ Network request
ของ Browser regression หน้า Pro การอ้างที่เหลือก่อน Cleanup เป็น Test/QA,
ตัว checkpoint เอง, เอกสารประวัติ และ Negative assertions เท่านั้น

## สิ่งที่ย้ายก่อนลบ

- `scripts/test-local-xlsx.mjs` เหลือหน้าใช้งานจริง
  `admin.html`, `fuel.html`, `pick.html` และตรวจ Active Pro แยกผ่าน
  `dist/pro.html -> dist/assets/pro/app.js`
- `scripts/qa-doit-file.mjs` ตรวจค่าจาก Active Print source โดยตรง:
  `print-model.js`, `print.js`, `pro.css`
- `scripts/test-qa-doit.mjs` สร้าง XLSX fixture ใน `test-results`,
  เรียก QA script จริง และลบ fixture เมื่อจบ
- URL checkpoint ทั้งสาม Redirect แบบชั่วคราวไป
  `/pro.html?t=1028` ผ่าน `vercel.json`

## สถานะหลัง Cleanup

ไฟล์ Legacy ทั้ง 14 รายการในตารางถูกลบแล้ว ชื่อไฟล์ยังคงอยู่ในเอกสารนี้,
Must-not-exist guard, Forbidden token guard และ Forbidden network request
list โดยเป็น **Historical/Negative reference** ไม่ใช่ Live reference

Baseline LocalStorage ที่ต้องคงเดิม:

- `doit-core-unified-v1:<active-key>`
- `doit-pro-print-price-edits-v1`

Baseline Browser tests: 2 test cases × Mobile/Desktop = 4 tests
