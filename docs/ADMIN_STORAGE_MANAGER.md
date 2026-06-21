# DOIT Admin Storage Manager

Admin Storage Manager is an admin-only page for checking Supabase Storage usage.

Page:

- `dist/admin-storage.html`

Supabase Edge Function source:

- `supabase/functions/admin-storage/index.ts`

Endpoint:

- `https://saodmeoilixfdqentofp.supabase.co/functions/v1/admin-storage`

## Safety rules

- Requires an admin token via `x-admin-token`.
- The browser page never contains the service role key.
- The active file paths are marked as protected.
- The latest two uploaded storage objects are marked as protected.
- Old-file cleanup starts with dry-run preview.
- Write mode is intentionally disabled in the first safe preview.

## Required Supabase secrets

Set one of these secrets before using the admin page:

- `ADMIN_STORAGE_TOKEN_SHA256`, preferred.
- `ADMIN_STORAGE_TOKEN`, acceptable for quick internal use.

The browser page stores the token only in localStorage on the admin device.

## Usage flow

1. Open `/admin-storage.html`.
2. Enter admin token.
3. Click `รีเฟรชข้อมูล`.
4. Check total files, total storage size, latest upload, and active file.
5. Use `Preview ไฟล์ที่จะล้าง` before cleanup.
6. Review the preview before enabling write mode.

## Boundaries

- Do not put storage maintenance controls on `pro.html`.
- Do not put service role keys in static HTML or JavaScript.
- Do not change Pro formulas, print layout, or Cloud loading flow in this phase.
