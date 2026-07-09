export type PromoStatus = 'draft' | 'published' | 'archived';
export type CardStatus = 'ready' | 'need_review' | 'inactive' | 'missing' | 'changed' | 'new' | 'repeated';
export type MatchStatus = 'matched' | 'need_review' | 'not_found' | 'multi_match' | 'manual';
export type PriceStatus = 'found' | 'missing' | 'manual' | 'conflict';
export type ReviewStatus = 'pending' | 'fixed' | 'ignored';

export type PromoMonth = {
  id: string;
  label: string;
  year_month: string;
  status: PromoStatus;
  source_pdf?: string;
  source_price_file?: string;
  notes?: string;
  published_at?: string | null;
};

export type PromoClass = {
  class_id: string;
  class_name: string;
  description?: string;
  sort_order: number;
  active: boolean;
};

export type PromoCard = {
  card_id: string;
  promo_month_id: string;
  class_id: string;
  page_no?: number | null;
  card_no?: number | null;
  initiative_id?: string;
  promo_title: string;
  raw_text?: string;
  promo_type: string;
  status: CardStatus;
  image_url?: string;
  image_name?: string;
  source_file?: string;
  source_sheet?: string;
  barcodes?: string;
  sort_order: number;
};

export type SkuMaster = {
  sku_id: string;
  barcode?: string;
  brand: string;
  product_name: string;
  product_type?: string;
  variant?: string;
  size_text?: string;
  size_min?: number | null;
  size_max?: number | null;
  unit?: string;
  active: boolean;
};

export type CardSku = {
  card_sku_id: string;
  card_id: string;
  sku_id?: string | null;
  brand_text?: string;
  product_text?: string;
  product_type?: string;
  size_text?: string;
  variant?: string;
  unit?: string;
  match_status: MatchStatus;
  match_method?: string;
  confidence?: number | null;
  note?: string;
  barcodes?: string;
  sort_order: number;
};

export type PriceByMonth = {
  price_id: string;
  promo_month_id: string;
  sku_id: string;
  brand?: string;
  product_name?: string;
  price?: number | null;
  price_status: PriceStatus;
  source_file?: string;
  source_sheet?: string;
  source_row?: number | null;
};

export type PromoTier = {
  tier_id: string;
  card_id: string;
  tier_no: number;
  min_qty_text?: string;
  min_qty?: number | null;
  max_qty?: number | null;
  unit?: string;
  discount_percent?: number | null;
  free_qty?: number | null;
  note?: string;
};

export type ReviewItem = {
  review_id: string;
  promo_month_id: string;
  card_id?: string | null;
  problem_type: string;
  target_table?: string;
  raw_text?: string;
  suggestion?: string;
  fix_value?: string;
  status: ReviewStatus;
  note?: string;
};

export type PromoBundle = {
  promo_months: PromoMonth[];
  promo_classes: PromoClass[];
  promo_cards: PromoCard[];
  sku_master: SkuMaster[];
  card_skus: CardSku[];
  price_by_month: PriceByMonth[];
  promo_tiers: PromoTier[];
  review_queue: ReviewItem[];
};

export type PromoSession = {
  access_token: string;
  refresh_token?: string;
  user?: { id: string; email?: string };
};

