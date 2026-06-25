# AI / Developer Warning — Do Not Use Old Admin Performance Page

## Status

This project must use **one Admin page only**:

```text
/dist/admin.html
```

The old separate Performance Admin page must not be restored, reused, linked, edited, or used for testing:

```text
/dist/admin-performance.html
/admin-performance.html
```

## Reason

The old `/admin-performance.html` page came from an abandoned preview branch / PR and caused repeated confusion during testing. It is no longer part of the intended workflow.

Current rule:

```text
DOIT upload and Performance Tracking must live on the same visible Admin page.
Do not hide Performance logic inside side assets.
Do not inject Performance behavior into DOIT buttons.
Do not attach Performance event listeners to #file, #choose, or #uploadCloud.
```

## Required Admin structure

Performance must be visible directly inside:

```text
dist/admin.html
```

Required separation:

```text
DOIT file input:        #file
DOIT choose button:     #choose
DOIT upload button:     #uploadCloud

Performance file input: #perfFile
Performance choose:     #perfChoose
Performance check:      #perfCheck
Performance convert:    #perfConvert
Performance upload:     #perfUpload
```

## Performance comparison rules

The purpose of compare is not only to show numeric difference. It must answer:

```text
Did performance improve or worsen?
Why did it change?
Which ADS/PS must be fixed first?
Was the uploaded data valid?
```

Required compare behavior:

```text
reportDate is the business/report date.
uploadedAt is only the upload timestamp.
Same reportDate uploaded more than once = revision, not yesterday.
Daily compare must use the latest file from the previous reportDate only.
The same file/path must never be compared with itself.
If only same-day revisions exist, show no previous-day compare.
```

Performance dashboard must keep these sections:

```text
Data Status
Smart Compare วันต่อวัน
Cause Dashboard
Problem Dashboard
Month Trend Dashboard
ADS Board
Top PS / ต้องเร่งก่อน
Seller Report Detail
Raw tab
```

## Storage retention rules

Storage retention belongs in the Admin Storage Manager, not as a required section on `/performance`.

Keep JSON as the long-term format. Do not keep raw Excel for long periods.

```text
Performance JSON: keep 30 days.
Raw Excel / uploads / parsed temp files: keep 7 days.
Same-day revisions: keep latest + 3 recent revisions per reportDate.
Never delete performance/active.json.
Never delete performance/index.json.
Never delete current active dataPath.
Never delete previousDataPath used for compare.
```

`dist/assets/admin-storage-manager-v1.js` owns the safe cleanup UI. It must preview first. Direct browser delete remains disabled until a server-side delete function is enabled.

## Old Vercel preview deployment

An old immutable Vercel Preview deployment may still be reachable even after the file is removed from the latest branch:

```text
solomon-doit-app-v2-c68t3554b-proweed-s-projects.vercel.app
/admin-performance.html
```

Known deployment id:

```text
dpl_5wjc1ev2qjKCRKGNXVCSdfpiqyQ3
```

That old deployment was from:

```text
branch: feature/add-results-mode
PR: #54
commit message: Add admin performance route rewrite
```

If found, do not edit around it in code. Delete or disable the old Vercel deployment if possible. If deletion is not available, ignore it and use only the latest `/admin.html` preview or production URL.

## Do not do these

```text
Do not recreate dist/admin-performance.html.
Do not add links to /admin-performance.html.
Do not route users to /admin-performance.html.
Do not move Performance logic back into admin-progress-popup-v1.js.
Do not bind Performance code to DOIT #file, #choose, or #uploadCloud.
Do not claim the old Vercel deployment is deleted unless it is deleted from Vercel itself.
Do not compare same reportDate revisions as yesterday.
Do not store fake/mock Performance data.
Do not put Storage Retention back as a required `/performance` dashboard section.
```

## Safe action for future AI agents

Before editing Admin/Performance code, check this file and PR #57.

Expected direction:

```text
One visible Admin page only: /admin.html
Old admin-performance page: abandoned / do not use
Old preview deployment: delete if possible, otherwise ignore and warn
Performance compare: reportDate-aware, revision-safe, JSON-first
Storage retention: Admin Storage Manager only, preview-only until server delete is enabled
```
