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

test('JUL26 Header sheet recognizes InitiativeID beside Description', () => {
  const parsed = parsePromotionMatrix([
    ['InitiativeID', 'Object', 'Description', 'FromDate', 'ToDate', 'TotalCustCount', 'PriceType', 'PONumber'],
    ['202607-003', null, 'แพนทีน ทรีทเมนต์ ซอง (คอลลาเจน,ไบโอติน,เคราติน) ขั้นต่ำ 6 ชิ้น ลด 10% [เฉพาะช่องทาง HFSS]', '07/01/2026 00:00', '07/31/2026 00:00', null, 'P', null],
    ['202607-006', null, 'แพนทีน ทรีทเมนต์ ซอง (คอลลาเจน,ไบโอติน,เคราติน) ขั้นต่ำ 6 ชิ้น ลด 10% [เฉพาะช่องทาง HFSM,HFS-WH]', '07/01/2026 00:00', '07/31/2026 00:00', null, 'P', null],
    ['202607-007', null, 'H&S แชมพู 60-65 มล / PT แชมพูและครีมนวด 60-70 มล / รีจ้อยส์ แชมพูและครีมนวด 60-70 มล ทุกสูตร ขั้นต่ำ 6 ขวด ลด 10% , ขั้นต่ำ 12 ขวด ลด 17% , ขั้นต่ำ 24 ขวด ลด 20% [เฉพาะช่องทาง HFSL]', '07/01/2026 00:00', '07/31/2026 00:00', null, 'P', null],
  ], 'Header');

  assert.equal(parsed.headerRow, 0);
  assert.equal(parsed.acceptedRows, 3);
  assert.equal(parsed.families.length, 3);
  assert.deepEqual(parsed.warnings, []);
  assert.deepEqual(parsed.families.map(family => family.sourceRows), [[2], [3], [4]]);
  assert.deepEqual(parsed.families.map(family => Object.keys(family.tiersByClass)), [['HFSS'], ['HFSM'], ['HFSL']]);
  assert.deepEqual(parsed.families.map(family => Object.values(family.tiersByClass).flat().length), [1, 1, 3]);
  assert.equal(new Set(parsed.families.map(family => family.familyKey)).size, 3);
});
