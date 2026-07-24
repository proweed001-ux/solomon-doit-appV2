import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assignClassToPage } from '../../src/promo-new/domain/manual-class';
import type { PromoDataset } from '../../src/promo-new/domain/types';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';

const dataset = (): PromoDataset => ({
  schema: 'promo-system-rebuild-v1',
  version: {
    id: 'version-test',
    monthKey: 'PROMO-2026-07',
    revision: 1,
    status: 'need_review',
    previousVersionId: null,
    source: { pdfName: 'test.pdf', workbookName: 'test.xlsm', pdfHash: null, workbookHash: null },
    createdAt: '2026-07-24T00:00:00.000Z',
    createdBy: null,
    publishedAt: null,
  },
  skus: [],
  prices: [],
  cards: [],
  productGroups: [],
  promotionFamilies: [],
  warnings: [],
});

const candidate = (cardId: string, page: number, classId: string | null): ImportedCardCandidate => ({
  cardId,
  monthKey: 'PROMO-2026-07',
  page,
  sequence: 1,
  classId,
  imageUrl: 'data:image/webp;base64,AA==',
  rawText: '',
  productText: '',
  pageClassText: '',
  confidence: 0.7,
  evidenceMethod: 'none',
  bounds: { x: 1, y: 1, width: 100, height: 100 },
  failureReasons: classId ? ['manual_grouping_required'] : ['class_missing', 'manual_grouping_required'],
});

test('manual page override assigns WS-S to every unassigned card on that page only', () => {
  const quarantine = [candidate('card-10-a', 10, 'HFSS'), candidate('card-10-b', 10, null), candidate('card-11', 11, 'HFSWS-L')];
  const result = assignClassToPage(dataset(), quarantine, 10, 'HFSWS-S');
  assert.equal(result.changedCards, 2);
  assert.deepEqual(result.quarantine.map(card => card.classId), ['HFSWS-S', 'HFSWS-S', 'HFSWS-L']);
  assert.equal(result.quarantine[1].failureReasons.includes('class_missing'), false);
});

test('manual workbench exposes page-level Class correction controls', () => {
  const source = fs.readFileSync('src/promo-new/admin/manual-workbench.tsx', 'utf8');
  assert.match(source, /data-testid="page-class-page"/u);
  assert.match(source, /data-testid="page-class-value"/u);
  assert.match(source, /data-testid="apply-page-class"/u);
});
