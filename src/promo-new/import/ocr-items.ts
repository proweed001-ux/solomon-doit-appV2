export interface PositionedText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

type OcrNode = Record<string, unknown>;

function positioned(node: OcrNode): PositionedText | null {
  const bbox = node.bbox as { x0?: number; y0?: number; x1?: number; y1?: number } | undefined;
  const text = clean(node.text);
  if (!text || !bbox) return null;
  const x0 = Number(bbox.x0);
  const y0 = Number(bbox.y0);
  const x1 = Number(bbox.x1);
  const y1 = Number(bbox.y1);
  if (![x0, y0, x1, y1].every(Number.isFinite) || x1 <= x0 || y1 <= y0) return null;
  return { text, x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

function pushUnique(output: PositionedText[], seen: Set<string>, item: PositionedText | null): void {
  if (!item) return;
  const key = `${Math.round(item.x)}:${Math.round(item.y)}:${Math.round(item.width)}:${Math.round(item.height)}:${item.text}`;
  if (seen.has(key)) return;
  seen.add(key);
  output.push(item);
}

function collectNode(value: unknown, output: PositionedText[], seen: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach(child => collectNode(child, output, seen));
    return;
  }
  if (!value || typeof value !== 'object') return;
  const node = value as OcrNode;

  // Tesseract block text often spans several lines or even neighbouring cards.
  // Always prefer line boxes because card-field extraction depends on exact position.
  const lines = node.lines;
  if (Array.isArray(lines) && lines.length) {
    for (const line of lines) {
      if (line && typeof line === 'object') {
        const lineNode = line as OcrNode;
        const item = positioned(lineNode);
        if (item) pushUnique(output, seen, item);
        else collectNode(lineNode, output, seen);
      }
    }
    return;
  }

  const paragraphs = node.paragraphs;
  if (Array.isArray(paragraphs) && paragraphs.length) {
    paragraphs.forEach(child => collectNode(child, output, seen));
    return;
  }

  const blocks = node.blocks;
  if (Array.isArray(blocks) && blocks.length) {
    blocks.forEach(child => collectNode(child, output, seen));
    return;
  }

  // Some Tesseract builds omit line objects. Words are the safe positional fallback.
  const words = node.words;
  if (Array.isArray(words) && words.length) {
    for (const word of words) {
      if (word && typeof word === 'object') pushUnique(output, seen, positioned(word as OcrNode));
    }
    return;
  }

  pushUnique(output, seen, positioned(node));
}

export function collectOcrItems(value: unknown, output: PositionedText[] = []): PositionedText[] {
  const seen = new Set(output.map(item => `${Math.round(item.x)}:${Math.round(item.y)}:${Math.round(item.width)}:${Math.round(item.height)}:${item.text}`));
  collectNode(value, output, seen);
  return output.sort((left, right) => left.y - right.y || left.x - right.x);
}
