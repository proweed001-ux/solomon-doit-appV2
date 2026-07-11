-- Phase 1: low-risk permission hardening.
--
-- This migration intentionally does not change the anon write policies on
-- doit_versions and does not change the four public promo views to
-- security_invoker. Those changes require an authenticated replacement for
-- the current browser-admin workflow before they can be made safely.

begin;

-- promo_upload_keys is read by Edge Functions with service_role. Browser
-- clients do not need direct table access.
alter table public.promo_upload_keys enable row level security;
revoke all on table public.promo_upload_keys from public, anon, authenticated;
grant all on table public.promo_upload_keys to service_role;

-- These SECURITY DEFINER routines are implementation details. The trigger
-- function still runs from its trigger and service_role retains explicit RPC
-- access to set_doit_active_version if a trusted backend needs it.
revoke execute on function public.doit_versions_single_active_guard() from public, anon, authenticated;
grant execute on function public.doit_versions_single_active_guard() to service_role;

revoke execute on function public.set_doit_active_version(uuid) from public, anon, authenticated;
grant execute on function public.set_doit_active_version(uuid) to service_role;

-- Public promo views are read models. Remove inherited write-like grants while
-- preserving the SELECT calls used by promo-live.html and promo-admin.html.
revoke all on table
  public.promo_shared_prices_public,
  public.promo_group_prices_public,
  public.promo_product_groups_public,
  public.promo_cards_with_functions
from anon, authenticated;

grant select on table
  public.promo_shared_prices_public,
  public.promo_group_prices_public,
  public.promo_product_groups_public,
  public.promo_cards_with_functions
to anon, authenticated;

commit;
