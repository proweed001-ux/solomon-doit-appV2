create or replace function public.save_manual_promo_grouping_snapshot(
  p_promo_month_id text,
  p_groups jsonb,
  p_auth_hash text
)
returns table(group_count integer, card_count integer)
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_month text := upper(btrim(coalesce(p_promo_month_id, '')));
  v_hash text := lower(btrim(coalesce(p_auth_hash, '')));
  v_group_count integer;
  v_card_count integer;
  v_expected_cards integer;
begin
  if v_month !~ '^[A-Z]{3}[0-9]{2}$' then
    raise exception using errcode = '22023', message = 'invalid_promo_month';
  end if;
  if v_hash !~ '^[0-9a-f]{64}$' or not public.is_valid_promo_key_hash(v_hash) then
    raise exception using errcode = '42501', message = 'invalid_admin_key';
  end if;
  if jsonb_typeof(coalesce(p_groups, 'null'::jsonb)) <> 'array' then
    raise exception using errcode = '22023', message = 'invalid_grouping_payload';
  end if;

  select jsonb_array_length(p_groups) into v_group_count;
  if v_group_count < 1 or v_group_count > 300 then
    raise exception using errcode = '22023', message = 'invalid_group_count';
  end if;

  with parsed_groups as (
    select (entry->>'master_product_id')::uuid as master_product_id,
           coalesce(entry->'card_ids', '[]'::jsonb) as card_ids
    from jsonb_array_elements(p_groups) entry
  ), parsed_cards as (
    select pg.master_product_id, btrim(card_id) as card_id
    from parsed_groups pg
    cross join lateral jsonb_array_elements_text(pg.card_ids) card_id
  )
  select count(*) into v_card_count from parsed_cards;

  if v_card_count < 1 or v_card_count > 2000 then
    raise exception using errcode = '22023', message = 'invalid_card_count';
  end if;

  if exists (
    with parsed_groups as (
      select coalesce(entry->'card_ids', '[]'::jsonb) as card_ids
      from jsonb_array_elements(p_groups) entry
    ), parsed_cards as (
      select btrim(card_id) as card_id
      from parsed_groups pg
      cross join lateral jsonb_array_elements_text(pg.card_ids) card_id
    )
    select 1 from parsed_cards group by card_id having count(*) > 1
  ) then
    raise exception using errcode = '22023', message = 'duplicate_card_in_snapshot';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_groups) entry
    left join public.promo_product_master m
      on m.master_product_id = (entry->>'master_product_id')::uuid
     and m.status = 'active'
    where m.master_product_id is null
  ) then
    raise exception using errcode = 'P0002', message = 'active_master_product_not_found';
  end if;

  if exists (
    with parsed_groups as (
      select coalesce(entry->'card_ids', '[]'::jsonb) as card_ids
      from jsonb_array_elements(p_groups) entry
    ), parsed_cards as (
      select btrim(card_id) as card_id
      from parsed_groups pg
      cross join lateral jsonb_array_elements_text(pg.card_ids) card_id
    )
    select 1
    from parsed_cards pc
    left join public.promo_cards c
      on c.promo_month_id = v_month and c.card_id = pc.card_id
    where c.card_id is null
  ) then
    raise exception using errcode = 'P0002', message = 'card_not_found_for_month';
  end if;

  select count(*) into v_expected_cards
  from public.promo_cards
  where promo_month_id = v_month and status <> 'inactive';

  if v_card_count <> v_expected_cards then
    raise exception using errcode = '22023', message = format('grouping_snapshot_incomplete:%s/%s', v_card_count, v_expected_cards);
  end if;

  with parsed_groups as (
    select (entry->>'master_product_id')::uuid as master_product_id,
           coalesce(entry->'card_ids', '[]'::jsonb) as card_ids
    from jsonb_array_elements(p_groups) entry
  ), prepared as (
    select
      pg.master_product_id,
      ('PG-' || v_month || '-M-' || substr(replace(pg.master_product_id::text, '-', ''), 1, 16))::text as group_id,
      (select value from jsonb_array_elements_text(pg.card_ids) with ordinality as x(value, ord) order by ord limit 1) as anchor_card_id,
      m.canonical_name
    from parsed_groups pg
    join public.promo_product_master m on m.master_product_id = pg.master_product_id
  )
  insert into public.promo_product_groups as target(
    group_id, promo_month_id, anchor_card_id, canonical_name,
    detection_method, status, master_product_id, created_at, updated_at
  )
  select p.group_id, v_month, p.anchor_card_id, p.canonical_name,
         'manual_admin_snapshot_v1', 'manual_locked', p.master_product_id,
         clock_timestamp(), clock_timestamp()
  from prepared p
  on conflict (group_id) do update set
    promo_month_id = excluded.promo_month_id,
    anchor_card_id = excluded.anchor_card_id,
    canonical_name = excluded.canonical_name,
    detection_method = excluded.detection_method,
    status = excluded.status,
    master_product_id = excluded.master_product_id,
    updated_at = excluded.updated_at;

  delete from public.promo_card_product_groups
  where promo_month_id = v_month;

  with parsed_groups as (
    select (entry->>'master_product_id')::uuid as master_product_id,
           coalesce(entry->'card_ids', '[]'::jsonb) as card_ids
    from jsonb_array_elements(p_groups) entry
  ), parsed_cards as (
    select
      pg.master_product_id,
      btrim(card_id) as card_id,
      ('PG-' || v_month || '-M-' || substr(replace(pg.master_product_id::text, '-', ''), 1, 16))::text as group_id
    from parsed_groups pg
    cross join lateral jsonb_array_elements_text(pg.card_ids) card_id
  )
  insert into public.promo_card_product_groups(
    promo_month_id, card_id, group_id, decision,
    match_score, match_margin, visual_score, title_score, size_score, price_image_score,
    reason, adaptive, evidence, created_at, updated_at
  )
  select
    v_month, pc.card_id, pc.group_id, 'MANUAL',
    1, 1, null, null, null, null,
    'manual_admin_snapshot_v1', false,
    jsonb_build_object('method', 'manual', 'saved_at', clock_timestamp()),
    clock_timestamp(), clock_timestamp()
  from parsed_cards pc;

  delete from public.promo_product_groups g
  where g.promo_month_id = v_month
    and not exists (
      select 1 from public.promo_card_product_groups cpg
      where cpg.promo_month_id = v_month and cpg.group_id = g.group_id
    )
    and not exists (
      select 1 from public.promo_group_prices gp
      where gp.promo_month_id = v_month and gp.group_id = g.group_id
    );

  return query select v_group_count, v_card_count;
end;
$function$;

revoke all on function public.save_manual_promo_grouping_snapshot(text,jsonb,text) from public;
grant execute on function public.save_manual_promo_grouping_snapshot(text,jsonb,text) to anon, authenticated, service_role;
