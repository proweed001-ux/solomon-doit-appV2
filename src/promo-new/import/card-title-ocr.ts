import { PSM, type Worker } from 'tesseract.js';
import { cropCanvas, type Rect } from './grid-detector';

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

/** Tight native-resolution top-right title region measured from the real JUL26 card layout. */
export function cardProductTitleZone(bounds: Rect): Rect {
  return {
    x: bounds.x + bounds.width * 0.44,
    y: bounds.y,
    width: bounds.width * 0.555,
    height: bounds.height * 0.36,
  };
}

/** One clean crop only. No whole-page OCR and no three-panel retry composite. */
export function prepareCardProductTitleCanvas(pageCanvas: HTMLCanvasElement, bounds: Rect): HTMLCanvasElement {
  return cropCanvas(pageCanvas, cardProductTitleZone(bounds));
}

export async function configureCardTitleOcr(worker: Worker): Promise<void> {
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT as PSM,
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
