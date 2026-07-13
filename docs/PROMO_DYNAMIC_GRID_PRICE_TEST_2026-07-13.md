# Promo dynamic grid, Product Master, price consensus and publish safety — 2026-07-13

## Scope

Branch/Preview only. No Production merge. The SEP25 file was tested as a local dry-run without Supabase writes, Storage upload, publish, or cleanup.

## Confirmed source-file facts

- The test file has a `.PNG` filename but contains a PDF 1.7 document.
- Pages: 18.
- Actual cards: 258.
- Layouts observed: 4, 5 and 6 columns.
- The original JUL26-specific implementation expected 212 cards and could not process all SEP25 pages.

## Implemented changes

### Dynamic grid

- Validate the `%PDF-` magic header instead of trusting the extension.
- Count pages, rows and cards from the actual file.
- Detect 3–8 columns.
- Map every white-card anchor to exactly one blue-grid cell.
- Stop when a cell has zero or multiple anchors.

### Promotion OCR

- Require two OCR variants to produce the same complete Tier structure.
- Reject missing Tiers, duplicate Tiers, wrong order, unit disagreement and suspicious percentages.
- Structured red badges must agree with general OCR; the badge alone cannot approve a multi-step promotion.

### Product title and Product Master

- Read the title from the full-card OCR and from a dedicated title crop.
- Match both pieces of evidence against the reviewed Product Master snapshot.
- Require a minimum match score and a non-ambiguous margin.
- Use the canonical Product Master name in the database instead of raw OCR text.
- A genuinely new product can receive a deterministic UUID only when both title OCR sources strongly agree, numeric size evidence agrees, and the price evidence is valid.
- The backend independently verifies the deterministic ID and rejects weak novel-product evidence.
- Product Master creation is blocked before any write when the requested month is already published.

### Average/base-unit price

- Read the price panel using two image transformations.
- Require the normal price, average price and inferred pack quantity to agree.
- Compare repeated cards linked to the same Product Master.
- Rescue a missing price only when at least two matching cards support one price cluster.
- A tie, conflicting unit, or outlier price changes the affected cards to `need_review`.

### Upload and publish

- Published months are locked against ordinary batch re-upload.
- Each upload requires an active Product Master or strongly verified deterministic new master.
- The backend creates/links monthly product groups and one group price.
- Finalize requires the expected dynamic Card IDs plus image, title, price, unit, Function, Tier, Product Master link and valid group price for every card.
- The Live page selects only a `published` month and never falls back to a draft.
- Cleanup now includes old group prices, card-group links and monthly product groups as well as cards, functions, detections, tiers and Storage files.

## Confirmed test evidence

- SEP25 dynamic grid: 18/18 pages.
- Rows: 54/54.
- Cards: 258/258.
- Every output cell contains exactly one card anchor.
- Dedicated local price OCR sample: 12/12 produced a usable normal price and average price with the arithmetic guard passing.
- Previous confirmed false-auto patterns are rejected by regression tests.
- Product Master matching regression distinguishes similar products and sizes.
- GitHub Web CI passes:
  - foundation smoke;
  - dynamic grid and OCR safety;
  - Product Master, grouped price and publish safety;
  - latest-only backend safety.
- Preview Edge Function `promo-image-upload-v2-preview` version 5 is ACTIVE.
- JUL26 remains the only published month and retains 212 cards, 212 function matches, 212 detections and 212 cards with Tiers.

## Corrected evidence

The first color-only price-panel detector found 39/258 cards, not 258/258. A fixed-position fallback and dual price OCR were added. This correction must remain visible in the record.

## Remaining proof before Production

- Run browser Tesseract.js across all 258 SEP25 cards on the deployed Preview.
- Audit the browser result card by card for title, Product Master, unit, price and promotion.
- Measure Android runtime, memory use, browser freeze/reload and Worker failure.
- Test upload → finalize → old-month cleanup in an isolated Supabase branch/project. Creating a Supabase branch may incur cost and requires separate approval.

Until those checks pass, PR #63 must remain Draft and must not be merged to Production.
