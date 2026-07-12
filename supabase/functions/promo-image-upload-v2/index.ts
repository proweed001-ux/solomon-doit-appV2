import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,x-client-info,apikey,content-type,x-promo-admin-key",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function sha256Hex(input: string) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function dataUrlToBytes(dataUrl: string) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("invalid_data_url");
  const mime = match[1];
  const bin = atob(match[2]);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return { mime, bytes: out };
}

function cleanFilename(v: unknown) {
  return String(v || "")
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/\.\./g, "")
    .replace(/[^A-Za-z0-9._-]/g, "-");
}

function parseFromFilename(fileName: string) {
  const match = fileName.match(/^(HFSS|HFSM|HFSL|HFSXL|HFSWSS|HFSWSL)-(\d{3})-p(\d{2})\.(webp|jpg|jpeg|png)$/i);
  if (!match) return null;
  return {
    classId: match[1].toUpperCase(),
    cardNo: Number(match[2]),
    pageNo: Number(match[3]),
    ext: match[4].toLowerCase(),
  };
}

function cleanText(v: unknown, max = 500) {
  return String(v || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

function cleanBox(v: unknown) {
  if (!v || typeof v !== "object") return {};
  const src = v as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const key of ["x", "y", "w", "h"]) {
    const n = Number(src[key]);
    if (Number.isFinite(n)) out[key] = Math.max(0, n);
  }
  return out;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>) {
  const out = new Array<R>(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      out[index] = await fn(items[index], index);
    }
  }));
  return out;
}

