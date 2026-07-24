import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROMO_CLASS_IDS,
  classifyClassText,
  classifyPageClassText,
  normalizeClassId,
  resolvePageClassSequence,
  type PageClassObservation,
} from '../../src/promo-new/import/class-id';

test('promotion Class เป็นระบบปิดเพียงหกค่า ไม่มี WH เป็น Class', () => {
  assert.deepEqual(PROMO_CLASS_IDS, ['HFSS', 'HFSM', 'HFSL', 'HFSXL', 'HFSWS-S', 'HFSWS-L']);
  assert.equal(PROMO_CLASS_IDS.includes('HFSWH' as never), false);
});

test('อ่านหัว Class จริงทั้งหกแบบแม้มีข้อความอื่นต่อท้าย', () => {
  assert.equal(normalizeClassId('สำหรับร้าน HFS-S โปรโมชั่นคุ้มเวอร์'), 'HFSS');
  assert.equal(normalizeClassId('สำหรับร้าน HFS-M PROMOTION JULY'), 'HFSM');
  assert.equal(normalizeClassId('สำหรับร้าน HFS-L เดือนกรกฎาคม'), 'HFSL');
  assert.equal(normalizeClassId('สำหรับร้าน HFS-XL PAGE 1'), 'HFSXL');
  assert.equal(normalizeClassId('สำหรับร้าน HFS-WS-S'), 'HFSWS-S');
  assert.equal(normalizeClassId('สำหรับร้าน HFS-WS-L'), 'HFSWS-L');
});

test('อ่าน Class จากข้อความส่วนอื่นของหน้าเมื่อหัวซ้ายบนไม่มี Class', () => {
  const evidence = classifyPageClassText(
    ['PROMOTION JULY 2026'],
    ['ชื่อสินค้าและเงื่อนไขโปรโมชั่น', 'สำหรับร้าน HFS-WS-L'],
  );
  assert.equal(evidence.classId, 'HFSWS-L');
  assert.ok(evidence.confidence >= 0.9);
});

test('หัว Class ที่ชัดเจนมีสิทธิ์สูงกว่าข้อความ HFS อื่นในเนื้อหาหน้า', () => {
  const evidence = classifyPageClassText(
    ['สำหรับร้าน HFS-M'],
    ['ข้อความอ้างอิง HFS-L ในรายละเอียดสินค้า'],
  );
  assert.equal(evidence.classId, 'HFSM');
});

test('อ่านคำเรียก Class ภาษาไทยที่ใช้จริงบนหัวเอกสาร', () => {
  assert.equal(normalizeClassId('ร้านค้าขนาด M'), 'HFSM');
  assert.equal(normalizeClassId('คลาส WS-L'), 'HFSWS-L');
  assert.equal(normalizeClassId('ประเภท XL'), 'HFSXL');
});

test('M ที่ OCR แตกเป็น WH H N IV ยังกลับเป็น HFSM โดยไม่สร้าง Class ใหม่', () => {
  for (const value of ['HFS-WH', 'HFS-H', 'HFS-N', 'HFS-IV', 'Class M', 'M']) {
    const evidence = classifyClassText(value);
    assert.equal(evidence.classId, 'HFSM', value);
    assert.ok(evidence.confidence >= 0.72, `${value}:${evidence.confidence}`);
  }
});

test('WS-S และ WS-L ไม่ถูกยุบเป็น M แม้ OCR ตัวท้ายเพี้ยน', () => {
  assert.equal(normalizeClassId('HFS-WS-S'), 'HFSWS-S');
  assert.equal(normalizeClassId('HFS-WS-L'), 'HFSWS-L');
  assert.equal(normalizeClassId('HFS-WS-5'), 'HFSWS-S');
  assert.equal(normalizeClassId('HFS-WS-1'), 'HFSWS-L');
});

test('ข้อความที่ไม่มีหลักฐาน Class ไม่ถูกเดาเป็น S หรือ M', () => {
  assert.equal(normalizeClassId('PROMOTION JULY 2026 PAGE 4'), null);
  assert.equal(normalizeClassId('HEAD AND SHOULDERS SHAMPOO 140 ML'), null);
});

test('ลำดับหน้าแยกช่วง Class ได้เมื่อจำนวนหน้าต่อ Class ไม่เท่ากัน', () => {
  const observations: PageClassObservation[] = [
    { page: 1, texts: ['สำหรับร้าน HFS-S'], headerColor: [25, 80, 175], hasCards: true },
    { page: 2, texts: ['HFS-S'], headerColor: [27, 82, 173], hasCards: true },
    { page: 3, texts: ['HFS-WH'], headerColor: [20, 155, 95], hasCards: true },
    { page: 4, texts: ['HFS-N'], headerColor: [22, 157, 96], hasCards: true },
    { page: 5, texts: ['อ่านหัวไม่ชัด'], headerColor: [21, 156, 94], hasCards: true },
    { page: 6, texts: ['HFS-L'], headerColor: [235, 83, 25], hasCards: true },
    { page: 7, texts: ['HFS-L'], headerColor: [233, 85, 26], hasCards: true },
    { page: 8, texts: ['HFS-XL'], headerColor: [150, 55, 145], hasCards: true },
    { page: 9, texts: ['HFS-XL'], headerColor: [151, 54, 143], hasCards: true },
    { page: 10, texts: ['HFS-WS-S'], headerColor: [220, 20, 105], hasCards: true },
    { page: 11, texts: [''], headerColor: [218, 22, 104], hasCards: true },
    { page: 12, texts: ['HFS-WS-L'], headerColor: [25, 150, 125], hasCards: true },
  ];
  const resolved = resolvePageClassSequence(observations);
  assert.deepEqual(resolved.map(item => item.classId), [
    'HFSS', 'HFSS',
    'HFSM', 'HFSM', 'HFSM',
    'HFSL', 'HFSL',
    'HFSXL', 'HFSXL',
    'HFSWS-S', 'HFSWS-S',
    'HFSWS-L',
  ]);
  assert.equal(resolved[4].method, 'sequence');
  assert.equal(resolved[10].method, 'sequence');
});

test('ระบบไม่ผูก Class M กับเลขหน้า 4-6', () => {
  const observations: PageClassObservation[] = [
    { page: 1, texts: ['HFS-S'], headerColor: [25, 80, 175], hasCards: true },
    { page: 2, texts: ['HFS-M'], headerColor: [20, 155, 95], hasCards: true },
    { page: 3, texts: ['HFS-M'], headerColor: [20, 155, 95], hasCards: true },
    { page: 4, texts: ['HFS-M'], headerColor: [20, 155, 95], hasCards: true },
    { page: 5, texts: ['HFS-M'], headerColor: [20, 155, 95], hasCards: true },
    { page: 6, texts: ['HFS-L'], headerColor: [235, 83, 25], hasCards: true },
  ];
  assert.deepEqual(resolvePageClassSequence(observations).map(item => item.classId), [
    'HFSS', 'HFSM', 'HFSM', 'HFSM', 'HFSM', 'HFSL',
  ]);
});
