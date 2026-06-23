import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const BUCKET = "doit-files";
const QR_PATH = "team/dev-qr.png";
const CONFIG_PATH = "team/dev-qr-config.json";
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) return json({ error: "missing_supabase_env" }, 500);

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "config";

  if (action === "image") {
    const { data, error } = await supabase.storage.from(BUCKET).download(QR_PATH);
    if (error || !data) return json({ error: "qr_image_not_found", detail: error?.message || "missing_data" }, 404);
    return new Response(data, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  }

  const { data, error } = await supabase.storage.from(BUCKET).download(CONFIG_PATH);
  if (error || !data) {
    return json({ schema: "aya-dev-qr-v1", enabled: false, reason: "config_not_found" });
  }

  const raw = await data.text();
  let config: Record<string, unknown> = {};
  try { config = JSON.parse(raw); } catch { config = {}; }
  const updatedAt = String(config.updated_at || new Date().toISOString());
  const imageUrl = `${supabaseUrl}/functions/v1/dev-qr?action=image&t=${encodeURIComponent(updatedAt)}`;

  return json({
    ...config,
    schema: "aya-dev-qr-v1",
    enabled: config.enabled !== false,
    image_url: imageUrl,
    storage_path: QR_PATH,
  });
});
