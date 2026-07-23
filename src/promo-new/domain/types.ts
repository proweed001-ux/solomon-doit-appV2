export type PromoStatus =
  | 'imported'
  | 'processing'
  | 'need_review'
  | 'draft'
  | 'ready'
  | 'published'
  | 'archived';

export type TierType = 'cash_discount' | 'free_goods' | 'bundle_price';

export interface Money {
  amount: number;
  currency: 'THB';
}

export interface SkuIdentity {
  brand: string;
  productType: string;
  variant: string | null;
  sizeValue: number;
  sizeUnit: string;
  salesUnit: string;
  packQuantity: number;
}

export interface Sku {
  id: string;
  code: string;
  canonicalName: string;
  identityKey: string;
  identity: SkuIdentity;
  status: 'active' | 'candidate' | 'quarantine';
  evidence: string[];
  failureReasons: string[];
}

export interface SkuPrice {
  skuId: string;
  pdfSourcePrice: Money | null;
  centralOverridePrice: Money | null;
  effectivePrice: Money | null;
  source: 'pdf' | 'central_override' | 'missing';
  sourceReference: string | null;
  updatedAt: string | null;
}

export interface PromotionTier {
  id?: string;
  tierNo: number;
  type: TierType;
  minQuantity: number;
  maxQuantity: number | null;
  purchaseUnit: string;
  discountPercent: number | null;
  freeQuantity: number;
  rewardUnit: string | null;
  bundlePrice: Money | null;
  effectivePercent: number | null;
  effectivePercentUsage: 'display_only' | null;
  sourceText: string;
}

export interface PromotionFamily {
  id: string;
  familyKey: string;
  name: string;
  scopeText: string;
  sourceRows: number[];
  tiersByClass: Record<string, PromotionTier[]>;
  failureReasons: string[];
}

export type MasterMatchMethod = 'master_text' | 'structured_scope' | 'visual_consensus' | 'exact_identity' | 'new_sku';

export interface CardEvidence {
  rawText: string;
  productText: string;
  pageClassText: string;
  confidence: number;
  method: 'pdf_text' | 'page_ocr' | 'manual' | 'none';
  cropBounds: { x: number; y: number; width: number; height: number } | null;
  masterMatchScore?: number | null;
  masterMatchMargin?: number | null;
  masterMatchMethod?: MasterMatchMethod | null;
}

export interface PromoCard {
  /** Stable UUID assigned by the central source-dataset registry. */
  id: string;
  monthKey: string;
  page: number;
  sequence: number;
  classId: string | null;
  imageUrl: string | null;
  skuId: string | null;
  productGroupId: string | null;
  promotionFamilyId: string | null;
  promotionTiers: PromotionTier[];
  price: SkuPrice;
  status: 'ready' | 'need_review' | 'quarantine';
  evidence: CardEvidence;
  failureReasons: string[];
}

export interface ProductGroup {
  id: string;
  monthKey: string;
  skuId: string;
  sku: Sku;
  cardIds: string[];
  classIds: string[];
  promotionFamilyId: string | null;
  price: SkuPrice;
  status: 'ready' | 'need_review' | 'blocked';
  failureReasons: string[];
  manualConfirmed?: boolean;
  manualLocked?: boolean;
}

export interface PromoSourceDatasetIdentity {
  datasetId: string;
  fingerprint: string;
  revision: number;
  cardIdsHash: string;
  persisted: boolean;
  savedAt: string | null;
  snapshotId?: string;
  snapshotRevision?: number;
  snapshotSavedAt?: string;
}

export interface PromoVersion {
  id: string;
  monthKey: string;
  revision: number;
  status: PromoStatus;
  previousVersionId: string | null;
  createdAt: string;
  createdBy: string | null;
  publishedAt: string | null;
  source: {
    pdfName: string | null;
    workbookName: string | null;
    pdfHash: string | null;
    workbookHash: string | null;
  };
}

export interface PromoDataset {
  schema: 'promo-system-rebuild-v1';
  version: PromoVersion;
  skus: Sku[];
  prices: SkuPrice[];
  cards: PromoCard[];
  productGroups: ProductGroup[];
  promotionFamilies: PromotionFamily[];
  sourceDataset?: PromoSourceDatasetIdentity;
  warnings: string[];
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  entityType: 'sku' | 'price' | 'promotion' | 'version' | 'card' | 'product_group';
  entityId: string;
  before: unknown;
  after: unknown;
  createdAt: string;
}
