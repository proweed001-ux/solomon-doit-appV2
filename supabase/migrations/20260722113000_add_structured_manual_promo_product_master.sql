alter table public.promo_product_master
  add column if not exists brand text,
  add column if not exists product_type text,
  add column if not exists variant text,
  add column if not exists size_value numeric,
  add column if not exists size_unit text,
  add column if not exists sales_unit text not null default 'ชิ้น',
  add column if not exists pack_quantity integer not null default 1;

alter table public.promo_product_master
  drop constraint if exists promo_product_master_pack_quantity_check;

alter table public.promo_product_master
  add constraint promo_product_master_pack_quantity_check
  check (pack_quantity between 1 and 999);

create or replace function public.create_promo_master_product(
  p_canonical_name text,
  p_normalized_key text,
  p_unit_label text,
  p_brand text,
  p_product_type text,
  p_variant text,
  p_size_value numeric,
  p_size_unit text,
  p_sales_unit text,
  p_pack_quantity integer,
  p_aliases jsonb,
  p_auth_hash text
)
returns table(
  master_product_id uuid,
  canonical_name text,
  normalized_key text,
  unit_label text,
  status text,
  brand text,
  product_type text,
  variant text,
  size_value numeric,
  size_unit text,
  sales_unit text,
  pack_quantity integer,
  created boolean
)
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_name text := btrim(regexp_replace(coalesce(p_canonical_name, ''), '\s+', ' ', 'g'));
  v_key text := lower(btrim(coalesce(p_normalized_key, '')));
  v_unit text := btrim(coalesce(p_unit_label, ''));
  v_brand text := btrim(regexp_replace(coalesce(p_brand, ''), '\s+', ' ', 'g'));
  v_type text := btrim(regexp_replace(coalesce(p_product_type, ''), '\s+', ' ', 'g'));
  v_variant text := nullif(btrim(regexp_replace(coalesce(p_variant, ''), '\s+', ' ', 'g')), '');
  v_size_unit text := btrim(coalesce(p_size_unit, ''));
  v_sales_unit text := btrim(coalesce(p_sales_unit, ''));
  v_pack integer := coalesce(p_pack_quantity, 1);
  v_hash text := lower(btrim(coalesce(p_auth_hash, '')));
  v_id uuid;
  v_created boolean := false;
  v_alias text;
  v_alias_key text;
begin
  if length(v_name) < 3 or length(v_name) > 240 then
    raise exception using errcode = '22023', message = 'invalid_canonical_name';
  end if;
  if v_key = '' then
    v_key := regexp_replace(lower(v_name), '[^a-z0-9ก-๙]+', '', 'g');
  else
    v_key := regexp_replace(v_key, '[^a-z0-9ก-๙]+', '', 'g');
  end if;
  if length(v_key) < 3 or length(v_key) > 240 then
    raise exception using errcode = '22023', message = 'invalid_normalized_key';
  end if;
  if v_unit not in ('ชิ้น','ขวด','แพ็ค','กล่อง','ลัง','ซอง','ด้าม','ถุง','ชุด') then
    raise exception using errcode = '22023', message = 'invalid_unit';
  end if;
  if v_sales_unit not in ('ชิ้น','ขวด','แพ็ค','กล่อง','ลัง','ซอง','ด้าม','ถุง','ชุด') then
    raise exception using errcode = '22023', message = 'invalid_sales_unit';
  end if;
  if v_brand = '' or length(v_brand) > 120 then
    raise exception using errcode = '22023', message = 'invalid_brand';
  end if;
  if v_type = '' or length(v_type) > 160 then
    raise exception using errcode = '22023', message = 'invalid_product_type';
  end if;
  if p_size_value is not null and (p_size_value < 0 or p_size_value > 1000000) then
    raise exception using errcode = '22023', message = 'invalid_size_value';
  end if;
  if v_pack < 1 or v_pack > 999 then
    raise exception using errcode = '22023', message = 'invalid_pack_quantity';
  end if;
  if v_hash !~ '^[0-9a-f]{64}$' or not public.is_valid_promo_key_hash(v_hash) then
    raise exception using errcode = '42501', message = 'invalid_admin_key';
  end if;

  select m.master_product_id
    into v_id
  from public.promo_product_master m
  where m.normalized_key = v_key
  for update;

  if v_id is null then
    insert into public.promo_product_master(
      canonical_name, normalized_key, unit_label, status,
      created_from_month, created_from_group_id,
      brand, product_type, variant, size_value, size_unit, sales_unit, pack_quantity,
      created_at, updated_at
    ) values (
      v_name, v_key, v_unit, 'active',
      'MANUAL', null,
      v_brand, v_type, v_variant, nullif(p_size_value, 0), nullif(v_size_unit, ''), v_sales_unit, v_pack,
      clock_timestamp(), clock_timestamp()
    )
    returning promo_product_master.master_product_id into v_id;
    v_created := true;
  else
    update public.promo_product_master m
    set canonical_name = v_name,
        unit_label = v_unit,
        status = 'active',
        brand = v_brand,
        product_type = v_type,
        variant = v_variant,
        size_value = nullif(p_size_value, 0),
        size_unit = nullif(v_size_unit, ''),
        sales_unit = v_sales_unit,
        pack_quantity = v_pack,
        updated_at = clock_timestamp()
    where m.master_product_id = v_id;
  end if;

  if jsonb_typeof(coalesce(p_aliases, '[]'::jsonb)) = 'array' then
    for v_alias in select jsonb_array_elements_text(coalesce(p_aliases, '[]'::jsonb))
    loop
      v_alias := btrim(regexp_replace(coalesce(v_alias, ''), '\s+', ' ', 'g'));
      v_alias_key := regexp_replace(lower(v_alias), '[^a-z0-9ก-๙]+', '', 'g');
      if length(v_alias) between 2 and 240 and length(v_alias_key) between 2 and 240 then
        insert into public.promo_product_master_aliases(master_product_id, alias_text, normalized_alias)
        values (v_id, v_alias, v_alias_key)
        on conflict (normalized_alias) do nothing;
      end if;
    end loop;
  end if;

  insert into public.promo_product_master_aliases(master_product_id, alias_text, normalized_alias)
  values (v_id, v_name, v_key)
  on conflict (normalized_alias) do nothing;

  return query
  select m.master_product_id, m.canonical_name, m.normalized_key, m.unit_label, m.status,
         m.brand, m.product_type, m.variant, m.size_value, m.size_unit, m.sales_unit, m.pack_quantity,
         v_created
  from public.promo_product_master m
  where m.master_product_id = v_id;
end;
$function$;

revoke all on function public.create_promo_master_product(text,text,text,text,text,text,numeric,text,text,integer,jsonb,text) from public;
grant execute on function public.create_promo_master_product(text,text,text,text,text,text,numeric,text,text,integer,jsonb,text) to anon, authenticated, service_role;
