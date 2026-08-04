# Admin DOIT Android

Android WebView wrapper for the protected Solomon DOIT Admin portal.

- App name: `Admin DOIT`
- Package: `com.solomon.doitadmin`
- Start page: `https://solomon-doit-app-v2.vercel.app/admin-login.html`
- Supports Android `ACTION_SEND` and `ACTION_SEND_MULTIPLE` for `.xlsx`, `.xlsm`, `.xls`, and `.csv` files shared from LINE or another Android app.
- A shared file is held until Admin login succeeds. On `/admin.html`, the app displays a red banner allowing the administrator to choose whether the file is for DOIT or Performance.
- Sharing never uploads automatically. The administrator still verifies the file and presses the website upload button.
- Uses the supplied red Admin DOIT artwork as the launcher icon.

This branch and its Draft PR do not modify Production website files or Production data.
