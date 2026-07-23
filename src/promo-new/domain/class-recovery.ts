import type { ImportedCardCandidate } from '../import/pdf-importer';
import { resolvePageClassSequence, type PageClassObservation } from '../import/class-id';

export interface CardClassRecoveryResult {
  changedCards: number;
  recoveredPages: number;
  warnings: string[];
}

export function recoverCachedCardClasses<T>(
  cards: ImportedCardCandidate[],
  visualSignatures: Record<string, T> = {},
): CardClassRecoveryResult {
  const cardsByPage = new Map<number, ImportedCardCandidate[]>();
  for (const card of cards) {
    const pageCards = cardsByPage.get(card.page) || [];
    pageCards.push(card);
    cardsByPage.set(card.page, pageCards);
  }

  const observations: PageClassObservation[] = [...cardsByPage.entries()]
    .sort(([left], [right]) => left - right)
    .map(([page, pageCards]) => {
      const pageTexts = [...new Set(pageCards.map(card => card.pageClassText).filter(Boolean))];
      if (!pageTexts.length) pageTexts.push(...new Set(pageCards.map(card => card.classId).filter((value): value is string => Boolean(value))));
      return { page, texts: pageTexts, hasCards: pageCards.length > 0 };
    });

  const resolved = resolvePageClassSequence(observations);
  const resolvedByPage = new Map(resolved.map(item => [item.page, item]));
  const warnings: string[] = [];
  let changedCards = 0;
  const recoveredPages = new Set<number>();

  for (const card of cards) {
    const pageClass = resolvedByPage.get(card.page);
    if (!pageClass?.classId || card.classId === pageClass.classId) continue;
    const oldId = card.cardId;
    const oldClass = card.classId;
    card.classId = pageClass.classId;
    card.failureReasons = card.failureReasons.filter(reason => reason !== 'class_missing');
    changedCards += 1;
    recoveredPages.add(card.page);
    warnings.push(`card:${oldId}:class_recovered:${oldClass || 'missing'}->${card.classId}`);
  }

  return { changedCards, recoveredPages: recoveredPages.size, warnings };
}
