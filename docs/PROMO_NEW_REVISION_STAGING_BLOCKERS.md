# Promo New revision staging — blocked

Updated: 2026-07-23

The prepared migration `supabase/migrations/20260716083231_promo_system_rebuild.sql`
must not be applied to Production in its current form. The rebuild Preview intentionally keeps
`LEGACY_WRITES_ENABLED = false` and the ordinary API returns
`legacy_revision_staging_not_installed`.

## Closed in isolated staging

The prepared migration was applied only to the non-Production
`solomon-promo-hardening-test` project on 2026-07-23. Its pgTAP suite passes **40/40** and proves:

- a confirmed variant/model can identify a SKU when numeric size and size unit are absent;
- SKU references resolve through stable `identity_key` when a later Draft submits a different
  `external_id`;
- multiple cards from the same Class can share one Product Group while retaining different
  Promotion Families at Card level;
- Draft save, Publish, Published catalog, second revision, and Rollback behavior;
- a failed complete-save statement leaves no partial Version and does not change the Published
  pointer; and
- anonymous/authenticated roles cannot bypass the service-role write boundary of the prepared
  Production design.

The SQL schema continues to enforce one Product Group per SKU per Version. Browser validation also
blocks duplicate groups for the same Product Master before the SQL boundary.

A separate TEST/STAGING-only network adapter has now been implemented:

- `api/promo-new-staging-write.js` accepts one complete Dataset per POST;
- `public.save_promo_test_revision_v1` serializes same-month saves and writes the complete Dataset in
  one transaction;
- exact retries are idempotent and reuse revision 1;
- changed payloads cannot reuse an existing Version ID;
- a failed Card reference leaves no failed month, Version or Card rows and does not move a Published
  pointer;
- the known Production Supabase hostname is rejected; and
- the RPC requires the test admin-key hash and is executable only through the staging publishable-key
  adapter role.

A synthetic full-size benchmark saved 212 Cards, 42 Product Groups and six Classes in 108–187 ms of
server transaction time. An exact retry completed in 3.454 ms. See
`docs/PROMO_NEW_ATOMIC_REVISION_BENCHMARK.md` for the full evidence and limitations.

## Remaining blockers

1. The actual JUL26 PDF/XLSM pair has not completed a full 212-Card browser round-trip on isolated
   staging. Synthetic scale evidence does not certify OCR, Product Master matching, grouping,
   Promotion Family assignment, prices or unresolved counts for the real file.
2. The guarded Vercel route is deployed and POST-only, but a scripted protected-Preview POST could
   not be completed from the current tool environment. Browser-to-Vercel-to-Supabase network timing
   is therefore not claimed.
3. The ordinary Promo UI deliberately keeps revision writes disabled. It has not been switched to the
   staging atomic endpoint and must not be enabled before the real-file run and explicit approval.
4. Card-image upload and Production Publish/Rollback wiring remain outside the staging adapter.

## Requirements before enabling Production writes

- Keep SQL optional-size constraints aligned with domain validation rules. **Passed in staging.**
- Resolve existing SKUs by stable identity/master ID, not a mutable external ID alone. **Passed in staging.**
- Save a complete revision before changing any Published pointer. **Passed for the complete-Dataset
  SQL function and the staging atomic adapter.**
- Make failed uploads retryable or removable without affecting the current Published version.
  **Passed for exact Draft retries and failed complete-Dataset rollback in staging.**
- Add behavioral SQL tests for Draft, optional-size products, duplicate SKU/group protection,
  publish gate, rollback, and public Published reads. **40/40 passed in staging.**
- Run the actual JUL26 212-Card PDF/XLSM payload through the authenticated browser workflow and record
  the acceptance evidence. **Not passed.**
- Complete a protected-Preview POST through the deployed Vercel adapter. **Not passed.**
- Obtain explicit approval before merging, applying migrations to Production, enabling UI writes,
  publishing, rolling back or uploading Card images. **Required.**

Until all remaining requirements pass, Draft, Publish, Rollback, Card-image uploads and Production
Database/Storage writes must remain disabled in the rebuild Preview.

## Manual grouping Snapshot v2

`supabase/migrations/20260723104837_promo_grouping_snapshot_v2.sql` is a separate
TEST/STAGING-only migration. It must not be applied to Production without explicit approval.
The matching API routes require all three environment variables below and reject the known
Production Supabase URL:

- `PROMO_TEST_DATABASE=1`
- `PROMO_TEST_SUPABASE_URL`
- `PROMO_TEST_SUPABASE_PUBLISHABLE_KEY`

Snapshot v2 uses a registered source-dataset manifest, stable UUID Card IDs, exact Card ID set
validation, per-card Promotion Family/Tier assignments, persisted confirmed/locked state, optimistic
revision checks, and an explicit central unlock RPC. A locked group cannot be changed by submitting a
replacement Snapshot; it must first be unlocked centrally. The legacy Draft/Publish path remains
disabled through `LEGACY_WRITES_ENABLED = false`.