type NormalizedCard = {
  raw: any;
  fileName: string;
  parsed: { classId: string; cardNo: number; pageNo: number; ext: string };
  cardId: string;
  label: string;
  detectionStatus: "auto_ok" | "need_review";
  fullPath: string;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const started = performance.now();
  const url = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) return json({ ok: false, error: "missing_supabase_env" }, 503);

  const adminKey = req.headers.get("x-promo-admin-key") || "";
  if (!adminKey) return json({ ok: false, error: "missing_admin_key" }, 401);

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const keyHash = await sha256Hex(adminKey);
  const authStarted = performance.now();
  const { data: keyRows, error: keyErr } = await supabase
    .from("promo_upload_keys")
    .select("key_hash,active")
    .eq("key_hash", keyHash)
    .eq("active", true)
    .limit(1);
  if (keyErr) return json({ ok: false, error: "key_check_failed", detail: keyErr.message }, 500);
  if (!keyRows || keyRows.length === 0) return json({ ok: false, error: "invalid_admin_key" }, 401);
  const authMs = Math.round(performance.now() - authStarted);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json_body" }, 400);
  }

  if (body?.action !== "batch_upload") return json({ ok: false, error: "unsupported_action" }, 400);
  const promoMonthId = String(body?.promo_month_id || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const cards = Array.isArray(body?.cards) ? body.cards : [];
  if (!promoMonthId) return json({ ok: false, error: "missing_promo_month_id" }, 400);
  if (!cards.length || cards.length > 20) return json({ ok: false, error: "invalid_batch_size", max: 20 }, 400);

  let normalized: NormalizedCard[];
  try {
    normalized = cards.map((raw: any) => {
      const fileName = cleanFilename(raw?.file_name);
      const parsed = parseFromFilename(fileName);
      if (!parsed) throw new Error(`bad_filename:${fileName}`);
      const cardId = `${promoMonthId}-${parsed.classId}-${String(parsed.cardNo).padStart(3, "0")}`;
      const detectionStatus = raw?.detection_status === "auto_ok" ? "auto_ok" : "need_review";
      const label = cleanText(raw?.detected_function_label || raw?.benefit_text, 500);
      if (!label) throw new Error(`missing_structured_label:${cardId}`);
      return {
        raw,
        fileName,
        parsed,
        cardId,
        label,
        detectionStatus,
        fullPath: `${promoMonthId}/${parsed.classId}/${fileName}`,
      };
    });
  } catch (error) {
    return json({ ok: false, error: "invalid_batch", detail: String((error as Error)?.message || error) }, 400);
  }

  const uniqueIds = new Set(normalized.map((item) => item.cardId));
  if (uniqueIds.size !== normalized.length) return json({ ok: false, error: "duplicate_card_id_in_batch" }, 400);

  try {
    const prepStarted = performance.now();
    const ids = normalized.map((item) => item.cardId);
    const [{ data: existingCards, error: cardsReadErr }, { data: existingMatches, error: matchesReadErr }] = await Promise.all([
      supabase.from("promo_cards").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
      supabase.from("promo_card_function_matches").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
    ]);
    if (cardsReadErr) throw new Error(`cards_read_failed:${cardsReadErr.message}`);
    if (matchesReadErr) throw new Error(`matches_read_failed:${matchesReadErr.message}`);
    const cardsById = new Map<string, any>((existingCards || []).map((row: any) => [row.card_id, row]));
    const matchesById = new Map<string, any>((existingMatches || []).map((row: any) => [row.card_id, row]));
    for (const item of normalized) {
      if (!cardsById.has(item.cardId)) throw new Error(`card_not_found:${item.cardId}`);
      if (!matchesById.has(item.cardId)) throw new Error(`function_match_not_found:${item.cardId}`);
    }
    const prepMs = Math.round(performance.now() - prepStarted);

    const uploadStarted = performance.now();
    const uploaded = await mapLimit(normalized, 5, async (item) => {
      const { mime, bytes } = dataUrlToBytes(String(item.raw?.data_url || ""));
      if (!mime.startsWith("image/")) throw new Error(`image_required:${item.cardId}`);
      if (bytes.byteLength > 1_200_000) throw new Error(`image_too_large:${item.cardId}:${bytes.byteLength}`);
      const { error } = await supabase.storage.from("promo-cards").upload(item.fullPath, bytes, {
        contentType: mime,
        upsert: true,
      });
      if (error) throw new Error(`storage_upload_failed:${item.cardId}:${error.message}`);
      return {
        cardId: item.cardId,
        publicUrl: `${url}/storage/v1/object/public/promo-cards/${item.fullPath}`,
        size: bytes.byteLength,
      };
    });
    const uploadMs = Math.round(performance.now() - uploadStarted);
    const uploadedById = new Map(uploaded.map((row) => [row.cardId, row]));

    const dbStarted = performance.now();
    const now = new Date().toISOString();
    const cardRows = normalized.map((item) => ({
      ...cardsById.get(item.cardId),
      image_name: item.fileName,
      image_url: uploadedById.get(item.cardId)!.publicUrl,
      updated_at: now,
    }));
    const detectionRows = normalized.map((item) => ({
      promo_month_id: promoMonthId,
      card_id: item.cardId,
      class_id: item.parsed.classId,
      card_no: item.parsed.cardNo,
      page_no: item.parsed.pageNo,
      condition_text: null,
      benefit_text: item.label,
      detected_function_label: item.label,
      condition_confidence: null,
      benefit_confidence: cleanNumber(item.raw?.benefit_confidence),
      condition_box: {},
      benefit_box: cleanBox(item.raw?.benefit_box),
      condition_image_url: null,
      benefit_image_url: null,
      detection_status: item.detectionStatus,
      detection_method: cleanText(item.raw?.detection_method, 100) || "blue_grid_lock_v3_redbox_structured",
      review_status: item.detectionStatus === "auto_ok" ? "auto_detected" : "need_review",
      detected_at: now,
      updated_at: now,
    }));
    const matchRows = normalized.map((item) => ({
      ...matchesById.get(item.cardId),
      condition_text: null,
      benefit_text: item.label,
      detected_function_label: item.label,
      condition_confidence: null,
      benefit_confidence: cleanNumber(item.raw?.benefit_confidence),
      condition_box: {},
      benefit_box: cleanBox(item.raw?.benefit_box),
      condition_image_url: null,
      benefit_image_url: null,
      detection_status: item.detectionStatus,
      detection_method: cleanText(item.raw?.detection_method, 100) || "blue_grid_lock_v3_redbox_structured",
      detected_at: now,
      updated_at: now,
    }));

    const [{ error: cardWriteErr }, { error: detectionWriteErr }, { error: matchWriteErr }] = await Promise.all([
      supabase.from("promo_cards").upsert(cardRows, { onConflict: "card_id" }),
      supabase.from("promo_card_detections").upsert(detectionRows, { onConflict: "promo_month_id,card_id" }),
      supabase.from("promo_card_function_matches").upsert(matchRows, { onConflict: "promo_month_id,card_id" }),
    ]);
    if (cardWriteErr) throw new Error(`cards_upsert_failed:${cardWriteErr.message}`);
    if (detectionWriteErr) throw new Error(`detections_upsert_failed:${detectionWriteErr.message}`);
    if (matchWriteErr) throw new Error(`matches_upsert_failed:${matchWriteErr.message}`);
    const dbMs = Math.round(performance.now() - dbStarted);

    return json({
      ok: true,
      uploaded: normalized.length,
      bytes: uploaded.reduce((sum, row) => sum + row.size, 0),
      card_ids: normalized.map((item) => item.cardId),
      auth_ms: authMs,
      prep_ms: prepMs,
      upload_ms: uploadMs,
      db_ms: dbMs,
      total_ms: Math.round(performance.now() - started),
    });
  } catch (error) {
    return json({ ok: false, error: "batch_upload_failed", detail: String((error as Error)?.message || error) }, 500);
  }
});
