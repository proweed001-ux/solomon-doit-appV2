export const BUCKET = "promo-cards";
export const CLASS_SORT = { HFSS: 1000, HFSM: 2000, HFSL: 3000, HFSXL: 4000, HFSWSS: 5000, HFSWSL: 6000 };
export const MONTH_INDEX = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
export const MONTH_THAI = { JAN: "มกราคม", FEB: "กุมภาพันธ์", MAR: "มีนาคม", APR: "เมษายน", MAY: "พฤษภาคม", JUN: "มิถุนายน", JUL: "กรกฎาคม", AUG: "สิงหาคม", SEP: "กันยายน", OCT: "ตุลาคม", NOV: "พฤศจิกายน", DEC: "ธันวาคม" };
export const UNITS = new Set(["ขวด", "ชิ้น", "แพ็ค", "กล่อง", "ลัง", "ซอง", "ถุง", "ชุด", "ด้าม"]);
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,x-client-info,apikey,content-type,x-promo-admin-key",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
}
export function cleanCode(value) { return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, ""); }
export function cleanFilename(value) { return String(value || "").trim().replace(/\\/g, "/").split("/").pop().replace(/\.\./g, "").replace(/[^A-Za-z0-9._-]/g, "-"); }
export function cleanText(value, max = 500) { return String(value || "").replace(/\s+/g, " ").trim().slice(0, max); }
export function cleanConfidence(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null; }
export function cleanPrice(value) { const n = Number(value); return Number.isFinite(n) && n > 0 && n <= 1_000_000 ? Math.round(n * 100) / 100 : null; }
export function cleanUnit(value) { const unit = cleanText(value, 20); return UNITS.has(unit) ? unit : ""; }
export function cleanUuid(value) { const s = String(value || "").trim().toLowerCase(); return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(s) ? s : ""; }
export function cleanBox(value) { const out = {}; if (!value || typeof value !== "object") return out; for (const key of ["x", "y", "w", "h"]) { const n = Number(value[key]); if (Number.isFinite(n)) out[key] = Math.max(0, n); } return out; }
export function dataUrlToBytes(dataUrl) { const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/); if (!match) throw new Error("invalid_data_url"); const bin = atob(match[2]); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return { mime: match[1], bytes: out }; }
export function parseFromFilename(fileName) { const match = fileName.match(/^(HFSS|HFSM|HFSL|HFSXL|HFSWSS|HFSWSL)-(\d{3})-p(\d{2})\.(webp|jpg|jpeg|png)$/i); return match ? { classId: match[1].toUpperCase(), cardNo: Number(match[2]), pageNo: Number(match[3]), ext: match[4].toLowerCase() } : null; }
export function publicPath(url) { const marker = `/storage/v1/object/public/${BUCKET}/`; const pos = String(url || "").indexOf(marker); return pos >= 0 ? decodeURIComponent(String(url).slice(pos + marker.length)) : ""; }
export function groupIdForMaster(promoMonthId, masterProductId) { return `PG-${promoMonthId}-M-${String(masterProductId).replace(/-/g, "").slice(0, 16).toUpperCase()}`; }
export async function sha256Hex(input) { const bytes = new TextEncoder().encode(input); const digest = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, "0")).join(""); }
export async function mapLimit(items, limit, fn) { const out = new Array(items.length); let next = 0; await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => { while (true) { const i = next++; if (i >= items.length) return; out[i] = await fn(items[i], i); } })); return out; }

function monthMeta(id, body = {}) {
  const match = id.match(/^([A-Z]{3})(\d{2})$/), code = match?.[1], yy = match ? Number(match[2]) : null, month = code ? MONTH_INDEX[code] : null, year = yy == null ? null : 2000 + yy;
  const yearMonth = cleanText(body.year_month, 20) || (year && month ? `${year}-${String(month).padStart(2, "0")}` : ""), label = cleanText(body.month_label, 100) || (year && code ? `โปรโมชัน ${MONTH_THAI[code]} ${year}` : id);
  if (!yearMonth) throw new Error(`invalid_promo_month_id:${id}`);
  return { yearMonth, label };
}

export async function ensureMonth(supabase, promoMonthId, body, now) {
  const meta = monthMeta(promoMonthId, body);
  const { data: existing, error: readError } = await supabase.from("promo_months").select("status,source_pdf").eq("id", promoMonthId).maybeSingle();
  if (readError) throw new Error(`month_read_failed:${readError.message}`);
  if (existing?.status === "published" && body.allow_published_repair !== true) throw new Error(`published_month_locked:${promoMonthId}`);
  const row = { id: promoMonthId, label: meta.label, year_month: meta.yearMonth, status: existing?.status === "published" ? "published" : "draft", source_pdf: cleanText(body.source_file, 200) || existing?.source_pdf || null, notes: "Latest-only staged upload", updated_at: now };
  const { error } = await supabase.from("promo_months").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`month_upsert_failed:${error.message}`);
  return row;
}

