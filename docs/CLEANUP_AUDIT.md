# Cleanup Audit

This document tracks cleanup work before future feature development.

## Current goal

Keep the live Pro page stable while reducing risky or stale project files.

## Stable baseline

```text
Pro Stable = 1026
main = production baseline
```

Use this as the rollback point before starting new features.

## Cleanup status

- Landing page points to `/pro.html?t=1026`.
- Old public V310 pages redirect to `/pro.html?t=1026`.
- Web CI runs smoke checks for `dist/*.html`, `dist/assets/**`, `docs/**`, and script changes on push and PR.
- Pro print reads live state from `window.DOIT_CORE_APP.currentState()` when available, with localStorage scan only as fallback.
- Product rows with 0 quantity remain excluded from print bills by design.

## Stale work inventory

### Close / do not merge

- PR #1 `Clean runtime v310 preview`
  - Reason: old preview/runtime experiment before Pro 1026 stabilized.
  - Risk: stale branch has many old commits and can conflict with the current live Pro page.
  - Action: keep unmerged; close when GitHub action is available.

### Keep

- `.github/workflows/web-ci.yml`
  - Purpose: lightweight smoke check for branch and PR guardrails.
  - Risk: low.

- `.github/workflows/build-android-apk.yml`
  - Purpose: manual or path-based Android debug APK build.
  - Risk: medium, but still useful for APK output.

### Remove / quarantine later after repo-wide reference audit

Do not delete old `dist/assets/*.js` files in bulk until a repo-wide reference audit confirms they are not referenced by any public HTML page, preview page, Android wrapper, or docs.

Known old V310 public pages have been redirected instead of deleted so old links do not open stale UI.

The following icon repair workflows are one-off maintenance workflows and should not stay in the active workflow set:

- `.github/workflows/apply-icon-from-b64.yml`
- `.github/workflows/rebuild-icons-from-drawable.yml`
- `.github/workflows/fix-valid-icon-build.yml`

Reasons:

- They use `contents: write`.
- They can commit back to the repository from GitHub Actions.
- Some of them remove workflow files during the job.
- They are not needed for normal web Pro usage.
- Keeping them increases confusion when maintaining the repo.

## Cleanup rule

Do not delete app source, Pro print files, parser logic, Android source, or the current stable Pro 1026 files during cleanup unless there is a separate feature branch and explicit QA.

## Verification after cleanup

Run smoke check and verify the live Pro page still loads.
