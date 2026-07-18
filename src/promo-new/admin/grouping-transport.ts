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
    if (Object.prototype.hasOwnProperty.call(imagesByPosition, key) && imagesByPosition[key] !== card.imageUrl) {
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
  const restorePromoCard = (card: PromoCard): PromoCard => ({
    ...card,
    imageUrl: imagesByPosition[positionKey(card.page, card.sequence)] || '',
  });
  const restoreCandidate = (card: ImportedCardCandidate): ImportedCardCandidate => ({
    ...card,
    imageUrl: imagesByPosition[positionKey(card.page, card.sequence)] || '',
  });
  return {
    ...result,
    cards: result.cards.map(restorePromoCard),
    quarantineCards: result.quarantineCards.map(restoreCandidate),
  };
}
