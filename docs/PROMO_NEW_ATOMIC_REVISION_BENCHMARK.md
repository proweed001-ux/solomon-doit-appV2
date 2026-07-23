# Promo New — atomic revision staging benchmark

Updated: 2026-07-24 (Asia/Bangkok)

## Scope and safety

This evidence belongs only to the isolated Supabase project `solomon-promo-hardening-test`
(project ref `rpxjhbnyyozbnhotrlzb`). Production Database, Production Storage, Published pointers,
and the Production Vercel deployment were not changed.

The staging migration deliberately requires `public.promo_test_admin_keys`. It must fail on a
project where that test-only table is absent. The Vercel adapter also rejects the known Production
Supabase hostname and requires `PROMO_TEST_DATABASE=1`.

## Implemented contract

- `api/promo-new-staging-write.js` accepts one complete `promo-system-rebuild-v1` Dataset per POST.
- The request is limited to 2,000,000 bytes and 1–1,000 Cards.
- All Cards and Product Groups must belong to the same month as the Version.
- `public.save_promo_test_revision_v1` validates the test admin-key hash.
- A PostgreSQL advisory transaction lock serializes writes for the same month.
- The complete Dataset is saved by `promo_new_save_draft` in one database transaction.
- An exact retry of the same Version ID and payload is idempotent.
- Reusing the Version ID with a different payload is rejected.
- A failed Card reference rolls back the month, version, groups, families, cards and audit rows created
  by that call.
- This path saves Draft only. It does not Publish, Rollback, upload Card images or invoke
  `finalize_latest`.

## Full-size synthetic benchmark

The benchmark used a deterministic synthetic Dataset shaped like the expected JUL26 scale. It did
**not** use the real JUL26 OCR/grouping output and therefore is not evidence that the real file is
correctly parsed or grouped.

First complete save:

- Cards: 212
- Product Groups: 42
- Classes: 6
- Promotion Families: 1
- Payload size reported by PostgreSQL: 266,280 bytes
- Server transaction time: 186.609 ms
- Result: Draft revision 1
- Unready Cards: 0
- Unready Groups: 0

Separate exact-retry run:

- Cards: 212
- Product Groups: 42
- Classes: 6
- Payload size reported by PostgreSQL: 263,696 bytes
- First save server time: 108.014 ms
- Exact retry server time: 3.454 ms
- Retry result: `idempotent=true`, revision remained 1
- Stored Card, Group and Family counts remained exact

Atomic failure test:

- A payload with a Card pointing to a missing Product Group raised `card_reference_missing` after the
  function had entered the complete-save transaction.
- Remaining failed month rows: 0
- Remaining failed version rows: 0
- Remaining failed Card rows: 0
- Existing Published pointers before and after the failed call were identical.

## Reviewed JUL26 file-manifest benchmark

This second benchmark used the actual JUL26 file identities and a card manifest reviewed directly
against the rendered PDF pages. It is stronger than the synthetic scale test, but it is still **not**
a claim that browser OCR or automatic grouping produced the final 42 groups without manual review.

Source identity:

- PDF: `6.Promotion Canvass Jul'26(5).pdf`
- PDF SHA-256: `38b5785d521f63f97fd8586c228127671d872f42bf539a909a1999923add5837`
- CSV export: `PROMO_Jul26.xlsm(1).csv`
- CSV SHA-256: `8bbbc4828be03ccf7933f79fdaf1796f8054b1deae516f2c97953fb889401028`
- PDF pages: 18
- Stable Cards registered in isolated staging: 212
- Reviewed Product Master destinations: 42
- Classes: HFSS, HFSM, HFSL, HFSXL, HFSWS-S and HFSWS-L
- Prices: intentionally empty because the administrator will enter them manually
- Promotion Families/Tiers in this benchmark: deterministic staging placeholders used only to exercise
  the per-Card contract; they do not certify the business promotion interpretation from the workbook

Grouping Snapshot v2 round-trip:

- Source Dataset ID: `c86a15df-9600-4da3-8393-b6157a279c61`
- Snapshot ID: `bedb5f19-0e34-49db-8e54-606cd673268f`
- Initial Save + Load: 42 Groups, 212 Assignments and 212 distinct Card UUIDs
- Direct Save + Load database time observed: 32.643 ms
- Central unlock changed revision 1 to revision 2 and cleared confirmed/locked for the selected group
- Reconfirm + complete resave changed revision 2 to revision 3 in 37.992 ms
- Reload of revision 3 restored 42 confirmed/locked Groups and all 212 distinct Card UUIDs

Revision Draft transaction:

- Version ID: `9116cfe1-2e9b-4ddd-8b59-846ab4e30745`
- Result: Draft revision 1
- Persisted Product Groups: 42
- Persisted Cards: 212
- Distinct stable Card UUIDs: 212
- Distinct SKUs: 42
- Promotion Families: 42
- Per-Class staging tiers: 252
- Direct database transaction time observed: 129.689 ms
- A deliberately invalid Card → missing Group payload raised `card_reference_missing`
- The failed Version left 0 Version, Group, Card and Family rows, confirming no partial write

The real-file manifest exposed two Product Master identity defects before the successful Draft save:

1. Legacy rows with no numeric size and no structured variant failed the confirmed-model/variant SKU
   constraint.
2. Two Downy 480 ml groups with different variants collided when Variant was missing.

The hardening branch now preserves a parsed fallback size when structured `size_value` is null,
preserves an existing fallback Variant, and supplies a canonical model fallback only for size-less
legacy products. Dedicated regression tests cover H&S 65 ml, Gillette Super Click and the two Downy
480 ml variants.

## Permissions and advisors

The atomic staging RPC is executable by `anon` only because the Vercel adapter calls Supabase with the
staging publishable key. The RPC still requires a valid SHA-256 test admin-key hash. Execute privilege
was removed from `authenticated` and `public`.

Supabase Performance Advisor reported only unused-index informational findings expected on a new test
project. It did not report an unindexed foreign key. Security Advisor still reports the generic
`anon SECURITY DEFINER` warning for test RPCs; this is intentional for the staging adapter and is
bounded by the test-project guard plus the admin-key hash. It must not be copied to Production.

## Deployment and automated checks

- Vercel Preview for commit `ca6ad1ecf1f157fd0d1020423d05a84137a63194` reached READY.
- `GET /api/promo-new-staging-write` returned HTTP 405 with `Allow: POST`, proving the guarded route is
  deployed and POST-only.
- Web CI run #545 passed Foundation smoke, Pro regression, Promo hardening verification and Promo
  browser regression.
- Later Product Master fallback changes must use the CI and Preview results for their own final commit;
  the earlier READY/CI evidence must not be reused as approval for newer code.

## Evidence not yet obtained

1. The complete real PDF/XLSM pair has not yet completed an authenticated browser OCR → automatic
   Product Master match → grouping → correction → network save round-trip. The reviewed 212-Card
   manifest above validates conservation and database contracts, not automatic grouping quality.
2. The current tool environment could not resolve the protected Vercel Preview hostname for a scripted
   POST, so browser-to-Vercel-to-Supabase network timing is not claimed. Direct staging RPC timing and
   deployed-route behavior are proven separately.
3. OCR runtime, direct Product Master matches, Scope matches, unresolved Cards, inherited/missing/
   conflicting prices and Promotion Family ambiguity still require capture from the authenticated
   browser run using the actual files.
4. The ordinary Promo UI still keeps legacy writes disabled. Do not enable the UI save/publish path or
   apply these migrations to Production without explicit approval and a successful real-file run.
