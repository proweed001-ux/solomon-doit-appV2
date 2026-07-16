const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

export function normalizeClassId(value: string): string | null {
  const text = clean(value).toUpperCase();
  const contextual = text.match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*([A-Z0-9][A-Z0-9/_ -]{1,30})/u)?.[1];
  const candidates = (contextual || text).match(/[A-Z]+(?:[-/]?[A-Z0-9]+){1,5}/g) || [];
  const noise = new Set(['PROMOTION', 'PROMOTIONS', 'PRICE', 'MONTH', 'CLASS', 'PAGE', 'CANVASS']);
  for (const candidate of candidates) {
    const compact = candidate.replace(/[^A-Z0-9]/g, '');
    if (noise.has(compact) || compact.length < 3 || compact.length > 20) continue;
    if (compact === 'HFSWH') return 'HFSM';
    return compact;
  }
  return null;
}
