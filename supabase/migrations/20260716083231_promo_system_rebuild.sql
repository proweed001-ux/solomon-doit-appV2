-- Promo System Rebuild v1
-- PREPARED ONLY. Do not run against Production without an explicit approval and backup.

create table if not exists public.promo_new_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists public.promo_new_months (
  id uuid primary key default gen_random_uuid(),
  month_key text not null unique check (month_key ~ '^[A-Z0-9][A-Z0-9_-]{2,31}$'),
  status text not null default 'imported' check (status in ('imported','processing','need_review','draft','ready','published','archived')),
  active_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_new_versions (
  id uuid primary key default gen_random_uuid(),
  month_id uuid not null references public.promo_new_months(id) on delete restrict,
  revision integer not null check (revision > 0),
  status text not null check (status in ('imported','processing','need_review','draft','ready','published','archived')),
  previous_version_id uuid references public.promo_new_versions(id) on delete set null,
  source_pdf_name text,
  source_workbook_name text,
  source_pdf_hash text,
  source_workbook_hash text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (month_id, revision)
);

alter table public.promo_new_months
  add constraint promo_new_months_active_version_fk
  foreign key (active_version_id) references public.promo_new_versions(id) on delete set null;

create table if not exists public.promo_new_skus (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  sku_code text not null unique,
  canonical_name text not null,
  identity_key text not null unique,
  brand text not null,
  product_type text not null,
  variant text,
  size_value numeric(12,3) not null check (size_value > 0),
  size_unit text not null,
  sales_unit text not null,
  pack_quantity integer not null default 1 check (pack_quantity > 0),
  status text not null default 'active' check (status in ('active','candidate','quarantine')),
  evidence jsonb not null default '[]'::jsonb,
  failure_reasons jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_new_sku_prices (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references public.promo_new_skus(id) on delete restrict,
  pdf_source_price numeric(12,2) check (pdf_source_price is null or pdf_source_price > 0),
  central_override_price numeric(12,2) check (central_override_price is null or central_override_price > 0),
  effective_price numeric(12,2) generated always as (coalesce(central_override_price, pdf_source_price)) stored,
  currency text not null default 'THB' check (currency = 'THB'),
  source text not null check (source in ('pdf','central_override','missing')),
  source_reference text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  unique (sku_id)
);

create table if not exists public.promo_new_promotion_families (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.promo_new_versions(id) on delete cascade,
  external_id text not null,
  family_key text not null,
  name text not null,
  scope_text text not null,
  source_rows jsonb not null default '[]'::jsonb,
  failure_reasons jsonb not null default '[]'::jsonb,
  unique (version_id, external_id),
  unique (version_id, family_key)
);

create table if not exists public.promo_new_promotion_tiers (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.promo_new_promotion_families(id) on delete cascade,
  class_id text not null,
  tier_no integer not null check (tier_no > 0),
  tier_type text not null check (tier_type in ('cash_discount','free_goods','bundle_price')),
  min_quantity numeric(12,3) not null check (min_quantity > 0),
  max_quantity numeric(12,3) check (max_quantity is null or max_quantity >= min_quantity),
  purchase_unit text not null,
  discount_percent numeric(7,4) check (discount_percent is null or (discount_percent > 0 and discount_percent <= 100)),
  free_quantity numeric(12,3) not null default 0 check (free_quantity >= 0),
  reward_unit text,
  bundle_price numeric(12,2) check (bundle_price is null or bundle_price > 0),
  effective_percent numeric(7,4),
  effective_percent_usage text check (effective_percent_usage is null or effective_percent_usage = 'display_only'),
  source_text text not null,
  unique (family_id, class_id, tier_no),
  check (tier_type <> 'free_goods' or (free_quantity > 0 and effective_percent_usage = 'display_only')),
  check (tier_type <> 'cash_discount' or discount_percent is not null)
);

create table if not exists public.promo_new_product_groups (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.promo_new_versions(id) on delete cascade,
  external_id text not null,
  month_id uuid not null references public.promo_new_months(id) on delete restrict,
  sku_id uuid not null references public.promo_new_skus(id) on delete restrict,
  promotion_family_id uuid references public.promo_new_promotion_families(id) on delete restrict,
  status text not null check (status in ('ready','need_review','blocked')),
  failure_reasons jsonb not null default '[]'::jsonb,
  unique (version_id, external_id),
  unique (version_id, sku_id)
);

create table if not exists public.promo_new_cards (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.promo_new_versions(id) on delete cascade,
  card_id text not null,
  month_id uuid not null references public.promo_new_months(id) on delete restrict,
  page_number integer not null check (page_number > 0),
  sequence_number integer not null check (sequence_number > 0),
  class_id text not null,
  image_path text,
  sku_id uuid not null references public.promo_new_skus(id) on delete restrict,
  product_group_id uuid not null references public.promo_new_product_groups(id) on delete restrict,
  promotion_family_id uuid references public.promo_new_promotion_families(id) on delete restrict,
  pdf_source_price numeric(12,2),
  central_override_price numeric(12,2),
  effective_price numeric(12,2) check (effective_price is null or effective_price > 0),
  status text not null check (status in ('ready','need_review','quarantine')),
  evidence jsonb not null default '{}'::jsonb,
  failure_reasons jsonb not null default '[]'::jsonb,
  unique (version_id, card_id),
  unique (version_id, page_number, sequence_number)
);

create table if not exists public.promo_new_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now()
);

create index if not exists promo_new_cards_version_class_idx on public.promo_new_cards(version_id, class_id);
create index if not exists promo_new_cards_sku_idx on public.promo_new_cards(sku_id);
create index if not exists promo_new_cards_group_class_idx on public.promo_new_cards(product_group_id, class_id);
create index if not exists promo_new_groups_version_idx on public.promo_new_product_groups(version_id);
create index if not exists promo_new_tiers_family_class_idx on public.promo_new_promotion_tiers(family_id, class_id, min_quantity);
create index if not exists promo_new_audit_entity_idx on public.promo_new_audit_log(entity_type, entity_id, created_at desc);

alter table public.promo_new_admins enable row level security;
alter table public.promo_new_months enable row level security;
alter table public.promo_new_versions enable row level security;
alter table public.promo_new_skus enable row level security;
alter table public.promo_new_sku_prices enable row level security;
alter table public.promo_new_promotion_families enable row level security;
alter table public.promo_new_promotion_tiers enable row level security;
alter table public.promo_new_product_groups enable row level security;
alter table public.promo_new_cards enable row level security;
alter table public.promo_new_audit_log enable row level security;

revoke all on table public.promo_new_admins from public, anon, authenticated;
revoke all on table public.promo_new_months from public, anon, authenticated;
revoke all on table public.promo_new_versions from public, anon, authenticated;
revoke all on table public.promo_new_skus from public, anon, authenticated;
revoke all on table public.promo_new_sku_prices from public, anon, authenticated;
revoke all on table public.promo_new_promotion_families from public, anon, authenticated;
revoke all on table public.promo_new_promotion_tiers from public, anon, authenticated;
revoke all on table public.promo_new_product_groups from public, anon, authenticated;
revoke all on table public.promo_new_cards from public, anon, authenticated;
revoke all on table public.promo_new_audit_log from public, anon, authenticated;

grant select, insert, update, delete on table public.promo_new_admins to service_role;
grant select, insert, update, delete on table public.promo_new_months to service_role;
grant select, insert, update, delete on table public.promo_new_versions to service_role;
grant select, insert, update, delete on table public.promo_new_skus to service_role;
grant select, insert, update, delete on table public.promo_new_sku_prices to service_role;
grant select, insert, update, delete on table public.promo_new_promotion_families to service_role;
grant select, insert, update, delete on table public.promo_new_promotion_tiers to service_role;
grant select, insert, update, delete on table public.promo_new_product_groups to service_role;
grant select, insert, update, delete on table public.promo_new_cards to service_role;
grant select, insert, update, delete on table public.promo_new_audit_log to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('promo-new-cards', 'promo-new-cards', true, 1500000, array['image/webp','image/png','image/jpeg'])
on conflict (id) do nothing;

create or replace function public.promo_new_save_draft(
  p_payload jsonb,
  p_actor_id uuid,
  p_expected_month_key text
) returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_month_id uuid;
  v_version_id uuid := nullif(p_payload #>> '{version,id}', '')::uuid;
  v_revision integer;
  v_previous uuid;
  v_item jsonb;
  v_sku_id uuid;
  v_family_id uuid;
  v_group_id uuid;
  v_month_key text := upper(trim(p_payload #>> '{version,monthKey}'));
begin
  if p_payload->>'schema' <> 'promo-system-rebuild-v1' then raise exception 'dataset_schema_invalid'; end if;
  if v_version_id is null then raise exception 'version_id_invalid'; end if;
  if v_month_key is null or v_month_key <> upper(trim(p_expected_month_key)) or v_month_key !~ '^[A-Z0-9][A-Z0-9_-]{2,31}$' then raise exception 'month_key_invalid'; end if;
  if not exists (select 1 from public.promo_new_admins where user_id = p_actor_id and active) then raise exception 'promo_admin_required'; end if;

  insert into public.promo_new_months(month_key, status)
  values (v_month_key, 'processing')
  on conflict (month_key) do update set status = 'processing', updated_at = now()
  returning id, active_version_id into v_month_id, v_previous;

  select coalesce(max(revision), 0) + 1 into v_revision from public.promo_new_versions where month_id = v_month_id;
  insert into public.promo_new_versions(
    id, month_id, revision, status, previous_version_id, source_pdf_name, source_workbook_name,
    source_pdf_hash, source_workbook_hash, created_by
  ) values (
    v_version_id, v_month_id, v_revision, 'draft', v_previous,
    p_payload #>> '{version,source,pdfName}', p_payload #>> '{version,source,workbookName}',
    p_payload #>> '{version,source,pdfHash}', p_payload #>> '{version,source,workbookHash}', p_actor_id
  );

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'skus', '[]'::jsonb)) loop
    insert into public.promo_new_skus(
      external_id, sku_code, canonical_name, identity_key, brand, product_type, variant,
      size_value, size_unit, sales_unit, pack_quantity, status, evidence, failure_reasons, created_by, updated_by
    ) values (
      v_item->>'id', v_item->>'code', v_item->>'canonicalName', v_item->>'identityKey',
      v_item #>> '{identity,brand}', v_item #>> '{identity,productType}', nullif(v_item #>> '{identity,variant}', ''),
      (v_item #>> '{identity,sizeValue}')::numeric, v_item #>> '{identity,sizeUnit}', v_item #>> '{identity,salesUnit}',
      (v_item #>> '{identity,packQuantity}')::integer, v_item->>'status', coalesce(v_item->'evidence','[]'::jsonb),
      coalesce(v_item->'failureReasons','[]'::jsonb), p_actor_id, p_actor_id
    )
    on conflict (identity_key) do update set
      canonical_name = excluded.canonical_name, sku_code = excluded.sku_code, evidence = excluded.evidence,
      failure_reasons = excluded.failure_reasons, updated_by = p_actor_id, updated_at = now();
    insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, after_value)
    values (p_actor_id, 'sku_upserted', 'sku', v_item->>'id', v_item);
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'prices', '[]'::jsonb)) loop
    select id into v_sku_id from public.promo_new_skus where external_id = v_item->>'skuId' or identity_key = (
      select s->>'identityKey' from jsonb_array_elements(p_payload->'skus') s where s->>'id' = v_item->>'skuId' limit 1
    );
    if v_sku_id is null then raise exception 'price_sku_not_found'; end if;
    insert into public.promo_new_sku_prices(
      sku_id, pdf_source_price, central_override_price, currency, source, source_reference, updated_by
    ) values (
      v_sku_id, nullif(v_item #>> '{pdfSourcePrice,amount}','')::numeric,
      nullif(v_item #>> '{centralOverridePrice,amount}','')::numeric, 'THB', v_item->>'source',
      v_item->>'sourceReference', p_actor_id
    ) on conflict (sku_id) do update set
      pdf_source_price = excluded.pdf_source_price,
      central_override_price = excluded.central_override_price,
      source = excluded.source,
      source_reference = excluded.source_reference,
      updated_by = p_actor_id,
      updated_at = now();
    insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, after_value)
    values (p_actor_id, 'sku_price_changed', 'sku_price', v_sku_id::text, v_item);
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'promotionFamilies', '[]'::jsonb)) loop
    insert into public.promo_new_promotion_families(
      version_id, external_id, family_key, name, scope_text, source_rows, failure_reasons
    ) values (
      v_version_id, v_item->>'id', v_item->>'familyKey', v_item->>'name', v_item->>'scopeText',
      coalesce(v_item->'sourceRows','[]'::jsonb), coalesce(v_item->'failureReasons','[]'::jsonb)
    ) returning id into v_family_id;

    insert into public.promo_new_promotion_tiers(
      family_id, class_id, tier_no, tier_type, min_quantity, max_quantity, purchase_unit,
      discount_percent, free_quantity, reward_unit, bundle_price, effective_percent,
      effective_percent_usage, source_text
    )
    select
      v_family_id, class_entry.key, (tier->>'tierNo')::integer, tier->>'type',
      (tier->>'minQuantity')::numeric, nullif(tier->>'maxQuantity','')::numeric, tier->>'purchaseUnit',
      nullif(tier->>'discountPercent','')::numeric, coalesce((tier->>'freeQuantity')::numeric,0),
      nullif(tier->>'rewardUnit',''), nullif(tier #>> '{bundlePrice,amount}','')::numeric,
      nullif(tier->>'effectivePercent','')::numeric, nullif(tier->>'effectivePercentUsage',''), tier->>'sourceText'
    from jsonb_each(coalesce(v_item->'tiersByClass','{}'::jsonb)) class_entry
    cross join lateral jsonb_array_elements(class_entry.value) tier;
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'productGroups', '[]'::jsonb)) loop
    select id into v_sku_id from public.promo_new_skus where external_id = v_item->>'skuId' or identity_key = (v_item #>> '{sku,identityKey}') limit 1;
    select id into v_family_id from public.promo_new_promotion_families where version_id = v_version_id and external_id = v_item->>'promotionFamilyId';
    if v_sku_id is null then raise exception 'group_sku_missing'; end if;
    insert into public.promo_new_product_groups(
      version_id, external_id, month_id, sku_id, promotion_family_id, status, failure_reasons
    ) values (
      v_version_id, v_item->>'id', v_month_id, v_sku_id, v_family_id,
      v_item->>'status', coalesce(v_item->'failureReasons','[]'::jsonb)
    );
    insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, after_value)
    values (p_actor_id, 'promotion_assigned', 'product_group', v_item->>'id', jsonb_build_object(
      'promotion_family_id', v_item->>'promotionFamilyId', 'status', v_item->>'status'
    ));
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'cards', '[]'::jsonb)) loop
    if upper(v_item->>'monthKey') <> v_month_key then raise exception 'card_crosses_month'; end if;
    select id into v_sku_id from public.promo_new_skus where external_id = v_item->>'skuId' limit 1;
    select id, promotion_family_id into v_group_id, v_family_id from public.promo_new_product_groups where version_id = v_version_id and external_id = v_item->>'productGroupId';
    if v_sku_id is null or v_group_id is null then raise exception 'card_reference_missing'; end if;
    insert into public.promo_new_cards(
      version_id, card_id, month_id, page_number, sequence_number, class_id, image_path,
      sku_id, product_group_id, promotion_family_id, pdf_source_price, central_override_price,
      effective_price, status, evidence, failure_reasons
    ) values (
      v_version_id, v_item->>'id', v_month_id, (v_item->>'page')::integer, (v_item->>'sequence')::integer,
      v_item->>'classId', nullif(v_item->>'imageUrl',''), v_sku_id, v_group_id, v_family_id,
      nullif(v_item #>> '{price,pdfSourcePrice,amount}','')::numeric,
      nullif(v_item #>> '{price,centralOverridePrice,amount}','')::numeric,
      nullif(v_item #>> '{price,effectivePrice,amount}','')::numeric,
      v_item->>'status', coalesce(v_item->'evidence','{}'::jsonb), coalesce(v_item->'failureReasons','[]'::jsonb)
    );
  end loop;

  update public.promo_new_months set status = 'draft', updated_at = now() where id = v_month_id;
  insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, after_value)
  values (p_actor_id, 'draft_saved', 'version', v_version_id::text, jsonb_build_object('month_key',v_month_key,'revision',v_revision));
  return jsonb_build_object('version_id',v_version_id,'month_key',v_month_key,'revision',v_revision,'status','draft');
end;
$$;

create or replace function public.promo_new_publish_version(p_version_id uuid, p_actor_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_month_id uuid;
  v_month_key text;
  v_previous uuid;
begin
  if not exists (select 1 from public.promo_new_admins where user_id = p_actor_id and active) then raise exception 'promo_admin_required'; end if;
  select v.month_id, m.month_key, m.active_version_id into v_month_id, v_month_key, v_previous
  from public.promo_new_versions v join public.promo_new_months m on m.id = v.month_id
  where v.id = p_version_id and v.status in ('draft','ready') for update;
  if v_month_id is null then raise exception 'publish_version_not_found'; end if;
  if exists (select 1 from public.promo_new_cards where version_id = p_version_id and (status <> 'ready' or effective_price is null)) then raise exception 'publish_cards_not_ready'; end if;
  if exists (select 1 from public.promo_new_product_groups where version_id = p_version_id and status <> 'ready') then raise exception 'publish_groups_not_ready'; end if;
  if exists (
    select 1 from public.promo_new_cards c
    where c.version_id = p_version_id and not exists (
      select 1 from public.promo_new_promotion_tiers t where t.family_id = c.promotion_family_id and t.class_id = c.class_id
    )
  ) then raise exception 'publish_class_tiers_missing'; end if;

  if v_previous is not null and v_previous <> p_version_id then
    update public.promo_new_versions set status = 'archived' where id = v_previous;
  end if;
  update public.promo_new_versions set status = 'published', previous_version_id = v_previous, published_at = now() where id = p_version_id;
  update public.promo_new_months set status = 'published', active_version_id = p_version_id, updated_at = now() where id = v_month_id;
  insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, before_value, after_value)
  values (p_actor_id, 'published', 'version', p_version_id::text, jsonb_build_object('previous_version_id',v_previous), jsonb_build_object('month_key',v_month_key));
  return jsonb_build_object('version_id',p_version_id,'month_key',v_month_key,'status','published','previous_version_id',v_previous);
end;
$$;

create or replace function public.promo_new_rollback_version(p_month_key text, p_target_version_id uuid, p_actor_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_month_id uuid;
  v_current uuid;
begin
  if not exists (select 1 from public.promo_new_admins where user_id = p_actor_id and active) then raise exception 'promo_admin_required'; end if;
  select id, active_version_id into v_month_id, v_current from public.promo_new_months where month_key = upper(trim(p_month_key)) for update;
  if v_month_id is null then raise exception 'rollback_month_not_found'; end if;
  if not exists (select 1 from public.promo_new_versions where id = p_target_version_id and month_id = v_month_id and status in ('published','archived')) then raise exception 'rollback_target_invalid'; end if;
  if v_current is not null and v_current <> p_target_version_id then update public.promo_new_versions set status = 'archived' where id = v_current; end if;
  update public.promo_new_versions set status = 'published', published_at = coalesce(published_at,now()) where id = p_target_version_id;
  update public.promo_new_months set active_version_id = p_target_version_id, status = 'published', updated_at = now() where id = v_month_id;
  insert into public.promo_new_audit_log(actor_id, action, entity_type, entity_id, before_value, after_value)
  values (p_actor_id, 'rollback', 'version', p_target_version_id::text, jsonb_build_object('from',v_current), jsonb_build_object('to',p_target_version_id));
  return jsonb_build_object('month_key',upper(trim(p_month_key)),'version_id',p_target_version_id,'status','published','replaced_version_id',v_current);
end;
$$;

create or replace function public.promo_new_get_published_catalog(p_month_key text default null)
returns jsonb
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  with chosen as (
    select v.id as version_id, v.revision, m.id as month_id, m.month_key, v.published_at
    from public.promo_new_months m
    join public.promo_new_versions v on v.id = m.active_version_id and v.status = 'published'
    where p_month_key is null or m.month_key = upper(trim(p_month_key))
    order by v.published_at desc nulls last, m.month_key desc
    limit 1
  )
  select case when not exists(select 1 from chosen) then null else jsonb_build_object(
    'schema','promo-system-rebuild-v1',
    'version',jsonb_build_object(
      'id',chosen.version_id,'monthKey',chosen.month_key,'revision',chosen.revision,'status','published','publishedAt',chosen.published_at
    ),
    'skus',coalesce((select jsonb_agg(jsonb_build_object(
      'id',s.external_id,'code',s.sku_code,'canonicalName',s.canonical_name,'identityKey',s.identity_key,
      'identity',jsonb_build_object('brand',s.brand,'productType',s.product_type,'variant',s.variant,'sizeValue',s.size_value,'sizeUnit',s.size_unit,'salesUnit',s.sales_unit,'packQuantity',s.pack_quantity),
      'status',s.status,'evidence',s.evidence,'failureReasons',s.failure_reasons
    ) order by s.canonical_name) from public.promo_new_skus s where exists(select 1 from public.promo_new_cards c where c.version_id=chosen.version_id and c.sku_id=s.id)),'[]'::jsonb),
    'prices',coalesce((select jsonb_agg(jsonb_build_object(
      'skuId',s.external_id,'pdfSourcePrice',case when p.pdf_source_price is null then null else jsonb_build_object('amount',p.pdf_source_price,'currency','THB') end,
      'centralOverridePrice',case when p.central_override_price is null then null else jsonb_build_object('amount',p.central_override_price,'currency','THB') end,
      'effectivePrice',jsonb_build_object('amount',p.effective_price,'currency','THB'),'source',p.source,'sourceReference',p.source_reference,'updatedAt',p.updated_at
    )) from public.promo_new_sku_prices p join public.promo_new_skus s on s.id=p.sku_id where exists(select 1 from public.promo_new_cards c where c.version_id=chosen.version_id and c.sku_id=s.id)),'[]'::jsonb),
    'promotionFamilies',coalesce((select jsonb_agg(jsonb_build_object(
      'id',f.external_id,'familyKey',f.family_key,'name',f.name,'scopeText',f.scope_text,'sourceRows',f.source_rows,'failureReasons',f.failure_reasons,
      'tiersByClass',(select coalesce(jsonb_object_agg(x.class_id,x.tiers),'{}'::jsonb) from (
        select t.class_id,jsonb_agg(jsonb_build_object(
          'tierNo',t.tier_no,'type',t.tier_type,'minQuantity',t.min_quantity,'maxQuantity',t.max_quantity,'purchaseUnit',t.purchase_unit,
          'discountPercent',t.discount_percent,'freeQuantity',t.free_quantity,'rewardUnit',t.reward_unit,
          'bundlePrice',case when t.bundle_price is null then null else jsonb_build_object('amount',t.bundle_price,'currency','THB') end,
          'effectivePercent',t.effective_percent,'effectivePercentUsage',t.effective_percent_usage,'sourceText',t.source_text
        ) order by t.tier_no) tiers from public.promo_new_promotion_tiers t where t.family_id=f.id group by t.class_id
      ) x)
    ) order by f.name) from public.promo_new_promotion_families f where f.version_id=chosen.version_id),'[]'::jsonb),
    'productGroups',coalesce((select jsonb_agg(jsonb_build_object(
      'id',g.external_id,'monthKey',chosen.month_key,'skuId',s.external_id,
      'cardIds',(select coalesce(jsonb_agg(c.card_id order by c.class_id),'[]'::jsonb) from public.promo_new_cards c where c.product_group_id=g.id),
      'classIds',(select coalesce(jsonb_agg(distinct c.class_id order by c.class_id),'[]'::jsonb) from public.promo_new_cards c where c.product_group_id=g.id),
      'promotionFamilyId',f.external_id,'status',g.status,'failureReasons',g.failure_reasons
    ) order by s.canonical_name) from public.promo_new_product_groups g join public.promo_new_skus s on s.id=g.sku_id left join public.promo_new_promotion_families f on f.id=g.promotion_family_id where g.version_id=chosen.version_id),'[]'::jsonb),
    'cards',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.card_id,'monthKey',chosen.month_key,'page',c.page_number,'sequence',c.sequence_number,'classId',c.class_id,
      'imageUrl',c.image_path,'skuId',s.external_id,'productGroupId',g.external_id,'promotionFamilyId',f.external_id,
      'promotionTiers',(select coalesce(jsonb_agg(jsonb_build_object(
        'tierNo',t.tier_no,'type',t.tier_type,'minQuantity',t.min_quantity,'maxQuantity',t.max_quantity,'purchaseUnit',t.purchase_unit,
        'discountPercent',t.discount_percent,'freeQuantity',t.free_quantity,'rewardUnit',t.reward_unit,
        'bundlePrice',case when t.bundle_price is null then null else jsonb_build_object('amount',t.bundle_price,'currency','THB') end,
        'effectivePercent',t.effective_percent,'effectivePercentUsage',t.effective_percent_usage,'sourceText',t.source_text
      ) order by t.tier_no),'[]'::jsonb) from public.promo_new_promotion_tiers t where t.family_id=c.promotion_family_id and t.class_id=c.class_id),
      'price',jsonb_build_object(
        'skuId',s.external_id,
        'pdfSourcePrice',case when c.pdf_source_price is null then null else jsonb_build_object('amount',c.pdf_source_price,'currency','THB') end,
        'centralOverridePrice',case when c.central_override_price is null then null else jsonb_build_object('amount',c.central_override_price,'currency','THB') end,
        'effectivePrice',jsonb_build_object('amount',c.effective_price,'currency','THB'),
        'source',case when c.central_override_price is not null then 'central_override' else 'pdf' end,
        'sourceReference','published_version','updatedAt',chosen.published_at
      ),
      'status',c.status,'evidence',c.evidence,'failureReasons',c.failure_reasons
    ) order by c.class_id,c.page_number,c.sequence_number) from public.promo_new_cards c join public.promo_new_skus s on s.id=c.sku_id join public.promo_new_product_groups g on g.id=c.product_group_id join public.promo_new_promotion_families f on f.id=c.promotion_family_id where c.version_id=chosen.version_id),'[]'::jsonb),
    'warnings','[]'::jsonb
  ) end
  from chosen;
$$;

revoke all on function public.promo_new_save_draft(jsonb,uuid,text) from public, anon, authenticated;
revoke all on function public.promo_new_publish_version(uuid,uuid) from public, anon, authenticated;
revoke all on function public.promo_new_rollback_version(text,uuid,uuid) from public, anon, authenticated;
revoke all on function public.promo_new_get_published_catalog(text) from public, anon, authenticated;
grant execute on function public.promo_new_save_draft(jsonb,uuid,text) to service_role;
grant execute on function public.promo_new_publish_version(uuid,uuid) to service_role;
grant execute on function public.promo_new_rollback_version(text,uuid,uuid) to service_role;
grant execute on function public.promo_new_get_published_catalog(text) to service_role;
