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
HFS-WS-S, and HFS-WS-L from the real pages. All 200 cards received the Class
printed on their own page. An incomplete OCR token such as `HFS-` is not
accepted or guessed.

## Thai OCR, SKU Candidate, and Product Group result

The diagnostic uses the same grid detector, Class normalizer, SKU identity,
and Product Group modules as the Admin page. For cards without a PDF text
layer it compares a color product-title crop with a thresholded crop and keeps
the evidence with fewer validation failures. This is local OCR only; no paid
or remote AI service is used.

- Cards processed: 200
- Unique Card IDs: 200
- Cards with enough evidence to enter a candidate Product Group: 78
- Cards quarantined: 122
- Candidate Product Groups: 36
- Candidate groups are still `need_review`; none were saved or published
- Brands detected across all cards: H&S 20, Rejoice 12, Pantene 43, Olay 20,
  Oral-B 12, Gillette 26, Downy 25, Safeguard 8, Vicks 14, Ambi Pur 5;
  unresolved brand evidence 15
- Grouped cards by brand: H&S 9, Rejoice 9, Pantene 23, Olay 8, Downy 6,
  Safeguard 4, Vicks 14, Ambi Pur 5
- Oral-B and Gillette cards stay quarantined because the printed title crop
  does not contain reliable size/unit evidence. The importer does not invent
  `1 piece` or borrow evidence from another card.

Quarantine reason counts overlap because one Card can fail more than one
rule: size missing 96, unit missing 85, product type missing 51, brand missing
15, ambiguous size range 7, multiple product types 6, multi-component size 4,
and implausible OCR size 3.

The most important proof case passes: `SKU-0AUOME8`, Pantene shampoo 70 ml,
contains exactly six Cards in HFSS, HFSM, HFSL, HFSXL, HFSWS-S, and HFSWS-L.
Pantene shampoo 120 ml and Pantene conditioner 120 ml also form six-Class
groups without selecting Cards one by one.

The following codes are deterministic candidate codes, not Production SKU
records. Variant text is retained where OCR evidence is not yet safe to merge,
so several one-Card groups intentionally remain for Admin review.

| SKU Code | Brand | Type | Variant evidence | Size | Cards | Classes |
|---|---|---|---|---:|---:|---|
| SKU-1A2DKGL | AMBI PUR | Air care | OCR variant A | 75 g | 1 | HFSS |
| SKU-0HA37J2 | AMBI PUR | Air care | OCR variant B | 75 g | 1 | HFSM |
| SKU-05FA1AU | AMBI PUR | Air care | OCR variant C | 75 g | 1 | HFSL |
| SKU-1H11H0P | AMBI PUR | Air care | OCR variant D | 75 g | 1 | HFSXL |
| SKU-0VL2O3A | AMBI PUR | Air care | OCR variant E | 75 g | 1 | HFSWS-S |
| SKU-06JBMUI | DOWNY | Fabric softener | Purple/yellow OCR variant | 100 ml | 1 | HFSWS-S |
| SKU-1PF5HGG | DOWNY | Fabric softener | Sunrise OCR variant | 480 ml | 1 | HFSM |
| SKU-13VTHWM | DOWNY | Fabric softener | Mixed formula OCR evidence | 480 ml | 1 | HFSM |
| SKU-1033AGP | DOWNY | Fabric softener | Mystique/Passion OCR evidence | 480 ml | 1 | HFSL |
| SKU-04UFW7O | DOWNY | Fabric softener | — | 480 ml | 2 | HFSXL, HFSWS-S |
| SKU-0M0M9I2 | H&S | Shampoo | — | 65 ml | 4 | HFSM, HFSL, HFSXL, HFSWS-S |
| SKU-1VR320C | H&S | Shampoo | OCR variant needs review | 65 ml | 1 | HFSWS-L |
| SKU-1JU75HQ | H&S | Shampoo | — | 140 ml | 4 | HFSS, HFSM, HFSL, HFSXL |
| SKU-0DA0OVG | OLAY | Skincare | Total Effects OCR A | 7 g | 1 | HFSS |
| SKU-166UPHP | OLAY | Skincare | Total Effects OCR B | 7 g | 1 | HFSM |
| SKU-0LP6YV5 | OLAY | Skincare | Total Effects OCR C | 7 g | 1 | HFSL |
| SKU-143WGW2 | OLAY | Skincare | Total Effects OCR D | 7 g | 1 | HFSXL |
| SKU-0QWZP5O | OLAY | Skincare | Total Effects OCR E | 7 g | 1 | HFSWS-S |
| SKU-0DTHSH5 | OLAY | Skincare | Total Effects OCR F | 7 g | 1 | HFSWS-L |
| SKU-0TV1FQD | OLAY | Skincare | White Radiance OCR A | 30 ml | 1 | HFSL |
| SKU-0S3XA40 | OLAY | Skincare | White Radiance OCR B | 30 ml | 1 | HFSXL |
| SKU-000UO85 | PANTENE | Conditioner | — | 60 ml | 2 | HFSL, HFSWS-L |
| SKU-0WAGA5O | PANTENE | Conditioner | OCR variant needs review | 60 ml | 1 | HFSXL |
| SKU-042N1OM | PANTENE | Conditioner | — | 120 ml | 6 | HFSS, HFSM, HFSL, HFSXL, HFSWS-S, HFSWS-L |
| SKU-0AUOME8 | PANTENE | Shampoo | — | 70 ml | 6 | HFSS, HFSM, HFSL, HFSXL, HFSWS-S, HFSWS-L |
| SKU-1RMQOTO | PANTENE | Shampoo | — | 120 ml | 6 | HFSS, HFSM, HFSL, HFSXL, HFSWS-S, HFSWS-L |
| SKU-1YDUAMP | PANTENE | Shampoo | — | 370 ml | 1 | HFSXL |
| SKU-0W4CFQ0 | PANTENE | Shampoo | OCR variant needs review | 370 ml | 1 | HFSWS-S |
| SKU-12B810H | REJOICE | Conditioner | — | 60 ml | 5 | HFSS, HFSM, HFSL, HFSXL, HFSWS-L |
| SKU-1Y2N1OK | REJOICE | Shampoo | — | 70 ml | 4 | HFSL, HFSXL, HFSWS-S, HFSWS-L |
| SKU-0GMMNP5 | SAFEGUARD | Soap | Pure White OCR evidence | 58 g | 1 | HFSS |
| SKU-0W4RPKC | SAFEGUARD | Soap | — | 58 g | 2 | HFSM, HFSWS-S |
| SKU-1TB2K2O | SAFEGUARD | Soap | — | 120 g | 1 | HFSWS-S |
| SKU-0NS6TMB | VICKS | Balm | — | 5 g | 4 | HFSS, HFSM, HFSL, HFSXL |
| SKU-0R7GD37 | VICKS | Balm | — | 10 g | 5 | HFSS, HFSM, HFSL, HFSXL, HFSWS-S |
| SKU-1W5H0B7 | VICKS | Balm | — | 25 g | 5 | HFSS, HFSM, HFSL, HFSXL, HFSWS-S |

## Automated checks

- Promo domain/import/security tests: 27 passed
- TypeScript: passed
- Production build: passed
- Security/static checks: passed
- Existing smoke and regression suites: passed

## Still pending

- The 122 quarantined Cards and OCR-derived one-Card candidate groups must be
  corrected or confirmed in the authenticated Admin Preview before Draft save.
- Draft save, Publish, rollback, database migration, RLS/policy, and Storage
  integration remain unexecuted against Production.
