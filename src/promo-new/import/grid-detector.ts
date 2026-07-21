export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridDiagnostics {
  page: number;
  pageWidth: number;
  pageHeight: number;
  detectedColumns: number;
  detectedRows: number;
  rowCounts: number[];
  confidence: number;
  status: 'ok' | 'need_review';
  reasons: string[];
}

export interface GridResult {
  regions: Rect[];
  diagnostics: GridDiagnostics;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const saturation = (red: number, green: number, blue: number) => Math.max(red, green, blue) - Math.min(red, green, blue);

export function clipRect(rect: Rect, width: number, height: number): Rect {
  const x = clamp(Math.round(rect.x), 0, Math.max(0, width - 1));
  const y = clamp(Math.round(rect.y), 0, Math.max(0, height - 1));
  const right = clamp(Math.round(rect.x + rect.width), x + 1, width);
  const bottom = clamp(Math.round(rect.y + rect.height), y + 1, height);
  return { x, y, width: right - x, height: bottom - y };
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function intersection(left: Rect, right: Rect): number {
  const x1 = Math.max(left.x, right.x);
  const y1 = Math.max(left.y, right.y);
  const x2 = Math.min(left.x + left.width, right.x + right.width);
  const y2 = Math.min(left.y + left.height, right.y + right.height);
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

function removeNested(regions: Rect[]): Rect[] {
  const kept: Rect[] = [];
  for (const region of [...regions].sort((a, b) => b.width * b.height - a.width * a.height)) {
    const area = region.width * region.height;
    const nested = kept.some(container => intersection(region, container) / Math.max(1, area) > 0.84);
    if (!nested) kept.push(region);
  }
  return kept.sort((a, b) => a.y - b.y || a.x - b.x);
}

function smooth(values: number[], radius: number): number[] {
  const prefix = [0];
  for (const value of values) prefix.push(prefix[prefix.length - 1] + value);
  return values.map((_, index) => {
    const left = Math.max(0, index - radius);
    const right = Math.min(values.length, index + radius + 1);
    return (prefix[right] - prefix[left]) / Math.max(1, right - left);
  });
}

function runsAbove(values: number[], threshold: number, minimumLength: number, start = 0, end = values.length): Array<[number, number]> {
  const output: Array<[number, number]> = [];
  let cursor = Math.max(0, start);
  const limit = Math.min(values.length, end);
  while (cursor < limit) {
    if (values[cursor] < threshold) {
      cursor += 1;
      continue;
    }
    const first = cursor;
    while (cursor < limit && values[cursor] >= threshold) cursor += 1;
    if (cursor - first >= minimumLength) output.push([first, cursor]);
  }
  return output;
}

function nearWhiteMask(canvas: HTMLCanvasElement): Uint8Array {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return new Uint8Array();
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const mask = new Uint8Array(canvas.width * canvas.height);
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (red > 202 && green > 202 && blue > 190 && saturation(red, green, blue) < 58) mask[index] = 1;
  }
  return mask;
}

/**
 * Detect complete card rectangles from horizontal and vertical white-density runs.
 * Promotion cards contain disconnected text, bottles and price blocks, so connected
 * components can shrink or drift into the card content. Density runs retain the full
 * white card panel and therefore preserve the product name on the right edge.
 */
export function detectCardRegionsFromWhiteMask(mask: Uint8Array, width: number, height: number): Rect[] {
  if (width < 1 || height < 1 || mask.length !== width * height) return [];
  const rowCounts = Array.from({ length: height }, () => 0);
  for (let y = 0; y < height; y += 1) {
    const offset = y * width;
    let count = 0;
    for (let x = 0; x < width; x += 1) count += mask[offset + x];
    rowCounts[y] = count / width;
  }
  const rowDensity = smooth(rowCounts, 2);
  const rowRuns = runsAbove(rowDensity, 0.105, 5, Math.floor(height * 0.18), Math.ceil(height * 0.985));
  const regions: Rect[] = [];

  for (const [rowStart, rowEnd] of rowRuns) {
    const y = Math.max(0, rowStart - 8);
    const bottom = Math.min(height, rowEnd + 8);
    const rowHeight = bottom - y;
    if (rowHeight < height * 0.10 || rowHeight > height * 0.34) continue;
    const columnDensity = Array.from({ length: width }, () => 0);
    for (let x = 0; x < width; x += 1) {
      let count = 0;
      for (let py = y; py < bottom; py += 1) count += mask[py * width + x];
      columnDensity[x] = count / rowHeight;
    }
    const columnRuns = runsAbove(smooth(columnDensity, 1), 0.11, 8);
    for (const [columnStart, columnEnd] of columnRuns) {
      const x = Math.max(0, columnStart - 10);
      const right = Math.min(width, columnEnd + 10);
      const cardWidth = right - x;
      if (cardWidth < width * 0.12 || cardWidth > width * 0.30) continue;
      const center = x + cardWidth / 2;
      if (center < width * 0.04 || center > width * 0.96) continue;
      regions.push(clipRect({ x, y, width: cardWidth, height: rowHeight }, width, height));
    }
  }

  return removeNested(regions);
}

function connectedWhiteComponents(canvas: HTMLCanvasElement): Rect[] {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];
  const top = Math.round(canvas.height * 0.11);
  const height = canvas.height - top;
  const data = context.getImageData(0, top, canvas.width, height).data;
  const step = Math.max(3, Math.round(canvas.width / 430));
  const sampleWidth = Math.ceil(canvas.width / step);
  const sampleHeight = Math.ceil(height / step);
  const mask = new Uint8Array(sampleWidth * sampleHeight);
  const seen = new Uint8Array(mask.length);
  for (let sy = 0; sy < sampleHeight; sy += 1) {
    for (let sx = 0; sx < sampleWidth; sx += 1) {
      const x = Math.min(canvas.width - 1, sx * step);
      const y = Math.min(height - 1, sy * step);
      const offset = (y * canvas.width + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      if (red > 202 && green > 202 && blue > 190 && saturation(red, green, blue) < 58) mask[sy * sampleWidth + sx] = 1;
    }
  }

  const output: Rect[] = [];
  const minimumSamples = Math.max(35, Math.round(mask.length * 0.0022));
  for (let sy = 0; sy < sampleHeight; sy += 1) {
    for (let sx = 0; sx < sampleWidth; sx += 1) {
      const start = sy * sampleWidth + sx;
      if (!mask[start] || seen[start]) continue;
      const queue: number[] = [start];
      seen[start] = 1;
      let cursor = 0;
      let count = 0;
      let minX = sx;
      let maxX = sx;
      let minY = sy;
      let maxY = sy;
      while (cursor < queue.length) {
        const current = queue[cursor++];
        const x = current % sampleWidth;
        const y = Math.floor(current / sampleWidth);
        count += 1;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= sampleWidth || ny >= sampleHeight) continue;
          const next = ny * sampleWidth + nx;
          if (mask[next] && !seen[next]) {
            seen[next] = 1;
            queue.push(next);
          }
        }
      }
      if (count < minimumSamples) continue;
      output.push(clipRect({
        x: minX * step,
        y: top + minY * step,
        width: (maxX - minX + 1) * step,
        height: (maxY - minY + 1) * step,
      }, canvas.width, canvas.height));
    }
  }
  return removeNested(output).filter(region => (
    region.width >= canvas.width * 0.075
    && region.width <= canvas.width * 0.34
    && region.height >= canvas.height * 0.065
    && region.height <= canvas.height * 0.34
  ));
}

