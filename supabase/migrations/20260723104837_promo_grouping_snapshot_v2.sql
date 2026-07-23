-- Promo grouping hardening schema.
-- TEST/STAGING ONLY until explicitly approved. Do not apply this migration to production.
--
-- The API also refuses to use the production Supabase URL for these RPCs. The source
-- dataset must be registered centrally first; browser-imported/ephemeral UUIDs cannot
-- be persisted as a grouping snapshot.

create table if not exists public.promo_test_admin_keys (
  auth_hash text primary key check (auth_hash ~ '^[0-9a-f]{64}$'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_source_datasets (
  id uuid primary key,
  month_key text not null,
  fingerprint text not null check (fingerprint ~ '^[0-9a-f]{64}$'),
  source_revision integer not null check (source_revision > 0),
  card_ids_hash text not null check (card_ids_hash ~ '^[0-9a-f]{64}$'),
  card_count integer not null check (card_count between 1 and 2000),
  dataset_payload jsonb not null check (jsonb_typeof(dataset_payload) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (month_key, fingerprint, source_revision)
);

create table if not exists public.promo_source_cards (
  id uuid primary key,
  dataset_id uuid not null references public.promo_source_datasets(id) on delete cascade,
  class_id text,
  page_no integer,
  card_no integer,
  created_at timestamptz not null default now(),
  unique (dataset_id, id)
);

create index if not exists promo_source_cards_dataset_idx
  on public.promo_source_cards(dataset_id);

create table if not exists public.promo_grouping_snapshots_v2 (
  id uuid primary key,
  dataset_id uuid not null unique references public.promo_source_datasets(id) on delete restrict,
  month_key text not null,
  dataset_fingerprint text not null check (dataset_fingerprint ~ '^[0-9a-f]{64}$'),
  dataset_revision integer not null check (dataset_revision > 0),
  card_ids_hash text not null check (card_ids_hash ~ '^[0-9a-f]{64}$'),
  revision integer not null check (revision > 0),
  card_count integer not null check (card_count between 1 and 2000),
  snapshot_payload jsonb not null check (jsonb_typeof(snapshot_payload) = 'object'),
  saved_at timestamptz not null default now()
);

create table if not exists public.promo_grouping_snapshot_groups_v2 (
  snapshot_id uuid not null references public.promo_grouping_snapshots_v2(id) on delete cascade,
  group_id text not null,
  master_product_id uuid not null,
  confirmed boolean not null,
  locked boolean not null,
  primary key (snapshot_id, group_id)
);

create table if not exists public.promo_grouping_card_assignments_v2 (
  snapshot_id uuid not null references public.promo_grouping_snapshots_v2(id) on delete cascade,
  card_id uuid not null,
  group_id text not null,
  promotion_family_id text not null check (length(btrim(promotion_family_id)) > 0),
  promotion_tier_keys text[] not null check (cardinality(promotion_tier_keys) > 0),
  primary key (snapshot_id, card_id),
  foreign key (snapshot_id, group_id)
    references public.promo_grouping_snapshot_groups_v2(snapshot_id, group_id)
    on delete cascade
);

alter table public.promo_test_admin_keys enable row level security;
alter table public.promo_source_datasets enable row level security;
alter table public.promo_source_cards enable row level security;
alter table public.promo_grouping_snapshots_v2 enable row level security;
alter table public.promo_grouping_snapshot_groups_v2 enable row level security;
alter table public.promo_grouping_card_assignments_v2 enable row level security;

revoke all on public.promo_test_admin_keys from anon, authenticated;
revoke all on public.promo_source_datasets from anon, authenticated;
revoke all on public.promo_source_cards from anon, authenticated;
revoke all on public.promo_grouping_snapshots_v2 from anon, authenticated;
revoke all on public.promo_grouping_snapshot_groups_v2 from anon, authenticated;
revoke all on public.promo_grouping_card_assignments_v2 from anon, authenticated;

create or replace function public.promo_test_key_is_valid(p_auth_hash text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.promo_test_admin_keys
    where auth_hash = p_auth_hash
      and active
  );
$$;

create or replace function public.load_promo_source_dataset_v2(
  p_dataset_id uuid,
  p_auth_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dataset public.promo_source_datasets%rowtype;
  v_actual_count integer;
  v_payload_count integer;
  v_payload_distinct_count integer;
begin
  if not public.promo_test_key_is_valid(p_auth_hash) then
    raise exception 'invalid_admin_key';
  end if;

  select * into v_dataset
  from public.promo_source_datasets
  where id = p_dataset_id;

  if not found then
    raise exception 'dataset_not_found';
  end if;

  select count(*) into v_actual_count
  from public.promo_source_cards
  where dataset_id = p_dataset_id;

  if v_actual_count <> v_dataset.card_count then
    raise exception 'source_dataset_card_count_mismatch:%/%', v_actual_count, v_dataset.card_count;
  end if;
  if v_dataset.dataset_payload #>> '{dataset,sourceDataset,datasetId}' is distinct from v_dataset.id::text
     or v_dataset.dataset_payload #>> '{dataset,sourceDataset,fingerprint}' is distinct from v_dataset.fingerprint
     or (v_dataset.dataset_payload #>> '{dataset,sourceDataset,revision}')::integer is distinct from v_dataset.source_revision
     or v_dataset.dataset_payload #>> '{dataset,sourceDataset,cardIdsHash}' is distinct from v_dataset.card_ids_hash
     or coalesce((v_dataset.dataset_payload #>> '{dataset,sourceDataset,persisted}')::boolean, false) is not true then
    raise exception 'source_dataset_manifest_payload_mismatch';
  end if;

  select count(*), count(distinct card_id)
  into v_payload_count, v_payload_distinct_count
  from (
    select item ->> 'id' as card_id
    from jsonb_array_elements(coalesce(v_dataset.dataset_payload #> '{dataset,cards}', '[]'::jsonb)) as item
    union all
    select item ->> 'cardId' as card_id
    from jsonb_array_elements(coalesce(v_dataset.dataset_payload -> 'quarantine', '[]'::jsonb)) as item
  ) payload_cards;

  if v_payload_count <> v_dataset.card_count or v_payload_distinct_count <> v_dataset.card_count then
    raise exception 'source_dataset_payload_card_count_mismatch:%/%', v_payload_count, v_dataset.card_count;
  end if;
  if exists (
    (select id::text from public.promo_source_cards where dataset_id = p_dataset_id)
    except
    (select item ->> 'id' from jsonb_array_elements(coalesce(v_dataset.dataset_payload #> '{dataset,cards}', '[]'::jsonb)) as item
     union all
     select item ->> 'cardId' from jsonb_array_elements(coalesce(v_dataset.dataset_payload -> 'quarantine', '[]'::jsonb)) as item)
  ) or exists (
    (select item ->> 'id' from jsonb_array_elements(coalesce(v_dataset.dataset_payload #> '{dataset,cards}', '[]'::jsonb)) as item
     union all
     select item ->> 'cardId' from jsonb_array_elements(coalesce(v_dataset.dataset_payload -> 'quarantine', '[]'::jsonb)) as item)
    except
    (select id::text from public.promo_source_cards where dataset_id = p_dataset_id)
  ) then
    raise exception 'source_dataset_payload_card_set_mismatch';
  end if;

  return jsonb_build_object('payload', v_dataset.dataset_payload);
end;
$$;

create or replace function public.load_promo_grouping_snapshot_v2(
  p_month_key text,
  p_dataset_id uuid,
  p_dataset_fingerprint text,
  p_dataset_revision integer,
  p_auth_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dataset public.promo_source_datasets%rowtype;
  v_snapshot public.promo_grouping_snapshots_v2%rowtype;
begin
  if not public.promo_test_key_is_valid(p_auth_hash) then
    raise exception 'invalid_admin_key';
  end if;

  select * into v_dataset
  from public.promo_source_datasets
  where id = p_dataset_id;

  if not found then
    raise exception 'dataset_not_found';
  end if;
  if v_dataset.month_key <> p_month_key then
    raise exception 'snapshot_month_mismatch';
  end if;
  if v_dataset.fingerprint <> p_dataset_fingerprint then
    raise exception 'snapshot_fingerprint_mismatch';
  end if;
  if v_dataset.source_revision <> p_dataset_revision then
    raise exception 'snapshot_dataset_revision_mismatch';
  end if;

  select * into v_snapshot
  from public.promo_grouping_snapshots_v2
  where dataset_id = p_dataset_id;

  if not found then
    return null;
  end if;

  return jsonb_build_object('snapshot', v_snapshot.snapshot_payload);
end;
$$;

create or replace function public.save_promo_grouping_snapshot_v2(
  p_snapshot jsonb,
  p_auth_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dataset public.promo_source_datasets%rowtype;
  v_existing public.promo_grouping_snapshots_v2%rowtype;
  v_dataset_id uuid;
  v_snapshot_id uuid;
  v_client_revision integer;
  v_next_revision integer;
  v_card_count integer;
  v_saved_at timestamptz := clock_timestamp();
  v_saved_payload jsonb;
  v_locked_group text;
  v_old_group jsonb;
  v_new_group jsonb;
  v_old_assignments jsonb;
  v_new_assignments jsonb;
begin
  if not public.promo_test_key_is_valid(p_auth_hash) then
    raise exception 'invalid_admin_key';
  end if;
  if p_snapshot ->> 'schema' <> 'promo-grouping-snapshot-v2' then
    raise exception 'grouping_snapshot_schema_invalid';
  end if;

  begin
    v_dataset_id := (p_snapshot ->> 'datasetId')::uuid;
    v_snapshot_id := (p_snapshot ->> 'snapshotId')::uuid;
    v_client_revision := (p_snapshot ->> 'revision')::integer;
    v_card_count := (p_snapshot ->> 'cardCount')::integer;
  exception when others then
    raise exception 'grouping_snapshot_scalar_invalid';
  end;

  select * into v_dataset
  from public.promo_source_datasets
  where id = v_dataset_id
  for update;

  if not found then
    raise exception 'dataset_not_found';
  end if;
  if p_snapshot ->> 'monthKey' <> v_dataset.month_key then
    raise exception 'snapshot_month_mismatch';
  end if;
  if p_snapshot ->> 'datasetFingerprint' <> v_dataset.fingerprint then
    raise exception 'snapshot_fingerprint_mismatch';
  end if;
  if (p_snapshot ->> 'datasetRevision')::integer <> v_dataset.source_revision then
    raise exception 'snapshot_dataset_revision_mismatch';
  end if;
  if p_snapshot ->> 'cardIdsHash' <> v_dataset.card_ids_hash then
    raise exception 'snapshot_card_hash_mismatch';
  end if;
  if v_card_count <> v_dataset.card_count then
    raise exception 'snapshot_card_count_mismatch:%/%', v_card_count, v_dataset.card_count;
  end if;
  if jsonb_typeof(p_snapshot -> 'groups') <> 'array'
     or jsonb_array_length(p_snapshot -> 'groups') = 0
     or jsonb_typeof(p_snapshot -> 'assignments') <> 'array'
     or jsonb_array_length(p_snapshot -> 'assignments') <> v_dataset.card_count then
    raise exception 'grouping_snapshot_incomplete';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_snapshot -> 'groups') as item
    where coalesce((item ->> 'confirmed')::boolean, false) is not true
       or coalesce((item ->> 'locked')::boolean, false) is not true
       or coalesce(item ->> 'skuId', '') !~* '^MASTER-[0-9a-f-]{36}$'
       or coalesce(item ->> 'groupId', '') = ''
  ) then
    raise exception 'group_not_confirmed_or_locked';
  end if;

  if (
    select count(distinct item ->> 'groupId')
    from jsonb_array_elements(p_snapshot -> 'groups') as item
  ) <> jsonb_array_length(p_snapshot -> 'groups') then
    raise exception 'group_id_invalid_or_duplicate';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_snapshot -> 'assignments') as item
    where coalesce(item ->> 'promotionFamilyId', '') = ''
       or jsonb_typeof(item -> 'promotionTierKeys') <> 'array'
       or jsonb_array_length(item -> 'promotionTierKeys') = 0
       or not exists (
         select 1
         from jsonb_array_elements(p_snapshot -> 'groups') as group_item
         where group_item ->> 'groupId' = item ->> 'groupId'
           and group_item ->> 'skuId' = item ->> 'skuId'
       )
  ) then
    raise exception 'card_group_or_promotion_invalid';
  end if;

  if (
    select count(distinct (item ->> 'cardId')::uuid)
    from jsonb_array_elements(p_snapshot -> 'assignments') as item
  ) <> v_dataset.card_count then
    raise exception 'card_id_invalid_or_duplicate';
  end if;

  if exists (
    (select id
     from public.promo_source_cards
     where dataset_id = v_dataset_id)
    except
    (select (item ->> 'cardId')::uuid
     from jsonb_array_elements(p_snapshot -> 'assignments') as item)
  ) or exists (
    (select (item ->> 'cardId')::uuid
     from jsonb_array_elements(p_snapshot -> 'assignments') as item)
    except
    (select id
     from public.promo_source_cards
     where dataset_id = v_dataset_id)
  ) then
    raise exception 'snapshot_card_set_mismatch';
  end if;

  select * into v_existing
  from public.promo_grouping_snapshots_v2
  where dataset_id = v_dataset_id
  for update;

  if found then
    if v_existing.id <> v_snapshot_id or v_existing.revision <> v_client_revision then
      raise exception 'snapshot_revision_conflict';
    end if;
    for v_locked_group in
      select group_id
      from public.promo_grouping_snapshot_groups_v2
      where snapshot_id = v_existing.id
        and locked
    loop
      select item into v_old_group
      from jsonb_array_elements(v_existing.snapshot_payload -> 'groups') as item
      where item ->> 'groupId' = v_locked_group
      limit 1;

      select item into v_new_group
      from jsonb_array_elements(p_snapshot -> 'groups') as item
      where item ->> 'groupId' = v_locked_group
      limit 1;

      select coalesce(jsonb_agg(item order by item ->> 'cardId'), '[]'::jsonb)
      into v_old_assignments
      from jsonb_array_elements(v_existing.snapshot_payload -> 'assignments') as item
      where item ->> 'groupId' = v_locked_group;

      select coalesce(jsonb_agg(item order by item ->> 'cardId'), '[]'::jsonb)
      into v_new_assignments
      from jsonb_array_elements(p_snapshot -> 'assignments') as item
      where item ->> 'groupId' = v_locked_group;

      if v_new_group is null
         or v_old_group is distinct from v_new_group
         or v_old_assignments is distinct from v_new_assignments then
        raise exception 'locked_group_changed:%', v_locked_group;
      end if;
    end loop;
    v_next_revision := v_existing.revision + 1;
    delete from public.promo_grouping_snapshots_v2 where id = v_existing.id;
  else
    if v_client_revision <> 0 then
      raise exception 'snapshot_revision_conflict';
    end if;
    v_next_revision := 1;
  end if;

  v_saved_payload := jsonb_set(
    jsonb_set(p_snapshot, '{revision}', to_jsonb(v_next_revision), false),
    '{savedAt}',
    to_jsonb(v_saved_at),
    false
  );

  insert into public.promo_grouping_snapshots_v2 (
    id, dataset_id, month_key, dataset_fingerprint, dataset_revision,
    card_ids_hash, revision, card_count, snapshot_payload, saved_at
  ) values (
    v_snapshot_id, v_dataset_id, v_dataset.month_key, v_dataset.fingerprint,
    v_dataset.source_revision, v_dataset.card_ids_hash, v_next_revision,
    v_dataset.card_count, v_saved_payload, v_saved_at
  );

  insert into public.promo_grouping_snapshot_groups_v2 (
    snapshot_id, group_id, master_product_id, confirmed, locked
  )
  select
    v_snapshot_id,
    item ->> 'groupId',
    replace(item ->> 'skuId', 'MASTER-', '')::uuid,
    true,
    true
  from jsonb_array_elements(p_snapshot -> 'groups') as item;

  insert into public.promo_grouping_card_assignments_v2 (
    snapshot_id, card_id, group_id, promotion_family_id, promotion_tier_keys
  )
  select
    v_snapshot_id,
    (item ->> 'cardId')::uuid,
    item ->> 'groupId',
    item ->> 'promotionFamilyId',
    array(select jsonb_array_elements_text(item -> 'promotionTierKeys'))
  from jsonb_array_elements(p_snapshot -> 'assignments') as item;

  return jsonb_build_object('snapshot', v_saved_payload);
end;
$$;

create or replace function public.unlock_promo_grouping_group_v2(
  p_dataset_id uuid,
  p_snapshot_id uuid,
  p_group_id text,
  p_expected_revision integer,
  p_auth_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_snapshot public.promo_grouping_snapshots_v2%rowtype;
  v_groups jsonb;
  v_saved_at timestamptz := clock_timestamp();
  v_saved_payload jsonb;
begin
  if not public.promo_test_key_is_valid(p_auth_hash) then
    raise exception 'invalid_admin_key';
  end if;

  select * into v_snapshot
  from public.promo_grouping_snapshots_v2
  where id = p_snapshot_id
    and dataset_id = p_dataset_id
  for update;

  if not found or v_snapshot.revision <> p_expected_revision then
    raise exception 'snapshot_revision_conflict';
  end if;
  if not exists (
    select 1
    from public.promo_grouping_snapshot_groups_v2
    where snapshot_id = p_snapshot_id
      and group_id = p_group_id
      and locked
  ) then
    raise exception 'snapshot_group_not_found_or_unlocked';
  end if;

  select jsonb_agg(
    case when item ->> 'groupId' = p_group_id
      then jsonb_set(jsonb_set(item, '{confirmed}', 'false'::jsonb), '{locked}', 'false'::jsonb)
      else item
    end
    order by item ->> 'groupId'
  ) into v_groups
  from jsonb_array_elements(v_snapshot.snapshot_payload -> 'groups') as item;

  v_saved_payload := jsonb_set(
    jsonb_set(
      jsonb_set(v_snapshot.snapshot_payload, '{groups}', v_groups, false),
      '{revision}',
      to_jsonb(v_snapshot.revision + 1),
      false
    ),
    '{savedAt}',
    to_jsonb(v_saved_at),
    false
  );

  update public.promo_grouping_snapshot_groups_v2
  set confirmed = false,
      locked = false
  where snapshot_id = p_snapshot_id
    and group_id = p_group_id;

  update public.promo_grouping_snapshots_v2
  set revision = revision + 1,
      snapshot_payload = v_saved_payload,
      saved_at = v_saved_at
  where id = p_snapshot_id;

  return jsonb_build_object('snapshot', v_saved_payload);
end;
$$;

revoke all on function public.promo_test_key_is_valid(text) from public;
revoke all on function public.load_promo_source_dataset_v2(uuid, text) from public;
revoke all on function public.load_promo_grouping_snapshot_v2(text, uuid, text, integer, text) from public;
revoke all on function public.save_promo_grouping_snapshot_v2(jsonb, text) from public;
revoke all on function public.unlock_promo_grouping_group_v2(uuid, uuid, text, integer, text) from public;

grant execute on function public.load_promo_source_dataset_v2(uuid, text) to anon, authenticated;
grant execute on function public.load_promo_grouping_snapshot_v2(text, uuid, text, integer, text) to anon, authenticated;
grant execute on function public.save_promo_grouping_snapshot_v2(jsonb, text) to anon, authenticated;
grant execute on function public.unlock_promo_grouping_group_v2(uuid, uuid, text, integer, text) to anon, authenticated;
