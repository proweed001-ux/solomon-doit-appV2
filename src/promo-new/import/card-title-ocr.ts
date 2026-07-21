import { PSM, type Worker } from 'tesseract.js';
import { cropCanvas, type Rect } from './grid-detector';

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

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

export function prepareCardProductTitleCanvas(pageCanvas: HTMLCanvasElement, bounds: Rect): HTMLCanvasElement {
  const header = cropCanvas(pageCanvas, cardProductTitleZone(bounds));
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
  adaptiveThreshold(output);
  header.width = 1;
  header.height = 1;
  return output;
}

export async function configureCardTitleOcr(worker: Worker): Promise<void> {
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
    preserve_interword_spaces: '1',
  });
}

export async function recognizeCardProductTitle(worker: Worker, pageCanvas: HTMLCanvasElement, bounds: Rect): Promise<string> {
  const prepared = prepareCardProductTitleCanvas(pageCanvas, bounds);
  try {
    const result = await worker.recognize(prepared);
    return clean(result.data.text);
  } finally {
    prepared.width = 1;
    prepared.height = 1;
  }
}
