-- Manual rollback for 20260711102421_phase_1_safe_security_hardening.sql.
-- Run only if the Phase 1 migration must be reversed.

begin;

alter table public.promo_upload_keys disable row level security;
grant all on table public.promo_upload_keys to anon, authenticated, service_role;

grant execute on function public.doit_versions_single_active_guard() to public, anon, authenticated, service_role;
grant execute on function public.set_doit_active_version(uuid) to public, anon, authenticated, service_role;

grant all on table
  public.promo_shared_prices_public,
  public.promo_group_prices_public,
  public.promo_product_groups_public,
  public.promo_cards_with_functions
to anon, authenticated;

commit;
