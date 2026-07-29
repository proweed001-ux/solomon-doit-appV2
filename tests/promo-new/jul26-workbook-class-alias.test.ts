import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePromotionMatrix } from '../../src/promo-new/import/workbook-parser';
import { splitClassIds } from '../../src/promo-new/import/promotion-parser';

test('JUL26 HFSM,HFS-WH channel collapses to one HFSM tier without creating WH Class', () => {
  assert.deepEqual(splitClassIds('HFSM,HFS-WH'), ['HFSM']);
  assert.deepEqual(splitClassIds('HFS-WH'), ['HFSM']);

  const parsed = parsePromotionMatrix([
    ['Description'],
    ['แพนทีน ทรีทเมนต์ ซอง (คอลลาเจน,ไบโอติน,เคราติน) ขั้นต่ำ 6 ชิ้น ลด 10% [เฉพาะช่องทาง HFSM,HFS-WH]'],
    ['ดาวน์นี่ ปรับผ้านุ่ม สูตรเบส,เอ็กเพิร์ท,เคนโซ่ ซอง ขั้นต่ำ 1แพ็ค(24 ชิ้น) ลด 13% [เฉพาะช่องทาง HFS-WH]'],
  ], 'JUL26');

  assert.equal(parsed.families.length, 2);
  for (const family of parsed.families) {
    assert.deepEqual(Object.keys(family.tiersByClass), ['HFSM']);
    assert.equal(family.tiersByClass.HFSM.length > 0, true);
    assert.equal(Object.keys(family.tiersByClass).includes('HFS-WH'), false);
  }
});
