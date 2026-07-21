import type { ImportedCardCandidate } from '../import/pdf-importer';

const HASH_SIZE = 16;
const DCT_SIZE = 64;
const EDGE_WIDTH = 96;
const EDGE_HEIGHT = 64;
const IMAGE_DECODE_TIMEOUT_MS = 12_000;

export interface VisualProductSignature {
  /** 16×16 perceptual hash encoded as 00/ff bytes. */
  title: string;
  /** 16×16 perceptual hash encoded as 00/ff bytes. */
  product: string;
  /** L2-normalized OpenCV-style HSV histogram: 24 hue × 12 saturation bins. */
  colorHistogram?: number[];
  /** 6×4 spatial edge-density blocks. */
  edgeHistogram?: number[];
  quality: number;
}

interface RelativeView {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TITLE_VIEW: RelativeView = { x: 0.44, y: 0, width: 0.555, height: 0.36 };
const PRODUCT_VIEW: RelativeView = { x: 0.18, y: 0.10, width: 0.64, height: 0.78 };

const DCT_COS = Array.from({ length: HASH_SIZE }, (_, frequency) =>
  Float64Array.from({ length: DCT_SIZE }, (_, position) =>
    Math.cos(Math.PI * (2 * position + 1) * frequency / (2 * DCT_SIZE)),
  ),
);
const DCT_SCALE = Float64Array.from({ length: HASH_SIZE }, (_, frequency) =>
  frequency === 0 ? Math.sqrt(1 / DCT_SIZE) : Math.sqrt(2 / DCT_SIZE),
);

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      callback();
    };
    const timer = window.setTimeout(() => finish(() => {
      image.src = '';
      reject(new Error('card_image_decode_timeout'));
    }), IMAGE_DECODE_TIMEOUT_MS);
    image.decoding = 'async';
    image.onload = () => finish(() => resolve(image));
    image.onerror = () => finish(() => reject(new Error('card_image_decode_failed')));
    image.src = source;
  });
}

function cropView(image: HTMLImageElement, view: RelativeView): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * view.width));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * view.height));
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    image,
    image.naturalWidth * view.x,
    image.naturalHeight * view.y,
    image.naturalWidth * view.width,
    image.naturalHeight * view.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas;
}

function resizedPixels(canvas: HTMLCanvasElement, width: number, height: number): Uint8ClampedArray {
  const resized = document.createElement('canvas');
  resized.width = width;
  resized.height = height;
  const context = resized.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(canvas, 0, 0, width, height);
  const data = context.getImageData(0, 0, width, height).data;
  resized.width = 1;
  resized.height = 1;
  return data;
}

function rgbToOpenCvHsv(red: number, green: number, blue: number): [number, number, number] {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const maximum = Math.max(r, g, b);
  const minimum = Math.min(r, g, b);
  const difference = maximum - minimum;
  let hue = 0;
  if (difference > 0) {
    if (maximum === r) hue = ((g - b) / difference) % 6;
    else if (maximum === g) hue = (b - r) / difference + 2;
    else hue = (r - g) / difference + 4;
    hue *= 30;
    if (hue < 0) hue += 180;
  }
  const saturation = maximum <= 0 ? 0 : difference / maximum * 255;
  return [hue, saturation, maximum * 255];
}

function maskPromotionRed(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const mask = new Uint8Array(canvas.width * canvas.height);
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const [hue, saturation] = rgbToOpenCvHsv(image.data[offset], image.data[offset + 1], image.data[offset + 2]);
    if (saturation > 150 && (hue < 35 || hue > 160)) mask[index] = 1;
  }
  const dilated = new Uint8Array(mask.length);
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      let active = false;
      for (let dy = -2; dy <= 2 && !active; dy += 1) {
        const yy = y + dy;
        if (yy < 0 || yy >= canvas.height) continue;
        for (let dx = -2; dx <= 2; dx += 1) {
          const xx = x + dx;
          if (xx >= 0 && xx < canvas.width && mask[yy * canvas.width + xx]) { active = true; break; }
        }
      }
      if (active) dilated[y * canvas.width + x] = 1;
    }
  }
  for (let index = 0; index < dilated.length; index += 1) {
    if (!dilated[index]) continue;
    const offset = index * 4;
    image.data[offset] = 255;
    image.data[offset + 1] = 255;
    image.data[offset + 2] = 255;
    image.data[offset + 3] = 255;
  }
  context.putImageData(image, 0, 0);
}

