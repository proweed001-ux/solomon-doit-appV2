import { createWorker, type Worker } from 'tesseract.js';
import { createSkuCandidate, normalizeProductText } from '../domain/sku-identity';
import type { ImportedCardCandidate } from './pdf-importer';

const clean = (value: unknown): string => normalizeProductText(value).replace(/\s+/g, ' ').trim();

const HEADER_ZONES = [
  { x: 0.50, y: 0.005, width: 0.485, height: 0.27 },
  { x: 0.43, y: 0.005, width: 0.555, height: 0.36 },
  { x: 0.36, y: 0.005, width: 0.625, height: 0.43 },
] as const;

type HeaderMode = 'color' | 'gray' | 'threshold';
const HEADER_MODES: HeaderMode[] = ['color', 'gray', 'threshold'];

const BRAND_PATTERNS: Array<[RegExp, string]> = [
  [/\bH\s*&\s*S\b|HEAD\s*(?:&|AND)?\s*SHOULDER|เฮด\s*แอนด์\s*โชว์?เดอร์|เฮดแอนด์โชว์?เตอร์/iu, 'H&S'],
  [/\bPANTENE\b|แพนทีน/iu, 'PANTENE'],
  [/\bREJOICE\b|รีจอยส์|รีจ้อยส์|รีออยส์/iu, 'REJOICE'],
  [/\bDOWNY\b|ดาวน์นี่|ดาวนี/iu, 'DOWNY'],
  [/\bOLAY\b|โอเลย์|โอเอย์/iu, 'OLAY'],
  [/\bGILLETTE\b|กิลเลตต์|ยิลเลตต์|ยิลเลตดี|ยิลเลตส์/iu, 'GILLETTE'],
  [/\bSAFEGUARD\b|เซฟการ์ด/iu, 'SAFEGUARD'],
  [/\bVICKS\b|วิคส์/iu, 'VICKS'],
  [/\bAMBI\s*PUR\b|แอมบิเพอร์/iu, 'AMBI PUR'],
  [/\bORAL\s*[- ]?B\b|ออรัลบี|ออรัลบ/iu, 'ORAL-B'],
];

const SIZE_PATTERN = /\d+(?:[.,]\d+)?\s*(?:มล\.?|ML|บล\.?|VA|ลิตร|L\b|กรัม|กรับ|G\b|กก\.?|KG\b)/iu;
const PRODUCT_TYPE_PATTERN = /แชมพู|ครีมนวด|ปรับผ้านุ่ม|สบู่|แปรงสีฟัน|มีดโกน|ด้ามมีด|ใบมีด|ซุปเปอร์คลิ๊ก|เวคเตอร์|ครีม|โลชั่น|เซรั่ม|โททัลไวท์|ยาบาล์ม|SHAMPOO|CONDITIONER|SOAP|RAZOR|BLADE|SUPER\s*CLICK|VECTOR/iu;

function canonicalizeHeaderText(value: string): string {
  let output = clean(value)
    .replace(/(\d)\s*(?:บล\.?|VA)\b/giu, '$1 มล.')
    .replace(/(\d)\s*(?:กรับ|NSU)\b/giu, '$1 กรัม')
    .replace(/(\d)\s*[มบ]ล(?=\s|\.|$)/giu, '$1 มล.');
  for (const [pattern, canonical] of BRAND_PATTERNS) {
    if (pattern.test(output) && !output.toUpperCase().startsWith(canonical)) output = `${canonical} ${output}`;
  }
  return clean(output);
}

function detectedBrand(value: string): string | null {
  for (const [pattern, canonical] of BRAND_PATTERNS) if (pattern.test(value)) return canonical;
  return null;
}

export function scoreCardHeaderText(value: string): number {
  const text = canonicalizeHeaderText(value);
  if (!text) return -1000;
  const candidate = createSkuCandidate(text);
  let score = 0;
  if (detectedBrand(text) || candidate.identity.brand) score += 48;
  if (candidate.identity.productType || PRODUCT_TYPE_PATTERN.test(text)) score += 24;
  if ((candidate.identity.sizeValue > 0 && candidate.identity.sizeUnit) || SIZE_PATTERN.test(text)) score += 34;
  if (/ทุกสูตร|ซุปเปอร์|SUPER|โททัล|TOTAL|ถุงเติม|ซอง|แพ็ค|PACK/iu.test(text)) score += 7;
  score -= candidate.failureReasons.length * 7;
  if (text.length >= 5 && text.length <= 150) score += 8;
  if (text.length > 240) score -= 24;
  const strange = (text.match(/[|@{}<>]/g) || []).length;
  score -= strange * 3;
  return score;
}

export function shouldRefreshCardHeader(card: ImportedCardCandidate): boolean {
  const candidate = createSkuCandidate(card.productText || card.rawText);
  const missing = new Set(candidate.failureReasons);
  return !card.productText
    || !candidate.identity.brand
    || !candidate.identity.productType
    || !(candidate.identity.sizeValue > 0 && candidate.identity.sizeUnit)
    || ['brand_missing', 'product_type_missing', 'size_missing', 'size_unit_missing'].some(reason => missing.has(reason));
}

