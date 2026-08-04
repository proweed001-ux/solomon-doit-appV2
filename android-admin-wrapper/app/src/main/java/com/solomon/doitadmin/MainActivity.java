package com.solomon.doitadmin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.print.PrintManager;
import android.util.Base64;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.SafeBrowsingResponse;
import android.webkit.SslErrorHandler;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import org.json.JSONArray;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class MainActivity extends Activity {
    private static final String ADMIN_URL = "https://solomon-doit-app-v2.vercel.app/admin-login.html";
    private static final String APP_HOST = "solomon-doit-app-v2.vercel.app";
    private static final int FILE_CHOOSER_REQUEST = 4101;
    private static final String STATE_SHARED_URIS = "state_shared_uris";
    private static final int MAX_BRIDGE_DOWNLOAD_BYTES = 40 * 1024 * 1024;

    private final ArrayList<Uri> pendingSharedUris = new ArrayList<>();
    private WebView webView;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> fileChooserCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState != null) {
            ArrayList<Uri> restored = getUriList(savedInstanceState, STATE_SHARED_URIS);
            if (restored != null) pendingSharedUris.addAll(restored);
        }
        collectSharedFiles(getIntent());

        configureSystemBars();
        createContentView();
        configureWebView();
        configureBackNavigation();

        if (savedInstanceState == null || webView.restoreState(savedInstanceState) == null) {
            webView.loadUrl(ADMIN_URL);
        }

        if (!pendingSharedUris.isEmpty()) {
            Toast.makeText(
                    this,
                    "รับไฟล์จาก LINE แล้ว กรุณาเข้าสู่ระบบ Admin",
                    Toast.LENGTH_LONG
            ).show();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        int before = pendingSharedUris.size();
        collectSharedFiles(intent);
        if (pendingSharedUris.size() > before) {
            Toast.makeText(this, "รับไฟล์จาก LINE แล้ว", Toast.LENGTH_SHORT).show();
            showSharedFileBannerIfReady();
        }
    }

    private void configureSystemBars() {
        Window window = getWindow();
        window.setStatusBarColor(getColor(R.color.status_bar));
        window.setNavigationBarColor(getColor(R.color.navigation_bar));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false);
        }
    }

    private void createContentView() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(164, 0, 0));

        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);
        progressBar.setVisibility(View.GONE);
        root.addView(progressBar, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(3)
        ));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout()
                );
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return WindowInsets.CONSUMED;
            });
        }

        setContentView(root);
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " AdminDOITAndroid/1.0.0");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        webView.addJavascriptInterface(new AdminAndroidBridge(), "AdminDoItAndroid");
        webView.setWebViewClient(new AdminWebViewClient());
        webView.setWebChromeClient(new AdminWebChromeClient());
        webView.setDownloadListener(createDownloadListener());
        webView.setBackgroundColor(Color.WHITE);
        webView.setOverScrollMode(View.OVER_SCROLL_IF_CONTENT_SCROLLS);
    }

    private void configureBackNavigation() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                    this::handleBackPressed
            );
        }
    }

    private void handleBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            finish();
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        handleBackPressed();
    }

    private void collectSharedFiles(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (!Intent.ACTION_SEND.equals(action) && !Intent.ACTION_SEND_MULTIPLE.equals(action)) return;

        int flags = intent.getFlags();
        if (Intent.ACTION_SEND.equals(action)) {
            Uri uri = getSingleStream(intent);
            addSharedUri(uri, flags);
        } else {
            ArrayList<Uri> uris = getMultipleStreams(intent);
            if (uris != null) {
                for (Uri uri : uris) addSharedUri(uri, flags);
            }
        }

        ClipData clipData = intent.getClipData();
        if (clipData != null) {
            for (int i = 0; i < clipData.getItemCount(); i++) {
                addSharedUri(clipData.getItemAt(i).getUri(), flags);
            }
        }
    }

    @SuppressWarnings("deprecation")
    private Uri getSingleStream(Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri.class);
        }
        return intent.getParcelableExtra(Intent.EXTRA_STREAM);
    }

    @SuppressWarnings("deprecation")
    private ArrayList<Uri> getMultipleStreams(Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM, Uri.class);
        }
        return intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
    }

    @SuppressWarnings("deprecation")
    private ArrayList<Uri> getUriList(Bundle bundle, String key) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return bundle.getParcelableArrayList(key, Uri.class);
        }
        return bundle.getParcelableArrayList(key);
    }

    private void addSharedUri(Uri uri, int intentFlags) {
        if (uri == null || pendingSharedUris.contains(uri)) return;
        if (!isSupportedSpreadsheet(uri)) {
            Toast.makeText(
                    this,
                    "ไฟล์ที่แชร์ไม่ใช่ XLSX, XLSM, XLS หรือ CSV",
                    Toast.LENGTH_LONG
            ).show();
            return;
        }

        try {
            grantUriPermission(
                    getPackageName(),
                    uri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION
            );
        } catch (Exception ignored) {
        }

        if ((intentFlags & Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION) != 0) {
            try {
                getContentResolver().takePersistableUriPermission(
                        uri,
                        Intent.FLAG_GRANT_READ_URI_PERMISSION
                );
            } catch (Exception ignored) {
            }
        }

        pendingSharedUris.add(uri);
    }

    private boolean isSupportedSpreadsheet(Uri uri) {
        String name = getDisplayName(uri).toLowerCase(Locale.ROOT);
        if (name.endsWith(".xlsx") || name.endsWith(".xlsm")
                || name.endsWith(".xls") || name.endsWith(".csv")) {
            return true;
        }

        String mime = getContentResolver().getType(uri);
        if (mime == null) return false;
        mime = mime.toLowerCase(Locale.ROOT);
        return mime.contains("spreadsheet")
                || mime.contains("excel")
                || mime.contains("csv")
                || mime.equals("application/octet-stream");
    }

    private String getDisplayName(Uri uri) {
        if (uri == null) return "shared-file";
        if ("content".equalsIgnoreCase(uri.getScheme())) {
            try (Cursor cursor = getContentResolver().query(
                    uri,
                    new String[]{OpenableColumns.DISPLAY_NAME},
                    null,
                    null,
                    null
            )) {
                if (cursor != null && cursor.moveToFirst()) {
                    int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (index >= 0) {
                        String value = cursor.getString(index);
                        if (value != null && !value.isBlank()) return value;
                    }
                }
            } catch (Exception ignored) {
            }
        }
        String last = uri.getLastPathSegment();
        return last == null || last.isBlank() ? "shared-file" : last;
    }

    private void showSharedFileBannerIfReady() {
        if (webView == null || pendingSharedUris.isEmpty()) return;
        String currentUrl = webView.getUrl();
        if (currentUrl == null || !isAdminPage(Uri.parse(currentUrl))) return;

        JSONArray names = new JSONArray();
        for (Uri uri : pendingSharedUris) names.put(getDisplayName(uri));

        String script = "(function(){"
                + "var old=document.getElementById('adminDoitShareBanner');if(old)old.remove();"
                + "var names=" + names + ";"
                + "var box=document.createElement('section');box.id='adminDoitShareBanner';"
                + "box.style.cssText='position:sticky;top:58px;z-index:99999;margin:10px auto;padding:14px;max-width:950px;border:2px solid #ef4444;border-radius:14px;background:#fff1f2;color:#7f1d1d;box-shadow:0 8px 30px #7f1d1d33;font-family:system-ui';"
                + "var title=document.createElement('b');title.textContent='ไฟล์จาก LINE พร้อมใช้งาน';box.appendChild(title);"
                + "var list=document.createElement('div');list.style.cssText='margin:7px 0 10px;font-size:13px;word-break:break-word';list.textContent=names.join(', ');box.appendChild(list);"
                + "var row=document.createElement('div');row.style.cssText='display:flex;gap:8px;flex-wrap:wrap';"
                + "function add(label,id,target){var b=document.createElement('button');b.type='button';b.id=id;b.textContent=label;b.style.cssText='min-height:42px;border:0;border-radius:10px;padding:0 14px;background:#b91c1c;color:white;font-weight:900';b.onclick=function(){var el=document.querySelector(target);if(el){el.click()}else{alert(\"ยังไม่พบปุ่มเลือกไฟล์ในหน้านี้\")}};row.appendChild(b)}"
                + "add('ใช้เป็นไฟล์ DOIT','adminDoitSharedDoit','#choose');"
                + "add('ใช้เป็นไฟล์ Performance','adminDoitSharedPerformance','#perfChoose');"
                + "box.appendChild(row);document.body.insertBefore(box,document.body.firstChild);"
                + "})();";
        webView.evaluateJavascript(script, null);
    }

    private void removeSharedFileBanner() {
        if (webView == null) return;
        webView.evaluateJavascript(
                "document.getElementById('adminDoitShareBanner')?.remove();",
                null
        );
    }

    private void injectAndroidHooks() {
        String script = "(function(){"
                + "if(window.__ADMIN_DOIT_ANDROID__)return;window.__ADMIN_DOIT_ANDROID__=true;"
                + "window.print=function(){AdminDoItAndroid.printPage();};"
                + "document.addEventListener('click',function(event){"
                + "var a=event.target&&event.target.closest?event.target.closest('a[download]'):null;"
                + "if(!a||!a.href||(!a.href.startsWith('blob:')&&!a.href.startsWith('data:')))return;"
                + "event.preventDefault();event.stopPropagation();"
                + "fetch(a.href).then(function(r){return r.blob()}).then(function(blob){"
                + "var reader=new FileReader();reader.onload=function(){AdminDoItAndroid.saveDataUrl(String(reader.result),a.download||'download',blob.type||'application/octet-stream')};reader.readAsDataURL(blob);"
                + "}).catch(function(){alert('ดาวน์โหลดไฟล์ไม่สำเร็จ')});"
                + "},true);"
                + "})();";
        webView.evaluateJavascript(script, null);
    }

    private DownloadListener createDownloadListener() {
        return (url, userAgent, contentDisposition, mimeType, contentLength) -> {
            if (url == null || url.startsWith("blob:") || url.startsWith("data:")) return;
            try {
                String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setTitle(fileName);
                request.setDescription("กำลังดาวน์โหลดจาก Admin DOIT");
                request.setMimeType(mimeType);
                if (userAgent != null) request.addRequestHeader("User-Agent", userAgent);
                String cookies = CookieManager.getInstance().getCookie(url);
                if (cookies != null && !cookies.isEmpty()) request.addRequestHeader("Cookie", cookies);
                request.setNotificationVisibility(
                        DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
                );
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                DownloadManager manager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                manager.enqueue(request);
                Toast.makeText(this, "เริ่มดาวน์โหลด: " + fileName, Toast.LENGTH_SHORT).show();
            } catch (Exception error) {
                Toast.makeText(this, "ดาวน์โหลดไม่สำเร็จ", Toast.LENGTH_LONG).show();
            }
        };
    }

    private void saveDataUrl(String dataUrl, String requestedName, String mimeType) {
        try {
            int comma = dataUrl == null ? -1 : dataUrl.indexOf(',');
            if (comma < 0) throw new IllegalArgumentException("invalid_data_url");
            byte[] bytes = Base64.decode(dataUrl.substring(comma + 1), Base64.DEFAULT);
            if (bytes.length > MAX_BRIDGE_DOWNLOAD_BYTES) {
                throw new IllegalArgumentException("file_too_large");
            }

            String fileName = sanitizeFileName(requestedName);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
                values.put(MediaStore.Downloads.MIME_TYPE,
                        mimeType == null || mimeType.isBlank()
                                ? "application/octet-stream"
                                : mimeType);
                values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                values.put(MediaStore.Downloads.IS_PENDING, 1);
                Uri destination = getContentResolver().insert(
                        MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                        values
                );
                if (destination == null) throw new IllegalStateException("download_insert_failed");
                try (OutputStream output = getContentResolver().openOutputStream(destination)) {
                    if (output == null) throw new IllegalStateException("download_open_failed");
                    output.write(bytes);
                }
                values.clear();
                values.put(MediaStore.Downloads.IS_PENDING, 0);
                getContentResolver().update(destination, values, null, null);
            } else {
                File directory = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (directory == null) throw new IllegalStateException("download_directory_failed");
                File outputFile = new File(directory, fileName);
                try (OutputStream output = new FileOutputStream(outputFile)) {
                    output.write(bytes);
                }
            }
            Toast.makeText(this, "บันทึกไฟล์แล้ว: " + fileName, Toast.LENGTH_LONG).show();
        } catch (Exception error) {
            Toast.makeText(this, "บันทึกไฟล์ไม่สำเร็จ", Toast.LENGTH_LONG).show();
        }
    }

    private String sanitizeFileName(String name) {
        String value = name == null || name.isBlank() ? "admin-doit-download" : name;
        value = value.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
        return value.isBlank() ? "admin-doit-download" : value;
    }

    private boolean isInternalUrl(Uri uri) {
        String scheme = uri.getScheme();
        if (scheme == null) return false;
        if (scheme.equals("about") || scheme.equals("data") || scheme.equals("blob")) return true;
        if (!scheme.equals("https")) return false;
        String host = uri.getHost();
        return host != null && host.toLowerCase(Locale.ROOT).equals(APP_HOST);
    }

    private boolean isAdminPage(Uri uri) {
        if (!isInternalUrl(uri)) return false;
        String path = uri.getPath();
        return path != null && path.endsWith("/admin.html");
    }

    private boolean openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
            return true;
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "ไม่พบแอปสำหรับเปิดลิงก์นี้", Toast.LENGTH_LONG).show();
            return true;
        }
    }

    private void printCurrentPage() {
        if (webView == null) return;
        PrintManager manager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
        String jobName = getString(R.string.app_name) + " Document";
        manager.print(jobName, webView.createPrintDocumentAdapter(jobName), null);
    }

    private boolean isOnline() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        Network network = manager.getActiveNetwork();
        if (network == null) return false;
        NetworkCapabilities capabilities = manager.getNetworkCapabilities(network);
        return capabilities != null
                && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putParcelableArrayList(STATE_SHARED_URIS, pendingSharedUris);
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (fileChooserCallback != null) {
            fileChooserCallback.onReceiveValue(null);
            fileChooserCallback = null;
        }
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.removeJavascriptInterface("AdminDoItAndroid");
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return;
        Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
        fileChooserCallback.onReceiveValue(result);
        fileChooserCallback = null;
    }

    private final class AdminWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            return !isInternalUrl(uri) && openExternal(uri);
        }

        @SuppressWarnings("deprecation")
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri uri = Uri.parse(url);
            return !isInternalUrl(uri) && openExternal(uri);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            injectAndroidHooks();
            CookieManager.getInstance().flush();
            showSharedFileBannerIfReady();
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame()) {
                Toast.makeText(
                        MainActivity.this,
                        isOnline() ? "เปิดหน้า Admin DOIT ไม่สำเร็จ" : "ไม่มีการเชื่อมต่ออินเทอร์เน็ต",
                        Toast.LENGTH_LONG
                ).show();
            }
        }

        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            handler.cancel();
            Toast.makeText(
                    MainActivity.this,
                    "ยกเลิกการเชื่อมต่อที่ไม่ปลอดภัย",
                    Toast.LENGTH_LONG
            ).show();
        }

        @Override
        public void onSafeBrowsingHit(
                WebView view,
                WebResourceRequest request,
                int threatType,
                SafeBrowsingResponse callback
        ) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                callback.backToSafety(true);
            }
        }
    }

    private final class AdminWebChromeClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            progressBar.setProgress(newProgress);
            progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
        }

        @Override
        public boolean onShowFileChooser(
                WebView currentWebView,
                ValueCallback<Uri[]> newCallback,
                FileChooserParams fileChooserParams
        ) {
            if (fileChooserCallback != null) fileChooserCallback.onReceiveValue(null);

            if (!pendingSharedUris.isEmpty()) {
                Uri[] selected;
                if (fileChooserParams.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) {
                    selected = pendingSharedUris.toArray(new Uri[0]);
                    pendingSharedUris.clear();
                } else {
                    selected = new Uri[]{pendingSharedUris.remove(0)};
                }
                newCallback.onReceiveValue(selected);
                if (pendingSharedUris.isEmpty()) removeSharedFileBanner();
                else showSharedFileBannerIfReady();
                Toast.makeText(MainActivity.this, "นำไฟล์จาก LINE เข้าแล้ว", Toast.LENGTH_SHORT).show();
                return true;
            }

            fileChooserCallback = newCallback;
            try {
                Intent intent = fileChooserParams.createIntent();
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.putExtra(
                        Intent.EXTRA_ALLOW_MULTIPLE,
                        fileChooserParams.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE
                );
                startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            } catch (ActivityNotFoundException error) {
                fileChooserCallback = null;
                Toast.makeText(
                        MainActivity.this,
                        "ไม่พบตัวเลือกไฟล์ในเครื่อง",
                        Toast.LENGTH_LONG
                ).show();
                return false;
            }
        }
    }

    private final class AdminAndroidBridge {
        @JavascriptInterface
        public void printPage() {
            runOnUiThread(MainActivity.this::printCurrentPage);
        }

        @JavascriptInterface
        public void saveDataUrl(String dataUrl, String fileName, String mimeType) {
            new Thread(() -> runOnUiThread(() -> saveDataUrl(dataUrl, fileName, mimeType))).start();
        }
    }
}
