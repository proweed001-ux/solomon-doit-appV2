# Cleanup plan for Solomon DOIT App V2

This repo should keep one main app path only:

```text
index.html -> src/main.tsx -> src/App.tsx
```

The current React/Vite app entry is clean and should remain the source of truth.

## Keep

- index.html
- package.json
- vite.config.ts
- tsconfig.json if present
- src/main.tsx
- src/App.tsx
- src/styles.css
- src/types.ts
- src/lib/parser.ts
- src/lib/pricing.ts
- src/lib/analytics.ts
- scripts/check-doit.mjs
- .github/copilot-instructions.md

## Generated or legacy files to remove from tracked source after review

The `dist/` folder is build output / legacy static output and should not be maintained as source code.

Known legacy files found:

- dist/pro.html
- dist/assets/doit-pro-v257.js
- dist/assets/layout-lock-v258.js
- dist/assets/telesale-drawer-v262.js
- dist/assets/upload-progress-v260.js
- dist/assets/date-check-v262.js
- dist/assets/pro-cloud-loader-v265.js
- dist/assets/print-export-fix-v267.js
- dist/assets/remaining-summary-v276.js
- dist/assets/mobile-table-ui-v280.js
- dist/assets/close-owner-v306.js
- dist/assets/critical-fixes-v282.js
- dist/assets/ps-label-fix-v285.js
- dist/assets/field-logic-fixes-v295.js
- dist/assets/date-scope-fix-v300.js
- dist/assets/filter-coordinator-v304.js
- dist/assets/app-coordinator-v290.js
- dist/assets/remaining-coordinator-v291.js
- dist/assets/ps-scope-fix-v292.js
- dist/assets/print-store-name-edit-v296.js
- dist/assets/version-lock-v299.js

## Why remove them

These files create confusion because they represent an older static Pro page with many versioned patch scripts. They are not part of the current React/Vite app entry path.

## Safety rule

Do not remove sales parser, pricing, analytics, or React UI files during cleanup.

Cleanup should not change formulas, field mapping, totals, filters, bill extraction, or CSV export logic.

## Check after cleanup

```bash
npm run build
```

```bash
npm run dev
```

Then upload a real DOIT file and check:

- app opens
- upload works
- total amount is correct
- qty is correct
- filters work
- bill extraction works
- export CSV works
