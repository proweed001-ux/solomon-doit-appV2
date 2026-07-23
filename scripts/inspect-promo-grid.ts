import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { detectCardGrid } from '../src/promo-new/import/grid-detector';

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

const directory = path.resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('usage: npm run inspect:promo-grid -- /path/to/ppm-directory');
const includeRegions = process.argv.includes('--regions');

const files = (await readdir(directory)).filter(file => /\.ppm$/i.test(file)).sort();
if (!files.length) throw new Error('ppm_files_not_found');

const pages = [];
for (const [index, file] of files.entries()) {
  const image = parsePpm(await readFile(path.join(directory, file)));
  const result = detectCardGrid(canvasFor(image), index + 1);
  pages.push({ file, cards: result.regions.length, ...(includeRegions ? { regions: result.regions } : {}), ...result.diagnostics });
}

console.log(JSON.stringify({ pages, totalCards: pages.reduce((sum, page) => sum + page.cards, 0) }, null, 2));
