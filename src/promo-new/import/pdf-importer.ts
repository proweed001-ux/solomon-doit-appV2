import { createWorker, type Worker } from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { cropCanvas, detectCardGrid, type GridDiagnostics, type Rect } from './grid-detector';
import {
  classifyClassText,
  classifyPageClassText,
  normalizeClassId,
  resolvePageClassSequence,
  type PageClassObservation,
  type ResolvedPageClass,
} from './class-id';
import { makeCardId } from './card-id';
import { cardProductTitleZone, configureCardTitleOcr, recognizeCardProductTitle } from './card-title-ocr';
import type { PositionedText } from './ocr-items';
import { assertProductMasterReady } from '../shared/runtime-readiness';

export { classifyClassText, classifyPageClassText, normalizeClassId, resolvePageClassSequence } from './class-id';
export { makeCardId } from './card-id';
export { collectOcrItems } from './ocr-items';
export type { PositionedText } from './ocr-items';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const MAX_PROMO_PDF_BYTES = 50 * 1024 * 1024;
export const MAX_PROMO_PDF_PAGES = 120;
export const MAX_PROMO_PDF_CARDS = 2_000;

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
  pages: Array<{
    page: number;
    classId: string | null;
    classConfidence?: number;
    classMethod?: ResolvedPageClass['method'];
    classRawText?: string;
    cardCount: number;
    diagnostics: GridDiagnostics;
    textMethod: 'pdf_text' | 'page_ocr' | 'none';
  }>;
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

function pageHeaderZone(width: number, height: number): Rect {
  return { x: 0, y: 0, width: width * 0.48, height: height * 0.2 };
}

