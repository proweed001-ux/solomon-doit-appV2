begin;
set local search_path = public, extensions;
select plan(40);

select has_table('public', 'promo_new_months', 'promo_new_months exists');
select has_table('public', 'promo_new_versions', 'promo_new_versions exists');
select has_table('public', 'promo_new_skus', 'promo_new_skus exists');
select has_table('public', 'promo_new_sku_prices', 'promo_new_sku_prices exists');
select has_table('public', 'promo_new_cards', 'promo_new_cards exists');
select has_table('public', 'promo_new_product_groups', 'promo_new_product_groups exists');
select has_table('public', 'promo_new_promotion_families', 'promo_new_promotion_families exists');
select has_table('public', 'promo_new_promotion_tiers', 'promo_new_promotion_tiers exists');
select has_table('public', 'promo_new_audit_log', 'promo_new_audit_log exists');

select ok(not has_table_privilege('anon', 'public.promo_new_cards', 'insert'), 'anon cannot insert cards');
select ok(not has_table_privilege('authenticated', 'public.promo_new_cards', 'update'), 'authenticated cannot update cards directly');
select ok(not has_table_privilege('anon', 'public.promo_new_skus', 'select'), 'anon cannot bypass published backend');
select has_function('public', 'promo_new_save_draft', array['jsonb','uuid','text']);
select has_function('public', 'promo_new_publish_version', array['uuid','uuid']);
select has_function('public', 'promo_new_rollback_version', array['text','uuid','uuid']);
select has_function('public', 'promo_new_get_published_catalog', array['text']);

select ok(
  (select is_nullable = 'YES'
   from information_schema.columns
   where table_schema = 'public' and table_name = 'promo_new_skus' and column_name = 'size_value'),
  'size_value is optional for a confirmed model or variant'
);

create or replace function pg_temp.test_sku(p_external_id text, p_code text)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', p_external_id,
    'code', p_code,
    'canonicalName', 'Gillette Fusion 5',
    'identityKey', 'gillette|razor|fusion5|||piece|1',
    'identity', jsonb_build_object(
      'brand', 'Gillette',
      'productType', 'razor',
      'variant', 'Fusion 5',
      'sizeValue', 0,
      'sizeUnit', '',
      'salesUnit', 'piece',
      'packQuantity', 1
    ),
    'status', 'active',
    'evidence', jsonb_build_array('sql-behavior-test'),
    'failureReasons', '[]'::jsonb
  )
$$;

create or replace function pg_temp.test_family(p_id text, p_discount numeric)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', p_id,
    'familyKey', 'family-key-' || p_id,
    'name', 'Family ' || p_id,
    'scopeText', 'Gillette Fusion 5',
    'sourceRows', jsonb_build_array(1),
    'failureReasons', '[]'::jsonb,
    'tiersByClass', jsonb_build_object(
      'HFSS', jsonb_build_array(jsonb_build_object(
        'tierNo', 1,
        'type', 'cash_discount',
        'minQuantity', 1,
        'maxQuantity', null,
        'purchaseUnit', 'piece',
        'discountPercent', p_discount,
        'freeQuantity', 0,
        'rewardUnit', null,
        'bundlePrice', null,
        'effectivePercent', p_discount,
        'effectivePercentUsage', null,
        'sourceText', 'Buy 1 discount ' || p_discount || '%'
      ))
    )
  )
$$;

create or replace function pg_temp.test_group(
  p_id text,
  p_sku_id text,
  p_family_id text
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', p_id,
    'monthKey', 'PROMO-2026-07',
    'skuId', p_sku_id,
    'sku', jsonb_build_object('identityKey', 'gillette|razor|fusion5|||piece|1'),
    'cardIds', '[]'::jsonb,
    'classIds', jsonb_build_array('HFSS'),
    'promotionFamilyId', p_family_id,
    'status', 'ready',
    'failureReasons', '[]'::jsonb
  )
$$;

