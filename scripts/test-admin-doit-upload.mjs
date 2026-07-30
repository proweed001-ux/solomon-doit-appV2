import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const uploadPath = "dist/assets/admin-json-v265.js";
const pickerPath = "dist/assets/admin-upload-v001.js";
const uploadSource = fs.readFileSync(uploadPath, "utf8");
const pickerSource = fs.readFileSync(pickerPath, "utf8");
const popupSource = fs.readFileSync("dist/assets/admin-progress-popup-v1.js", "utf8");
const storageSource = fs.readFileSync("dist/assets/admin-storage-manager-v1.js", "utf8");
const performanceSource = fs.readFileSync("dist/assets/admin-performance-active-v2.js", "utf8");
const adminHtml = fs.readFileSync("dist/admin.html", "utf8");

assert.equal(
  (uploadSource.match(/await pivot\(buffer\)/g) || []).length,
  1,
  "DOIT must parse the selected workbook only once",
);
assert.ok(
  uploadSource.includes("buffer=null"),
  "the source ArrayBuffer must be released before JSON construction",
);
assert.ok(
  uploadSource.includes("internalStream('string')") &&
    uploadSource.includes("stream.pause()") &&
    uploadSource.includes("await nextTask()"),
  "pivot records must be streamed in yielding chunks on memory-constrained phones",
);
assert.ok(
  !uploadSource.includes("recordsFile.async('string')"),
  "pivot record XML must never be expanded into one giant in-memory string",
);
assert.ok(
  uploadSource.includes("source_file:{name:file.name,size:file.size,stored:false}"),
  "the payload must record that the original Excel file was not stored",
);
assert.ok(
  uploadSource.includes("storage_path:dataPath"),
  "metadata must point both paths to the uploaded JSON object",
);
assert.ok(
  !uploadSource.includes("put(c,xPath"),
  "the original Excel file must never be uploaded",
);
assert.ok(
  !uploadSource.includes("`doit/${day}/"),
  "the browser upload flow must not create raw DOIT storage paths",
);
assert.ok(
  uploadSource.includes("removeObject(c,dataPath)"),
  "a failed publish must clean up an uploaded JSON object",
);

const jsonUpload = uploadSource.indexOf("await uploadJsonWithVerification(c,dataPath,payload,JSON_MIME,UPLOAD_TIMEOUT_MS");
const metadataInsert = uploadSource.indexOf("await insertMetadata(c,{");
const activate = uploadSource.indexOf("await setActiveRpc(c,id)");
assert.ok(jsonUpload >= 0, "JSON upload step is missing");
assert.ok(metadataInsert > jsonUpload, "metadata must be inserted only after JSON upload");
assert.ok(activate > metadataInsert, "the version must become active only after metadata insert");

assert.ok(
  !pickerSource.includes("FileReader") &&
    !pickerSource.includes("XLSX.read") &&
    !pickerSource.includes("JSZip"),
  "file selection must stay lightweight and must not parse the workbook",
);
assert.ok(
  !pickerSource.includes("handleFile("),
  "the retired duplicate parser must not remain callable",
);
assert.ok(
  pickerSource.includes("ปุ่มนี้ถูกโอนให้ admin-json-v265.js จัดการแล้ว"),
  "the single upload owner guard must remain present",
);

const formula =
  "TotInvc > Correct Amount/LineAmount > LineAmtBeforeDisc > detailAmt > row.amt > Amt > Amount > InvoiceAmt";
for (const [path, source] of [
  [uploadPath, uploadSource],
  [pickerPath, pickerSource],
]) {
  assert.ok(source.includes(formula), `${path} must retain the unified amount formula`);
  assert.ok(
    source.indexOf("TotInvc") < source.indexOf("InvoiceAmt"),
    `${path} must prioritize TotInvc before InvoiceAmt`,
  );
}

const previousWindow = globalThis.window;
const previousDocument = globalThis.document;
globalThis.window = globalThis;
globalThis.document = { addEventListener() {} };
vm.runInThisContext(uploadSource, { filename: uploadPath });

const core = globalThis.AdminDoitUploadCore;
assert.equal(typeof core?.buildPayloadBlob, "function");
assert.equal(typeof core?.streamPivotRecords, "function");

class ChunkStream {
  constructor(chunks) {
    this.chunks = [...chunks];
    this.handlers = {};
    this.scheduled = false;
  }
  on(name, handler) {
    this.handlers[name] = handler;
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    if (this.scheduled) return this;
    this.scheduled = true;
    queueMicrotask(() => {
      this.scheduled = false;
      if (this.chunks.length) this.handlers.data?.(this.chunks.shift());
      else this.handlers.end?.();
    });
    return this;
  }
}

const pivotXml =
  '<pivotCacheRecords count="2"><r><n v="2"/><n v="100"/><s v="SKU-A"/></r>' +
  '<r><n v="3"/><n v="0"/><s v="SKU-B"/></r></pivotCacheRecords>';
const pivotChunks = [
  pivotXml.slice(0, 39),
  pivotXml.slice(39, 77),
  pivotXml.slice(77, 111),
  pivotXml.slice(111),
];
const pivotRows = await core.streamPivotRecords(
  { internalStream: () => new ChunkStream(pivotChunks) },
  [
    { name: "ShipQtyPCS", shared: [] },
    { name: "TotInvc", shared: [] },
    { name: "SKU_Code", shared: [] },
  ],
  2,
);
assert.equal(pivotRows.length, 2, "streamed Pivot rows must survive chunk boundaries");
assert.equal(pivotRows[0].qty, 2);
assert.equal(pivotRows[0].amt, 100);
assert.equal(pivotRows[1].qty, 3);
assert.equal(pivotRows[1].amt, 0, "explicit zero must survive streamed Pivot parsing");
assert.equal(pivotRows[1].code, "SKU-B");

