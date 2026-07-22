import test from 'node:test';
import assert from 'node:assert/strict';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { assignCardsManually, unassignCardsManually } from '../../src/promo-new/domain/manual-grouping';
import { createDemoDataset } from '../../src/promo-new/shared/demo-data';

const MONTH = 'TEST-2026-07';

function imported(productText: string, classId: string, page: number): ImportedCardCandidate {
  return {
    cardId: `card:${classId}:${page}`,
    monthKey: MONTH,
    page,
    sequence: 1,
    classId,
    imageUrl: 'data:image/webp;base64,AA==',
    rawText: productText,
    productText,
    pageClassText: classId,
    confidence: 0.9,
    evidenceMethod: 'pdf_text',
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    failureReasons: [],
  };
}

function datasetWith(productTexts: Array<[string, string]>) {
  const grouped = groupImportedCards(MONTH, productTexts.map(([text, classId], index) => imported(text, classId, index + 1)));
  const demo = createDemoDataset('draft');
  return {
    grouped,
    dataset: {
      ...demo,
      version: { ...demo.version, monthKey: MONTH },
      skus: grouped.skus,
      prices: grouped.prices,
      cards: grouped.cards,
      productGroups: grouped.groups,
      promotionFamilies: [],
    },
  };
}

test('manual grouping merges cards and converts quarantine evidence', () => {
  const { grouped, dataset } = datasetWith([
    ['Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS'],
    ['Rejoice แชมพู Rich 120 มล. ขวด', 'HFSM'],
  ]);
  const target = grouped.groups[0];
  const source = grouped.groups[1];
  const unresolved = imported('', 'HFSL', 3);
  unresolved.failureReasons = ['product_text_missing'];

  const result = assignCardsManually(dataset, [unresolved], [source.cardIds[0], unresolved.cardId], { groupId: target.id });

  assert.equal(result.dataset.productGroups.length, 1);
  assert.equal(result.dataset.cards.length, 3);
  assert.deepEqual(result.dataset.productGroups[0].classIds, ['HFSL', 'HFSM', 'HFSS']);
  assert.equal(result.quarantine.length, 0);
  assert.ok(result.dataset.cards.every(card => card.productGroupId === target.id));
  assert.ok(result.dataset.cards.filter(card => card.id !== target.cardIds[0]).every(card => card.evidence.method === 'manual'));
});

test('manual grouping allows multiple cards from the same Class without duplicating a card ID', () => {
  const { grouped, dataset } = datasetWith([
    ['Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS'],
    ['Rejoice แชมพู Rich 120 มล. ขวด', 'HFSS'],
  ]);
  const target = grouped.groups[0];
  const source = grouped.groups[1];

  const result = assignCardsManually(dataset, [], [source.cardIds[0]], { groupId: target.id });
  const group = result.dataset.productGroups[0];

  assert.equal(result.dataset.productGroups.length, 1);
  assert.equal(group.cardIds.length, 2);
  assert.equal(new Set(group.cardIds).size, 2);
  assert.deepEqual(group.classIds, ['HFSS']);
  assert.ok(group.failureReasons.every(reason => !reason.startsWith('duplicate_class:')));
});

test('manual unassign moves selected cards back to quarantine and removes an empty source group', () => {
  const { grouped, dataset } = datasetWith([
    ['Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS'],
    ['Rejoice แชมพู Rich 120 มล. ขวด', 'HFSM'],
  ]);
  const removedId = grouped.groups[1].cardIds[0];

  const result = unassignCardsManually(dataset, [], [removedId]);

  assert.equal(result.dataset.cards.length, 1);
  assert.equal(result.dataset.productGroups.length, 1);
  assert.equal(result.quarantine.length, 1);
  assert.equal(result.quarantine[0].cardId, removedId);
  assert.deepEqual(result.quarantine[0].failureReasons, ['manual_unassigned']);
});