export function groupIntoRows(regions: Rect[]): Rect[][] {
  if (!regions.length) return [];
  const tolerance = Math.max(14, median(regions.map(region => region.height)) * 0.34);
  const rows: Array<{ center: number; items: Rect[] }> = [];
  for (const region of [...regions].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const center = region.y + region.height / 2;
    let row = rows.find(candidate => Math.abs(candidate.center - center) <= tolerance);
    if (!row) {
      row = { center, items: [] };
      rows.push(row);
    }
    row.items.push(region);
    row.center = row.items.reduce((sum, item) => sum + item.y + item.height / 2, 0) / row.items.length;
  }
  return rows.sort((a, b) => a.center - b.center).map(row => row.items.sort((a, b) => a.x - b.x));
}

export function evaluateGrid(regions: Rect[], page: number, pageWidth: number, pageHeight: number): GridResult {
  const rows = groupIntoRows(regions);
  const rowCounts = rows.map(row => row.length);
  const detectedColumns = rowCounts.length ? Math.max(...rowCounts) : 0;
  const reasons: string[] = [];
  if (!regions.length) reasons.push('card_grid_not_found');
  if (detectedColumns > 0 && detectedColumns < 2) reasons.push('too_few_columns');
  if (detectedColumns > 10) reasons.push('too_many_columns');
  if (regions.some(region => region.width / Math.max(1, region.height) < 0.45 || region.width / Math.max(1, region.height) > 2.2)) reasons.push('card_aspect_outlier');
  const widthMedian = median(regions.map(region => region.width));
  const heightMedian = median(regions.map(region => region.height));
  const outliers = regions.filter(region => (
    region.width < widthMedian * 0.62 || region.width > widthMedian * 1.38
    || region.height < heightMedian * 0.62 || region.height > heightMedian * 1.38
  )).length;
  if (outliers) reasons.push('card_size_outlier');
  const confidence = Math.max(0, Math.min(1, 0.98 - reasons.length * 0.18 - outliers * 0.04));
  return {
    regions: rows.flat(),
    diagnostics: {
      page,
      pageWidth,
      pageHeight,
      detectedColumns,
      detectedRows: rows.length,
      rowCounts,
      confidence: Number(confidence.toFixed(3)),
      status: reasons.length ? 'need_review' : 'ok',
      reasons: [...new Set(reasons)],
    },
  };
}

export function detectCardGrid(canvas: HTMLCanvasElement, page: number): GridResult {
  const density = evaluateGrid(detectCardRegionsFromWhiteMask(nearWhiteMask(canvas), canvas.width, canvas.height), page, canvas.width, canvas.height);
  if (density.regions.length >= 2 && density.diagnostics.detectedColumns >= 2 && density.diagnostics.detectedColumns <= 10) return density;
  return evaluateGrid(connectedWhiteComponents(canvas), page, canvas.width, canvas.height);
}

export function cropCanvas(canvas: HTMLCanvasElement, rect: Rect, padding = 0): HTMLCanvasElement {
  const bounds = clipRect({
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }, canvas.width, canvas.height);
  const output = document.createElement('canvas');
  output.width = bounds.width;
  output.height = bounds.height;
  const context = output.getContext('2d');
  if (!context) throw new Error('canvas_context_unavailable');
  context.drawImage(canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
  return output;
}
