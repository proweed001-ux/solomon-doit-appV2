import type { PromotionTier } from '../domain/types';
import { normalizeClassId } from './class-id';

const THAI_DIGITS: Record<string, string> = {
  '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
  '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9',
};

export function normalizePromotionText(value: unknown): string {
  return String(value || '')
    .normalize('NFKC')
    .replace(/\u0E4D\u0E32/gu, '\u0E33')
    .replace(/[๐-๙]/g, digit => THAI_DIGITS[digit] || digit)
    .replace(/\r?\n+/g, '; ')
    .replace(/[|；]+/g, '; ')
    .replace(/[—–]/g, '-')
    .replace(/ซ\s*ื\s*้\s*อ/g, 'ซื้อ')
    .replace(/ฟ\s*ร\s*ี/g, 'ฟรี')
    .replace(/ล\s*ด/g, 'ลด')
    .replace(/เปอร์เซ็นต์/gi, '%')
    .replace(/\s+/g, ' ')
    .replace(/(?:;\s*){2,}/g, '; ')
    .trim();
}

function number(value: string | undefined): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function freeEffectivePercent(buy: number, free: number): number {
  return Number(((free / (buy + free)) * 100).toFixed(2));
}

function addUnique(tiers: PromotionTier[], tier: PromotionTier) {
  const signature = JSON.stringify({
    type: tier.type,
    minQuantity: tier.minQuantity,
    maxQuantity: tier.maxQuantity,
    discountPercent: tier.discountPercent,
    freeQuantity: tier.freeQuantity,
    purchaseUnit: tier.purchaseUnit,
    rewardUnit: tier.rewardUnit,
  });
  if (!tiers.some(existing => JSON.stringify({
    type: existing.type,
    minQuantity: existing.minQuantity,
    maxQuantity: existing.maxQuantity,
    discountPercent: existing.discountPercent,
    freeQuantity: existing.freeQuantity,
    purchaseUnit: existing.purchaseUnit,
    rewardUnit: existing.rewardUnit,
  }) === signature)) tiers.push(tier);
}

