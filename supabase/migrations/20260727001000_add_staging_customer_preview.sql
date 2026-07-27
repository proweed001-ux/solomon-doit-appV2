-- Promo rebuild staging customer-preview bridge.
-- TEST/STAGING ONLY: the guard requires promo_test_admin_keys, which does not
-- exist in the Production project.

do $guard$
begin
  if to_regclass('public.promo_test_admin_keys') is null then
    raise exception 'staging_only_promo_test_admin_keys_missing';
  end if;
  if not exists (select 1 from storage.buckets where id = 'promo-new-cards') then
    raise exception 'staging_only_promo_card_bucket_missing';
  end if;
end
$guard$;

create or replace function public.publish_promo_test_version_v1(
  p_version_id uuid,
  p_auth_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_actor_id constant uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
begin
  if not exists (
    select 1
    from public.promo_test_admin_keys
    where auth_hash = p_auth_hash
      and active
  ) then
    raise exception 'invalid_admin_key';
  end if;

  if p_version_id is null then
    raise exception 'version_id_invalid';
  end if;

  return public.promo_new_publish_version(p_version_id, v_actor_id);
end;
$$;

create or replace function public.get_promo_test_published_catalog_v1(
  p_month_key text default null
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if to_regclass('public.promo_test_admin_keys') is null then
    raise exception 'staging_only_promo_test_admin_keys_missing';
  end if;
  return public.promo_new_get_published_catalog(nullif(upper(trim(p_month_key)), ''));
end;
$$;

revoke all on function public.publish_promo_test_version_v1(uuid,text) from public;
revoke all on function public.get_promo_test_published_catalog_v1(text) from public;
grant execute on function public.publish_promo_test_version_v1(uuid,text) to anon, authenticated;
grant execute on function public.get_promo_test_published_catalog_v1(text) to anon, authenticated;

update storage.buckets
set public = true,
    file_size_limit = 1048576,
    allowed_mime_types = array['image/webp']::text[]
where id = 'promo-new-cards';

drop policy if exists promo_test_card_images_insert_v1 on storage.objects;
drop policy if exists promo_test_card_images_update_v1 on storage.objects;

create policy promo_test_card_images_insert_v1
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'promo-new-cards'
  and name ~ '^staging/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.webp$'
);

create policy promo_test_card_images_update_v1
on storage.objects
for update
to anon, authenticated
using (
  bucket_id = 'promo-new-cards'
  and name ~ '^staging/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.webp$'
)
with check (
  bucket_id = 'promo-new-cards'
  and name ~ '^staging/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.webp$'
);
