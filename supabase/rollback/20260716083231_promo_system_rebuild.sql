-- Promo System Rebuild v1 rollback
-- PREPARED ONLY. This removes the new isolated schema objects and must not be run without approval.

drop function if exists public.promo_new_get_published_catalog(text);
drop function if exists public.promo_new_rollback_version(text,uuid,uuid);
drop function if exists public.promo_new_publish_version(uuid,uuid);
drop function if exists public.promo_new_save_draft(jsonb,uuid,text);

drop table if exists public.promo_new_audit_log;
drop table if exists public.promo_new_cards;
drop table if exists public.promo_new_product_groups;
drop table if exists public.promo_new_promotion_tiers;
drop table if exists public.promo_new_promotion_families;
drop table if exists public.promo_new_sku_prices;
drop table if exists public.promo_new_skus;
alter table if exists public.promo_new_months drop constraint if exists promo_new_months_active_version_fk;
drop table if exists public.promo_new_versions;
drop table if exists public.promo_new_months;
drop table if exists public.promo_new_admins;

delete from storage.objects where bucket_id = 'promo-new-cards';
delete from storage.buckets where id = 'promo-new-cards';
