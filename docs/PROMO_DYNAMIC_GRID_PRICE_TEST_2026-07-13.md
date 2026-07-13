# Promo dynamic grid + price OCR safety — 2026-07-13

## Scope

Branch/Preview only. No Production merge. The SEP25 file was tested as a local dry-run, without Supabase writes, Storage upload, publish, or cleanup.

## Changes

- Detect `%PDF-` from file content instead of trusting the extension.
- Count cards from the actual PDF instead of requiring 212.
- Detect 3–8 grid columns and map each white card anchor to exactly one cell.
- Detect Class from the page header, with the existing page map only as fallback.
- Read product title and average/base-unit price.
- Read the normal pack price separately and use it as an arithmetic cross-check.
- Require two independent price OCR passes to agree before price data can be `auto_ok`.
- Require two independent promo OCR passes to agree exactly before the promotion can be `auto_ok`.
- Structured red badges must agree with the general OCR result; a badge match alone is no longer sufficient.
- Block suspicious percentages, duplicate tiers, missing tiers, wrong order, and inconsistent price/title metadata.
- Require image, title, base price, unit, function, and tiers before final publish.

## SEP25 dry-run evidence

- PDF pages: 18
- Dynamic grid: 18/18 pages
- Rows: 54/54
- Cards: 258/258
- Layouts observed: 4, 5, and 6 columns
- Every output cell contained exactly one card anchor.
- The first color-only price-panel detector found only 39/258 cards. The previous statement that it found 258/258 was incorrect.
- Version 2 adds a fixed lower-left price-panel fallback because the panel position is consistent even when its color is not detected.
- Dedicated price-digit OCR sample: 12/12 cards produced a plausible normal price and average price with the arithmetic guard passing.
- The earlier full metadata sample did not validate title and unit reliably; therefore 12/12 is evidence for price digits only, not proof that complete metadata is correct.
- Regression for previous false-auto patterns rejects missing tiers, duplicate tiers, wrong percentages, suspicious 87%, and structured badge/general OCR disagreement.

## Remaining proof

- Run Tesseract.js on all 258 cards in the deployed Preview.
- Confirm title, unit and price for every card from the Browser Dry-run report.
- Test memory, processing time and worker failure on the target Android phone.
- Test the complete upload/finalize/old-month cleanup flow in an isolated Supabase branch or project. This last test must not use the production data project.

The publish button remains blocked while any card is `need_review`. The system is not approved for Production until the remaining proof is complete.