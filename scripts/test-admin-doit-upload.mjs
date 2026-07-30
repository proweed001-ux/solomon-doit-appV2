import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const uploadPath = new URL('../dist/assets/admin-upload-v001.js', import.meta.url);
const jsonPath = new URL('../dist/assets/admin-json-v265.js', import.meta.url);
const popupPath = new URL('../dist/assets/admin-progress-popup-v1.js', import.meta.url);
const performancePath = new URL('../dist/assets/admin-performance-active-v2.js', import.meta.url);
const storagePath = new URL('../dist/assets/admin-storage-manager-v1.js', import.meta.url);
const adminPath = new URL('../dist/admin.html', import.meta.url);
const uploadSource = fs.readFileSync(uploadPath, 'utf8');
const jsonSource = fs.readFileSync(jsonPath, 'utf8');
const popupSource = fs.readFileSync(popupPath, 'utf8');
const performanceSource = fs.readFileSync(performancePath, 'utf8');
const storageSource = fs.readFileSync(storagePath, 'utf8');
const adminHtml = fs.readFileSync(adminPath, 'utf8');

const state = {
  bodyChildren: [],
  listeners: new Map(),
  elements: new Map(),
};

function element(id = '') {
  const listeners = new Map();
  return {
    id,
    className: '',
    dataset: {},
    disabled: false,
    files: [],
    innerHTML: '',
    style: {},
    textContent: '',
    type: '',
    value: '',
    addEventListener(type, handler) { listeners.set(type, handler); },
    appendChild(child) { this.children ||= []; this.children.push(child); return child; },
    click() {},
    closest() { return null; },
    getAttribute() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    remove() {},
    setAttribute() {},
  };
}

const document = {
  body: {
    appendChild(child) { state.bodyChildren.push(child); return child; },
  },
  createElement: tag => element(tag),
  querySelector(selector) {
    if (!state.elements.has(selector)) state.elements.set(selector, element(selector));
    return state.elements.get(selector);
  },
  querySelectorAll() { return []; },
};

const localStorage = {
  values: new Map(),
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; },
  removeItem(key) { this.values.delete(key); },
  setItem(key, value) { this.values.set(key, String(value)); },
};

const context = {
  AbortController,
  Blob,
  DOMException,
  EventTarget,
  File: globalThis.File,
  FormData,
  Headers,
  JSON,
  Math,
  ReadableStream,
  Request,
  Response,
  Set,
  TextDecoder,
  TextEncoder,
  URL,
  URLSearchParams,
  atob,
  btoa,
  clearInterval,
  clearTimeout,
  console,
  crypto,
  document,
  fetch,
  globalThis: null,
  location: { href: 'https://example.test/admin.html' },
  localStorage,
  navigator: {},
  performance,
  queueMicrotask,
  setInterval,
  setTimeout,
  structuredClone,
  window: null,
};
context.window = context;
context.globalThis = context;
vm.createContext(context);
vm.runInContext(uploadSource, context, { filename: 'admin-upload-v001.js' });
vm.runInContext(jsonSource, context, { filename: 'admin-json-v265.js' });

const core = context.__ADMIN_DOIT_UPLOAD_CORE__;
assert.ok(core, 'Admin upload core test hooks must exist');

