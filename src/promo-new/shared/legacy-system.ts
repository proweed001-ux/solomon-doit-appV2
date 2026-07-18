import type { PromoCard, PromoDataset, Sku } from '../domain/types';

const MONTH_CODES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const LEGACY_CLASS: Record<string, string> = {
  HFSS: 'HFSS',
  HFSM: 'HFSM',
  HFSL: 'HFSL',
  HFSXL: 'HFSXL',
  'HFSWS-S': 'HFSWSS',
  'HFSWS-L': 'HFSWSL',
};
const VALID_UNITS = new Set(['ขวด', 'ชิ้น', 'แพ็ค', 'กล่อง', 'ลัง', 'ซอง', 'ถุง', 'ชุด', 'ด้าม']);

export interface LegacyUploadCard {
  file_name: string;
  data_url?: string;
  detected_function_label: string;
  benefit_text: string;
  detection_status: 'auto_ok';
  detection_method: string;
  benefit_confidence: number;
  price_status: 'auto_ok';
  title_status: 'auto_ok';
  master_status: 'auto_ok';
  base_unit_price: number;
  unit_label: string;
  master_product_id: string;
  master_match_score: number;
  master_match_margin: number;
  title_consensus_score: number;
  master_is_new: boolean;
  master_canonical_name: string;
  master_normalized_key: string;
  title_ocr: string;
  price_group_support: number;
}

export interface LegacyUploadPlan {
  promoMonthId: string;
  sourceFile: string | null;
  workbookFile: string | null;
  cards: LegacyUploadCard[];
  cardIds: string[];
}

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

export function toLegacyMonthId(monthKey: string): string {
  const value = clean(monthKey).toUpperCase();
  if (/^[A-Z]{3}\d{2}$/u.test(value)) return value;
  const match = value.match(/^(?:PROMO-)?(\d{4})-(\d{2})$/u);
  if (!match) throw new Error(`legacy_month_invalid:${monthKey}`);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new Error(`legacy_month_invalid:${monthKey}`);
  return `${MONTH_CODES[month - 1]}${match[1].slice(-2)}`;
}

export function toLegacyClassId(classId: string | null): string {
  const value = clean(classId).toUpperCase();
  const mapped = LEGACY_CLASS[value];
  if (!mapped) throw new Error(`legacy_class_invalid:${classId || 'missing'}`);
  return mapped;
}

