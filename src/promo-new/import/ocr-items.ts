export interface PositionedText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const clean = (value: unknown) => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();

export function collectOcrItems(value: unknown, output: PositionedText[] = []): PositionedText[] {
  if (Array.isArray(value)) {
    value.forEach(child => collectOcrItems(child, output));
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  const item = value as Record<string, unknown>;
  const bbox = item.bbox as { x0?: number; y0?: number; x1?: number; y1?: number } | undefined;
  const text = clean(item.text);
  if (text && bbox && Number.isFinite(bbox.x0) && Number.isFinite(bbox.y0) && Number.isFinite(bbox.x1) && Number.isFinite(bbox.y1)) {
    output.push({ text, x: Number(bbox.x0), y: Number(bbox.y0), width: Number(bbox.x1) - Number(bbox.x0), height: Number(bbox.y1) - Number(bbox.y0) });
    return output;
  }
  for (const childKey of ['blocks', 'paragraphs', 'lines', 'words']) {
    const children = item[childKey];
    if (Array.isArray(children)) children.forEach(child => collectOcrItems(child, output));
  }
  return output;
}
