import type { GroupingResult } from '../domain/grouping';
import { enrichCardHeadersFromImages, shouldRefreshCardHeader } from '../import/card-header-ocr';
import type { ImportedCardCandidate } from '../import/pdf-importer';

export interface AdaptiveHeaderOcrSelection {
  targetIds: Set<string>;
  unresolvedTargets: number;
  candidateTargets: number;
  skippedByExistingKnowledge: number;
  unresolvedWithoutOcrBenefit: number;
}

export function selectAdaptiveHeaderOcrTargets(
  cards: ImportedCardCandidate[],
  preflight: GroupingResult,
): AdaptiveHeaderOcrSelection {
  const byId = new Map(cards.map(card => [card.cardId, card]));
  const targetIds = new Set<string>();
  let unresolvedTargets = 0;
  let unresolvedWithoutOcrBenefit = 0;

  for (const unresolved of preflight.quarantineCards) {
    const card = byId.get(unresolved.cardId);
    if (!card) continue;
    if (!shouldRefreshCardHeader(card)) {
      unresolvedWithoutOcrBenefit += 1;
      continue;
    }
    targetIds.add(card.cardId);
    unresolvedTargets += 1;
  }

  return {
    targetIds,
    unresolvedTargets,
    candidateTargets: 0,
    skippedByExistingKnowledge: Math.max(0, cards.length - targetIds.size),
    unresolvedWithoutOcrBenefit,
  };
}

export async function enrichAdaptiveCardHeaders(
  cards: ImportedCardCandidate[],
  targetIds: ReadonlySet<string>,
  onProgress?: (completed: number, total: number) => void,
): Promise<{ cards: ImportedCardCandidate[]; attempted: number; improved: number; warnings: string[] }> {
  if (!targetIds.size) {
    return {
      cards,
      attempted: 0,
      improved: 0,
      warnings: ['adaptive_header_ocr_skipped:no_targets'],
    };
  }

  const selected = cards.filter(card => targetIds.has(card.cardId));
  const enriched = await enrichCardHeadersFromImages(selected, onProgress);
  const enrichedById = new Map(enriched.cards.map(card => [card.cardId, card]));
  return {
    cards: cards.map(card => enrichedById.get(card.cardId) || card),
    attempted: enriched.attempted,
    improved: enriched.improved,
    warnings: [...new Set([
      ...enriched.warnings,
      `adaptive_header_ocr_targets:${targetIds.size}`,
      `adaptive_header_ocr_attempted:${enriched.attempted}`,
      `adaptive_header_ocr_improved:${enriched.improved}`,
    ])],
  };
}
