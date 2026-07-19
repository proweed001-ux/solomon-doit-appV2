import * as XLSX from 'xlsx';
import type { PromotionFamily, PromotionTier } from '../domain/types';
import { parsePromotionTiers, splitClassIds } from './promotion-parser';
import { inspectPromotionWorkbookFile, validatePromotionWorkbookSignature } from './workbook-file';

type Cell = string | number | boolean | Date | null | undefined;
type Matrix = Cell[][];

interface ColumnMap {
  familyId: number | null;
  name: number | null;
  scope: number | null;
  classId: number | null;
  promotion: number | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  discountPercent: number | null;
  freeQuantity: number | null;
  unit: number | null;
}

export interface WorkbookParseResult {
  families: PromotionFamily[];
  sheets: Array<{ name: string; headerRow: number; rows: number; acceptedRows: number; warnings: string[] }>;
  warnings: string[];
}

const PROMO_CLASSES = new Set(['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L']);
const thaiNfkc = (value: unknown) => String(value ?? '').normalize('NFKC').replace(/\u0E4D\u0E32/gu, '\u0E33');
const normalize = (value: unknown) => thaiNfkc(value).toUpperCase().replace(/\s+/g, ' ').trim();
const compact = (value: unknown) => normalize(value).replace(/[^A-Z0-9ก-๙]/gu, '');

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36).toUpperCase().padStart(7, '0');
}

const aliases: Record<keyof ColumnMap, string[]> = {
  familyId: ['PROMOTIONFAMILY', 'FAMILYID', 'PROMOTIONGROUP', 'PROMOGROUP', 'รหัสกลุ่มโปรโมชั่น', 'กลุ่มโปรโมชั่น'],
  name: ['FAMILYNAME', 'PROMOTIONNAME', 'PROMONAME', 'ชื่อโปรโมชั่น', 'ชื่อกลุ่ม'],
  scope: ['PRODUCTSCOPE', 'PRODUCTDESCRIPTION', 'DESCRIPTION', 'ITEMDESCRIPTION', 'สินค้า', 'รายละเอียดสินค้า', 'ขอบเขตสินค้า'],
  classId: ['CLASS', 'CLASSID', 'CUSTOMERCLASS', 'STORECLASS', 'คลาส', 'ระดับร้าน'],
  promotion: ['PROMOTION', 'PROMOTIONTIER', 'CONDITION', 'MECHANIC', 'FUNCTION', 'เงื่อนไข', 'รายการส่งเสริม', 'โปรโมชั่น'],
  minQuantity: ['MINQTY', 'MINQUANTITY', 'BUYQTY', 'QTYFROM', 'ซื้อขั้นต่ำ', 'จำนวนซื้อ'],
  maxQuantity: ['MAXQTY', 'MAXQUANTITY', 'QTYTO', 'ซื้อสูงสุด'],
  discountPercent: ['DISCOUNTPERCENT', 'DISCOUNT', 'PERCENT', 'ส่วนลดเปอร์เซ็นต์', 'ลด'],
  freeQuantity: ['FREEQTY', 'FREEQUANTITY', 'จำนวนแถม', 'ของแถม'],
  unit: ['UNIT', 'PURCHASEUNIT', 'หน่วย', 'หน่วยซื้อ'],
};

function headerScore(row: Cell[]): number {
  const cells = row.map(compact).filter(Boolean);
  return (Object.values(aliases) as string[][]).reduce((score, terms) => score + (terms.some(term => cells.includes(compact(term))) ? 1 : 0), 0);
}

function findHeader(matrix: Matrix): number {
  let best = { index: -1, score: 0 };
  matrix.slice(0, 40).forEach((row, index) => {
    const score = headerScore(row);
    if (score > best.score) best = { index, score };
  });
  if (best.score >= 2) return best.index;
  const row = matrix[best.index] || [];
  const values = row.map(compact).filter(Boolean);
  const descriptionHeaders = aliases.scope.map(compact);
  return best.score === 1 && values.length === 1 && descriptionHeaders.includes(values[0]) ? best.index : -1;
}

function mapColumns(row: Cell[]): ColumnMap {
  const values = row.map(compact);
  const find = (key: keyof ColumnMap) => {
    const candidates = aliases[key].map(compact);
    const exact = values.findIndex(value => candidates.includes(value));
    if (exact >= 0) return exact;
    const partial = values.findIndex(value => candidates.some(candidate => value.includes(candidate) || candidate.includes(value)));
    return partial >= 0 ? partial : null;
  };
  return {
    familyId: find('familyId'), name: find('name'), scope: find('scope'), classId: find('classId'), promotion: find('promotion'),
    minQuantity: find('minQuantity'), maxQuantity: find('maxQuantity'), discountPercent: find('discountPercent'),
    freeQuantity: find('freeQuantity'), unit: find('unit'),
  };
}