function pageTopBandZone(width: number, height: number): Rect {
  return { x: 0, y: 0, width, height: height * 0.28 };
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

function scaledHeaderVariant(canvas: HTMLCanvasElement, rect: Rect, mode: 'color' | 'threshold'): HTMLCanvasElement {
  const header = cropCanvas(canvas, rect);
  const output = document.createElement('canvas');
  output.width = Math.max(1, Math.round(header.width * 4));
  output.height = Math.max(1, Math.round(header.height * 4));
  const context = output.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, output.width, output.height);
  context.drawImage(header, 0, 0, output.width, output.height);
  if (mode === 'threshold') {
    const image = context.getImageData(0, 0, output.width, output.height);
    for (let offset = 0; offset < image.data.length; offset += 4) {
      const red = image.data[offset];
      const green = image.data[offset + 1];
      const blue = image.data[offset + 2];
      const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
      const pixelSaturation = Math.max(red, green, blue) - Math.min(red, green, blue);
      const value = luminance >= 165 && pixelSaturation <= 95 ? 0 : 255;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }
  header.width = 1;
  header.height = 1;
  return output;
}

function preparedHeaderCanvases(canvas: HTMLCanvasElement): HTMLCanvasElement[] {
  const tokenRect = { x: canvas.width * 0.085, y: canvas.height * 0.055, width: canvas.width * 0.31, height: canvas.height * 0.13 };
  const broadRect = { x: canvas.width * 0.025, y: canvas.height * 0.015, width: canvas.width * 0.44, height: canvas.height * 0.18 };
  const rightRect = { x: canvas.width * 0.4, y: canvas.height * 0.015, width: canvas.width * 0.58, height: canvas.height * 0.2 };
  return [
    scaledHeaderVariant(canvas, tokenRect, 'color'),
    scaledHeaderVariant(canvas, tokenRect, 'threshold'),
    scaledHeaderVariant(canvas, broadRect, 'threshold'),
    scaledHeaderVariant(canvas, rightRect, 'color'),
    scaledHeaderVariant(canvas, rightRect, 'threshold'),
  ];
}

async function headerClassOcr(worker: Worker, canvas: HTMLCanvasElement): Promise<string[]> {
  const variants = preparedHeaderCanvases(canvas);
  const texts: string[] = [];
  try {
    for (const variant of variants) {
      const result = await worker.recognize(variant);
      const text = clean(result.data.text);
      if (text) texts.push(text);
    }
    return [...new Set(texts)];
  } finally {
    for (const variant of variants) {
      variant.width = 1;
      variant.height = 1;
    }
  }
}

function headerColorEvidence(canvas: HTMLCanvasElement): [number, number, number] | null {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;
  const x = Math.floor(canvas.width * 0.015);
  const y = Math.floor(canvas.height * 0.015);
  const width = Math.max(1, Math.floor(canvas.width * 0.44));
  const height = Math.max(1, Math.floor(canvas.height * 0.16));
  const data = context.getImageData(x, y, width, height).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;
  for (let offset = 0; offset < data.length; offset += 16) {
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const maximum = Math.max(r, g, b);
    const minimum = Math.min(r, g, b);
    const pixelSaturation = maximum - minimum;
    const luminance = r * 0.299 + g * 0.587 + b * 0.114;
    if (pixelSaturation < 35 || luminance < 35 || luminance > 225) continue;
    red += r;
    green += g;
    blue += b;
    count += 1;
  }
  return count ? [Math.round(red / count), Math.round(green / count), Math.round(blue / count)] : null;
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
  if (!(file?.size > 0)) throw new Error('promo_pdf_empty');
  if (file.size > MAX_PROMO_PDF_BYTES) throw new Error(`promo_pdf_too_large:${file.size}/${MAX_PROMO_PDF_BYTES}`);
  assertProductMasterReady();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data: bytes }).promise;
  if (!Number.isInteger(document.numPages) || document.numPages < 1 || document.numPages > MAX_PROMO_PDF_PAGES) {
    const pageCount = Number(document.numPages || 0);
    await (document as unknown as { destroy: () => Promise<void> }).destroy();
    throw new Error(`promo_pdf_page_limit:${pageCount}/${MAX_PROMO_PDF_PAGES}`);
  }

  const cards: ImportedCardCandidate[] = [];
  const pages: PdfImportResult['pages'] = [];
  const pageClassObservations: PageClassObservation[] = [];
  const warnings: string[] = [];
  let worker: Worker | null = null;
  const ensureWorker = async (): Promise<Worker> => {
    if (!worker) {
      worker = await createWorker('eng+tha');
      await configureCardTitleOcr(worker);
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
      if (cards.length + grid.regions.length > MAX_PROMO_PDF_CARDS) {
        canvas.width = 1;
        canvas.height = 1;
        page.cleanup();
        throw new Error(`promo_pdf_card_limit:${cards.length + grid.regions.length}/${MAX_PROMO_PDF_CARDS}`);
      }

      const textItems = await pdfTextItems(page, viewport);
      const hasPdfText = textItems.length > 0;
      const textMethod: 'pdf_text' | 'page_ocr' | 'none' = hasPdfText ? 'pdf_text' : options.enableOcr ? 'page_ocr' : 'none';
      const headerTexts: string[] = [];
      const pageTextHeader = textIn(textItems, pageHeaderZone(canvas.width, canvas.height));
      const pageTextTopBand = textIn(textItems, pageTopBandZone(canvas.width, canvas.height));
      if (pageTextHeader) headerTexts.push(pageTextHeader);
      if (pageTextTopBand && pageTextTopBand !== pageTextHeader) headerTexts.push(pageTextTopBand);
      const pageTextValues = textItems.map(item => item.text).filter(Boolean);
      const headerEvidence = classifyClassText(headerTexts);
      let classEvidence = classifyPageClassText(headerTexts, [
        ...pageTextValues,
        pageTextValues.join(' '),
      ]);
      if (!headerEvidence.classId && classEvidence.classId) warnings.push(`page:${pageNumber}:class_page_text_fallback:${classEvidence.classId}`);
      if (grid.regions.length && options.enableOcr && (!classEvidence.classId || classEvidence.confidence < 0.9)) {
        progress('ocr', pageNumber, `หน้า ${pageNumber}: จำแนก Class จากหัวเอกสาร`);
        try {
          headerTexts.push(...await headerClassOcr(await ensureWorker(), canvas));
          classEvidence = classifyPageClassText(headerTexts, [
            ...pageTextValues,
            pageTextValues.join(' '),
          ]);
        } catch {
          warnings.push(`page:${pageNumber}:class_header_ocr_failed`);
        }
      }

      const classId = classEvidence.classId;
      const headerText = clean([...headerTexts, classEvidence.classId ? `CLASS:${classEvidence.classId}` : ''].filter(Boolean).join(' | '));
      pageClassObservations.push({
        page: pageNumber,
        texts: classEvidence.classId ? [...headerTexts, `CLASS:${classEvidence.classId}`] : headerTexts,
        headerColor: headerColorEvidence(canvas),
        hasCards: grid.regions.length > 0,
      });
      if (grid.diagnostics.status !== 'ok') warnings.push(...grid.diagnostics.reasons.map(reason => `page:${pageNumber}:${reason}`));

      for (const [index, bounds] of grid.regions.entries()) {
        const sequence = index + 1;
        let productText = hasPdfText ? textIn(textItems, cardProductTitleZone(bounds)) : '';
        let rawText = hasPdfText ? textIn(textItems, bounds) : '';
        if (!hasPdfText && options.enableOcr) {
          progress('ocr', pageNumber - 1 + (index + 1) / Math.max(1, grid.regions.length), `หน้า ${pageNumber}: OCR ชื่อมุมขวาบน ${index + 1}/${grid.regions.length}`);
          try {
            productText = await recognizeCardProductTitle(await ensureWorker(), canvas, bounds);
            rawText = productText;
          } catch {
            warnings.push(`page:${pageNumber}:card:${sequence}:product_title_ocr_failed`);
          }
        }
        const failureReasons = [
          ...(!classId ? ['class_missing'] : []),
          ...(!productText ? ['product_text_missing'] : []),
          ...(grid.diagnostics.status !== 'ok' ? ['grid_needs_review'] : []),
        ];
        const crop = cropCanvas(canvas, bounds, Math.max(2, Math.round(bounds.width * 0.008)));
        cards.push({
          cardId: makeCardId(),
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

      pages.push({
        page: pageNumber,
        classId,
        classConfidence: classEvidence.confidence,
        classMethod: classEvidence.method,
        classRawText: classEvidence.rawText,
        cardCount: grid.regions.length,
        diagnostics: grid.diagnostics,
        textMethod,
      });
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

  const resolvedClasses = resolvePageClassSequence(pageClassObservations);
  const resolvedByPage = new Map(resolvedClasses.map(item => [item.page, item]));
  for (const page of pages) {
    const resolved = resolvedByPage.get(page.page);
    const previous = page.classId;
    page.classId = resolved?.classId || null;
    page.classConfidence = resolved?.confidence || 0;
    page.classMethod = resolved?.method || 'missing';
    page.classRawText = resolved?.rawText || page.classRawText || '';
    if (!page.classId && page.cardCount) warnings.push(`page:${page.page}:class_missing`);
    if (previous && page.classId && previous !== page.classId) warnings.push(`page:${page.page}:class_sequence_override:${previous}->${page.classId}`);
    if (!previous && page.classId) warnings.push(`page:${page.page}:class_recovered:${page.classId}`);
  }
  for (const card of cards) {
    const resolved = resolvedByPage.get(card.page);
    const previousClass = card.classId;
    card.classId = resolved?.classId || null;
    card.failureReasons = card.failureReasons.filter(reason => reason !== 'class_missing');
    if (!card.classId) card.failureReasons.push('class_missing');
    if (!previousClass && card.classId) warnings.push(`card:${card.cardId}:class_recovered_without_product_confidence_boost`);
  }

  const ids = cards.map(card => card.cardId);
  if (new Set(ids).size !== ids.length) throw new Error('duplicate_card_id');
  const positions = cards.map(card => `${card.page}:${card.sequence}`);
  if (new Set(positions).size !== positions.length) throw new Error('duplicate_card_position');
  progress('complete', document.numPages, `เสร็จ ${cards.length} การ์ด`);
  return { cards, pages, elapsedMs: Math.round(performance.now() - started), warnings: [...new Set(warnings)] };
}
