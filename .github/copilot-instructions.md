# Solomon DOIT App V2.1 coding instructions

This project is a real sales-reporting web app for DOIT files. Prioritize correctness, simple changes, and mobile usability.

## Stack
- React
- TypeScript
- Vite
- XLSX
- JSZip
- lucide-react

## Project purpose
The app reads DOIT / Excel / CSV files, parses pivotCache first when available, falls back to worksheets, summarizes sales, supports dashboard, drill-down, bill extraction, issue checking, and CSV export.

## Do not add extra complexity unless explicitly requested
- Do not add new test frameworks unless explicitly requested. The existing Pro Playwright and module tests are required guardrails and must remain active.
- New Pro regressions should extend the existing fixture/tests instead of creating a second test stack.
- Do not add new dependencies unless required and clearly explained.
- Do not refactor the whole project when a small targeted fix is enough.
- Do not create new package.json scripts unless necessary.
- Do not change sales formulas without explaining the effect on totals.
- Do not guess unsupported fields.

## File responsibilities
- src/lib/parser.ts: file parsing, field mapping, row normalization.
- src/lib/pricing.ts: quantity, amount, unit price, numeric safety.
- src/lib/analytics.ts: filters, aggregation, export, bill lines.
- src/types.ts: shared TypeScript types.
- src/App.tsx: UI and user interactions.

Keep heavy parsing, pricing, and aggregation logic out of App.tsx when possible.

## Active Pro architecture

The production Pro page does not use the React source above. Its only active path is:

```text
dist/pro.html
  -> dist/assets/pro/app.js
      -> dist/assets/pro/core.js
      -> owner modules under dist/assets/pro/
```

Owner modules:

- `state.js`: the only mutable Pro state, Undo/Redo and LocalStorage owner
- `parser-adapter.js`: XLSX/XLSM parsing and row normalization
- `filters.js`: filters and product grouping
- `send-store.js`: “ส่งร้านนี้” and Enter/Next
- `order.js`, `telesale.js`, `done.js`: their named views
- `print.js` and `print-model.js`: the only active print implementation
- `developer-qr.js`, `team.js`, `fuel-secret.js`: their named UI behavior
- `pro.css`: active page and print styles

Files outside `dist/assets/pro/` with old Pro core/override/print names are
LEGACY. They are not active production source. Do not edit them to fix the
current Pro page; see `docs/PRO_LEGACY_MANIFEST.md`.

Never add fix, patch, override, hotfix, bridge, a dynamic script loader,
MutationObserver repair, or setInterval core wait. Fix the owner module.

## Data rules
- Main quantity field: ShipQtyPCS.
- Amount should follow parser-supported sources such as TotInvc, InvoiceAmt, LineAmtBeforeDisc, Correct Amount, Amount, and Amt.
- Prevent NaN in quantity and amount calculations.
- Be careful with duplicated invoice header values versus line-level values.
- If a change can affect total sales, state the risk clearly.

## Preferred validation
Use practical checks with real DOIT files instead of adding automated tests by default.

Useful commands:

```bash
npm run verify
```

```bash
npm run dev
```

```bash
npm run check:doit
```

Check that upload, totals, filters, bill extraction, export CSV, and mobile layout still work.
For Pro work, do not run a build that writes over `dist`; CI verifies the existing
active files directly.

## Response style
- Reply in Thai unless the user asks otherwise.
- Explain in simple terms.
- Always say which file is being changed.
- Provide copy-ready code blocks for commands and code.
- Prefer complete replacement code when the user asks for a full file.
- Do not answer with theory when a practical fix is possible.
