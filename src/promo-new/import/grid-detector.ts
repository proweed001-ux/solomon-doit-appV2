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
  outerCandidateCount?: number;
  anchorValidatedCards?: number;
  referenceAnchorCount?: number;
  promotionAnchorCount?: number;
}

export interface GridResult {
  regions: Rect[];
  diagnostics: GridDiagnostics;
}

interface PixelComponent {
  rect: Rect;
  pixels: number;
}

interface PageMasks {
  image: Uint8ClampedArray;
  white: Uint8Array;
  referenceYellow: Uint8Array;
  promotionRed: Uint8Array;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

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

function componentFill(component: PixelComponent): number {
  return component.pixels / Math.max(1, component.rect.width * component.rect.height);
}

function buildPageMasks(canvas: HTMLCanvasElement): PageMasks {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return {
    image: new Uint8ClampedArray(),
    white: new Uint8Array(),
    referenceYellow: new Uint8Array(),
    promotionRed: new Uint8Array(),
  };
  const image = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const size = canvas.width * canvas.height;
  const white = new Uint8Array(size);
  const referenceYellow = new Uint8Array(size);
  const promotionRed = new Uint8Array(size);
  const contentTop = Math.floor(canvas.height * 0.19);

  for (let index = 0; index < size; index += 1) {
    const offset = index * 4;
    const red = image[offset];
    const green = image[offset + 1];
    const blue = image[offset + 2];
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const difference = maximum - minimum;
    const y = Math.floor(index / canvas.width);

    if (y >= contentTop && maximum > 185 && minimum > 150 && difference < 80) white[index] = 1;
    if (red > 170 && green > 125 && blue < 135 && red - blue > 55 && green - blue > 35) referenceYellow[index] = 1;
    if (red > 150 && red - green > 35 && red - blue > 35) promotionRed[index] = 1;
  }
  return { image, white, referenceYellow, promotionRed };
}

function connectedComponents(mask: Uint8Array, width: number, height: number): PixelComponent[] {
  if (width < 1 || height < 1 || mask.length !== width * height) return [];
  const seen = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const output: PixelComponent[] = [];

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || seen[start]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    seen[start] = 1;
    let pixels = 0;
    let minimumX = start % width;
    let maximumX = minimumX;
    let minimumY = Math.floor(start / width);
    let maximumY = minimumY;

    while (head < tail) {
      const current = queue[head++];
      const x = current % width;
      const y = Math.floor(current / width);
      pixels += 1;
      minimumX = Math.min(minimumX, x);
      maximumX = Math.max(maximumX, x);
      minimumY = Math.min(minimumY, y);
      maximumY = Math.max(maximumY, y);

      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nextX = x + dx;
          const nextY = y + dy;
          if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
          const next = nextY * width + nextX;
          if (!mask[next] || seen[next]) continue;
          seen[next] = 1;
          queue[tail++] = next;
        }
      }
    }

    output.push({
      rect: { x: minimumX, y: minimumY, width: maximumX - minimumX + 1, height: maximumY - minimumY + 1 },
      pixels,
    });
  }
  return output;
}

/**
 * Finds the complete white interior of each promotion card. The class-coloured
 * outer border isolates every white panel, so full-resolution connected
 * components preserve the complete card geometry without reading any text.
 */
export function detectCardRegionsFromWhiteMask(mask: Uint8Array, width: number, height: number): Rect[] {
  return connectedComponents(mask, width, height)
    .filter(component => {
      const region = component.rect;
      const aspect = region.width / Math.max(1, region.height);
      return region.y >= height * 0.18
        && region.width >= width * 0.12
        && region.width <= width * 0.35
        && region.height >= height * 0.12
        && region.height <= height * 0.35
        && aspect >= 1
        && aspect <= 2.1
        && componentFill(component) >= 0.5;
    })
    .map(component => component.rect)
    .sort((left, right) => left.y - right.y || left.x - right.x);
}

