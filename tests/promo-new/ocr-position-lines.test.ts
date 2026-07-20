import assert from 'node:assert/strict';
import test from 'node:test';
import { collectOcrItems } from '../../src/promo-new/import/ocr-items';

const bbox = (x0: number, y0: number, x1: number, y1: number) => ({ x0, y0, x1, y1 });
const clean = (value: string) => value.normalize('NFKC').replace(/\s+/g, ' ').trim();

test('OCR collection prefers exact line boxes over a broad block spanning card fields', () => {
  const items = collectOcrItems([{
    text: 'ราคาแนะนำขายปลีก 25 บาท/ขวด H&S แชมพู ทุกสูตร ขนาด 65 มล.',
    bbox: bbox(10, 10, 490, 180),
    paragraphs: [{
      lines: [
        { text: 'ราคาแนะนำขายปลีก 25 บาท/ขวด', bbox: bbox(15, 18, 205, 42) },
        { text: 'เฮดแอนด์โชว์เดอร์ แชมพู', bbox: bbox(285, 18, 480, 45) },
        { text: 'ทุกสูตร ขนาด 65 มล.', bbox: bbox(330, 48, 480, 72) },
      ],
    }],
  }]);

  assert.deepEqual(items.map(item => item.text), [
    clean('ราคาแนะนำขายปลีก 25 บาท/ขวด'),
    clean('เฮดแอนด์โชว์เดอร์ แชมพู'),
    clean('ทุกสูตร ขนาด 65 มล.'),
  ]);
  assert.equal(items.some(item => item.text.includes('บาท/ขวด H&S')), false);
  assert.deepEqual(items[1], {
    text: clean('เฮดแอนด์โชว์เดอร์ แชมพู'),
    x: 285,
    y: 18,
    width: 195,
    height: 27,
  });
});

test('top-right product zone receives name and size lines but excludes left price line', () => {
  const card = { x: 0, y: 0, width: 500, height: 250 };
  const productZone = {
    x: card.x + card.width * 0.38,
    y: card.y,
    width: card.width * 0.62,
    height: card.height * 0.43,
  };
  const items = collectOcrItems([{
    paragraphs: [{
      lines: [
        { text: 'ราคาแนะนำขายปลีก 25 บาท/ขวด', bbox: bbox(15, 18, 205, 42) },
        { text: 'เฮดแอนด์โชว์เดอร์ แชมพู', bbox: bbox(285, 18, 480, 45) },
        { text: 'ทุกสูตร ขนาด 65 มล.', bbox: bbox(330, 48, 480, 72) },
        { text: '2 ขวด ลด 8%', bbox: bbox(320, 175, 480, 225) },
      ],
    }],
  }]);
  const inside = items.filter(item => {
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    return centerX >= productZone.x && centerX <= productZone.x + productZone.width
      && centerY >= productZone.y && centerY <= productZone.y + productZone.height;
  });

  assert.deepEqual(inside.map(item => item.text), [
    clean('เฮดแอนด์โชว์เดอร์ แชมพู'),
    clean('ทุกสูตร ขนาด 65 มล.'),
  ]);
});

test('word boxes are used only when a Tesseract line box is unavailable', () => {
  const items = collectOcrItems({
    words: [
      { text: 'H&S', bbox: bbox(300, 20, 340, 40) },
      { text: 'แชมพู', bbox: bbox(345, 20, 410, 40) },
    ],
  });
  assert.deepEqual(items.map(item => item.text), ['H&S', clean('แชมพู')]);
});

test('duplicate nested OCR lines are emitted once and remain reading-order sorted', () => {
  const repeated = { text: 'ขนาด 140 มล.', bbox: bbox(320, 60, 470, 85) };
  const items = collectOcrItems([
    { lines: [repeated] },
    { lines: [repeated, { text: 'PANTENE แชมพู', bbox: bbox(300, 20, 470, 45) }] },
  ]);
  assert.deepEqual(items.map(item => item.text), [clean('PANTENE แชมพู'), clean('ขนาด 140 มล.')]);
});
