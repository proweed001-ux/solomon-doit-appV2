import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { resolveCloudPayload } from "../dist/assets/pro/data-source.js";

const originalFetch = globalThis.fetch;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockFetch(routes, requests = []) {
  globalThis.fetch = async (url) => {
    const key = String(url);
    requests.push(key);
    if (!(key in routes)) return jsonResponse({ error: "not_found" }, 404);
    const route = routes[key];
    if (typeof route === "function") return route();
    return route instanceof Response ? route : jsonResponse(route);
  };
}

async function testLegacyArray() {
  const rows = [{ id: 1 }, { id: 2 }];
  mockFetch({ "https://signed/legacy-array": rows });
  const payload = await resolveCloudPayload({
    mode: "json_url",
    url: "https://signed/legacy-array",
    active: { row_count: 2 },
  });
  assert.deepEqual(payload, rows);
}

async function testLegacyRowsObject() {
  const payload = { schema: "doit-json-v1", rows: [{ id: "old" }] };
  mockFetch({ "https://signed/legacy-object": payload });
  assert.deepEqual(
    await resolveCloudPayload({
      mode: "json_url",
      url: "https://signed/legacy-object",
      active: { row_count: 1 },
    }),
    payload,
  );
}

async function testDirectLegacyPayload() {
  const payload = { rows: [{ id: "direct" }] };
  assert.deepEqual(
    await resolveCloudPayload({
      mode: "inline",
      payload,
      row_count: 1,
    }),
    payload,
  );
}

async function testLegacyIncompleteRowsFails() {
  mockFetch({
    "https://signed/legacy-incomplete": [{ id: 1 }],
  });
  await assert.rejects(
    resolveCloudPayload({
      mode: "json_url",
      url: "https://signed/legacy-incomplete",
      active: { row_count: 2 },
    }),
    /จำนวนแถว JSON Cloud ไม่ครบ: ได้ 1 จาก 2/,
  );
}

function multipartResponse() {
  return {
    mode: "json_parts",
    schema: "doit-json-manifest-v1",
    payload_schema: "doit-json-v1",
    data_schema_version: 1,
    version_id: "version-new",
    row_count: 3,
    part_count: 2,
    active: { id: "version-new", row_count: 3 },
    parts: [
      {
        part_index: 0,
        row_start: 0,
        row_count: 2,
        url: "https://signed/part-0",
      },
      {
        part_index: 1,
        row_start: 2,
        row_count: 1,
        url: "https://signed/part-1",
      },
    ],
  };
}

function multipartRoutes() {
  return {
    "https://signed/part-0": {
      schema: "doit-json-part-v1",
      version_id: "version-new",
      part_index: 0,
      row_start: 0,
      rows: [{ id: 1 }, { id: 2 }],
    },
    "https://signed/part-1": {
      schema: "doit-json-part-v1",
      version_id: "version-new",
      part_index: 1,
      row_start: 2,
      rows: [{ id: 3 }],
    },
  };
}

async function testMultipartInOrderWithoutPayloadRowCount() {
  const requests = [];
  mockFetch(multipartRoutes(), requests);
  const progress = [];
  const payload = await resolveCloudPayload(multipartResponse(), {
    onProgress(value) {
      progress.push(value);
    },
  });

  assert.equal(payload.schema, "doit-json-v1");
  assert.equal(payload.version_id, "version-new");
  assert.deepEqual(payload.rows, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  assert.deepEqual(requests, [
    "https://signed/part-0",
    "https://signed/part-1",
  ]);
  assert.deepEqual(progress, [
    { partIndex: 1, partCount: 2, rowsLoaded: 2, rowCount: 3 },
    { partIndex: 2, partCount: 2, rowsLoaded: 3, rowCount: 3 },
  ]);
}

async function testMissingPartFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-1"] = jsonResponse({ error: "gone" }, 404);
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /JSON ส่วน 2\/2 โหลดไม่สำเร็จ \(HTTP 404\)/,
  );
}

async function testCorruptPartSchemaFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-1"].schema = "broken-schema";
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /JSON ส่วน 2 ใช้ schema ไม่ถูกต้อง/,
  );
}

