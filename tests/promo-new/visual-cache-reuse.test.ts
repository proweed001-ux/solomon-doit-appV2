import assert from 'node:assert/strict';
import test from 'node:test';
import { exactCachedVisualSignatures } from '../../src/promo-new/domain/visual-consensus';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

const card = (id: string, image: string): ImportedCardCandidate => ({
  cardId: id,
  monthKey: 'PROMO-2026-07',
  page: 1,
  sequence: 1,
  classId: 'HFSS',
  imageUrl: image,
  rawText: '',
  productText: '',
  pageClassText: '',
  confidence: 0.8,
  evidenceMethod: 'page_ocr',
  bounds: { x: 0, y: 0, width: 10, height: 10 },
  failureReasons: [],
});

test('ใช้ลายนิ้วมือจากแคชทันทีเมื่อ Card ID รูป และ signature ตรงกันครบ', () => {
  const current = [card('A', 'data:image/webp;base64,AAA')];
  const stored = [card('A', 'data:image/webp;base64,AAA')];
  const signature = 'ab'.repeat(32);
  assert.deepEqual(exactCachedVisualSignatures(current, stored, { A: signature }), { A: signature });
});

test('ไม่ใช้ลายนิ้วมือเก่าเมื่อรูป จำนวนการ์ด หรือ signature ไม่ตรง', () => {
  const current = [card('A', 'data:image/webp;base64,AAA')];
  const stored = [card('A', 'data:image/webp;base64,BBB')];
  assert.equal(exactCachedVisualSignatures(current, stored, { A: 'ab'.repeat(32) }), null);
  assert.equal(exactCachedVisualSignatures(current, current, { A: '' }), null);
  assert.equal(exactCachedVisualSignatures(current, current, { A: 'invalid' }), null);
  assert.equal(exactCachedVisualSignatures(current, [], { A: 'ab'.repeat(32) }), null);
});