function grayscale(data: Uint8ClampedArray, width: number, height: number): Float64Array {
  const output = new Float64Array(width * height);
  for (let index = 0; index < output.length; index += 1) {
    const offset = index * 4;
    output[index] = data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114;
  }
  return output;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function perceptualHash(canvas: HTMLCanvasElement): string {
  const gray = grayscale(resizedPixels(canvas, DCT_SIZE, DCT_SIZE), DCT_SIZE, DCT_SIZE);
  const horizontal = Array.from({ length: HASH_SIZE }, () => new Float64Array(DCT_SIZE));
  for (let frequency = 0; frequency < HASH_SIZE; frequency += 1) {
    const cosine = DCT_COS[frequency];
    for (let y = 0; y < DCT_SIZE; y += 1) {
      let sum = 0;
      const row = y * DCT_SIZE;
      for (let x = 0; x < DCT_SIZE; x += 1) sum += gray[row + x] * cosine[x];
      horizontal[frequency][y] = sum * DCT_SCALE[frequency];
    }
  }
  const coefficients: number[] = [];
  for (let vertical = 0; vertical < HASH_SIZE; vertical += 1) {
    const cosine = DCT_COS[vertical];
    for (let horizontalFrequency = 0; horizontalFrequency < HASH_SIZE; horizontalFrequency += 1) {
      let sum = 0;
      for (let y = 0; y < DCT_SIZE; y += 1) sum += horizontal[horizontalFrequency][y] * cosine[y];
      coefficients.push(sum * DCT_SCALE[vertical]);
    }
  }
  const threshold = median(coefficients.slice(HASH_SIZE));
  return coefficients.map(value => value > threshold ? 'ff' : '00').join('');
}

function colorHistogram(canvas: HTMLCanvasElement): number[] {
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const histogram = Array.from({ length: 24 * 12 }, () => 0);
  for (let offset = 0; offset < data.length; offset += 4) {
    const [hue, saturation, value] = rgbToOpenCvHsv(data[offset], data[offset + 1], data[offset + 2]);
    if (value >= 250) continue;
    const hueBin = Math.max(0, Math.min(23, Math.floor(hue / 180 * 24)));
    const saturationBin = Math.max(0, Math.min(11, Math.floor(saturation / 256 * 12)));
    histogram[hueBin * 12 + saturationBin] += 1;
  }
  const length = Math.sqrt(histogram.reduce((sum, value) => sum + value * value, 0));
  return histogram.map(value => length ? value / length : 0);
}

function edgeHistogram(canvas: HTMLCanvasElement): number[] {
  const gray = grayscale(resizedPixels(canvas, EDGE_WIDTH, EDGE_HEIGHT), EDGE_WIDTH, EDGE_HEIGHT);
  const magnitude = new Float64Array(EDGE_WIDTH * EDGE_HEIGHT);
  for (let y = 1; y < EDGE_HEIGHT - 1; y += 1) {
    for (let x = 1; x < EDGE_WIDTH - 1; x += 1) {
      const a = gray[(y - 1) * EDGE_WIDTH + x - 1];
      const b = gray[(y - 1) * EDGE_WIDTH + x];
      const c = gray[(y - 1) * EDGE_WIDTH + x + 1];
      const d = gray[y * EDGE_WIDTH + x - 1];
      const f = gray[y * EDGE_WIDTH + x + 1];
      const g = gray[(y + 1) * EDGE_WIDTH + x - 1];
      const h = gray[(y + 1) * EDGE_WIDTH + x];
      const i = gray[(y + 1) * EDGE_WIDTH + x + 1];
      const gx = -a + c - 2 * d + 2 * f - g + i;
      const gy = -a - 2 * b - c + g + 2 * h + i;
      magnitude[y * EDGE_WIDTH + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  const output: number[] = [];
  for (let blockY = 0; blockY < 4; blockY += 1) {
    for (let blockX = 0; blockX < 6; blockX += 1) {
      let edgePixels = 0;
      for (let y = blockY * 16; y < (blockY + 1) * 16; y += 1) {
        for (let x = blockX * 16; x < (blockX + 1) * 16; x += 1) {
          if (magnitude[y * EDGE_WIDTH + x] >= 160) edgePixels += 1;
        }
      }
      output.push(edgePixels / 256);
    }
  }
  return output;
}

export async function cardVisualProductSignature(imageUrl: string): Promise<VisualProductSignature> {
  if (!imageUrl) return { title: '', product: '', colorHistogram: [], edgeHistogram: [], quality: 0 };
  const image = await loadImage(imageUrl);
  try {
    const titleCanvas = cropView(image, TITLE_VIEW);
    const productCanvas = cropView(image, PRODUCT_VIEW);
    maskPromotionRed(productCanvas);
    const title = perceptualHash(titleCanvas);
    const product = perceptualHash(productCanvas);
    const histogram = colorHistogram(productCanvas);
    const edges = edgeHistogram(productCanvas);
    const quality = Number((histogram.reduce((sum, value) => sum + Number(value > 0), 0) / histogram.length).toFixed(4));
    titleCanvas.width = 1;
    titleCanvas.height = 1;
    productCanvas.width = 1;
    productCanvas.height = 1;
    return { title, product, colorHistogram: histogram, edgeHistogram: edges, quality };
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
      output[card.cardId] = { title: '', product: '', colorHistogram: [], edgeHistogram: [], quality: 0 };
    }
    onProgress?.(index + 1, cards.length);
    if ((index + 1) % 4 === 0) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  return output;
}
