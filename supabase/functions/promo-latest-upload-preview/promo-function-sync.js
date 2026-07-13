const UNIT_PATTERN = '(?:ชิ้น|ขวด|แพ็ค|กล่อง|ลัง|ซอง|ด้าม|ถุง|ชุด)';
const RANGE_DISCOUNT_RE = new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*-\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})\\s*ลด\\s*(\\d+(?:\\.\\d+)?)\\s*%$`);
const FREE_RE = new RegExp(`^(?:เมื่อซื้อ\\s*|ซื้อ\\s*)?(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})\\s*ฟรี\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})(?:\\s*\\((\\d+(?:\\.\\d+)?)\\s*%\\))?$`);
const QTY_DISCOUNT_RE = new RegExp(`^(?:เมื่อซื้อ\\s*|ซื้อ\\s*)?(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})\\s*ลด\\s*(\\d+(?:\\.\\d+)?)\\s*%$`);
const DISCOUNT_RE = /^ลด\s*(\d+(?:\.\d+)?)\s*%$/;

const numberValue = value => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(`invalid_number:${value}`);
  return n;
};

export function normalizeFunctionLabel(value) {
  return String(value || '')
    .replace(/；/g, ';')
    .replace(/\s*;\s*/g, '; ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/;\s*$/, '');
}

function parsePart(text) {
  let m = text.match(RANGE_DISCOUNT_RE);
  if (m) {
    const minQty = numberValue(m[1]);
    const maxQty = numberValue(m[2]);
    if (maxQty < minQty) throw new Error(`invalid_range:${text}`);
    return { text, type: 'discount', qty: minQty, min_qty: minQty, max_qty: maxQty, unit: m[3], discount_percent: numberValue(m[4]) };
  }

  m = text.match(FREE_RE);
  if (m) {
    const buyQty = numberValue(m[1]);
    const freeQty = numberValue(m[3]);
    const effective = m[5] == null
      ? Math.round((freeQty / Math.max(1, buyQty + freeQty)) * 10000) / 100
      : numberValue(m[5]);
    return { text, type: 'free_goods', unit: m[2], buy_qty: buyQty, min_qty: buyQty, free_qty: freeQty, free_unit: m[4], effective_percent: effective };
  }

  m = text.match(QTY_DISCOUNT_RE);
  if (m) {
    const qty = numberValue(m[1]);
    return { text, type: 'discount', qty, min_qty: qty, unit: m[2], discount_percent: numberValue(m[3]) };
  }

  m = text.match(DISCOUNT_RE);
  if (m) return { text, type: 'discount', discount_percent: numberValue(m[1]) };
  throw new Error(`unparsed_function_part:${text}`);
}

export function parseFunctionLabel(value) {
  const label = normalizeFunctionLabel(value);
  if (!label) throw new Error('empty_function_label');
  const parts = label.split(';').map(v => v.trim()).filter(Boolean);
  if (!parts.length) throw new Error('empty_function_parts');
  const tiers = parts.map(parsePart);
  const functionType = tiers.length > 1 ? 'tiered' : tiers[0].type;
  return { label, functionType, payload: { raw: label, tiers } };
}

export function promoTierRows(cardId, parsed) {
  return parsed.payload.tiers.map((tier, index) => ({
    tier_id: `${cardId}-T${index + 1}`,
    card_id: cardId,
    tier_no: index + 1,
    min_qty_text: tier.text || null,
    min_qty: tier.min_qty ?? tier.qty ?? tier.buy_qty ?? 1,
    max_qty: tier.max_qty ?? null,
    unit: tier.unit ?? null,
    discount_percent: tier.type === 'free_goods' ? null : (tier.discount_percent ?? null),
    free_qty: tier.free_qty ?? 0,
    note: tier.type === 'free_goods' && tier.effective_percent != null ? `effective_percent=${tier.effective_percent}` : null,
  }));
}

export async function templateIdentity(promoMonthId, label) {
  const normalized = normalizeFunctionLabel(label);
  const bytes = new TextEncoder().encode(`${promoMonthId}|${normalized}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
  const clusterId = 1_000_000_000 + (Number.parseInt(hex.slice(0, 7), 16) % 900_000_000);
  return { templateId: `${promoMonthId}-V3-${hex.slice(0, 10).toUpperCase()}`, clusterId };
}