async function testPartVersionMismatchFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-1"].version_id = "another-version";
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /JSON ส่วน 2 เป็นคนละเวอร์ชัน/,
  );
}

async function testActiveVersionMismatchFails() {
  const response = multipartResponse();
  response.active.id = "another-version";
  mockFetch(multipartRoutes());
  await assert.rejects(
    resolveCloudPayload(response),
    /ข้อมูล Cloud เป็นคนละเวอร์ชันกับข้อมูลที่ active/,
  );
}

async function testZeroBasedPartIndexMismatchFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-0"].part_index = 1;
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /JSON ส่วน 1 มีเลขส่วนไม่ตรงกัน/,
  );
}

async function testManifestOrderFailsBeforeFetchingPart() {
  const response = multipartResponse();
  response.parts[0].part_index = 1;
  const requests = [];
  mockFetch(multipartRoutes(), requests);
  await assert.rejects(
    resolveCloudPayload(response),
    /ข้อมูล Cloud ผิดลำดับที่ส่วน 1/,
  );
  assert.deepEqual(requests, []);
}

async function testManifestGapFailsBeforeSecondFetch() {
  const response = multipartResponse();
  response.parts[1].row_start = 1;
  const requests = [];
  mockFetch(multipartRoutes(), requests);
  await assert.rejects(
    resolveCloudPayload(response),
    /ช่วงแถวขาดหรือซ้ำที่ส่วน 2/,
  );
  assert.deepEqual(requests, ["https://signed/part-0"]);
}

async function testPartRowCountMismatchFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-1"].rows = [];
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /JSON ส่วน 2 มีจำนวนแถวไม่ครบ/,
  );
}

async function testIncompleteTotalFails() {
  const response = multipartResponse();
  response.row_count = 4;
  response.active.row_count = 4;
  mockFetch(multipartRoutes());
  await assert.rejects(
    resolveCloudPayload(response),
    /จำนวนแถว JSON Cloud ไม่ครบ: ได้ 3 จาก 4/,
  );
}

async function testOldBackendManifestFailsClearly() {
  mockFetch({
    "https://signed/manifest": {
      schema: "doit-json-manifest-v1",
      part_count: 2,
      parts: [{}, {}],
    },
  });
  await assert.rejects(
    resolveCloudPayload({
      mode: "json_url",
      url: "https://signed/manifest",
      active: { row_count: 3 },
    }),
    /อัปเดตฟังก์ชัน doit-active/,
  );
}

function testEdgeFunctionContract() {
  const source = fs.readFileSync(
    "supabase/functions/doit-active/index.ts",
    "utf8",
  );
  [
    'mode: "json_parts"',
    '"doit-json-manifest-v1"',
    "createSignedUrls(paths",
    "manifest_version_mismatch",
    "manifest_row_gap",
    "manifest_total_row_count",
    "MAX_MANIFEST_BYTES",
    ".list(folder",
    "legacyResponse(active",
  ].forEach((token) => {
    assert.ok(source.includes(token), "Edge contract missing: " + token);
  });
  assert.ok(!source.includes('.schema("storage")'));
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
    reportDiagnostics: true,
  });
  const syntaxErrors = (transpiled.diagnostics || []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  assert.deepEqual(
    syntaxErrors.map((diagnostic) => diagnostic.messageText),
    [],
    "Edge Function must have valid TypeScript syntax",
  );
}

try {
  await testLegacyArray();
  await testLegacyRowsObject();
  await testDirectLegacyPayload();
  await testLegacyIncompleteRowsFails();
  await testMultipartInOrderWithoutPayloadRowCount();
  await testMissingPartFails();
  await testCorruptPartSchemaFails();
  await testPartVersionMismatchFails();
  await testActiveVersionMismatchFails();
  await testZeroBasedPartIndexMismatchFails();
  await testManifestOrderFailsBeforeFetchingPart();
  await testManifestGapFailsBeforeSecondFetch();
  await testPartRowCountMismatchFails();
  await testIncompleteTotalFails();
  await testOldBackendManifestFailsClearly();
  testEdgeFunctionContract();
  console.log(
    "Pro Cloud data source passed: legacy Array/{rows}, v7 multipart, zero-based order, progress, corruption guards, and Edge contract.",
  );
} finally {
  globalThis.fetch = originalFetch;
}
