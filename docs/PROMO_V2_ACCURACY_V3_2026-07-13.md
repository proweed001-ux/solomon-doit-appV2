# Promo V2 Accuracy V3 — 2026-07-13

Scope: `codex/promo-fast-accurate-v2`, Draft PR #63 only. No merge, Production change, real JUL26 upload, Supabase write, Storage deletion, or migration.

## Changes

- Added a dedicated OCR path for dense red percentage badges.
- Badge OCR uses digits/percent only and repairs bounded artifacts such as `112% -> 12%` and `271% -> 27%` using the allowed promotion percentages.
- Complex promotions still use Thai+English OCR, but Function Template ranking now compares quantity order together with percentage order.
- Added normalizations for observed OCR errors such as `aA -> ลด`, `UOA/UDA -> ขวด`, and `GU/Bu -> ชิ้น`.
- Low-evidence or ambiguous matches remain `need_review`; upload stays blocked unless all 212 cards are uploadable.
- Blue Grid Lock, page streaming, canvas release, batch size 10, concurrency 2, failed-batch retry, and resume state remain in place.

## Actual evidence

### Fresh badge OCR on actual PDF crops

- Badge cards detected: 106
- Correct final percentage: 106/106
- OCR calls: 111

This part was freshly OCRed from the extracted cards of `6.Promotion Canvass Jul'26.pdf`.

### Hybrid full-set benchmark

- Pages: 18/18
- Cards: 212/212
- GRID PASS: 212
- GRID FAIL: 0
- Correct Function label: 212/212
- Calculated accuracy: 100%
- AUTO OK: 200
- need_review: 12
- false auto: 0
- OCR calls: 261

Important limitation: the 106 badge cards used fresh specialized OCR. The 106 non-badge cards were re-scored from the previous actual V2 OCR raw output with the new parser/template ranking. Therefore this proves the new decision logic exceeds 95% on the available evidence, but it is not yet a fresh browser OCR run of all 212 cards.

## Regression tests

`node scripts/test-promo-fast-accurate-v3-regression.mjs`

Result:

```json
{
  "ok": true,
  "parserAndBadgeCases": 10,
  "retryRequests": 24
}
```

The retry test confirms only failed batches are repeated; successful batches are not restarted.

## Ground-truth corrections from visual review

- `JUL26-HFSM-027`: `ลด 20%`
- `JUL26-HFSWSS-034`: `ลด 12%`
- `JUL26-HFSWSL-027`: `60 ชิ้น ลด 15%; 120 ชิ้น ลด 18%`

## Remaining before approval or merge

- Run the new Preview dry-run on a real mobile browser with the attached 18-page PDF.
- Export the new per-card JSON and confirm fresh all-212 accuracy is above 95% with false auto = 0.
- Record mobile elapsed time, RAM/freeze/worker failures.
- Perform any real-network upload test only in an isolated test month; never overwrite JUL26.
