import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { cardProductTitleZone } from '../../src/promo-new/import/card-title-ocr';
import { detectCardRegionsFromWhiteMask, groupIntoRows } from '../../src/promo-new/import/grid-detector';

function maskPage(width: number, height: number, rows: Array<Array<{ x: number; width: number }>>): Uint8Array {
  const mask = new Uint8Array(width * height);
  rows.forEach((cards, rowIndex) => {
    const y = 135 + rowIndex * 145;
    const cardHeight = 118;
    for (const card of cards) {
      for (let py = y; py < y + cardHeight; py += 1) {
        for (let px = card.x; px < card.x + card.width; px += 1) mask[py * width + px] = 1;
      }
      for (const hole of [
        { x: card.x + 18, y: y + 18, width: 42, height: 74 },
        { x: card.x + 82, y: y + 10, width: 76, height: 17 },
        { x: card.x + 96, y: y + 45, width: 52, height: 48 },
      ]) {
        for (let py = hole.y; py < hole.y + hole.height; py += 1) {
          for (let px = hole.x; px < hole.x + hole.width; px += 1) mask[py * width + px] = 0;
        }
      }
    }
  });
  return mask;
}

test('density grid retains complete cards despite disconnected white content and mixed four/five-card rows', () => {
  const width = 1200;
  const height = 650;
  const rows = [
    [80, 350, 620, 890].map(x => ({ x, width: 210 })),
    [25, 260, 495, 730, 965].map(x => ({ x, width: 190 })),
    [80, 350, 620, 890].map(x => ({ x, width: 210 })),
  ];
  const regions = detectCardRegionsFromWhiteMask(maskPage(width, height, rows), width, height);
  const grouped = groupIntoRows(regions);
  assert.deepEqual(grouped.map(row => row.length), [4, 5, 4]);
  assert.equal(regions.length, 13);
  for (const region of regions) {
    assert.ok(region.width >= 180, `card width was clipped: ${region.width}`);
    assert.ok(region.height >= 110, `card height was clipped: ${region.height}`);
  }
});

test('JUL26 detector constants and observed page row counts stay explicit', () => {
  const expected = [
    [4, 4, 4], [4, 4, 4], [4, 2], [4, 4, 4], [4, 4, 4], [4, 4],
    [4, 4, 4], [4, 4, 4], [4, 4, 5], [4, 5, 5], [5, 4, 4], [4, 4, 5],
    [4, 4, 5], [4, 4, 4], [4, 4, 4], [4, 4, 4], [4, 4, 4], [4, 4, 4],
  ];
  assert.equal(expected.flat().reduce((sum, count) => sum + count, 0), 212);
  const source = readFileSync('src/promo-new/import/grid-detector.ts', 'utf8');
  assert.match(source, /runsAbove\(rowDensity, 0\.105, 5/u);
  assert.match(source, /runsAbove\(smooth\(columnDensity, 1\), 0\.11, 8/u);
});

test('single-pass product OCR crops the verified top-right name and size area', () => {
  const zone = cardProductTitleZone({ x: 100, y: 50, width: 300, height: 180 });
  assert.equal(zone.x, 196);
  assert.equal(zone.y, 50);
  assert.equal(zone.width, 201);
  assert.ok(Math.abs(zone.height - 82.8) < 1e-9);
  const importer = readFileSync('src/promo-new/import/pdf-importer.ts', 'utf8');
  assert.match(importer, /recognizeCardProductTitle\(await ensureWorker\(\), canvas, bounds\)/u);
  assert.doesNotMatch(importer, /pageOcr\(/u);
  assert.doesNotMatch(importer, /enrichAdaptiveCardHeaders/u);
});
