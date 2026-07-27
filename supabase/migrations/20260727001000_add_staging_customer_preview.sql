-- Promo rebuild staging customer-preview bridge.
-- TEST/STAGING ONLY: the guard requires promo_test_admin_keys, which does not
-- exist in the Production project.

do $guard$
begin
  if to_regclass('public.promo_test_admin_keys') is null then
    raise exception 'staging_only_promo_test_admin_keys_missing';
  end if;
end
$guard$;

create table if not exists public.promo_test_card_images (
  version_id uuid not null,
  card_external_id text not null,
  mime_type text not null check (mime_type = 'image/webp'),
  image_bytes bytea not null check (octet_length(image_bytes) between 32 and 1048576),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (version_id, card_external_id)
);

alter table public.promo_test_card_images enable row level security;
revoke all on table public.promo_test_card_images from anon, authenticated;

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
  if p_version_id is null then raise exception 'version_id_invalid'; end if;
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

create or replace function public.save_promo_test_card_image_v1(
  p_version_id uuid,
  p_card_external_id text,
  p_mime_type text,
  p_image_base64 text,
  p_auth_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_bytes bytea;
begin
  if not exists (
    select 1
    from public.promo_test_admin_keys
    where auth_hash = p_auth_hash
      and active
  ) then
    raise exception 'invalid_admin_key';
  end if;
  if p_version_id is null then raise exception 'version_id_invalid'; end if;
  if p_card_external_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$' then
    raise exception 'card_id_invalid';
  end if;
  if p_mime_type <> 'image/webp' then raise exception 'image_mime_invalid'; end if;
  if p_image_base64 is null or length(p_image_base64) > 1398104 then
    raise exception 'image_payload_invalid';
  end if;

  begin
    v_bytes := decode(p_image_base64, 'base64');
  exception when others then
    raise exception 'image_base64_invalid';
  end;

  if octet_length(v_bytes) < 32 or octet_length(v_bytes) > 1048576
     or encode(substring(v_bytes from 1 for 4), 'hex') <> '52494646'
     or encode(substring(v_bytes from 9 for 4), 'hex') <> '57454250' then
    raise exception 'image_webp_invalid';
  end if;

  insert into public.promo_test_card_images(
    version_id, card_external_id, mime_type, image_bytes, updated_at
  ) values (
    p_version_id, lower(p_card_external_id), p_mime_type, v_bytes, now()
  )
  on conflict (version_id, card_external_id) do update
  set mime_type = excluded.mime_type,
      image_bytes = excluded.image_bytes,
      updated_at = now();

  return jsonb_build_object(
    'version_id', p_version_id,
    'card_id', lower(p_card_external_id),
    'bytes', octet_length(v_bytes)
  );
end;
$$;

create or replace function public.get_promo_test_card_image_v1(
  p_version_id uuid,
  p_card_external_id text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_image public.promo_test_card_images%rowtype;
begin
  select i.* into v_image
  from public.promo_test_card_images i
  join public.promo_new_versions v
    on v.id = i.version_id
   and v.status = 'published'
  join public.promo_new_cards c
    on c.version_id = i.version_id
   and c.card_id = i.card_external_id
  where i.version_id = p_version_id
    and i.card_external_id = lower(p_card_external_id);

  if not found then raise exception 'published_image_not_found'; end if;

  return jsonb_build_object(
    'mime_type', v_image.mime_type,
    'image_base64', encode(v_image.image_bytes, 'base64'),
    'bytes', octet_length(v_image.image_bytes)
  );
end;
$$;

revoke all on function public.publish_promo_test_version_v1(uuid,text) from public;
revoke all on function public.get_promo_test_published_catalog_v1(text) from public;
revoke all on function public.save_promo_test_card_image_v1(uuid,text,text,text,text) from public;
revoke all on function public.get_promo_test_card_image_v1(uuid,text) from public;

grant execute on function public.publish_promo_test_version_v1(uuid,text) to anon, authenticated;
grant execute on function public.get_promo_test_published_catalog_v1(text) to anon, authenticated;
grant execute on function public.save_promo_test_card_image_v1(uuid,text,text,text,text) to anon, authenticated;
grant execute on function public.get_promo_test_card_image_v1(uuid,text) to anon, authenticated;
