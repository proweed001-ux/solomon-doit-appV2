-- TEST/STAGING ONLY until explicitly approved. Do not apply to production.
-- The browser-facing RPCs authenticate every request with a high-entropy key hash.
-- Direct table access remains deny-by-default, and only the anon role used by the
-- test API's publishable key may execute the narrow RPC surface.

create index if not exists promo_grouping_card_assignments_snapshot_group_idx
  on public.promo_grouping_card_assignments_v2(snapshot_id, group_id);

create policy promo_test_admin_keys_deny_direct_access
  on public.promo_test_admin_keys
  for all to anon, authenticated
  using (false)
  with check (false);

create policy promo_source_datasets_deny_direct_access
  on public.promo_source_datasets
  for all to anon, authenticated
  using (false)
  with check (false);

create policy promo_source_cards_deny_direct_access
  on public.promo_source_cards
  for all to anon, authenticated
  using (false)
  with check (false);

create policy promo_grouping_snapshots_v2_deny_direct_access
  on public.promo_grouping_snapshots_v2
  for all to anon, authenticated
  using (false)
  with check (false);

create policy promo_grouping_snapshot_groups_v2_deny_direct_access
  on public.promo_grouping_snapshot_groups_v2
  for all to anon, authenticated
  using (false)
  with check (false);

create policy promo_grouping_card_assignments_v2_deny_direct_access
  on public.promo_grouping_card_assignments_v2
  for all to anon, authenticated
  using (false)
  with check (false);

revoke all on function public.promo_test_key_is_valid(text) from public, anon, authenticated;
revoke all on function public.validate_promo_test_admin_key_v2(text) from public, anon, authenticated;
revoke all on function public.load_promo_test_master_data_v2(text) from public, anon, authenticated;
revoke all on function public.load_promo_source_dataset_v2(uuid, text) from public, anon, authenticated;
revoke all on function public.load_promo_grouping_snapshot_v2(text, uuid, text, integer, text) from public, anon, authenticated;
revoke all on function public.save_promo_grouping_snapshot_v2(jsonb, text) from public, anon, authenticated;
revoke all on function public.unlock_promo_grouping_group_v2(uuid, uuid, text, integer, text) from public, anon, authenticated;

grant execute on function public.validate_promo_test_admin_key_v2(text) to anon;
grant execute on function public.load_promo_test_master_data_v2(text) to anon;
grant execute on function public.load_promo_source_dataset_v2(uuid, text) to anon;
grant execute on function public.load_promo_grouping_snapshot_v2(text, uuid, text, integer, text) to anon;
grant execute on function public.save_promo_grouping_snapshot_v2(jsonb, text) to anon;
grant execute on function public.unlock_promo_grouping_group_v2(uuid, uuid, text, integer, text) to anon;
