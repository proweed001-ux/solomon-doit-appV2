# Promo latest-only publishing

## Required behavior

The promo module keeps one published month after a successful monthly replacement.

1. Read and crop the complete monthly PDF in the browser.
2. OCR every promotion card and normalize each function into structured tiers.
3. Upload the new month as draft data and month-prefixed Storage files.
4. Do not replace the current published month while any card is missing, rejected, or `need_review`.
5. Validate the expected 212 card IDs, images, detections, function matches, and tier rows.
6. Publish the validated new month.
7. Delete all previous month database rows and Storage files.
8. The live promo page selects the latest published month automatically.

## Safety rules

- A failed batch or failed final validation must not delete the currently published month.
- A new promotion structure may be accepted only when OCR yields a complete parseable structure with sufficient confidence; otherwise it remains `need_review`.
- Re-uploading the same month may reuse existing card images; a new month uploads a staged image set and removes the old set only after final validation.
- Current layout validation remains strict: 18 pages, 212 cards, and the configured class counts.
- This workflow does not automatically infer product names or monthly prices.

## Preview scope

The implementation is isolated to `codex/promo-fast-accurate-v2`, the `promo-image-upload-v2-preview` Edge Function, and Draft PR #63. It is not merged into `main` or promoted to Production.
