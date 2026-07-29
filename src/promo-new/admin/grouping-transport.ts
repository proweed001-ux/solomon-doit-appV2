import type { GroupingResult } from '../domain/grouping';
import type { PromoCard } from '../domain/types';
import type { ImportedCardCandidate } from '../import/pdf-importer';

export interface PreparedWorkerCards {
  cards: ImportedCardCandidate[];
  imagesByPosition: Record<string, string>;
}

function positionKey(page: number, sequence: number): string {
  return `${page}:${sequence}`;
}

export function prepareGroupingWorkerCards(cards: ImportedCardCandidate[]): PreparedWorkerCards {
  const imagesByPosition: Record<string, string> = {};
  const lightweightCards = cards.map(card => {
    const key = positionKey(card.page, card.sequence);
    if (Object.prototype.hasOwnProperty.call(imagesByPosition, key)) {
      throw new Error(`duplicate_card_position:${key}`);
    }
    imagesByPosition[key] = card.imageUrl;
    return { ...card, imageUrl: '' };
  });
  return { cards: lightweightCards, imagesByPosition };
}

export function restoreGroupingResultImages(
  result: GroupingResult,
  imagesByPosition: Record<string, string>,
): GroupingResult {
  if (!result || !Array.isArray(result.cards) || !Array.isArray(result.quarantineCards)) {
    throw new Error('grouping_worker_invalid_result');
  }
  const expectedPositions = Object.keys(imagesByPosition);
  const returned = [
    ...result.cards.map(card => ({ id: card.id, key: positionKey(card.page, card.sequence) })),
    ...result.quarantineCards.map(card => ({ id: card.cardId, key: positionKey(card.page, card.sequence) })),
  ];
  if (returned.length !== expectedPositions.length) {
    throw new Error(`grouping_worker_card_count_mismatch:${returned.length}/${expectedPositions.length}`);
  }
  const returnedIds = returned.map(item => item.id);
  if (new Set(returnedIds).size !== returnedIds.length) throw new Error('grouping_worker_duplicate_card_id');
  const returnedPositions = returned.map(item => item.key);
  if (new Set(returnedPositions).size !== returnedPositions.length) throw new Error('grouping_worker_duplicate_card_position');
  const expected = new Set(expectedPositions);
  const unexpected = returnedPositions.find(key => !expected.has(key));
  if (unexpected) throw new Error(`grouping_worker_unexpected_card_position:${unexpected}`);
  const returnedSet = new Set(returnedPositions);
  const missing = expectedPositions.find(key => !returnedSet.has(key));
  if (missing) throw new Error(`grouping_worker_missing_card_position:${missing}`);

  const restorePromoCard = (card: PromoCard): PromoCard => {
    const key = positionKey(card.page, card.sequence);
    if (!Object.prototype.hasOwnProperty.call(imagesByPosition, key)) throw new Error(`grouping_worker_image_not_found:${key}`);
    return { ...card, imageUrl: imagesByPosition[key] };
  };
  const restoreCandidate = (card: ImportedCardCandidate): ImportedCardCandidate => {
    const key = positionKey(card.page, card.sequence);
    if (!Object.prototype.hasOwnProperty.call(imagesByPosition, key)) throw new Error(`grouping_worker_image_not_found:${key}`);
    return { ...card, imageUrl: imagesByPosition[key] };
  };
  return {
    ...result,
    cards: result.cards.map(restorePromoCard),
    quarantineCards: result.quarantineCards.map(restoreCandidate),
  };
}
