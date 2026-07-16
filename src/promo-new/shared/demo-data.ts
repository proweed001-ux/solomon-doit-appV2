import type { PromoCard, PromoDataset, ProductGroup, PromotionFamily, PromotionTier, Sku, SkuPrice } from '../domain/types';
import { buildSkuIdentityKey } from '../domain/sku-identity';

const DEMO_MONTH = 'DEMO-2026-01';
const CLASSES = ['HFSS', 'HFSM'];

const products = [
  ['Pantene', 'แชมพู', 'Micellar', 70, 'มล.', 'ขวด', 1, 18.5],
  ['H&S', 'แชมพู', 'Cool Menthol', 65, 'มล.', 'ขวด', 1, 19],
  ['Rejoice', 'แชมพู', 'Rich', 70, 'มล.', 'ขวด', 1, 17.75],
  ['Downy', 'ปรับผ้านุ่ม', 'Mystique', 330, 'มล.', 'ถุง', 1, 34],
  ['Olay', 'สกินแคร์', 'Total Effects', 50, 'กรัม', 'กระปุก', 1, 399],
  ['Oral-B', 'แปรงสีฟัน', 'Pro Health', 1, 'ชิ้น', 'ด้าม', 1, 42],
  ['Gillette', 'มีดโกน', 'Vector', 2, 'ชิ้น', 'แพ็ค', 1, 89],
  ['Safeguard', 'สบู่', 'Pure White', 100, 'กรัม', 'ชิ้น', 1, 28],
  ['Vicks', 'ยาอม', 'Honey Lemon', 20, 'กรัม', 'ซอง', 1, 25],
  ['Ariel', 'ผลิตภัณฑ์ซักผ้า', 'Sunrise Fresh', 700, 'กรัม', 'ถุง', 1, 115],
] as const;

