import type { ImportedCardCandidate } from '../import/pdf-importer';

const TARGET_WIDTH = 32;
const TARGET_HEIGHT = 24;

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

  // Cards place the product pack in the centre-right area. This crop removes most
  // recommended-price text on the left and the red promotion mechanic at bottom-right.
  const sourceX = image.naturalWidth * 0.28;
  const sourceY = image.naturalHeight * 0.15;
  const sourceWidth = image.naturalWidth * 0.54;
  const sourceHeight = image.naturalHeight * 0.60;
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
  for (let offset = 0; offset < data.length; offset += 4) {
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const saturation = maximum - minimum;
    const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
    const foreground = luminance < 238 || saturation > 26;

    // Store distance from white rather than raw RGB. White card background therefore
    // contributes zero and the fingerprint concentrates on pack shape, colour and labels.
    output.push(clampByte(255 - red));
    output.push(clampByte(255 - green));
    output.push(clampByte(255 - blue));
    output.push(foreground ? 255 : 0);
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
