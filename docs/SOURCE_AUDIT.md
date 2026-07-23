# Source Audit Baseline

Cleanup round 5 records where the source is already safe enough and where future work should be split later.

This round does not change runtime behavior.

## Active Pro source map

PR #64 ถูก Merge แล้วและ Production ใช้ commit
`8b982911f7b13e9c9231d8a12c78709f6a674324`

```text
dist/pro.html
  HTML entry ตัวจริง

dist/assets/pro/app.js
  App entry เพียงจุดเดียว

dist/assets/pro/core.js
  Main render/event flow

dist/assets/pro/state.js
  State/Undo/Redo/LocalStorage owner เพียงชุดเดียว

dist/assets/pro/parser-adapter.js
  Parser adapter

dist/assets/pro/filters.js
  Filter/grouping owner

dist/assets/pro/print.js
dist/assets/pro/print-model.js
  Print owner เพียงชุดเดียว
```

Core/Override/Print Fix รุ่นเก่านอก `dist/assets/pro/` เป็น LEGACY ไม่ใช่
Active Pro source ห้ามแก้ไฟล์เหล่านั้นเพื่อแก้หน้า Pro ปัจจุบัน

## Current source map

```text
src/App.tsx
  React UI shell and pages. Handles upload, top-level state, filters, routing by mode, dashboard pages, drill-down pages, and export buttons.

src/components/AppHeader.tsx
  Header component scaffold prepared for the first low-risk App.tsx extraction.

src/lib/parser.ts
  Reads workbook data from pivotCache first, falls back to worksheet rows, maps DOIT aliases, parses dates, qty, amount, person, store, SKU, and invoice fields.

src/lib/analytics.ts
  Applies filters, builds aggregate summaries, builds bill lines, and exports CSV.

src/lib/pricing.ts
  Small numeric helper module: safe number, safe qty, money rounding, unit price, line total.

src/types.ts
  Shared app types: ParsedRow, BillLine, Filters, AggregateRow, AppMode.

src/lib/format.ts
  Display formatting only.
```

## Refactor candidates for later

### 1. `src/App.tsx`

Status: working but broad.

Future split candidates:

```text
src/components/AppHeader.tsx
src/components/FilterBar.tsx
src/pages/UploadPage.tsx
src/pages/DashboardPage.tsx
src/pages/PeoplePage.tsx
src/pages/StoresPage.tsx
src/pages/SkusPage.tsx
src/pages/TodPage.tsx
src/pages/BillPage.tsx
src/pages/IssuesPage.tsx
```

Rule: do not split all pages at once. Move one page/component per PR and run smoke + real-file QA before merging.

### 2. `src/lib/parser.ts`

Status: critical and should not be touched casually.

Future split candidates:

```text
src/lib/parser/aliases.ts
src/lib/parser/pivot-cache.ts
src/lib/parser/worksheet.ts
src/lib/parser/normalize-row.ts
src/lib/parser/date.ts
```

Rule: parser split must preserve exact parsed row output for real DOIT files.

### 3. `src/lib/analytics.ts`

Status: acceptable but mixes filtering, aggregation, bill line building, and CSV export.

Future split candidates:

```text
src/lib/filters.ts
src/lib/aggregates.ts
src/lib/bill-lines.ts
src/lib/csv.ts
```

Rule: bill line behavior must be checked with Pro print guardrails.

## Do not edit as Active Pro source

```text
dist/assets/pro-core-v4.js
dist/assets/pro-native-core.js
dist/assets/pro-native-core-overrides.js
dist/assets/pro-print-store-bills.js
dist/assets/pro-print-mode-fixes.js
dist/assets/pro-print-column-widths.js
dist/assets/pro-print-a4-pro-fix.js
```

Reason: เป็นไฟล์ Legacy ที่หน้า preview/test เก่ายังอ้างอยู่ ไม่ใช่ source
ของ `/pro.html` ดู reference และแผนลบใน `docs/PRO_LEGACY_MANIFEST.md`

## Suggested order after this audit

```text
1. Wire AppHeader into App.tsx after a build-capable check
2. Extract FilterBar from App.tsx
3. Extract UploadPage from App.tsx
4. Extract Dashboard-related view components
5. Extract analytics bill-line logic only after real-file QA is stable
6. Split parser last
```

## Required verification before any source refactor merge

```text
npm run smoke
npm run verify
node scripts/qa-doit-file.mjs "path/to/DOIT.xlsx"
```

For UI changes, verify `/pro.html` still returns 200 OK after deploy.
