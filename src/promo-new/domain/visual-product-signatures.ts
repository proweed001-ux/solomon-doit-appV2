import type { ImportedCardCandidate } from '../import/pdf-importer';

const WORK_WIDTH = 96;
const WORK_HEIGHT = 64;
const SAMPLE_WIDTH = 24;
const SAMPLE_HEIGHT = 16;
const IMAGE_DECODE_TIMEOUT_MS = 12_000;

interface ViewSpec {
  x: number;
  y: number;
  width: number;
  height: number;
  mask?: Array<{ x: number; y: number; width: number; height: number }>;
}

export interface VisualProductSignature {
  title: string;
  product: string;
  quality: number;
}

const TITLE_VIEW: ViewSpec = {
  x: 0.38,
  y: 0.01,
  width: 0.60,
  height: 0.42,
};

// These views keep the product pack and title while excluding the left price panel
// and most of the lower-right promotion badge. No price or promotion text is encoded.
const PRODUCT_VIEWS: ViewSpec[] = [
  { x: 0.24, y: 0.17, width: 0.50, height: 0.54, mask: [{ x: 0.78, y: 0.68, width: 0.22, height: 0.32 }] },
  { x: 0.20, y: 0.23, width: 0.58, height: 0.46, mask: [{ x: 0.80, y: 0.64, width: 0.20, height: 0.36 }] },
  { x: 0.30, y: 0.16, width: 0.44, height: 0.58, mask: [{ x: 0.82, y: 0.67, width: 0.18, height: 0.33 }] },
];

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const timer = window.setTimeout(() => finish(() => {
      image.src = '';
      reject(new Error('card_image_decode_timeout'));
    }), IMAGE_DECODE_TIMEOUT_MS);
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      window.clearTimeout(timer);
    };
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    image.decoding = 'async';
    image.onload = () => finish(() => resolve(image));
    image.onerror = () => finish(() => reject(new Error('card_image_decode_failed')));
    image.src = source;
  });
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function renderView(image: HTMLImageElement, spec: ViewSpec): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = WORK_WIDTH;
  canvas.height = WORK_HEIGHT;
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    image,
    image.naturalWidth * spec.x,
    image.naturalHeight * spec.y,
    image.naturalWidth * spec.width,
    image.naturalHeight * spec.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.fillStyle = '#ffffff';
  for (const mask of spec.mask || []) {
    context.fillRect(mask.x * canvas.width, mask.y * canvas.height, mask.width * canvas.width, mask.height * canvas.height);
  }
  return canvas;
}

function featureBytes(canvas: HTMLCanvasElement, titleMode: boolean): { bytes: number[]; quality: number } {
  const sample = document.createElement('canvas');
  sample.width = SAMPLE_WIDTH;
  sample.height = SAMPLE_HEIGHT;
  const context = sample.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) return { bytes: [], quality: 0 };
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, sample.width, sample.height);
  context.drawImage(canvas, 0, 0, sample.width, sample.height);
  const { data } = context.getImageData(0, 0, sample.width, sample.height);
  const bytes: number[] = [];
  const rowInk = Array.from({ length: SAMPLE_HEIGHT }, () => 0);
  const columnInk = Array.from({ length: SAMPLE_WIDTH }, () => 0);
  const colorHistogram = Array.from({ length: 64 }, () => 0);
  let inkCount = 0;

  for (let y = 0; y < SAMPLE_HEIGHT; y += 1) {
    for (let x = 0; x < SAMPLE_WIDTH; x += 1) {
      const offset = (y * SAMPLE_WIDTH + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const maximum = Math.max(red, green, blue);
      const minimum = Math.min(red, green, blue);
      const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
      const saturation = maximum - minimum;
      const ink = titleMode ? luminance < 196 : luminance < 244 || saturation > 22;
      const darkness = clampByte(255 - luminance);
      bytes.push(titleMode ? darkness : clampByte(255 - red));
      bytes.push(titleMode ? (ink ? 255 : 0) : clampByte(255 - green));
      bytes.push(titleMode ? clampByte(saturation * 3) : clampByte(255 - blue));
      bytes.push(ink ? 255 : 0);
      if (!ink) continue;
      rowInk[y] += 1;
      columnInk[x] += 1;
      inkCount += 1;
      const redBin = Math.min(3, Math.floor(red / 64));
      const greenBin = Math.min(3, Math.floor(green / 64));
      const blueBin = Math.min(3, Math.floor(blue / 64));
      colorHistogram[redBin * 16 + greenBin * 4 + blueBin] += 1;
    }
  }

  bytes.push(...rowInk.map(value => clampByte(value / SAMPLE_WIDTH * 255)));
  bytes.push(...columnInk.map(value => clampByte(value / SAMPLE_HEIGHT * 255)));
  if (!titleMode) bytes.push(...colorHistogram.map(value => inkCount ? clampByte(value / inkCount * 255) : 0));
  sample.width = 1;
  sample.height = 1;
  return { bytes, quality: inkCount / (SAMPLE_WIDTH * SAMPLE_HEIGHT) };
}

function encode(bytes: number[]): string {
  return bytes.map(value => clampByte(value).toString(16).padStart(2, '0')).join('');
}

export async function cardVisualProductSignature(imageUrl: string): Promise<VisualProductSignature> {
  if (!imageUrl) return { title: '', product: '', quality: 0 };
  const image = await loadImage(imageUrl);
  try {
    const titleCanvas = renderView(image, TITLE_VIEW);
    const title = featureBytes(titleCanvas, true);
    titleCanvas.width = 1;
    titleCanvas.height = 1;

    const productBytes: number[] = [];
    const productQualities: number[] = [];
    for (const view of PRODUCT_VIEWS) {
      const canvas = renderView(image, view);
      const feature = featureBytes(canvas, false);
      productBytes.push(...feature.bytes);
      productQualities.push(feature.quality);
      canvas.width = 1;
      canvas.height = 1;
    }
    return {
      title: encode(title.bytes),
      product: encode(productBytes),
      quality: Number(((title.quality + productQualities.reduce((sum, value) => sum + value, 0) / PRODUCT_VIEWS.length) / 2).toFixed(4)),
    };
  } finally {
    image.src = '';
  }
}

export async function buildVisualProductSignatures(
  cards: ImportedCardCandidate[],
  onProgress?: (completed: number, total: number) => void,
): Promise<Record<string, VisualProductSignature>> {
  const output: Record<string, VisualProductSignature> = {};
  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    try {
      output[card.cardId] = await cardVisualProductSignature(card.imageUrl);
    } catch {
      output[card.cardId] = { title: '', product: '', quality: 0 };
    }
    onProgress?.(index + 1, cards.length);
    if ((index + 1) % 4 === 0) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  return output;
}