const rows = Array.from({ length: 12_345 }, (_, index) => ({
  inv: `INV-${index}`,
  store: `STORE-${index % 733}`,
  ps: `AYAPS${String(index % 28).padStart(2, "0")}`,
  qty: index % 11,
  amt: index % 7 === 0 ? 0 : index * 1.25,
  amountSource: index % 7 === 0 ? "TotInvc" : "Correct Amount",
}));
const expectedFirst = structuredClone(rows[0]);
const expectedLast = structuredClone(rows.at(-1));
const progress = [];
const metadata = {
  schema: "doit-json-v1",
  data_schema_version: 4,
  source_file: { name: "fixture.xlsx", size: 123, stored: false },
};

const blob = await core.buildPayloadBlob(metadata, rows, {
  chunkSize: 500,
  onProgress(done, total) {
    progress.push({ done, total });
  },
});
assert.equal(rows.length, 0, "row objects must be released after chunked encoding");
assert.ok(progress.length > 20, "large payloads must be encoded in multiple chunks");
assert.deepEqual(progress.at(-1), { done: 12_345, total: 12_345 });

const payload = JSON.parse(await blob.text());
assert.equal(payload.schema, "doit-json-v1");
assert.equal(payload.data_schema_version, 4);
assert.equal(payload.source_file.stored, false);
assert.equal(payload.rows.length, 12_345);
assert.deepEqual(payload.rows[0], expectedFirst);
assert.deepEqual(payload.rows.at(-1), expectedLast);
assert.equal(payload.rows[0].amt, 0, "explicit zero values must survive chunked JSON");

globalThis.window = previousWindow;
globalThis.document = previousDocument;

console.log(
  `Admin DOIT upload guards passed: ${payload.rows.length.toLocaleString()} rows, ${progress.length} chunks, no raw Excel upload.`,
);

assert.ok(uploadSource.includes("AbortController"), "all cloud writes must have timeouts");
assert.ok(uploadSource.includes("insertMetadata(c,{"), "metadata insert must have post-timeout verification");
assert.ok(uploadSource.includes("stateUnknown"), "unknown cloud state must not trigger destructive cleanup");
assert.ok(pickerSource.includes("แปลง JSON และอัปโหลด"), "the Admin must expose one clear upload button");


assert.ok(uploadSource.includes("new XMLHttpRequest()"), "Storage upload must use XHR for real byte progress");
assert.ok(uploadSource.includes("xhr.upload.onprogress"), "real upload progress events are required");
assert.ok(uploadSource.includes("formatUploadProgress"), "upload MB, percent, and elapsed time must be visible");
assert.ok(uploadSource.includes("verifyUploadedObject"), "uncertain uploads must be verified by Storage object info");
assert.ok(uploadSource.includes("info?.metadata?.size"), "post-timeout verification must compare the stored byte size");
assert.ok(uploadSource.includes("beforeunload"), "leaving the page during upload must trigger a browser warning");
assert.ok(uploadSource.includes("setBusyState(true)") && uploadSource.includes("setBusyState(false)"), "file and upload controls must be locked only while busy");
assert.ok(!uploadSource.includes("await pivot(buffer).catch(()=>[])"), "Pivot parser failures must not be silently converted to a full-workbook fallback");
assert.ok(!popupSource.includes("file.addEventListener('change'"), "selecting a file must never open a blocking popup");
assert.ok(popupSource.includes("adminPopClose"), "the progress popup must always provide a close control");
assert.ok(!popupSource.includes("/เสร็จ|สำเร็จ|active|ล่าสุด|พร้อมใช้งาน/i"), "the popup must not claim success from broad words before Active is confirmed");
assert.ok(popupSource.includes("percent>=100") && popupSource.includes("Cloud JSON active"), "popup success requires the confirmed terminal status");
assert.ok(storageSource.includes("ยังไม่สแกน Storage อัตโนมัติ"), "Storage inventory must be user-triggered to avoid competing with DOIT processing");
assert.ok(!performanceSource.includes("window.XLSX.read=function"), "Performance must not retain workbooks from unrelated DOIT reads");
assert.ok(adminHtml.includes("window.__PERF_LAST_WB=wb"), "Performance may retain only the workbook it explicitly loaded");
assert.ok(adminHtml.includes("admin-json-v265.js?v=335"));
assert.ok(adminHtml.includes("admin-progress-popup-v1.js?v=2"));
assert.ok(adminHtml.includes("admin-storage-manager-v1.js?v=4"));
assert.ok(adminHtml.includes("admin-performance-active-v2.js?v=3"));

const progressText = core.formatUploadProgress(5 * 1024 * 1024, 20 * 1024 * 1024, 27_000, false);
assert.match(progressText, /5\.00 \/ 20\.0 MB · 25% · 27 วินาที/);
const stalledText = core.formatUploadProgress(0, 20 * 1024 * 1024, 16_000, true);
assert.match(stalledText, /ระบบยังรออยู่/);
