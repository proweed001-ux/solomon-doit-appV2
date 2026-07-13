import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { parseFunctionLabel, promoTierRows, templateIdentity } from "./promo-function-sync.js";

const BUCKET = "promo-cards";
const EXPECTED_CARDS = 212;
const CLASS_SORT = { HFSS: 1000, HFSM: 2000, HFSL: 3000, HFSXL: 4000, HFSWSS: 5000, HFSWSL: 6000 };
const CLASS_LABEL = { HFSS: "HFS-S", HFSM: "HFS-M", HFSL: "HFS-L", HFSXL: "HFS-XL", HFSWSS: "HFS-WS-S", HFSWSL: "HFS-WS-L" };
const MONTH_INDEX = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
const MONTH_THAI = { JAN: "มกราคม", FEB: "กุมภาพันธ์", MAR: "มีนาคม", APR: "เมษายน", MAY: "พฤษภาคม", JUN: "มิถุนายน", JUL: "กรกฎาคม", AUG: "สิงหาคม", SEP: "กันยายน", OCT: "ตุลาคม", NOV: "พฤศจิกายน", DEC: "ธันวาคม" };
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,x-client-info,apikey,content-type,x-promo-admin-key",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
}
function cleanCode(value) { return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, ""); }
function cleanFilename(value) { return String(value || "").trim().replace(/\\/g, "/").split("/").pop().replace(/\.\./g, "").replace(/[^A-Za-z0-9._-]/g, "-"); }
function cleanText(value, max = 500) { return String(value || "").replace(/\s+/g, " ").trim().slice(0, max); }
function cleanNumber(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null; }
function cleanBox(value) { const out = {}; if (!value || typeof value !== "object") return out; for (const key of ["x", "y", "w", "h"]) { const n = Number(value[key]); if (Number.isFinite(n)) out[key] = Math.max(0, n); } return out; }
function dataUrlToBytes(dataUrl) { const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/); if (!match) throw new Error("invalid_data_url"); const bin = atob(match[2]); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return { mime: match[1], bytes: out }; }
function parseFromFilename(fileName) { const match = fileName.match(/^(HFSS|HFSM|HFSL|HFSXL|HFSWSS|HFSWSL)-(\d{3})-p(\d{2})\.(webp|jpg|jpeg|png)$/i); return match ? { classId: match[1].toUpperCase(), cardNo: Number(match[2]), pageNo: Number(match[3]), ext: match[4].toLowerCase() } : null; }
function monthMeta(id, body = {}) {
  const match = id.match(/^([A-Z]{3})(\d{2})$/); const code = match?.[1]; const yy = match ? Number(match[2]) : null; const month = code ? MONTH_INDEX[code] : null;
  const year = yy == null ? null : 2000 + yy;
  const yearMonth = cleanText(body.year_month, 20) || (year && month ? `${year}-${String(month).padStart(2, "0")}` : "");
  const label = cleanText(body.month_label, 100) || (year && code ? `โปรโมชัน ${MONTH_THAI[code]} ${year}` : id);
  if (!yearMonth) throw new Error(`invalid_promo_month_id:${id}`);
  return { yearMonth, label };
}
function publicPath(url) { const marker = `/storage/v1/object/public/${BUCKET}/`; const pos = String(url || "").indexOf(marker); return pos >= 0 ? decodeURIComponent(String(url).slice(pos + marker.length)) : ""; }
async function sha256Hex(input) { const bytes = new TextEncoder().encode(input); const digest = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, "0")).join(""); }
async function mapLimit(items, limit, fn) { const out = new Array(items.length); let next = 0; await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => { while (true) { const i = next++; if (i >= items.length) return; out[i] = await fn(items[i], i); } })); return out; }
async function ensureMonth(supabase, promoMonthId, body, now) {
  const meta = monthMeta(promoMonthId, body);
  const row = { id: promoMonthId, label: meta.label, year_month: meta.yearMonth, status: "draft", source_pdf: cleanText(body.source_file, 200) || null, notes: "Latest-only staged upload", updated_at: now };
  const { error } = await supabase.from("promo_months").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`month_upsert_failed:${error.message}`);
  return row;
}
async function ensureTemplates(supabase, promoMonthId, normalized, now) {
  const labels = [...new Set(normalized.map(item => item.label))];
  const { data: existing, error: readError } = await supabase.from("promo_function_templates").select("*").eq("promo_month_id", promoMonthId).in("function_label", labels);
  if (readError) throw new Error(`templates_read_failed:${readError.message}`);
  const byLabel = new Map((existing || []).map(row => [row.function_label, row]));
  const missing = labels.filter(label => !byLabel.has(label));
  if (missing.length) {
    const rows = [];
    for (const label of missing) {
      const sample = normalized.find(item => item.label === label); const identity = await templateIdentity(promoMonthId, label);
      rows.push({ template_id: identity.templateId, promo_month_id: promoMonthId, cluster_id: identity.clusterId, function_label: label, function_type: sample.parsedFunction.functionType, function_payload: sample.parsedFunction.payload, card_count: normalized.filter(item => item.label === label).length, sample_card_id: sample.cardId, sample_image_name: sample.fileName, confidence: 1, review_status: "auto_detected_latest", created_at: now, updated_at: now });
    }
    const { error } = await supabase.from("promo_function_templates").upsert(rows, { onConflict: "template_id" });
    if (error) throw new Error(`templates_upsert_failed:${error.message}`);
  }
  const { data: resolved, error } = await supabase.from("promo_function_templates").select("*").eq("promo_month_id", promoMonthId).in("function_label", labels);
  if (error) throw new Error(`templates_resolve_failed:${error.message}`);
  const map = new Map((resolved || []).map(row => [row.function_label, row]));
  for (const label of labels) if (!map.has(label)) throw new Error(`template_not_resolved:${label}`);
  return map;
}
async function listStorageFiles(supabase, prefix) {
  const files = [];
  async function walk(path) {
    let offset = 0;
    while (true) {
      const { data, error } = await supabase.storage.from(BUCKET).list(path, { limit: 1000, offset, sortBy: { column: "name", order: "asc" } });
      if (error) throw new Error(`storage_list_failed:${path}:${error.message}`);
      const rows = data || [];
      for (const item of rows) {
        const full = path ? `${path}/${item.name}` : item.name;
        if (item.id || item.metadata) files.push(full); else await walk(full);
      }
      if (rows.length < 1000) break;
      offset += rows.length;
    }
  }
  await walk(prefix);
  return files;
}
async function removeStorageFiles(supabase, paths) {
  let deleted = 0;
  for (let i = 0; i < paths.length; i += 100) {
    const chunk = paths.slice(i, i + 100); const { error } = await supabase.storage.from(BUCKET).remove(chunk);
    if (error) throw new Error(`storage_remove_failed:${error.message}`); deleted += chunk.length;
  }
  return deleted;
}
async function finalizeLatest(supabase, promoMonthId, body) {
  if (body.confirm_latest_only !== true) throw new Error("latest_only_confirmation_required");
  const expected = Number(body.expected_cards || EXPECTED_CARDS);
  const expectedIds = Array.isArray(body.card_ids) ? [...new Set(body.card_ids.map(cleanCode).filter(Boolean))] : [];
  if (!Number.isInteger(expected) || expected < 1 || expected > 1000) throw new Error("invalid_expected_cards");
  if (expectedIds.length && expectedIds.length !== expected) throw new Error(`expected_card_ids_mismatch:${expectedIds.length}/${expected}`);
  const [{ data: cards, error: cardError }, { data: detections, error: detectionError }, { data: matches, error: matchError }] = await Promise.all([
    supabase.from("promo_cards").select("card_id,image_url").eq("promo_month_id", promoMonthId),
    supabase.from("promo_card_detections").select("card_id,detection_status,review_status,reviewed_function_label").eq("promo_month_id", promoMonthId),
    supabase.from("promo_card_function_matches").select("card_id,function_label,review_status").eq("promo_month_id", promoMonthId),
  ]);
  if (cardError) throw new Error(`finalize_cards_read_failed:${cardError.message}`);
  if (detectionError) throw new Error(`finalize_detections_read_failed:${detectionError.message}`);
  if (matchError) throw new Error(`finalize_matches_read_failed:${matchError.message}`);
  const cardRows = cards || [], detectionRows = detections || [], matchRows = matches || [];
  const cardIds = new Set(cardRows.map(row => row.card_id));
  const expectedSet = new Set(expectedIds);
  const missingExpected = expectedIds.filter(id => !cardIds.has(id));
  const unexpected = expectedIds.length ? [...cardIds].filter(id => !expectedSet.has(id)) : [];
  const invalidDetections = detectionRows.filter(row => row.detection_status !== "auto_ok" || !row.reviewed_function_label).map(row => row.card_id);
  const invalidMatches = matchRows.filter(row => !row.function_label).map(row => row.card_id);
  const { data: tierRows, error: tierError } = await supabase.from("promo_tiers").select("card_id").like("card_id", `${promoMonthId}-%`);
  if (tierError) throw new Error(`finalize_tiers_read_failed:${tierError.message}`);
  const tierCardCount = new Set((tierRows || []).map(row => row.card_id)).size;
  const valid = cardRows.length === expected && detectionRows.length === expected && matchRows.length === expected && tierCardCount === expected && !missingExpected.length && !unexpected.length && !invalidDetections.length && !invalidMatches.length && cardRows.every(row => !!row.image_url);
  if (!valid) return { ok: false, error: "finalize_validation_failed", status: 409, detail: { expected, cards: cardRows.length, detections: detectionRows.length, matches: matchRows.length, tier_cards: tierCardCount, missing_expected: missingExpected.slice(0, 20), unexpected: unexpected.slice(0, 20), invalid_detections: invalidDetections.slice(0, 20), invalid_matches: invalidMatches.slice(0, 20), missing_images: cardRows.filter(row => !row.image_url).map(row => row.card_id).slice(0, 20) } };
  const now = new Date().toISOString();
  const { error: publishError } = await supabase.from("promo_months").update({ status: "published", published_at: now, updated_at: now, notes: "Latest-only current month" }).eq("id", promoMonthId);
  if (publishError) throw new Error(`month_publish_failed:${publishError.message}`);
  const { data: months, error: monthsError } = await supabase.from("promo_months").select("id").neq("id", promoMonthId);
  if (monthsError) throw new Error(`old_months_read_failed:${monthsError.message}`);
  const oldIds = (months || []).map(row => row.id);
  let filesDeleted = 0;
  for (const oldId of oldIds) filesDeleted += await removeStorageFiles(supabase, await listStorageFiles(supabase, oldId));
  if (oldIds.length) {
    for (const table of ["promo_card_function_matches", "promo_card_detections", "promo_function_templates"]) {
      const { error } = await supabase.from(table).delete().in("promo_month_id", oldIds);
      if (error) throw new Error(`${table}_cleanup_failed:${error.message}`);
    }
    const { error } = await supabase.from("promo_months").delete().in("id", oldIds);
    if (error) throw new Error(`old_months_delete_failed:${error.message}`);
  }
  const currentFiles = await listStorageFiles(supabase, promoMonthId);
  const referenced = new Set(cardRows.map(row => publicPath(row.image_url)).filter(Boolean));
  const stale = currentFiles.filter(path => !referenced.has(path) && !path.includes("/source/"));
  filesDeleted += await removeStorageFiles(supabase, stale);
  return { ok: true, action: "finalize_latest", current_month: promoMonthId, validated_cards: expected, old_months_deleted: oldIds, files_deleted: filesDeleted, stale_current_files_deleted: stale.length };
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  const started = performance.now();
  const url = Deno.env.get("SUPABASE_URL") || ""; const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) return json({ ok: false, error: "missing_supabase_env" }, 503);
  const adminKey = req.headers.get("x-promo-admin-key") || ""; if (!adminKey) return json({ ok: false, error: "missing_admin_key" }, 401);
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const keyHash = await sha256Hex(adminKey);
  const { data: keyRows, error: keyError } = await supabase.from("promo_upload_keys").select("key_hash,active").eq("key_hash", keyHash).eq("active", true).limit(1);
  if (keyError) return json({ ok: false, error: "key_check_failed", detail: keyError.message }, 500);
  if (!keyRows?.length) return json({ ok: false, error: "invalid_admin_key" }, 401);
  let body; try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json_body" }, 400); }
  const action = String(body?.action || "").trim(); const promoMonthId = cleanCode(body?.promo_month_id);
  if (!promoMonthId) return json({ ok: false, error: "missing_promo_month_id" }, 400);
  try {
    if (action === "finalize_latest") {
      const result = await finalizeLatest(supabase, promoMonthId, body);
      return json(result, result.status || (result.ok ? 200 : 409));
    }
    if (action !== "batch_upload") return json({ ok: false, error: "unsupported_action" }, 400);
    const cards = Array.isArray(body.cards) ? body.cards : []; if (!cards.length || cards.length > 20) return json({ ok: false, error: "invalid_batch_size", max: 20 }, 400);
    const normalized = cards.map(raw => {
      const fileName = cleanFilename(raw?.file_name); const parsed = parseFromFilename(fileName); if (!parsed) throw new Error(`bad_filename:${fileName}`);
      const cardId = `${promoMonthId}-${parsed.classId}-${String(parsed.cardNo).padStart(3, "0")}`; const detectionStatus = raw?.detection_status === "auto_ok" ? "auto_ok" : "need_review";
      const parsedFunction = parseFunctionLabel(cleanText(raw?.detected_function_label || raw?.benefit_text, 500)); if (detectionStatus !== "auto_ok") throw new Error(`function_not_auto_ok:${cardId}`);
      return { raw, fileName, parsed, cardId, label: parsedFunction.label, parsedFunction, detectionStatus, fullPath: `${promoMonthId}/${parsed.classId}/${fileName}` };
    });
    if (new Set(normalized.map(item => item.cardId)).size !== normalized.length) return json({ ok: false, error: "duplicate_card_id_in_batch" }, 400);
    const now = new Date().toISOString(); await ensureMonth(supabase, promoMonthId, body, now);
    const ids = normalized.map(item => item.cardId);
    const [{ data: existingCards, error: cardsReadError }, { data: existingMatches, error: matchesReadError }] = await Promise.all([
      supabase.from("promo_cards").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
      supabase.from("promo_card_function_matches").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
    ]);
    if (cardsReadError) throw new Error(`cards_read_failed:${cardsReadError.message}`); if (matchesReadError) throw new Error(`matches_read_failed:${matchesReadError.message}`);
    const cardsById = new Map((existingCards || []).map(row => [row.card_id, row])); const matchesById = new Map((existingMatches || []).map(row => [row.card_id, row]));
    const templatesByLabel = await ensureTemplates(supabase, promoMonthId, normalized, now);
    const skipExistingImages = body.skip_existing_images === true;
    const uploaded = await mapLimit(normalized, 5, async item => {
      const old = cardsById.get(item.cardId); if (skipExistingImages && old?.image_url) return { cardId: item.cardId, publicUrl: old.image_url, fileName: old.image_name || item.fileName, size: 0, skipped: true };
      const { mime, bytes } = dataUrlToBytes(item.raw?.data_url); if (!mime.startsWith("image/")) throw new Error(`image_required:${item.cardId}`); if (bytes.byteLength > 1_200_000) throw new Error(`image_too_large:${item.cardId}:${bytes.byteLength}`);
      const { error } = await supabase.storage.from(BUCKET).upload(item.fullPath, bytes, { contentType: mime, upsert: true }); if (error) throw new Error(`storage_upload_failed:${item.cardId}:${error.message}`);
      return { cardId: item.cardId, publicUrl: `${url}/storage/v1/object/public/${BUCKET}/${item.fullPath}`, fileName: item.fileName, size: bytes.byteLength, skipped: false };
    });
    const uploadedById = new Map(uploaded.map(row => [row.cardId, row]));
    const cardRows = normalized.map(item => ({ ...(cardsById.get(item.cardId) || {}), card_id: item.cardId, promo_month_id: promoMonthId, class_id: item.parsed.classId, page_no: item.parsed.pageNo, card_no: item.parsed.cardNo, promo_title: cardsById.get(item.cardId)?.promo_title || `รอตรวจข้อความจาก PDF - ${CLASS_LABEL[item.parsed.classId]} ใบที่ ${String(item.parsed.cardNo).padStart(3, "0")}`, promo_type: item.parsedFunction.functionType === "free_goods" ? "free_goods" : "discount", status: cardsById.get(item.cardId)?.status || "need_review", image_name: uploadedById.get(item.cardId).fileName, image_url: uploadedById.get(item.cardId).publicUrl, source_file: cleanText(body.source_file, 200) || cardsById.get(item.cardId)?.source_file || null, source_sheet: "latest_only_ocr_v1", sort_order: (CLASS_SORT[item.parsed.classId] || 9000) + item.parsed.cardNo, updated_at: now }));
    const detectionRows = normalized.map(item => ({ promo_month_id: promoMonthId, card_id: item.cardId, class_id: item.parsed.classId, card_no: item.parsed.cardNo, page_no: item.parsed.pageNo, condition_text: null, benefit_text: item.label, detected_function_label: item.label, condition_confidence: null, benefit_confidence: cleanNumber(item.raw?.benefit_confidence), condition_box: {}, benefit_box: cleanBox(item.raw?.benefit_box), condition_image_url: null, benefit_image_url: null, detection_status: "auto_ok", detection_method: cleanText(item.raw?.detection_method, 100) || "latest_only_structured_ocr", review_status: "auto_detected", reviewed_function_label: item.label, detected_at: now, reviewed_at: now, updated_at: now }));
    const matchRows = normalized.map(item => { const previous = matchesById.get(item.cardId) || {}; const template = templatesByLabel.get(item.label); const confidence = cleanNumber(item.raw?.benefit_confidence); return { ...previous, promo_month_id: promoMonthId, card_id: item.cardId, template_id: template.template_id, class_id: item.parsed.classId, card_no: item.parsed.cardNo, page_no: item.parsed.pageNo, cluster_id: template.cluster_id, function_label: item.label, function_type: item.parsedFunction.functionType, function_payload: item.parsedFunction.payload, match_method: "latest_only_structured_ocr", confidence: confidence == null ? 1 : confidence / 100, review_status: "auto_detected", condition_text: null, benefit_text: item.label, detected_function_label: item.label, condition_confidence: null, benefit_confidence: confidence, condition_box: {}, benefit_box: cleanBox(item.raw?.benefit_box), condition_image_url: null, benefit_image_url: null, detection_status: "auto_ok", detection_method: cleanText(item.raw?.detection_method, 100) || "latest_only_structured_ocr", detected_at: now, updated_at: now }; });
    const tierRows = normalized.flatMap(item => promoTierRows(item.cardId, item.parsedFunction));
    const [{ error: cardWriteError }, { error: detectionWriteError }, { error: matchWriteError }] = await Promise.all([
      supabase.from("promo_cards").upsert(cardRows, { onConflict: "card_id" }), supabase.from("promo_card_detections").upsert(detectionRows, { onConflict: "promo_month_id,card_id" }), supabase.from("promo_card_function_matches").upsert(matchRows, { onConflict: "promo_month_id,card_id" }),
    ]);
    if (cardWriteError) throw new Error(`cards_upsert_failed:${cardWriteError.message}`); if (detectionWriteError) throw new Error(`detections_upsert_failed:${detectionWriteError.message}`); if (matchWriteError) throw new Error(`matches_upsert_failed:${matchWriteError.message}`);
    const { error: tierDeleteError } = await supabase.from("promo_tiers").delete().in("card_id", ids); if (tierDeleteError) throw new Error(`tiers_delete_failed:${tierDeleteError.message}`);
    if (tierRows.length) { const { error } = await supabase.from("promo_tiers").insert(tierRows); if (error) throw new Error(`tiers_insert_failed:${error.message}`); }
    return json({ ok: true, action, uploaded: normalized.length, images_uploaded: uploaded.filter(row => !row.skipped).length, images_reused: uploaded.filter(row => row.skipped).length, functions_synced: matchRows.length, tiers_synced: tierRows.length, card_ids: ids, total_ms: Math.round(performance.now() - started) });
  } catch (error) { return json({ ok: false, error: action === "finalize_latest" ? "finalize_latest_failed" : "batch_upload_failed", detail: String(error?.message || error) }, 500); }
});
