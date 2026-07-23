-- TEST/STAGING ONLY. Keep the atomic revision RPC reachable only through the
-- publishable-key server adapter; signed-in application users do not need it.

do $guard$
begin
  if to_regclass('public.promo_test_admin_keys') is null then
    raise exception 'staging_only_promo_test_admin_keys_missing';
  end if;
end
$guard$;

revoke execute on function public.save_promo_test_revision_v1(jsonb,text,text) from authenticated;
grant execute on function public.save_promo_test_revision_v1(jsonb,text,text) to anon;