function cell(row: Cell[], index: number | null): Cell {
  return index == null ? null : row[index];
}

function positive(value: Cell): number | null {
  const number = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function structuredTier(row: Cell[], columns: ColumnMap, sourceText: string): PromotionTier[] {
  const minimum = positive(cell(row, columns.minQuantity));
  const maximum = positive(cell(row, columns.maxQuantity));
  const discount = positive(cell(row, columns.discountPercent));
  const free = positive(cell(row, columns.freeQuantity));
  const unit = String(cell(row, columns.unit) || 'ชิ้น').trim();
  if (minimum && free) return [{
    tierNo: 1, type: 'free_goods', minQuantity: minimum, maxQuantity: maximum, purchaseUnit: unit,
    discountPercent: null, freeQuantity: free, rewardUnit: unit, bundlePrice: null,
    effectivePercent: Number(((free / (minimum + free)) * 100).toFixed(2)), effectivePercentUsage: 'display_only', sourceText,
  }];
  if (minimum && discount && discount <= 100) return [{
    tierNo: 1, type: 'cash_discount', minQuantity: minimum, maxQuantity: maximum, purchaseUnit: unit,
    discountPercent: discount, freeQuantity: 0, rewardUnit: null, bundlePrice: null,
    effectivePercent: null, effectivePercentUsage: null, sourceText,
  }];
  return [];
}

function mergeTiers(existing: PromotionTier[], incoming: PromotionTier[]): PromotionTier[] {
  const map = new Map<string, PromotionTier>();
  [...existing, ...incoming].forEach(tier => {
    const key = `${tier.type}|${tier.minQuantity}|${tier.maxQuantity ?? ''}|${tier.discountPercent ?? ''}|${tier.freeQuantity}|${tier.purchaseUnit}`;
    map.set(key, tier);
  });
  const result = [...map.values()].sort((a, b) => a.minQuantity - b.minQuantity);
  result.forEach((tier, index) => { tier.tierNo = index + 1; });
  return result;
}

function embeddedDescription(value: Cell): { scope: string; promotion: string; classIds: string[] } {
  const original = thaiNfkc(value).replace(/\s+/g, ' ').trim();
  const classMatch = original.match(/\[\s*(?:เฉพาะช่องทาง|CHANNEL|CLASS)\s*[:=-]?\s*([^\]]+)\]/iu);
  const classIds = splitClassIds(classMatch?.[1] || '');
  const withoutClass = original.replace(classMatch?.[0] || '', '').trim();
  const mechanicAt = withoutClass.search(/(?:^|\s)(?:ขั้นต่ำ\s*\d|(?:เมื่อ\s*)?ซื้อ(?:ขั้นต่ำ)?\s*\d)/iu);
  if (mechanicAt < 0) return { scope: withoutClass, promotion: withoutClass, classIds };
  return {
    scope: withoutClass.slice(0, mechanicAt).replace(/[,:;\s]+$/u, '').trim(),
    promotion: withoutClass.slice(mechanicAt).trim(),
    classIds,
  };
}

export function parsePromotionMatrix(matrix: Matrix, sheetName: string): { families: PromotionFamily[]; headerRow: number; acceptedRows: number; warnings: string[] } {
  const headerRow = findHeader(matrix);
  if (headerRow < 0) return { families: [], headerRow: -1, acceptedRows: 0, warnings: [`sheet:${sheetName}:header_not_found`] };
  const columns = mapColumns(matrix[headerRow]);
  const descriptionMode = columns.scope != null && columns.classId == null && columns.promotion == null;
  const warnings: string[] = [];
  if (columns.classId == null && !descriptionMode) warnings.push(`sheet:${sheetName}:class_column_missing`);
  if (columns.promotion == null && columns.minQuantity == null && !descriptionMode) warnings.push(`sheet:${sheetName}:promotion_columns_missing`);
  const families = new Map<string, PromotionFamily>();
  let carriedFamilyId = '';
  let carriedName = '';
  let carriedScope = '';
  let acceptedRows = 0;

  matrix.slice(headerRow + 1).forEach((row, offset) => {
    const sourceRow = headerRow + offset + 2;
    const embedded = descriptionMode ? embeddedDescription(cell(row, columns.scope)) : null;
    const explicitId = normalize(cell(row, columns.familyId));
    const name = normalize(cell(row, columns.name));
    const scope = normalize(embedded?.scope || cell(row, columns.scope));
    if (explicitId) carriedFamilyId = explicitId;
    if (name) carriedName = name;
    if (scope) carriedScope = scope;
    const familySeed = carriedFamilyId || carriedScope || carriedName;
    const classIds = embedded?.classIds || splitClassIds(cell(row, columns.classId));
    const promotionText = embedded?.promotion || String(cell(row, columns.promotion) || '').trim();
    if (!familySeed && !classIds.length && !promotionText) return;
    if (!familySeed) {
      warnings.push(`sheet:${sheetName}:row:${sourceRow}:family_scope_missing`);
      return;
    }
    const familyKey = `PF-${hash(compact(familySeed))}`;
    const family = families.get(familyKey) || {
      id: `family:${familyKey}`,
      familyKey,
      name: carriedName || carriedScope || carriedFamilyId,
      scopeText: carriedScope || carriedName || carriedFamilyId,
      sourceRows: [],
      tiersByClass: {},
      failureReasons: [],
    };
    family.sourceRows.push(sourceRow);
    if (!classIds.length) family.failureReasons.push(`row:${sourceRow}:class_missing`);
    const parsed = parsePromotionTiers(promotionText, String(cell(row, columns.unit) || 'ชิ้น'));
    const tiers = parsed.tiers.length ? parsed.tiers : structuredTier(row, columns, promotionText || `row ${sourceRow}`);
    if (!tiers.length) family.failureReasons.push(`row:${sourceRow}:tiers_missing`);
    classIds.forEach(classId => { family.tiersByClass[classId] = mergeTiers(family.tiersByClass[classId] || [], tiers); });
    family.failureReasons.push(...parsed.failureReasons.filter(reason => reason !== 'promotion_text_missing' || !tiers.length).map(reason => `row:${sourceRow}:${reason}`));
    family.failureReasons = [...new Set(family.failureReasons)];
    family.sourceRows = [...new Set(family.sourceRows)];
    families.set(familyKey, family);
    acceptedRows += 1;
  });
  return { families: [...families.values()], headerRow, acceptedRows, warnings };
}

