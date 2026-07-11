-- Expected result: every boolean is true.

select
  c.relrowsecurity as promo_upload_keys_rls_enabled,
  not has_table_privilege('anon', 'public.promo_upload_keys', 'select') as anon_cannot_read_upload_keys,
  not has_table_privilege('authenticated', 'public.promo_upload_keys', 'select') as authenticated_cannot_read_upload_keys
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'promo_upload_keys';

select
  not has_function_privilege('anon', 'public.doit_versions_single_active_guard()', 'execute') as anon_cannot_call_trigger_function,
  not has_function_privilege('authenticated', 'public.doit_versions_single_active_guard()', 'execute') as authenticated_cannot_call_trigger_function,
  not has_function_privilege('anon', 'public.set_doit_active_version(uuid)', 'execute') as anon_cannot_set_active_version,
  not has_function_privilege('authenticated', 'public.set_doit_active_version(uuid)', 'execute') as authenticated_cannot_set_active_version;

select
  has_table_privilege('anon', 'public.promo_cards_with_functions', 'select') as anon_can_read_promo_view,
  not has_table_privilege('anon', 'public.promo_cards_with_functions', 'insert') as anon_cannot_insert_promo_view,
  not has_table_privilege('anon', 'public.promo_cards_with_functions', 'update') as anon_cannot_update_promo_view,
  not has_table_privilege('anon', 'public.promo_cards_with_functions', 'delete') as anon_cannot_delete_promo_view;
