const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

export function normalizeClassId(value: string): string | null {
  const text = clean(value).toUpperCase();
  const contextual = text.match(/(?:CLASS|กลุ่ม|ระดับ|ร้าน)\s*[:=-]?\s*([A-Z0-9][A-Z0-9/_ -]{1,30})/u)?.[1];
  const candidates = (contextual || text).match(/[A-Z]+(?:[-/]?[A-Z0-9]+){1,5}/g) || [];
  const noise = new Set(['PROMOTION', 'PROMOTIONS', 'PRICE', 'MONTH', 'CLASS', 'PAGE', 'CANVASS']);
  const canonicalHfs = (candidate: string): string | null => {
    const compact = candidate.replace(/[^A-Z0-9]/g, '');
    const complete = compact.match(/HFS(?:WSS|WSL|XL|WH|S|M|L)(?![A-Z0-9])/)?.[0];
    if (!complete) return null;
    if (complete === 'HFSWH') return 'HFSM';
    if (complete === 'HFSWSS') return 'HFSWS-S';
    if (complete === 'HFSWSL') return 'HFSWS-L';
    return complete;
  };
  for (const candidate of candidates) {
    const hfs = canonicalHfs(candidate);
    if (hfs) return hfs;
  }
  if (candidates.some(candidate => noise.has(candidate.replace(/[^A-Z0-9]/g, '')))) return null;
  return null;
}
