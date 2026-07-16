import { execFile } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { groupImportedCards } from '../src/promo-new/domain/grouping';
import { createSkuCandidate } from '../src/promo-new/domain/sku-identity';
import { normalizeClassId } from '../src/promo-new/import/class-id';
import { makeCardId } from '../src/promo-new/import/card-id';
import { detectCardGrid, type Rect } from '../src/promo-new/import/grid-detector';
import type { ImportedCardCandidate } from '../src/promo-new/import/pdf-importer';

const execFileAsync = promisify(execFile);

interface PpmImage {
  width: number;
  height: number;
  rgb: Uint8Array;
}

function parsePpm(bytes: Buffer): PpmImage {
  let cursor = 0;
  const token = (): string => {
    while (cursor < bytes.length) {
      const byte = bytes[cursor];
      if (byte === 35) {
        while (cursor < bytes.length && bytes[cursor] !== 10) cursor += 1;
      } else if (byte <= 32) {
        cursor += 1;
      } else {
        break;
      }
    }
    const start = cursor;
    while (cursor < bytes.length && bytes[cursor] > 32) cursor += 1;
    return bytes.subarray(start, cursor).toString('ascii');
  };

  if (token() !== 'P6') throw new Error('ppm_binary_p6_required');
  const width = Number(token());
  const height = Number(token());
  const maximum = Number(token());
  while (cursor < bytes.length && bytes[cursor] <= 32) cursor += 1;
  if (!Number.isInteger(width) || !Number.isInteger(height) || maximum !== 255) throw new Error('ppm_header_invalid');
  const rgb = bytes.subarray(cursor);
  if (rgb.length !== width * height * 3) throw new Error(`ppm_data_invalid:${rgb.length}:${width * height * 3}`);
  return { width, height, rgb };
}

function canvasFor(image: PpmImage): HTMLCanvasElement {
  return {
    width: image.width,
    height: image.height,
    getContext: () => ({
      getImageData: (x: number, y: number, width: number, height: number) => {
        const data = new Uint8ClampedArray(width * height * 4);
        for (let row = 0; row < height; row += 1) {
          for (let column = 0; column < width; column += 1) {
            const source = ((y + row) * image.width + x + column) * 3;
            const target = (row * width + column) * 4;
            data[target] = image.rgb[source];
            data[target + 1] = image.rgb[source + 1];
            data[target + 2] = image.rgb[source + 2];
            data[target + 3] = 255;
          }
        }
        return { data };
      },
    }),
  } as unknown as HTMLCanvasElement;
}

function productZone(rect: Rect): Rect {
  return {
    x: rect.x + rect.width * 0.38,
    y: rect.y,
    width: rect.width * 0.62,
    height: rect.height * 0.43,
  };
}

function cropArgument(rect: Rect): string {
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const x = Math.max(0, Math.round(rect.x));
  const y = Math.max(0, Math.round(rect.y));
  return `${width}x${height}+${x}+${y}`;
}

function cleanOcr(value: string): string {
  return String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
}

async function recognizeCrop(
  sourcePath: string,
  outputPath: string,
  rect: Rect,
  language: 'eng' | 'tha',
  tessdataDirectory: string,
  thresholdPercent: number | null = 65,
): Promise<string> {
  const argumentsList = [
    sourcePath,
    '-crop', cropArgument(rect),
    '+repage',
    '-resize', '400%',
    '-sharpen', '0x1',
    ...(thresholdPercent === null ? [] : ['-colorspace', 'Gray', '-threshold', `${thresholdPercent}%`]),
    outputPath,
  ];
  await execFileAsync('convert', argumentsList, { maxBuffer: 2 * 1024 * 1024 });
  const { stdout } = await execFileAsync('tesseract', [
    outputPath,
    'stdout',
    '--tessdata-dir', tessdataDirectory,
    '-l', language,
    '--psm', '6',
  ], { maxBuffer: 2 * 1024 * 1024 });
  return cleanOcr(stdout);
}

async function recognizeClassCrop(sourcePath: string, outputDirectory: string, page: number, rect: Rect, tessdataDirectory: string): Promise<string> {
  const [color, thresholded] = await Promise.all([
    recognizeCrop(sourcePath, path.join(outputDirectory, `class-color-${page}.png`), rect, 'eng', tessdataDirectory, null),
    recognizeCrop(sourcePath, path.join(outputDirectory, `class-threshold-${page}.png`), rect, 'eng', tessdataDirectory, 80),
  ]);
  return cleanOcr(`${color} ${thresholded}`);
}