function textCandidates(initialText: string, recognizedText: string): string[] {
  const lines = recognizedText.split(/\n+/).map(clean).filter(Boolean);
  const candidates = [initialText, recognizedText, ...lines];
  for (let index = 0; index < lines.length; index += 1) {
    candidates.push(lines.slice(index, index + 2).join(' '));
    candidates.push(lines.slice(index, index + 3).join(' '));
  }
  return [...new Set(candidates.map(canonicalizeHeaderText).filter(Boolean))];
}

export function chooseBestCardHeaderText(initialText: string, recognizedText: string): string {
  return textCandidates(initialText, recognizedText)
    .sort((left, right) => scoreCardHeaderText(right) - scoreCardHeaderText(left) || left.length - right.length)[0]
    || clean(initialText);
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('card_header_image_decode_failed'));
    image.src = source;
  });
}

function preprocessCanvas(canvas: HTMLCanvasElement, mode: HeaderMode): void {
  if (mode === 'color') return;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    const luminance = pixels.data[offset] * 0.299 + pixels.data[offset + 1] * 0.587 + pixels.data[offset + 2] * 0.114;
    const value = mode === 'threshold' ? (luminance >= 190 ? 255 : 0) : Math.max(0, Math.min(255, Math.round((luminance - 128) * 1.35 + 128)));
    pixels.data[offset] = value;
    pixels.data[offset + 1] = value;
    pixels.data[offset + 2] = value;
    pixels.data[offset + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
}

function preparedHeaderCanvas(
  image: HTMLImageElement,
  zone: (typeof HEADER_ZONES)[number],
  mode: HeaderMode,
): HTMLCanvasElement {
  const sourceWidth = image.naturalWidth * zone.width;
  const sourceHeight = image.naturalHeight * zone.height;
  const canvas = document.createElement('canvas');
  canvas.width = 1500;
  canvas.height = Math.max(260, Math.round(canvas.width * sourceHeight / Math.max(1, sourceWidth)));
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    image,
    image.naturalWidth * zone.x,
    image.naturalHeight * zone.y,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  preprocessCanvas(canvas, mode);
  return canvas;
}

async function recognizeCardHeader(worker: Worker, card: ImportedCardCandidate): Promise<string> {
  const image = await loadImage(card.imageUrl);
  const recognized: string[] = [];
  let bestScore = scoreCardHeaderText(card.productText);
  try {
    for (const zone of HEADER_ZONES) {
      for (const mode of HEADER_MODES) {
        const canvas = preparedHeaderCanvas(image, zone, mode);
        try {
          const result = await worker.recognize(canvas);
          const text = clean(result.data.text);
          if (text) {
            recognized.push(text);
            const candidate = chooseBestCardHeaderText(card.productText, text);
            bestScore = Math.max(bestScore, scoreCardHeaderText(candidate));
            if (bestScore >= 112) return recognized.join('\n');
          }
        } finally {
          canvas.width = 1;
          canvas.height = 1;
        }
      }
    }
    return recognized.join('\n');
  } finally {
    image.src = '';
  }
}

export interface HeaderOcrResult {
  cards: ImportedCardCandidate[];
  attempted: number;
  improved: number;
  warnings: string[];
}

export async function enrichCardHeadersFromImages(
  cards: ImportedCardCandidate[],
  onProgress?: (completed: number, total: number) => void,
): Promise<HeaderOcrResult> {
  const targets = cards.filter(card => card.imageUrl && shouldRefreshCardHeader(card));
  if (!targets.length) return { cards, attempted: 0, improved: 0, warnings: [] };
  const targetIds = new Set(targets.map(card => card.cardId));
  const output = cards.map(card => ({ ...card, failureReasons: [...card.failureReasons] }));
  const byId = new Map(output.map(card => [card.cardId, card]));
  const warnings: string[] = [];
  let improved = 0;
  const worker = await createWorker('eng+tha');
  try {
    for (let index = 0; index < targets.length; index += 1) {
      const source = targets[index];
      const card = byId.get(source.cardId);
      if (!card || !targetIds.has(source.cardId)) continue;
      try {
        const recognized = await recognizeCardHeader(worker, source);
        const best = chooseBestCardHeaderText(source.productText, recognized);
        const before = scoreCardHeaderText(source.productText);
        const after = scoreCardHeaderText(best);
        const beforeSku = createSkuCandidate(source.productText || source.rawText);
        const afterSku = createSkuCandidate(best);
        const gainedCriticalEvidence = (
          (!beforeSku.identity.brand && Boolean(afterSku.identity.brand))
          || (!beforeSku.identity.productType && Boolean(afterSku.identity.productType))
          || (!(beforeSku.identity.sizeValue > 0 && beforeSku.identity.sizeUnit) && Boolean(afterSku.identity.sizeValue > 0 && afterSku.identity.sizeUnit))
        );
        if (best && after > before && (after >= before + 4 || gainedCriticalEvidence)) {
          card.productText = best;
          card.rawText = clean(`${card.rawText} ${best}`);
          card.failureReasons = card.failureReasons.filter(reason => reason !== 'product_text_missing');
          improved += 1;
        }
      } catch {
        warnings.push(`card:${source.cardId}:top_right_header_ocr_failed`);
      }
      onProgress?.(index + 1, targets.length);
      if ((index + 1) % 4 === 0) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  } finally {
    await worker.terminate();
  }
  warnings.push(`top_right_header_ocr_attempted:${targets.length}`);
  warnings.push(`top_right_header_ocr_improved:${improved}`);
  return { cards: output, attempted: targets.length, improved, warnings: [...new Set(warnings)] };
}
