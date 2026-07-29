export type PromotionWorkbookKind = 'csv' | 'xlsx' | 'xlsm' | 'xls';

export const PROMOTION_WORKBOOK_ACCEPT = [
  '.csv',
  'text/csv',
  'application/csv',
  '.xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xlsm',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  '.xls',
  'application/vnd.ms-excel',
].join(',');

const MAX_WORKBOOK_BYTES = 50 * 1024 * 1024;

const kindByMime: Record<string, PromotionWorkbookKind> = {
  'text/csv': 'csv',
  'application/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel.sheet.macroenabled.12': 'xlsm',
  'application/vnd.ms-excel': 'xls',
};

const labels: Record<PromotionWorkbookKind, string> = {
  csv: 'CSV',
  xlsx: 'Excel XLSX',
  xlsm: 'Excel XLSM',
  xls: 'Excel XLS',
};

export interface PromotionWorkbookFileInfo {
  kind: PromotionWorkbookKind | null;
  label: string;
  error: string | null;
}

export function inspectPromotionWorkbookFile(file: Pick<File, 'name' | 'size' | 'type'>): PromotionWorkbookFileInfo {
  const extension = file.name.toLowerCase().match(/\.([a-z0-9]+)$/u)?.[1] || '';
  const kindFromExtension = ['csv', 'xlsx', 'xlsm', 'xls'].includes(extension)
    ? extension as PromotionWorkbookKind
    : null;
  const kind = kindFromExtension || kindByMime[file.type.toLowerCase()] || null;
  if (!kind) return { kind: null, label: 'ไม่รองรับ', error: 'รองรับเฉพาะไฟล์ CSV, XLSX, XLSM หรือ XLS' };
  if (file.size <= 0) return { kind, label: labels[kind], error: 'ไฟล์ว่างหรืออ่านขนาดไฟล์ไม่ได้' };
  if (file.size > MAX_WORKBOOK_BYTES) return { kind, label: labels[kind], error: 'ไฟล์ตารางโปรโมชั่นใหญ่เกิน 50 MB' };
  return { kind, label: labels[kind], error: null };
}

export function validatePromotionWorkbookSignature(kind: PromotionWorkbookKind, bytes: ArrayBuffer): string | null {
  const header = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 8));
  const isZip = header[0] === 0x50 && header[1] === 0x4b;
  const isOle = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every((value, index) => header[index] === value);
  if ((kind === 'xlsx' || kind === 'xlsm') && !isZip) {
    return isOle
      ? 'ไฟล์ Excel นี้อาจถูกเข้ารหัสด้วยรหัสผ่าน กรุณาเปิดใน Excel แล้ว Save As ใหม่โดยไม่ตั้งรหัสผ่าน'
      : `เนื้อหาไฟล์ไม่ใช่ ${labels[kind]} ที่สมบูรณ์ กรุณาเปิดใน Excel แล้ว Save As ใหม่`;
  }
  if (kind === 'xls' && !isOle) return 'เนื้อหาไฟล์ไม่ใช่ Excel XLS ที่สมบูรณ์ กรุณา Save As เป็น XLSX หรือ XLSM';
  return null;
}
