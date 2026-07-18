import type { GroupingResult } from '../domain/grouping';
import { shouldRefreshCardHeader } from '../import/card-header-ocr';
import type { ImportedCardCandidate } from '../import/pdf-importer';

export interface AdaptiveHeaderOcrSelection {
  targetIds: Set<string>;
  unresolvedTargets: number;
  candidateTargets: number;
  skippedByExistingKnowledge: number;
}

export function selectAdaptiveHeaderOcrTargets(
  cards: ImportedCardCandidate[],
  preflight: GroupingResult,
): AdaptiveHeaderOcrSelection {
  const byId = new Map(cards.map(card => [card.cardId, card]));
  const targetIds = new Set<string>();
  let unresolvedTargets = 0;
  let candidateTargets = 0;

  for (const card of preflight.quarantineCards) {
    if (!byId.has(card.cardId)) continue;
    targetIds.add(card.cardId);
    unresolvedTargets += 1;
  }

  for (const group of preflight.groups) {
    if (group.sku.status === 'active') continue;
    for (const cardId of group.cardIds) {
      const card = byId.get(cardId);
      if (!card || !shouldRefreshCardHeader(card) || targetIds.has(cardId)) continue;
      targetIds.add(cardId);
      candidateTargets += 1;
    }
  }

  return {
    targetIds,
    unresolvedTargets,
    candidateTargets,
    skippedByExistingKnowledge: Math.max(0, cards.length - targetIds.size),
  };
}