export async function ensureTemplates(supabase, promoMonthId, normalized, now, templateIdentity) {
  const labels = [...new Set(normalized.map(item => item.label))];
  const { data: existing, error: readError } = await supabase.from("promo_function_templates").select("*").eq("promo_month_id", promoMonthId).in("function_label", labels);
  if (readError) throw new Error(`templates_read_failed:${readError.message}`);
  const byLabel = new Map((existing || []).map(row => [row.function_label, row])), missing = labels.filter(label => !byLabel.has(label));
  if (missing.length) {
    const rows = [];
    for (const label of missing) {
      const sample = normalized.find(item => item.label === label), identity = await templateIdentity(promoMonthId, label);
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
    const chunk = paths.slice(i, i + 100), { error } = await supabase.storage.from(BUCKET).remove(chunk);
    if (error) throw new Error(`storage_remove_failed:${error.message}`);
    deleted += chunk.length;
  }
  return deleted;
}

async function deleteByMonth(supabase, table, oldIds) {
  if (!oldIds.length) return;
  const { error } = await supabase.from(table).delete().in("promo_month_id", oldIds);
  if (error) throw new Error(`${table}_cleanup_failed:${error.message}`);
}

export async function finalizeLatest(supabase, promoMonthId, body) {
  if (body.confirm_latest_only !== true) throw new Error("latest_only_confirmation_required");
  const expected = Number(body.expected_cards), expectedIds = Array.isArray(body.card_ids) ? [...new Set(body.card_ids.map(cleanCode).filter(Boolean))] : [];
  if (!Number.isInteger(expected) || expected < 1 || expected > 1000) throw new Error("invalid_expected_cards");
  if (expectedIds.length !== expected) throw new Error(`expected_card_ids_mismatch:${expectedIds.length}/${expected}`);

  const [monthResult, cardResult, detectionResult, matchResult, groupLinkResult] = await Promise.all([
    supabase.from("promo_months").select("id,status").eq("id", promoMonthId).maybeSingle(),
    supabase.from("promo_cards").select("card_id,image_url,promo_title,base_unit_price,unit_label,status").eq("promo_month_id", promoMonthId),
    supabase.from("promo_card_detections").select("card_id,detection_status,review_status,reviewed_function_label").eq("promo_month_id", promoMonthId),
    supabase.from("promo_card_function_matches").select("card_id,function_label,review_status").eq("promo_month_id", promoMonthId),
    supabase.from("promo_card_product_groups").select("card_id,group_id,decision,match_score,match_margin").eq("promo_month_id", promoMonthId),
  ]);
  if (monthResult.error) throw new Error(`finalize_month_read_failed:${monthResult.error.message}`);
  if (!monthResult.data || monthResult.data.status !== "draft") throw new Error(`finalize_month_not_draft:${promoMonthId}`);
  if (cardResult.error) throw new Error(`finalize_cards_read_failed:${cardResult.error.message}`);
  if (detectionResult.error) throw new Error(`finalize_detections_read_failed:${detectionResult.error.message}`);
  if (matchResult.error) throw new Error(`finalize_matches_read_failed:${matchResult.error.message}`);
  if (groupLinkResult.error) throw new Error(`finalize_group_links_read_failed:${groupLinkResult.error.message}`);

  const cardRows = cardResult.data || [], detectionRows = detectionResult.data || [], matchRows = matchResult.data || [], groupLinks = groupLinkResult.data || [];
  const cardIds = new Set(cardRows.map(row => row.card_id)), expectedSet = new Set(expectedIds);
  const missingExpected = expectedIds.filter(id => !cardIds.has(id)), unexpected = [...cardIds].filter(id => !expectedSet.has(id));
  const invalidCards = cardRows.filter(row => !row.image_url || !cleanText(row.promo_title, 200) || !(Number(row.base_unit_price) > 0) || !UNITS.has(row.unit_label) || row.status !== "ready").map(row => row.card_id);
  const invalidDetections = detectionRows.filter(row => row.detection_status !== "auto_ok" || !row.reviewed_function_label).map(row => row.card_id);
  const invalidMatches = matchRows.filter(row => !row.function_label).map(row => row.card_id);
  const invalidGroupLinks = groupLinks.filter(row => row.decision !== "MATCH" || !row.group_id || Number(row.match_score || 0) < 0.34 || Number(row.match_margin || 0) < 0.03).map(row => row.card_id);

  const [{ data: tierRows, error: tierError }, { data: groupRows, error: groupError }, { data: priceRows, error: priceError }] = await Promise.all([
    supabase.from("promo_tiers").select("card_id").like("card_id", `${promoMonthId}-%`),
    supabase.from("promo_product_groups").select("group_id,master_product_id,status").eq("promo_month_id", promoMonthId),
    supabase.from("promo_group_prices").select("group_id,base_unit_price,unit_label").eq("promo_month_id", promoMonthId),
  ]);
  if (tierError) throw new Error(`finalize_tiers_read_failed:${tierError.message}`);
  if (groupError) throw new Error(`finalize_groups_read_failed:${groupError.message}`);
  if (priceError) throw new Error(`finalize_group_prices_read_failed:${priceError.message}`);
  const tierCardCount = new Set((tierRows || []).map(row => row.card_id)).size;
  const validGroupIds = new Set((groupRows || []).filter(row => row.master_product_id && row.status === "active").map(row => row.group_id));
  const pricedGroupIds = new Set((priceRows || []).filter(row => Number(row.base_unit_price) > 0 && UNITS.has(row.unit_label)).map(row => row.group_id));
  const linksWithoutGroup = groupLinks.filter(row => !validGroupIds.has(row.group_id) || !pricedGroupIds.has(row.group_id)).map(row => row.card_id);

  const valid = cardRows.length === expected && detectionRows.length === expected && matchRows.length === expected && groupLinks.length === expected && tierCardCount === expected && !missingExpected.length && !unexpected.length && !invalidCards.length && !invalidDetections.length && !invalidMatches.length && !invalidGroupLinks.length && !linksWithoutGroup.length;
  if (!valid) return { ok: false, error: "finalize_validation_failed", status: 409, detail: { expected, cards: cardRows.length, detections: detectionRows.length, matches: matchRows.length, group_links: groupLinks.length, tier_cards: tierCardCount, missing_expected: missingExpected.slice(0, 20), unexpected: unexpected.slice(0, 20), invalid_cards: invalidCards.slice(0, 20), invalid_detections: invalidDetections.slice(0, 20), invalid_matches: invalidMatches.slice(0, 20), invalid_group_links: invalidGroupLinks.slice(0, 20), links_without_group_or_price: linksWithoutGroup.slice(0, 20) } };

  const { data: months, error: monthsError } = await supabase.from("promo_months").select("id").neq("id", promoMonthId);
  if (monthsError) throw new Error(`old_months_read_failed:${monthsError.message}`);
  const oldIds = (months || []).map(row => row.id);
  const oldStorage = [];
  for (const oldId of oldIds) oldStorage.push(...await listStorageFiles(supabase, oldId));

  const now = new Date().toISOString();
  const { error: publishError } = await supabase.from("promo_months").update({ status: "published", published_at: now, updated_at: now, notes: "Latest-only current month" }).eq("id", promoMonthId).eq("status", "draft");
  if (publishError) throw new Error(`month_publish_failed:${publishError.message}`);

  if (oldIds.length) {
    await deleteByMonth(supabase, "promo_group_prices", oldIds);
    await deleteByMonth(supabase, "promo_card_product_groups", oldIds);
    await deleteByMonth(supabase, "promo_product_groups", oldIds);
    await deleteByMonth(supabase, "promo_card_function_matches", oldIds);
    await deleteByMonth(supabase, "promo_card_detections", oldIds);
    await deleteByMonth(supabase, "promo_function_templates", oldIds);
    const { error } = await supabase.from("promo_months").delete().in("id", oldIds);
    if (error) throw new Error(`old_months_delete_failed:${error.message}`);
  }

  let filesDeleted = await removeStorageFiles(supabase, oldStorage);
  const currentFiles = await listStorageFiles(supabase, promoMonthId), referenced = new Set(cardRows.map(row => publicPath(row.image_url)).filter(Boolean)), stale = currentFiles.filter(path => !referenced.has(path) && !path.includes("/source/"));
  filesDeleted += await removeStorageFiles(supabase, stale);
  return { ok: true, action: "finalize_latest", current_month: promoMonthId, validated_cards: expected, old_months_deleted: oldIds, files_deleted: filesDeleted, stale_current_files_deleted: stale.length };
}
