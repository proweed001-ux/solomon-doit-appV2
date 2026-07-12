# Promo V2 Local Benchmark — 2026-07-12

Scope: branch `codex/promo-fast-accurate-v2`, Draft PR #63 only. No Production route, `main`, JUL26 database rows, Storage objects, migrations, or real uploads were changed.

## Benchmark input

- PDF: `6.Promotion Canvass Jul'26.pdf`
- Pages: 18
- Expected cards: 212
- Expected classes:
  - HFSS 30
  - HFSM 32
  - HFSL 37
  - HFSXL 40
  - HFSWSS 37
  - HFSWSL 36
- Ground truth: visual inspection fixture in `scripts/fixtures/jul26-promo-ground-truth-compact.json`

## Actual local results

| Metric | Current V2 baseline | Improved V2 |
|---|---:|---:|
| Pages | 18/18 | 18/18 |
| Cards | 212/212 | 212/212 |
| GRID FAIL | 0 | 0 |
| AUTO OK | 65 | 70 |
| need_review | 147 | 142 |
| Exact function-label correct | 60 | 161 |
| Exact OCR/template accuracy | 28.30% | 75.94% |
| false auto | 20 | 0 |
| OCR calls | 341 | 347 |
| Local wall time | 94.835 s | 107.385 s |

The improved policy is deliberately conservative. It only marks a card `auto_ok` when a Function Template match is exact and confidence/agreement guards pass. Ambiguous results remain `need_review`.

Of the 142 cards marked `need_review`, 91 already matched the visual ground truth but were held for safety, and 51 were incorrect. No incorrect result was marked `auto_ok`.

## Read-only comparison with stored V1 results

A read-only query of the existing JUL26 `promo_card_function_matches` rows found:

- Total: 212
- Stored V1 `auto_ok`: 39
- Stored V1 `need_review`: 173
- Percentage-signature correct: 45/212 = 21.23%
- V1 `auto_ok` rows with a percentage-signature mismatch: 11

The V1 percentage-signature check is more lenient than the improved V2 exact Function Template metric. Improved V2 reached 75.94% exact template accuracy with zero false auto in the local benchmark, so the measured accuracy is not below V1 on this JUL26 dataset. The two metrics are not identical and must still be repeated on the same mobile device before Merge.

## Controlled V1 versus improved V2 workload

A controlled local V1-style workload performed two OCR calls for every card: 424 calls total. It took 138.305 seconds on the same machine and dataset. Improved V2 took 107.385 seconds, a 22.4% reduction.

This is a controlled local OCR comparison, not Production network timing.

| Workload | V1 | Improved V2 |
|---|---:|---:|
| OCR calls | 424 | 347 actual |
| HTTP requests | 212 | 22 nominal before retry |
| Stored images | 636 | 212 |

## Retry and resume test

A deterministic no-network mock used:

- Batch size: 10
- Concurrency: 2
- Initial batches: 22
- Batches configured to fail once: 3 and 11
- Total requests after retry: 24
- Only batches 3 and 11 were retried
- Other 20 successful batches were not repeated
- Remaining failed batches: 0
- Resume state is persisted and completed Card IDs are skipped

No upload endpoint or Storage bucket was called during this test.

## Changes in Preview V2

- Retains Blue Grid Lock and the strict 212-card/class-count guard.
- Processes one PDF page at a time and releases page/card/OCR canvases after use.
- First OCR pass: PSM 11, 4x image.
- Second OCR pass only when confidence is low or Function Template parsing is not exact.
- Fallback uses PSM 6 or PSM 13 according to first-pass evidence.
- Compares structured tiers with known Function Templates.
- Conservative `auto_ok` guard to prevent false auto.
- Keeps only the full card image.
- Batch size fixed to 10, concurrency fixed to 2.
- Retries only failed batches with backoff.
- Saves completed Card IDs in local resume state.
- Adds a Dry-run JSON export containing timing and per-card OCR evidence.
- Upload remains blocked unless all 212 cards are uploadable.

## Regression tests

Run:

```bash
node scripts/test-promo-fast-accurate-v2-regression.mjs
```

Current cases cover OCR unit corruption, spaced Thai text, free-item deals, ranges, malformed percent signs, and retry/resume. A range parsing defect was first reproduced by the regression case, then fixed.

## Reproduce the local benchmark

```bash
python scripts/expand-promo-ground-truth.py \
  scripts/fixtures/jul26-promo-ground-truth-compact.json \
  /tmp/jul26-ground-truth.json

python scripts/promo-local-benchmark-v2.py \
  "6.Promotion Canvass Jul'26.pdf" \
  /tmp/jul26-ground-truth.json \
  --out /tmp/promo-v2-results \
  --workers 2
```

The runner is dry-run only. It does not contain an upload key and does not write Supabase.

## Mobile Preview dry-run procedure

1. Open the PR #63 Preview and `/promo-pdf-upload-v2.html`.
2. Select the 18-page PDF.
3. Do not enter an upload key.
4. Tap only `ตรวจกรอบ + อ่านโปร`.
5. Wait for all 212 cards.
6. Download `Dry-run JSON`.
7. Record device, browser, total time, Worker failure, page freeze, heat, and memory warning.
8. Do not press Upload.

## Remaining acceptance evidence

Passed locally:

- 18/18 pages
- 212/212 cards
- Exact class counts
- GRID FAIL = 0
- false auto = 0
- Improved OCR/template accuracy above the current V2 baseline and the stored V1 percentage-signature lower bound
- Controlled OCR workload faster than V1-style 424 calls
- Failed batches retry without restarting successful batches

Still required before Merge:

- Actual mobile Preview dry-run timing and stability
- Full manual review of 142 `need_review` cards or further safe OCR tuning
- Safe isolated real-network upload test, not JUL26 Production data
- Final V1/V2 comparison under identical mobile conditions
