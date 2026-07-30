import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const BUCKET = "doit-files";
const SIGNED_URL_SECONDS = 60 * 60;
const MAX_MANIFEST_BYTES = 512 * 1024;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function integer(value: unknown, label: string, allowZero = false) {
  const number = Number(value);
  if (!Number.isInteger(number) || (allowZero ? number < 0 : number <= 0)) {
    throw new Error("invalid_" + label);
  }
  return number;
}

function legacyResponse(active: Record<string, unknown>, signedUrl: string) {
  return json({
    active,
    mode: "json_url",
    url: signedUrl,
    expires_in: SIGNED_URL_SECONDS,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const key = serviceRole || anonKey;
    if (!supabaseUrl || !key) return json({ error: "missing_supabase_env" }, 500);

    const supabase = createClient(supabaseUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "meta";

    const { data: active, error: activeError } = await supabase
      .from("doit_versions")
      .select("id,file_name,file_size,storage_path,data_path,data_status,data_schema_version,row_count,store_count,ps_count,telesale_bill_count,status,is_active,uploaded_at")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeError) {
      return json({ error: "active_query_failed", detail: activeError.message }, 500);
    }
    if (!active) return json({ error: "no_active_version" }, 404);

    if (mode === "meta") {
      return json({ active, mode: active.data_path ? "json_url" : "excel_fallback" });
    }
    if (mode !== "data") return json({ error: "unsupported_mode" }, 400);

    if (!active.data_path) {
      return json({ active, mode: "excel_fallback", url: null });
    }

    const { data: activeSigned, error: activeSignedError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(active.data_path, SIGNED_URL_SECONDS);

    if (activeSignedError || !activeSigned?.signedUrl) {
      return json({
        error: "signed_url_failed",
        detail: activeSignedError?.message || "missing_signed_url",
        active,
      }, 500);
    }

    // Old versions point directly to one potentially large JSON file. Inspect only
    // small objects; this prevents the Edge Function from loading legacy 40–50 MB
    // payloads into memory merely to determine their format.
    const { data: objectInfo, error: objectInfoError } = await supabase
      .schema("storage")
      .from("objects")
      .select("metadata")
      .eq("bucket_id", BUCKET)
      .eq("name", active.data_path)
      .limit(1)
      .maybeSingle();

    const objectSize = Number(objectInfo?.metadata?.size);
    if (
      objectInfoError ||
      !Number.isFinite(objectSize) ||
      objectSize <= 0 ||
      objectSize > MAX_MANIFEST_BYTES
    ) {
      return legacyResponse(active, activeSigned.signedUrl);
    }

    const { data: objectBlob, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(active.data_path);

    if (downloadError || !objectBlob) {
      return json({
        error: "manifest_download_failed",
        detail: downloadError?.message || "missing_manifest",
        active,
      }, 500);
    }

    let manifest: Record<string, unknown>;
    try {
      manifest = JSON.parse(await objectBlob.text());
    } catch {
      return legacyResponse(active, activeSigned.signedUrl);
    }

    if (manifest.schema !== "doit-json-manifest-v1") {
      return legacyResponse(active, activeSigned.signedUrl);
    }

    const versionId = String(manifest.version_id || "");
    const partCount = integer(manifest.part_count, "part_count");
    const rowCount = integer(manifest.row_count, "row_count", true);
    const parts = manifest.parts;

    if (versionId !== String(active.id)) throw new Error("manifest_version_mismatch");
    if (!Array.isArray(parts) || parts.length !== partCount) {
      throw new Error("manifest_part_count_mismatch");
    }
    if (Number(active.row_count) !== rowCount) {
      throw new Error("manifest_active_row_count_mismatch");
    }
    if (manifest.payload_schema !== "doit-json-v1") {
      throw new Error("manifest_payload_schema_mismatch");
    }

    const prefix = active.data_path.replace(/\.json$/i, "/");
    if (prefix === active.data_path) throw new Error("invalid_manifest_path");

    let nextRowStart = 0;
    const paths = parts.map((rawPart: unknown, index: number) => {
      const part = (rawPart || {}) as Record<string, unknown>;
      const partIndex = integer(part.part_index, "part_index");
      const rowStart = integer(part.row_start, "row_start", true);
      const partRows = integer(part.row_count, "part_row_count");
      const path = String(part.path || "");
      const expectedPath =
        prefix + "part-" + String(index + 1).padStart(4, "0") + ".json";

      if (partIndex !== index + 1) throw new Error("manifest_part_order");
      if (rowStart !== nextRowStart) throw new Error("manifest_row_gap");
      if (path !== expectedPath) throw new Error("manifest_part_path");
      nextRowStart += partRows;
      return path;
    });

    if (nextRowStart !== rowCount) throw new Error("manifest_total_row_count");

    const { data: signedParts, error: signedPartsError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, SIGNED_URL_SECONDS);

    if (signedPartsError || !Array.isArray(signedParts)) {
      return json({
        error: "part_signed_urls_failed",
        detail: signedPartsError?.message || "missing_signed_urls",
        active,
      }, 500);
    }

    const signedByPath = new Map(
      signedParts.map((item) => [item.path, item]),
    );
    const responseParts = parts.map((rawPart: unknown) => {
      const part = rawPart as Record<string, unknown>;
      const signed = signedByPath.get(String(part.path));
      if (!signed?.signedUrl || signed.error) {
        throw new Error("missing_part_signed_url");
      }
      return {
        part_index: part.part_index,
        row_start: part.row_start,
        row_count: part.row_count,
        path: part.path,
        url: signed.signedUrl,
      };
    });

    return json({
      active,
      mode: "json_parts",
      schema: "doit-json-manifest-v1",
      payload_schema: "doit-json-v1",
      data_schema_version:
        manifest.data_schema_version ?? active.data_schema_version,
      version_id: versionId,
      row_count: rowCount,
      part_count: partCount,
      parts: responseParts,
      expires_in: SIGNED_URL_SECONDS,
    });
  } catch (err) {
    return json({
      error: "invalid_active_data",
      detail: String((err as Error)?.message || err),
    }, 500);
  }
});
