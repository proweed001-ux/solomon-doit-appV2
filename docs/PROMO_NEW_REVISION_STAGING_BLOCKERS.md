# Promo New revision staging — blocked

Updated: 2026-07-23

The prepared migration `supabase/migrations/20260716083231_promo_system_rebuild.sql`
must not be applied to Production in its current form. The rebuild Preview intentionally keeps
`LEGACY_WRITES_ENABLED = false` and the API returns `legacy_revision_staging_not_installed`.

## Closed in isolated staging

The prepared migration was applied only to the non-Production
`solomon-promo-hardening-test` project on 2026-07-23. Its pgTAP suite passes **40/40** and now proves:

- a confirmed variant/model can identify a SKU when numeric size and size unit are absent;
- SKU references resolve through stable `identity_key` when a later Draft submits a different
  `external_id`;
- multiple cards from the same Class can share one Product Group while retaining different
  Promotion Families at Card level;
- Draft save, Publish, Published catalog, second revision, and Rollback behavior;
- a failed complete-save statement leaves no partial Version and does not change the Published
  pointer; and
- anonymous/authenticated roles cannot bypass the service-role write boundary.

The SQL schema continues to enforce one Product Group per SKU per Version. Browser validation also
blocks duplicate groups for the same Product Master before the SQL boundary.

## Remaining blockers

1. No atomic multi-batch upload/rollback contract has been proven. A failed later batch must not
   leave a partially visible Draft or change the status of the current Published month.

2. The current migration has not been benchmarked with the real JUL26 212-card payload and the real
   legacy Product Master identities in isolated staging.

3. The current browser runtime deliberately keeps all legacy revision writes disabled. The tested
   SQL function receives a complete Dataset in one transaction; the network upload path has not yet
   been switched to that contract.

## Requirements before enabling writes

- Keep SQL optional-size constraints aligned with the domain validation rules. **Passed in staging.**
- Resolve existing SKUs by stable identity/master ID, not a mutable external ID alone. **Passed in staging.**
- Save a complete revision into isolated staging before changing any Published pointer. **Passed for
  the complete-Dataset SQL function.**
- Make failed uploads fully retryable or removable without affecting the current Published version.
- Add behavioral SQL tests for Draft, optional-size products, duplicate SKU/group protection,
  publish gate, rollback, and public Published reads. **40/40 passed in staging.**
- Run the migration on a non-Production Supabase branch and benchmark a full 212-card JUL26 upload.
- Obtain explicit approval before merging or applying the migration and before enabling network writes.

Until all requirements pass, legacy Draft, Publish, rollback, card-image uploads, and Production
Database/Storage writes must remain disabled in the rebuild Preview.

## Manual grouping Snapshot v2 (hardening branch)

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
