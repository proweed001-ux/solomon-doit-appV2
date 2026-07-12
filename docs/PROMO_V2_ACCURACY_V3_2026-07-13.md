# Promo V2 Accuracy V3 — 2026-07-13

Scope: `codex/promo-fast-accurate-v2`, Draft PR #63 only. No merge, Production change, real JUL26 upload, Supabase write, Storage deletion, or migration.

## Changes

- Added a dedicated digits-only OCR path for dense red percentage badges.
- Repairs bounded badge artifacts such as `112% -> 12%` and `271% -> 27%` using only allowed promotion percentages.
- Complex promotions use Thai+English OCR and compare quantity order together with percentage order against Function Templates.
- Added normalizations for observed errors: `aA -> ลด`, `UOA/UDA/UIA/von -> ขวด`, `GU/Bu -> ชิ้น`, and `av/a0 -> ลัง`.
- A missing final `%` is restored only when the number is an allowed promotion percentage.
- AUTO OK now also requires the OCR percentage sequence to be complete; a shorter partial template cannot pass automatically.
- Blue Grid Lock, page streaming, canvas release, batch 10, concurrency 2, failed-batch retry, and resume state remain in place.

## Fresh local benchmark on the actual PDF

Input: `6.Promotion Canvass Jul'26.pdf`, 18 pages, 212 cards.

| Metric | Result |
|---|---:|
| Pages | 18/18 |
| Cards | 212/212 |
| GRID PASS | 212 |
| GRID FAIL | 0 |
| Correct Function label | 211/212 |
| Accuracy | **99.53%** |
| AUTO OK | 205 |
| need_review | 7 |
| false auto | **0** |
| OCR calls | 252 |

Breakdown:

- Specialized badge OCR: 106/106 correct, 111 OCR calls.
- General Thai+English OCR: 105/106 correct, 141 OCR calls.

All 212 cards were freshly OCRed from extracted crops of the actual PDF. General OCR was executed in chunks to fit the local execution time limit. After the raw OCR was produced, parser-only normalizations were applied and rescored; the images or OCR raw text were not replaced with ground truth.

The one remaining incorrect result is `JUL26-HFSWSS-009`. The expected promotion is `12 ขวด ลด 12%; 1 ลัง ลด 17%`, but OCR captured only the second tier. It is marked `need_review`, not AUTO OK.

## Regression tests

`node scripts/test-promo-fast-accurate-v3-regression.mjs`

```json
{
  "ok": true,
  "parserAndBadgeCases": 14,
  "retryRequests": 24
}
```

The tests cover badge-number corruption, OCR unit corruption, missing percent signs, quantity/template disambiguation, partial-template AUTO OK blocking, and retry/resume. Only failed batches are repeated.

## Ground-truth corrections from visual review

- `JUL26-HFSM-027`: `ลด 20%`
- `JUL26-HFSWSS-034`: `ลด 12%`
- `JUL26-HFSWSL-027`: `60 ชิ้น ลด 15%; 120 ชิ้น ลด 18%`

## Remaining before approval or merge

- Run the updated Preview with the same PDF on a real mobile browser. Browser Tesseract.js can differ from native local Tesseract.
- Export the per-card Dry-run JSON and confirm fresh Preview accuracy remains above 95% with false auto = 0.
- Record elapsed time, RAM/freeze/Worker failures.
- Test real network upload only in an isolated test month; never overwrite JUL26.
