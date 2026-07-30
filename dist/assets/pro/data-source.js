export const ACTIVE_ENDPOINT =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/doit-active";

function positiveInt(value, label, allowZero = false) {
  const number = Number(value);
  if (!Number.isInteger(number) || (allowZero ? number < 0 : number <= 0)) {
    throw new Error("ข้อมูล Cloud ไม่ถูกต้อง: " + label);
  }
  return number;
}

async function fetchJson(url, label) {
  if (!url) throw new Error("ข้อมูล Cloud ไม่ถูกต้อง: ไม่มี URL สำหรับ " + label);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      label +
        " โหลดไม่สำเร็จ (HTTP " +
        response.status +
        ")" +
        (errorText ? ": " + errorText.slice(0, 180) : ""),
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(label + " ไม่ใช่ JSON ที่สมบูรณ์");
  }
}

function rowsFromLegacyPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return null;
}

function expectedRowCount(response) {
  const value = Number(response?.row_count ?? response?.active?.row_count);
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function assertLegacyPayload(payload, response) {
  if (
    payload?.schema === "doit-json-manifest-v1" ||
    Array.isArray(payload?.parts)
  ) {
    throw new Error(
      "ระบบ Cloud ยังไม่รองรับ JSON หลายส่วน กรุณาอัปเดตฟังก์ชัน doit-active",
    );
  }

  const rows = rowsFromLegacyPayload(payload);
  const expected = expectedRowCount(response);
  if (!rows || (expected > 0 && rows.length === 0)) {
    throw new Error("JSON Cloud ไม่มีข้อมูลแถวที่อ่านได้");
  }
  if (expected !== null && rows.length !== expected) {
    throw new Error(
      "จำนวนแถว JSON Cloud ไม่ครบ: ได้ " + rows.length + " จาก " + expected,
    );
  }
  return payload;
}

async function resolveMultipartPayload(response, onProgress) {
  const parts = response?.parts;
  const partCount = positiveInt(response?.part_count, "part_count");
  const rowCount = positiveInt(response?.row_count, "row_count", true);
  const responseVersionId = String(response?.version_id || "");
  const activeVersionId = String(response?.active?.id || "");
  const versionId = responseVersionId || activeVersionId;

  if (response?.schema !== "doit-json-manifest-v1") {
    throw new Error("ข้อมูล Cloud ไม่ถูกต้อง: schema ของ manifest");
  }
  if (!versionId) throw new Error("ข้อมูล Cloud ไม่ถูกต้อง: version_id");
  if (
    responseVersionId &&
    activeVersionId &&
    responseVersionId !== activeVersionId
  ) {
    throw new Error("ข้อมูล Cloud เป็นคนละเวอร์ชันกับข้อมูลที่ active");
  }
  if (!Array.isArray(parts) || parts.length !== partCount) {
    throw new Error("ข้อมูล Cloud ไม่ครบ: จำนวนส่วนไม่ตรงกับ manifest");
  }

  const rows = [];
  let nextRowStart = 0;

  for (let index = 0; index < parts.length; index += 1) {
    const descriptor = parts[index] || {};
    const storagePartIndex = positiveInt(
      descriptor.part_index,
      "part_index",
      true,
    );
    const displayPartIndex = index + 1;
    const descriptorStart = positiveInt(
      descriptor.row_start,
      "row_start",
      true,
    );
    const descriptorCount = positiveInt(
      descriptor.row_count,
      "part row_count",
    );

    if (storagePartIndex !== index) {
      throw new Error("ข้อมูล Cloud ผิดลำดับที่ส่วน " + displayPartIndex);
    }
    if (descriptorStart !== nextRowStart) {
      throw new Error(
        "ข้อมูล Cloud มีช่วงแถวขาดหรือซ้ำที่ส่วน " + displayPartIndex,
      );
    }

    const payload = await fetchJson(
      descriptor.url,
      "JSON ส่วน " + displayPartIndex + "/" + partCount,
    );
    if (payload?.schema !== "doit-json-part-v1") {
      throw new Error(
        "JSON ส่วน " + displayPartIndex + " ใช้ schema ไม่ถูกต้อง",
      );
    }
    if (String(payload.version_id || "") !== versionId) {
      throw new Error("JSON ส่วน " + displayPartIndex + " เป็นคนละเวอร์ชัน");
    }
    if (
      positiveInt(payload.part_index, "payload part_index", true) !==
      storagePartIndex
    ) {
      throw new Error(
        "JSON ส่วน " + displayPartIndex + " มีเลขส่วนไม่ตรงกัน",
      );
    }
    if (
      positiveInt(payload.row_start, "payload row_start", true) !==
      descriptorStart
    ) {
      throw new Error(
        "JSON ส่วน " + displayPartIndex + " มีตำแหน่งแถวไม่ตรงกัน",
      );
    }
    if (!Array.isArray(payload.rows)) {
      throw new Error("JSON ส่วน " + displayPartIndex + " ไม่มี rows");
    }

    const payloadCount =
      payload.row_count == null
        ? descriptorCount
        : positiveInt(payload.row_count, "payload row_count");
    if (
      payload.rows.length !== descriptorCount ||
      payloadCount !== descriptorCount
    ) {
      throw new Error("JSON ส่วน " + displayPartIndex + " มีจำนวนแถวไม่ครบ");
    }

    rows.push(...payload.rows);
    nextRowStart += descriptorCount;
    onProgress({
      partIndex: displayPartIndex,
      partCount,
      rowsLoaded: rows.length,
      rowCount,
    });
  }

  if (rows.length !== rowCount || nextRowStart !== rowCount) {
    throw new Error(
      "จำนวนแถว JSON Cloud ไม่ครบ: ได้ " + rows.length + " จาก " + rowCount,
    );
  }

  const activeRows = Number(response?.active?.row_count);
  if (
    Number.isInteger(activeRows) &&
    activeRows >= 0 &&
    activeRows !== rowCount
  ) {
    throw new Error("จำนวนแถว manifest ไม่ตรงกับเวอร์ชันที่ active");
  }

  return {
    schema: response?.payload_schema || "doit-json-v1",
    data_schema_version:
      response?.data_schema_version ?? response?.active?.data_schema_version,
    version_id: versionId,
    rows,
  };
}

export async function publicFetch(mode) {
  const response = await fetch(ACTIVE_ENDPOINT + "?mode=" + mode, {
    headers: { Accept: "application/json" },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text || String(response.status));
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("คำตอบจาก Cloud ไม่ใช่ JSON ที่สมบูรณ์");
  }
}

export async function resolveCloudPayload(response, options = {}) {
  const onProgress =
    typeof options.onProgress === "function" ? options.onProgress : () => {};

  if (response?.mode === "json_parts") {
    return resolveMultipartPayload(response, onProgress);
  }
  if (response?.mode === "json_url") {
    const payload = await fetchJson(response.url, "JSON Cloud");
    return assertLegacyPayload(payload, response);
  }
  if (response?.payload !== undefined) {
    return assertLegacyPayload(response.payload, response);
  }

  throw new Error("รูปแบบคำตอบจาก Cloud ไม่รองรับ");
}