const rows = Array.from({ length: 12_345 }, (_, index) => ({
  storeId: `S${index + 1}`,
  ps: `PS${(index % 50) + 1}`,
  amount: index + 0.25,
  note: `ทดสอบ-${index}`,
}));
const compactRows = rows.slice(0, 24).map((row, index) => ({ ...row, note: `x-${index}` }));
const versionId = '11111111-2222-4333-8444-555555555555';
const parentPath = `parsed/2026-07-29/${versionId}`;
const manifestPath = `${parentPath}.json`;
const plan = core.buildMultipartPlan({
  rows,
  versionId,
  manifestPath,
  parentPath,
  metrics: { row_count: rows.length, store_count: rows.length, ps_count: 50, telesale_bill_count: 0 },
  maxPartBytes: 140 * 1024,
});
assert.equal(plan.manifest.schema, 'doit-json-parts-v1');
assert.equal(plan.manifest.part_count, plan.parts.length);
assert.equal(plan.manifest.total_rows, rows.length);
assert.ok(plan.parts.length > 1, 'fixture must split into more than one part');
assert.ok(plan.parts.every(part => part.byteLength <= 140 * 1024), 'every part must stay inside byte limit');
assert.ok(plan.parts.every((part, index) => part.path.endsWith(`part-${String(index + 1).padStart(4, '0')}.json`)));
assert.deepEqual(
  plan.parts.map(part => part.rowStart),
  plan.parts.map((_, index) => index === 0 ? 0 : plan.parts.slice(0, index).reduce((sum, item) => sum + item.rowCount, 0)),
);
assert.equal(plan.parts.reduce((sum, part) => sum + part.rowCount, 0), rows.length);
const firstPayload = JSON.parse(plan.parts[0].json);
assert.equal(firstPayload.schema, 'doit-json-part-v1');
assert.equal(firstPayload.version_id, versionId);
assert.equal(firstPayload.part_index, 0);
assert.equal(firstPayload.row_start, 0);
assert.equal(firstPayload.rows.length, plan.parts[0].rowCount);
assert.equal('row_count' in firstPayload, false);

const compactPlan = core.buildMultipartPlan({
  rows: compactRows,
  versionId,
  manifestPath,
  parentPath,
  metrics: { row_count: compactRows.length, store_count: compactRows.length, ps_count: 10, telesale_bill_count: 0 },
  maxPartBytes: 700,
});
assert.ok(compactPlan.parts.length > 1, 'compact fixture must remain multipart');
assert.equal(compactPlan.manifest.total_rows, compactRows.length);
assert.equal(compactPlan.parts.reduce((sum, part) => sum + part.rowCount, 0), compactRows.length);

const uploadedPaths = [];
const deletedPaths = [];
let activeWrites = 0;
const hooks = {
  put: async path => { uploadedPaths.push(path); },
  del: async paths => { deletedPaths.push(...paths); },
  setActive: async () => { activeWrites += 1; },
  verify: async () => ({ ok: true }),
};
await core.uploadMultipartPlan(plan, hooks);
assert.equal(uploadedPaths.at(-1), manifestPath, 'manifest must be written after all part files');
assert.deepEqual(uploadedPaths.slice(0, -1), plan.parts.map(part => part.path));
assert.equal(activeWrites, 1, 'Active version must be set only after all uploads and verification pass');
assert.deepEqual(deletedPaths, []);

uploadedPaths.length = 0;
deletedPaths.length = 0;
activeWrites = 0;
let putIndex = 0;
await assert.rejects(
  core.uploadMultipartPlan(plan, {
    ...hooks,
    put: async path => {
      uploadedPaths.push(path);
      putIndex += 1;
      if (putIndex === 3) throw new Error('simulated_part_failure');
    },
  }),
  /simulated_part_failure/,
);
assert.equal(activeWrites, 0, 'failed upload must never set Active');
assert.deepEqual(deletedPaths.sort(), uploadedPaths.sort(), 'failed upload must clean every object written during this attempt');

