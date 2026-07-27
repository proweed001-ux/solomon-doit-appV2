-- TEST/STAGING ONLY: remove unnecessary authenticated-role access after
-- the preview endpoints were verified to use only the publishable anon role.
do $guard$
begin
  if to_regclass('public.promo_test_admin_keys') is null then
    raise exception 'staging_only_promo_test_admin_keys_missing';
  end if;
end
$guard$;

revoke execute on function public.publish_promo_test_version_v1(uuid,text) from authenticated;
revoke execute on function public.get_promo_test_published_catalog_v1(text) from authenticated;
revoke execute on function public.save_promo_test_card_image_v1(uuid,text,text,text,text) from authenticated;
revoke execute on function public.get_promo_test_card_image_v1(uuid,text) from authenticated;
