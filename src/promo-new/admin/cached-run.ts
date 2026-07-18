import { recoverCachedCardClasses } from '../domain/class-recovery';
import type { PdfImportResult } from '../import/pdf-importer';

export interface PreparedCachedRun {
  imported: PdfImportResult;
  visualSignatures: Record<string, string>;
  warnings: string[];
  changedClasses: number;
  recoveredPages: number;
}

export function visualSignaturesComplete(
  imported: PdfImportResult,
  visualSignatures: Record<string, string> | null,
): visualSignatures is Record<string, string> {
  if (!visualSignatures || imported.cards.length === 0) return false;
  return imported.cards.every(card => Object.prototype.hasOwnProperty.call(visualSignatures, card.cardId));
}

export function prepareCachedRun(
  importedInput: PdfImportResult,
  visualSignaturesInput: Record<string, string>,
): PreparedCachedRun {
  const imported: PdfImportResult = {
    ...importedInput,
    cards: importedInput.cards.map(card => ({
      ...card,
      bounds: { ...card.bounds },
      failureReasons: [...card.failureReasons],
    })),
    warnings: [...importedInput.warnings],
  };
  const visualSignatures = { ...visualSignaturesInput };
  const recovery = recoverCachedCardClasses(imported.cards, visualSignatures);
  imported.warnings = [...new Set([...imported.warnings, ...recovery.warnings])];

  return {
    imported,
    visualSignatures,
    warnings: [
      `cache:class_recovered_cards:${recovery.changedCards}`,
      `cache:class_recovered_pages:${recovery.recoveredPages}`,
    ],
    changedClasses: recovery.changedCards,
    recoveredPages: recovery.recoveredPages,
  };
}
