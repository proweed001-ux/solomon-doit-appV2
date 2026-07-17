import type { ImportedCardCandidate } from '../import/pdf-importer';

const GRID_COLUMNS = 8;
const GRID_ROWS = 6;
const TARGET_WIDTH = 160;
const TARGET_HEIGHT = 120;

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('card_image_decode_failed'));
    image.src = source;
  });
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function productCanvas(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('canvas_context_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  const sourceX = image.naturalWidth * 0.18;
  const sourceY = image.naturalHeight * 0.12;
  const sourceWidth = image.naturalWidth * 0.58;
  const sourceHeight = image.naturalHeight * 0.74;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function featureBytes(canvas: HTMLCanvasElement): number[] {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const output: number[] = [];
  const cellWidth = canvas.width / GRID_COLUMNS;
  const cellHeight = canvas.height / GRID_ROWS;
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let column = 0; column < GRID_COLUMNS; column += 1) {
      const startX = Math.floor(column * cellWidth);
      const endX = Math.ceil((column + 1) * cellWidth);
      const startY = Math.floor(row * cellHeight);
      const endY = Math.ceil((row + 1) * cellHeight);
      let foreground = 0;
      let red = 0;
      let green = 0;
      let blue = 0;
      let total = 0;
      for (let y = startY; y < endY; y += 2) {
        for (let x = startX; x < endX; x += 2) {
          const offset = (y * canvas.width + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const maximum = Math.max(r, g, b);
          const minimum = Math.min(r, g, b);
          const saturation = maximum - minimum;
          const luminance = r * 0.299 + g * 0.587 + b * 0.114;
          const isForeground = luminance < 232 || saturation > 34;
          total += 1;
          if (isForeground) {
            foreground += 1;
            red += r;
            green += g;
            blue += b;
          }
        }
      }
      output.push(clampByte(foreground / Math.max(1, total) * 255));
      output.push(clampByte(red / Math.max(1, foreground)));
      output.push(clampByte(green / Math.max(1, foreground)));
      output.push(clampByte(blue / Math.max(1, foreground)));
    }
  }
  return output;
}

function encode(bytes: number[]): string {
  return bytes.map(value => clampByte(value).toString(16).padStart(2, '0')).join('');
}

export async function cardVisualSignature(imageUrl: string): Promise<string> {
  if (!imageUrl) return '';
  const image = await loadImage(imageUrl);
  const canvas = productCanvas(image);
  try {
    return encode(featureBytes(canvas));
  } finally {
    canvas.width = 1;
    canvas.height = 1;
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
    if ((index + 1) % 8 === 0) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  return signatures;
}