export function parsePromotionTiers(value: unknown, fallbackUnit = 'ชิ้น'): { tiers: PromotionTier[]; failureReasons: string[]; normalizedText: string } {
  const text = normalizePromotionText(value);
  const tiers: PromotionTier[] = [];
  const spans: Array<{ start: number; end: number }> = [];
  const unitValue = 'ขวด|ชิ้น|แพ็ค|แพค|กล่อง|ลัง|ซอง|ถุง|ชุด|ด้าม|piece|pcs?|pack|box';
  const unit = `(${unitValue})`;
  const packEvidence = `(?:\\s*\\(\\s*\\d+(?:\\.\\d+)?\\s*(?:${unitValue})\\s*\\))?`;
  const only = '(?:\\s*เท่านั้น)?';
  const patterns: Array<{ regex: RegExp; build: (match: RegExpMatchArray) => PromotionTier | null }> = [
    {
      regex: new RegExp(`(?:เมื่อ\\s*)?(?:ซื้อ(?:ขั้นต่ำ)?|ขั้นต่ำ)\\s*(\\d+(?:\\.\\d+)?)\\s*${unit}${packEvidence}${only}\\s*(?:แถม|ฟรี)\\s*(\\d+(?:\\.\\d+)?)\\s*${unit}?`, 'giu'),
      build: match => {
        const buy = number(match[1]);
        const free = number(match[3]);
        if (!buy || !free) return null;
        return {
          tierNo: 0,
          type: 'free_goods',
          minQuantity: buy,
          maxQuantity: null,
          purchaseUnit: match[2] || fallbackUnit,
          discountPercent: null,
          freeQuantity: free,
          rewardUnit: match[4] || match[2] || fallbackUnit,
          bundlePrice: null,
          effectivePercent: freeEffectivePercent(buy, free),
          effectivePercentUsage: 'display_only',
          sourceText: match[0].trim(),
        };
      },
    },
    {
      regex: new RegExp(`(?:ซื้อ|ขั้นต่ำ)?\\s*(\\d+(?:\\.\\d+)?)\\s*-\\s*(\\d+(?:\\.\\d+)?)\\s*${unit}${packEvidence}${only}\\s*ลด\\s*(\\d+(?:\\.\\d+)?)\\s*%`, 'giu'),
      build: match => {
        const minimum = number(match[1]);
        const maximum = number(match[2]);
        const discount = number(match[4]);
        if (!minimum || !maximum || !discount || maximum < minimum || discount > 100) return null;
        return {
          tierNo: 0,
          type: 'cash_discount',
          minQuantity: minimum,
          maxQuantity: maximum,
          purchaseUnit: match[3] || fallbackUnit,
          discountPercent: discount,
          freeQuantity: 0,
          rewardUnit: null,
          bundlePrice: null,
          effectivePercent: null,
          effectivePercentUsage: null,
          sourceText: match[0].trim(),
        };
      },
    },
    {
      regex: new RegExp(`(?:(?:เมื่อ\\s*)?(?:ซื้อ(?:ขั้นต่ำ)?|ขั้นต่ำ)\\s*)?(\\d+(?:\\.\\d+)?)\\s*${unit}${packEvidence}${only}\\s*ลด\\s*(\\d+(?:\\.\\d+)?)\\s*%`, 'giu'),
      build: match => {
        const minimum = number(match[1]);
        const discount = number(match[3]);
        if (!minimum || !discount || discount > 100) return null;
        return {
          tierNo: 0,
          type: 'cash_discount',
          minQuantity: minimum,
          maxQuantity: null,
          purchaseUnit: match[2] || fallbackUnit,
          discountPercent: discount,
          freeQuantity: 0,
          rewardUnit: null,
          bundlePrice: null,
          effectivePercent: null,
          effectivePercentUsage: null,
          sourceText: match[0].trim(),
        };
      },
    },
    {
      regex: new RegExp(`(?:ซื้อ\\s*)?(\\d+(?:\\.\\d+)?)\\s*${unit}${packEvidence}\\s*(?:ในราคา|ราคา)\\s*(\\d+(?:\\.\\d+)?)\\s*บาท`, 'giu'),
      build: match => {
        const minimum = number(match[1]);
        const price = number(match[3]);
        if (!minimum || !price) return null;
        return {
          tierNo: 0,
          type: 'bundle_price',
          minQuantity: minimum,
          maxQuantity: null,
          purchaseUnit: match[2] || fallbackUnit,
          discountPercent: null,
          freeQuantity: 0,
          rewardUnit: null,
          bundlePrice: { amount: price, currency: 'THB' },
          effectivePercent: null,
          effectivePercentUsage: null,
          sourceText: match[0].trim(),
        };
      },
    },
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern.regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (spans.some(span => start < span.end && end > span.start)) continue;
      const tier = pattern.build(match);
      if (!tier) continue;
      addUnique(tiers, tier);
      spans.push({ start, end });
    }
  }

  if (!tiers.length) {
    const discounts = [...text.matchAll(/(?:^|;\s*)ลด\s*(\d+(?:\.\d+)?)\s*%/giu)];
    for (const match of discounts) {
      const discount = number(match[1]);
      if (!discount || discount > 100) continue;
      addUnique(tiers, {
        tierNo: 0,
        type: 'cash_discount',
        minQuantity: 1,
        maxQuantity: null,
        purchaseUnit: fallbackUnit,
        discountPercent: discount,
        freeQuantity: 0,
        rewardUnit: null,
        bundlePrice: null,
        effectivePercent: null,
        effectivePercentUsage: null,
        sourceText: match[0].replace(/^;\s*/, '').trim(),
      });
    }
  }

  tiers.sort((a, b) => a.minQuantity - b.minQuantity || (a.maxQuantity ?? Number.MAX_SAFE_INTEGER) - (b.maxQuantity ?? Number.MAX_SAFE_INTEGER));
  tiers.forEach((tier, index) => { tier.tierNo = index + 1; });
  const failureReasons: string[] = [];
  if (!text) failureReasons.push('promotion_text_missing');
  if (text && !tiers.length) failureReasons.push('promotion_tiers_unparsed');
  return { tiers, failureReasons, normalizedText: text };
}

export function splitClassIds(value: unknown): string[] {
  const raw = String(value || '').toUpperCase().replace(/[,+&]/g, '/');
  const parts = raw.split('/').map(part => part.trim()).filter(Boolean);
  const normalized = parts.map(part => normalizeClassId(part)).filter((part): part is string => Boolean(part));
  return [...new Set(normalized)];
}
