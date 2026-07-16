# Promo New — Jul 2026 real-file validation

Validation date: 2026-07-16 (Asia/Bangkok)

This report covers local/read-only validation only. No Production database,
Storage, policy, Edge Function, or Production deployment was changed.

## Inputs

- CSV SHA-256: `8bbbc4828be03ccf7933f79fdaf1796f8054b1deae516f2c97953fb889401028`
- Original PDF SHA-256: `0f845a600926ba6308a8ccf827fb76631d6318f3ab4d070e76a7ead61c2b1087`
- Repaired validation copy SHA-256: `f0cafdaf66b750ce4e548d13b3f926ff61dfd7283aad0f945ba6dbebdb2d894d`

The original PDF has a broken xref/trailer and cannot be opened by PDF.js.
Ghostscript rebuilt a separate local copy. The uploaded original was not
modified. The repaired copy is PDF 1.7, 18 pages, 960 × 540 pt, unencrypted.

## CSV result

- Data rows accepted: 178/178
- Promotion Families: 42
- Promotion tiers: 255
- Parser warnings: 0
- Families by canonical Class: HFSS 24, HFSM 27, HFSL 32, HFSXL 34,
  HFSWS-S 31, HFSWS-L 30

The real file uses a single `Description` column. The parser extracts product
scope, embedded Class evidence, and tier mechanics, then joins same-scope rows
as one Promotion Family while keeping tiers separated by Class.

## PDF grid result

- Pages with cards: 17
- Empty/artifact page: 18
- Total card regions: 200
- Card counts by PDF page:
  `12, 12, 6, 12, 12, 8, 12, 12, 13, 14, 13, 13, 13, 12, 12, 12, 12, 0`
- Card-grid status: pages 1–17 pass; page 18 reports `card_grid_not_found`
  and produces no Card

Rows with four and five columns are both present in the source and are valid.
The grid detector no longer assumes that all rows on one page have the same
column count.

Representative header preprocessing recognized HFS-S, HFS-M, HFS-L, HFS-XL,
and HFS-WS-S from the real pages. An incomplete OCR token such as `HFS-` is
not accepted or guessed.

## Automated checks

- Promo domain/import/security tests: 23 passed
- TypeScript: passed
- Production build: passed
- Security/static checks: passed
- Existing smoke and regression suites: passed

## Still pending

- Complete Thai OCR, SKU Candidate, and Product Group output for all 200 cards
  must be reviewed in the authenticated Admin Preview before any Draft save.
- Draft save, Publish, rollback, database migration, RLS/policy, and Storage
  integration remain unexecuted against Production.