function svgData(label: string, classId: string): string {
  const safe = `${label} ${classId}`.replace(/[&<>"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#eef4ff"/><stop offset="1" stop-color="#fff7ed"/></linearGradient></defs><rect width="640" height="500" rx="30" fill="url(#g)"/><rect x="26" y="26" width="588" height="448" rx="24" fill="#fff" stroke="#c7d2fe" stroke-width="4"/><text x="48" y="90" font-family="Arial" font-size="28" font-weight="700" fill="#1d4ed8">${safe}</text><text x="48" y="390" font-family="Arial" font-size="38" font-weight="800" fill="#059669">PROMOTION</text><text x="48" y="440" font-family="Arial" font-size="25" fill="#334155">Preview fixture</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function tiers(classId: string, freeGoods: boolean): PromotionTier[] {
  if (freeGoods && classId === 'HFSM') return [{
    tierNo: 1, type: 'free_goods', minQuantity: 3, maxQuantity: null, purchaseUnit: 'ชิ้น',
    discountPercent: null, freeQuantity: 1, rewardUnit: 'ชิ้น', bundlePrice: null,
    effectivePercent: 25, effectivePercentUsage: 'display_only', sourceText: 'ซื้อ 3 ชิ้น ฟรี 1 ชิ้น',
  }];
  return [
    { tierNo: 1, type: 'cash_discount', minQuantity: 3, maxQuantity: 5, purchaseUnit: 'ชิ้น', discountPercent: 5, freeQuantity: 0, rewardUnit: null, bundlePrice: null, effectivePercent: null, effectivePercentUsage: null, sourceText: 'ซื้อ 3-5 ชิ้น ลด 5%' },
    { tierNo: 2, type: 'cash_discount', minQuantity: 6, maxQuantity: null, purchaseUnit: 'ชิ้น', discountPercent: 10, freeQuantity: 0, rewardUnit: null, bundlePrice: null, effectivePercent: null, effectivePercentUsage: null, sourceText: 'ซื้อ 6 ชิ้น ลด 10%' },
  ];
}

export function createDemoDataset(status: 'draft' | 'published' = 'published'): PromoDataset {
  const skus: Sku[] = [];
  const prices: SkuPrice[] = [];
  const cards: PromoCard[] = [];
  const groups: ProductGroup[] = [];
  const families: PromotionFamily[] = [];
  products.forEach((product, productIndex) => {
    const [brand, productType, variant, sizeValue, sizeUnit, salesUnit, packQuantity, amount] = product;
    const identity = { brand, productType, variant, sizeValue, sizeUnit, salesUnit, packQuantity };
    const identityKey = buildSkuIdentityKey(identity);
    const skuId = `sku:demo:${productIndex + 1}`;
    const sku: Sku = {
      id: skuId,
      code: `SKU-DEMO-${String(productIndex + 1).padStart(3, '0')}`,
      canonicalName: `${brand} ${productType} ${variant} ${sizeValue} ${sizeUnit}`,
      identityKey,
      identity,
      status: 'active',
      evidence: ['preview_fixture'],
      failureReasons: [],
    };
    const price: SkuPrice = {
      skuId,
      pdfSourcePrice: null,
      centralOverridePrice: { amount, currency: 'THB' },
      effectivePrice: { amount, currency: 'THB' },
      source: 'central_override',
      sourceReference: 'preview_fixture',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    const familyId = `family:demo:${productIndex + 1}`;
    const family: PromotionFamily = {
      id: familyId,
      familyKey: `PF-DEMO-${String(productIndex + 1).padStart(3, '0')}`,
      name: productIndex < 3 ? 'Hair Care 60–70 ml' : `${brand} ${productType}`,
      scopeText: productIndex < 3 ? 'H&S / Pantene / Rejoice 60–70 ml' : `${brand} ${productType}`,
      sourceRows: [productIndex + 2],
      tiersByClass: Object.fromEntries(CLASSES.map(classId => [classId, tiers(classId, productIndex === 2)])),
      failureReasons: [],
    };
    const groupId = `group:demo:${productIndex + 1}`;
    const groupCards = CLASSES.map((classId, classIndex): PromoCard => ({
      id: `CARD-${DEMO_MONTH}-${classId}-P${String(productIndex + 1).padStart(3, '0')}-C${String(classIndex + 1).padStart(3, '0')}`,
      monthKey: DEMO_MONTH,
      page: productIndex + 1,
      sequence: classIndex + 1,
      classId,
      imageUrl: svgData(`${brand} ${productType} ${sizeValue} ${sizeUnit}`, classId),
      skuId,
      productGroupId: groupId,
      promotionFamilyId: familyId,
      promotionTiers: family.tiersByClass[classId],
      price,
      status: 'ready',
      evidence: { rawText: sku.canonicalName, productText: sku.canonicalName, pageClassText: classId, confidence: 1, method: 'manual', cropBounds: null },
      failureReasons: [],
    }));
    skus.push(sku);
    prices.push(price);
    cards.push(...groupCards);
    groups.push({ id: groupId, monthKey: DEMO_MONTH, skuId, sku, cardIds: groupCards.map(card => card.id), classIds: [...CLASSES], promotionFamilyId: familyId, price, status: 'ready', failureReasons: [] });
    if (!families.some(item => item.name === family.name)) families.push(family);
    else if (productIndex < 3) {
      const shared = families.find(item => item.name === family.name);
      if (shared) {
        groups[groups.length - 1].promotionFamilyId = shared.id;
        groupCards.forEach(card => { card.promotionFamilyId = shared.id; });
      }
    }
  });
  return {
    schema: 'promo-system-rebuild-v1',
    version: {
      id: '00000000-0000-4000-8000-000000000001',
      monthKey: DEMO_MONTH,
      revision: 1,
      status,
      previousVersionId: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      createdBy: 'preview-fixture',
      publishedAt: status === 'published' ? '2026-01-01T00:00:00.000Z' : null,
      source: { pdfName: 'preview-fixture.pdf', workbookName: 'preview-fixture.xlsx', pdfHash: null, workbookHash: null },
    },
    skus,
    prices,
    cards,
    productGroups: groups,
    promotionFamilies: families,
    warnings: ['preview_fixture_only'],
  };
}
