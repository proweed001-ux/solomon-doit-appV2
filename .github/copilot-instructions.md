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
- Do not add test files, spec files, mock data, fixtures, or unit tests.
- Do not add Vitest, Jest, Playwright, Cypress, or other test frameworks.
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
npm run build
```

```bash
npm run dev
```

```bash
npm run check:doit
```

Check that upload, totals, filters, bill extraction, export CSV, and mobile layout still work.

## Response style
- Reply in Thai unless the user asks otherwise.
- Explain in simple terms.
- Always say which file is being changed.
- Provide copy-ready code blocks for commands and code.
- Prefer complete replacement code when the user asks for a full file.
- Do not answer with theory when a practical fix is possible.
