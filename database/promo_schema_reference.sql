-- Reference schema for Solomon Promo Admin.
-- The live Supabase project was migrated during setup. Use this file when recreating the database.

create table if not exists public.promo_months (
  id text primary key,
  label text not null,
  year_month text not null unique,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  source_pdf text,
  source_price_file text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.promo_classes (
  class_id text primary key,
  class_name text not null,
  description text,
  sort_order integer not null default 999,
  active boolean not null default true
);

create table if not exists public.promo_cards (
  card_id text primary key,
  promo_month_id text not null references public.promo_months(id) on delete cascade,
  class_id text not null references public.promo_classes(class_id),
  page_no integer,
  card_no integer,
  initiative_id text,
  promo_title text not null,
  raw_text text,
  promo_type text not null default 'discount',
  status text not null default 'need_review' check (status in ('ready','need_review','inactive','missing','changed','new','repeated')),
  image_url text,
  image_name text,
  source_file text,
  source_sheet text,
  barcodes text,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sku_master (
  sku_id text primary key,
  barcode text,
  brand text not null,
  product_name text not null,
  product_type text,
  variant text,
  size_text text,
  size_min numeric,
  size_max numeric,
  unit text,
  active boolean not null default true,
  source_file text,
  source_sheet text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sku_aliases (
  alias_id bigserial primary key,
  alias_text text not null,
  mapped_brand text,
  mapped_sku_id text references public.sku_master(sku_id) on delete set null,
  note text
);

create table if not exists public.card_skus (
  card_sku_id text primary key,
  card_id text not null references public.promo_cards(card_id) on delete cascade,
  sku_id text references public.sku_master(sku_id) on delete set null,
  brand_text text,
  product_text text,
  product_type text,
  size_text text,
  variant text,
  unit text,
  match_status text not null default 'not_found' check (match_status in ('matched','need_review','not_found','multi_match','manual')),
  match_method text,
  confidence numeric,
  note text,
  barcodes text,
  sort_order integer not null default 999
);

create table if not exists public.price_by_month (
  price_id text primary key,
  promo_month_id text not null references public.promo_months(id) on delete cascade,
  sku_id text not null references public.sku_master(sku_id) on delete cascade,
  brand text,
  product_name text,
  price numeric,
  price_status text not null default 'missing' check (price_status in ('found','missing','manual','conflict')),
  source_file text,
  source_sheet text,
  source_row integer,
  updated_at timestamptz not null default now(),
  unique(promo_month_id, sku_id)
);

create table if not exists public.promo_tiers (
  tier_id text primary key,
  card_id text not null references public.promo_cards(card_id) on delete cascade,
  tier_no integer not null default 1,
  min_qty_text text,
  min_qty numeric,
  max_qty numeric,
  unit text,
  discount_percent numeric,
  free_qty numeric,
  note text
);

create table if not exists public.review_queue (
  review_id text primary key,
  promo_month_id text not null references public.promo_months(id) on delete cascade,
  card_id text references public.promo_cards(card_id) on delete cascade,
  problem_type text not null,
  target_table text,
  raw_text text,
  suggestion text,
  fix_value text,
  status text not null default 'pending' check (status in ('pending','fixed','ignored')),
  note text,
  fixed_by uuid,
  fixed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now()
);

-- Required security model:
-- 1) Enable RLS on all promo tables.
-- 2) Public can select only published promo months and related cards/prices/tiers.
-- 3) Authenticated users listed in promo_admin_users can insert/update/delete.
-- See docs/PROMO_ADMIN_SETUP.md.
