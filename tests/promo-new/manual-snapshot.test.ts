import test from 'node:test';
import assert from 'node:assert/strict';
import type { ImportedCardCandidate } from '../../src/promo-new/import/pdf-importer';
import { groupImportedCards } from '../../src/promo-new/domain/grouping';
import { hydrateManualGroupingSnapshot, type PromoGroupingSnapshot } from '../../src/promo-new/domain/manual-snapshot';
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

function fixture() {
  const grouped = groupImportedCards(MONTH, [
    imported('Pantene แชมพู Aqua 70 มล. ขวด', 'HFSS', 1),
    imported('Rejoice แชมพู Rich 120 มล. ขวด', 'HFSM', 2),
  ]);
  const masterSkus = grouped.skus.map(sku => ({ ...sku, status: 'active' as const }));
  const demo = createDemoDataset('draft');
  const dataset = {
    ...demo,
    version: { ...demo.version, monthKey: MONTH },
    skus: masterSkus,
    prices: grouped.prices,
    cards: grouped.cards,
    productGroups: grouped.groups.map(group => ({
      ...group,
      sku: masterSkus.find(sku => sku.id === group.skuId) || group.sku,
    })),
    promotionFamilies: [],
  };
  return { dataset, masterSkus };
}

test('saved grouping restores by stable card ID and restores confirmations', () => {
  const { dataset, masterSkus } = fixture();
  const snapshot: PromoGroupingSnapshot = {
    promoMonthId: MONTH,
    cardCount: dataset.cards.length,
    groups: dataset.productGroups.map(group => ({
      skuId: group.skuId,
      cardIds: [...group.cardIds],
      confirmed: true,
    })),
  };

  const restored = hydrateManualGroupingSnapshot(dataset, [], snapshot, masterSkus);

  assert.equal(restored.quarantine.length, 0);
  assert.equal(restored.dataset.cards.length, dataset.cards.length);
  assert.ok(restored.dataset.productGroups.every(group => group.manualConfirmed === true));
  assert.deepEqual(
    restored.dataset.productGroups.flatMap(group => group.cardIds).sort(),
    dataset.cards.map(card => card.id).sort(),
  );
});

test('saved grouping rejects a stale or incomplete card set', () => {
  const { dataset, masterSkus } = fixture();
  const snapshot: PromoGroupingSnapshot = {
    promoMonthId: MONTH,
    cardCount: 1,
    groups: [{
      skuId: dataset.productGroups[0].skuId,
      cardIds: [dataset.cards[0].id],
      confirmed: true,
    }],
  };

  assert.throws(
    () => hydrateManualGroupingSnapshot(dataset, [], snapshot, masterSkus),
    /grouping_snapshot_card_mismatch/u,
  );
});