export function groupIntoRows(regions: Rect[]): Rect[][] {
  if (!regions.length) return [];
  const tolerance = Math.max(10, median(regions.map(region => region.height)) * 0.22);
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

function componentCenteredInside(component: PixelComponent, region: Rect): boolean {
  const centerX = component.rect.x + component.rect.width / 2;
  const centerY = component.rect.y + component.rect.height / 2;
  return centerX >= region.x && centerX <= region.x + region.width && centerY >= region.y && centerY <= region.y + region.height;
}

function relativeRect(component: PixelComponent, region: Rect): Rect {
  return {
    x: (component.rect.x - region.x) / Math.max(1, region.width),
    y: (component.rect.y - region.y) / Math.max(1, region.height),
    width: component.rect.width / Math.max(1, region.width),
    height: component.rect.height / Math.max(1, region.height),
  };
}

function referenceAnchorCandidates(components: PixelComponent[], region: Rect): PixelComponent[] {
  return components.filter(component => {
    if (!componentCenteredInside(component, region) || componentFill(component) < 0.5) return false;
    const relative = relativeRect(component, region);
    return relative.x < 0.25
      && relative.y > 0.55
      && relative.width > 0.08
      && relative.width < 0.28
      && relative.height > 0.08
      && relative.height < 0.30;
  });
}

function promotionAnchorCandidates(components: PixelComponent[], region: Rect): PixelComponent[] {
  return components.filter(component => {
    if (!componentCenteredInside(component, region) || componentFill(component) < 0.5) return false;
    const relative = relativeRect(component, region);
    return relative.x > 0.48
      && relative.y > 0.42
      && relative.width > 0.18
      && relative.width < 0.48
      && relative.height > 0.18
      && relative.height < 0.48;
  });
}

function borderStripEvidence(image: Uint8ClampedArray, pageWidth: number, pageHeight: number, region: Rect): number {
  if (!image.length) return 0;
  const stripX = Math.max(2, Math.round(region.width * 0.014));
  const stripY = Math.max(2, Math.round(region.height * 0.022));
  const expanded = clipRect({
    x: region.x - stripX,
    y: region.y - stripY,
    width: region.width + stripX * 2,
    height: region.height + stripY * 2,
  }, pageWidth, pageHeight);
  let evidence = 0;
  let sampled = 0;
  const sample = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= pageWidth || y >= pageHeight) return;
    const offset = (y * pageWidth + x) * 4;
    const red = image[offset];
    const green = image[offset + 1];
    const blue = image[offset + 2];
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    if (maximum - minimum > 30 || maximum < 155) evidence += 1;
    sampled += 1;
  };
  const horizontalStep = Math.max(1, Math.round(region.width / 100));
  const verticalStep = Math.max(1, Math.round(region.height / 60));
  for (let x = expanded.x; x < expanded.x + expanded.width; x += horizontalStep) {
    sample(x, expanded.y);
    sample(x, expanded.y + expanded.height - 1);
  }
  for (let y = expanded.y; y < expanded.y + expanded.height; y += verticalStep) {
    sample(expanded.x, y);
    sample(expanded.x + expanded.width - 1, y);
  }
  return evidence / Math.max(1, sampled);
}

function expandToOuterBorders(regions: Rect[], width: number, height: number): Rect[] {
  const paddingX = Math.max(2, Math.round(median(regions.map(region => region.width)) * 0.018));
  const paddingY = Math.max(2, Math.round(median(regions.map(region => region.height)) * 0.025));
  return regions.map(region => clipRect({
    x: region.x - paddingX,
    y: region.y - paddingY,
    width: region.width + paddingX * 2,
    height: region.height + paddingY * 2,
  }, width, height));
}

