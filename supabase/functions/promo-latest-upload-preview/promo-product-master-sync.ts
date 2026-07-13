import { cleanText, cleanUnit, cleanUuid, sha256Hex } from "./promo-latest-core.ts";

export function normalizeMasterKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[๐-๙]/g, d => ({ "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4", "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9" }[d] || d))
    .replace(/ราคาแนะนําขายปลีก|ราคาแนะนำขายปลีก|ทุกสูตร|ขนาด|ปกติ|เฉลี่ย|เมื่อซื้อ|บาท|ชุด/gi, "")
    .replace(/มล\.?/g, "ml")
    .replace(/กรัม/g, "g")
    .replace(/[^a-z0-9ก-๙]/g, "")
    .slice(0, 240);
}

export async function masterIdentity(normalizedKey) {
  const key = normalizeMasterKey(normalizedKey);
  if (key.length < 5) throw new Error("novel_master_key_too_short");
  const hex = (await sha256Hex(`promo-product-master|${key}`)).slice(0, 32).split("");
  hex[12] = "5";
  hex[16] = ((Number.parseInt(hex[16], 16) & 3) | 8).toString(16);
  const h = hex.join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export async function resolveProductMasters(supabase, prelim, promoMonthId, now) {
  const { data: month, error: monthError } = await supabase.from("promo_months").select("status").eq("id", promoMonthId).maybeSingle();
  if (monthError) throw new Error(`product_master_month_read_failed:${monthError.message}`);
  if (month?.status === "published") throw new Error(`published_month_locked:${promoMonthId}`);

  const requestedIds = [...new Set(prelim.map(item => item.masterProductId).filter(Boolean))];
  const { data: existingRows, error: readError } = await supabase.from("promo_product_master").select("master_product_id,canonical_name,normalized_key,unit_label,status").in("master_product_id", requestedIds);
  if (readError) throw new Error(`product_master_read_failed:${readError.message}`);
  const byId = new Map((existingRows || []).map(row => [row.master_product_id, row]));
  const novelById = new Map();

  for (const item of prelim) {
    const existing = byId.get(item.masterProductId);
    if (existing) {
      if (existing.status !== "active" || !cleanText(existing.canonical_name, 200)) throw new Error(`product_master_not_active:${item.cardId}`);
      if (item.masterIsNew) throw new Error(`product_master_exists_but_marked_new:${item.cardId}`);
      continue;
    }
    if (!item.masterIsNew) throw new Error(`product_master_not_found:${item.cardId}`);
    if (item.titleConsensusScore < 72 || item.masterScore < 99 || item.masterMargin < 99) throw new Error(`novel_master_evidence_too_weak:${item.cardId}`);
    const canonicalName = cleanText(item.masterCanonicalName, 200), normalizedKey = normalizeMasterKey(item.masterNormalizedKey || canonicalName), unitLabel = cleanUnit(item.unitLabel);
    if (!canonicalName || normalizedKey.length < 5 || !unitLabel) throw new Error(`novel_master_metadata_invalid:${item.cardId}`);
    const expectedId = await masterIdentity(normalizedKey);
    if (cleanUuid(item.masterProductId) !== expectedId) throw new Error(`novel_master_identity_mismatch:${item.cardId}`);
    const previous = novelById.get(expectedId);
    if (previous && (previous.canonical_name !== canonicalName || previous.normalized_key !== normalizedKey || previous.unit_label !== unitLabel)) throw new Error(`novel_master_conflict:${item.cardId}`);
    novelById.set(expectedId, { master_product_id: expectedId, canonical_name: canonicalName, normalized_key: normalizedKey, unit_label: unitLabel, status: "active", created_from_month: promoMonthId, created_from_group_id: null, created_at: now, updated_at: now });
  }

  if (novelById.size) {
    const rows = [...novelById.values()];
    const { error } = await supabase.from("promo_product_master").upsert(rows, { onConflict: "master_product_id" });
    if (error) throw new Error(`novel_product_master_upsert_failed:${error.message}`);
    const aliases = rows.map(row => ({ master_product_id: row.master_product_id, alias_text: row.canonical_name, normalized_alias: row.normalized_key }));
    const { error: aliasError } = await supabase.from("promo_product_master_aliases").upsert(aliases, { onConflict: "master_product_id,normalized_alias" });
    if (aliasError) throw new Error(`novel_product_alias_upsert_failed:${aliasError.message}`);
    for (const row of rows) byId.set(row.master_product_id, row);
  }

  return byId;
}
