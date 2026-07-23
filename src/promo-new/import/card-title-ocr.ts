import { PSM, type Worker } from 'tesseract.js';
import { chooseTrustedCardHeaderText } from './card-header-ocr';
import { cropCanvas, type Rect } from './grid-detector';
import { collectOcrItems } from './ocr-items';

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
const PANEL_GAP = 40;
const TITLE_MODES = ['color', 'gray', 'adaptive'] as const;
type TitleMode = (typeof TITLE_MODES)[number];

export function cardProductTitleZone(bounds: Rect): Rect {
  return {
    x: bounds.x + bounds.width * 0.32,
    y: bounds.y,
    width: bounds.width * 0.67,
    height: bounds.height * 0.46,
  };
}

function adaptiveThreshold(canvas: HTMLCanvasElement, radius = 15, offset = 11): void {
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const width = canvas.width;
  const height = canvas.height;
  const grayscale = new Uint8Array(width * height);
  const stride = width + 1;
  const integral = new Uint32Array((width + 1) * (height + 1));

  for (let y = 0; y < height; y += 1) {
    let rowSum = 0;
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const pixel = index * 4;
      const value = Math.round(image.data[pixel] * 0.299 + image.data[pixel + 1] * 0.587 + image.data[pixel + 2] * 0.114);
      grayscale[index] = value;
      rowSum += value;
      integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + rowSum;
    }
  }

  for (let y = 0; y < height; y += 1) {
    const top = Math.max(0, y - radius);
    const bottom = Math.min(height, y + radius + 1);
    for (let x = 0; x < width; x += 1) {
      const left = Math.max(0, x - radius);
      const right = Math.min(width, x + radius + 1);
      const sum = integral[bottom * stride + right] - integral[top * stride + right] - integral[bottom * stride + left] + integral[top * stride + left];
      const mean = sum / Math.max(1, (right - left) * (bottom - top));
      const value = grayscale[y * width + x] < mean - offset ? 0 : 255;
      const pixel = (y * width + x) * 4;
      image.data[pixel] = value;
      image.data[pixel + 1] = value;
      image.data[pixel + 2] = value;
      image.data[pixel + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
}

function grayscaleContrast(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let offset = 0; offset < image.data.length; offset += 4) {
    const luminance = image.data[offset] * 0.299 + image.data[offset + 1] * 0.587 + image.data[offset + 2] * 0.114;
    const value = Math.max(0, Math.min(255, Math.round((luminance - 128) * 1.35 + 128)));
    image.data[offset] = value;
    image.data[offset + 1] = value;
    image.data[offset + 2] = value;
    image.data[offset + 3] = 255;
  }
  context.putImageData(image, 0, 0);
}

function renderVariant(header: HTMLCanvasElement, mode: TitleMode): HTMLCanvasElement {
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
  if (mode === 'gray') grayscaleContrast(output);
  if (mode === 'adaptive') adaptiveThreshold(output);
  return output;
}

interface PreparedTitleComposite {
  canvas: HTMLCanvasElement;
  panelHeight: number;
}

export function prepareCardProductTitleCanvas(pageCanvas: HTMLCanvasElement, bounds: Rect): HTMLCanvasElement {
  return prepareCardProductTitleComposite(pageCanvas, bounds).canvas;
}

function prepareCardProductTitleComposite(pageCanvas: HTMLCanvasElement, bounds: Rect): PreparedTitleComposite {
  const header = cropCanvas(pageCanvas, cardProductTitleZone(bounds));
  const variants = TITLE_MODES.map(mode => renderVariant(header, mode));
  const panelHeight = variants[0].height;
  const canvas = document.createElement('canvas');
  canvas.width = variants[0].width;
  canvas.height = panelHeight * variants.length + PANEL_GAP * (variants.length - 1);
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  variants.forEach((variant, index) => {
    context.drawImage(variant, 0, index * (panelHeight + PANEL_GAP));
    variant.width = 1;
    variant.height = 1;
  });
  header.width = 1;
  header.height = 1;
  return { canvas, panelHeight };
}

function recognizedVariantTexts(resultData: unknown, panelHeight: number): string[] {
  const data = resultData as { blocks?: unknown; text?: unknown };
  const items = collectOcrItems(data.blocks);
  const output = TITLE_MODES.map(() => [] as Array<{ text: string; x: number; y: number }>);
  for (const item of items) {
    const centerY = item.y + item.height / 2;
    const index = Math.max(0, Math.min(TITLE_MODES.length - 1, Math.floor(centerY / (panelHeight + PANEL_GAP))));
    const panelTop = index * (panelHeight + PANEL_GAP);
    if (centerY > panelTop + panelHeight) continue;
    output[index].push({ text: item.text, x: item.x, y: item.y });
  }
  const attempts = output.map(itemsInPanel => clean(itemsInPanel.sort((left, right) => left.y - right.y || left.x - right.x).map(item => item.text).join(' ')));
  if (attempts.some(Boolean)) return attempts;
  return [clean(data.text)];
}

export async function configureCardTitleOcr(worker: Worker): Promise<void> {
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT as PSM,
    preserve_interword_spaces: '1',
  });
}

export async function recognizeCardProductTitle(worker: Worker, pageCanvas: HTMLCanvasElement, bounds: Rect): Promise<string> {
  const prepared = prepareCardProductTitleComposite(pageCanvas, bounds);
  try {
    const result = await worker.recognize(prepared.canvas, {}, { blocks: true });
    const attempts = recognizedVariantTexts(result.data, prepared.panelHeight);
    return chooseTrustedCardHeaderText('', attempts);
  } finally {
    prepared.canvas.width = 1;
    prepared.canvas.height = 1;
  }
}
