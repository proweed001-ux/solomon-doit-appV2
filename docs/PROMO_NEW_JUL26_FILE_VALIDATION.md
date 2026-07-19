# Promo New — JUL26 validation status

Updated: 2026-07-19 (Asia/Bangkok)

## Important

This file is **not** proof that the current promotion pipeline has passed the JUL26 real files.
The previous report used an obsolete local script that performed per-card crop OCR and grouped
without the authenticated Product Master, stored prices, or Promotion Family preflight used by
the current browser Preview.

The old figures such as 200 cards, 30 tests, and results from
`scripts/inspect-promo-real-files.ts` must not be used for approval.
That script now exits with an error to prevent accidental use.

## Current JUL26 reference

The current reference PDF discussed for the rebuild has:

- 18 pages
- 212 detected cards in the prior browser run
- SHA-256: `38b5785d521f63f97fd8586c228127671d872f42bf539a909a1999923add5837`

These figures identify the file and expected card conservation only. They do not certify grouping,
Product Master matching, Promotion Family selection, price correctness, unresolved count, or runtime.

## Required validation method

Use the authenticated read-only page:

`/promo-admin-new.html?dryrun=1`

The valid sequence is:

1. Validate the upload key and load the real Product Master and stored prices.
2. Parse and validate CSV/XLS/XLSX/XLSM Promotion Families before opening the PDF.
3. Render the PDF, detect card grids, OCR each page once when no text layer exists, and resolve Class.
4. Run Product Master and Promotion Scope grouping first.
5. Run extra header OCR only for unresolved cards that are expected to benefit.
6. Verify card conservation, Product Groups, six closed Classes, prices, tiers, and blockers.
7. Run the read-only readiness validation. Draft and Publish remain disabled.

## Acceptance evidence to record

A real-file run is not approved until the browser result records all of the following:

- PDF/XLSM filenames and hashes
- detected card total and duplicate/missing card total
- card count for each of the six Classes
- Product Master direct matches, Scope matches, and unresolved count
- Product Group count and duplicate SKU/group count
- inherited prices, missing prices, and price conflicts
- automatically assigned, ambiguous, and unmatched Promotion Families
- fallback OCR attempted/improved counts
- total runtime and any Worker/cache error
- final readiness errors after manual corrections

## Data safety

The rebuild Preview is read-only. Legacy Draft and Publish calls are blocked until an atomic revision
staging design is implemented and separately approved. This validation must not write Production
Database or Storage and must not invoke `finalize_latest`.
