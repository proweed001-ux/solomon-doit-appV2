# CODEX REVIEW HANDOFF — Solomon DOIT App V2.6.5

เอกสารนี้ใช้ส่งให้ Codex ตรวจโค้ดรอบ v265 ก่อนเปิดใช้งานจริง

## สถานะปัจจุบัน

โค้ด v265/v262 ทำและ deploy แล้ว แต่ยังไม่ถือว่าจบ 100% จนกว่าจะทดสอบจริงครบ:

```text
Admin upload JSON
Database active row มี data_path
Pro โหลด JSON/index ไม่ fallback Excel
มือถือทดสอบทุกฟังก์ชันจริง
```

## URLs

```text
Pro:   https://solomon-doit-app-v2.vercel.app/pro.html?v=265
Admin: https://solomon-doit-app-v2.vercel.app/admin.html?v=265
Smoke: https://solomon-doit-app-v2.vercel.app/smoke-json-v265.html
```

## Files to review

```text
dist/pro.html
dist/admin.html
dist/assets/pro-cloud-loader-v265.js
dist/assets/pro-json-app-v265.js
dist/assets/telesale-drawer-v262.js
dist/assets/admin-json-v265.js
dist/smoke-json-v265.html
```

## Review focus

### 1. JSON mode state

File:

```text
dist/assets/pro-json-app-v265.js
```

Check:

```text
send/add/pull key correctness
Undo/Redo correctness
Autosave version isolation
Reset behavior
Filter behavior
Pagination behavior
Copy/Export/Print handlers
```

Business rule:

```text
Date + PS creates product pool.
Receiver/store select is the real delivery shop.
Do not filter product pool down to only the keyed shop.
```

### 2. Telesale drawer

File:

```text
dist/assets/telesale-drawer-v262.js
```

Check:

```text
No broad MutationObserver
loadRows caches same row reference
Bill cache invalidates only when source rows change
Drawer displays store, bill, tele, date, product rows correctly
Opening drawer does not slow main table render
```

Rule:

```text
Telesale data is real order/store data from DOIT.
```

### 3. Cloud loader

File:

```text
dist/assets/pro-cloud-loader-v265.js
```

Check:

```text
No broad MutationObserver
Active version query is correct
If data_path exists, load pro-json-app-v265.js
If data_path is missing, fallback to Excel mode
Error messages are clear
```

### 4. Admin JSON upload

File:

```text
dist/assets/admin-json-v265.js
```

Check:

```text
Progress text does not show fake parse percentage
Excel upload path is correct
JSON upload path is correct
Metadata contains data_path, data_status, data_schema_version
New version is activated before old active rows are disabled
Failure after metadata insert marks the new row failed when possible
```

Known limitation:

```text
This is still browser-side REST flow, not a full server transaction.
Production hardening should move upload/metadata/activation to a server-side function.
```

### 5. HTML wiring

Check Pro loads:

```text
/assets/telesale-drawer-v262.js?v=262
/assets/pro-cloud-loader-v265.js?v=265
```

Check Admin loads:

```text
/assets/admin-json-v265.js?v=265
```

Check Cloud Loader dynamic-loads:

```text
/assets/pro-json-app-v265.js?v=265
```

## Smoke test

Open:

```text
https://solomon-doit-app-v2.vercel.app/smoke-json-v265.html
```

Expected result:

```text
SUMMARY PASS
```

Smoke coverage:

```text
JSON app exists
JSON app version v265
Telesale drawer API exists
Mock JSON loads
Table renders
Filters fill
Receiver select works
Send input updates done amount
Undo works
Redo works
Raw tab works
Dist tab works
Telesale drawer opens
No uncaught JS error
```

## Manual test after Codex review

Admin:

```text
1. Open /admin.html?v=265
2. Enter cloud config
3. Select real DOIT file
4. Click “อัปโหลด JSON + ตั้งล่าสุด”
5. Confirm success message
```

Database row expected:

```text
is_active true
status active
data_path not empty
data_status ready
data_schema_version 1
row_count correct
```

Pro:

```text
1. Open /pro.html?v=265
2. Click ตรวจไฟล์ล่าสุด
3. Confirm JSON/index เบา
4. Click โหลดไฟล์ล่าสุดจาก Cloud
5. Confirm JSON loaded and no Excel fallback
```

Feature checklist:

```text
Date filter
PS filter
Receiver store
Search
Brand/type filter
Send qty
Add qty
Pull qty
Undo
Redo
Reset
Copy summary
Export CSV
Prepare print
Telesale drawer
Raw tab
Dist tab
Done tab
Ship tab
Pagination
Autosave
```

## Known limitations

```text
Real upload flow still needs live testing.
Mobile performance still needs live testing.
Security hardening is not finished.
Large JSON rows may still need pre-indexing later.
```

## Claims not allowed yet

```text
Do not claim 100% complete.
Do not claim all buttons are verified until manual testing passes.
Do not claim lag is fully solved until mobile testing passes.
```
