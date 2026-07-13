import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { parseFunctionLabel, promoTierRows, templateIdentity } from "./promo-function-sync.js";
import {
  BUCKET,
  CLASS_SORT,
  corsHeaders,
  json,
  cleanCode,
  cleanFilename,
  cleanText,
  cleanConfidence,
  cleanPrice,
  cleanUnit,
  cleanUuid,
  cleanBox,
  dataUrlToBytes,
  parseFromFilename,
  sha256Hex,
  mapLimit,
  ensureMonth,
  ensureTemplates,
  finalizeLatest,
  groupIdForMaster,
} from "./promo-latest-core.ts";

function closePrice(a, b) {
  const x = Number(a), y = Number(b);
  return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= Math.max(0.1, Math.max(x, y) * 0.008);
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const started = performance.now(), url = Deno.env.get("SUPABASE_URL") || "", serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) return json({ ok: false, error: "missing_supabase_env" }, 503);
  const adminKey = req.headers.get("x-promo-admin-key") || "";
  if (!adminKey) return json({ ok: false, error: "missing_admin_key" }, 401);
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } }), keyHash = await sha256Hex(adminKey);
  const { data: keyRows, error: keyError } = await supabase.from("promo_upload_keys").select("key_hash,active").eq("key_hash", keyHash).eq("active", true).limit(1);
  if (keyError) return json({ ok: false, error: "key_check_failed", detail: keyError.message }, 500);
  if (!keyRows?.length) return json({ ok: false, error: "invalid_admin_key" }, 401);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json_body" }, 400); }
  const action = String(body?.action || "").trim(), promoMonthId = cleanCode(body?.promo_month_id);
  if (!promoMonthId) return json({ ok: false, error: "missing_promo_month_id" }, 400);

  try {
    if (action === "finalize_latest") {
      const result = await finalizeLatest(supabase, promoMonthId, body);
      return json(result, result.status || (result.ok ? 200 : 409));
    }
    if (action !== "batch_upload") return json({ ok: false, error: "unsupported_action" }, 400);

    const cards = Array.isArray(body.cards) ? body.cards : [];
    if (!cards.length || cards.length > 20) return json({ ok: false, error: "invalid_batch_size", max: 20 }, 400);

    const prelim = cards.map(raw => {
      const fileName = cleanFilename(raw?.file_name), parsed = parseFromFilename(fileName);
      if (!parsed) throw new Error(`bad_filename:${fileName}`);
      const cardId = `${promoMonthId}-${parsed.classId}-${String(parsed.cardNo).padStart(3, "0")}`;
      const detectionStatus = raw?.detection_status === "auto_ok" ? "auto_ok" : "need_review";
      const parsedFunction = parseFunctionLabel(cleanText(raw?.detected_function_label || raw?.benefit_text, 500));
      const baseUnitPrice = cleanPrice(raw?.base_unit_price), unitLabel = cleanUnit(raw?.unit_label), masterProductId = cleanUuid(raw?.master_product_id);
      const masterScore = cleanConfidence(raw?.master_match_score), masterMargin = cleanConfidence(raw?.master_match_margin);
      if (detectionStatus !== "auto_ok") throw new Error(`function_not_auto_ok:${cardId}`);
      if (raw?.price_status !== "auto_ok" || raw?.title_status !== "auto_ok" || raw?.master_status !== "auto_ok" || baseUnitPrice == null || !unitLabel || !masterProductId) throw new Error(`metadata_not_auto_ok:${cardId}`);
      if (masterScore == null || masterScore < 34 || masterMargin == null || masterMargin < 3) throw new Error(`master_match_too_weak:${cardId}:${masterScore}/${masterMargin}`);
      return { raw, fileName, parsed, cardId, parsedFunction, label: parsedFunction.label, baseUnitPrice, unitLabel, masterProductId, masterScore, masterMargin, fullPath: `${promoMonthId}/${parsed.classId}/${fileName}` };
    });
    if (new Set(prelim.map(item => item.cardId)).size !== prelim.length) return json({ ok: false, error: "duplicate_card_id_in_batch" }, 400);

    const masterIds = [...new Set(prelim.map(item => item.masterProductId))];
    const { data: masters, error: masterError } = await supabase.from("promo_product_master").select("master_product_id,canonical_name,unit_label,status").in("master_product_id", masterIds);
    if (masterError) throw new Error(`product_master_read_failed:${masterError.message}`);
    const masterById = new Map((masters || []).map(row => [row.master_product_id, row]));
    const normalized = prelim.map(item => {
      const master = masterById.get(item.masterProductId);
      if (!master || master.status !== "active" || !cleanText(master.canonical_name, 200)) throw new Error(`product_master_not_active:${item.cardId}`);
      return { ...item, promoTitle: cleanText(master.canonical_name, 200), groupId: groupIdForMaster(promoMonthId, item.masterProductId), master };
    });

    const now = new Date().toISOString();
    await ensureMonth(supabase, promoMonthId, body, now);
    const ids = normalized.map(item => item.cardId);
    const groupIds = [...new Set(normalized.map(item => item.groupId))];
    const [existingCardsResult, existingMatchesResult, existingPricesResult] = await Promise.all([
      supabase.from("promo_cards").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
      supabase.from("promo_card_function_matches").select("*").eq("promo_month_id", promoMonthId).in("card_id", ids),
      supabase.from("promo_group_prices").select("group_id,base_unit_price,unit_label").eq("promo_month_id", promoMonthId).in("group_id", groupIds),
    ]);
    if (existingCardsResult.error) throw new Error(`cards_read_failed:${existingCardsResult.error.message}`);
    if (existingMatchesResult.error) throw new Error(`matches_read_failed:${existingMatchesResult.error.message}`);
    if (existingPricesResult.error) throw new Error(`group_prices_read_failed:${existingPricesResult.error.message}`);
    const cardsById = new Map((existingCardsResult.data || []).map(row => [row.card_id, row])), matchesById = new Map((existingMatchesResult.data || []).map(row => [row.card_id, row])), pricesByGroup = new Map((existingPricesResult.data || []).map(row => [row.group_id, row]));

    const batchPriceByGroup = new Map();
    for (const item of normalized) {
      const oldBatch = batchPriceByGroup.get(item.groupId);
      if (oldBatch && (!closePrice(oldBatch.baseUnitPrice, item.baseUnitPrice) || oldBatch.unitLabel !== item.unitLabel)) throw new Error(`batch_group_price_conflict:${item.groupId}`);
      batchPriceByGroup.set(item.groupId, { baseUnitPrice: item.baseUnitPrice, unitLabel: item.unitLabel });
      const old = pricesByGroup.get(item.groupId);
      if (old && (!closePrice(old.base_unit_price, item.baseUnitPrice) || old.unit_label !== item.unitLabel)) throw new Error(`stored_group_price_conflict:${item.groupId}`);
    }

    const templatesByLabel = await ensureTemplates(supabase, promoMonthId, normalized, now, templateIdentity), skipExistingImages = body.skip_existing_images === true;
    const uploaded = await mapLimit(normalized, 5, async item => {
      const old = cardsById.get(item.cardId);
      if (skipExistingImages && old?.image_url) return { cardId: item.cardId, publicUrl: old.image_url, fileName: old.image_name || item.fileName, skipped: true };
      const { mime, bytes } = dataUrlToBytes(item.raw?.data_url);
      if (!mime.startsWith("image/")) throw new Error(`image_required:${item.cardId}`);
      if (bytes.byteLength > 1_200_000) throw new Error(`image_too_large:${item.cardId}:${bytes.byteLength}`);
      const { error } = await supabase.storage.from(BUCKET).upload(item.fullPath, bytes, { contentType: mime, upsert: true });
      if (error) throw new Error(`storage_upload_failed:${item.cardId}:${error.message}`);
      return { cardId: item.cardId, publicUrl: `${url}/storage/v1/object/public/${BUCKET}/${item.fullPath}`, fileName: item.fileName, skipped: false };
    });
    const uploadedById = new Map(uploaded.map(row => [row.cardId, row]));

    const cardRows = normalized.map(item => ({ ...(cardsById.get(item.cardId) || {}), card_id: item.cardId, promo_month_id: promoMonthId, class_id: item.parsed.classId, page_no: item.parsed.pageNo, card_no: item.parsed.cardNo, promo_title: item.promoTitle, promo_type: item.parsedFunction.functionType === "free_goods" ? "free_goods" : "discount", status: "ready", base_unit_price: item.baseUnitPrice, unit_label: item.unitLabel, image_name: uploadedById.get(item.cardId).fileName, image_url: uploadedById.get(item.cardId).publicUrl, source_file: cleanText(body.source_file, 200) || cardsById.get(item.cardId)?.source_file || null, source_sheet: "dynamic_grid_master_consensus_v3", sort_order: (CLASS_SORT[item.parsed.classId] || 9000) + item.parsed.cardNo, updated_at: now }));
    const detectionRows = normalized.map(item => ({ promo_month_id: promoMonthId, card_id: item.cardId, class_id: item.parsed.classId, card_no: item.parsed.cardNo, page_no: item.parsed.pageNo, condition_text: `สินค้า ${item.promoTitle}; ราคากลาง ${item.baseUnitPrice}/${item.unitLabel}`, benefit_text: item.label, detected_function_label: item.label, condition_confidence: cleanConfidence(item.raw?.price_confidence), benefit_confidence: cleanConfidence(item.raw?.benefit_confidence), condition_box: {}, benefit_box: cleanBox(item.raw?.benefit_box), condition_image_url: null, benefit_image_url: null, detection_status: "auto_ok", detection_method: cleanText(item.raw?.detection_method, 100) || "dynamic_grid_master_consensus_v3", review_status: "auto_detected", reviewed_function_label: item.label, detected_at: now, reviewed_at: now, updated_at: now }));
    const matchRows = normalized.map(item => {
      const previous = matchesById.get(item.cardId) || {}, template = templatesByLabel.get(item.label), confidence = cleanConfidence(item.raw?.benefit_confidence);
      return { ...previous, promo_month_id: promoMonthId, card_id: item.cardId, template_id: template.template_id, class_id: item.parsed.classId, card_no: item.parsed.cardNo, page_no: item.parsed.pageNo, cluster_id: template.cluster_id, function_label: item.label, function_type: item.parsedFunction.functionType, function_payload: item.parsedFunction.payload, match_method: "dynamic_grid_master_consensus_v3", confidence: confidence == null ? 1 : confidence / 100, review_status: "auto_detected", condition_text: `สินค้า ${item.promoTitle}; ราคากลาง ${item.baseUnitPrice}/${item.unitLabel}`, benefit_text: item.label, detected_function_label: item.label, condition_confidence: cleanConfidence(item.raw?.price_confidence), benefit_confidence: confidence, condition_box: {}, benefit_box: cleanBox(item.raw?.benefit_box), condition_image_url: null, benefit_image_url: null, detection_status: "auto_ok", detection_method: cleanText(item.raw?.detection_method, 100) || "dynamic_grid_master_consensus_v3", detected_at: now, updated_at: now };
    });
    const tierRows = normalized.flatMap(item => promoTierRows(item.cardId, item.parsedFunction));

    const firstByGroup = new Map();
    for (const item of normalized) if (!firstByGroup.has(item.groupId)) firstByGroup.set(item.groupId, item);
    const groupRows = [...firstByGroup.values()].map(item => ({ group_id: item.groupId, promo_month_id: promoMonthId, anchor_card_id: item.cardId, canonical_name: item.promoTitle, detection_method: "master_title_visual_price_consensus_v3", status: "active", master_product_id: item.masterProductId, updated_at: now }));
    const cardGroupRows = normalized.map(item => ({ promo_month_id: promoMonthId, card_id: item.cardId, group_id: item.groupId, decision: "MATCH", match_score: item.masterScore / 100, match_margin: item.masterMargin / 100, visual_score: cleanConfidence(item.raw?.visual_match_score) == null ? null : cleanConfidence(item.raw?.visual_match_score) / 100, title_score: item.masterScore / 100, size_score: null, price_image_score: cleanConfidence(item.raw?.price_confidence) == null ? null : cleanConfidence(item.raw?.price_confidence) / 100, reason: "Product master + dual title OCR + group price consensus", adaptive: true, evidence: { master_product_id: item.masterProductId, canonical_name: item.promoTitle, title_ocr: cleanText(item.raw?.title_ocr, 500), price_support: Number(item.raw?.price_group_support || 0), visual_hash: cleanText(item.raw?.visual_title_hash, 100) }, updated_at: now }));
    const groupPriceRows = [...batchPriceByGroup.entries()].map(([groupId, value]) => ({ promo_month_id: promoMonthId, group_id: groupId, base_unit_price: value.baseUnitPrice, unit_label: value.unitLabel, auth_hash: null, price_source: "auto_ocr_group_consensus_v3", updated_at: now }));

    const writeResults = await Promise.all([
      supabase.from("promo_product_groups").upsert(groupRows, { onConflict: "group_id" }),
      supabase.from("promo_cards").upsert(cardRows, { onConflict: "card_id" }),
      supabase.from("promo_card_detections").upsert(detectionRows, { onConflict: "promo_month_id,card_id" }),
      supabase.from("promo_card_function_matches").upsert(matchRows, { onConflict: "promo_month_id,card_id" }),
      supabase.from("promo_card_product_groups").upsert(cardGroupRows, { onConflict: "promo_month_id,card_id" }),
      supabase.from("promo_group_prices").upsert(groupPriceRows, { onConflict: "promo_month_id,group_id" }),
    ]);
    const writeNames = ["groups", "cards", "detections", "matches", "card_groups", "group_prices"];
    writeResults.forEach((result, index) => { if (result.error) throw new Error(`${writeNames[index]}_upsert_failed:${result.error.message}`); });

    const { error: tierDeleteError } = await supabase.from("promo_tiers").delete().in("card_id", ids);
    if (tierDeleteError) throw new Error(`tiers_delete_failed:${tierDeleteError.message}`);
    if (tierRows.length) {
      const { error } = await supabase.from("promo_tiers").insert(tierRows);
      if (error) throw new Error(`tiers_insert_failed:${error.message}`);
    }

    return json({ ok: true, action, uploaded: normalized.length, images_uploaded: uploaded.filter(row => !row.skipped).length, images_reused: uploaded.filter(row => row.skipped).length, functions_synced: matchRows.length, tiers_synced: tierRows.length, prices_synced: cardRows.length, groups_synced: groupRows.length, master_links_synced: cardGroupRows.length, card_ids: ids, total_ms: Math.round(performance.now() - started) });
  } catch (error) {
    return json({ ok: false, error: action === "finalize_latest" ? "finalize_latest_failed" : "batch_upload_failed", detail: String(error?.message || error) }, 500);
  }
});
