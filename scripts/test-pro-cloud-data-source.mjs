import assert from "node:assert/strict";
import fs from "node:fs";
import { resolveCloudPayload } from "../dist/assets/pro/data-source.js";

const originalFetch = globalThis.fetch;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockFetch(routes) {
  globalThis.fetch = async (url) => {
    const key = String(url);
    if (!(key in routes)) return jsonResponse({ error: "not_found" }, 404);
    const route = routes[key];
    return route instanceof Response ? route : jsonResponse(route);
  };
}

async function testLegacyArray() {
  const rows = [{ id: 1 }, { id: 2 }];
  mockFetch({ "https://signed/legacy": rows });
  const payload = await resolveCloudPayload({
    mode: "json_url",
    url: "https://signed/legacy",
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

async function testDirectPayload() {
  const payload = { rows: [{ id: "direct" }] };
  assert.deepEqual(
    await resolveCloudPayload({ mode: "inline", payload }),
    payload,
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
        part_index: 1,
        row_start: 0,
        row_count: 2,
        url: "https://signed/part-1",
      },
      {
        part_index: 2,
        row_start: 2,
        row_count: 1,
        url: "https://signed/part-2",
      },
    ],
  };
}

function multipartRoutes() {
  return {
    "https://signed/part-1": {
      schema: "doit-json-part-v1",
      version_id: "version-new",
      part_index: 1,
      row_start: 0,
      row_count: 2,
      rows: [{ id: 1 }, { id: 2 }],
    },
    "https://signed/part-2": {
      schema: "doit-json-part-v1",
      version_id: "version-new",
      part_index: 2,
      row_start: 2,
      row_count: 1,
      rows: [{ id: 3 }],
    },
  };
}

async function testMultipartInOrderWithProgress() {
  mockFetch(multipartRoutes());
  const progress = [];
  const payload = await resolveCloudPayload(multipartResponse(), {
    onProgress(value) {
      progress.push(value);
    },
  });

  assert.equal(payload.schema, "doit-json-v1");
  assert.equal(payload.version_id, "version-new");
  assert.deepEqual(payload.rows, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  assert.deepEqual(progress, [
    { partIndex: 1, partCount: 2, rowsLoaded: 2, rowCount: 3 },
    { partIndex: 2, partCount: 2, rowsLoaded: 3, rowCount: 3 },
  ]);
}

async function testMissingPartFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-2"] = jsonResponse({ error: "gone" }, 404);
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /JSON ส่วน 2\/2 โหลดไม่สำเร็จ \(HTTP 404\)/,
  );
}

async function testPartVersionMismatchFails() {
  const routes = multipartRoutes();
  routes["https://signed/part-2"].version_id = "another-version";
  mockFetch(routes);
  await assert.rejects(
    resolveCloudPayload(multipartResponse()),
    /เป็นคนละเวอร์ชัน/,
  );
}

async function testManifestGapFailsBeforeSecondFetch() {
  const response = multipartResponse();
  response.parts[1].row_start = 1;
  mockFetch(multipartRoutes());
  await assert.rejects(
    resolveCloudPayload(response),
    /ช่วงแถวขาดหรือซ้ำ/,
  );
}

async function testIncompleteTotalFails() {
  const response = multipartResponse();
  response.row_count = 4;
  response.active.row_count = 4;
  mockFetch(multipartRoutes());
  await assert.rejects(
    resolveCloudPayload(response),
    /จำนวนแถว JSON Cloud ไม่ครบ/,
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
    '"doit-json-part-v1"',
    "createSignedUrls(paths",
    "manifest_version_mismatch",
    "manifest_row_gap",
    "manifest_total_row_count",
    "MAX_MANIFEST_BYTES",
    "legacyResponse(active",
  ].forEach((token) => {
    assert.ok(source.includes(token), "Edge contract missing: " + token);
  });
}

try {
  await testLegacyArray();
  await testLegacyRowsObject();
  await testDirectPayload();
  await testMultipartInOrderWithProgress();
  await testMissingPartFails();
  await testPartVersionMismatchFails();
  await testManifestGapFailsBeforeSecondFetch();
  await testIncompleteTotalFails();
  await testOldBackendManifestFailsClearly();
  testEdgeFunctionContract();
  console.log(
    "Pro Cloud data source passed: legacy JSON, multipart JSON, progress, and corruption guards.",
  );
} finally {
  globalThis.fetch = originalFetch;
}
