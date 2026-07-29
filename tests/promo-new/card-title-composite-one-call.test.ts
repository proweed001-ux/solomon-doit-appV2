import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync('src/promo-new/import/card-title-ocr.ts', 'utf8');

test('card title OCR renders color gray and adaptive panels in one composite image', () => {
  assert.match(source, /TITLE_MODES = \['color', 'gray', 'adaptive'\]/u);
  assert.match(source, /prepareCardProductTitleComposite/u);
  assert.match(source, /variants\.forEach/u);
  assert.match(source, /PANEL_GAP/u);
});

test('each card performs exactly one Tesseract recognize call and splits results by panel', () => {
  const calls = source.match(/worker\.recognize\(/gu) || [];
  assert.equal(calls.length, 1);
  assert.match(source, /worker\.recognize\(prepared\.canvas, \{\}, \{ blocks: true \}\)/u);
  assert.match(source, /recognizedVariantTexts\(result\.data, prepared\.panelHeight\)/u);
});

test('the final title uses repeated-size consensus instead of trusting one hallucinated panel', () => {
  assert.match(source, /chooseTrustedCardHeaderText\('', attempts\)/u);
  const consensus = readFileSync('src/promo-new/import/card-header-ocr.ts', 'utf8');
  assert.match(consensus, /return \(support\.get\(size\) \|\| 0\) >= 2/u);
});
