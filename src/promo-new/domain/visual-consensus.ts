import type { ImportedCardCandidate } from '../import/pdf-importer';

const WORK_WIDTH = 96;
const WORK_HEIGHT = 72;
const NORMALIZED_SIZE = 32;
const SAMPLE_SIZE = 16;
const IMAGE_DECODE_TIMEOUT_MS = 12_000;

interface ViewSpec {
  x: number;
  y: number;
  width: number;
  height: number;
}

const VIEWS: ViewSpec[] = [
  { x: 0.24, y: 0.12, width: 0.56, height: 0.66 },
  { x: 0.30, y: 0.20, width: 0.44, height: 0.56 },
  { x: 0.20, y: 0.24, width: 0.60, height: 0.48 },
];

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
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

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function isForeground(red: number, green: number, blue: number): boolean {
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const saturation = maximum - minimum;
  const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
  return luminance < 244 || saturation > 22;
}

function sourceView(image: HTMLImageElement, spec: ViewSpec): HTMLCanvasElement {
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
  return canvas;
}

function foregroundBounds(canvas: HTMLCanvasElement): { x: number; y: number; width: number; height: number } {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return { x: 0, y: 0, width: canvas.width, height: canvas.height };
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let minimumX = canvas.width;
  let minimumY = canvas.height;
  let maximumX = -1;
  let maximumY = -1;
  let count = 0;
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const offset = (y * canvas.width + x) * 4;
      if (!isForeground(data[offset], data[offset + 1], data[offset + 2])) continue;
      minimumX = Math.min(minimumX, x);
      minimumY = Math.min(minimumY, y);
      maximumX = Math.max(maximumX, x);
      maximumY = Math.max(maximumY, y);
      count += 1;
    }
  }
  if (count < 20 || maximumX < minimumX || maximumY < minimumY) return { x: 0, y: 0, width: canvas.width, height: canvas.height };
  const paddingX = Math.max(2, Math.round((maximumX - minimumX + 1) * 0.08));
  const paddingY = Math.max(2, Math.round((maximumY - minimumY + 1) * 0.08));
  const x = Math.max(0, minimumX - paddingX);
  const y = Math.max(0, minimumY - paddingY);
  const right = Math.min(canvas.width, maximumX + paddingX + 1);
  const bottom = Math.min(canvas.height, maximumY + paddingY + 1);
  return { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y) };
}

function normalizedProductCanvas(image: HTMLImageElement, spec: ViewSpec): HTMLCanvasElement {
  const source = sourceView(image, spec);
  const bounds = foregroundBounds(source);
  const output = document.createElement('canvas');
  output.width = NORMALIZED_SIZE;
  output.height = NORMALIZED_SIZE;
  const context = output.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, output.width, output.height);
  const scale = Math.min((output.width - 2) / bounds.width, (output.height - 2) / bounds.height);
  const width = Math.max(1, bounds.width * scale);
  const height = Math.max(1, bounds.height * scale);
  const x = (output.width - width) / 2;
  const y = (output.height - height) / 2;
  context.drawImage(source, bounds.x, bounds.y, bounds.width, bounds.height, x, y, width, height);
  source.width = 1;
  source.height = 1;
  return output;
}

function featureBytes(canvas: HTMLCanvasElement): number[] {
  const sample = document.createElement('canvas');
  sample.width = SAMPLE_SIZE;
  sample.height = SAMPLE_SIZE;
  const sampleContext = sample.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!sampleContext) return [];
  sampleContext.imageSmoothingEnabled = true;
  sampleContext.imageSmoothingQuality = 'high';
  sampleContext.fillStyle = '#ffffff';
  sampleContext.fillRect(0, 0, sample.width, sample.height);
  sampleContext.drawImage(canvas, 0, 0, sample.width, sample.height);
  const { data } = sampleContext.getImageData(0, 0, sample.width, sample.height);
  const output: number[] = [];
  const rowCounts = Array.from({ length: SAMPLE_SIZE }, () => 0);
  const columnCounts = Array.from({ length: SAMPLE_SIZE }, () => 0);
  const histogram = Array.from({ length: 64 }, () => 0);
  let foregroundCount = 0;

  for (let y = 0; y < SAMPLE_SIZE; y += 1) {
    for (let x = 0; x < SAMPLE_SIZE; x += 1) {
      const offset = (y * SAMPLE_SIZE + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const foreground = isForeground(red, green, blue);
      output.push(clampByte(255 - red));
      output.push(clampByte(255 - green));
      output.push(clampByte(255 - blue));
      output.push(foreground ? 255 : 0);
      if (!foreground) continue;
      rowCounts[y] += 1;
      columnCounts[x] += 1;
      foregroundCount += 1;
      const redBin = Math.min(3, Math.floor(red / 64));
      const greenBin = Math.min(3, Math.floor(green / 64));
      const blueBin = Math.min(3, Math.floor(blue / 64));
      histogram[redBin * 16 + greenBin * 4 + blueBin] += 1;
    }
  }

  output.push(...rowCounts.map(value => clampByte((value / SAMPLE_SIZE) * 255)));
  output.push(...columnCounts.map(value => clampByte((value / SAMPLE_SIZE) * 255)));
  output.push(...histogram.map(value => foregroundCount ? clampByte((value / foregroundCount) * 255) : 0));
  sample.width = 1;
  sample.height = 1;
  return output;
}

function encode(bytes: number[]): string {
  return bytes.map(value => clampByte(value).toString(16).padStart(2, '0')).join('');
}

export function exactCachedVisualSignatures(
  cards: ImportedCardCandidate[],
  storedCards: ImportedCardCandidate[] | undefined,
  signatures: Record<string, string> | null | undefined,
): Record<string, string> | null {
  if (!cards.length || !storedCards || storedCards.length !== cards.length || !signatures) return null;
  const storedById = new Map(storedCards.map(card => [card.cardId, card]));
  const exact: Record<string, string> = {};
  for (const card of cards) {
    const stored = storedById.get(card.cardId);
    if (!stored || stored.imageUrl !== card.imageUrl || !Object.prototype.hasOwnProperty.call(signatures, card.cardId)) return null;
    exact[card.cardId] = signatures[card.cardId];
  }
  return exact;
}

export async function cardVisualSignature(imageUrl: string): Promise<string> {
  if (!imageUrl) return '';
  const image = await loadImage(imageUrl);
  const features: number[] = [];
  try {
    for (const view of VIEWS) {
      const canvas = normalizedProductCanvas(image, view);
      try {
        features.push(...featureBytes(canvas));
      } finally {
        canvas.width = 1;
        canvas.height = 1;
      }
    }
    return encode(features);
  } finally {
    image.src = '';
  }
}

export async function buildCardVisualSignatures(
  cards: ImportedCardCandidate[],
  onProgress?: (completed: number, total: number) => void,
): Promise<Record<string, string>> {
  const signatures: Record<string, string> = {};
  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    try {
      signatures[card.cardId] = await cardVisualSignature(card.imageUrl);
    } catch {
      signatures[card.cardId] = '';
    }
    onProgress?.(index + 1, cards.length);
    if ((index + 1) % 4 === 0) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  return signatures;
}
