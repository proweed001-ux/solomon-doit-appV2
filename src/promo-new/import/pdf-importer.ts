import { createWorker, type Worker } from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { cropCanvas, detectCardGrid, type GridDiagnostics, type Rect } from './grid-detector';
import { normalizeClassId } from './class-id';
import { makeCardId } from './card-id';
import { createSkuCandidate } from '../domain/sku-identity';

export { normalizeClassId } from './class-id';
export { makeCardId } from './card-id';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface PositionedText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImportedCardCandidate {
  cardId: string;
  monthKey: string;
  page: number;
  sequence: number;
  classId: string | null;
  imageUrl: string;
  rawText: string;
  productText: string;
  pageClassText: string;
  confidence: number;
  evidenceMethod: 'pdf_text' | 'page_ocr' | 'none';
  bounds: Rect;
  failureReasons: string[];
}

export interface PdfImportProgress {
  phase: 'loading' | 'rendering' | 'ocr' | 'cards' | 'complete';
  page: number;
  pageCount: number;
  cards: number;
  elapsedMs: number;
  message: string;
}

export interface PdfImportResult {
  cards: ImportedCardCandidate[];
  pages: Array<{ page: number; classId: string | null; cardCount: number; diagnostics: GridDiagnostics; textMethod: 'pdf_text' | 'page_ocr' | 'none' }>;
  elapsedMs: number;
  warnings: string[];
}

interface ImportOptions {
  monthKey: string;
  enableOcr?: boolean;
  onProgress?: (progress: PdfImportProgress) => void;
}

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
function inside(item: PositionedText, rect: Rect): boolean {
  const centerX = item.x + item.width / 2;
  const centerY = item.y + item.height / 2;
  return centerX >= rect.x && centerX <= rect.x + rect.width && centerY >= rect.y && centerY <= rect.y + rect.height;
}

function textIn(items: PositionedText[], rect: Rect): string {
  return clean(items.filter(item => inside(item, rect)).sort((a, b) => a.y - b.y || a.x - b.x).map(item => item.text).join(' '));
}

function productZone(rect: Rect): Rect {
  return {
    x: rect.x + rect.width * 0.38,
    y: rect.y,
    width: rect.width * 0.62,
    height: rect.height * 0.43,
  };
}

function pageHeaderZone(width: number, height: number): Rect {
  return { x: 0, y: 0, width, height: height * 0.18 };
}

async function pdfTextItems(page: any, viewport: any): Promise<PositionedText[]> {
  const content = await page.getTextContent();
  return (content.items || []).flatMap((item: any) => {
    const text = clean(item.str);
    if (!text) return [];
    const point = viewport.convertToViewportPoint(Number(item.transform?.[4] || 0), Number(item.transform?.[5] || 0));
    const height = Math.max(1, Math.abs(Number(item.height || item.transform?.[3] || 1) * viewport.scale));
    return [{ text, x: point[0], y: point[1] - height, width: Math.max(1, Number(item.width || 1) * viewport.scale), height }];
  });
}

function collectOcrItems(value: unknown, output: PositionedText[] = []): PositionedText[] {
  if (!value || typeof value !== 'object') return output;
  const item = value as Record<string, unknown>;
  const bbox = item.bbox as { x0?: number; y0?: number; x1?: number; y1?: number } | undefined;
  const text = clean(item.text);
  if (text && bbox && Number.isFinite(bbox.x0) && Number.isFinite(bbox.y0) && Number.isFinite(bbox.x1) && Number.isFinite(bbox.y1)) {
    output.push({ text, x: Number(bbox.x0), y: Number(bbox.y0), width: Number(bbox.x1) - Number(bbox.x0), height: Number(bbox.y1) - Number(bbox.y0) });
    return output;
  }
  for (const childKey of ['blocks', 'paragraphs', 'lines', 'words']) {
    const children = item[childKey];
    if (Array.isArray(children)) children.forEach(child => collectOcrItems(child, output));
  }
  return output;
}

async function pageOcr(worker: Worker, canvas: HTMLCanvasElement): Promise<PositionedText[]> {
  const result = await worker.recognize(canvas, {}, { blocks: true });
  return collectOcrItems((result.data as unknown as { blocks?: unknown }).blocks);
}

function preparedHeaderCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const header = cropCanvas(canvas, {
    x: canvas.width * 0.035,
    y: canvas.height * 0.075,
    width: canvas.width * 0.42,
    height: canvas.height * 0.12,
  });
  const output = document.createElement('canvas');
  output.width = header.width * 3;
  output.height = header.height * 6;
  const context = output.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  const rowHeight = output.height / 2;
  context.drawImage(header, 0, 0, output.width, rowHeight);
  context.drawImage(header, 0, rowHeight, output.width, rowHeight);
  const image = context.getImageData(0, rowHeight, output.width, rowHeight);
  for (let offset = 0; offset < image.data.length; offset += 4) {
    const luminance = image.data[offset] * 0.299 + image.data[offset + 1] * 0.587 + image.data[offset + 2] * 0.114;
    const value = luminance >= 204 ? 255 : 0;
    image.data[offset] = value;
    image.data[offset + 1] = value;
    image.data[offset + 2] = value;
    image.data[offset + 3] = 255;
  }
  context.putImageData(image, 0, rowHeight);
  header.width = 1;
  header.height = 1;
  return output;
}

async function headerClassOcr(worker: Worker, canvas: HTMLCanvasElement): Promise<string> {
  const header = preparedHeaderCanvas(canvas);
  try {
    const result = await worker.recognize(header);
    return clean(result.data.text);
  } finally {
    header.width = 1;
    header.height = 1;
  }
}