export async function parsePromotionWorkbook(file: File): Promise<WorkbookParseResult> {
  const fileInfo = inspectPromotionWorkbookFile(file);
  if (!fileInfo.kind || fileInfo.error) throw new Error(fileInfo.error || 'ชนิดไฟล์ตารางโปรโมชั่นไม่ถูกต้อง');
  const bytes = await file.arrayBuffer();
  const signatureError = validatePromotionWorkbookSignature(fileInfo.kind, bytes);
  if (signatureError) throw new Error(signatureError);
  let workbook: XLSX.WorkBook;
  try {
    workbook = fileInfo.kind === 'csv'
      ? XLSX.read(new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/u, ''), { type: 'string', cellDates: true, dense: true })
      : XLSX.read(bytes, { type: 'array', cellDates: true, dense: true });
  } catch {
    throw new Error(`อ่านไฟล์ ${fileInfo.label} ไม่สำเร็จ กรุณาเปิดใน Excel แล้ว Save As ใหม่โดยไม่ตั้งรหัสผ่าน`);
  }
  if (!workbook.SheetNames.length) throw new Error(`ไฟล์ ${fileInfo.label} ไม่มี Worksheet ที่อ่านได้`);
  const all = new Map<string, PromotionFamily>();
  const sheets: WorkbookParseResult['sheets'] = [];
  const warnings: string[] = [];
  for (const name of workbook.SheetNames) {
    const matrix = XLSX.utils.sheet_to_json<Cell[]>(workbook.Sheets[name], { header: 1, raw: false, defval: null }) as Matrix;
    const parsed = parsePromotionMatrix(matrix, name);
    sheets.push({ name, headerRow: parsed.headerRow + 1, rows: matrix.length, acceptedRows: parsed.acceptedRows, warnings: parsed.warnings });
    warnings.push(...parsed.warnings);
    for (const family of parsed.families) {
      const existing = all.get(family.familyKey);
      if (!existing) {
        all.set(family.familyKey, family);
        continue;
      }
      existing.sourceRows = [...new Set([...existing.sourceRows, ...family.sourceRows])];
      existing.failureReasons = [...new Set([...existing.failureReasons, ...family.failureReasons])];
      Object.entries(family.tiersByClass).forEach(([classId, tiers]) => {
        existing.tiersByClass[classId] = mergeTiers(existing.tiersByClass[classId] || [], tiers);
      });
    }
  }
  const families = [...all.values()].sort((a, b) => a.name.localeCompare(b.name, 'th'));
  if (!families.length) throw new Error('promotion_family_not_found_in_workbook');
  const classIds = families.flatMap(family => Object.keys(family.tiersByClass));
  const unsupported = [...new Set(classIds.filter(classId => !PROMO_CLASSES.has(classId)))];
  if (unsupported.length) throw new Error(`promotion_workbook_unsupported_class:${unsupported.join(',')}`);
  const tierCount = families.reduce((total, family) => (
    total + Object.values(family.tiersByClass).reduce((sum, tiers) => sum + tiers.length, 0)
  ), 0);
  if (!tierCount) throw new Error('promotion_tiers_not_found_in_workbook');
  return { families, sheets, warnings: [...new Set(warnings)] };
}
