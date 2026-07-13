# Promo dynamic grid + price OCR safety — 2026-07-13

## Scope

Branch/Preview only. No Production merge. The SEP25 file was tested as a local dry-run, without Supabase writes, Storage upload, publish, or cleanup.

## Changes

- Detect `%PDF-` from file content instead of trusting the extension.
- Count cards from the actual PDF instead of requiring 212.
- Detect 3–8 grid columns and map each white card anchor to exactly one cell.
- Detect Class from the page header, with the existing page map only as fallback.
- Read product title and the yellow average/base-unit price.
- Read the normal pack price separately and use it as a broad arithmetic cross-check.
- Require two independent promo OCR passes to agree exactly before `auto_ok`.
- Block suspicious percentages, duplicate tiers, missing tiers, wrong order, and inconsistent price/title metadata.
- Require image, title, base price, unit, function, and tiers before final publish.

## SEP25 dry-run evidence

- PDF pages: 18
- Dynamic grid: 18/18 pages
- Rows: 54/54
- Cards: 258/258
- Layouts observed: 4, 5, and 6 columns
- Every output cell contained exactly one card anchor.
- Price-panel color box found: 258/258 cards.
- Dedicated price-digit OCR sample: 12/12 cards produced a usable normal price and average price with the arithmetic guard passing.
- Regression for the previous false-auto patterns passed; missing tiers, duplicate tiers, wrong percentages, and suspicious 87% are rejected.

## Remaining proof

A full 258-card Tesseract.js run must still be executed in the deployed browser Preview. Local OCR is not proof that mobile/browser Tesseract.js will produce identical results. The publish button remains blocked while any card is `need_review`.