const asNumber = (value: unknown): number | null => {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const asText = (value: unknown): string => String(value ?? '').trim();

export function normalizePromoBundle(raw: unknown): PromoBundle {
  const data = raw as Record<string, unknown>;
  const monthsSource = (data.promo_months ?? data.promo_month ?? []) as unknown[];
  const classesSource = (data.promo_classes ?? data.promo_class ?? []) as unknown[];
  const cardsSource = (data.promo_cards ?? data.promo_card ?? []) as unknown[];
  const skuSource = (data.sku_master ?? []) as unknown[];
  const cardSkuSource = (data.card_skus ?? data.card_sku ?? []) as unknown[];
  const priceSource = (data.price_by_month ?? []) as unknown[];
  const tierSource = (data.promo_tiers ?? data.promo_tier ?? []) as unknown[];
  const reviewSource = (data.review_queue ?? []) as unknown[];

  const promo_months = monthsSource.map((row: any): PromoMonth => Array.isArray(row) ? {
    id: asText(row[0]),
    label: asText(row[1]) || asText(row[0]),
    year_month: asText(row[2]),
    source_price_file: asText(row[3]),
    source_pdf: asText(row[4]),
    status: (asText(row[5]) === 'published' ? 'published' : asText(row[5]) === 'archived' ? 'archived' : 'draft'),
    notes: asText(row[6]),
  } : {
    id: asText(row.id),
    label: asText(row.label),
    year_month: asText(row.year_month),
    status: (asText(row.status) as PromoStatus) || 'draft',
    source_pdf: asText(row.source_pdf),
    source_price_file: asText(row.source_price_file),
    notes: asText(row.notes),
    published_at: row.published_at ?? null,
  });

  const promo_classes = classesSource.map((row: any): PromoClass => Array.isArray(row) ? {
    class_id: asText(row[0]),
    class_name: asText(row[1]),
    description: asText(row[2]),
    sort_order: asNumber(row[3]) ?? 999,
    active: row[4] !== false,
  } : {
    class_id: asText(row.class_id),
    class_name: asText(row.class_name),
    description: asText(row.description),
    sort_order: asNumber(row.sort_order) ?? 999,
    active: row.active !== false,
  });

  const promo_cards = cardsSource.map((row: any): PromoCard => Array.isArray(row) ? {
    card_id: asText(row[0]),
    promo_month_id: asText(row[1]),
    class_id: asText(row[2]),
    page_no: asNumber(row[4]),
    initiative_id: asText(row[5]),
    promo_title: asText(row[6]) || asText(row[7]) || asText(row[0]),
    raw_text: asText(row[7]),
    promo_type: asText(row[8]) || 'discount',
    status: (asText(row[9]) as CardStatus) || 'need_review',
    image_name: asText(row[10]),
    source_file: asText(row[11]),
    source_sheet: asText(row[12]),
    barcodes: asText(row[13]),
    sort_order: asNumber(row[14]) ?? 999,
  } : {
    card_id: asText(row.card_id),
    promo_month_id: asText(row.promo_month_id),
    class_id: asText(row.class_id),
    page_no: asNumber(row.page_no),
    card_no: asNumber(row.card_no),
    initiative_id: asText(row.initiative_id),
    promo_title: asText(row.promo_title),
    raw_text: asText(row.raw_text),
    promo_type: asText(row.promo_type) || 'discount',
    status: (asText(row.status) as CardStatus) || 'need_review',
    image_url: asText(row.image_url),
    image_name: asText(row.image_name),
    source_file: asText(row.source_file),
    source_sheet: asText(row.source_sheet),
    barcodes: asText(row.barcodes),
    sort_order: asNumber(row.sort_order) ?? 999,
  });

  const sku_master = skuSource.map((row: any): SkuMaster => Array.isArray(row) ? {
    sku_id: asText(row[0]), barcode: asText(row[1]), brand: asText(row[2]), product_name: asText(row[3]),
    product_type: asText(row[4]), variant: asText(row[5]), size_text: asText(row[6]),
    size_min: asNumber(row[7]), size_max: asNumber(row[8]), unit: asText(row[9]), active: row[10] !== false,
  } : {
    sku_id: asText(row.sku_id), barcode: asText(row.barcode), brand: asText(row.brand), product_name: asText(row.product_name),
    product_type: asText(row.product_type), variant: asText(row.variant), size_text: asText(row.size_text),
    size_min: asNumber(row.size_min), size_max: asNumber(row.size_max), unit: asText(row.unit), active: row.active !== false,
  });

  const card_skus = cardSkuSource.map((row: any): CardSku => Array.isArray(row) ? {
    card_sku_id: asText(row[0]), card_id: asText(row[1]), sku_id: asText(row[2]) || null,
    brand_text: asText(row[3]), product_text: asText(row[4]), product_type: asText(row[5]), size_text: asText(row[6]), variant: asText(row[7]), unit: asText(row[8]),
    match_status: (asText(row[9]) as MatchStatus) || 'not_found', match_method: asText(row[10]), confidence: asNumber(row[11]), note: asText(row[12]), barcodes: asText(row[13]), sort_order: asNumber(row[14]) ?? 999,
  } : {
    card_sku_id: asText(row.card_sku_id), card_id: asText(row.card_id), sku_id: asText(row.sku_id) || null,
    brand_text: asText(row.brand_text), product_text: asText(row.product_text), product_type: asText(row.product_type), size_text: asText(row.size_text), variant: asText(row.variant), unit: asText(row.unit),
    match_status: (asText(row.match_status) as MatchStatus) || 'not_found', match_method: asText(row.match_method), confidence: asNumber(row.confidence), note: asText(row.note), barcodes: asText(row.barcodes), sort_order: asNumber(row.sort_order) ?? 999,
  });

  const price_by_month = priceSource.map((row: any): PriceByMonth => Array.isArray(row) ? {
    price_id: asText(row[0]), promo_month_id: asText(row[1]), sku_id: asText(row[2]), brand: asText(row[3]), product_name: asText(row[4]),
    price: asNumber(row[5]), price_status: (asText(row[6]) as PriceStatus) || 'missing', source_file: asText(row[7]), source_sheet: asText(row[8]), source_row: asNumber(row[9]),
  } : {
    price_id: asText(row.price_id), promo_month_id: asText(row.promo_month_id), sku_id: asText(row.sku_id), brand: asText(row.brand), product_name: asText(row.product_name),
    price: asNumber(row.price), price_status: (asText(row.price_status) as PriceStatus) || 'missing', source_file: asText(row.source_file), source_sheet: asText(row.source_sheet), source_row: asNumber(row.source_row),
  });

  const promo_tiers = tierSource.map((row: any): PromoTier => Array.isArray(row) ? {
    tier_id: asText(row[0]), card_id: asText(row[1]), tier_no: asNumber(row[2]) ?? 1, min_qty_text: asText(row[3]), min_qty: asNumber(row[4]), max_qty: asNumber(row[5]), unit: asText(row[6]), discount_percent: asNumber(row[7]), free_qty: asNumber(row[8]), note: asText(row[9]),
  } : {
    tier_id: asText(row.tier_id), card_id: asText(row.card_id), tier_no: asNumber(row.tier_no) ?? 1, min_qty_text: asText(row.min_qty_text), min_qty: asNumber(row.min_qty), max_qty: asNumber(row.max_qty), unit: asText(row.unit), discount_percent: asNumber(row.discount_percent), free_qty: asNumber(row.free_qty), note: asText(row.note),
  });

  const review_queue = reviewSource.map((row: any): ReviewItem => Array.isArray(row) ? {
    review_id: asText(row[0]), promo_month_id: asText(row[1]), card_id: asText(row[2]), problem_type: asText(row[3]), target_table: asText(row[4]), raw_text: asText(row[5]), suggestion: asText(row[6]), fix_value: asText(row[7]), status: (asText(row[8]) as ReviewStatus) || 'pending', note: asText(row[9]),
  } : {
    review_id: asText(row.review_id), promo_month_id: asText(row.promo_month_id), card_id: asText(row.card_id), problem_type: asText(row.problem_type), target_table: asText(row.target_table), raw_text: asText(row.raw_text), suggestion: asText(row.suggestion), fix_value: asText(row.fix_value), status: (asText(row.status) as ReviewStatus) || 'pending', note: asText(row.note),
  });

  return { promo_months, promo_classes, promo_cards, sku_master, card_skus, price_by_month, promo_tiers, review_queue };
}

export const emptyPromoBundle: PromoBundle = {
  promo_months: [], promo_classes: [], promo_cards: [], sku_master: [], card_skus: [], price_by_month: [], promo_tiers: [], review_queue: [],
};