assert.ok(uploadSource.includes("file.arrayBuffer()"), 'Excel source should be read directly only once');
assert.equal((uploadSource.match(/\.arrayBuffer\(\)/g) || []).length, 1, 'Excel source must not be read twice');
assert.ok(!uploadSource.includes('uploadRaw'), 'raw Excel upload helper must not remain');
assert.ok(!uploadSource.includes('/raw/'), 'raw Excel path must not remain');
assert.ok(!uploadSource.includes("storage_path: rawPath"), 'version metadata must not point to raw Excel');
assert.ok(uploadSource.includes("storage_path: null"), 'version metadata must explicitly avoid storing original Excel');
assert.ok(uploadSource.includes("await cleanupUploadedObjects(uploadedPaths)"), 'partial upload cleanup must remain');
assert.ok(uploadSource.includes("await cleanupVersionRow(versionId)"), 'failed version row cleanup must remain');
assert.ok(uploadSource.includes("setBusy(true)"), 'one-click flow must enter busy state');
assert.ok(uploadSource.includes("setBusy(false)"), 'one-click flow must leave busy state');
assert.ok(uploadSource.includes("notify('fail'"), 'one-click flow must surface failures');
assert.ok(uploadSource.includes("window.__ADMIN_JSON_PIPELINE__?.run"), 'upload button must invoke the JSON pipeline directly');
assert.ok(jsonSource.includes("JSON_PART_MAX_BYTES"), 'JSON byte limit must be explicit');
assert.ok(jsonSource.includes("await uploadJsonParts"), 'multipart upload path must be explicit');
assert.ok(jsonSource.includes("await setActiveVersion"), 'Active update must remain explicit');
assert.ok(jsonSource.includes("await verifyActive"), 'Active verification must remain explicit');
assert.ok(jsonSource.includes("cleanupVersionRow"), 'failure cleanup must include version metadata');
assert.ok(jsonSource.includes("function splitRowsByByteSize"), 'row chunking must be byte-aware');
assert.ok(jsonSource.includes("row_bytes_exceed_limit"), 'oversized rows must fail explicitly');
assert.ok(!jsonSource.includes("saveRawOriginal"), 'JSON pipeline must not persist the source Excel');
assert.ok(!jsonSource.includes("rawPath"), 'JSON pipeline must not create a raw Excel path');
assert.ok(jsonSource.includes("upload.status"), 'progress UI must report upload status events');
assert.ok(jsonSource.includes("JSON_PART_MIN_BYTES"), 'part sizing lower bound must be explicit');
assert.ok(jsonSource.includes("if(typeof window.__ADMIN_UPLOAD_UPLOAD__==='function')"), 'pipeline must reuse parsed data from the upload core');
assert.ok(jsonSource.includes("cached parsed rows"), 'one-click pipeline must report cached row reuse');
assert.ok(!uploadSource.includes("await pivot(buffer).catch(()=>[])"), "Pivot parser failures must not be silently converted to a full-workbook fallback");
assert.ok(!popupSource.includes("file.addEventListener('change'"), "selecting a file must never open a blocking popup");
assert.ok(popupSource.includes("adminPopClose"), "the progress popup must always provide a close control");
assert.ok(!popupSource.includes("/เสร็จ|สำเร็จ|active|ล่าสุด|พร้อมใช้งาน/i"), "the popup must not claim success from broad words before Active is confirmed");
assert.ok(popupSource.includes("percent>=100") && popupSource.includes("Cloud JSON active"), "popup success requires the confirmed terminal status");
assert.ok(storageSource.includes("ยังไม่สแกน Storage อัตโนมัติ"), "Storage inventory must be user-triggered to avoid competing with DOIT processing");
assert.ok(!performanceSource.includes("window.XLSX.read=function"), "Performance must not retain workbooks from unrelated DOIT reads");
assert.ok(adminHtml.includes("window.__PERF_LAST_WB=wb"), "Performance may retain only the workbook it explicitly loaded");
assert.ok(adminHtml.includes("admin-json-v265.js?v=337"));
assert.ok(adminHtml.includes("admin-progress-popup-v1.js?v=3"));
assert.ok(adminHtml.includes("admin-storage-manager-v1.js?v=7"));
assert.ok(adminHtml.includes("admin-performance-active-v2.js?v=3"));

const progressText = core.formatUploadProgress(5 * 1024 * 1024, 20 * 1024 * 1024, 27_000, false);
assert.match(progressText, /5\.00 \/ 20\.0 MB · 25% · 27 วินาที/);
const stalledText = core.formatUploadProgress(0, 20 * 1024 * 1024, 16_000, true);
assert.match(stalledText, /ระบบยังรออยู่/);
console.log(`Admin DOIT upload guards passed: ${rows.length.toLocaleString('en-US')} rows, ${plan.parts.length} chunks, no raw Excel upload.`);
