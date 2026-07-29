import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chooseBestCardHeaderText,
  scoreCardHeaderText,
  shouldRefreshCardHeader,
} from '../../src/promo-new/import/card-header-ocr';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

function card(productText: string): ImportedCardCandidate {
  return {
    cardId: 'CARD-PROMO-2026-07-HFSS-P001-C001',
    monthKey: 'PROMO-2026-07',
    page: 1,
    sequence: 1,
    classId: 'HFSS',
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: productText,
    productText,
    pageClassText: 'HFSS',
    confidence: 0.9,
    evidenceMethod: 'page_ocr',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

test('หัวขวาบนที่มีแบรนด์ ชนิด และขนาดต้องชนะข้อความ OCR เพี้ยนใต้ภาพ', () => {
  const broken = 'ขนาดใหญ่ ๑ แพ็ค 1 แถม 1 รูฉน 77';
  const clear = 'ดาวน์นี่ ปรับผ้านุ่ม ถุงเติมขนาดใหญ่ แพ็ค 1 แถม 1 ทุกสูตร';
  assert.ok(scoreCardHeaderText(clear) > scoreCardHeaderText(broken));
  assert.match(chooseBestCardHeaderText(broken, clear), /DOWNY|ดาวน์นี่/u);
});

test('H&S หัวขวาบนที่มีขนาด 65 มล. ต้องชนะข้อความที่ขาดหน่วย', () => {
  const broken = 'แอนส์โชว์เตอร์ แหมพู งรี ๑ ทุกสูตร ขนาด 65';
  const clear = 'เฮดแอนด์โชว์เดอร์ แชมพู ทุกสูตร ขนาด 65 มล.';
  const selected = chooseBestCardHeaderText(broken, clear);
  assert.match(selected, /H&S|เฮดแอนด์โชว์เดอร์/u);
  assert.match(selected, /65\s*มล/u);
});

test('การ์ดที่ขาดแบรนด์หรือขนาดถูกเลือกให้อ่านหัวขวาบนใหม่', () => {
  assert.equal(shouldRefreshCardHeader(card('ขนาดใหญ่ ๑ แพ็ค 1 แถม 1')), true);
  assert.equal(shouldRefreshCardHeader(card('H&S แชมพู 140 มล. ขวด')), false);
});
