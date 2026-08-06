package com.ayaps.printerbridge;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private static final int PICK_RAW_FILE = 1001;
    private static final int CONNECT_TIMEOUT_MS = 5000;
    private static final int SOCKET_TIMEOUT_MS = 10000;
    private static final String DEFAULT_IP = "192.168.1.1";
    private static final String DEFAULT_PORT = "9100";

    private EditText ipInput;
    private EditText portInput;
    private Button testButton;
    private Button chooseButton;
    private Button sendButton;
    private TextView selectedFileText;
    private TextView statusText;

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private Uri selectedUri;
    private String selectedName;
    private boolean busy;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ipInput = findViewById(R.id.ipInput);
        portInput = findViewById(R.id.portInput);
        testButton = findViewById(R.id.testButton);
        chooseButton = findViewById(R.id.chooseButton);
        sendButton = findViewById(R.id.sendButton);
        selectedFileText = findViewById(R.id.selectedFileText);
        statusText = findViewById(R.id.statusText);
        statusText.setTextIsSelectable(true);

        SharedPreferences preferences = getSharedPreferences("printer", MODE_PRIVATE);
        ipInput.setText(preferences.getString("ip", DEFAULT_IP));
        portInput.setText(preferences.getString("port", DEFAULT_PORT));

        testButton.setOnClickListener(view -> testConnection());
        chooseButton.setOnClickListener(view -> openFilePicker());
        sendButton.setOnClickListener(view -> sendRawFile());

        handleIncomingIntent(getIntent());
        appendLog("พร้อมทดสอบ RAW TCP ไปยัง Router");
        appendLog("คำเตือน: รุ่นนี้ส่งเฉพาะไฟล์ .PRN/.RAW/.BIN ที่สร้างด้วยไดรเวอร์ Canon E410 แล้วเท่านั้น");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    @SuppressWarnings("deprecation")
    private void handleIncomingIntent(Intent intent) {
        if (intent == null || !Intent.ACTION_SEND.equals(intent.getAction())) {
            return;
        }
        Uri uri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        if (uri != null) {
            selectUri(uri);
        }
    }

    private void openFilePicker() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        startActivityForResult(intent, PICK_RAW_FILE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != PICK_RAW_FILE || resultCode != RESULT_OK || data == null) {
            return;
        }
        Uri uri = data.getData();
        if (uri == null) {
            return;
        }
        try {
            int flags = data.getFlags() &
                    (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            getContentResolver().takePersistableUriPermission(uri, flags);
        } catch (SecurityException ignored) {
            // Some document providers do not grant persistable access. Current-session access still works.
        }
        selectUri(uri);
    }

    private void selectUri(Uri uri) {
        selectedUri = uri;
        selectedName = resolveDisplayName(uri);
        selectedFileText.setText(selectedName);
        appendLog("เลือกไฟล์: " + selectedName);
    }

    private String resolveDisplayName(Uri uri) {
        String fallback = uri.getLastPathSegment() == null ? "unknown.raw" : uri.getLastPathSegment();
        if (!ContentResolver.SCHEME_CONTENT.equals(uri.getScheme())) {
            return fallback;
        }
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
                    String name = cursor.getString(index);
                    if (name != null && !name.trim().isEmpty()) {
                        return name;
                    }
                }
            }
        } catch (RuntimeException ignored) {
            // Fall back to the URI path.
        }
        return fallback;
    }

    private void testConnection() {
        PrinterTarget target = readTarget();
        if (target == null) {
            return;
        }
        runNetworkTask("ทดสอบการเชื่อมต่อ", () -> {
            long start = System.currentTimeMillis();
            try (Socket socket = openSocket(target)) {
                long elapsed = System.currentTimeMillis() - start;
                return "CONNECTED " + target.ip + ":" + target.port + " ใน " + elapsed + " ms";
            }
        });
    }

    private void sendRawFile() {
        PrinterTarget target = readTarget();
        if (target == null) {
            return;
        }
        if (selectedUri == null) {
            Toast.makeText(this, "กรุณาเลือกไฟล์ PRN หรือ RAW ก่อน", Toast.LENGTH_SHORT).show();
            return;
        }
        if (!hasAllowedExtension(selectedName)) {
            Toast.makeText(
                    this,
                    "ปฏิเสธการส่ง: ต้องเป็น .prn, .raw หรือ .bin เท่านั้น ห้ามส่ง PDF/JPG ตรงไปพอร์ต 9100",
                    Toast.LENGTH_LONG
            ).show();
            return;
        }

        Uri uri = selectedUri;
        String name = selectedName;
        runNetworkTask("ส่งงานพิมพ์ " + name, () -> {
            long total = 0L;
            long start = System.currentTimeMillis();
            try (InputStream source = getContentResolver().openInputStream(uri)) {
                if (source == null) {
                    throw new IOException("เปิดไฟล์ไม่ได้");
                }
                try (BufferedInputStream input = new BufferedInputStream(source, 64 * 1024);
                     Socket socket = openSocket(target);
                     BufferedOutputStream output = new BufferedOutputStream(socket.getOutputStream(), 64 * 1024)) {
                    byte[] buffer = new byte[32 * 1024];
                    int read;
                    while ((read = input.read(buffer)) != -1) {
                        output.write(buffer, 0, read);
                        total += read;
                    }
                    output.flush();
                }
            }
            long elapsed = System.currentTimeMillis() - start;
            return "ส่งสำเร็จ " + String.format(Locale.US, "%,d", total) +
                    " bytes ไปยัง " + target.ip + ":" + target.port + " ใน " + elapsed + " ms";
        });
    }

    private Socket openSocket(PrinterTarget target) throws IOException {
        Socket socket = new Socket();
        socket.setTcpNoDelay(true);
        socket.setKeepAlive(true);
        socket.connect(new InetSocketAddress(target.ip, target.port), CONNECT_TIMEOUT_MS);
        socket.setSoTimeout(SOCKET_TIMEOUT_MS);
        return socket;
    }

    private PrinterTarget readTarget() {
        String ip = ipInput.getText().toString().trim();
        String portText = portInput.getText().toString().trim();
        if (ip.isEmpty()) {
            ipInput.setError("กรุณาใส่ IP");
            return null;
        }

        int port;
        try {
            port = Integer.parseInt(portText);
        } catch (NumberFormatException error) {
            portInput.setError("พอร์ตต้องเป็นตัวเลข");
            return null;
        }
        if (port < 1 || port > 65535) {
            portInput.setError("พอร์ตต้องอยู่ระหว่าง 1–65535");
            return null;
        }

        getSharedPreferences("printer", MODE_PRIVATE)
                .edit()
                .putString("ip", ip)
                .putString("port", String.valueOf(port))
                .apply();
        return new PrinterTarget(ip, port);
    }

    private boolean hasAllowedExtension(String name) {
        if (name == null) {
            return false;
        }
        String lower = name.toLowerCase(Locale.US);
        return lower.endsWith(".prn") || lower.endsWith(".raw") || lower.endsWith(".bin");
    }

    private void runNetworkTask(String title, NetworkOperation operation) {
        if (busy) {
            Toast.makeText(this, "มีงานกำลังทำอยู่", Toast.LENGTH_SHORT).show();
            return;
        }
        setBusy(true);
        appendLog(title + "...");
        executor.execute(() -> {
            try {
                String result = operation.run();
                runOnUiThread(() -> appendLog(result));
            } catch (SocketTimeoutException error) {
                runOnUiThread(() -> appendLog("TIMEOUT: " + safeMessage(error)));
            } catch (IOException error) {
                runOnUiThread(() -> appendLog("FAILED: " + error.getClass().getSimpleName() + " — " + safeMessage(error)));
            } catch (RuntimeException error) {
                runOnUiThread(() -> appendLog("FAILED: " + error.getClass().getSimpleName() + " — " + safeMessage(error)));
            } finally {
                runOnUiThread(() -> setBusy(false));
            }
        });
    }

    private String safeMessage(Throwable error) {
        String message = error.getMessage();
        return message == null || message.trim().isEmpty() ? "ไม่มีรายละเอียดเพิ่มเติม" : message;
    }

    private void setBusy(boolean value) {
        busy = value;
        testButton.setEnabled(!value);
        chooseButton.setEnabled(!value);
        sendButton.setEnabled(!value);
    }

    private void appendLog(String message) {
        String time = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());
        String current = statusText.getText().toString();
        String line = "[" + time + "] " + message;
        statusText.setText(current.isEmpty() ? line : current + "\n" + line);
    }

    @Override
    protected void onDestroy() {
        executor.shutdownNow();
        super.onDestroy();
    }

    private interface NetworkOperation {
        String run() throws IOException;
    }

    private static final class PrinterTarget {
        final String ip;
        final int port;

        PrinterTarget(String ip, int port) {
            this.ip = ip;
            this.port = port;
        }
    }
}
