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
```

## Safe action for future AI agents

Before editing Admin/Performance code, check this file and PR #57.

Expected direction:

```text
One visible Admin page only: /admin.html
Old admin-performance page: abandoned / do not use
Old preview deployment: delete if possible, otherwise ignore and warn
```