export function normalizeLegacyMasterKey(value: unknown): string {
  return clean(value)
    .toLowerCase()
    .replace(/[๐-๙]/g, digit => ({ '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4', '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9' }[digit] || digit))
    .replace(/ราคาแนะนําขายปลีก|ราคาแนะนำขายปลีก|ทุกสูตร|ขนาด|ปกติ|เฉลี่ย|เมื่อซื้อ|บาท|ชุด/giu, '')
    .replace(/มล\.?/giu, 'ml')
    .replace(/กรัม/giu, 'g')
    .replace(/[^a-z0-9ก-๙]/gu, '')
    .slice(0, 240);
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function legacyMasterIdentity(normalizedKey: string): Promise<string> {
  const key = normalizeLegacyMasterKey(normalizedKey);
  if (key.length < 5) throw new Error('legacy_master_key_too_short');
  const chars = (await sha256Hex(`promo-product-master|${key}`)).slice(0, 32).split('');
  chars[12] = '5';
  chars[16] = ((Number.parseInt(chars[16], 16) & 3) | 8).toString(16);
  const value = chars.join('');
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

function normalizedUnit(value: unknown): string {
  const unit = clean(value).replace('แพค', 'แพ็ค');
  return VALID_UNITS.has(unit) ? unit : 'ชิ้น';
}

function confidence(value: unknown): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return 100;
  return Math.max(0, Math.min(100, number <= 1 ? number * 100 : number));
}

function tierLabel(card: PromoCard): string {
  const labels = card.promotionTiers.map(tier => clean(tier.sourceText)).filter(Boolean);
  if (!labels.length) throw new Error(`legacy_tiers_missing:${card.id}`);
  return labels.join('; ');
}

async function masterForSku(sku: Sku): Promise<{ id: string; isNew: boolean; key: string }> {
  const existing = String(sku.id || '').match(/^MASTER-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu);
  const key = normalizeLegacyMasterKey(sku.canonicalName || sku.identityKey);
  if (existing) return { id: existing[1].toLowerCase(), isNew: false, key };
  if (sku.status !== 'active' || sku.failureReasons.length) throw new Error(`legacy_master_not_confirmed:${sku.id}`);
  return { id: await legacyMasterIdentity(key), isNew: true, key };
}

export async function buildLegacyUploadPlan(dataset: PromoDataset): Promise<LegacyUploadPlan> {
  if (!dataset?.cards.length) throw new Error('legacy_dataset_empty');
  const promoMonthId = toLegacyMonthId(dataset.version.monthKey);
  const groupById = new Map(dataset.productGroups.map(group => [group.id, group]));
  const sorted = [...dataset.cards].sort((left, right) => left.page - right.page || left.sequence - right.sequence || left.id.localeCompare(right.id));
  const nextByClass = new Map<string, number>();
  const cards: LegacyUploadCard[] = [];
  const cardIds: string[] = [];

  for (const card of sorted) {
    if (card.status !== 'ready' || card.failureReasons.length) throw new Error(`legacy_card_not_ready:${card.id}`);
    const group = groupById.get(card.productGroupId || '');
    if (!group || group.status !== 'ready' || group.failureReasons.length) throw new Error(`legacy_group_not_ready:${card.productGroupId || card.id}`);
    const legacyClass = toLegacyClassId(card.classId);
    const cardNo = nextByClass.get(legacyClass) || 1;
    nextByClass.set(legacyClass, cardNo + 1);
    const fileName = `${legacyClass}-${String(cardNo).padStart(3, '0')}-p${String(card.page).padStart(2, '0')}.webp`;
    const master = await masterForSku(group.sku);
    const amount = Number(card.price.effectivePrice?.amount || group.price.effectivePrice?.amount);
    if (!(amount > 0)) throw new Error(`legacy_price_missing:${card.id}`);
    const functionLabel = tierLabel(card);
    const unit = normalizedUnit(group.sku.identity.salesUnit || card.promotionTiers[0]?.purchaseUnit);
    const evidenceConfidence = confidence(card.evidence.confidence);
    const image = String(card.imageUrl || '');
    if (!image.startsWith('data:image/') && !image.startsWith('http')) throw new Error(`legacy_image_invalid:${card.id}`);

    cards.push({
      file_name: fileName,
      ...(image.startsWith('data:image/') ? { data_url: image } : {}),
      detected_function_label: functionLabel,
      benefit_text: functionLabel,
      detection_status: 'auto_ok',
      detection_method: 'promo_system_rebuild_legacy_adapter_v1',
      benefit_confidence: evidenceConfidence,
      price_status: 'auto_ok',
      title_status: 'auto_ok',
      master_status: 'auto_ok',
      base_unit_price: amount,
      unit_label: unit,
      master_product_id: master.id,
      master_match_score: master.isNew ? 100 : Math.max(34, evidenceConfidence),
      master_match_margin: master.isNew ? 100 : Math.max(3, Math.min(100, evidenceConfidence)),
      title_consensus_score: master.isNew ? 100 : evidenceConfidence,
      master_is_new: master.isNew,
      master_canonical_name: group.sku.canonicalName,
      master_normalized_key: master.key,
      title_ocr: group.sku.canonicalName,
      price_group_support: group.cardIds.length,
    });
    cardIds.push(`${promoMonthId}-${legacyClass}-${String(cardNo).padStart(3, '0')}`);
  }

  if (new Set(cardIds).size !== cardIds.length) throw new Error('legacy_card_id_duplicate');
  return {
    promoMonthId,
    sourceFile: dataset.version.source.pdfName,
    workbookFile: dataset.version.source.workbookName,
    cards,
    cardIds,
  };
}

export function chunkLegacyCards(cards: LegacyUploadCard[], size = 20): LegacyUploadCard[][] {
  const chunks: LegacyUploadCard[][] = [];
  for (let index = 0; index < cards.length; index += size) chunks.push(cards.slice(index, index + size));
  return chunks;
}
