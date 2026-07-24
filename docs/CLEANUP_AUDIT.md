# Cleanup Audit

## Pro Legacy Cleanup — 23 กรกฎาคม 2026

Cleanup Base / Rollback point:
`24035247351ebc99ab30c38b3efc1da74e7ef23a`

Branch: `codex/pro-legacy-cleanup`

ขอบเขตของรอบนี้มีเพียงการย้าย Test/QA ออกจาก Pro Legacy, เพิ่ม Redirect
สำหรับ bookmark checkpoint เก่า, ลบไฟล์เป้าหมาย 14 รายการ และเพิ่ม
Negative guards ไม่ได้แก้ Active Pro business logic, สูตร, State, parser,
Supabase หรือ Promo/Promotion

Active Pro ยังคงเป็น:

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> dist/assets/pro/state.js
      -> dist/assets/pro/print-model.js
      -> dist/assets/pro/print.js
      -> dist/assets/pro/pro.css
```

หน้า checkpoint ที่ลบ:

- `/pro-native-test.html`
- `/pro-native-phase4.html`
- `/pro-native-ui.html`

ทั้งสาม URL Redirect ไป `/pro.html?t=1028` และมี Config test ป้องกัน
Redirect loop

งานนี้ไม่แตะ Workflow ซ่อม Icon ต่อไปนี้:

- `.github/workflows/apply-icon-from-b64.yml`
- `.github/workflows/rebuild-icons-from-drawable.yml`
- `.github/workflows/fix-valid-icon-build.yml`

Reference audit และ Git blob SHA ก่อนลบอยู่ใน
`docs/PRO_LEGACY_MANIFEST.md`
