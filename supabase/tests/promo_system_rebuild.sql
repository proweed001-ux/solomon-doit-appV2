begin;
select plan(16);

select has_table('public', 'promo_new_months');
select has_table('public', 'promo_new_versions');
select has_table('public', 'promo_new_skus');
select has_table('public', 'promo_new_sku_prices');
select has_table('public', 'promo_new_cards');
select has_table('public', 'promo_new_product_groups');
select has_table('public', 'promo_new_promotion_families');
select has_table('public', 'promo_new_promotion_tiers');
select has_table('public', 'promo_new_audit_log');

select ok(not has_table_privilege('anon', 'public.promo_new_cards', 'insert'), 'anon cannot insert cards');
select ok(not has_table_privilege('authenticated', 'public.promo_new_cards', 'update'), 'authenticated cannot update cards directly');
select ok(not has_table_privilege('anon', 'public.promo_new_skus', 'select'), 'anon cannot bypass published backend');
select has_function('public', 'promo_new_save_draft', array['jsonb','uuid','text']);
select has_function('public', 'promo_new_publish_version', array['uuid','uuid']);
select has_function('public', 'promo_new_rollback_version', array['text','uuid','uuid']);
select has_function('public', 'promo_new_get_published_catalog', array['text']);

select * from finish();
rollback;
