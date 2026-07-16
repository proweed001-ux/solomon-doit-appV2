const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

export function normalizeClassId(value: string): string | null {
  const text = clean(value).toUpperCase();
  const contextual = text.match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*([A-Z0-9][A-Z0-9/_ -]{1,30})/u)?.[1];
  const candidates = (contextual || text).match(/[A-Z]+(?:[-/]?[A-Z0-9]+){1,5}/g) || [];
  const noise = new Set(['PROMOTION', 'PROMOTIONS', 'PRICE', 'MONTH', 'CLASS', 'PAGE', 'CANVASS']);
  const canonicalHfs = (candidate: string): string | null => {
    const compact = candidate.replace(/[^A-Z0-9]/g, '');
    if (!/^HFS(?:S|M|L|XL|WH|WSS|WSL)$/.test(compact)) return null;
    if (compact === 'HFSWH') return 'HFSM';
    if (compact === 'HFSWSS') return 'HFSWS-S';
    if (compact === 'HFSWSL') return 'HFSWS-L';
    return compact;
  };
  for (const candidate of candidates) {
    const hfs = canonicalHfs(candidate);
    if (hfs) return hfs;
  }
  for (const candidate of candidates) {
    const compact = candidate.replace(/[^A-Z0-9]/g, '');
    if (noise.has(compact) || compact.startsWith('HFS') || compact.length < 3 || compact.length > 20) continue;
    return compact;
  }
  return null;
}