async function mapLimit<T, R>(values: T[], limit: number, worker: (value: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(values[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

const ppmDirectory = path.resolve(process.argv[2] || '');
const tessdataDirectory = path.resolve(process.argv[3] || '');
const monthKey = String(process.argv[4] || '').normalize('NFKC').trim().toUpperCase().replace(/[^A-Z0-9ก-๙_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const outputFile = process.argv[5] ? path.resolve(process.argv[5]) : null;
if (!process.argv[2] || !process.argv[3] || !monthKey) {
  throw new Error('usage: node --import tsx scripts/inspect-promo-real-files.ts /path/to/ppm /path/to/tessdata MONTH_KEY [output.json]');
}

const files = (await readdir(ppmDirectory)).filter(file => /\.ppm$/i.test(file)).sort();
if (!files.length) throw new Error('ppm_files_not_found');
const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'promo-real-ocr-'));

try {
  const pages = [];
  const tasks: Array<{ file: string; page: number; sequence: number; classId: string | null; classText: string; bounds: Rect; confidence: number }> = [];
  for (const [index, file] of files.entries()) {
    const page = index + 1;
    const sourcePath = path.join(ppmDirectory, file);
    const image = parsePpm(await readFile(sourcePath));
    const grid = detectCardGrid(canvasFor(image), page);
    let classText = '';
    let classId: string | null = null;
    if (grid.regions.length) {
      classText = await recognizeClassCrop(sourcePath, temporaryDirectory, page, {
        x: image.width * 0.035,
        y: image.height * 0.075,
        width: image.width * 0.42,
        height: image.height * 0.12,
      }, tessdataDirectory);
      classId = normalizeClassId(classText);
    }
    pages.push({ page, file, classId, classText, cardCount: grid.regions.length, diagnostics: grid.diagnostics });
    grid.regions.forEach((bounds, sequenceIndex) => tasks.push({
      file: sourcePath,
      page,
      sequence: sequenceIndex + 1,
      classId,
      classText,
      bounds,
      confidence: grid.diagnostics.confidence,
    }));
  }

  const cards: ImportedCardCandidate[] = await mapLimit(tasks, 4, async (task, index) => {
    const colorText = await recognizeCrop(
      task.file,
      path.join(temporaryDirectory, `product-color-${String(index + 1).padStart(3, '0')}.png`),
      productZone(task.bounds),
      'tha',
      tessdataDirectory,
      null,
    );
    let productText = colorText;
    const colorFailures = createSkuCandidate(colorText).failureReasons.length;
    if (colorFailures) {
      const thresholdText = await recognizeCrop(
        task.file,
        path.join(temporaryDirectory, `product-threshold-${String(index + 1).padStart(3, '0')}.png`),
        productZone(task.bounds),
        'tha',
        tessdataDirectory,
        65,
      );
      const thresholdFailures = createSkuCandidate(thresholdText).failureReasons.length;
      if (thresholdFailures < colorFailures || (thresholdFailures === colorFailures && thresholdText.length < colorText.length)) productText = thresholdText;
    }
    const failureReasons = [
      ...(!task.classId ? ['class_missing'] : []),
      ...(!productText ? ['product_text_missing'] : []),
    ];
    return {
      cardId: makeCardId(monthKey, task.classId, task.page, task.sequence),
      monthKey,
      page: task.page,
      sequence: task.sequence,
      classId: task.classId,
      imageUrl: '',
      rawText: productText,
      productText,
      pageClassText: task.classText,
      confidence: Number(Math.max(0, task.confidence - (!task.classId ? 0.25 : 0) - (!productText ? 0.25 : 0)).toFixed(3)),
      evidenceMethod: 'page_ocr',
      bounds: task.bounds,
      failureReasons,
    };
  });

  const grouped = groupImportedCards(monthKey, cards);
  const skuById = new Map(grouped.skus.map(sku => [sku.id, sku]));
  const cardCandidates = cards.map(card => ({ card, sku: createSkuCandidate(card.productText) }));
  const failureReasonCounts = cardCandidates.reduce<Record<string, number>>((counts, item) => {
    item.sku.failureReasons.forEach(reason => { counts[reason] = (counts[reason] || 0) + 1; });
    if (!item.card.classId) counts.class_missing = (counts.class_missing || 0) + 1;
    return counts;
  }, {});
  const result = {
    monthKey,
    pageCount: pages.length,
    pages,
    cardCount: cards.length,
    uniqueCardIds: new Set(cards.map(card => card.cardId)).size,
    skuCandidateCount: grouped.skus.length,
    acceptedCardCount: grouped.cards.length,
    quarantineCardCount: grouped.quarantineCards.length,
    productGroupCount: grouped.groups.length,
    failureReasonCounts: Object.entries(failureReasonCounts).sort(([left], [right]) => left.localeCompare(right)),
    brandCounts: Object.entries(grouped.skus.reduce<Record<string, number>>((counts, sku) => {
      const key = sku.identity.brand || 'QUARANTINE';
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {})).sort(([left], [right]) => left.localeCompare(right)),
    groups: grouped.groups.map(group => ({
      id: group.id,
      sku: skuById.get(group.skuId),
      cardCount: group.cardIds.length,
      classIds: group.classIds,
      status: group.status,
      failureReasons: group.failureReasons,
    })),
    cards: cardCandidates.map(({ card, sku }) => ({
      cardId: card.cardId,
      page: card.page,
      sequence: card.sequence,
      classId: card.classId,
      productText: card.productText,
      skuStatus: sku.status,
      skuCode: sku.code,
      identity: sku.identity,
      failureReasons: [...sku.failureReasons, ...(!card.classId ? ['class_missing'] : [])],
    })),
  };
  const json = `${JSON.stringify(result, null, 2)}\n`;
  if (outputFile) await writeFile(outputFile, json, 'utf8');
  console.log(json);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