create or replace function pg_temp.test_card(
  p_id text,
  p_page integer,
  p_sequence integer,
  p_sku_id text,
  p_group_id text,
  p_family_id text
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', p_id,
    'monthKey', 'PROMO-2026-07',
    'page', p_page,
    'sequence', p_sequence,
    'classId', 'HFSS',
    'imageUrl', null,
    'skuId', p_sku_id,
    'productGroupId', p_group_id,
    'promotionFamilyId', p_family_id,
    'price', jsonb_build_object(
      'pdfSourcePrice', null,
      'centralOverridePrice', jsonb_build_object('amount', 100, 'currency', 'THB'),
      'effectivePrice', jsonb_build_object('amount', 100, 'currency', 'THB')
    ),
    'status', 'ready',
    'evidence', jsonb_build_object('method', 'manual'),
    'failureReasons', '[]'::jsonb
  )
$$;

create or replace function pg_temp.test_payload(
  p_version_id uuid,
  p_sku_id text,
  p_code text,
  p_families jsonb,
  p_groups jsonb,
  p_cards jsonb
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'schema', 'promo-system-rebuild-v1',
    'version', jsonb_build_object(
      'id', p_version_id,
      'monthKey', 'PROMO-2026-07',
      'source', jsonb_build_object(
        'pdfName', 'jul26.pdf',
        'workbookName', 'jul26.csv',
        'pdfHash', 'pdf-hash',
        'workbookHash', 'workbook-hash'
      )
    ),
    'skus', jsonb_build_array(pg_temp.test_sku(p_sku_id, p_code)),
    'prices', jsonb_build_array(jsonb_build_object(
      'skuId', p_sku_id,
      'pdfSourcePrice', null,
      'centralOverridePrice', jsonb_build_object('amount', 100, 'currency', 'THB'),
      'source', 'central_override',
      'sourceReference', 'sql-behavior-test'
    )),
    'promotionFamilies', p_families,
    'productGroups', p_groups,
    'cards', p_cards
  )
$$;

insert into auth.users(id)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
on conflict (id) do nothing;

insert into public.promo_new_admins(user_id, active)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true)
on conflict (user_id) do update set active = true;

create temporary table promo_rebuild_test_payloads (
  name text primary key,
  payload jsonb not null
);

insert into promo_rebuild_test_payloads(name, payload)
values (
  'v1',
  pg_temp.test_payload(
    '11111111-1111-4111-8111-111111111111',
    'SKU-OPTIONAL-SIZE-V1',
    'GILLETTE-FUSION-5',
    jsonb_build_array(pg_temp.test_family('FAMILY-A', 10)),
    jsonb_build_array(pg_temp.test_group('GROUP-V1', 'SKU-OPTIONAL-SIZE-V1', 'FAMILY-A')),
    jsonb_build_array(pg_temp.test_card('CARD-V1-A', 1, 1, 'SKU-OPTIONAL-SIZE-V1', 'GROUP-V1', 'FAMILY-A'))
  )
), (
  'v2',
  pg_temp.test_payload(
    '22222222-2222-4222-8222-222222222222',
    'SKU-SAME-IDENTITY-NEW-EXTERNAL-ID',
    'GILLETTE-FUSION-5-UPDATED',
    jsonb_build_array(
      pg_temp.test_family('FAMILY-B', 12),
      pg_temp.test_family('FAMILY-C', 15)
    ),
    jsonb_build_array(pg_temp.test_group('GROUP-V2', 'SKU-SAME-IDENTITY-NEW-EXTERNAL-ID', null)),
    jsonb_build_array(
      pg_temp.test_card('CARD-V2-A', 1, 1, 'SKU-SAME-IDENTITY-NEW-EXTERNAL-ID', 'GROUP-V2', 'FAMILY-B'),
      pg_temp.test_card('CARD-V2-B', 1, 2, 'SKU-SAME-IDENTITY-NEW-EXTERNAL-ID', 'GROUP-V2', 'FAMILY-C')
    )
  )
), (
  'invalid',
  pg_temp.test_payload(
    '33333333-3333-4333-8333-333333333333',
    'SKU-INVALID-ATTEMPT',
    'GILLETTE-FUSION-5-INVALID',
    jsonb_build_array(pg_temp.test_family('FAMILY-D', 20)),
    '[]'::jsonb,
    jsonb_build_array(pg_temp.test_card('CARD-INVALID', 1, 1, 'SKU-INVALID-ATTEMPT', 'GROUP-MISSING', 'FAMILY-D'))
  )
);

