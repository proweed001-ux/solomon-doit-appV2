# Promo New revision staging — blocked

Updated: 2026-07-19

The prepared migration `supabase/migrations/20260716083231_promo_system_rebuild.sql`
must not be applied to Production in its current form. The rebuild Preview intentionally keeps
`LEGACY_WRITES_ENABLED = false` and the API returns `legacy_revision_staging_not_installed`.

## Confirmed blockers

1. `promo_new_skus` requires a positive numeric size and non-empty size unit for every SKU.
   The browser/domain contract now permits model-based products such as selected Gillette,
   Oral-B, Olay, and package/model identities to use a confirmed variant instead of a numeric size.

2. The SKU upsert conflict target is `identity_key`, but the current save path resolves card
   references by `external_id`. When an existing identity is submitted with a different external ID,
   the upsert can retain the old external ID and the following card lookup can fail with
   `card_reference_missing`.

3. The SQL schema correctly permits only one Product Group per SKU per Version. Historical browser
   grouping could create multiple groups for one existing Product Master. The current browser
   validation now blocks this, but the migration still needs an end-to-end save test using real
   legacy Product Master keys before installation.

4. The SQL test file checks object existence and anonymous privileges only. It does not execute and
   verify Draft save, optional-size SKU save, publish validation, rollback, or Published catalog
   behavior.

5. No atomic multi-batch upload/rollback contract has been proven. A failed later batch must not
   leave a partially visible Draft or change the status of the current Published month.

## Requirements before enabling writes

- Align SQL optional-size constraints with the domain validation rules.
- Resolve existing SKUs by stable identity/master ID, not a mutable external ID alone.
- Save a complete revision into isolated staging before changing any Published pointer.
- Make failed uploads fully retryable or removable without affecting the current Published version.
- Add behavioral SQL tests for Draft, optional-size products, duplicate SKU/group protection,
  publish gate, rollback, and public Published reads.
- Run the migration on a non-Production Supabase branch and benchmark a full 212-card JUL26 upload.
- Obtain explicit approval before merging or applying the migration and before enabling network writes.

Until all requirements pass, Draft, Publish, rollback, card-image uploads, Database writes, and
Storage writes must remain disabled in the rebuild Preview.
