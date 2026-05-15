export function fmt(n: number): string {
  return Number(n || 0).toLocaleString('th-TH');
}

export function money(n: number): string {
  return Number(n || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
