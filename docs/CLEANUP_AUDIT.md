# Cleanup Audit

This document tracks cleanup work before future feature development.

## Current goal

Keep the live Pro page stable while reducing risky or stale project files.

## Workflow inventory

### Keep

- `.github/workflows/web-ci.yml`
  - Purpose: lightweight smoke check for branch and PR guardrails.
  - Risk: low.

- `.github/workflows/build-android-apk.yml`
  - Purpose: manual or path-based Android debug APK build.
  - Risk: medium, but still useful for APK output.

### Remove / quarantine

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

Do not delete app source, Pro print files, parser logic, or Android source during cleanup unless there is a separate feature branch and explicit QA.

## Verification after cleanup

Run smoke check and verify the live Pro page still loads.