select is(
  (public.promo_new_save_draft(
    (select payload from promo_rebuild_test_payloads where name = 'v1'),
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'PROMO-2026-07'
  )->>'status'),
  'draft',
  'optional-size draft saves'
);
select ok(
  (select size_value is null from public.promo_new_skus where identity_key = 'gillette|razor|fusion5|||piece|1'),
  'zero size is stored as null'
);
select is(
  (select variant from public.promo_new_skus where identity_key = 'gillette|razor|fusion5|||piece|1'),
  'Fusion 5',
  'confirmed variant identifies optional-size SKU'
);
select is(
  (select count(*) from public.promo_new_cards where version_id = '11111111-1111-4111-8111-111111111111'),
  1::bigint,
  'first draft stores its complete card set'
);
select is(
  (public.promo_new_publish_version(
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  )->>'status'),
  'published',
  'first ready draft publishes'
);
select is(
  (public.promo_new_get_published_catalog('PROMO-2026-07') #>> '{version,id}'),
  '11111111-1111-4111-8111-111111111111',
  'published catalog exposes first version'
);

select is(
  (public.promo_new_save_draft(
    (select payload from promo_rebuild_test_payloads where name = 'v2'),
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'PROMO-2026-07'
  )->>'status'),
  'draft',
  'same identity with a new external ID saves'
);
select is(
  (select revision from public.promo_new_versions where id = '22222222-2222-4222-8222-222222222222'),
  2,
  'second draft receives revision 2'
);
select is(
  (select count(*) from public.promo_new_skus where identity_key = 'gillette|razor|fusion5|||piece|1'),
  1::bigint,
  'stable identity does not create a duplicate SKU'
);
select is(
  (select count(*) from public.promo_new_cards where version_id = '22222222-2222-4222-8222-222222222222'),
  2::bigint,
  'second draft stores both cards from the same Class'
);
select is(
  (select count(distinct sku_id) from public.promo_new_cards where version_id = '22222222-2222-4222-8222-222222222222'),
  1::bigint,
  'new external ID resolves to the stable SKU for every card'
);
select is(
  (select count(distinct promotion_family_id) from public.promo_new_cards where version_id = '22222222-2222-4222-8222-222222222222'),
  2::bigint,
  'promotion family is persisted per card'
);
select ok(
  (select promotion_family_id is null from public.promo_new_product_groups where version_id = '22222222-2222-4222-8222-222222222222'),
  'group-level promotion stays null when cards use different families'
);
select is(
  (public.promo_new_publish_version(
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  )->>'status'),
  'published',
  'multi-card same-Class draft publishes when every card has a tier'
);
select is(
  (select status from public.promo_new_versions where id = '11111111-1111-4111-8111-111111111111'),
  'archived',
  'publishing revision 2 archives revision 1'
);
select is(
  (public.promo_new_rollback_version(
    'PROMO-2026-07',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  )->>'status'),
  'published',
  'rollback succeeds'
);
select is(
  (select status from public.promo_new_versions where id = '11111111-1111-4111-8111-111111111111'),
  'published',
  'rollback target becomes published'
);
select is(
  (select status from public.promo_new_versions where id = '22222222-2222-4222-8222-222222222222'),
  'archived',
  'rollback archives the replaced version'
);
select is(
  (select active_version_id from public.promo_new_months where month_key = 'PROMO-2026-07'),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'rollback restores the active version pointer'
);

create temporary table promo_rebuild_test_errors(message text);
do $$
begin
  perform public.promo_new_save_draft(
    (select payload from promo_rebuild_test_payloads where name = 'invalid'),
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'PROMO-2026-07'
  );
exception when others then
  insert into promo_rebuild_test_errors(message) values (sqlerrm);
end;
$$;

select is(
  (select message from promo_rebuild_test_errors limit 1),
  'card_reference_missing',
  'invalid complete-save attempt fails at its missing group reference'
);
select is(
  (select count(*) from public.promo_new_versions where id = '33333333-3333-4333-8333-333333333333'),
  0::bigint,
  'failed draft leaves no partial version'
);
select is(
  (select active_version_id from public.promo_new_months where month_key = 'PROMO-2026-07'),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'failed draft does not change the published pointer'
);
select is(
  (public.promo_new_get_published_catalog('PROMO-2026-07') #>> '{version,id}'),
  '11111111-1111-4111-8111-111111111111',
  'published catalog remains on the rollback target after a failed draft'
);

select * from finish();
rollback;
