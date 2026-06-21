import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const BUCKET = "doit-files";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function sha256Hex(input: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function authorized(req: Request) {
  const expectedHash = Deno.env.get("ADMIN_STORAGE_TOKEN_SHA256") || "";
  const expectedPlain = Deno.env.get("ADMIN_STORAGE_TOKEN") || "";
  const token = req.headers.get("x-admin-token") || "";
  if (!token || token.length > 180) return false;
  if (expectedHash) return (await sha256Hex(token)) === expectedHash;
  return Boolean(expectedPlain) && token === expectedPlain;
}

const cleanPath = (v: unknown) => String(v || "").trim();
const uniq = (list: string[]) => [...new Set(list.map(cleanPath).filter(Boolean))];
const sizeOf = (obj: any) => Number(obj?.metadata?.size || obj?.metadata?.contentLength || 0) || 0;

function cutoffDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - Math.max(1, Math.min(3650, days || 30)));
  return d;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (!(await authorized(req))) return json({ error: "unauthorized" }, 401);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRole) return json({ error: "missing_supabase_env" }, 500);

    const supabase = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: active, error: activeError } = await supabase
      .from("doit_versions")
      .select("id,file_name,file_size,storage_path,data_path,row_count,store_count,ps_count,telesale_bill_count,status,is_active,uploaded_at,data_status")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (activeError) return json({ error: "active_query_failed", detail: activeError.message }, 500);

    const { data: versions, error: versionsError } = await supabase
      .from("doit_versions")
      .select("id,file_name,file_size,storage_path,data_path,row_count,store_count,ps_count,telesale_bill_count,status,is_active,uploaded_at,data_status")
      .order("uploaded_at", { ascending: false })
      .limit(120);
    if (versionsError) return json({ error: "versions_query_failed", detail: versionsError.message }, 500);

    const { data: objects, error: objectsError } = await supabase
      .schema("storage")
      .from("objects")
      .select("id,bucket_id,name,metadata,created_at,updated_at,last_accessed_at")
      .eq("bucket_id", BUCKET)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (objectsError) return json({ error: "objects_query_failed", detail: objectsError.message }, 500);

    const activePaths = uniq([active?.storage_path, active?.data_path]);
    const latestPaths = uniq((objects || []).slice(0, 2).map((o: any) => o.name));
    const protectedPaths = uniq([...activePaths, ...latestPaths]);
    const versionByPath = new Map<string, any>();
    for (const v of versions || []) {
      if (v.storage_path) versionByPath.set(v.storage_path, v);
      if (v.data_path) versionByPath.set(v.data_path, v);
    }

    const files = (objects || []).map((obj: any) => {
      const version = versionByPath.get(obj.name) || null;
      return {
        id: obj.id,
        bucket_id: obj.bucket_id,
        path: obj.name,
        size: sizeOf(obj),
        created_at: obj.created_at,
        updated_at: obj.updated_at,
        last_accessed_at: obj.last_accessed_at,
        mime_type: obj?.metadata?.mimetype || obj?.metadata?.mimeType || "",
        is_active: activePaths.includes(obj.name),
        is_latest_protected: latestPaths.includes(obj.name),
        protected: protectedPaths.includes(obj.name),
        version: version ? {
          id: version.id,
          file_name: version.file_name,
          is_active: !!version.is_active,
          status: version.status,
          data_status: version.data_status,
          uploaded_at: version.uploaded_at,
          row_count: version.row_count,
          store_count: version.store_count,
          ps_count: version.ps_count,
          telesale_bill_count: version.telesale_bill_count,
        } : null,
      };
    });

    const totalBytes = files.reduce((sum: number, f: any) => sum + f.size, 0);
    const url = new URL(req.url);

    if (req.method === "GET") {
      if (url.searchParams.get("action") === "signed-url") {
        const path = cleanPath(url.searchParams.get("path"));
        if (!path) return json({ error: "missing_path" }, 400);
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
        if (error || !data?.signedUrl) return json({ error: "signed_url_failed", detail: error?.message || "missing_signed_url" }, 500);
        return json({ path, url: data.signedUrl, expires_in: 600 });
      }
      return json({
        bucket: BUCKET,
        active,
        protected_paths: protectedPaths,
        summary: { object_count: files.length, total_bytes: totalBytes, latest_upload: files[0]?.created_at || null },
        files,
        versions: versions || [],
      });
    }

    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");

    if (action === "cleanupOld") {
      const days = Number(body.days || 30) || 30;
      const cutoff = cutoffDate(days);
      const paths = files.filter((f: any) => !f.protected && new Date(f.created_at) < cutoff).map((f: any) => f.path);
      return json({ ok: true, dry_run: true, action, days, cutoff: cutoff.toISOString(), count: paths.length, paths: paths.slice(0, 200), write_enabled: false });
    }

    if (action === "deleteSelected" || action === "setActive") {
      return json({ error: "write_disabled_in_safe_preview", detail: "This deployed function is read-only/dry-run until write operations are enabled after admin review." }, 409);
    }

    return json({ error: "unknown_action" }, 400);
  } catch (err) {
    return json({ error: "unexpected_error", detail: String((err as Error)?.message || err) }, 500);
  }
});
