const safeToken = (value: string) => String(value || '').normalize('NFKC').trim().toUpperCase().replace(/[^A-Z0-9ก-๙_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 48);

export function makeCardId(monthKey: string, classId: string | null, page: number, sequence: number): string {
  const month = safeToken(monthKey);
  if (!month) throw new Error('month_key_required');
  const classPart = classId ? safeToken(classId) : '';
  const location = `P${String(page).padStart(3, '0')}-C${String(sequence).padStart(3, '0')}`;
  return ['CARD', month, classPart, location].filter(Boolean).join('-');
}
