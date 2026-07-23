-- Promo rebuild atomic revision network adapter.
-- TEST/STAGING ONLY. This migration intentionally depends on promo_test_admin_keys
-- so it cannot be applied to the Production project by accident.

do $guard$
begin
  if to_regclass('public.promo_test_admin_keys') is null then
    raise exception 'staging_only_promo_test_admin_keys_missing';
  end if;
end
$guard$;

create or replace function public.save_promo_test_revision_v1(
  p_payload jsonb,
  p_expected_month_key text,
  p_auth_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_actor_id constant uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  v_started_at timestamptz := clock_timestamp();
  v_month_key text := upper(trim(p_expected_month_key));
  v_version_id uuid;
  v_payload_fingerprint text;
  v_existing_month_key text;
  v_existing_status text;
  v_existing_revision integer;
  v_existing_fingerprint text;
  v_card_count integer := 0;
  v_group_count integer := 0;
  v_family_count integer := 0;
  v_result jsonb;
begin
  if not exists (
    select 1
    from public.promo_test_admin_keys
    where auth_hash = p_auth_hash
      and active
  ) then
    raise exception 'invalid_admin_key';
  end if;

  if p_payload is null or p_payload->>'schema' <> 'promo-system-rebuild-v1' then
    raise exception 'dataset_schema_invalid';
  end if;
  if v_month_key is null
     or v_month_key !~ '^[A-Z0-9][A-Z0-9_-]{2,31}$'
     or upper(trim(p_payload #>> '{version,monthKey}')) <> v_month_key then
    raise exception 'month_key_invalid';
  end if;
  if jsonb_typeof(p_payload->'cards') <> 'array'
     or jsonb_typeof(p_payload->'productGroups') <> 'array'
     or jsonb_typeof(p_payload->'promotionFamilies') <> 'array'
     or jsonb_typeof(p_payload->'skus') <> 'array'
     or jsonb_typeof(p_payload->'prices') <> 'array' then
    raise exception 'dataset_arrays_invalid';
  end if;

  begin
    v_version_id := nullif(p_payload #>> '{version,id}', '')::uuid;
  exception when invalid_text_representation then
    raise exception 'version_id_invalid';
  end;
  if v_version_id is null then raise exception 'version_id_invalid'; end if;

  v_card_count := jsonb_array_length(p_payload->'cards');
  v_group_count := jsonb_array_length(p_payload->'productGroups');
  v_family_count := jsonb_array_length(p_payload->'promotionFamilies');
  if v_card_count < 1 or v_card_count > 1000 then raise exception 'card_count_invalid'; end if;
  if v_group_count < 1 or v_group_count > v_card_count then raise exception 'group_count_invalid'; end if;
  if v_family_count < 1 or v_family_count > 1000 then raise exception 'family_count_invalid'; end if;

  v_payload_fingerprint := md5(p_payload::text);

  -- Serialize revisions for the same month so concurrent requests cannot race
  -- on revision number or month state.
  perform pg_advisory_xact_lock(hashtextextended(v_month_key, 0));

  select m.month_key, v.status, v.revision,
         (
           select a.after_value->>'payload_fingerprint'
           from public.promo_new_audit_log a
           where a.entity_type = 'version'
             and a.entity_id = v.id::text
             and a.action = 'staging_revision_payload_saved'
           order by a.created_at desc
           limit 1
         )
  into v_existing_month_key, v_existing_status, v_existing_revision, v_existing_fingerprint
  from public.promo_new_versions v
  join public.promo_new_months m on m.id = v.month_id
  where v.id = v_version_id;

  if found then
    if v_existing_month_key <> v_month_key then
      raise exception 'version_id_month_conflict';
    end if;
    if v_existing_fingerprint is null or v_existing_fingerprint <> v_payload_fingerprint then
      raise exception 'version_id_payload_conflict';
    end if;
    if (select count(*) from public.promo_new_cards where version_id = v_version_id) <> v_card_count
       or (select count(*) from public.promo_new_product_groups where version_id = v_version_id) <> v_group_count
       or (select count(*) from public.promo_new_promotion_families where version_id = v_version_id) <> v_family_count then
      raise exception 'existing_revision_incomplete';
    end if;

    return jsonb_build_object(
      'version_id', v_version_id,
      'month_key', v_month_key,
      'revision', v_existing_revision,
      'status', v_existing_status,
      'idempotent', true,
      'payload_fingerprint', v_payload_fingerprint,
      'payload_bytes', pg_column_size(p_payload),
      'card_count', v_card_count,
      'group_count', v_group_count,
      'family_count', v_family_count,
      'server_elapsed_ms', round((extract(epoch from clock_timestamp() - v_started_at) * 1000)::numeric, 3)
    );
  end if;

  insert into auth.users(id)
  values (v_actor_id)
  on conflict (id) do nothing;

  insert into public.promo_new_admins(user_id, active)
  values (v_actor_id, true)
  on conflict (user_id) do update set active = true;

  v_result := public.promo_new_save_draft(p_payload, v_actor_id, v_month_key);

  insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, after_value)
  values (
    v_actor_id,
    'staging_revision_payload_saved',
    'version',
    v_version_id::text,
    jsonb_build_object(
      'payload_fingerprint', v_payload_fingerprint,
      'payload_bytes', pg_column_size(p_payload),
      'card_count', v_card_count,
      'group_count', v_group_count,
      'family_count', v_family_count
    )
  );

  return v_result || jsonb_build_object(
    'idempotent', false,
    'payload_fingerprint', v_payload_fingerprint,
    'payload_bytes', pg_column_size(p_payload),
    'card_count', v_card_count,
    'group_count', v_group_count,
    'family_count', v_family_count,
    'server_elapsed_ms', round((extract(epoch from clock_timestamp() - v_started_at) * 1000)::numeric, 3)
  );
end;
$$;

revoke all on function public.save_promo_test_revision_v1(jsonb,text,text) from public;
grant execute on function public.save_promo_test_revision_v1(jsonb,text,text) to anon, authenticated;
