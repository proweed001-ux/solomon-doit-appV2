# DOIT Admin Storage Manager

Admin Storage Manager is an admin-only section inside the existing Admin page. It is not a separate Pro page.

Admin page:

- `dist/admin.html`
- Production path after merge: `/admin.html?v=8`

Client script:

- `dist/assets/admin-storage-manager-v1.js`

Server function source:

- `supabase/functions/admin-storage/index.ts`

## UI rules

- Storage controls live inside the existing Admin page.
- No duplicate token box is added.
- The Storage section reuses the existing Cloud / Supabase fields from the Admin settings card.
- The main flow is: Refresh Storage -> Preview old files -> Delete only after explicit enablement and confirmation.

## Safety rules

- The browser page never contains server-only keys.
- The active file paths are marked as protected.
- The latest two uploaded storage objects are marked as protected.
- Old-file cleanup starts with dry-run preview.
- Write mode is intentionally disabled in the first safe preview.

## Usage flow

1. Open `/admin.html?v=8`.
2. Fill the existing Cloud / Supabase config.
3. Go to `จัดการถังเก็บข้อมูล Storage`.
4. Click `รีเฟรช Storage`.
5. Check total files, total storage size, latest upload, and active file.
6. Use `Preview ไฟล์ที่จะล้าง` before cleanup.
7. Review the preview before enabling write mode.

## Boundaries

- Do not put storage maintenance controls on `pro.html`.
- Do not create a separate public admin-storage page for normal use.
- Do not put server-only keys in static HTML or JavaScript.
- Do not change Pro formulas, print layout, or Cloud loading flow in this phase.