function preparedProductCanvas(canvas: HTMLCanvasElement, bounds: Rect, threshold: boolean): HTMLCanvasElement {
  const product = cropCanvas(canvas, productZone(bounds));
  const output = document.createElement('canvas');
  output.width = product.width * 4;
  output.height = product.height * 4;
  const context = output.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(product, 0, 0, output.width, output.height);
  if (threshold) {
    const image = context.getImageData(0, 0, output.width, output.height);
    for (let offset = 0; offset < image.data.length; offset += 4) {
      const luminance = image.data[offset] * 0.299 + image.data[offset + 1] * 0.587 + image.data[offset + 2] * 0.114;
      const value = luminance >= 166 ? 255 : 0;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }
  product.width = 1;
  product.height = 1;
  return output;
}

async function recognizeProductVariant(worker: Worker, canvas: HTMLCanvasElement, bounds: Rect, threshold: boolean): Promise<string> {
  const product = preparedProductCanvas(canvas, bounds, threshold);
  try {
    const result = await worker.recognize(product);
    return clean(result.data.text);
  } finally {
    product.width = 1;
    product.height = 1;
  }
}

function productEvidenceFailures(value: string): number {
  return createSkuCandidate(value).failureReasons.length;
}

async function productFieldOcr(worker: Worker, canvas: HTMLCanvasElement, bounds: Rect, initialText: string): Promise<string> {
  let bestText = initialText;
  let bestFailures = productEvidenceFailures(initialText);
  if (bestFailures === 0) return bestText;
  const colorText = await recognizeProductVariant(worker, canvas, bounds, false);
  const colorFailures = productEvidenceFailures(colorText);
  if (colorFailures < bestFailures || (colorFailures === bestFailures && colorText.length < bestText.length)) {
    bestText = colorText;
    bestFailures = colorFailures;
  }
  if (bestFailures === 0) return bestText;
  const thresholdText = await recognizeProductVariant(worker, canvas, bounds, true);
  const thresholdFailures = productEvidenceFailures(thresholdText);
  if (thresholdFailures < bestFailures || (thresholdFailures === bestFailures && thresholdText.length < bestText.length)) return thresholdText;
  return bestText;
}

async function canvasFromPage(page: any): Promise<{ canvas: HTMLCanvasElement; viewport: any }> {
  const base = page.getViewport({ scale: 1 });
  const scale = Math.max(1.25, Math.min(2, 1800 / Math.max(1, base.width)));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  await page.render({ canvasContext: context, canvas, viewport }).promise;
  return { canvas, viewport };
}

export async function importPromotionPdf(file: File, options: ImportOptions): Promise<PdfImportResult> {
  const started = performance.now();
  const monthKey = String(options.monthKey || '').normalize('NFKC').trim().toUpperCase().replace(/[^A-Z0-9ก-๙_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 48);
  if (!monthKey) throw new Error('month_key_required');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data: bytes }).promise;
  const cards: ImportedCardCandidate[] = [];
  const pages: PdfImportResult['pages'] = [];
  const warnings: string[] = [];
  let worker: Worker | null = null;
  let workerLanguage: 'eng+tha' | 'tha' | null = null;
  const ensureWorker = async (language: 'eng+tha' | 'tha'): Promise<Worker> => {
    if (!worker) {
      worker = await createWorker('eng+tha');
      workerLanguage = 'eng+tha';
    }
    if (workerLanguage !== language) {
      await worker.reinitialize(language);
      workerLanguage = language;
    }
    return worker;
  };
  const progress = (phase: PdfImportProgress['phase'], page: number, message: string) => options.onProgress?.({
    phase,
    page,
    pageCount: document.numPages,
    cards: cards.length,
    elapsedMs: Math.round(performance.now() - started),
    message,
  });
  progress('loading', 0, `เปิด PDF ${document.numPages} หน้า`);
  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      progress('rendering', pageNumber, `กำลัง render หน้า ${pageNumber}/${document.numPages}`);
      const page = await document.getPage(pageNumber);
      const { canvas, viewport } = await canvasFromPage(page);
      const grid = detectCardGrid(canvas, pageNumber);
      let textItems = await pdfTextItems(page, viewport);
      let textMethod: 'pdf_text' | 'page_ocr' | 'none' = textItems.length ? 'pdf_text' : 'none';
      if (!textItems.length && options.enableOcr) {
        progress('ocr', pageNumber, `หน้า ${pageNumber}: ไม่มี text layer กำลัง OCR หน้าครั้งเดียว`);
        textItems = await pageOcr(await ensureWorker('eng+tha'), canvas);
        textMethod = textItems.length ? 'page_ocr' : 'none';
      }
      let headerText = textIn(textItems, pageHeaderZone(canvas.width, canvas.height));
      let classId = normalizeClassId(headerText);
      if (!classId && grid.regions.length && options.enableOcr) {
        progress('ocr', pageNumber, `หน้า ${pageNumber}: อ่าน Class จากหัวหน้า`);
        const classText = await headerClassOcr(await ensureWorker('eng+tha'), canvas);
        classId = normalizeClassId(classText);
        headerText = clean(`${headerText} ${classText}`);
      }
      if (!classId && grid.regions.length) warnings.push(`page:${pageNumber}:class_missing`);
      if (grid.diagnostics.status !== 'ok') warnings.push(...grid.diagnostics.reasons.map(reason => `page:${pageNumber}:${reason}`));
      if (textMethod === 'page_ocr' && grid.regions.length && options.enableOcr) await ensureWorker('tha');
      for (const [index, bounds] of grid.regions.entries()) {
        const sequence = index + 1;
        let productText = textIn(textItems, productZone(bounds));
        if (textMethod === 'page_ocr' && options.enableOcr && worker) {
          progress('ocr', pageNumber, `หน้า ${pageNumber}: อ่านหัวการ์ด ${sequence}/${grid.regions.length}`);
          try {
            productText = (await productFieldOcr(worker, canvas, bounds, productText)) || productText;
          } catch {
            warnings.push(`card:${pageNumber}:${sequence}:product_field_ocr_failed`);
          }
        }
        const rawText = textIn(textItems, bounds);
        const failureReasons = [
          ...(!classId ? ['class_missing'] : []),
          ...(!productText ? ['product_text_missing'] : []),
          ...(grid.diagnostics.status !== 'ok' ? ['grid_needs_review'] : []),
        ];
        const crop = cropCanvas(canvas, bounds, Math.max(2, Math.round(bounds.width * 0.008)));
        cards.push({
          cardId: makeCardId(monthKey, classId, pageNumber, sequence),
          monthKey,
          page: pageNumber,
          sequence,
          classId,
          imageUrl: crop.toDataURL('image/webp', 0.82),
          rawText,
          productText,
          pageClassText: headerText,
          confidence: Number(Math.max(0, grid.diagnostics.confidence - (!classId ? 0.25 : 0) - (!productText ? 0.25 : 0)).toFixed(3)),
          evidenceMethod: textMethod,
          bounds,
          failureReasons,
        });
        crop.width = 1;
        crop.height = 1;
      }
      pages.push({ page: pageNumber, classId, cardCount: grid.regions.length, diagnostics: grid.diagnostics, textMethod });
      progress('cards', pageNumber, `หน้า ${pageNumber}: พบ ${grid.regions.length} การ์ด`);
      canvas.width = 1;
      canvas.height = 1;
      page.cleanup();
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  } finally {
    await (worker as Worker | null)?.terminate();
    await document.cleanup();
  }
  const ids = cards.map(card => card.cardId);
  if (new Set(ids).size !== ids.length) warnings.push('duplicate_card_id');
  progress('complete', document.numPages, `เสร็จ ${cards.length} การ์ด`);
  return { cards, pages, elapsedMs: Math.round(performance.now() - started), warnings: [...new Set(warnings)] };
}
