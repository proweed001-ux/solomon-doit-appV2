# Phase 1 safe hardening

Prepared on 2026-07-11 without changing production.

## Frozen baseline

- Production Git commit: `1c45ad8f0e34f7efd8a6200a19dcb8807bc7d6bf`
- Production Vercel deployment: `dpl_2Rp4ChdbW1bgBiK5uGcEQTD99Hci` (`READY`)
- Backup branch: `backup/production-2026-07-11-1c45ad8`
- Work branch: `codex/phase-1-safe-hardening`
- Supabase project: `saodmeoilixfdqentofp` (`ACTIVE_HEALTHY`)
- Supabase migration baseline: 16 migrations, latest `20260710123313_recreate_promo_cards_view_with_group_prices`

## Included in this phase

1. Enable RLS and remove browser access on `promo_upload_keys`.
2. Remove direct anon/authenticated execution of two privileged DOIT routines.
3. Make four public promo views read-only for browser roles.
4. Include verification SQL and an explicit manual rollback.

## Deliberately deferred

- Removing anon INSERT/UPDATE on `doit_versions`: the production Admin page currently writes directly with a publishable key. It needs a trusted upload endpoint first.
- Changing promo views to `security_invoker`: the public pages need their underlying RLS/read model tested first.
- Revoking `is_promo_admin()` and `is_valid_promo_key_hash(text)`: current RLS policies depend on them.

## Test gate

Apply the migration to a Supabase development branch, run `supabase/tests/phase_1_safe_security_hardening.sql`, then verify:

- promo upload with the admin key;
- promo live and promo admin reads;
- DOIT active-file read;
- expected denial of direct privileged RPC calls.

Nothing is merged to `main` or promoted to Production until the owner approves it.