export function evaluateGrid(regions: Rect[], page: number, pageWidth: number, pageHeight: number): GridResult {
  const rows = groupIntoRows(regions);
  const rowCounts = rows.map(row => row.length);
  const detectedColumns = rowCounts.length ? Math.max(...rowCounts) : 0;
  const reasons: string[] = [];
  if (!regions.length) reasons.push('card_grid_not_found');
  if (detectedColumns > 0 && detectedColumns < 2) reasons.push('too_few_columns');
  if (detectedColumns > 10) reasons.push('too_many_columns');
  if (regions.some(region => region.width / Math.max(1, region.height) < 1 || region.width / Math.max(1, region.height) > 2.1)) reasons.push('card_aspect_outlier');

  const widthMedian = median(regions.map(region => region.width));
  const heightMedian = median(regions.map(region => region.height));
  const outliers = regions.filter(region => (
    region.width < widthMedian * 0.72 || region.width > widthMedian * 1.28
    || region.height < heightMedian * 0.82 || region.height > heightMedian * 1.18
  )).length;
  if (outliers) reasons.push('card_size_outlier');

  for (const row of rows) {
    const rowY = median(row.map(region => region.y));
    const rowHeight = median(row.map(region => region.height));
    if (row.some(region => Math.abs(region.y - rowY) > Math.max(4, rowHeight * 0.06))) reasons.push('row_alignment_outlier');
  }
  for (let left = 0; left < regions.length; left += 1) {
    for (let right = left + 1; right < regions.length; right += 1) {
      const smaller = Math.min(regions[left].width * regions[left].height, regions[right].width * regions[right].height);
      if (intersection(regions[left], regions[right]) / Math.max(1, smaller) > 0.02) reasons.push('card_overlap');
    }
  }

  const uniqueReasons = [...new Set(reasons)];
  const confidence = Math.max(0, Math.min(1, 0.99 - uniqueReasons.length * 0.18 - outliers * 0.03));
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
      status: uniqueReasons.length ? 'need_review' : 'ok',
      reasons: uniqueReasons,
    },
  };
}

export function detectCardGrid(canvas: HTMLCanvasElement, page: number): GridResult {
  const masks = buildPageMasks(canvas);
  const interiorRegions = detectCardRegionsFromWhiteMask(masks.white, canvas.width, canvas.height);
  const base = evaluateGrid(interiorRegions, page, canvas.width, canvas.height);
  const referenceComponents = connectedComponents(masks.referenceYellow, canvas.width, canvas.height);
  const promotionComponents = connectedComponents(masks.promotionRed, canvas.width, canvas.height);
  const structuralReasons = [...base.diagnostics.reasons];
  let anchorValidatedCards = 0;
  let referenceAnchorCount = 0;
  let promotionAnchorCount = 0;

  interiorRegions.forEach((region, index) => {
    const references = referenceAnchorCandidates(referenceComponents, region);
    const promotions = promotionAnchorCandidates(promotionComponents, region);
    referenceAnchorCount += references.length;
    promotionAnchorCount += promotions.length;
    const outerEvidence = borderStripEvidence(masks.image, canvas.width, canvas.height, region);
    if (references.length !== 1 || promotions.length !== 1) {
      structuralReasons.push(`grid_anchor_set_invalid:${index + 1}:reference=${references.length}:promotion=${promotions.length}`);
      return;
    }
    if (outerEvidence < 0.45) {
      structuralReasons.push(`grid_outer_border_missing:${index + 1}`);
      return;
    }
    anchorValidatedCards += 1;
  });

  if (anchorValidatedCards !== interiorRegions.length) structuralReasons.push('grid_anchor_validation_incomplete');
  const reasons = [...new Set(structuralReasons)];
  const outerRegions = expandToOuterBorders(base.regions, canvas.width, canvas.height);
  return {
    regions: outerRegions,
    diagnostics: {
      ...base.diagnostics,
      confidence: reasons.length ? Math.min(base.diagnostics.confidence, 0.25) : base.diagnostics.confidence,
      status: reasons.length ? 'need_review' : 'ok',
      reasons,
      outerCandidateCount: interiorRegions.length,
      anchorValidatedCards,
      referenceAnchorCount,
      promotionAnchorCount,
    },
  };
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
