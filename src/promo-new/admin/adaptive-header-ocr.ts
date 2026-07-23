import type { GroupingResult } from '../domain/grouping';
import type { ImportedCardCandidate } from '../import/pdf-importer';

export const SINGLE_PASS_OCR_ONLY = true as const;

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
  return {
    targetIds: new Set<string>(),
    unresolvedTargets: 0,
    candidateTargets: 0,
    skippedByExistingKnowledge: cards.length,
    unresolvedWithoutOcrBenefit: preflight.quarantineCards.length,
  };
}

export async function enrichAdaptiveCardHeaders(
  cards: ImportedCardCandidate[],
  targetIds: ReadonlySet<string>,
  _onProgress?: (completed: number, total: number) => void,
): Promise<{ cards: ImportedCardCandidate[]; attempted: number; improved: number; warnings: string[] }> {
  if (targetIds.size) throw new Error('second_pass_ocr_disabled_single_pass_mode');
  return {
    cards,
    attempted: 0,
    improved: 0,
    warnings: ['adaptive_header_ocr_disabled:single_pass_only'],
  };
}
