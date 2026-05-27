# Admin Upload Supabase Setup

This document is for the Admin Upload MVP.

## Required Supabase setup

Create a Supabase project, then create a Storage bucket named:

```text
doit-files
```

For the MVP test, the admin page expects these values:

```text
Supabase URL
Supabase anon public key
```

Do not paste a service_role key into the browser.

## SQL table

Run this table in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.doit_versions (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_size bigint default 0,
  storage_path text not null,
  row_count integer default 0,
  store_count integer default 0,
  ps_count integer default 0,
  telesale_bill_count integer default 0,
  total_qty numeric default 0,
  total_amount numeric default 0,
  status text default 'uploaded',
  is_active boolean default false,
  uploaded_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists doit_versions_active_idx on public.doit_versions (is_active);
create index if not exists doit_versions_uploaded_at_idx on public.doit_versions (uploaded_at desc);

alter table public.doit_versions enable row level security;

create policy doit_versions_select_anon
  on public.doit_versions for select
  using (true);

create policy doit_versions_insert_anon_testing
  on public.doit_versions for insert
  with check (true);

create policy doit_versions_update_anon_testing
  on public.doit_versions for update
  using (true)
  with check (true);
```

## Security note

The policies above are for MVP testing only. Production should use authenticated admin-only policies and an API endpoint instead of browser writes.
