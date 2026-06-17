# Real DOIT File QA

This workflow verifies that a real monthly DOIT workbook can still be read after cleanup or refactor work.

## Purpose

Use this before merging code that may affect parsing, reporting, Pro print, or order grouping.

The real workbook itself must not be committed to GitHub.

## Command

```bash
node scripts/qa-doit-file.mjs "../Daily_DOIT_Template.xlsx" --json=qa-result.json
```

The output is a JSON summary with:

- raw rows
- parsed rows
- skipped cancelled or empty rows
- store count
- invoice count
- product count
- PS count
- date range
- amount sources
- print guardrail checks

## Merge rule

Do not merge feature or refactor work if this check cannot parse the real workbook or if print guardrails fail.

For privacy, keep generated QA output local unless it contains only safe aggregate counts.
