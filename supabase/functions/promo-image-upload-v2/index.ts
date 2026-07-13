import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { parseFunctionLabel, promoTierRows, templateIdentity } from "./promo-function-sync.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,x-client-info,apikey,content-type,x-promo-admin-key",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function dataUrlToBytes(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("invalid_data_url");
  const mime = match[1];
  const bin = atob(match[2]);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return { mime, bytes: out };
}

function cleanFilename(value) {
  return String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/\.\./g, "")
    .replace(/[^A-Za-z0-9._-]/g, "-");
}

function parseFromFilename(fileName) {
  const match = fileName.match(/^(HFSS|HFSM|HFSL|HFSXL|HFSWSS|HFSWSL)-(\d{3})-p(\d{2})\.(webp|jpg|jpeg|png)$/i);
  if (!match) return null;
  return {
    classId: match[1].toUpperCase(),
    cardNo: Number(match[2]),
    pageNo: Number(match[3]),
    ext: match[4].toLowerCase(),
  };
}

function cleanText(value, max = 500) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

function cleanBox(value) {
  if (!value || typeof value !== "object") return {};
  const out = {};
  for (const key of ["x", "y", "w", "h"]) {
    const n = Number(value[key]);
    if (Number.isFinite(n)) out[key] = Math.max(0, n);
  }
  return out;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
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

async function ensureTemplates(supabase, promoMonthId, normalized, now) {
  const labels = [...new Set(normalized.map(item => item.label))];
  const { data: existing, error: readError } = await supabase
    .from("promo_function_templates")
    .select("*")
    .eq("promo_month_id", promoMonthId)
    .in("function_label", labels);
  if (readError) throw new Error(`templates_read_failed:${readError.message}`);

  const byLabel = new Map((existing || []).map(row => [row.function_label, row]));
  const missingLabels = labels.filter(label => !byLabel.has(label));
  if (missingLabels.length) {
    const autoRows = [];
    for (const label of missingLabels) {
      const sample = normalized.find(item => item.label === label);
      const identity = await templateIdentity(promoMonthId, label);
      autoRows.push({
        template_id: identity.templateId,
        promo_month_id: promoMonthId,
        cluster_id: identity.clusterId,
        function_label: label,
        function_type: sample.parsedFunction.functionType,
        function_payload: sample.parsedFunction.payload,
        card_count: normalized.filter(item => item.label === label).length,
        sample_card_id: sample.cardId,
        sample_image_name: sample.fileName,
        confidence: 1,
        review_status: "auto_detected_v3",
        created_at: now,
        updated_at: now,
      });
    }
    const { error: upsertError } = await supabase
      .from("promo_function_templates")
      .upsert(autoRows, { onConflict: "template_id" });
    if (upsertError) throw new Error(`templates_upsert_failed:${upsertError.message}`);
  }

  const { data: resolved, error: resolvedError } = await supabase
    .from("promo_function_templates")
    .select("*")
    .eq("promo_month_id", promoMonthId)
    .in("function_label", labels);
  if (resolvedError) throw new Error(`templates_resolve_failed:${resolvedError.message}`);
  const resolvedByLabel = new Map((resolved || []).map(row => [row.function_label, row]));
  for (const label of labels) {
    if (!resolvedByLabel.has(label)) throw new Error(`template_not_resolved:${label}`);
  }
  return resolvedByLabel;
}

Deno.serve(async (req) => {
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
  const { data: keyRows, error: keyError } = await supabase
    .from("promo_upload_keys")
    .select("key_hash,active")
    .eq("key_hash", keyHash)
    .eq("active", true)
    .limit(1);
  if (keyError) return json({ ok: false, error: "key_check_failed", detail: keyError.message }, 500);
  if (!keyRows || keyRows.length === 0) return json({ ok: false, error: "invalid_admin_key" }, 401);
  const authMs = Math.round(performance.now() - authStarted);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json_body" }, 400);
  }

  if (body?.action !== "batch_upload") return json({ ok: false, error: "unsupported_action" }, 400);
  const promoMonthId = String(body?.promo_month_id || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const cards = Array.isArray(body?.cards) ? body.cards : [];
  const skipExistingImages = body?.skip_existing_images === true;
  if (!promoMonthId) return json({ ok: false, error: "missing_promo_month_id" }, 400);
  if (!cards.length || cards.length > 20) return json({ ok: false, error: "invalid_batch_size", max: 20 }, 400);

  let normalized;
  try {
    normalized = cards.map(raw => {
      const fileName = cleanFilename(raw?.file_name);
      const parsed = parseFromFilename(fileName);
      if (!parsed) throw new Error(`bad_filename:${fileName}`);
      const cardId = `${promoMonthId}-${parsed.classId}-${String(parsed.cardNo).padStart(3, "0")}`;
      const detectionStatus = raw?.detection_status === "auto_ok" ? "auto_ok" : "need_review";
      const label = cleanText(raw?.detected_function_label || raw?.benefit_text, 500);
      if (!label) throw new Error(`missing_structured_label:${cardId}`);
      if (detectionStatus !== "auto_ok") throw new Error(`function_not_auto_ok:${cardId}`);
      const parsedFunction = parseFunctionLabel(label);
      return {
        raw,
        fileName,
        parsed,
        cardId,
        label: parsedFunction.label,
        parsedFunction,
        detectionStatus,
        fullPath: `${promoMonthId}/${parsed.classId}/${fileName}`,
      };
    });
  } catch (error) {
    return json({ ok: false, error: "invalid_batch", detail: String(error?.message || error) }, 400);
  }

  const uniqueIds = new Set(normalized.map(item => item.cardId));
  if (uniqueIds.size !== normalized.length) return json({ ok: false, error: "duplicate_card_id_in_batch" }, 400);

  try {
    const prepStarted = performance.now();
    const ids = normalized.map(item => item.cardId);
    const [{ data: existingCards, error: cardsReadError }, { data: existingMatches, error: matchesReadError }] = await Promise.all([
      supabase.from("promo_cards").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
      supabase.from("promo_card_function_matches").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
    ]);
    if (cardsReadError) throw new Error(`cards_read_failed:${cardsReadError.message}`);
    if (matchesReadError) throw new Error(`matches_read_failed:${matchesReadError.message}`);
    const cardsById = new Map((existingCards || []).map(row => [row.card_id, row]));
    const matchesById = new Map((existingMatches || []).map(row => [row.card_id, row]));
    for (const item of normalized) {
      if (!cardsById.has(item.cardId)) throw new Error(`card_not_found:${item.cardId}`);
    }

    const now = new Date().toISOString();
    const templatesByLabel = await ensureTemplates(supabase, promoMonthId, normalized, now);
    const prepMs = Math.round(performance.now() - prepStarted);

    const uploadStarted = performance.now();
    const uploaded = await mapLimit(normalized, 5, async item => {
      const existingCard = cardsById.get(item.cardId);
      if (skipExistingImages && existingCard?.image_url) {
        return {
          cardId: item.cardId,
          publicUrl: existingCard.image_url,
          fileName: existingCard.image_name || item.fileName,
          size: 0,
          skipped: true,
        };
      }
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
        fileName: item.fileName,
        size: bytes.byteLength,
        skipped: false,
      };
    });
    const uploadMs = Math.round(performance.now() - uploadStarted);
    const uploadedById = new Map(uploaded.map(row => [row.cardId, row]));

    const dbStarted = performance.now();
    const cardRows = normalized.map(item => ({
      ...cardsById.get(item.cardId),
      image_name: uploadedById.get(item.cardId).fileName,
      image_url: uploadedById.get(item.cardId).publicUrl,
      updated_at: now,
    }));

    const detectionRows = normalized.map(item => ({
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
      detection_method: cleanText(item.raw?.detection_method, 100) || "blue_grid_lock_v3_function_sync",
      review_status: "auto_detected",
      reviewed_function_label: item.label,
      detected_at: now,
      reviewed_at: now,
      updated_at: now,
    }));

    const matchRows = normalized.map(item => {
      const previous = matchesById.get(item.cardId) || {};
      const template = templatesByLabel.get(item.label);
      const confidence = cleanNumber(item.raw?.benefit_confidence);
      return {
        ...previous,
        promo_month_id: promoMonthId,
        card_id: item.cardId,
        template_id: template.template_id,
        class_id: item.parsed.classId,
        card_no: item.parsed.cardNo,
        page_no: item.parsed.pageNo,
        cluster_id: template.cluster_id,
        function_label: item.label,
        function_type: item.parsedFunction.functionType,
        function_payload: item.parsedFunction.payload,
        match_method: "ocr_structured_v3_sync",
        confidence: confidence == null ? 1 : confidence / 100,
        review_status: "auto_detected",
        condition_text: null,
        benefit_text: item.label,
        detected_function_label: item.label,
        condition_confidence: null,
        benefit_confidence: confidence,
        condition_box: {},
        benefit_box: cleanBox(item.raw?.benefit_box),
        condition_image_url: null,
        benefit_image_url: null,
        detection_status: item.detectionStatus,
        detection_method: cleanText(item.raw?.detection_method, 100) || "blue_grid_lock_v3_function_sync",
        detected_at: now,
        updated_at: now,
      };
    });

    const tierRows = normalized.flatMap(item => promoTierRows(item.cardId, item.parsedFunction));

    const [{ error: cardWriteError }, { error: detectionWriteError }, { error: matchWriteError }] = await Promise.all([
      supabase.from("promo_cards").upsert(cardRows, { onConflict: "card_id" }),
      supabase.from("promo_card_detections").upsert(detectionRows, { onConflict: "promo_month_id,card_id" }),
      supabase.from("promo_card_function_matches").upsert(matchRows, { onConflict: "promo_month_id,card_id" }),
    ]);
    if (cardWriteError) throw new Error(`cards_upsert_failed:${cardWriteError.message}`);
    if (detectionWriteError) throw new Error(`detections_upsert_failed:${detectionWriteError.message}`);
    if (matchWriteError) throw new Error(`matches_upsert_failed:${matchWriteError.message}`);

    const { error: tierDeleteError } = await supabase.from("promo_tiers").delete().in("card_id", ids);
    if (tierDeleteError) throw new Error(`tiers_delete_failed:${tierDeleteError.message}`);
    if (tierRows.length) {
      const { error: tierInsertError } = await supabase.from("promo_tiers").insert(tierRows);
      if (tierInsertError) throw new Error(`tiers_insert_failed:${tierInsertError.message}`);
    }
    const dbMs = Math.round(performance.now() - dbStarted);

    return json({
      ok: true,
      uploaded: normalized.length,
      images_uploaded: uploaded.filter(row => !row.skipped).length,
      images_reused: uploaded.filter(row => row.skipped).length,
      functions_synced: matchRows.length,
      tiers_synced: tierRows.length,
      templates_created_or_reused: new Set(matchRows.map(row => row.template_id)).size,
      bytes: uploaded.reduce((sum, row) => sum + row.size, 0),
      card_ids: normalized.map(item => item.cardId),
      auth_ms: authMs,
      prep_ms: prepMs,
      upload_ms: uploadMs,
      db_ms: dbMs,
      total_ms: Math.round(performance.now() - started),
    });
  } catch (error) {
    return json({ ok: false, error: "batch_upload_failed", detail: String(error?.message || error) }, 500);
  }
});
